import {
  collection, doc, getDocs, setDoc, updateDoc,
  arrayUnion, arrayRemove, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const PLAYLISTS_COLLECTION = "playlists";

export async function fetchPlaylists() {
  const snapshot = await getDocs(collection(db, PLAYLISTS_COLLECTION));
  const playlists = {};
  snapshot.docs.forEach((doc) => {
    playlists[doc.id] = doc.data();
  });
  return playlists;
}

export async function seedPlaylists(hardcodedPlaylists) {
  for (const [key, playlist] of Object.entries(hardcodedPlaylists)) {
    await setDoc(doc(db, PLAYLISTS_COLLECTION, key), {
      ...playlist,
      updatedAt: serverTimestamp(),
    });
  }
}

export async function addSongToPlaylist(playlistKey, song) {
  const docRef = doc(db, PLAYLISTS_COLLECTION, playlistKey);
  await updateDoc(docRef, {
    songs: arrayUnion(song),
    updatedAt: serverTimestamp(),
  });
}

export async function removeSongFromPlaylist(playlistKey, song) {
  const docRef = doc(db, PLAYLISTS_COLLECTION, playlistKey);
  await updateDoc(docRef, {
    songs: arrayRemove(song),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePlaylistSongs(playlistKey, songs) {
  const docRef = doc(db, PLAYLISTS_COLLECTION, playlistKey);
  await updateDoc(docRef, {
    songs,
    updatedAt: serverTimestamp(),
  });
}
