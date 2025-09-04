'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function HeroSection() {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(textRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.4"
    );

    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <div 
        ref={heroRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1732308988547-bfbcf9171f69?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHw0fHxJbmRpYSUyMHRyYXZlbCUyMGRlc3RpbmF0aW9uc3xlbnwwfHx8fDE3NTY5NjcyOTB8MA&ixlib=rb-4.1.0&q=85')`
        }}
      />
      
      <Container className="relative z-10 h-full flex items-center justify-center text-center">
        <div ref={textRef} className="max-w-4xl mx-auto text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Discover India's Hidden Gems
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Experience the magic of incredible India with our curated holiday packages. 
            From majestic mountains to pristine beaches, create memories that last forever.
          </p>
          <div ref={buttonRef} className="space-x-4">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg">
              Explore Packages
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
              Plan Your Trip
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}