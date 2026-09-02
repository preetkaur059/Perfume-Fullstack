import React, { useEffect, useState } from 'react'
import { IoHeartSharp } from "react-icons/io5";
import { FaBars, FaTimes, FaSearch, FaShoppingCart } from "react-icons/fa";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserAlt } from "react-icons/fa";
import { BiMenuAltRight } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { NavLink, useLocation } from "react-router-dom";
import api from "../../api/client";

const Navbar = () => {
    const { totalItems, wishlist, setSearchItem, cartCount } = useContext(StoreContext);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const isCategoryActive =
        location.pathname === "/Categories" ||
        location.pathname === "/Men" ||
        location.pathname === "/Women" ||
        location.pathname === "/Unisex";

    // scrollbar with shadow 
    const handleScroll = () => {
        const section = document.getElementById('product-section');

        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }
    const handleLinkClick = () => {
        setShowMenu(false); // menu close
    };

    useEffect(() => {
        if (showMenu) {
            document.body.style.overflow = "hidden"; // disable scroll
        } else {
            document.body.style.overflow = "auto"; // enable scroll
        }
    }, [showMenu]);

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    useEffect(() => {
        let isActive = true;

        const loadCurrentUser = async () => {
            try {
                const { data } = await api.get("/users/me");
                if (isActive) setUser(data.user);
            } catch {
                if (isActive) setUser(null);
            }
        };

        loadCurrentUser();
        window.addEventListener("auth:changed", loadCurrentUser);

        return () => {
            isActive = false;
            window.removeEventListener("auth:changed", loadCurrentUser);
        };
    }, []);

    return (
        <header className={` z-99 fixed top-5 left-0 right-0  `}>
            <nav className={`w-[95%] max-w-[1400px] backdrop-blur-3xl rounded-lg bg-white/5 border border-white/10  flex mx-auto md:h-[12vh] h-[10vh] md:px-10 px-5 items-center justify-between`}>
                <div className="">
                    <NavLink to="/" className='text-3xl text-white font-bold'>ZIVARA</NavLink>
                </div>
                <div className="md:flex hidden gap-8 text-xl">

                    <NavLink to="/" className={({ isActive }) => `font-medium tracking-wider ${isActive ? "text-lime-200" : "text-white hover:text-lime-200"}`} >
                        Home
                    </NavLink>

                    <NavLink to="/Allproducts" className={({ isActive }) => `font-medium tracking-wider ${isActive ? "text-lime-200" : "text-white hover:text-lime-200"}`} >
                        All Products
                    </NavLink>
                    <div className="relative">

                        {/* Categories Button */}
                        <div
                            className="relative"
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}>
                            <span
                                className={`font-medium cursor-pointer tracking-wider ${isCategoryActive ? "text-lime-200" : "text-white hover:text-lime-200"
                                    }`}
                            >
                                Categories
                            </span>

                            {/* Dropdown */}
                            {open && (
                                <div className="absolute top-8 left-0 w-40 bg-[#1a1a1a] text-white rounded shadow-lg border border-gray-700 overflow-hidden transition-all duration-300 z-50">

                                    <NavLink
                                        to="/Men"
                                        className={` block px-4 py-2 hover:bg-[#272727] transition-colors duration-200`}>
                                        Men
                                    </NavLink>

                                    <NavLink
                                        to="/Women"
                                        className="block px-4 py-2 hover:bg-[#272727] transition-colors duration-200">
                                        Women
                                    </NavLink>

                                    <NavLink
                                        to="/Unisex"
                                        className="block px-4 py-2 hover:bg-[#272727] transition-colors duration-200">
                                        Unisex
                                    </NavLink>

                                </div>
                            )}
                        </div>

                    </div>
                    <NavLink to="/Contact" className={({ isActive }) => `font-medium tracking-wider ${isActive ? "text-lime-200" : "text-white hover:text-lime-200"}`} >
                        Contact Us
                    </NavLink>

                </div>
                {/* nav action  */}
                <div className="flex  items-center gap-x-5">
                    <div className="md:flex hidden border-lime-300 text-white border-2 rounded-xl">

                        {/* search bar  */}
                        <input type="text" name='text' id='text' className='flex-1 h-[5vh] px-3 focus:outline-none'
                            onFocus={handleScroll}
                            onChange={(e) => setSearchItem(e.target.value)}
                            placeholder='Search perfume...' autoComplete='off' />
                        <button className='h-10 w-10 cursor-pointer text-black flex justify-center items-center rounded-xl text-2xl bg-gradient-to-b from-lime-200 to-lime-300 '>
                            <FaSearch className='bg- z-99' />
                        </button>
                    </div>

                    {/* wishlist */}
                    <Link to='/wishlist' className='text-white relative text-3xl hover:text-lime-200'>
                        <IoHeartSharp />
                        {
                            wishlist.length > 0 && (
                            <span className='flex justify-center items-center text-lg bg-lime-300 text-black w-5 h-5 p-3 rounded-full absolute left-4 top-4'>{wishlist.length}</span>)
                        }
                    </Link>

                    {/* cart */}
                    <Link to='/cart' className='text-white relative text-3xl hover:text-lime-200'>
                        <FaShoppingCart />
                        {
                            cartCount > 0 &&
                            <span className='flex justify-center items-center text-lg bg-lime-300 text-black w-5 h-5 p-3 rounded-full absolute left-4 top-4'>{cartCount}</span>
                        }
                    </Link>

                    {user ? (
                    <Link
                        to="/profile"
                        className="flex w-10 h-10 rounded-full
                        bg-gradient-to-b from-lime-200 to-lime-300
                        text-black items-center justify-center
                        font-bold cursor-pointer"
                    >
                        {user.fullName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </Link>
                    ) : (
                    <Link
                        to="/login"
                        className="flex text-white text-3xl
                        hover:text-lime-200 transition duration-300 cursor-pointer"
                    >
                        <FaUserAlt />
                    </Link>
                    )}
                    <button onClick={() => setShowMenu(!showMenu)} className={`text-white text-2xl md:hidden`}>
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* mobile menu */}

                <div className={`flex z-99 ${showMenu ? 'bg-black/90' : 'bg-lime-400/30'} border border-white/20
                ${showMenu ? 'left-1/2' : ''} flex-col absolute p-10
                items-center justify-center md:hidden top-30 -left-full transform -translate-x-1/2
                transition-all duration-300 gap-12 text-2xl`}>
                    <NavLink to="/" className='font-semibold tracking-wider text-lime-300'>Home</NavLink>
                    <NavLink to="/Allproducts"  onClick={handleLinkClick} className='font-semibold tracking-wider text-white hover:text-lime-300'>All Products</NavLink>
                    <div className="relative">

                        {/* Categories Button */}
                        <div className="relative"
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}>
                            <span className={`font-medium cursor-pointer tracking-wider ${isCategoryActive ? "text-lime-200" : "text-white hover:text-lime-200" }`}>
                                Categories
                            </span>

                            {/* Dropdown */}
                            {open && (
                                <div className="absolute top-8 left-0 w-40 bg-[#1a1a1a] text-white rounded shadow-lg border border-gray-700 overflow-hidden transition-all duration-300 z-50">

                                    <NavLink
                                        to="/Men"  onClick={handleLinkClick}
                                        className={` block px-4 py-2 hover:bg-[#272727] transition-colors duration-200`}>
                                        Men
                                    </NavLink>

                                    <NavLink
                                        to="/Women"  onClick={handleLinkClick}
                                        className="block px-4 py-2 hover:bg-[#272727] transition-colors duration-200">
                                        Women
                                    </NavLink>

                                    <NavLink
                                        to="/Unisex"  onClick={handleLinkClick}
                                        className="block px-4 py-2 hover:bg-[#272727] transition-colors duration-200">
                                        Unisex
                                    </NavLink>

                                </div>
                            )}
                        </div>

                    </div>
                    {/* <NavLink href="Process" className='font-semibold tracking-wider text-white hover:text-lime-300'>Process</NavLink> */}
                    <NavLink to="/Contact"  onClick={handleLinkClick} className='font-semibold tracking-wider text-white  hover:text-lime-300'>Contact Us</NavLink>

                    <div className="flex md:hidden text-white border-lime-500 border-2 rounded-xl">
                        <input type="text" name='text' id='text' className='flex-1 text-white h-[5vh] px-3 focus:outline-none' placeholder='Search perfume...' autoComplete='off' />
                        <button className='h-10 w-10 text-white flex justify-center items-center rounded-lg text-xl bg-gradient-to-b from-lime-400 to-lime-500 '>
                            <FaSearch />
                        </button>
                    </div>
                </div> 
            </nav>
        </header>
    )
}

export default Navbar
