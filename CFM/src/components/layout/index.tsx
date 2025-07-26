// src/components/layout.tsx
import * as React from "react";
import Header from "../header";
import Footer from '../footer';


interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1">
        <div> 
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;