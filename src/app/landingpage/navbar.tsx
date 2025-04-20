'use client';

import { useState } from "react";
import Image from 'next/image';
import verimedslogo from "../media/verimeds logo.png"
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    const handleMenu = () => {
        setIsOpen(!isOpen);
    } 

    return(
        <>
            <nav className='sticky top-0 w-full shadow-md bg-[#d5f7ff] z-[999] text-black flex justify-end gap-[80px] lg:justify-between lg:px-[100px] h-[100px] items-center px-[20px] '>
                <Image src={verimedslogo} alt="Verimeds" />
                <ul className='lg:flex text-[16px] gap-[32px] sharpsans hidden'>

                    <li>
                        <Link href="/" className="hover:text-[#2d495d]">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="hover:text-[#2d495d]">
                            About Verimeds
                        </Link>
                    </li>
                    <li>
                        <Link href="/troubleshooting" className="hover:text-[#2d495d]">
                            Troubleshooting
                        </Link>
                    </li>
                    <li>
                        <Link href="/report" className="hover:text-[#2d495d]">
                            Report
                        </Link>
                    </li>
                    <li>
                        <Link href="/" className="hover:text-[#2d495d]">
                           Contact Us
                        </Link>
                    </li>
                </ul>
            
                <div onClick={handleMenu} className="lg:hidden">
                    {isOpen ? <IoMdClose className=" text-3xl text-black font-bold" /> : <RiMenu3Fill  className=" text-black text-3xl font-bold"/>}
                </div>
            </nav>
            <div className={`fixed bg-[#092A41] z-50 h-screen top-0 left-0 w-[300px] text-white ps-2 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <ul className="mt-10 ">
                    <li >
                        <Link href="/about" className="hover:text-[#2d495d]">
                            About Verimeds
                        </Link>
                    </li>
                    <li className="mt-4">
                        <Link href="/troubleshooting" className="hover:text-[#2d495d]">
                            Troubleshooting
                        </Link>
                    </li>
                    <li className="mt-4">
                        <Link href="/report" className="hover:text-[#2d495d]">
                            Report
                        </Link>
                    </li>
                    <li className="mt-4">
                        <Link href="/" className="hover:text-[#2d495d]">
                            Contact Us
                        </Link>
                    </li>
                </ul>
            </div>
        
        </>
    )
}