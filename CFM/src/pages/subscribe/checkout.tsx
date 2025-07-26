// src/pages/CheckoutPage.tsx
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Lock, Eye, EyeOff } from 'lucide-react';
import { useUserAuth } from '@/context/userAuthContext'; // Assuming you'll use this for user info
import CheckoutHeader from '@/components/header/checkoutHeader';

// --- Helper Components for this page ---

// const CheckoutHeader = () => (
//   <div className="w-full flex justify-between items-center mb-8">
//     <div className="flex items-center space-x-2 text-sm text-gray-400">
//       <span>Cart</span>
//       <span>&gt;</span>
//       <span className="font-semibold text-gray-800">Information</span>
//       <span>&gt;</span>
//       <span>Finish</span>
//     </div>
//     <div className="flex items-center space-x-2 text-sm text-blue-600">
//       <Lock size={16} />
//       <span>Secured And Encrypted</span>
//     </div>
//   </div>
// );

const OrderSummary = () => (
    <div className="w-full bg-gray-50 p-8 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800">What you'll get</h3>
        <p className="mt-4 text-sm text-gray-600">
            Each week you'll receive ready-to-go lesson plans and activities that save you time, keep your kids engaged, and make teaching the gospel easier than ever. Our weekly materials are tailored for every age group, helping toddlers, kids, and teens learn at their level and build stronger testimonies of Jesus Christ.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-gray-700">
            <li className="flex items-start"><Heart size={16} className="mr-3 mt-1 text-red-400 flex-shrink-0" />1 lesson plan and 3 activities for toddlers every week.</li>
            <li className="flex items-start"><Heart size={16} className="mr-3 mt-1 text-red-400 flex-shrink-0" />1 lesson plan and 6 activities for elementary age kids every week.</li>
            <li className="flex items-start"><Heart size={16} className="mr-3 mt-1 text-red-400 flex-shrink-0" />1 lesson plan and activity designed for Primary teachers each week.</li>
            <li className="flex items-start"><Heart size={16} className="mr-3 mt-1 text-red-400 flex-shrink-0" />1 study guide, with four questions, a challenge, and video for teens every week.</li>
            <li className="flex items-start"><Heart size={16} className="mr-3 mt-1 text-red-400 flex-shrink-0" />Merry Mail, a bonus surprise every month.</li>
            <li className="flex items-start"><Heart size={16} className="mr-3 mt-1 text-red-400 flex-shrink-0" />A combined total of 100+ pages of gospel-learning goodness every month.</li>
        </ul>
        <div className="border-t my-6"></div>
        <h3 className="text-xl font-semibold text-gray-800">TESTIMONIALS</h3>
        <div className="mt-4 p-4 bg-white rounded-md border text-sm">
            <p className="text-gray-600">"We've struggled with come follow me recently but this makes it so easy and fun!"</p>
            <p className="mt-2 font-semibold text-gray-800">- Happy Parent</p>
        </div>
    </div>
);


// --- Main Checkout Page Component ---

const CheckoutPage: React.FunctionComponent = () => {
    const { planId } = useParams<{ planId: string }>();
    const { user } = useUserAuth(); // Get current user if logged in

    const [selectedPlan, setSelectedPlan] = React.useState(planId === 'digital' ? 'monthly' : 'yearly');
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className="bg-white min-h-screen">
            <CheckoutHeader />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Form */}
                    <div className="lg:pr-8">
                        {/* <CheckoutHeader /> */}

                        {/* Membership Options */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800">Choose your membership option:</h2>
                            <div className="border rounded-lg p-4 flex justify-between items-center has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                <div>
                                    <label htmlFor="yearly" className="font-semibold text-gray-700">Digital Membership x 1</label>
                                    <p className="text-sm text-gray-500">Options: Yearly</p>
                                    <p className="text-sm text-gray-500"><span className="line-through">$144.00</span> $120.00 every year</p>
                                </div>
                                <input type="radio" id="yearly" name="plan" value="yearly" checked={selectedPlan === 'yearly'} onChange={(e) => setSelectedPlan(e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            </div>
                            <div className="border rounded-lg p-4 flex justify-between items-center has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                                <div>
                                    <label htmlFor="monthly" className="font-semibold text-gray-700">Digital Membership x 1</label>
                                    <p className="text-sm text-gray-500">Options: Monthly</p>
                                    <p className="text-sm text-gray-500">$12.00 every month with 14 day free trial</p>
                                </div>
                                <input type="radio" id="monthly" name="plan" value="monthly" checked={selectedPlan === 'monthly'} onChange={(e) => setSelectedPlan(e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="mt-8">
                            <div className="flex justify-between items-baseline">
                                <h2 className="text-lg font-semibold text-gray-800">Customer information</h2>
                                <p className="text-sm">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link></p>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                                <input type="email" id="email" defaultValue={user?.email || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            {/* This section would only appear if user is not logged in */}
                            {!user && (
                                <div className="mt-4 relative">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input type={showPassword ? "text" : "password"} id="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            )}
                            <div className="mt-6 flex items-center justify-between">
                                <button className="px-6 py-2 rounded-md text-white bg-[#bf857a] hover:bg-opacity-90 font-semibold">
                                    {user ? 'Continue' : 'LOGIN'}
                                </button>
                                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Lost your password?</Link>
                            </div>
                        </div>

                        {/* Billing Details */}
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-gray-800">Billing details</h2>
                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div>
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                                    <input type="text" id="first-name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                                    <input type="text" id="last-name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                {/* Add more billing fields here (Address, City, etc.) as needed */}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="bg-gray-50 lg:p-8 rounded-lg">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
