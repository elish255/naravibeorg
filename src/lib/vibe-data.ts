export const REGISTER_URL = "https://adsblog.app/page/reg.php?reg=MrBusiness";
export const WHATSAPP_NUMBER = "255743871339";
export const WHATSAPP_PRE_MESSAGE = "HABAR NIELEKEZE KUHUSU NARAVIBE";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_PRE_MESSAGE,
)}`;
// WhatsApp channel link (update when the official channel URL is provided)
export const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/";

export type Profile = {
  name: string;
  country: string;
  avatar: number;
  rating: string;
  minutes: number;
  topic: string;
  tzs: number;
};

const names = [
  ["Victoria", "de", 28],
  ["Jonathan", "no", 35],
  ["Max", "fi", 56],
  ["Owen", "gb", 42],
  ["Daniel", "jp", 13],
  ["Zoe", "us", 36],
  ["Emily", "gb", 24],
  ["Christopher", "br", 15],
  ["Chloe", "fr", 34],
  ["William", "au", 3],
  ["Michael", "fr", 5],
  ["Luna", "pt", 51],
  ["Sophia", "it", 44],
  ["Ethan", "ca", 11],
  ["Mia", "es", 47],
  ["Liam", "ie", 8],
  ["Amelia", "nl", 45],
  ["Noah", "se", 12],
  ["Isabella", "ch", 49],
  ["Lucas", "dk", 18],
  ["Ava", "be", 26],
  ["Henry", "at", 51],
  ["Grace", "nz", 21],
  ["Oliver", "us", 60],
  ["Nora", "pl", 30],
  ["Leo", "gb", 33],
  ["Elena", "gr", 39],
  ["Jack", "za", 52],
  ["Hannah", "fi", 25],
  ["Adam", "cz", 61],
  ["Julia", "hu", 20],
  ["Thomas", "de", 59],
  ["Sarah", "us", 32],
  ["David", "il", 7],
  ["Clara", "ar", 27],
  ["Felix", "de", 54],
  ["Anna", "ru", 41],
  ["Ryan", "ca", 4],
  ["Lily", "kr", 29],
  ["Marco", "it", 57],
  ["Eva", "ro", 43],
  ["Sean", "ie", 55],
  ["Maya", "in", 48],
  ["Peter", "ua", 14],
  ["Rosa", "mx", 23],
  ["Kevin", "sg", 17],
  ["Nina", "hr", 31],
  ["George", "gb", 6],
  ["Alice", "fr", 46],
  ["Tom", "au", 10],
  ["Sofia", "bg", 38],
  ["Hugo", "pt", 53],
  ["Freya", "is", 22],
  ["Andre", "cl", 58],
  ["Ella", "lt", 40],
  ["Victor", "ee", 19],
  ["Naomi", "jp", 37],
  ["Paul", "lu", 9],
  ["Lena", "sk", 50],
  ["Bruno", "br", 16],
] as const;

const topics = [
  "Polite Swahili Phrases",
  "Documentaries & Nature Films",
  "Meditation Practices",
  "Coding & Robotics",
  "Photography & Wildlife",
  "Cooking & Recipes",
  "Vacation & Beach Chat",
  "Engineering Talk",
  "Fashion & Cultural Clothes",
  "Sports & Football Chat",
  "Music & Instruments",
  "Language Exchange Basics",
  "Safari & Travel Stories",
  "Books & Poetry",
  "Business & Startups",
  "Coffee & Tea Culture",
  "Movies & Series",
  "Farming & Agriculture",
  "Health & Fitness",
  "Art & Painting",
];

const ratings = ["4.7", "4.8", "4.9", "5.0"];
const minuteOptions = [25, 30, 35, 40, 45];

export const PROFILES: Profile[] = names.map(([name, country, avatar], i) => {
  const minutes = minuteOptions[i % minuteOptions.length];
  const perMinute = 1100 + ((i * 37) % 350);
  const tzs = Math.round((minutes * perMinute) / 500) * 500;
  return {
    name,
    country,
    avatar,
    rating: ratings[(i * 3) % ratings.length],
    minutes,
    topic: topics[i % topics.length],
    tzs,
  };
});

export const PER_PAGE = 12;
export const TOTAL_PAGES = Math.ceil(PROFILES.length / PER_PAGE);

export const formatTzs = (n: number) => n.toLocaleString("en-US");
export const usd = (tzs: number) => (tzs / 2500).toFixed(2);
