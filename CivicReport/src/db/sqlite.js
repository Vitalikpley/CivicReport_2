import * as SQLite from "expo-sqlite";

let db = null;
let initialized = false;

export const openDatabase = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync("lawful_citizen.db");
    }
    return db;
};

export const ensureViolationsTable = async () => {
    const database = await openDatabase();
    if (initialized) return;

    await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS offline_violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            datetime TEXT NOT NULL,
            photo_base64 TEXT NOT NULL,
            photo_mime TEXT NOT NULL,
            latitude REAL,
            longitude REAL
        );
    `);

    initialized = true;
};

export const fetchViolations = async () => {
    try {
        const database = await openDatabase();
        await ensureViolationsTable();
        return await database.getAllAsync(
            "SELECT * FROM offline_violations ORDER BY datetime(datetime) DESC"
        );
    } catch (e) {
        console.error("Error fetching violations:", e);
        return [];
    }
};

export const fetchViolationById = async (id) => {
    try {
        const database = await openDatabase();
        await ensureViolationsTable();
        return await database.getFirstAsync(
            "SELECT * FROM offline_violations WHERE id = ?",
            Number(id)
        );
    } catch (e) {
        console.error("Error fetching violation:", e);
        return null;
    }
};

export const insertViolation = async ({
    description,
    category,
    datetime,
    photoBase64,
    photoMime,
    latitude,
    longitude,
}) => {
    try {
        const database = await openDatabase();
        await ensureViolationsTable();
        const result = await database.runAsync(
            `INSERT INTO offline_violations (description, category, datetime, photo_base64, photo_mime, latitude, longitude)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            description.trim(),
            category,
            datetime ?? new Date().toISOString(),
            photoBase64,
            photoMime ?? "image/jpeg",
            latitude ?? null,
            longitude ?? null
        );
        return result;
    } catch (e) {
        console.error("Error inserting violation:", e);
        return null;
    }
};

export const deleteViolation = async (id) => {
    try {
        const database = await openDatabase();
        await ensureViolationsTable();
        await database.runAsync("DELETE FROM offline_violations WHERE id = ?", Number(id));
    } catch (e) {
        console.error("Error deleting violation:", e);
    }
};

export const createTable = ensureViolationsTable;


export async function initDb() {
    await openDatabase();
    await ensureViolationsTable();
}

export async function insertOfflineViolation({
    description,
    category,
    datetime,
    photoBase64,
    photoMime,
    latitude,
    longitude,
}) {
    const result = await insertViolation({
        description,
        category,
        datetime,
        photoBase64,
        photoMime,
        latitude,
        longitude,
    });
    return result?.lastInsertRowId ?? null;
}

export const getOfflineViolations = fetchViolations;
