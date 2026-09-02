import p1 from '../../assets/1.jpg'
import chanel from '../../assets/chanel.jpg'
import chanel2 from '../../assets/chanel2.jpg'
import farma from '../../assets/farma.jpg'
import chanel01 from '../../assets/chanel01.jpg'
// import per3 from '../../assets/3.jpg'
// import per4 from '../../assets/4.jpg'
// import per5 from '../../assets/5.jpg'
import per6 from '../../assets/6.jpg'
import per7 from '../../assets/77.jpg'
import per8 from '../../assets/8.jpg'
import per9 from '../../assets/9.jpg'
import per10 from '../../assets/10.jpg'
import per11 from '../../assets/11.jpg'
import per12 from '../../assets/12.jpg'
import per13 from '../../assets/13.jpg'
import per14 from '../../assets/14.jpg'
import per15 from '../../assets/15.jpg'
import per16 from '../../assets/16.jpg'
import per17 from '../../assets/17.jpg'
import per20 from '../../assets/20.jpg'
import per21 from '../../assets/21.jpg'
import per22 from '../../assets/22.jpg'
// import per23 from '../../assets/23.jpg'
import per24 from '../../assets/24.jpg'
import per25 from '../../assets/25.jpg'
import per30 from '../../assets/30.jpg'
import per31 from '../../assets/31.jpg'
import hugo from '../../assets/hugo.jpg'
import gucci from '../../assets/gucci.jpg'
import gallery2 from '../../assets/gallery2.jpg'
import gallery3 from '../../assets/gallery3.jpg'
import gallery5 from '../../assets/gallery5.jpg'
import gallery6 from '../../assets/gallery6.jpg'
import gallery7 from '../../assets/gallery7.jpg'
import missdior from '../../assets/missdior.jpg'
import gabbana from '../../assets/gabbana.jpg'
import jadore from '../../assets/jadore.jpg'
import ben from '../../assets/ben.jpg'
import verspace from '../../assets/verspace.jpg'
import dior from '../../assets/dior.jpg'

const products = [
  {
    id: 1,
    name: "Maison Francis Kurkdjian",
    price: 112,
    category: "Men",
    rating: 4,
    isNew: false,
    description: "A sporty scent with lavender and fresh citrus notes.",
    image: per7
  },{
    id: 2,
    name: "Bleu de Chanel",
    price: 130,
    category: "Men",
    rating: 5,
    isNew: true,
    description: "A woody aromatic scent with citrus freshness and masculine depth.",
    image: chanel
  },
  {
    id: 3,
    name: "Versace Eros Flame",
    price: 110,
    category: "Men",
    rating: 4,
    isNew: false,
    description: "A warm blend of tonka bean and leather, perfect for evening wear.",
    image: verspace 
  },
  {
    id: 4,
    name: "Lamar – Kajal",
    price: 120,
    category: "Women",
    rating: 5,
    isNew: true,
    description: "A warm and addictive scent with coffee and vanilla notes.",
    image: per10
  },
  {
    id: 5,
    name: "Dolce & Gabbana",
    price: 110,
    category: "Women",
    rating: 4,
    isNew: false,
    description: "A rich white floral fragrance inspired by blooming gardens.",
    image: gabbana
  },
  {
    id: 6,
    name: "Golden Leather – Mancera",
    price: 100,
    category: "Women",
    rating: 4,
    isNew: true,
    description: "Light and fresh with strawberry and violet notes.",
    image: per25 
  },
  {
    id: 7,
    name: "Dior Sauvage",
    price: 120,
    category: "Men",
    rating: 5,
    isNew: false,
    description: "A bold and fresh fragrance with bergamot and ambroxan notes for confident Men.",
    image: dior  
  },
   {
    id: 8,
    name: "Farmasi Hera Eau de Parfum",
    price: 116,
    category: "Women",
    rating: 5,
    isNew: true,
    description: "A sensual musky fragrance with soft floral undertones.",
    image: farma
},
  {
    id: 9,
    name: "Chanel No. 5",
    price: 140,
    category: "Women",
    rating: 5,
    isNew: false,
    description: "A timeless floral fragrance with rose and jasmine.",
    image: chanel2
  },
  {
    id: 10,
    name: "J’adore – Dior",
    price: 115,
    category: "Men",
    rating: 5,
    isNew: true,
    description: "Fresh mint and vanilla create a strong and youthful fragrance.",
    image: jadore
  },
  {
    id: 11,
    name: "Hugo Boss Bottled",
    price: 100,
    category: "Men",
    rating: 4,
    isNew: false,
    description: "An elegant scent with apple, cinnamon, and woody notes.",
    image: hugo
  },
  {
    id: 12,
    name: "La Nuit de l'Homme",
    price: 115,
    category: "Men",
    rating: 5,
    isNew: true,
    description: "A spicy and sweet fragrance with leather and amber tones.",
    image: per6
  },
  {
    id: 13,
    name: "Mehrān Modiri",
    price: 90,
    category: "Unisex",
    rating: 4,
    isNew: false,
    description: "A refreshing citrus fragrance for everyday wear.",
    image: gallery2
  },
  {
    id: 14,
    name: "Scent Salim Pink Oud",
    price: 108,
    category: "Women",
    rating: 4,
    isNew: true,
    description: "A delicate floral scent with peony and musk.",
    image: per13
  },
  {
    id: 15,
    name: "Vibrant Leather – Zara",
    price: 125,
    category: "Women",
    rating: 5,
    isNew: false,
    description: "A fruity gourmand fragrance with berries and creamy base.",
    image: per14
  },
  {
    id: 16,
    name: "Dolce & Gabbana",
    price: 130,
    category: "Women",
    rating: 4,
    isNew: true,
    description: "A romantic scent with rose and soft leather notes.",
    image: per15 
 },
  {
    id: 17,
    name: "Miss Dior",
    price: 180,
    category: "Women",
    rating: 5,
    isNew: false,
    description: "A luxurious oud fragrance blended with spices and vanilla.",
    image: missdior
  },
  {
    id: 18,
    name: "Valentino",
    price: 200,
    category: "Unisex",
    rating: 5,
    isNew: true,
    description: "A sophisticated scent with amber and woody notes.",
    image: per17 
  },
   {
    id: 19,
    name: "Roja Harrods",
    price: 105,
    category: "Men",
    rating: 4,
    isNew: true,
    description: "A vibrant fragrance with lemon, ginger, and woody base.",
    image: per8
  },
  {
    id: 20,
    name: "Santa Maria Novella Colonia",
    price: 150,
    category: "Unisex",
    rating: 4,
    isNew: true,
    description: "A fruity floral scent with pear and freesia notes.",
    image: per21 
  },
  {
    id: 21,
    name: "Le Labo Santal 33",
    price: 190,
    category: "Unisex",
    rating: 5,
    isNew: false,
    description: "A woody spicy fragrance with sandalwood and cardamom.",
    image: per22 
  },
  {
    id: 22,
    name: "Valentino",
    price: 160,
    category: "Unisex",
    rating: 4,
    isNew: true,
    description: "A nostalgic scent inspired by warm memories and comfort.",
    image: per16
  },
  {
    id: 23,
    name: "Bekheit – Eau de Parfum",
    price: 175,
    category: "Unisex",
    rating: 5,
    isNew: false,
    description: "A fresh woody scent with vanilla and sandalwood.",
    image: per24
  },
  {
    id: 24,
    name: "CHANEL – Paris",
    price: 110,
    category: "Women",
    rating: 4,
    isNew: true,
    description: "A clean aquatic fragrance with lotus and rose notes.",
    image: chanel01
  },
  {
    id: 25,
    name: "My Burberry",
    price: 105,
    category: "Men",
    rating: 4,
    isNew: false,
    description: "A woody aromatic scent with bergamot and patchouli.",
    image: per30 
  },
  {
    id: 26,
    name: "Jeanne LAVIN – Lanvin",
    price: 115,
    category: "Women",
    rating: 4,
    isNew: true,
    description: "A fresh Mediterranean scent with lemon and apple.",
    image: gallery3
},
  {
    id: 27,
    name: "Pera Granita – Guerlain",
    price: 128,
    category: "Women",
    rating: 5,
    isNew: false,
    description: "A bold floral fragrance with orange blossom and vanilla.",
    image: gallery5
   },
  {
    id: 28,
    name: "Coco Mademoiselle – Chanel",
    price: 122,
    category: "Men",
    rating: 4,
    isNew: true,
    description: "A modern masculine scent with sage and apple notes.",
    image: gallery6  
  },
  {
    id: 29,
    name: "Gucci Flora Gorgeous Gardenia",
    price: 135,
    category: "Women",
    rating: 5,
    isNew: false,
    description: "A sweet floral fragrance with pear blossom and gardenia.",
    image: gucci 
  },
  {
    id: 30,
    name: "Seoul",
    price: 132,
    category: "Women",
    rating: 4,
    isNew: true,
    description: "A sensual musky fragrance with soft floral undertones.",
    image: gallery7
},
  {
    id: 31,
    name: "Eaudemoiselle Eau Florale",
    price: 102,
    category: "Women",
    rating: 4,
    isNew: true,
    description: "A sensual musky fragrance with soft floral undertones.",
    image: per31
},
{
    id: 32,
    name: "Triumph of Bacchus – Argos",
    price: 118,
    category: "Women",
    rating: 5,
    isNew: false,
    description: "A modern feminine fragrance with blackcurrant and vanilla.",
    image: per12 
},
  
];
export default products