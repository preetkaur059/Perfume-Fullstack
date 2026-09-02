import React from "react";
import { motion } from "framer-motion";
import perfumeImg from "../../assets/g2.png";
import bgImg from "../../assets/g4.png";

const Hero = () => {
  return (
    <div
      className="relative isolate pt-32 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="max-w-[1300px] mx-auto px-4">

        <div className="min-h-[calc(100vh-14vh)] flex flex-col md:flex-row">

          {/* Left Text */}
          <motion.div
            className="flex-1 hidden md:block mt-20 flex items-center"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-white text-3xl md:text-7xl font-serif">
              THE <br/> FRAGRENCE <br/> OF LIFE
            </h1>
          </motion.div>

          {/* Mobile Heading */}
          <motion.div
            className="flex-1 block md:hidden mt-5 flex items-start"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-white text-3xl mx-auto md:text-7xl font-serif">
              THE FRAGRENCE OF LIFE
            </h2>
          </motion.div>

          {/* Center Image (optional) */}
          {/* 
          <motion.div
            className="flex-1 flex justify-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={perfumeImg}
              alt="perfume"
              className="h-[25rem] md:h-[70vh] pt-6"
            />
          </motion.div>
          */}

          {/* Right Text */}
          <motion.div
            className="flex-1 md:self-end md:mb-35 flex justify-end"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="w-[400px] h-[150px] hidden md:block scroll-box overflow-y-scroll p-3">
              <p className="text-white text-sm md:text-xl text-right">
                A timeless fragrance that reflects elegance, confidence, and modern charm, crafted 
                for individuals who appreciate true luxury. Each note is carefully blended to 
                create a scent that feels unique, memorable, and expressive. Our perfumes are 
                designed to elevate everyday moments, leaving a subtle yet lasting impression
                wherever you go. Discover a fragrance that complements your personality and 
                becomes a signature of your style and presence.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;