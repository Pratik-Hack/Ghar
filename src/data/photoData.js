// Photo data store — managed by the app
// Each photo object: { id, src, members[], occasion, year, month, day, mood, caption, favorite }
//
// When you add real photos, place them in public/photos/ subfolders
// and add entries here OR use the in-app upload feature.

// Demo/placeholder photos — replace with real family photos
const demoPhotos = [
  {
    id: "demo_001",
    src: "/photos/family/family_diwali_2023.jpg",
    members: ["mother", "father", "sister", "me"],
    occasion: "Diwali",
    year: 2023,
    month: 11,
    day: 12,
    mood: "Festive",
    caption: "Diwali 2023 — together in Kolhapur, lights everywhere ✨",
    favorite: true,
  },
  {
    id: "demo_002",
    src: "/photos/family/family_trip_goa.jpg",
    members: ["mother", "father", "sister", "me"],
    occasion: "Family Trip",
    year: 2022,
    month: 5,
    day: 20,
    mood: "Happy",
    caption: "Our Goa trip — Papa finally relaxed! 🏖️",
    favorite: true,
  },
  {
    id: "demo_003",
    src: "/photos/mother/maa_cooking.jpg",
    members: ["mother"],
    occasion: "Random Day",
    year: 2023,
    month: 8,
    day: 15,
    mood: "Love",
    caption: "Maa making her special puran poli 🍲",
    favorite: true,
  },
  {
    id: "demo_004",
    src: "/photos/father/papa_morning_walk.jpg",
    members: ["father"],
    occasion: "Random Day",
    year: 2023,
    month: 3,
    day: 10,
    mood: "Peaceful",
    caption: "Papa on his morning walk — his daily meditation 🌅",
    favorite: false,
  },
  {
    id: "demo_005",
    src: "/photos/sister/sister_birthday.jpg",
    members: ["sister"],
    occasion: "Birthday",
    year: 2024,
    month: 7,
    day: 3,
    mood: "Happy",
    caption: "Sister's birthday — cake fight included! 🎂",
    favorite: true,
  },
  {
    id: "demo_006",
    src: "/photos/me/me_pune_balcony.jpg",
    members: ["me"],
    occasion: "Random Day",
    year: 2024,
    month: 1,
    day: 15,
    mood: "Emotional",
    caption: "Missing home from my Pune balcony 🌇",
    favorite: false,
  },
  {
    id: "demo_007",
    src: "/photos/family/holi_2023.jpg",
    members: ["mother", "father", "sister", "me"],
    occasion: "Holi",
    year: 2023,
    month: 3,
    day: 8,
    mood: "Fun",
    caption: "Holi colors — couldn't recognize each other! 🎨",
    favorite: true,
  },
  {
    id: "demo_008",
    src: "/photos/family/ganesh_chaturthi.jpg",
    members: ["mother", "father", "sister", "me"],
    occasion: "Ganesh Chaturthi",
    year: 2023,
    month: 9,
    day: 19,
    mood: "Festive",
    caption: "Ganpati Bappa Morya! 🙏🐘",
    favorite: true,
  },
  {
    id: "demo_009",
    src: "/photos/mother/maa_garden.jpg",
    members: ["mother"],
    occasion: "Random Day",
    year: 2024,
    month: 2,
    day: 14,
    mood: "Peaceful",
    caption: "Maa in her garden — her happy place 🌺",
    favorite: false,
  },
  {
    id: "demo_010",
    src: "/photos/family/raksha_bandhan_2023.jpg",
    members: ["sister", "me"],
    occasion: "Raksha Bandhan",
    year: 2023,
    month: 8,
    day: 30,
    mood: "Love",
    caption: "Rakhi 2023 — the thread of love that connects us 🪢",
    favorite: true,
  },
];

export default demoPhotos;

export function getPhotosByMember(photos, memberId) {
  return photos.filter(p => p.members.includes(memberId));
}

export function getPhotosByOccasion(photos, occasion) {
  return photos.filter(p => p.occasion === occasion);
}

export function getPhotosByYear(photos, year) {
  return photos.filter(p => p.year === year);
}

export function getPhotosByMood(photos, mood) {
  return photos.filter(p => p.mood === mood);
}

export function getFavorites(photos) {
  return photos.filter(p => p.favorite);
}

export function getOnThisDay(photos) {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return photos.filter(p => p.month === month && p.day === day);
}

export function getRandomPhoto(photos) {
  if (photos.length === 0) return null;
  return photos[Math.floor(Math.random() * photos.length)];
}

export function getYears(photos) {
  const years = [...new Set(photos.map(p => p.year))];
  return years.sort((a, b) => b - a);
}

export function getTimelineData(photos) {
  const sorted = [...photos].sort((a, b) => {
    const dateA = new Date(a.year, (a.month || 1) - 1, a.day || 1);
    const dateB = new Date(b.year, (b.month || 1) - 1, b.day || 1);
    return dateB - dateA;
  });

  const grouped = {};
  sorted.forEach(photo => {
    if (!grouped[photo.year]) grouped[photo.year] = [];
    grouped[photo.year].push(photo);
  });

  return grouped;
}
