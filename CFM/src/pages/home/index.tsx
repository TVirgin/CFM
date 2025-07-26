// src/pages/HomePage.tsx
import * as React from 'react';
import HeroSection from '../../components/sections/HeroSection';
import HowItWorksSection from '../../components/sections/HowItWorksSection';
import Layout from '@/components/layout';
import Header from '@/components/header';
import Footer from '@/components/footer';


const HomePage: React.FunctionComponent = () => {
  return (
    <Layout>
      <div> 
        <HeroSection />
        <HowItWorksSection />
      </div>
    </Layout>
  );
};

export default HomePage;