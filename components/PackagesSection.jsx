'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import Link from 'next/link';

const packages = [
  {
    id: 1,
    title: "Rajasthan Royal Heritage",
    description: "Experience the royal grandeur of Rajasthan with palace stays, desert safaris, and cultural shows.",
    price: 15999,
    duration: "7 Days / 6 Nights",
    image: "https://images.unsplash.com/photo-1554263762-17f646b8a3fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxJbmRpYSUyMHRyYXZlbCUyMGRlc3RpbmF0aW9uc3xlbnwwfHx8fDE3NTY5NjcyOTB8MA&ixlib=rb-4.1.0&q=85",
    highlights: ["Udaipur City Palace", "Jaisalmer Desert", "Jodhpur Fort"],
    rating: 4.8
  },
  {
    id: 2,
    title: "Kerala Backwaters Bliss",
    description: "Sail through serene backwaters, stay in houseboats, and explore spice plantations in God's Own Country.",
    price: 12999,
    duration: "6 Days / 5 Nights",
    image: "https://images.unsplash.com/photo-1685850749074-9cf8023d7e8d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMHRyYXZlbCUyMGRlc3RpbmF0aW9uc3xlbnwwfHx8fDE3NTY5NjcyOTB8MA&ixlib=rb-4.1.0&q=85",
    highlights: ["Alleppey Houseboats", "Munnar Tea Gardens", "Kochi Heritage"],
    rating: 4.9
  },
  {
    id: 3,
    title: "Himalayan Adventure",
    description: "Trek through breathtaking mountain trails, visit ancient monasteries, and witness spectacular sunrises.",
    price: 18999,
    duration: "8 Days / 7 Nights",
    image: "https://images.unsplash.com/photo-1745737204244-db3bbf72e3fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMG1vdW50YWluc3xlbnwwfHx8fDE3NTY5NjczMDF8MA&ixlib=rb-4.1.0&q=85",
    highlights: ["Manali Valley", "Rohtang Pass", "Dharamshala Monasteries"],
    rating: 4.7
  },
  {
    id: 4,
    title: "Golden Triangle Classic",
    description: "Discover India's most iconic destinations - Delhi, Agra, and Jaipur in this classic circuit.",
    price: 13999,
    duration: "6 Days / 5 Nights",
    image: "https://images.unsplash.com/photo-1664081507458-94de02277afe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxJbmRpYSUyMHRyYXZlbCUyMGRlc3RpbmF0aW9uc3xlbnwwfHx8fDE3NTY5NjcyOTB8MA&ixlib=rb-4.1.0&q=85",
    highlights: ["Taj Mahal", "Red Fort", "Amber Palace"],
    rating: 4.6
  }
];

export default function PackagesSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const cards = cardsRef.current;
    
    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
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
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <Container>
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Featured Holiday Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked destinations across India, crafted for unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <Card 
              key={pkg.id}
              ref={el => cardsRef.current[index] = el}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 bg-white/80 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-orange-600 text-white">★ {pkg.rating}</Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                  {pkg.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">{pkg.duration}</span>
                  </div>
                  
                  <div className="space-y-1">
                    {pkg.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Link href={`/packages/${pkg.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-on-scroll">
          <Link href="/packages">
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4">
              View All Packages
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}