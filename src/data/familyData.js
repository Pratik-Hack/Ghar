export const familyMembers = {
  mother: {
    id: "mother",
    name: "Mammy",
    nameEnglish: "Mother",
    relation: "Mother",
    emoji: "🙏",
    color: "#E91E63",
    gradientFrom: "#E91E63",
    gradientTo: "#F48FB1",
    playlist: "maa",
    tagline: "The heart of our home",
    bio: "The heart of our home. Her love is the warmth that keeps us all together, no matter the distance.",
    quotes: [
      "Maa ke haath ka khaana... koi restaurant nahi de sakta 🍲",
      "Phone pe baat karte waqt, Maa ki awaaz mein ghar aa jaata hai",
      "Maa ki duaayein — sabse powerful protection ✨",
      "Distance se pyaar kam nahi hota, Maa se door rehke ye samjha",
    ],
    photoFolder: "mother",
  },
  father: {
    id: "father",
    name: "Pappa",
    nameEnglish: "Father",
    relation: "Father",
    emoji: "👨‍👧",
    color: "#1565C0",
    gradientFrom: "#1565C0",
    gradientTo: "#64B5F6",
    playlist: "papa",
    tagline: "Our silent pillar of strength",
    bio: "Our silent pillar of strength. He may not say much, but everything he does speaks volumes of love.",
    quotes: [
      "Papa ke advice — pehle lagta hai boring, baad mein lagta hai genius 😄",
      "Papa ki smile — rare but precious, like a shooting star ⭐",
      "Strong shoulders, soft heart — that's Pappa",
      "Papa ka phone aaye toh samjho... check-in ho raha hai with love 📞",
    ],
    photoFolder: "father",
  },
  sister: {
    id: "sister",
    name: "Adi",
    nameEnglish: "Sister",
    relation: "Sister",
    emoji: "👫",
    color: "#9C27B0",
    gradientFrom: "#9C27B0",
    gradientTo: "#CE93D8",
    playlist: "sister",
    tagline: "Forever partner in crime",
    bio: "My first friend, forever partner in crime, and the one who understands without words.",
    quotes: [
      "Sister ke saath jhagda bhi ek type ka pyaar hai 😤❤️",
      "Sabse pehle secrets share karna — sirf sister ke saath",
      "Childhood memories mein sister ka role — co-star nahi, hero hai 🎬",
      "Door rehke bhi, ek message pe sab theek ho jaata hai",
    ],
    photoFolder: "sister",
  },
  me: {
    id: "me",
    name: "Pratik",
    nameEnglish: "Me",
    relation: "Son / Brother",
    emoji: "🙋‍♂️",
    color: "#FF6F00",
    gradientFrom: "#FF6F00",
    gradientTo: "#FFB74D",
    playlist: "family",
    tagline: "Dreaming from Pune, heart in Kolhapur",
    bio: "Living in Pune, chasing dreams, but my heart always stays in Kolhapur with family.",
    quotes: [
      "Pune mein rehta hoon, Kolhapur mein jeeta hoon",
      "Ghar ki yaad aati hai toh photos dekhta hoon... aur aur zyada yaad aati hai 📸",
      "Family se door rehna mushkil hai, par unke liye kuch bada karna hai",
      "Jab bhi mushkil hoti hai, ghar ki yaad strength deti hai 💪",
    ],
    photoFolder: "me",
  },
};

export const familyQuotes = [
  "Family is not an important thing. It's everything. — Michael J. Fox",
  "Ghar woh nahi jahan hum rehte hain, ghar woh hai jahan humara dil rehta hai ❤️",
  "The love of a family is life's greatest blessing",
  "Kolhapur se Pune... distance sirf kilometers ka hai, dil ka nahi",
  "In family life, love is the oil that eases friction",
  "Parivaar — duniya ki sabse khoobsurat team 🏠",
  "Home is where your story begins",
  "Kuch rishtey khoon ke nahi, dil ke hote hain",
  "Together is our favorite place to be",
  "Family means nobody gets left behind or forgotten",
  "Apna ghar, apne log — isse zyada kya chahiye?",
  "Mammy ka pyaar, Pappa ki strength, Adi ki dosti — perfect family ❤️",
];

export const occasions = [
  "Birthday", "Diwali", "Holi", "Raksha Bandhan", "Anniversary",
  "Ganesh Chaturthi", "Family Trip", "Wedding", "Festival",
  "Random Day", "Celebration", "Picnic", "Temple Visit",
];

export const moods = [
  "Happy", "Emotional", "Fun", "Peaceful", "Festive", "Candid", "Love",
];

export function getRandomQuote() {
  return familyQuotes[Math.floor(Math.random() * familyQuotes.length)];
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning! ☀️";
  if (hour >= 12 && hour < 17) return "Good Afternoon! 🌤️";
  if (hour >= 17 && hour < 21) return "Good Evening! 🌇";
  return "Can't sleep? Family is thinking of you 🌙";
}

export function getMemberGreeting(memberId) {
  const greetings = {
    mother: "Mammy... the reason everything feels like home 🙏",
    father: "Pappa — our silent superhero 💪",
    sister: "Adi — forever partner in crime 👫",
    me: "Pratik — missing home from Pune 🏙️",
  };
  return greetings[memberId] || "Family is everything ❤️";
}
