'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Dynamically import components with proper client-side loading
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-emerald-400/20">
      <p className="text-slate-400">Loading map...</p>
    </div>
  ),
});

const MakkahTower = dynamic(() => import('@/components/MakkahTower'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-emerald-400/20">
      <p className="text-slate-400">Loading Makkah Tower...</p>
    </div>
  ),
});

const StepGuide = dynamic(() => import('@/components/StepGuide'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-emerald-400/20">
      <p className="text-slate-400">Loading guide...</p>
    </div>
  ),
});

// Simple package type
interface PackageType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  availableSeats: number;
}

export default function AdminPage() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages on client side
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        } else {
          // Fallback data if API fails
          setPackages([
            {
              id: '1',
              name: 'Standard Umrah',
              description: 'Complete Umrah package with 5-star hotels',
              price: 500000, // in cents
              duration: 7,
              availableSeats: 20,
            },
            {
              id: '2',
              name: 'Premium Hajj',
              description: 'VIP Hajj experience with exclusive services',
              price: 1500000,
              duration: 21,
              availableSeats: 10,
            },
            {
              id: '3',
              name: 'Ramadan Umrah',
              description: 'Special Umrah package during Ramadan',
              price: 750000,
              duration: 14,
              availableSeats: 15,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Fallback data
        setPackages([
          {
            id: '1',
            name: 'Standard Umrah',
            description: 'Complete Umrah package with 5-star hotels',
            price: 500000,
            duration: 7,
            availableSeats: 20,
          },
          {
            id: '2',
            name: 'Premium Hajj',
            description: 'VIP Hajj experience with exclusive services',
            price: 1500000,
            duration: 21,
            availableSeats: 10,
          },
          {
            id: '3',
            name: 'Ramadan Umrah',
            description: 'Special Umrah package during Ramadan',
            price: 750000,
            duration: 14,
            availableSeats: 15,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 text-xl animate-pulse">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-20 text-center"
      >
        <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} className="text-5xl font-bold">
          Your Spiritual Journey Awaits
        </motion.h1>
        <motion.p initial={{ y: 50 }} animate={{ y: 0 }} className="text-xl mt-4">
          Step-by-Step Guidance • Interactive Map • Complete Support
        </motion.p>
        <Link
          href="/packages"
          className="inline-block mt-6 bg-white text-emerald-700 px-6 py-3 rounded-full font-bold hover:shadow-lg transition"
        >
          Explore Packages
        </Link>
      </motion.section>

      {/* Map Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Holy Sites Map</h2>
        <Map />
      </section>

      {/* Makkah Tower Section */}
      <section className="max-w-6xl mx-auto px-4">
        <MakkahTower />
      </section>

      {/* Step-by-Step Guide Section */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Complete Hajj & Umrah Guide</h2>
        <StepGuide />
      </section>

      {/* Packages Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Popular Packages</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-emerald-400/20 p-6 hover:scale-105 transition-transform shadow-xl"
            >
              <h3 className="text-2xl font-bold text-emerald-300">{pkg.name}</h3>
              <p className="text-slate-300 mt-2">{pkg.description}</p>
              <div className="mt-4 space-y-1 text-sm text-slate-400">
                <p>Duration: {pkg.duration} days</p>
                <p>Available seats: {pkg.availableSeats}</p>
              </div>
              <p className="text-3xl font-bold text-amber-400 mt-4">
                ${(pkg.price / 100).toFixed(2)}
              </p>
              <Link
                href={`/packages/${pkg.id}`}
                className="mt-4 inline-block w-full text-center bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold py-2 rounded-full hover:shadow-lg shadow-amber-500/30 transition"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}