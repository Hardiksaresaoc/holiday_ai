'use client';

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Holiday Explorer
              </h3>
              <p className="text-gray-400 mb-4">
                Your trusted partner for incredible Indian holiday experiences. 
                Creating memories that last a lifetime.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
                <Twitter className="w-6 h-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
                <Instagram className="w-6 h-6 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/packages" className="text-gray-400 hover:text-orange-400 transition-colors">All Packages</Link></li>
                <li><Link href="/destinations" className="text-gray-400 hover:text-orange-400 transition-colors">Destinations</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-orange-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors">Contact</Link></li>
                <li><Link href="/admin" className="text-gray-400 hover:text-orange-400 transition-colors">Admin</Link></li>
              </ul>
            </div>

            {/* Popular Destinations */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Popular Destinations</h4>
              <ul className="space-y-2">
                <li><Link href="/destinations/rajasthan" className="text-gray-400 hover:text-orange-400 transition-colors">Rajasthan</Link></li>
                <li><Link href="/destinations/kerala" className="text-gray-400 hover:text-orange-400 transition-colors">Kerala</Link></li>
                <li><Link href="/destinations/himachal" className="text-gray-400 hover:text-orange-400 transition-colors">Himachal Pradesh</Link></li>
                <li><Link href="/destinations/goa" className="text-gray-400 hover:text-orange-400 transition-colors">Goa</Link></li>
                <li><Link href="/destinations/kashmir" className="text-gray-400 hover:text-orange-400 transition-colors">Kashmir</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-gray-400">+91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-gray-400">info@holidayexplorer.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-gray-400">Mumbai, India</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-6">
                <h5 className="font-semibold mb-2">Subscribe to Newsletter</h5>
                <div className="flex">
                  <Input 
                    placeholder="Your email" 
                    className="rounded-r-none bg-gray-800 border-gray-700 text-white"
                  />
                  <Button className="rounded-l-none bg-orange-600 hover:bg-orange-700">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Holiday Explorer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Terms of Service</Link>
              <Link href="/refund" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}