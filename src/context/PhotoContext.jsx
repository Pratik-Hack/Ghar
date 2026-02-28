import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { uploadPhoto, updatePhotoDoc, deletePhotoFull } from "../lib/photoService";

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  // Real-time listener on photos collection
  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const photoList = snapshot.docs.map((d) => {
          const data = d.data();
          return { ...data, src: data.downloadUrl };
        });
        setPhotos(photoList);
        setFavorites(new Set(photoList.filter((p) => p.favorite).map((p) => p.id)));
        setLoading(false);
      },
      (error) => {
        console.error("Photos listener error:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const addPhoto = useCallback(async (photoWithFile) => {
    await uploadPhoto(photoWithFile.file, photoWithFile);
  }, []);

  const addPhotos = useCallback(async (photosWithFiles) => {
    await Promise.all(photosWithFiles.map((p) => uploadPhoto(p.file, p)));
  }, []);

  const updatePhoto = useCallback(async (id, updates) => {
    await updatePhotoDoc(id, updates);
  }, []);

  const deletePhoto = useCallback(
    async (id) => {
      await deletePhotoFull(id);
    },
    []
  );

  const toggleFavorite = useCallback(
    async (id) => {
      const photo = photos.find((p) => p.id === id);
      if (photo) {
        await updatePhotoDoc(id, { favorite: !photo.favorite });
      }
    },
    [photos]
  );

  const getFilteredPhotos = useCallback(
    ({ member, occasion, year, mood, favoritesOnly } = {}) => {
      let result = photos;
      if (member) result = result.filter((p) => p.members?.includes(member));
      if (occasion) result = result.filter((p) => p.occasion === occasion);
      if (year) result = result.filter((p) => p.year === parseInt(year));
      if (mood) result = result.filter((p) => p.mood === mood);
      if (favoritesOnly) result = result.filter((p) => p.favorite);
      return result;
    },
    [photos]
  );

  const getRandomPhoto = useCallback(
    (filter = {}) => {
      const filtered = getFilteredPhotos(filter);
      if (filtered.length === 0) return null;
      return filtered[Math.floor(Math.random() * filtered.length)];
    },
    [getFilteredPhotos]
  );

  const getOnThisDayPhotos = useCallback(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return photos.filter((p) => p.month === month && p.day === day);
  }, [photos]);

  const getTimelineData = useCallback(() => {
    const sorted = [...photos].sort((a, b) => {
      const dateA = new Date(a.year, (a.month || 1) - 1, a.day || 1);
      const dateB = new Date(b.year, (b.month || 1) - 1, b.day || 1);
      return dateB - dateA;
    });
    const grouped = {};
    sorted.forEach((photo) => {
      if (!grouped[photo.year]) grouped[photo.year] = [];
      grouped[photo.year].push(photo);
    });
    return grouped;
  }, [photos]);

  const getYears = useCallback(() => {
    return [...new Set(photos.map((p) => p.year))].sort((a, b) => b - a);
  }, [photos]);

  return (
    <PhotoContext.Provider
      value={{
        photos,
        loading,
        favorites,
        addPhoto,
        addPhotos,
        updatePhoto,
        deletePhoto,
        toggleFavorite,
        getFilteredPhotos,
        getRandomPhoto,
        getOnThisDayPhotos,
        getTimelineData,
        getYears,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotos() {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error("usePhotos must be used within PhotoProvider");
  return ctx;
}
