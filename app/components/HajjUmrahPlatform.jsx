'use client';
import React from 'react';
import { motion } from 'framer-motion';

// 1. PREMIUM HERO SECTION WITH OVERLAYS
export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="text-center z-10 max-w-4xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-yellow-500 tracking-[0.2em] text-sm font-bold uppercase block mb-4"
        >
          Welcome To The Sacred Journey
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6"
        >
          Labaik <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-600">Allahumma</span> Labaik
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed"
        >
          Experience a seamless, premium, and spiritually enriching Hajj & Umrah pilgrimage with certified guides and luxury accommodations.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-semibold shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_40px_rgba(234,179,8,0.5)] transition duration-300 transform hover:scale-105">
            Explore Packages
          </button>
          <button className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium hover:bg-white/10 transition duration-300">
            View Virtual Guide
          </button>
        </motion.div>
      </div>

      {/* Rotating 3D Space Background Lines */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border border-emerald-500/10 rounded-full pointer-events-none"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] border border-yellow-500/5 rounded-full pointer-events-none"
      />
    </section>
  );
}

// 2. LUXURY PACKAGES SECTION
const packages = [
  { title: 'Economy Umrah', price: '$1,200', days: '10 Days', hotel: '3 Star Hotels' },
  { title: 'Premium Umrah', price: '$2,500', days: '14 Days', hotel: '5 Star Front Luxury' },
  { title: 'Elite Hajj Package', price: '$5,999', days: '21 Days', hotel: 'Clock Tower Luxury' },
];

export function Services() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Exclusive Pilgrimage Packages</h2>
        <p className="text-gray-400">All-inclusive premium services tailored for your ultimate comfort.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 rounded-3xl relative overflow-hidden shadow-2xl hover:border-yellow-500/40 hover:-translate-y-2 transition-all duration-300 group"
          >
            <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition">{pkg.title}</h3>
            <span className="text-4xl font-extrabold text-yellow-500 block my-4">{pkg.price}</span>
            <ul className="space-y-3 text-gray-300 border-t border-white/5 pt-4 mb-8">
              <li>✨ Duration: {pkg.days}</li>
              <li>🏨 Stay: {pkg.hotel}</li>
              <li>🚌 Transport: Luxury Private GMC</li>
              <li>🗺️ Ziyarat: Makkah & Madinah Included</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-semibold hover:bg-gradient-to-r hover:from-yellow-500 hover:to-amber-600 hover:text-black transition-all duration-300">
              Book Package
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// 3. INTERACTIVE A-Z RITUALS TIMELINE
const steps = [
  { day: 'Step 1', title: 'Ihram & Intentions', desc: 'Putting on the Ihram at the Miqat, performing two Rakahs, and making the formal Niyyah for Hajj or Umrah.' },
  { day: 'Step 2', title: 'Tawaf & Sa’ee', desc: 'Circling the Holy Kaaba seven times counter-clockwise, followed by walking seven times between Safa and Marwa.' },
  { day: 'Step 3', title: 'Mina (8th Dhul Hijjah)', desc: 'Arriving at the tent city of Mina, staying overnight, and performing five daily prayers starting from Dhuhr.' },
  { day: 'Step 4', title: 'Arafat (9th Dhul Hijjah)', desc: 'The pinnacle of Hajj. Standing on the plains of Arafat from Dhuhr until sunset, engaging in intense supplication (Dua).' },
  { day: 'Step 5', title: 'Muzdalifah & Jamarat', desc: 'Collecting pebbles at Muzdalifah, then performing the symbolic stoning of the devil (Ramy) at the Jamarat.' },
];

export function HajjGuide() {
  return (
    <section className="py-24 bg-black/40 border-y border-white/5 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Interactive A-Z Rituals Guide</h2>
          <p className="text-gray-400">Learn every milestone step of your holy pilgrimage perfectly.</p>
        </div>
        <div className="relative border-l border-yellow-500/30 ml-4 md:ml-32 space-y-12">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 group"
            >
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,1)] group-hover:scale-125 transition" />
              <span className="absolute left-[-140px] top-0 hidden md:block w-24 text-right text-sm font-mono text-yellow-500/70 tracking-wider">
                {step.day}
              </span>
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. ESSENTIAL DUA & PACKING PACK
export function DuaSection() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-8 rounded-3xl border-l-4 border-l-yellow-500"
      >
        <span className="text-yellow-500 text-xs font-mono tracking-widest uppercase block mb-2">Essential Supplication</span>
        <h3 className="text-2xl font-bold mb-4">Talbiyah (التلبية)</h3>
        <p className="text-3xl text-right text-amber-200/90 leading-loose mb-6 font-serif">
          لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ
        </p>
        <p className="text-gray-400 italic text-sm border-t border-white/5 pt-4">
          "In response to Your call I am here, O Allah, here I am."
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold">Pilgrimage Travel Checklist</h3>
        <p className="text-gray-400">Make sure you are fully equipped before onboarding your flight.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">🛄 Two Sets of Ihram</div>
          <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">📑 Valid Visa & Passport</div>
          <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">👟 Comfortable Footwear</div>
          <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3">💊 Required Vaccinations</div>
        </div>
      </motion.div>
    </section>
  );
}