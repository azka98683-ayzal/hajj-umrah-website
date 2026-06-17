import dynamic from 'next/dynamic';
import MakkahTower from '@/components/MakkahTower';
import StepGuide from '@/components/StepGuide';
import { motion } from 'framer-motion';
import { prisma } from '@/lib/db';
import Link from 'next/link';

// Dynamically import map to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// Type for Package (inferred from Prisma)
type PackageType = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  availableSeats: number;
};

export default async function Home() {
  const packages: PackageType[] = await prisma.package.findMany({ take: 3 });

  return (
    <div className="overflow-hidden">
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
          className="inline-block mt-6 bg-white text-emerald-700 px-6 py-3 rounded-full"
        >
          Explore Packages
        </Link>
      </motion.section>

      {/* Map Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Holy Sites Map</h2>
        <Map />
      </section>

      {/* Makkah Tower Section */}
      <section className="max-w-6xl mx-auto px-4">
        <MakkahTower />
      </section>

      {/* Step-by-Step Guide Section */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Complete Hajj & Umrah Guide</h2>
        <StepGuide />
      </section>

      {/* Packages Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Packages</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow p-6 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold">{pkg.name}</h3>
              <p className="text-gray-600 mt-2">{pkg.description}</p>
              <p className="text-3xl font-bold text-emerald-600 mt-4">
                ${(pkg.price / 100).toFixed(2)}
              </p>
              <Link
                href={`/packages/${pkg.id}`}
                className="mt-4 inline-block w-full text-center bg-emerald-600 text-white py-2 rounded"
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