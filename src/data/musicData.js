// YouTube Video IDs for each song
// To find: search the song on YouTube, the ID is after "v=" in the URL
// e.g., https://www.youtube.com/watch?v=XXXXX → ID is XXXXX

export const playlists = {
  maa: {
    name: "Maa - Mother's Love",
    emoji: "🙏",
    color: "#E91E63",
    songs: [],
  },
  papa: {
    name: "Papa - Father's Pride",
    emoji: "👨‍👧",
    color: "#1565C0",
    songs: [],
  },
  sister: {
    name: "Sister - Bond of Love",
    emoji: "👫",
    color: "#9C27B0",
    songs: [],
  },
  family: {
    name: "Family / Home",
    emoji: "🏠",
    color: "#FF6F00",
    songs: [],
  },
  missingHome: {
    name: "Missing Home",
    emoji: "💔",
    color: "#5D4037",
    songs: [],
  },
  happy: {
    name: "Happy Family Moments",
    emoji: "🎉",
    color: "#FFD600",
    songs: [],
  },
};

export const festivalSongs = {
  diwali: [],
  holi: [],
  rakshaBandhan: [],
};

export const timeBasedPlaylists = {
  morning: { playlist: "happy", message: "Good Morning! Start the day with family love 🌅" },
  afternoon: { playlist: "family", message: "Afternoon warmth, just like home 🌤️" },
  evening: { playlist: "missingHome", message: "Evening thoughts drift home... 🌇" },
  lateNight: { playlist: "missingHome", message: "Late night... missing home a little extra tonight 🌙" },
};

export function getTimeBasedPlaylist() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return timeBasedPlaylists.morning;
  if (hour >= 12 && hour < 17) return timeBasedPlaylists.afternoon;
  if (hour >= 17 && hour < 23) return timeBasedPlaylists.evening;
  return timeBasedPlaylists.lateNight;
}

export function isNightMode() {
  const hour = new Date().getHours();
  return hour >= 23 || hour < 5;
}

export function getCurrentFestival() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Approximate dates — update yearly
  if (month === 10 && day >= 20 && day <= 25) return "diwali";
  if (month === 3 && day >= 10 && day <= 15) return "holi";
  if (month === 8 && day >= 15 && day <= 22) return "rakshaBandhan";
  return null;
}

export function getAllSongs() {
  const all = [];
  Object.values(playlists).forEach(pl => {
    pl.songs.forEach(s => all.push(s));
  });
  return all;
}

export function getSongById(id) {
  return getAllSongs().find(s => s.id === id);
}

export function getPlaylistForMember(member) {
  const map = { mother: "maa", father: "papa", sister: "sister", me: "family" };
  return map[member] || "family";
}
