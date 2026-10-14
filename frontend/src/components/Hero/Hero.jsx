import React from "react";
import { motion } from "framer-motion";
import perfumeImg from "../../assets/g2.png";
import bgImg from "../../assets/g4.png";

void perfumeImg;

const Hero = () => {
  return (
    <div
      className="relative isolate overflow-hidden bg-cover bg-center pt-28 sm:pt-32"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6">

        <div className="flex min-h-[60vh] flex-col sm:min-h-[70vh] md:min-h-[calc(100vh-14vh)] md:flex-row ">

          {/* Left Text - Desktop */}
          <motion.div
            className="hidden flex-1 items-center flex md:block mt-10 flex items-center"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="font-serif text-4xl text-white md:text-5xl lg:text-6xl">
              THE <br />
              FRAGRENCE <br />
              OF LIFE
            </h1>
          </motion.div>

          {/* Mobile and Tablet Heading */}
          <motion.div
            className="flex flex-1 items-start justify-center mt-2 md:hidden"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="mx-auto max-w-full text-center font-serif text-3xl text-white sm:text-4xl">
              THE FRAGRENCE OF LIFE
            </h2>
          </motion.div>

          {/* Center Image - Kept Optional */}
          {/*
          <motion.div
            className="relative flex-1 justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={perfumeImg}
              alt="Perfume"
              className="h-[25rem] max-w-full object-contain pt-6 md:h-[70vh]"
            />
          </motion.div>
          */}

          {/* Right Text - Desktop */}
          <motion.div
            className="hidden flex-1   md:flex lg:mb-28 md:self-end md:mb-35 flex justify-end"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="scroll-box h-[150px] w-full max-w-[400px] overflow-y-auto p-3">
              <p className="text-right text-sm text-white md:text-base lg:text-xl">
                A timeless fragrance that reflects elegance, confidence, and
                modern charm, crafted for individuals who appreciate true
                luxury. Each note is carefully blended to create a scent that
                feels unique, memorable, and expressive. Our perfumes are
                designed to elevate everyday moments, leaving a subtle yet
                lasting impression wherever you go. Discover a fragrance that
                complements your personality and becomes a signature of your
                style and presence.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;