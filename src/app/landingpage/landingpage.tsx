/* eslint-disable react/no-unescaped-entities */
'use client';

import Image from "next/image";
import barcode from "../media/barcode.png"
import { LuScanLine } from "react-icons/lu";
import { MdOutlineKeyboard } from "react-icons/md";
import Link from "next/link";


export default function Body() {
    return(
        <>
            <div className="w-full h-screen bg-[#d5f7ff] pt-[30px] lg:pt-[50px] flex flex-col items-center lg:px-[100px] px-[20px]">
                <Image src={barcode} alt="barcode" className="w-[335px] h-[227px]" />
                <div className="mt-[40px]">
                    <div className="text-[#011F40] text-[30px]">Verify your medication validity in <span className="text-[#007BFF]">seconds.</span></div>
                    <div className="text-[#325982] text-[16px]">Scan and verify your medication using our barcode scanning feature.</div>
                </div>
                <div className="flex flex-col gap-5  lg:flex-row mt-[30px] lg:mt-[40px] w-full justify-center lg:items-center">
                    <Link href="/activate-scanner" className="lg:w-[350px] ">
                        <button className="lg:w-[350px] flex items-center justify-center h-[60px] bg-[#007BFF] px-3 py-2 rounded-[200px] text-white"> <LuScanLine className="text-[#ffffff] mr-2 text-[24px]" />Scan Barcode Now</button>
                    </Link>
                    
                    <button className="lg:w-[350px] flex items-center  justify-center h-[60px] border-[2px] border-[#007BFF] px-3 py-2 rounded-[200px] text-black mt-[20px] lg:mt-[0px]"><MdOutlineKeyboard className="text-[#007BFF] mr-2 text-[24px]" /> Enter Barcode</button>

                </div>

            </div>
        
        </>
    )
}