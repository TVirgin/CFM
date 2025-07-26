// src/pages/SubscribePage.tsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import digitalImage from '@/assets/images/digitalImage.webp';
import workbookImage from '@/assets/images/workbookImage.webp';
import Layout from '@/components/layout';


const SubscribePage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  // This function will eventually create a Stripe Checkout session
  const handleSubscription = (planId: string) => {
    // For now, it navigates to a placeholder checkout page.
    // In the future, this will call a Firebase Function.
    console.log(`Navigating to checkout for plan: ${planId}`);
    navigate(`/checkout/${planId}`);
  };

  return (
    <Layout>
      <div className="bg-[#68756e] py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-start gap-8">

          {/* Card 1: Digital Membership */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center w-full max-w-sm">
            <h3 className="tracking-widest text-gray-500 text-sm">COME, FOLLOW ME LESSONS & ACTIVITES</h3>
            <h2 className="mt-2 text-3xl font-bold text-gray-800">DIGITAL MEMBERSHIP</h2>
            <p className="mt-4 text-5xl font-light text-gray-800">$12</p>
            <p className="text-sm text-gray-500">Per Month After <span className="font-semibold">FREE</span> 14-Day Trial</p>

            <img src={workbookImage} alt="Digital Membership" className="my-6 rounded-md" />

            <button
              onClick={() => handleSubscription('digital')}
              className="w-full py-3 rounded-md bg-[#bf857a] border border-gray-300 text-white font-semibold hover:bg-gray-50 transition-colors"
            >
              START FREE TRIAL
            </button>

            <div className="border-t border-gray-200 w-full my-6"></div>

            <div className="text-left w-full">
              <h4 className="font-semibold text-gray-800">This membership includes Digital Access to:</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>1 lesson plan and 3 activities for toddlers every week.</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>1 lesson plan and 6 activities for elementary age kids every week.</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>1 study guide, with four questions, a challenge, and video for teens every week.</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>Merry Mail, a bonus surprise every month.</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>A combined total of 80+ pages of gospel-learning goodness in PDF printable format every month.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Digital + Workbook Membership */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center w-full max-w-sm">
            <h3 className="tracking-widest text-gray-500 text-sm">COME, FOLLOW ME LESSONS & ACTIVITES</h3>
            <h2 className="mt-2 text-3xl font-bold text-gray-800">DIGITAL + WORKBOOK MEMBERSHIP</h2>
            <p className="mt-4 text-5xl font-light text-gray-800">$25</p>
            <p className="text-sm text-gray-500">Per Month</p>

            <img src={digitalImage} alt="Digital + Workbook Membership" className="my-6 rounded-md" />

            <button
              onClick={() => handleSubscription('plus-workbook')}
              className="w-full py-3 rounded-md bg-[#bf857a] text-white font-semibold hover:bg-opacity-90 transition-colors"
            >
              JOIN NOW
            </button>

            <div className="border-t border-gray-200 w-full my-6"></div>

            <div className="text-left w-full">
              <h4 className="font-semibold text-gray-800">This membership includes Digital Access to:</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span><span className="font-semibold">Everything in the Digital Membership</span>, plus a physical workbook of 80+ printed pages of weekly lesson plans and activities mailed to your door.</span>
                </li>
              </ul>
              <h4 className="font-semibold text-gray-800">Inside Each Physical Workbook:</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>1 lesson plan and 3 activities for toddlers every week printed in black and white.</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>1 lesson plan and 6 activities for elementary age kids every week printed in black and white.</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>Save time and ink so you don’t have to print our core resources and materials.</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>Stay organized with materials organized by week and bound with soft cover.</span>
                </li>
                <li className="flex items-start">
                  <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>Add additional copies for only $9/month so every child can get a copy.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscribePage;
