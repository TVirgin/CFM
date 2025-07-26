import * as React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Sword, Heart, ArrowRightCircle } from 'lucide-react';

// Using the same logo, but you might have a different one for the footer
import footerLogo from '@/assets/images/logo.webp';

const footerLinks = [
  { name: 'Meet Our Teacher Council', href: '#' },
  { name: 'Free Primary Stake Trainings', href: '#' },
  { name: 'Memberships', href: '#' },
  { name: 'Lesson Plans', href: '#' },
  { name: 'Shop', href: '#' },
  { name: 'About', href: '#' },
  { name: 'FAQs', href: '#' },
  { name: 'Contact', href: '#' },
];

const Footer: React.FunctionComponent = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <img className="h-12 w-auto" src={footerLogo} alt="Company Logo" />
            <p className="text-sm text-gray-600">
              Come Follow Me FHE offers the perfect teaching ideas to follow the Come, Follow Me for families in The Church of Jesus Christ of Latter-day Saints.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Sword size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="md:justify-self-center">
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="flex items-center text-sm text-gray-700 hover:text-black">
                    <ArrowRightCircle size={16} className="mr-2 text-gray-400" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-gray-800 uppercase">Newsletter Sign-up</h3>
            <p className="text-sm text-gray-600">
              Join our newsletter and receive a <span className="font-semibold">free</span> Come, Follow Me resource every week.
            </p>
            <form className="space-y-2">
              <input 
                type="text" 
                placeholder="First name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-gray-500 focus:border-gray-500"
              />
              <input 
                type="email" 
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-gray-500 focus:border-gray-500"
              />
              <button 
                type="submit"
                // Approximated color from your image
                className="w-full px-4 py-2 text-white bg-[#bf857a] rounded-md hover:bg-opacity-90 font-semibold text-sm"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} YOURCOMPANY.COM | ALL RIGHTS RESERVED</p>
          <p className="flex items-center">
            MADE WITH <Heart size={12} className="mx-1 text-red-500" fill="red" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;