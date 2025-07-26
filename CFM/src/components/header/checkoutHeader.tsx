import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, X, Lock, Eye, EyeOff } from 'lucide-react';
import logoImage from '@/assets/images/logo.webp';

// --- 1. Update the NavItem interface ---
interface NavItem {
    name: string;
    link: string;
    icon: string;
    authRequired?: boolean;
    hideWhenLoggedIn?: boolean; // Add this new property
}


const CheckoutHeader: React.FunctionComponent = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);


    return (
        <header className="bg-white text-black shadow-md sticky top-0 z-40">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">

                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img className="h-14 w-auto" src={logoImage} alt="Cemetery Admin" />
                        </Link>
                    </div>
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>Cart</span>
                            <span>&gt;</span>
                            <span className="font-semibold text-gray-800">Information</span>
                            <span>&gt;</span>
                            <span>Finish</span>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <div className="pt-4 pb-3 border-t border-slate-700 px-2 text-sm text-blue-600">
                        <Lock size={16} />
                        <span>Secured And Encrypted</span>
                    </div>
                </div>
            </div>


            {/* Mobile Menu updated to render links directly */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-800 text-white">



                </div>
            )}
        </header>
    );
};


export default CheckoutHeader;