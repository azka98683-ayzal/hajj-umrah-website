"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

const hajjSteps = [
  { id: 1, title: "Ihram", image: "/ihram.jpg", description: "Wear white unstitched clothes, make niyyah and recite Talbiyah.", dua: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ" },
  { id: 2, title: "Tawaf", image: "/tawaf.jpg", description: "Circumambulate Kaaba 7 times.", dua: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً" },
  { id: 3, title: "Sa'ee", image: "/safamarvah.jpg", description: "Walk 7 times between Safa and Marwah.", dua: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ" },
  { id: 4, title: "Arafat", image: "/arafat.jpg", description: "Stand at Arafat (Wuquf) on 9th Dhul Hijjah.", dua: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ" },
  { id: 5, title: "Muzdalifah", image: "/muzdalifah.jpg", description: "Collect pebbles, pray Maghrib & Isha together." },
  { id: 6, title: "Rami (Stoning)", image: "/jamarat.jpg", description: "Throw 7 pebbles at Jamarat." },
  { id: 7, title: "Qurbani", image: "/qurbani.jpg", description: "Sacrifice an animal." },
  { id: 8, title: "Halq/Taqsir", image: "/shave.jpg", description: "Shave or trim hair." },
]

export default function StepGuide() {
  const [active, setActive] = useState(1)
  const step = hajjSteps.find(s => s.id === active)!
  return (
    <div className="my-12">
      <div className="flex overflow-x-auto space-x-2 pb-4">
        {hajjSteps.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} className={`px-4 py-2 rounded-full ${active === s.id ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}>
            {s.title}
          </button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white p-6 rounded-xl shadow">
        <Image src={step.image} alt={step.title} width={800} height={400} className="rounded-lg object-cover h-64 w-full" />
        <h3 className="text-2xl font-bold mt-4">{step.title}</h3>
        <p className="text-gray-600 mt-2">{step.description}</p>
        {step.dua && <p className="mt-2 italic text-emerald-700">Dua: {step.dua}</p>}
      </motion.div>
    </div>
  )
}