import React from "react";

const ScrollBanner = () => {
  return (
    <div className="bg-black py-8 scroll-banner overflow-hidden">

      <div data-aos="fade-up" className="flex whitespace-nowrap animate-scroll">

        {/* First Row */}
        <div className="flex items-center font-['Allura']">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <h1 className="text-white text-4xl md:text-5xl px-4 font-['Allura']">
                50% OFF
              </h1>

              <h1 className="text-white text-4xl md:text-5xl px-4 font-['Allura']">
                Order Now
              </h1>

              <div className="h-6 w-6 mx-6 bg-[#e2f2b0] rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Duplicate for smooth infinite effect */}
        <div className="flex items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <h1 className="text-white text-4xl md:text-5xl px-4 font-['Allura']">
                50% OFF
              </h1>

              <h1 className="text-white text-4xl md:text-5xl px-4 font-['Allura']">
                Order Now
              </h1>

              <div className="h-6 w-6 mx-6 bg-[#e2f2b0] rounded-full"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ScrollBanner;