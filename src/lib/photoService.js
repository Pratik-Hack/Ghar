import {
  collection, doc, getDocs, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const PHOTOS_COLLECTION = "photos";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "ghar-photos");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await response.json();
  return {
    downloadUrl: data.secure_url,
    cloudinaryPublicId: data.public_id,
  };
}

export async function uploadPhoto(file, metadata) {
  const photoId = `photo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const { downloadUrl, cloudinaryPublicId } = await uploadToCloudinary(file);

  const photoDoc = {
    id: photoId,
    cloudinaryPublicId,
    downloadUrl,
    members: metadata.members || ["me"],
    occasion: metadata.occasion || "Random Day",
    year: parseInt(metadata.year) || new Date().getFullYear(),
    month: parseInt(metadata.month) || new Date().getMonth() + 1,
    day: parseInt(metadata.day) || new Date().getDate(),
    mood: metadata.mood || "Happy",
    caption: metadata.caption || "A beautiful memory",
    favorite: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, PHOTOS_COLLECTION, photoId), photoDoc);

  return { ...photoDoc, src: downloadUrl };
}

export async function fetchAllPhotos() {
  const q = query(
    collection(db, PHOTOS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return { ...data, src: data.downloadUrl };
  });
}

export async function updatePhotoDoc(photoId, updates) {
  const docRef = doc(db, PHOTOS_COLLECTION, photoId);
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
}

export async function deletePhotoFull(photoId) {
  // Note: Cloudinary images uploaded via unsigned preset can't be deleted from client.
  // They can be managed from the Cloudinary dashboard if needed.
  await deleteDoc(doc(db, PHOTOS_COLLECTION, photoId));
}
