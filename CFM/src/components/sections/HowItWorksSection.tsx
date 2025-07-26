// src/components/HowItWorksSection.tsx
import * as React from 'react';
import { SquareMousePointer, KeyRound, Users } from 'lucide-react';

const HowItWorksSection: React.FunctionComponent = () => {
  return (
    // This section is also a full-height scroll-section
    <section className="scroll-section bg-white text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">How It Works</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Item 1 */}
          <div className="flex flex-col items-center">
            <SquareMousePointer className="text-[#bf857a]" size={48} />
            <h3 className="mt-4 text-xl font-semibold">Subscribe</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Subscribe and get weekly Come Follow Me lesson plans and activities.
            </p>
          </div>
          
          {/* Item 2 */}
          <div className="flex flex-col items-center">
            <KeyRound className="text-[#bf857a]" size={48} />
            <h3 className="mt-4 text-xl font-semibold">Access</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Get instant digital access to fun and engaging materials.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center">
            <Users className="text-[#bf857a]" size={48} />
            <h3 className="mt-4 text-xl font-semibold">Teach</h3>
            <p className="mt-2 text-gray-600 text-sm">
              Watch the Gospel of Jesus Christ come to life in your family.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;