
const CLOUDINARY_CLOUD_NAME = "dcayywgtr";
const UPLOAD_PRESET = "testtest";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

function getMimeType(fileName) {
    const ext = (fileName || "").split(".").pop()?.toLowerCase();
    const map = {
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
    };
    return map[ext] ?? "image/jpeg";
}

export async function uploadImage(uri, fileName, mimeType) {
    const name = fileName || uri.split("/").pop() || "photo.jpg";
    const type = mimeType || getMimeType(name);

    const formData = new FormData();
    formData.append("file", { uri, name, type });
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || "Upload failed");
    }
    if (!data.secure_url) {
        throw new Error("No secure_url in response");
    }

    return data.secure_url;
}