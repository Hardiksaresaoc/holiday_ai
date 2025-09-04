'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '@/components/HeroSection';
import PackagesSection from '@/components/PackagesSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const pageRef = useRef(null);

  useEffect(() => {
    // Smooth scroll animations
    gsap.utils.toArray('.animate-on-scroll').forEach((element) => {
      gsap.fromTo(element, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen">
      <HeroSection />
      <PackagesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}