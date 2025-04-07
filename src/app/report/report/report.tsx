/* eslint-disable react/no-unescaped-entities */
'use client';

import Image from 'next/image';

export default function Report() {
    return (
        <div className='p-4 md:p-8 lg:p-12 xl:p-16'>
            <nav className='bg-white'>
                <div className='flex justify-between items-center'>
                    <Image
                        src="/ep_back.png"
                        alt=""
                        width={25}
                        height={25}
                    />
                    <Image
                        src="/Frame 44.png"
                        alt=""
                        width={100}
                        height={100}
                    />
                </div>
            </nav>
            <div className='text-2xl font-bold pt-2'>
                <h1>Report Suspicious Drug</h1>
            </div>
            <div className='pt-8'>
                <form className='space-y-6' action="">
                    <label htmlFor=""></label>
                    <input className='w-full p-4 border border-gray-300 font-bold rounded-lg' 
                        type="text" value="Drug Name"/><br/>

                    <label htmlFor=""></label>
                    <input className='w-full p-4 pb-20 border border-gray-300 font-bold rounded-lg' 
                        type="text" value="Details of the Issue"/><br/>

                    <label htmlFor=""></label>
                    <input className='w-full p-4 border border-gray-300 font-bold rounded-lg' 
                        type="text" value="Barcode"/><br/>

                    <label htmlFor=""></label>
                    <input className='w-full p-4 border border-gray-300 font-bold rounded-lg' 
                        type="text" value="Contact Email (Optional)"/>
                </form>
                <div className='pt-14'>
                    <input className='w-full bg-blue-500 text-white py-4 rounded-full'
                        type="submit" value="Submit"/>
                </div>
            </div>
        </div>
    )
}