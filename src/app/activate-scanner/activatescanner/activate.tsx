/* eslint-disable react/no-unescaped-entities */
'use client';

import Image from "next/image";
import barcodeactivate from "../../media/Scan Image.png";
import Navbar from "@/app/landingpage/navbar";




export default function Activate() {
    return(

        <>  
            <Navbar />
            <div className="w-full h-screen bg-[#d5f7ff] pt-[30px] lg:pt-[50px] flex flex-col items-center lg:px-[100px] px-[20px]">
            <div className="text-[#325982] text-[16px]">Align the barcode within the scanning frame to verify the drug's authencity.</div>
                <div className="mt-[40px]">
                    <Image src={barcodeactivate} alt="barcode" className="w-[307px] h-[383.75px]" />
                </div>
                <div className="flex flex-col  mt-[30px] lg:mt-[40px] w-full justify-center lg:items-center">
                    <button className="lg:w-[350px] flex items-center justify-center h-[60px] bg-[#007BFF] px-3 py-2 rounded-[200px] text-white"> Activate Scanner</button>
                    <div className="text-[#007BFF] text-[14px]">Have trouble scanning? <span className="text-[#007BFF]">Click here for tips.</span></div>
                </div>

            </div>
        
        </>
    )
}