import * as React from 'react';

const HeroSection: React.FunctionComponent = () => {
  return (
    // Add `justify-start` to override the default centering from the .scroll-section class
    <section className="scroll-section relative text-white justify-start">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source 
          src="https://www.comefollowmefhe.com/wp-content/uploads/2024/02/Come-Follow-Me-FHE-Intro-Film-2022-1.mp4#t=0,30" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay for Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
      
      {/* --- CONTENT CONTAINER UPDATED FOR LEFT ALIGNMENT --- */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* This div now controls the text alignment and width */}
        <div className="text-left max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold">
            Come, Follow Me For Kids
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Teach fun and engaging gospel-centered lessons that kids love! Our ready-to-go lesson plans and activities are simple to use and help strengthen faith in Christ. 
          </p>
          <p className="mt-4 text-lg md:text-xl">
            Try our monthly membership free for 14 days and make Come, Follow Me a success!
          </p>
          <button className="mt-8 px-8 py-3 bg-[#bf857a] text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors">
            START FREE TRIAL
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;