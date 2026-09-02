import React from 'react'
import Navbar from '../Navbar/Navbar'
import Hero from '../Hero/Hero'
import ScrollBanner from '../ScrollBanner/ScrollBanner'
import OurStory from '../OurStory/OurStory'
import SellingProducts from '../SellingProducts/SellingProducts'
import Services from '../Services/Services'
import Sale from '../Sale/Sale'
import Testimonals from '../Testimonals/Testimonals'

const Home = () => {
  return (
    <div>
      <Hero />
      <ScrollBanner/>
      <OurStory/>
      <SellingProducts/>
      <Services />
      <Sale />
      <Testimonals />
    </div>
  )
}

export default Home
