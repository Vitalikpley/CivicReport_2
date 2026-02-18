import { violationsAPI, isOnline } from './api';
import { fetchViolations, deleteViolation } from '../db/sqlite';
import { uploadImage } from './cloudinary';
import * as FileSystem from 'expo-file-system';


export const syncOfflineViolations = async () => {
    try {
        const online = await isOnline();
        if (!online) {
            console.log('[Sync] No internet connection, skipping sync');
            return { synced: 0, failed: 0 };
        }

        const localViolations = await fetchViolations();

        if (localViolations.length === 0) {
            console.log('[Sync] No local violations to sync');
            return { synced: 0, failed: 0 };
        }

        console.log(`[Sync] Found ${localViolations.length} local violations to sync`);

        const syncedIds = [];
        const failedIds = [];

        const violationsToSync = [];
        const localIdMap = new Map(); // Map<index_in_violationsToSync, localId>

        for (const localViolation of localViolations) {
            try {
                // Завантажуємо фото в Cloudinary
                let photoUrl = null;
                if (localViolation.photo_base64) {
                    try {
                        // Створюємо тимчасовий файл з base64
                        const base64Data = localViolation.photo_base64;
                        const mimeType = localViolation.photo_mime || 'image/jpeg';
                        const extension = mimeType.split('/')[1] || 'jpg';
                        const fileName = `violation_${localViolation.id}.${extension}`;
                        
                        // Зберігаємо base64 у тимчасовий файл
                        const tempUri = `${FileSystem.cacheDirectory}${fileName}`;
                        await FileSystem.writeAsStringAsync(tempUri, base64Data, {
                            encoding: FileSystem.EncodingType.Base64,
                        });

                        // Завантажуємо в Cloudinary
                        photoUrl = await uploadImage(tempUri, fileName, mimeType);
                        
                        // Видаляємо тимчасовий файл
                        await FileSystem.deleteAsync(tempUri, { idempotent: true });
                        
                        console.log(`[Sync] Photo uploaded for violation ${localViolation.id}`);
                    } catch (uploadErr) {
                        console.warn(`[Sync] Failed to upload photo for violation ${localViolation.id}:`, uploadErr);
                        // Продовжуємо без фото
                    }
                }

                if (photoUrl) {
                    const index = violationsToSync.length;
                    violationsToSync.push({
                        description: localViolation.description,
                        category: localViolation.category,
                        dateTime: localViolation.datetime,
                        photoUrl: photoUrl,
                        latitude: localViolation.latitude,
                        longitude: localViolation.longitude,
                    });
                    localIdMap.set(index, localViolation.id);
                } else {
                    console.warn(`[Sync] Skipping violation ${localViolation.id} - no photo URL`);
                    failedIds.push(localViolation.id);
                }
            } catch (err) {
                console.warn(`[Sync] Error processing violation ${localViolation.id}:`, err);
                failedIds.push(localViolation.id);
            }
        }

        if (violationsToSync.length === 0) {
            console.log('[Sync] No violations to sync after processing');
            return { synced: 0, failed: failedIds.length };
        }

        try {
            const response = await violationsAPI.sync(violationsToSync);
            console.log(`[Sync] Successfully synced ${violationsToSync.length} violations`);

            for (let i = 0; i < violationsToSync.length; i++) {
                const localId = localIdMap.get(i);
                if (localId && !failedIds.includes(localId)) {
                    await deleteViolation(localId);
                    syncedIds.push(localId);
                }
            }

            return { 
                synced: syncedIds.length, 
                failed: failedIds.length,
                syncedIds,
                failedIds 
            };
        } catch (syncErr) {
            console.error('[Sync] Failed to sync violations:', syncErr);
            return { synced: 0, failed: localViolations.length };
        }
    } catch (error) {
        console.error('[Sync] Sync error:', error);
        return { synced: 0, failed: 0 };
    }
};
