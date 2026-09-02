import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import Heading from '../Heading/Heading'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules'
import t1 from '../../assets/Testimonals/t-1.jpg'
import t2 from '../../assets/Testimonals/t-2.jpg'
import t3 from '../../assets/Testimonals/t-3.jpg'
import t4 from '../../assets/Testimonals/t-4.jpg'
import t5 from '../../assets/Testimonals/t-5.jpg'

const Testimonials = () => {

  const reviews = [
    {
      id: 1,
      name: "Sophia Williams",
      review:
        "Zivara perfumes are absolutely amazing! The fragrance lasts all day and feels very luxurious. I always get compliments whenever I wear it.",
      image: t1,
    },
    {
      id: 2,
      name: "James Carter",
      review:
        "I recently bought a perfume from Zivara and I’m in love with the scent. It’s elegant, long-lasting, and perfect for every occasion.",
      image: t2,
    },
    {
      id: 3,
      name: "Emma Thompson",
      review:
        "I absolutely love Zivara perfumes! The fragrance is elegant and long-lasting. Every time I wear it, people ask me which perfume I’m using.",
      image: t3,
    },
    {
      id: 4,
      name: "Daniel Lee",
      review:
        "The packaging and fragrance of Zivara perfumes are beautiful. It smells fresh and sophisticated. Highly recommended!",
      image: t4,
    },
    {
      id: 5,
      name: "Emma Johnson",
      review:
        "I was looking for a long-lasting perfume and Zivara exceeded my expectations. The scent stays for hours and feels very classy.",
      image: t5,
    },
  ];

  return (
    <section className="bg-[#0a0a0a] py-20 px-6 md:px-16">
      <div data-aos="fade-up"  data-aos-delay="100" className="">

      {/* Heading */}
      <div className="text-center mb-10">
        <Heading highlight='Our Happy Customers' />
        {/* <p className="text-gray-400 text-sm mt-3">
          Luxury fragrances our customers adore.
        </p> */}
      </div>

      {/* Scroll Container */}
      <Swiper navigation={{ nextEl: ".custom-prev", prevEl: ".custom-next" }} modules={[Navigation, Autoplay]} autoplay={{ delay: 2500, pauseOnMouseEnter: true, disableOnInteraction: false, }} loop={true} spaceBetween={20} breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }} className="mySwiper" >
        {
          reviews.map((item) => (
            <SwiperSlide
              key={item.id}
              className="min-w-[360px] mb-5 mt-6 bg-[#151515] border border-[#2a2a2a]
            rounded-2xl p-8 relative
            transition transform  duration-700
            hover:scale-102
            hover:shadow-2xl hover:shadow-lime-50/10"
            >

              {/* Quote Icon */}
              <FaQuoteLeft className="text-lime-300 text-2xl mb-4 opacity-80" />

              {/* Review */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {item.review}
              </p>

              {/* User */}
              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#333]"
                />

                <div>
                  <h4 className="text-white font-semibold">{item.name}</h4>

                  <div className="flex text-yellow-400 text-sm gap-1 mt-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>

              </div>

            </SwiperSlide>
          ))}

      </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;