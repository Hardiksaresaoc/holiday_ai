'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Absolutely amazing experience! The Rajasthan package was perfectly planned. Every detail was taken care of.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612d5b6?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Rahul Verma",
    location: "Delhi",
    rating: 5,
    comment: "Kerala backwaters trip was a dream come true. The houseboat experience was unforgettable!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Anita Desai",
    location: "Bangalore",
    rating: 5,
    comment: "Best travel company! Professional service, great guides, and fantastic value for money.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const cards = cardsRef.current;
    
    gsap.fromTo(cards,
      { opacity: 0, scale: 0.8, rotation: 5 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
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
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Container>
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Happy Travelers
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gray-800/50 border-gray-700 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 italic">"{testimonial.comment}"</p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}