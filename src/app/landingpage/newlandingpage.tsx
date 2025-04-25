'use client';

import Image from "next/image";
import landing from "../media/Frame 36.png"
import { ScanLine, Keyboard } from 'lucide-react';
import Link from "next/link";


export default function LandingPage() {
    return (
        <>
            <div className="w-full flex flex-col items-center px-[20px]">

                <div className="mt-[50px]">
                    <Image src={landing} alt="landing" className="lg:w-[600px] " />
                </div>
                <div className="mt-[20px] roboto font-bold text-[#011F40] text-[30px]">
                    Verify your medication validity in <span className="text-[#007BFF]">seconds.</span>
                </div>
                <div className="roboto text-[#325982]">Scan and verify your medication using our barcode scanning feature</div>
                <div className="flex roboto lg:flex-row flex-col mt-[20px] gap-[20px]">
                    <Link href="/activate-scanner">
                        <button className="bg-[#007BFF] w-[335px] h-[60px] px-[48px] py-[20px] rounded-full text-white flex items-center justify-center"> <ScanLine className="mr-2" /> Scan Barcode Now</button>
                    </Link>
                    <Link href="/enter-barcode">
                        <button className="border-[#007BFF] w-[335px] h-[60px] border-1 px-[48px] py-[20px] text-[#007BFF] rounded-full flex items-center justify-center"> <Keyboard className="mr-2"/> Enter Barcode</button>
                    </Link>
                    
                </div>

            </div>
        </>
    )
}