'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic map component
const MapAndQibla = dynamic(() => import('@/components/MapAndQibla'), { ssr: false });

// ==================== TYPES ====================
interface PackageData {
  id: number;
  title: string;
  price: string;
  hotelMakkah: string;
  hotelMadinah: string;
  days: string;
  tier: string;
  transport: string;
  seatsLeft: number;
  image: string;
}

interface Dua {
  id: number;
  location: string;
  context: string;
  arabic: string;
  transliteration: string;
  urduMeaning: string;
  reference: string;
}

interface RitualStep {
  id: number;
  title: string;
  description: string;
  doList: string[];
  dontList: string[];
  adab: string[];
  audioSrc?: string;
}

interface SacredSite {
  id: number;
  name: string;
  nameUrdu: string;
  descriptionEn: string;
  descriptionUrdu: string;
  historyEn: string;
  historyUrdu: string;
  significance: string;
  location: string;
  transportEn: string;
  transportUrdu: string;
  image: string;
}

interface AdabEntry {
  id: number;
  titleEn: string;
  titleUrdu: string;
  detailEn: string;
  detailUrdu: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// ==================== DATA (unchanged) ====================
const packages: PackageData[] = [
  { id: 1, title: "Standard Fast Track Umrah", price: "PKR 215,000", hotelMakkah: "Rawabi Khulood (600m Shuttle)", hotelMadinah: "Al-Ansar New Palace", days: "7 Days", tier: "economy", transport: "Ministry Approved AC Busses", seatsLeft: 4, image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "Abraj Al Bait Premium Star", price: "PKR 340,000", hotelMakkah: "Swissôtel Makkah (Clock Tower)", hotelMadinah: "Rove Al Madinah", days: "10 Days", tier: "premium", transport: "Haramain High Speed Bullet Train", seatsLeft: 7, image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Royal Kaaba View Executive", price: "PKR 590,000", hotelMakkah: "Fairmont Clock Royal Tower (Kaaba View)", hotelMadinah: "The Oberoi Madinah", days: "7 Days", tier: "vip", transport: "Private VIP GMC Luxury Fleet", seatsLeft: 2, image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80" },
  { id: 4, title: "Extended Spiritual Ramadan Special", price: "PKR 420,000", hotelMakkah: "Mövenpick Hajar Tower", hotelMadinah: "Anwar Al Madinah Mövenpick", days: "15 Days", tier: "premium", transport: "Haramain High Speed Bullet Train", seatsLeft: 5, image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80" },
  { id: 5, title: "Shaza Luxury Executive Custom", price: "PKR 680,000", hotelMakkah: "Shaza Makkah (Front Line Access)", hotelMadinah: "Shaza Regency Madinah", days: "12 Days", tier: "vip", transport: "Private Chauffeur Driven Fleet", seatsLeft: 3, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
  { id: 6, title: "Family Economy Blessing Package", price: "PKR 260,000", hotelMakkah: "Dar Al Eiman Nour (Shuttle Service)", hotelMadinah: "Central Zone Standard", days: "14 Days", tier: "economy", transport: "Ministry Approved AC Busses", seatsLeft: 9, image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=600&q=80" },
  { id: 7, title: "Comprehensive Hajj Executive Shield", price: "PKR 1,250,000", hotelMakkah: "Clock Tower Suites (Mina VIP Tents)", hotelMadinah: "Madinah Hilton Elite", days: "21 Days", tier: "vip", transport: "Private VIP Assigned Transit", seatsLeft: 1, image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=600&q=80" },
  { id: 8, title: "Standard Long Stay Devotion Pack", price: "PKR 310,000", hotelMakkah: "Al Shohada Hotel", hotelMadinah: "Pulman Zamzam Madinah", days: "21 Days", tier: "premium", transport: "Haramain High Speed Train Tickets", seatsLeft: 6, image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80" },
];

// ==================== DUAS ====================
const duas: Dua[] = [
  { id: 1, location: "Meeqat / Niyyah Point", context: "Nabi Kareem ﷺ ne Umrah ki niyyah farmate hue:", arabic: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً ، اللَّهُمَّ مَحِلِّي حَيْثُ حَبَسْتَنِي", transliteration: "Labbayk Allahumma Umrah, Allahumma mahilli haythu habastani.", urduMeaning: "Main hazir hoon ya Allah Umrah ke liye. Aey Allah! Mere ihram kholne ki jagah wahi ho jahan Tu mujhe rok de.", reference: "Sahih Bukhari & Muslim" },
  { id: 2, location: "Hajr-e-Aswad Istilam", context: "Tawaf shuru karte waqt:", arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ", transliteration: "Bismillah wallahu Akbar, Allahumma imanan bika wa tasdiqan bikitabika.", urduMeaning: "Allah ke naam se, Allah sab se bada hai. Aey Allah! Tujh par iman rakhte hue aur Teri kitab ki tasdeeq karte hue.", reference: "Sunan Al-Kubra" },
  { id: 3, location: "Rukn-e-Yamani Corridor", context: "Tawaf ke aakhri hissay mein:", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.", urduMeaning: "Aey hamare Rab! Humein dunya aur aakhirat mein bhalai ata farma aur aag ke azaab se bacha.", reference: "Sahih Bukhari" },
  { id: 4, location: "Multazim (between Black Stone & door)", context: "Ye jagah duaon ki qabooliyat ke liye mashhoor hai.", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ", transliteration: "Allahumma inni as'aluka al-'afwa wal-'afiyata fid-dunya wal-akhirah.", urduMeaning: "Aey Allah! Main tujh se dunya aur aakhirat mein maafi aur aafiyat talab karta hoon.", reference: "Hadith" },
  { id: 5, location: "Inside Hateem / Hijr Ismail", context: "Nabi ﷺ ne farmaya: 'Jo shakhs yahan do rakaat ada karega…'", arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ", transliteration: "Rabbighfir warham wa anta khairur rahimeen.", urduMeaning: "Aey mere Rab! Bakhsh de aur reham farma, Tu sab se behtar reham karne wala hai.", reference: "Quran 23:118" },
  { id: 6, location: "After drinking Zamzam", context: "Zamzam pine ke baad ye dua parhen.", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ", transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan wasi'an wa shifa'an min kulli daa'.", urduMeaning: "Aey Allah! Mujhe nafa bakhsh ilm, kushada rizq aur har bimari se shifa ata farma.", reference: "Sunan Ibn Majah" },
  { id: 7, location: "Safa Par", context: "Safa pahari par charh kar qibla rukh ho kar:", arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ", transliteration: "Innas Safa wal Marwata min sha'airillah.", urduMeaning: "Beshak Safa aur Marwa Allah ki nishaniyon mein se hain.", reference: "Quran 2:158" },
  { id: 8, location: "Marwa Par", context: "Har chakkar ke baad Safa-Marwa par:", arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", transliteration: "Rabbana taqabbal minna innaka antas-sami'ul-'alim.", urduMeaning: "Aey hamare Rab! Hamari taraf se qubool farma, beshak Tu sunne wala janne wala hai.", reference: "Quran 2:127" },
  { id: 9, location: "Maqam Ibrahim ke paas", context: "Tawaf ke baad do rakaat ada karne ke baad:", arabic: "وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى", transliteration: "Wattakhizu min Maqami Ibrahima musalla.", urduMeaning: "Aur Maqam Ibrahim ko namaz ki jagah banao.", reference: "Quran 2:125" },
  { id: 10, location: "Arafat ke maidan mein", context: "9 Zul-Hijjah ko Arafat mein kasrat se parhen:", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "La ilaha illallahu wahdahu la sharika lahu lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.", urduMeaning: "Allah ke siwa koi mabood nahi, woh akela hai, us ka koi shareek nahi, usi ki badshahi hai aur usi ki taareef hai aur woh har cheez par qaadir hai.", reference: "Sahih Muslim" },
  { id: 11, location: "Entering Masjid al-Haram", context: "Jab masjid mein dakhil hon:", arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", transliteration: "Allahumma iftah li abwaba rahmatik.", urduMeaning: "Aey Allah! Mere liye apni rehmat ke darwaze khol de.", reference: "Sahih Muslim" },
  { id: 12, location: "During Tawaf", context: "Tawaf ke dauran dil ki hidayat ke liye:", arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ", transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal-Wahhab.", urduMeaning: "Aey hamare Rab! Hamein hidayat dene ke baad hamare dilon ko tedha na kar aur humein apni taraf se rehmat ata farma, beshak Tu hi bada ata karne wala hai.", reference: "Quran 3:8" },
  { id: 13, location: "Sa'i (between green markers)", context: "Daudte waqt:", arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَتَجَاوَزْ عَمَّا تَعْلَمُ", transliteration: "Rabbighfir warham wa tajaawaz 'amma ta'lam.", urduMeaning: "Aey mere Rab! Bakhsh de, reham farma aur jo Tu jaanta hai us se darguzar farma.", reference: "Hadith" },
  { id: 14, location: "Muzdalifah", context: "10 Zil-Hijjah ki raat Muzdalifah mein:", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ", transliteration: "Allahumma inni as'aluka mujibati rahmatika wa 'aza'ima maghfiratika.", urduMeaning: "Aey Allah! Main tujh se teri rehmat ke sabab aur teri maghfirat ke azm (pakka irada) talab karta hoon.", reference: "Sunan al-Tirmidhi" },
  { id: 15, location: "Jamarat (Stoning)", context: "Ramy (kanakriyan) martay waqt:", arabic: "اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَسَعْيًا مَشْكُورًا", transliteration: "Allahumma ij'alhu Hajjan mabruran wa sa'yan mashkuran.", urduMeaning: "Aey Allah! Isay qubool hajj aur mashkoor sa'ee bana de.", reference: "Hadith" },
  { id: 16, location: "Halq / Taqsir", context: "Baal mundwate / katwate waqt:", arabic: "اللَّهُمَّ لَكَ الْحَمْدُ عَلَى مَا هَدَيْتَنَا", transliteration: "Allahumma lakal-hamdu 'ala ma hadaytana.", urduMeaning: "Aey Allah! Tera shukar hai jis tarah Tu ne hamein hidayat di.", reference: "Hadith" },
  { id: 17, location: "General Dua (any time)", context: "Kisi bhi waqt maafi talab karne ke liye:", arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", transliteration: "Rabbana ghfir li wa liwalidayya wa lil-mu'minina yawma yaqumul-hisab.", urduMeaning: "Aey hamare Rab! Mujhe, mere walidain ko aur tamaam momino ko us roz maaf farma jab hisab qayam hoga.", reference: "Quran 14:41" },
  { id: 18, location: "Protection from Hellfire", context: "Jahannam ki aag se bachne ke liye:", arabic: "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ ۖ إِنَّ عَذَابَهَا كَانَ غَرَامًا", transliteration: "Rabbana isrif 'anna 'adhaba jahannama inna 'adhabaha kana gharama.", urduMeaning: "Aey hamare Rab! Hum se jahannam ka azaab hata de, beshak uska azaab sakht museebat hai.", reference: "Quran 25:65" },
  { id: 19, location: "General Dua (After Prayer)", context: "Har namaz ke baad parhne ke liye:", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina.", urduMeaning: "Aey Allah! Main tujh se hidayat, taqwa, paak-damani aur be-niyazi talab karta hoon.", reference: "Sahih Muslim" },
  { id: 20, location: "After completing Umrah/Hajj", context: "Sare manasik mukammal karne ke baad:", arabic: "اللَّهُمَّ تَقَبَّلْ مِنَّا صَالِحَ الْأَعْمَالِ", transliteration: "Allahumma taqabbal minna salih al-a'mal.", urduMeaning: "Aey Allah! Hamaari nek a'mal qubool farma.", reference: "Hadith" }
];

// Umrah & Hajj steps
const umrahSteps: RitualStep[] = [
  { id: 1, title: "Ihram & Niyyah", description: "Enter Ihram at the Meeqat, make intention and recite Talbiyah.", doList: ["Wear two white cloths (men)", "Recite Talbiyah"], dontList: ["Avoid perfume", "Do not cut hair/nails"], adab: ["Be humble", "Increase dhikr"], audioSrc: "/audio/umrah-step1.mp3" },
  { id: 2, title: "Tawaf", description: "Circle the Kaaba seven times, starting at the Black Stone.", doList: ["Make Istilam of Hajar al-Aswad", "Keep Kaaba on your left"], dontList: ["Do not push others"], adab: ["Make abundant dua between Rukn Yamani and Black Stone"], audioSrc: "/audio/umrah-step2.mp3" },
  { id: 3, title: "Sa'i", description: "Walk seven times between Safa and Marwa.", doList: ["Start at Safa, recite Quran", "Run between green markers (men)"], dontList: ["Do not skip any lap"], adab: ["Reflect on Hagar's struggle"], audioSrc: "/audio/umrah-step3.mp3" },
  { id: 4, title: "Halq / Taqsir", description: "Shave or trim hair to exit Ihram.", doList: ["Men shave or trim equally", "Women trim fingertip length"], dontList: ["Do not leave without completing"], adab: ["Feel renewal and thank Allah"], audioSrc: "/audio/umrah-step4.mp3" },
];

const hajjSteps: RitualStep[] = [
  { id: 1, title: "8th Dhul Hijjah – Mina", description: "Spend the day in Mina in worship.", doList: ["Pray Dhuhr to Isha in Mina"], dontList: ["Avoid arguments"], adab: ["Prepare your heart"] },
  { id: 2, title: "9th Dhul Hijjah – Arafat", description: "Stand at Arafat from Dhuhr to Maghrib in sincere dua.", doList: ["Pray combined Dhuhr & Asr"], dontList: ["Do not waste time"], adab: ["Cry to Allah, seek forgiveness"] },
  { id: 3, title: "Night – Muzdalifah", description: "Collect pebbles and pray under the open sky.", doList: ["Collect 70 pebbles", "Pray Maghrib & Isha combined"], dontList: ["Do not rush"], adab: ["Rest and reflect"] },
  { id: 4, title: "10th Dhul Hijjah – Ramy, Nahr, Halq, Tawaf", description: "Stone Jamarat al‑Aqabah, offer sacrifice, shave/trim, then Tawaf al‑Ifadah.", doList: ["Throw 7 pebbles at big pillar"], dontList: ["Do not stone before its time"], adab: ["Celebrate Eid with gratitude"] },
];

// ==================== SACRED SITES ====================
const sacredSites: SacredSite[] = [
  {
    id: 1,
    name: "Masjid al-Haram",
    nameUrdu: "مسجد الحرام",
    descriptionEn: "The Grand Mosque, the largest mosque in the world, surrounds the Kaaba.",
    descriptionUrdu: "مسجد الحرام، دنیا کی سب سے بڑی مسجد، کعبہ کے گرد پھیلی ہوئی ہے۔",
    historyEn: "Founded in 7th century, expanded over time.",
    historyUrdu: "ساتویں صدی میں قائم ہوئی، وقتاً فوقتاً توسیع ہوتی رہی۔",
    significance: "One prayer equals 100,000 prayers. Houses the Kaaba, Black Stone, Zamzam.",
    location: "Makkah, Saudi Arabia",
    transportEn: "Accessible by taxi, public buses, or on foot. Haramain High Speed Train connects to Jeddah Airport.",
    transportUrdu: "ٹیکسی، پبلک بس یا قریبی ہوٹلوں سے پیدل جایا جا سکتا ہے۔ جدہ ایئرپورٹ سے حرمین تیز رفتار ٹرین کی سہولت بھی ہے۔",
    image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Al-Hajar al-Aswad",
    nameUrdu: "حجرِ اسود",
    descriptionEn: "The Black Stone set in the eastern corner of the Kaaba.",
    descriptionUrdu: "حجرِ اسود، کعبہ کے مشرقی کونے میں نصب سیاہ پتھر۔",
    historyEn: "Believed sent from Paradise, placed by Ibrahim and Ismail. Originally white, turned black by human sin.",
    historyUrdu: "جنت سے آیا، ابراہیم و اسماعیل نے نصب کیا۔ سفید تھا، گناہوں سے سیاہ ہوگیا۔",
    significance: "Pilgrims touch or kiss it following the Prophet's example.",
    location: "Eastern corner of the Kaaba",
    transportEn: "Inside the mosque, walk to the Kaaba perimeter.",
    transportUrdu: "مسجد کے اندر، کعبہ کے قریب پیدل جایا جا سکتا ہے۔",
    image: "/images/hajar-al-aswad.png"
  },
  {
    id: 3,
    name: "Maqam Ibrahim",
    nameUrdu: "مقام ابراہیم",
    descriptionEn: "The stone where Prophet Ibrahim stood while building the Kaaba.",
    descriptionUrdu: "وہ پتھر جس پر حضرت ابراہیم کعبہ کی تعمیر کے وقت کھڑے ہوئے تھے۔",
    historyEn: "Mentioned in Quran (2:125). Footprints preserved in a glass enclosure.",
    historyUrdu: "قرآن (2:125) میں مذکور ہے۔ قدم کے نشانات شیشے کے محافظ میں ہیں۔",
    significance: "Pray two rak'ahs behind Maqam Ibrahim after Tawaf.",
    location: "Masjid al-Haram, near the Kaaba",
    transportEn: "Inside the mosque.",
    transportUrdu: "مسجد کے اندر۔",
    image: "/images/maqam-ibrahim.png"
  },
  {
    id: 4,
    name: "Zamzam Well",
    nameUrdu: "آبِ زم زم",
    descriptionEn: "The miraculous well that sprang under the feet of baby Ismail.",
    descriptionUrdu: "وہ معجزانہ کنواں جو شیرخوار اسماعیل علیہ السلام کی پیاس بجھانے کے لیے پھوٹا۔",
    historyEn: "Hagar ran between Safa and Marwa; Allah caused Zamzam to appear. It never runs dry.",
    historyUrdu: "ہاجرہ علیہا السلام صفا و مروہ کے درمیان پانی کی تلاش میں دوڑیں؛ اللہ نے زم زم جاری کیا۔",
    significance: "Drinking Zamzam is Sunnah; it has healing properties.",
    location: "Masjid al-Haram, near the Kaaba",
    transportEn: "Inside the mosque, water stations available.",
    transportUrdu: "مسجد کے اندر، پانی کے اسٹیشن موجود ہیں۔",
    image: "/images/zamzam-well.png"
  },
  {
    id: 5,
    name: "Safa and Marwah",
    nameUrdu: "صفا و مروہ",
    descriptionEn: "Two small hills now enclosed within the mosque.",
    descriptionUrdu: "دو چھوٹی پہاڑیاں جو اب مسجد کے اندر ہیں۔",
    historyEn: "Commemorates Hagar's desperate search for water.",
    historyUrdu: "یہ حضرت ہاجرہ کے پانی کی تلاش کے عمل کی یاد دلاتا ہے۔",
    significance: "The Sa'i is a pillar of both Hajj and Umrah.",
    location: "Masjid al-Haram, near Zamzam",
    transportEn: "Located inside the mosque, accessible via the Sa'i gallery.",
    transportUrdu: "مسجد کے اندر، سعی گیلری کے ذریعے جایا جا سکتا ہے۔",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Mina",
    nameUrdu: "منیٰ",
    descriptionEn: "A valley east of Mecca where pilgrims camp during Hajj.",
    descriptionUrdu: "مکہ کے مشرق میں واقع وادی جہاں حج کے دوران خیمے لگائے جاتے ہیں۔",
    historyEn: "Known as the 'City of Tents'. It houses the three Jamarat pillars.",
    historyUrdu: "خیموں کا شہر کہلاتا ہے۔ یہاں تین جمرات ہیں۔",
    significance: "Staying in Mina is mandatory; stoning Jamarat symbolizes rejection of evil.",
    location: "Mina, 5 km from Masjid al-Haram",
    transportEn: "Walk or take shuttle buses during Hajj. No private cars allowed.",
    transportUrdu: "حج کے دوران پیدل یا شٹل بسوں کے ذریعے جایا جا سکتا ہے۔ نجی گاڑیوں کی اجازت نہیں ہے۔",
    image: "/images/mina.png"
  },
  {
    id: 7,
    name: "Arafat",
    nameUrdu: "عرفات",
    descriptionEn: "The plain where the Prophet delivered his farewell sermon.",
    descriptionUrdu: "وہ میدان جہاں نبی کریم ﷺ نے حجۃ الوداع کا خطبہ دیا۔",
    historyEn: "Adam and Eve were reunited here. Millions gather on 9th Dhul Hijjah.",
    historyUrdu: "آدم و حوا دوبارہ یہاں ملے تھے۔ 9 ذوالحجہ کو لاکھوں مسلمان یہاں جمع ہوتے ہیں۔",
    significance: "The Day of Arafat is the most important day of Hajj.",
    location: "Plain of Arafat, about 20 km southeast of Mecca",
    transportEn: "Hajj ministry provides dedicated buses. Haramain train has a station for Arafat.",
    transportUrdu: "حج وزارت کی طرف سے مخصوص بسیں فراہم کی جاتی ہیں۔ حرمین ٹرین کا بھی اسٹیشن ہے۔",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Muzdalifah",
    nameUrdu: "مزدلفہ",
    descriptionEn: "An open area between Arafat and Mina where pilgrims spend the night.",
    descriptionUrdu: "عرفات اور منیٰ کے درمیان کھلا میدان جہاں حجاج 10 ذوالحجہ کی رات گزارتے ہیں۔",
    historyEn: "Pilgrims pray Maghrib and Isha together and sleep under the stars.",
    historyUrdu: "یہاں مغرب اور عشاء ایک ساتھ پڑھی جاتی ہیں اور کھلے آسمان تلے رات بسر کی جاتی ہے۔",
    significance: "Staying in Muzdalifah is wajib; collect pebbles here for Jamarat.",
    location: "Muzdalifah, between Arafat and Mina",
    transportEn: "Reached by walking or Hajj buses. No dedicated train station.",
    transportUrdu: "پیدل یا حج بسوں کے ذریعے جایا جا سکتا ہے۔ یہاں کوئی علیحدہ ٹرین اسٹیشن نہیں ہے۔",
    image: "/images/muzdalifah.png"
  },
  {
    id: 9,
    name: "Jamarat",
    nameUrdu: "جمرات",
    descriptionEn: "Three stone pillars representing the devil's temptation. Pilgrims throw pebbles at them.",
    descriptionUrdu: "تین پتھر کے ستون جو شیطان کا استعارہ ہیں۔ حج کے دوران انہیں کنکریاں ماری جاتی ہیں۔",
    historyEn: "Commemorates Ibrahim's rejection of Satan. Some pigeons eat the pebbles to clean the area; this is practical, not religious.",
    historyUrdu: "یہ رمی حضرت ابراہیم کے شیطان کو کنکریاں مارنے کی یاد میں ہے۔ بہت سے کبوتر کنکریاں کھا جاتے ہیں تاکہ علاقہ صاف رہے اور وہ دوبارہ استعمال نہ ہوں؛ یہ انتظامی معاملہ ہے، مذہبی حکم نہیں۔",
    significance: "Ramy al-Jamarat is an obligatory act of Hajj, symbolising the fight against evil.",
    location: "Mina, near the camping area",
    transportEn: "Within walking distance from Mina tents. Multi‑level Jamarat bridge ensures safety.",
    transportUrdu: "منیٰ کے خیموں سے پیدل جائیں۔ کثیر المنزلہ جمرات پل حفاظت کو یقینی بناتا ہے۔",
    image: "/images/jamarat.png"
  }
];

const adabList: AdabEntry[] = [
  { id: 1, titleEn: "Ikhlas (Sincerity)", titleUrdu: "اخلاص", detailEn: "Purify your intention solely for Allah. Do not seek praise or show off.", detailUrdu: "نیت صرف اللہ کی رضا کے لیے ہو۔ دکھاوے سے بچیں۔" },
  { id: 2, titleEn: "Humility", titleUrdu: "عاجزی", detailEn: "Leave arrogance behind. White Ihram reminds that all are equal before Allah.", detailUrdu: "تکبر چھوڑ دیں۔ سفید احرام یاد دلاتا ہے کہ سب اللہ کے سامنے برابر ہیں۔" },
  { id: 3, titleEn: "Patience", titleUrdu: "صبر", detailEn: "Be patient with crowds, heat, and delays. This is a test of your faith.", detailUrdu: "بھیڑ، گرمی اور تاخیر پر صبر کریں۔ یہ آپ کے ایمان کا امتحان ہے۔" },
  { id: 4, titleEn: "Remembrance (Dhikr)", titleUrdu: "ذکر", detailEn: "Keep your tongue moist with the remembrance of Allah.", detailUrdu: "زبان کو اللہ کے ذکر سے تر رکھیں۔" },
  { id: 5, titleEn: "Generosity", titleUrdu: "سخاوت", detailEn: "Help fellow pilgrims, give charity, and avoid arguments.", detailUrdu: "دوسرے حاجیوں کی مدد کریں، صدقہ دیں، اور لڑائی جھگڑے سے بچیں۔" },
  { id: 6, titleEn: "Guarding the Gaze", titleUrdu: "نگاہ کی حفاظت", detailEn: "Lower your gaze and protect your heart from distractions.", detailUrdu: "نگاہیں نیچی رکھیں اور دل کو غیر ضروری چیزوں سے بچائیں۔" },
  { id: 7, titleEn: "Avoiding Backbiting", titleUrdu: "غیبت سے پرہیز", detailEn: "Do not speak ill of others or make fun of anyone.", detailUrdu: "کسی کی برائی نہ کریں، نہ ہی کسی کا مذاق اڑائیں۔" },
  { id: 8, titleEn: "Respecting the Sacred Precincts", titleUrdu: "حرمت کا خیال", detailEn: "Treat every part of the Haram with respect; avoid littering and shouting.", detailUrdu: "حرم کے ہر حصے کا احترام کریں؛ گندگی نہ پھیلائیں اور شور نہ مچائیں۔" },
  { id: 9, titleEn: "Seeking Knowledge", titleUrdu: "علم کی جستجو", detailEn: "Learn the rulings of Hajj/Umrah before you go.", detailUrdu: "جانے سے پہلے حج/عمرہ کے مسائل سیکھیں تاکہ درست طریقے سے ادا کر سکیں۔" },
  { id: 10, titleEn: "Maintaining Cleanliness", titleUrdu: "صفائی کا خیال", detailEn: "Keep your body, clothes, and surroundings clean.", detailUrdu: "اپنے بدن، کپڑوں اور ماحول کو صاف رکھیں۔" },
  { id: 11, titleEn: "Praying on Time", titleUrdu: "نماز باجماعت", detailEn: "Never miss a congregational prayer in the Haram; it multiplies rewards immensely.", detailUrdu: "حرم میں باجماعت نماز کبھی نہ چھوڑیں؛ اس کا اجر بے حد بڑھ جاتا ہے۔" },
  { id: 12, titleEn: "Reciting Quran", titleUrdu: "تلاوتِ قرآن", detailEn: "Devote time to reciting and pondering over the Quran.", detailUrdu: "قرآن کی تلاوت اور غور و فکر کے لیے وقت نکالیں۔" },
];

// ==================== NEW COMPONENTS (unchanged) ====================

// ---- Weather Widget ----
function WeatherWidget() {
  const [weather, setWeather] = useState<{ makkah: any; madinah: any } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (city: string) => {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`);
        if (!res.ok) throw new Error('API error');
        return await res.json();
      } catch {
        return { main: { temp: city === 'Makkah' ? 38 : 35 }, weather: [{ description: 'Clear sky' }] };
      }
    };

    Promise.all([fetchWeather('Makkah'), fetchWeather('Madinah')])
      .then(([makkah, madinah]) => {
        setWeather({ makkah, madinah });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-xs text-slate-400 animate-pulse">Loading weather...</div>;
  if (!weather) return <div className="text-xs text-slate-400">Weather unavailable</div>;

  return (
    <div className="flex gap-4 text-xs flex-wrap">
      <div className="bg-slate-800/60 p-3 rounded-xl backdrop-blur-sm border border-emerald-400/20">
        <p className="text-emerald-300 font-bold">Makkah</p>
        <p className="text-white">{weather.makkah.main.temp}°C</p>
        <p className="text-slate-400 capitalize">{weather.makkah.weather[0].description}</p>
      </div>
      <div className="bg-slate-800/60 p-3 rounded-xl backdrop-blur-sm border border-emerald-400/20">
        <p className="text-emerald-300 font-bold">Madinah</p>
        <p className="text-white">{weather.madinah.main.temp}°C</p>
        <p className="text-slate-400 capitalize">{weather.madinah.weather[0].description}</p>
      </div>
    </div>
  );
}

// ---- Currency Converter ----
function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState<'PKR' | 'SAR'>('PKR');
  const [to, setTo] = useState<'PKR' | 'SAR'>('SAR');
  const [rate, setRate] = useState<number | null>(null);
  const [converted, setConverted] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/PKR')
      .then(res => res.json())
      .then(data => {
        const sarRate = data.rates.SAR;
        setRate(sarRate);
      })
      .catch(() => setRate(0.014));
  }, []);

  useEffect(() => {
    if (rate !== null && amount > 0) {
      if (from === 'PKR' && to === 'SAR') setConverted(amount * rate);
      else if (from === 'SAR' && to === 'PKR') setConverted(amount / rate);
      else setConverted(amount);
    }
  }, [amount, from, to, rate]);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/20 shadow-xl">
      <h4 className="text-xs font-bold text-emerald-400 uppercase mb-3">Currency Converter</h4>
      <div className="flex flex-wrap gap-3 items-center">
        <label htmlFor="currency-amount" className="sr-only">Amount</label>
        <input
          id="currency-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="w-24 bg-slate-950/80 text-white rounded-full p-2 text-xs border border-white/10 focus:border-emerald-400 outline-none"
          placeholder="1"
          aria-label="Enter amount to convert"
        />
        <label htmlFor="currency-from" className="sr-only">From currency</label>
        <select 
          id="currency-from"
          value={from} 
          onChange={(e) => setFrom(e.target.value as any)} 
          className="bg-slate-950/80 text-white rounded-full p-2 text-xs border border-white/10 focus:border-emerald-400 outline-none"
          aria-label="Select currency to convert from"
        >
          <option value="PKR">PKR</option>
          <option value="SAR">SAR</option>
        </select>
        <span className="text-slate-400">→</span>
        <label htmlFor="currency-to" className="sr-only">To currency</label>
        <select 
          id="currency-to"
          value={to} 
          onChange={(e) => setTo(e.target.value as any)} 
          className="bg-slate-950/80 text-white rounded-full p-2 text-xs border border-white/10 focus:border-emerald-400 outline-none"
          aria-label="Select currency to convert to"
        >
          <option value="PKR">PKR</option>
          <option value="SAR">SAR</option>
        </select>
        <span className="text-amber-400 font-bold text-sm">
          {converted !== null ? converted.toFixed(2) : '...'}
        </span>
        <span className="text-xs text-slate-400">(1 PKR ≈ {rate?.toFixed(4)} SAR)</span>
      </div>
    </div>
  );
}

// ---- Countdown Timer to Hajj ----
function HajjCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const compute = () => {
      const now = new Date();
      let target = new Date(2026, 5, 25);
      if (now > target) target = new Date(2027, 5, 25);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/20 shadow-xl text-center">
      <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Next Hajj</h4>
      <div className="flex justify-center gap-4 text-sm font-mono">
        <div><span className="text-white text-2xl">{timeLeft.days}</span><span className="text-slate-400 text-xs block">Days</span></div>
        <div><span className="text-white text-2xl">{timeLeft.hours}</span><span className="text-slate-400 text-xs block">Hours</span></div>
        <div><span className="text-white text-2xl">{timeLeft.minutes}</span><span className="text-slate-400 text-xs block">Mins</span></div>
        <div><span className="text-white text-2xl">{timeLeft.seconds}</span><span className="text-slate-400 text-xs block">Secs</span></div>
      </div>
    </div>
  );
}

// ---- Review Component ----
function ReviewSection({ packageId }: { packageId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const stored = localStorage.getItem(`reviews_${packageId}`);
    if (stored) setReviews(JSON.parse(stored));
  }, [packageId]);

  const addReview = () => {
    if (!comment.trim()) return;
    const newReview: Review = {
      id: Date.now().toString(),
      userName: userName || 'Guest',
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem(`reviews_${packageId}`, JSON.stringify(updated));
    setComment('');
  };

  return (
    <div className="mt-4 border-t border-emerald-400/20 pt-4">
      <h5 className="text-xs font-bold text-white mb-2">Reviews</h5>
      {reviews.length === 0 && <p className="text-xs text-slate-400">No reviews yet. Be the first!</p>}
      {reviews.map(r => (
        <div key={r.id} className="bg-slate-800/60 p-3 rounded-xl mb-2 text-xs">
          <div className="flex justify-between">
            <span className="text-emerald-300 font-bold">{r.userName}</span>
            <span className="text-amber-400">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
          </div>
          <p className="text-slate-300">{r.comment}</p>
          <p className="text-slate-500 text-[10px]">{r.date}</p>
        </div>
      ))}
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <label htmlFor={`review-name-${packageId}`} className="sr-only">Your name</label>
        <input 
          id={`review-name-${packageId}`}
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          placeholder="Your name" 
          className="bg-slate-950/80 text-white rounded-full p-2 text-xs border border-white/10 focus:border-emerald-400 outline-none w-24" 
          aria-label="Enter your name for the review"
        />
        <label htmlFor={`review-rating-${packageId}`} className="sr-only">Rating</label>
        <select 
          id={`review-rating-${packageId}`}
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))} 
          className="bg-slate-950/80 text-white rounded-full p-2 text-xs border border-white/10 focus:border-emerald-400 outline-none"
          aria-label="Select rating from 1 to 5 stars"
        >
          {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}★</option>)}
        </select>
        <label htmlFor={`review-comment-${packageId}`} className="sr-only">Your comment</label>
        <input 
          id={`review-comment-${packageId}`}
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="Your comment" 
          className="flex-1 bg-slate-950/80 text-white rounded-full p-2 text-xs border border-white/10 focus:border-emerald-400 outline-none min-w-[120px]" 
          aria-label="Enter your review comment"
        />
        <button onClick={addReview} className="bg-amber-500 text-slate-950 font-black px-4 py-1 rounded-full text-xs uppercase shadow-lg shadow-amber-500/30">Submit</button>
      </div>
    </div>
  );
}

// ---- Download PDF Guide ----
function DownloadPDFGuide() {
  const downloadPDF = () => {
    const content = document.getElementById('guide-content');
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Umrah & Hajj Guide</title>
      <style>body { font-family: Arial; padding: 40px; max-width: 800px; margin: auto; } h2 { color: #0d9488; } ul { margin: 10px 0; }</style>
      </head><body>
      <h1>🕋 Umrah & Hajj Guide</h1>
      ${content.innerHTML}
      <p style="margin-top:40px; color:#666; font-size:12px;">Generated from Haramain Elite Travels</p>
      <script>
        setTimeout(() => { window.print(); }, 500);
      <\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <button onClick={downloadPDF} className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-500/30 transition-all shadow-lg shadow-emerald-500/10">
      📄 Download PDF Guide
    </button>
  );
}

// ==================== PACKAGE CARD (Enhanced) ====================
function PackageCard({ pkg, compareList, toggleCompare, startBooking, favorites, toggleFavorite }: any) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [showReviews, setShowReviews] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pkg.title,
        text: `Check out this package: ${pkg.title} - ${pkg.price}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${pkg.title} - ${pkg.price} - ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  const isFavorite = favorites.includes(pkg.id);

  return (
    <motion.div
      variants={{
        hidden: { scale: 0.95, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
        hover: { scale: 1.03, transition: { duration: 0.2 } }
      }}
      whileHover="hover"
      style={{
        transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-emerald-400/20 hover:border-emerald-400/40 shadow-2xl shadow-emerald-500/5 transition-all group overflow-hidden flex flex-col"
    >
      <div className="w-full h-48 overflow-hidden relative">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <button 
          onClick={() => toggleFavorite(pkg.id)} 
          className="absolute top-3 right-3 text-2xl drop-shadow-lg bg-black/30 rounded-full p-1 hover:bg-black/50 transition"
          aria-label={isFavorite ? `Remove ${pkg.title} from favorites` : `Add ${pkg.title} to favorites`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <button 
          onClick={handleShare} 
          className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-sm hover:bg-black/70 transition"
          aria-label={`Share ${pkg.title}`}
        >
          📤
        </button>
      </div>
      <div className="p-5 bg-gradient-to-b from-slate-800/80 to-slate-900/90 border-b border-emerald-400/10 relative">
        <span className="text-[9px] uppercase font-black text-emerald-300 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">{pkg.tier}</span>
        <h3 className="text-sm font-bold text-white mt-2">{pkg.title}</h3>
        <span className="absolute top-4 right-4 text-xs text-slate-400 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">{pkg.days}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="text-[11px] text-slate-300 space-y-1.5">
          <div><span className="text-emerald-400/70">Makkah:</span> {pkg.hotelMakkah}</div>
          <div><span className="text-emerald-400/70">Madinah:</span> {pkg.hotelMadinah}</div>
          <div><span className="text-emerald-400/70">Transit:</span> {pkg.transport}</div>
          <div className="text-amber-400 font-bold text-xs">{pkg.seatsLeft} seats left</div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-white/5">
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-amber-300">{pkg.price}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => toggleCompare(pkg.id)} 
              className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border transition-all ${compareList.includes(pkg.id) ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400 shadow-glow' : 'bg-slate-800/60 border-white/10 text-slate-400 hover:border-emerald-400/30'}`}
              aria-label={compareList.includes(pkg.id) ? `Remove ${pkg.title} from comparison` : `Add ${pkg.title} to comparison`}
            >
              {compareList.includes(pkg.id) ? 'Compare' : '+ Compare'}
            </button>
            <button 
              onClick={() => startBooking(pkg)} 
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black px-5 py-2 rounded-full text-[10px] uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all"
              aria-label={`Book ${pkg.title}`}
            >
              Book Now
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowReviews(!showReviews)} 
          className="text-[10px] text-emerald-400/70 hover:text-emerald-300 transition"
          aria-label={showReviews ? `Hide reviews for ${pkg.title}` : `Show reviews for ${pkg.title}`}
        >
          {showReviews ? 'Hide Reviews' : 'Show Reviews'} 📝
        </button>
        {showReviews && <ReviewSection packageId={pkg.id} />}
      </div>
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function PremiumMakkahPortal(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userDistrict, setUserDistrict] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);
  const [showConfirmEmail, setShowConfirmEmail] = useState<boolean>(false);

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  const [packageType, setPackageType] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedBooking, setSelectedBooking] = useState<PackageData | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [travelDate, setTravelDate] = useState<string>('');
  const [passengers, setPassengers] = useState<{ name: string; passport: string }[]>([{ name: '', passport: '' }]);
  const [showBookingSlip, setShowBookingSlip] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'simulation' | 'umrah' | 'hajj' | 'sites' | 'adab' | 'transport' | 'duas' | 'map' | 'packages' | 'admin' | 'prayer' | 'tools'>('simulation');

  const [playingDuaId, setPlayingDuaId] = useState<number | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [nextPrayer, setNextPrayer] = useState<string>('');

  const [compareList, setCompareList] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  const [tawafAudioPlaying, setTawafAudioPlaying] = useState<boolean>(false);
  const tawafAudioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState<string>('');

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFav = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFav));
      return newFav;
    });
  };

  // Fetch prayer times & clock
  useEffect(() => {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=Saudi+Arabia')
      .then(res => res.json())
      .then(data => {
        setPrayerTimes(data.data.timings);
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const now = new Date();
        const currentHour = now.getHours() * 60 + now.getMinutes();
        let nextP = 'Fajr';
        for (let p of prayers) {
          const [h, m] = data.data.timings[p].split(':').map(Number);
          if (h * 60 + m > currentHour) { nextP = p; break; }
        }
        setNextPrayer(nextP);
      })
      .catch(() => {
        const fb = { Fajr: '04:30', Dhuhr: '12:15', Asr: '15:45', Maghrib: '18:55', Isha: '20:25' };
        setPrayerTimes(fb);
        setNextPrayer('Fajr');
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const makkahTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' }));
      setCurrentTime(makkahTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchType = packageType ? pkg.tier === packageType : true;
      const matchDuration = duration ? pkg.days.includes(duration) : true;
      const matchSearch = searchQuery ? pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || pkg.hotelMakkah.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchType && matchDuration && matchSearch;
    });
  }, [packageType, duration, searchQuery]);

  // Strong password validation
  const isPasswordStrong = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && district) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserDistrict(district);
      setShowAuthModal(false);
      setCurrentPage(district === 'admin' ? 'admin' : 'portal');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrong(password)) {
      alert('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setShowConfirmEmail(true);
  };

  const confirmEmail = () => {
    setIsEmailConfirmed(true);
    setShowConfirmEmail(false);
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserDistrict(district);
    setShowAuthModal(false);
    setCurrentPage('portal');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserDistrict('');
    setCurrentPage('home');
    if (tawafAudioRef.current) {
      tawafAudioRef.current.pause();
      setTawafAudioPlaying(false);
    }
  };

  const handleVoicePlayback = (dua: Dua) => {
    if ('speechSynthesis' in window) {
      if (playingDuaId === dua.id) {
        window.speechSynthesis.cancel();
        setPlayingDuaId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${dua.transliteration}. ${dua.urduMeaning}`);
      utterance.onend = () => setPlayingDuaId(null);
      utterance.onerror = () => setPlayingDuaId(null);
      setPlayingDuaId(dua.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startBooking = (pkg: PackageData) => {
    setSelectedBooking(pkg);
    setBookingStep(1);
    setPassengerCount(1);
    setPassengers([{ name: '', passport: '' }]);
    setTravelDate('');
  };

  const nextBookingStep = () => setBookingStep(prev => Math.min(prev + 1, 3));
  const prevBookingStep = () => setBookingStep(prev => Math.max(prev - 1, 1));

  const confirmBooking = () => {
    setShowBookingSlip(true);
    setSelectedBooking(null);
  };

  const toggleCompare = (id: number) => {
    setCompareList(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const playRitualStepAudio = (step: RitualStep) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${step.description} Do's: ${step.doList.join(', ')}. Don'ts: ${step.dontList.join(', ')}`);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleTawafAudio = () => {
    if (tawafAudioRef.current) {
      if (tawafAudioPlaying) {
        tawafAudioRef.current.pause();
      } else {
        tawafAudioRef.current.play().catch(() => {});
      }
      setTawafAudioPlaying(!tawafAudioPlaying);
    } else {
      const audio = new Audio('/audio/tawaf-bg.mp3');
      audio.loop = true;
      tawafAudioRef.current = audio;
      audio.play().then(() => setTawafAudioPlaying(true)).catch(() => {});
      audio.addEventListener('ended', () => setTawafAudioPlaying(false));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <>
      {/* ===== ANIMATED GRADIENT TEXT STYLES ===== */}
      <style>{`
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient-shift 8s ease infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-fast {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
        
        {/* ===== NEW BACKGROUND: Deep sapphire with subtle geometric pattern and glowing rings ===== */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Base gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a1628_0%,_#0b1a2e_50%,_#060e1a_100%)]"></div>
          
          {/* Glowing rings - like celestial halos */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-emerald-500/5 animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-amber-400/5 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-teal-400/5 animate-pulse" style={{ animationDuration: '16s', animationDelay: '4s' }}></div>
          
          {/* Soft glowing orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[100px]"></div>
          
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMCAzMCA2ME0wIDMwIDYwIDMwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')]"></div>
        </div>

        {/* Top bar */}
        {!isLoggedIn && (
          <div className="relative z-40 bg-slate-900/70 backdrop-blur-xl border-b border-emerald-400/10 py-2 px-4 text-center text-[10px] text-slate-400 flex justify-between items-center max-w-7xl mx-auto">
            <span className="italic">Phone +92 300 1234567 | Email info@haramainelite.pk</span>
            <div className="flex gap-4 text-slate-500"><span>PK</span><span>SA</span><span>English</span></div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`${isLoggedIn ? 'bg-slate-900/80 backdrop-blur-xl border-b border-emerald-400/10' : 'bg-slate-950/70 backdrop-blur-md border-b border-emerald-400/5'} sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <motion.div
                className="text-emerald-400 font-black text-3xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🕋
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-300 animate-gradient">
                  Haramain Elite Travels
                </h1>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider italic">Spiritual Journeys • Since 2010</p>
              </div>
              {prayerTimes && nextPrayer && (
                <div className="ml-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-3 py-1 text-[10px] backdrop-blur-sm">
                  <span className="text-emerald-300 font-bold">{nextPrayer}</span>
                  <span className="text-slate-300">{prayerTimes[nextPrayer]}</span>
                  <span className="text-slate-500 text-[8px]">MAK</span>
                  <span className="text-slate-400 border-l border-slate-600 pl-2 ml-1 font-mono">{currentTime}</span>
                </div>
              )}
            </div>

            <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-wider">
              {['home', 'packages', 'duas', 'about'].map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`hover:text-emerald-400 transition-colors relative ${currentPage === page ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {page}
                  {currentPage === page && <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full"></span>}
                </button>
              ))}
            </div>

            <div>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full hover:bg-emerald-500/20 transition-all shadow-lg shadow-emerald-500/10">Exit ({userDistrict})</button>
              ) : (
                <button onClick={() => { setShowAuthModal(true); setAuthMode('login'); }} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-6 py-2.5 rounded-full shadow-lg shadow-amber-500/30 text-xs uppercase tracking-wider hover:brightness-110 transition-all">Login / Register</button>
              )}
            </div>
          </div>
        </nav>

        <main className="relative z-10">
          {!isLoggedIn && currentPage === 'home' && (
            <>
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="relative overflow-hidden min-h-[70vh] flex items-center"
              >
                <div className="absolute inset-0">
                  <img src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover opacity-25 brightness-40" alt="Makkah Haram" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950"></div>
                </div>
                <motion.div variants={itemVariants} className="relative z-20 max-w-7xl mx-auto px-6 text-center md:text-left py-20">
                  <motion.div
                    variants={itemVariants}
                    className="inline-block bg-emerald-500/10 border border-emerald-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-4 italic backdrop-blur-sm animate-gradient-fast"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Premium Verified Hajj & Umrah Services 2026
                  </motion.div>
                  <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black text-white uppercase leading-tight max-w-4xl">
                    Direct Luxury Stays <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-200 animate-gradient">
                      Inside Makkah Clock Tower
                    </span>
                  </motion.h1>
                  <motion.p variants={itemVariants} className="text-sm text-slate-200 mt-6 max-w-2xl italic">Experience zero‑distance proximity to the Haram with our hand‑picked spiritual packages. Authentic, ministry‑approved journeys since 2010.</motion.p>
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage('packages')}
                    className="mt-8 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black px-8 py-4 rounded-full text-xs uppercase tracking-widest shadow-2xl shadow-amber-500/30 transition-all"
                  >
                    Explore Packages
                  </motion.button>
                </motion.div>
              </motion.section>

              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="bg-slate-900/60 backdrop-blur-xl border-y border-emerald-400/10 py-6 px-4"
              >
                <div className="max-w-5xl mx-auto flex flex-wrap justify-around items-center gap-6 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} className="flex items-center gap-2"><span className="text-emerald-400 text-xl">✔</span> Ministry Approved</motion.div>
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} className="flex items-center gap-2"><span className="text-emerald-400 text-xl">✔</span> 15+ Years Experience</motion.div>
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} className="flex items-center gap-2"><span className="text-emerald-400 text-xl">✔</span> 8000+ Happy Pilgrims</motion.div>
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} className="flex items-center gap-2"><span className="text-emerald-400 text-xl">✔</span> Secure SSL Payments</motion.div>
                </div>
              </motion.section>

              {/* New Features Section on Homepage */}
              <section className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <WeatherWidget />
                  <CurrencyConverter />
                  <HajjCountdown />
                </div>
              </section>

              <section className="max-w-7xl mx-auto px-4 py-16">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={containerVariants}
                  className="text-center mb-10"
                >
                  <motion.h2 variants={itemVariants} className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-200 animate-gradient uppercase">
                    Our Sacred Packages
                  </motion.h2>
                  <motion.div variants={itemVariants} className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-amber-400 mx-auto mt-2 rounded-full"></motion.div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10 bg-slate-900/40 backdrop-blur-lg p-4 rounded-2xl border border-emerald-400/10 shadow-xl">
                  <label htmlFor="search-packages" className="sr-only">Search packages</label>
                  <input
                    id="search-packages"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search packages by title or hotel"
                    className="bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm"
                  />
                  <label htmlFor="filter-tier" className="sr-only">Filter by tier</label>
                  <select
                    id="filter-tier"
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    aria-label="Filter packages by tier"
                    className="bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm cursor-pointer"
                  >
                    <option value="">All Tiers</option>
                    <option value="economy">Economy</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                  <label htmlFor="filter-duration" className="sr-only">Filter by duration</label>
                  <select
                    id="filter-duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    aria-label="Filter packages by duration"
                    className="bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm cursor-pointer"
                  >
                    <option value="">Any Duration</option>
                    <option value="7">7 Days</option>
                    <option value="10">10 Days</option>
                    <option value="14">14 Days</option>
                    <option value="21">21 Days</option>
                  </select>
                  <button 
                    onClick={() => { setPackageType(''); setDuration(''); setSearchQuery(''); }} 
                    className="bg-slate-800/80 text-slate-300 border border-white/10 rounded-full p-3 text-xs font-bold uppercase hover:bg-slate-700/80 backdrop-blur-sm transition-all"
                    aria-label="Reset all filters"
                  >
                    Reset
                  </button>
                </div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      compareList={compareList}
                      toggleCompare={toggleCompare}
                      startBooking={startBooking}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                    />
                  ))}
                  {filteredPackages.length === 0 && <div className="col-span-full text-center py-10 text-slate-500">No packages match.</div>}
                </motion.div>

                {compareList.length > 1 && (
                  <div className="mt-10 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20 shadow-xl">
                    <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 mb-4">Comparison ({compareList.length})</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-slate-300">
                        <thead><tr className="border-b border-emerald-400/20"><th className="text-left p-2">Feature</th>{compareList.map(id => { const pkg = packages.find(p => p.id === id)!; return <th key={id} className="p-2 text-left">{pkg.title}</th>; })}</tr></thead>
                        <tbody>
                          {['tier', 'price', 'days', 'hotelMakkah', 'hotelMadinah', 'transport', 'seatsLeft'].map(field => (
                            <tr key={field} className="border-b border-white/5"><td className="p-2 capitalize font-bold">{field}</td>{compareList.map(id => { const pkg = packages.find(p => p.id === id)!; const value = pkg[field as keyof PackageData]; return <td key={id} className="p-2">{value}</td>; })}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}

          {isLoggedIn && (
            <AnimatePresence mode="wait">
              <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col">
                <div className="bg-slate-900/60 backdrop-blur-xl border-b border-emerald-400/10 px-6 py-3 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">{userDistrict === 'admin' ? 'ADMIN MODE' : `WELCOME, ${userDistrict}`}</span>
                  <span className="text-[10px] text-slate-400">{userEmail}</span>
                </div>
                <div className="flex-1 flex">
                  <aside className="w-64 bg-slate-900/70 backdrop-blur-xl border-r border-emerald-400/10 p-4 space-y-2 hidden md:block">
                    {[
                      { id: 'simulation', label: 'Live Tawaf View' },
                      { id: 'umrah', label: 'Umrah Guide' },
                      { id: 'hajj', label: 'Hajj Guide' },
                      { id: 'sites', label: 'Sacred Sites' },
                      { id: 'adab', label: 'Adab & Niyyat' },
                      { id: 'transport', label: 'Transport Info' },
                      { id: 'duas', label: 'Prophetic Duas' },
                      { id: 'map', label: 'Map & Qibla' },
                      { id: 'packages', label: 'Package DB' },
                      { id: 'prayer', label: 'Prayer Times' },
                      { id: 'tools', label: '🛠️ Tools' },
                      ...(userDistrict === 'admin' ? [{ id: 'admin', label: 'Admin Panel' }] : [] as any[])
                    ].map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 shadow-glow' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>{tab.label}</button>
                    ))}
                  </aside>
                  <section className="flex-1 p-6 bg-slate-950/30 backdrop-blur-sm overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {activeTab === 'simulation' && (
                        <motion.div key="sim" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-6">
                          <h2 className="text-xl font-black text-white">Live Tawaf Experience</h2>
                          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 h-[500px] shadow-2xl shadow-emerald-500/10">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/ns1Fb5LAPvM?si=oPtWys4sAXCGDr0i&autoplay=1&mute=1&loop=1&playlist=ns1Fb5LAPvM"
                              title="Tawaf around Kaaba - Live"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                            <div className="absolute bottom-4 right-4 z-10">
                              <button onClick={toggleTawafAudio} className={`px-4 py-2 rounded-full text-xs font-bold uppercase shadow-lg ${tawafAudioPlaying ? 'bg-emerald-500/90 text-white shadow-emerald-500/30' : 'bg-amber-500/90 text-slate-950 shadow-amber-500/30'}`}>
                                {tawafAudioPlaying ? 'Stop Audio' : 'Play Recitation'}
                              </button>
                            </div>
                            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-slate-300 border border-emerald-400/20">
                              <span className="text-emerald-400 font-bold">Live View:</span> Tawaf around the Kaaba
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'umrah' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-4">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <h2 className="text-xl font-black text-white">Umrah Guide</h2>
                            <DownloadPDFGuide />
                          </div>
                          <div id="guide-content">
                            {umrahSteps.map(step => (
                              <details key={step.id} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-emerald-400/10 p-5 shadow-xl mb-3">
                                <summary className="cursor-pointer flex justify-between items-center"><span className="font-bold text-emerald-400">{step.title}</span><span className="text-slate-400 text-xs">▼</span></summary>
                                <p className="mt-2 text-xs text-slate-300">{step.description}</p>
                                <div className="grid md:grid-cols-2 gap-4 mt-3">
                                  <div><h4 className="text-emerald-400 text-[10px] font-bold">Do's</h4><ul className="text-xs text-slate-400 list-disc pl-4">{step.doList.map((d,i)=><li key={i}>{d}</li>)}</ul></div>
                                  <div><h4 className="text-amber-400 text-[10px] font-bold">Don'ts</h4><ul className="text-xs text-slate-400 list-disc pl-4">{step.dontList.map((d,i)=><li key={i}>{d}</li>)}</ul></div>
                                </div>
                                <button onClick={() => playRitualStepAudio(step)} className="mt-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-emerald-500/20 transition-all">Listen</button>
                              </details>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'hajj' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-4">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <h2 className="text-xl font-black text-white">Hajj Guide</h2>
                            <DownloadPDFGuide />
                          </div>
                          <div id="guide-content">
                            {hajjSteps.map(step => (
                              <details key={step.id} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-emerald-400/10 p-5 shadow-xl mb-3">
                                <summary className="cursor-pointer flex justify-between items-center"><span className="font-bold text-emerald-400">{step.title}</span><span className="text-slate-400 text-xs">▼</span></summary>
                                <p className="mt-2 text-xs text-slate-300">{step.description}</p>
                                <div className="grid md:grid-cols-2 gap-4 mt-3">
                                  <div><h4 className="text-emerald-400 text-[10px] font-bold">Do's</h4><ul className="text-xs text-slate-400 list-disc pl-4">{step.doList.map((d,i)=><li key={i}>{d}</li>)}</ul></div>
                                  <div><h4 className="text-amber-400 text-[10px] font-bold">Don'ts</h4><ul className="text-xs text-slate-400 list-disc pl-4">{step.dontList.map((d,i)=><li key={i}>{d}</li>)}</ul></div>
                                </div>
                                <button onClick={() => playRitualStepAudio(step)} className="mt-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-emerald-500/20 transition-all">Listen</button>
                              </details>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'sites' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="grid md:grid-cols-2 gap-6">
                          <h2 className="text-xl font-black text-white col-span-full">Sacred Sites</h2>
                          {sacredSites.map(site => (
                            <details key={site.id} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-emerald-400/10 p-5 shadow-xl">
                              <summary className="cursor-pointer flex justify-between items-center">
                                <div><span className="text-emerald-400 font-bold">{site.name}</span><span className="text-slate-500 text-xs ml-2">{site.nameUrdu}</span></div>
                                <span className="text-slate-400">▼</span>
                              </summary>
                              <div className="mt-3 rounded-xl overflow-hidden border border-emerald-400/20">
                                <img 
                                  src={site.image} 
                                  alt={site.name} 
                                  className="w-full h-48 object-cover" 
                                  loading="lazy"
                                  onError={(e) => {
                                    const fallbacks: Record<number, string> = {
                                      2: "https://images.unsplash.com/photo-1591604466107-5af673c6a1de?auto=format&fit=crop&w=600&q=80",
                                      3: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=600&q=80",
                                      4: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
                                      6: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
                                      7: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80",
                                      8: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80",
                                      9: "https://images.unsplash.com/photo-1559767914-bd3c83e7f2b4?auto=format&fit=crop&w=600&q=80"
                                    };
                                    if (fallbacks[site.id]) {
                                      (e.target as HTMLImageElement).src = fallbacks[site.id];
                                    }
                                  }}
                                />
                              </div>
                              <div className="space-y-3 mt-3 text-xs">
                                <div className="bg-slate-800/60 p-3 rounded-xl backdrop-blur-sm"><h4 className="text-emerald-400 font-bold mb-1">Description</h4><p>{site.descriptionEn}</p><p className="text-slate-400">{site.descriptionUrdu}</p></div>
                                <div className="bg-slate-800/60 p-3 rounded-xl backdrop-blur-sm"><h4 className="text-emerald-400 font-bold mb-1">History</h4><p>{site.historyEn}</p><p className="text-slate-400">{site.historyUrdu}</p></div>
                                <div className="bg-slate-800/60 p-3 rounded-xl backdrop-blur-sm"><h4 className="text-emerald-400 font-bold mb-1">Significance</h4><p>{site.significance}</p></div>
                                <div className="text-slate-500"><span className="font-bold">Location:</span> {site.location}</div>
                                <div className="bg-slate-800/60 p-3 rounded-xl backdrop-blur-sm"><h4 className="text-emerald-400 font-bold mb-1">Transport</h4><p>{site.transportEn}</p><p className="text-slate-400">{site.transportUrdu}</p></div>
                              </div>
                            </details>
                          ))}
                        </motion.div>
                      )}
                      {activeTab === 'adab' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-4">
                          <h2 className="text-xl font-black text-white">Adab & Niyyat</h2>
                          <div className="grid md:grid-cols-2 gap-4">
                            {adabList.map(item => (
                              <div key={item.id} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-emerald-400/10 p-5 shadow-xl">
                                <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">{item.titleEn} / <span className="text-slate-300">{item.titleUrdu}</span></h3>
                                <p className="text-xs text-slate-400 mt-2">{item.detailEn}</p>
                                <p className="text-xs text-slate-500 mt-1">{item.detailUrdu}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'transport' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-4">
                          <h2 className="text-xl font-black text-white">Transport Guide</h2>
                          {sacredSites.map(site => (
                            <div key={site.id} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-emerald-400/10 p-5 shadow-xl">
                              <h3 className="text-emerald-400 font-bold text-sm">{site.name} – Transport</h3>
                              <p className="text-xs text-slate-300 mt-1">{site.transportEn}</p>
                              <p className="text-xs text-slate-500 mt-1">{site.transportUrdu}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                      {activeTab === 'duas' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                          <h2 className="text-xl font-black text-white">Duas</h2>
                          {duas.map(dua => (
                            <div key={dua.id} className="p-5 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-emerald-400/10 shadow-xl">
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{dua.location}</span>
                                <button onClick={() => handleVoicePlayback(dua)} className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border transition-all ${playingDuaId === dua.id ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800/60 text-slate-400 border-white/10 hover:border-emerald-400/30'}`}>{playingDuaId === dua.id ? 'Stop' : 'Listen'}</button>
                              </div>
                              <p className="text-right text-2xl font-arabic text-amber-100 leading-loose mt-2">{dua.arabic}</p>
                              <p className="text-xs text-slate-400 italic">{dua.transliteration}</p>
                              <p className="text-xs text-emerald-400">{dua.urduMeaning}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                      {activeTab === 'map' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                          <MapAndQibla />
                        </motion.div>
                      )}
                      {activeTab === 'packages' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="grid md:grid-cols-2 gap-4">
                          <h2 className="col-span-full text-xl font-black text-white">Package DB</h2>
                          {packages.map(pkg => (
                            <div key={pkg.id} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/10 shadow-xl flex flex-col justify-between">
                              <div><span className="text-[9px] uppercase font-black text-emerald-400">{pkg.tier}</span><h4 className="font-bold text-white text-sm mt-1">{pkg.title}</h4></div>
                              <div className="text-[11px] text-slate-400 mt-3 space-y-1"><p>{pkg.hotelMakkah}</p><p>{pkg.hotelMadinah}</p><p>{pkg.transport}</p></div>
                              <div className="mt-3 flex justify-between items-center border-t border-white/5 pt-3"><span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-amber-300">{pkg.price}</span><span className="text-[10px] text-slate-500">{pkg.seatsLeft} left</span></div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                      {activeTab === 'prayer' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-6">
                          <h2 className="text-xl font-black text-white">Prayer Times in Makkah</h2>
                          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-emerald-400 font-bold text-sm">Current Makkah Time</span>
                              <span className="text-2xl font-mono text-white bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-emerald-400/10">{currentTime}</span>
                            </div>
                            {prayerTimes ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {Object.entries(prayerTimes).map(([name, time]) => (
                                  <div key={name} className={`bg-slate-800/60 rounded-xl p-3 text-center border backdrop-blur-sm ${nextPrayer === name ? 'border-emerald-400 bg-emerald-500/10 shadow-glow' : 'border-white/5'}`}>
                                    <p className="text-[10px] uppercase text-slate-400 font-bold">{name}</p>
                                    <p className={`text-sm font-bold ${nextPrayer === name ? 'text-emerald-400' : 'text-white'}`}>{time as string}</p>
                                    {nextPrayer === name && <span className="text-[8px] text-amber-400 font-bold">Next</span>}
                                  </div>
                                ))}
                              </div>
                            ) : <p className="text-slate-400">Loading...</p>}
                            <p className="text-[10px] text-slate-500 mt-4 italic">* Timings based on Makkah (UTC+3).</p>
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'tools' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-6">
                          <h2 className="text-xl font-black text-white">🛠️ Tools</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <WeatherWidget />
                            <CurrencyConverter />
                            <HajjCountdown />
                            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/10 shadow-xl">
                              <h4 className="text-xs font-bold text-emerald-400 uppercase mb-3">Favorites</h4>
                              {favorites.length === 0 ? (
                                <p className="text-xs text-slate-400">No favorites yet. ❤️ packages you like!</p>
                              ) : (
                                <ul className="text-xs text-slate-300 space-y-1">
                                  {favorites.map(id => {
                                    const pkg = packages.find(p => p.id === id);
                                    return pkg ? <li key={id} className="bg-slate-800/60 p-2 rounded-lg">{pkg.title}</li> : null;
                                  })}
                                </ul>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'admin' && userDistrict === 'admin' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-6">
                          <h2 className="text-xl font-black text-white">Admin Dashboard</h2>
                          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20 shadow-xl">
                            <h3 className="text-sm font-black text-emerald-400 uppercase">Recent Bookings</h3>
                            <table className="w-full mt-4 text-xs text-slate-300">
                              <thead><tr className="border-b border-emerald-400/20 text-left"><th className="p-2">ID</th><th className="p-2">Pilgrim</th><th className="p-2">Package</th><th className="p-2">Date</th><th className="p-2">Status</th></tr></thead>
                              <tbody>
                                {[1,2,3].map(i => (
                                  <tr key={i} className="border-b border-white/5"><td className="p-2">#00{i}</td><td className="p-2">Test User {i}</td><td className="p-2">{packages[i-1]?.title || 'N/A'}</td><td className="p-2">2026-0{i}-15</td><td className="p-2"><span className="text-emerald-400">Confirmed</span></td></tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoggedIn && currentPage === 'about' && (
            <section className="max-w-4xl mx-auto px-4 py-20 text-center">
              <h2 className="text-2xl font-black text-white uppercase">About Haramain Elite</h2>
              <p className="text-sm text-slate-400 mt-6 italic">Since 2010, Haramain Elite Travels has served thousands of Pakistani pilgrims with trusted Hajj and Umrah arrangements.</p>
            </section>
          )}
          {!isLoggedIn && currentPage === 'duas' && (
            <section className="max-w-4xl mx-auto px-4 py-20">
              <h2 className="text-2xl font-black text-white text-center uppercase">Prophetic Duas</h2>
              <div className="space-y-6 mt-10">
                {duas.slice(0, 10).map(dua => (
                  <div key={dua.id} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/10 shadow-xl">
                    <span className="text-[10px] font-black text-emerald-400">{dua.location}</span>
                    <p className="text-right text-2xl font-arabic text-amber-100 mt-2">{dua.arabic}</p>
                    <p className="text-xs text-slate-400 italic mt-2">{dua.transliteration}</p>
                    <p className="text-xs text-emerald-400 mt-1">{dua.urduMeaning}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <footer className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-emerald-400/10 py-8 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-slate-400">
            <div><h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 uppercase mb-3">Haramain Elite</h4><p className="italic">Spiritual travel experts.</p></div>
            <div><h4 className="font-bold text-emerald-400 uppercase mb-3">Links</h4><ul className="space-y-1"><li><button onClick={() => setCurrentPage('home')}>Home</button></li><li><button onClick={() => setCurrentPage('packages')}>Packages</button></li><li><button onClick={() => setShowAuthModal(true)}>Login</button></li></ul></div>
            <div><h4 className="font-bold text-emerald-400 uppercase mb-3">Contact</h4><p>Phone +92 300 1234567</p><p>Email info@haramainelite.pk</p></div>
            <div><h4 className="font-bold text-emerald-400 uppercase mb-3">Secure</h4><p>SSL Encrypted</p><p>Visa / EasyPaisa</p></div>
          </div>
          <div className="text-center mt-8 text-[10px] text-slate-600 border-t border-emerald-400/10 pt-4 italic">&copy; 2026 Haramain Elite Travels. Ministry Audited.</div>
        </footer>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/80">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-2xl w-full max-w-md relative shadow-2xl shadow-emerald-500/10 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">&times;</button>
              <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400 text-center uppercase">{forgotPassword ? 'Reset Password' : authMode === 'login' ? 'Sign In' : 'Create Account'}</h3>
              <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleRegister} className="space-y-4 mt-6">
                <div>
                  <label htmlFor="auth-email" className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Email</label>
                  <input 
                    id="auth-email"
                    type="email" 
                    placeholder="pilgrim@example.com" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm" 
                    aria-label="Enter your email address"
                  />
                </div>
                {!forgotPassword && (
                  <>
                    <div>
                      <label htmlFor="auth-password" className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Password</label>
                      <input 
                        id="auth-password"
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm" 
                        aria-label="Enter your password"
                      />
                      <p className="text-[8px] text-slate-500 mt-1">Min 8 chars, upper, lower, number, special</p>
                    </div>
                    {authMode === 'register' && (
                      <div>
                        <label htmlFor="auth-confirm-password" className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">Confirm Password</label>
                        <input 
                          id="auth-confirm-password"
                          type="password" 
                          placeholder="Confirm password" 
                          required 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          className="w-full bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm" 
                          aria-label="Confirm your password"
                        />
                      </div>
                    )}
                  </>
                )}
                <div>
                  <label htmlFor="auth-district" className="block text-[10px] uppercase text-slate-400 mb-1 font-bold">District</label>
                  <input 
                    id="auth-district"
                    type="text" 
                    placeholder="e.g. Gujrat" 
                    required 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)} 
                    className="w-full bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm" 
                    aria-label="Enter your district"
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black py-3 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:brightness-110 transition-all">{forgotPassword ? 'Send Reset Link' : authMode === 'login' ? 'Login' : 'Register'}</button>
                <div className="text-center text-xs text-slate-400 mt-2 space-x-2">
                  {!forgotPassword && (
                    <>
                      <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="underline hover:text-emerald-400">{authMode === 'login' ? 'Create new account' : 'Already have account?'}</button>
                      <button type="button" onClick={() => setForgotPassword(true)} className="underline hover:text-emerald-400">Forgot password?</button>
                    </>
                  )}
                  {forgotPassword && <button type="button" onClick={() => setForgotPassword(false)} className="underline hover:text-emerald-400">Back to login</button>}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Email Confirmation Modal */}
        {showConfirmEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/80">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-2xl w-full max-w-md relative shadow-2xl shadow-emerald-500/10 text-center">
              <h3 className="text-lg font-black text-emerald-400 uppercase">Confirm Email</h3>
              <p className="text-xs text-slate-300 mt-3">We've sent a confirmation link to <span className="text-amber-400">{email}</span></p>
              <p className="text-xs text-slate-400 mt-1">Click the button below to confirm (simulated).</p>
              <button onClick={confirmEmail} className="mt-4 bg-emerald-500 text-white font-black px-6 py-3 rounded-full text-xs uppercase shadow-lg shadow-emerald-500/30 hover:brightness-110 transition-all">Confirm Email</button>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/80">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 p-8 rounded-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto shadow-2xl shadow-emerald-500/10">
              <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">&times;</button>
              <h3 className="text-base font-black text-emerald-400 uppercase text-center mb-4">Book Package</h3>
              <div className="text-xs text-slate-300 space-y-1 mb-4"><p className="font-bold text-white">{selectedBooking.title}</p><p>{selectedBooking.days} | {selectedBooking.tier}</p><p className="text-amber-400 font-black">{selectedBooking.price}</p></div>
              {bookingStep === 1 && (
                <div className="space-y-3">
                  <label htmlFor="booking-pilgrims" className="block text-[10px] uppercase text-slate-400 font-bold">Number of Pilgrims</label>
                  <input 
                    id="booking-pilgrims"
                    type="number" 
                    min="1" 
                    value={passengerCount} 
                    onChange={(e) => { const num = +e.target.value; setPassengerCount(num); setPassengers(Array.from({length: num}, () => ({name: '', passport: ''}))); }} 
                    aria-label="Number of pilgrims" 
                    className="w-full bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm" 
                  />
                  <label htmlFor="booking-date" className="block text-[10px] uppercase text-slate-400 font-bold">Travel Date</label>
                  <input 
                    id="booking-date"
                    type="date" 
                    value={travelDate} 
                    onChange={(e) => setTravelDate(e.target.value)} 
                    aria-label="Preferred travel date" 
                    className="w-full bg-slate-950/80 text-white rounded-full p-3 text-xs border border-white/10 focus:border-emerald-400 outline-none backdrop-blur-sm" 
                  />
                  <button onClick={nextBookingStep} className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black py-3 rounded-full text-xs shadow-lg shadow-amber-500/30">Next</button>
                </div>
              )}
              {bookingStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white">Passenger Details</h4>
                  {passengers.map((p, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2">
                      <label htmlFor={`passenger-name-${idx}`} className="sr-only">Passenger {idx+1} name</label>
                      <input 
                        id={`passenger-name-${idx}`}
                        placeholder={`Name ${idx+1}`} 
                        value={p.name} 
                        onChange={(e) => { const newPass = [...passengers]; newPass[idx].name = e.target.value; setPassengers(newPass); }} 
                        aria-label={`Passenger ${idx+1} name`} 
                        className="bg-slate-950/80 text-white rounded-full p-2 text-xs border border-white/10 focus:border-emerald-400 outline-none" 
                      />
                      <label htmlFor={`passenger-passport-${idx}`} className="sr-only">Passenger {idx+1} passport number</label>
                      <input 
                        id={`passenger-passport-${idx}`}
                        placeholder={`Passport No.`} 
                        value={p.passport} 
                        onChange={(e) => { const newPass = [...passengers]; newPass[idx].passport = e.target.value; setPassengers(newPass); }} 
                        aria-label={`Passenger ${idx+1} passport number`} 
                        className="bg-slate-950/80 text-white rounded-full p-2 text-xs border border-white/10 focus:border-emerald-400 outline-none" 
                      />
                    </div>
                  ))}
                  <div className="flex gap-2"><button onClick={prevBookingStep} className="flex-1 bg-slate-800/80 text-slate-400 py-2 rounded-full text-xs font-bold backdrop-blur-sm">Back</button><button onClick={nextBookingStep} className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black py-2 rounded-full text-xs shadow-lg shadow-amber-500/30">Next</button></div>
                </div>
              )}
              {bookingStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-xs text-slate-300">
                    <p className="font-bold text-white mb-2">Summary</p><p>Package: {selectedBooking.title}</p><p>Pilgrims: {passengerCount}</p><p>Date: {travelDate}</p><p className="text-amber-400 font-black mt-2">Total: {selectedBooking.price}</p>
                  </div>
                  <div className="text-[10px] text-slate-400">Select Payment:</div>
                  <div className="grid grid-cols-3 gap-2">{['Visa','EasyPaisa','Bank'].map(m => <button key={m} className="bg-slate-800/80 border border-white/10 rounded-full p-2 text-xs text-slate-300 hover:bg-amber-500/20 hover:border-amber-400/50 transition-all backdrop-blur-sm">{m}</button>)}</div>
                  <div className="flex gap-2"><button onClick={prevBookingStep} className="flex-1 bg-slate-800/80 text-slate-400 py-2 rounded-full text-xs font-bold backdrop-blur-sm">Back</button><button onClick={confirmBooking} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black py-2 rounded-full text-xs shadow-lg shadow-emerald-500/30">Confirm</button></div>
                </div>
              )}
            </div>
          </div>
        )}

        {showBookingSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/85">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 p-6 rounded-2xl w-full max-w-md text-xs text-slate-300 space-y-3 shadow-2xl shadow-emerald-500/10">
              <h3 className="text-lg font-black text-emerald-400 uppercase text-center">Booking Confirmed!</h3>
              <p>Confirmation sent to your email.</p>
              <button onClick={() => setShowBookingSlip(false)} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black py-3 rounded-full uppercase shadow-lg shadow-emerald-500/30">Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}