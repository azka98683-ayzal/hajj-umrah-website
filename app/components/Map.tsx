"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export default function MakkahTower() {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="bg-gradient-to-r from-amber-100 to-amber-200 p-6 rounded-2xl my-12">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-3xl font-bold text-amber-800">Abraj Al Bait (Makkah Royal Clock Tower)</h2>
          <p className="mt-2">World's 4th tallest building, 601m high. Largest clock face in the world (43m diameter).</p>
          <ul className="list-disc ml-6 mt-4 space-y-1">
            <li>🏨 5-star Fairmont Hotel</li>
            <li>🛍️ Shopping mall with 1000+ stores</li>
            <li>🕌 Prayer area for 10,000+ worshippers</li>
            <li>🌙 Islamic Museum</li>
            <li>🚁 Helipad on top</li>
          </ul>
        </div>
        <Image src="/makkah-tower.jpg" alt="Makkah Tower" width={500} height={300} className="rounded-xl shadow-lg" />
      </div>
    </motion.div>
  )
}