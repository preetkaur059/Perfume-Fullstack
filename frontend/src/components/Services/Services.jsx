import React from 'react'
import Heading from '../Heading/Heading'

const Services = () => {
   return (
    <section className="bg-[#101010] py-20">
      <div data-aos="fade-up" data-aos-delay="200" className="max-w-[1300px] mx-auto px-4 flex flex-col items-center gap-12 text-center">

        <Heading highlight="Our Services" />

        <div data-aos="fade-up" data-aos-delay="300" className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">

          {servicesData.map((service,index) => (
            <div  data-aos="fade-up"
            data-aos-delay={index * 300}
             key={service.id} className="group relative isolate overflow-hidden">

              <span className="absolute left-0 top-0 w-full h-[0.3rem] bg-lime-200 transition-all duration-300 group-hover:h-full -z-10"></span>

              <h4 className="text-white text-[2rem] pt-6 pb-3 group-hover:text-black">
                {service.title}
              </h4>

              <p className="text-white text-[1rem] px-3 pb-8 group-hover:text-black group-hover:font-medium">
                {service.desc}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default Services

 const servicesData = [
    {
      id: 1,
      title: "Free Shipping",
      desc: "Enjoy fast and reliable free shipping on every order. We make sure your favorite fragrances are packed carefully and delivered safely to your doorstep without any extra cost."
    },
    {
      id: 2,
      title: "Payment Security",
      desc: "Shop with complete confidence using our secure payment system. Your personal and payment details are fully protected, ensuring a smooth and safe shopping experience every time."
    },
    {
      id: 3,
      title: "Free Customer Support",
      desc: "Our dedicated customer support team is always ready to assist you. Whether you have a question about a product or need help with your order, we are here for you."
    },
    
  ];
