'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, MapPin, Headphones, Star, Plane } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "100% Safe & Secure",
    description: "Your safety is our priority with verified accommodations and trusted local guides."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you throughout your journey."
  },
  {
    icon: MapPin,
    title: "Expert Local Guides",
    description: "Experienced local guides who know the hidden gems and best spots."
  },
  {
    icon: Headphones,
    title: "Personalized Service",
    description: "Customized itineraries tailored to your preferences and interests."
  },
  {
    icon: Star,
    title: "Best Price Guarantee",
    description: "Competitive pricing with no hidden costs and best value for money."
  },
  {
    icon: Plane,
    title: "Easy Booking",
    description: "Simple booking process with flexible payment options and instant confirmation."
  }
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const cards = cardsRef.current;
    
    gsap.fromTo(cards,
      { opacity: 0, y: 30, rotationY: 15 },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <Container>
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make your travel dreams come true with exceptional service and unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}