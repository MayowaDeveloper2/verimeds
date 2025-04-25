'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import verimedsLogo from '../../media/Verimeds Logo.svg';

export default function Report() {
    const [formData, setFormData] = useState({
        drugName: '',
        issue: '',
        barcode: '',
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        alert('Form submitted successfully!');

        // Clear form
        setFormData({
            drugName: '',
            issue: '',
            barcode: '',
            email: '',
        });
    };

    return (
        <div className='p-4 md:p-8 lg:p-12 xl:p-16'>
            <header className='flex justify-between items-center w-full pt-4 pb-4'>
                <div className='cursor-pointer' onClick={() => window.history.back()}>
                    <BsArrowLeft className='text-[2rem]' />
                </div>
                <div>
                    <Image src={verimedsLogo} alt="Logo" />
                </div>
            </header>
            <div className='text-2xl pt-2'>
                <h1>Report Suspicious Drug</h1>
            </div>

            <div className='pt-8'>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    <label htmlFor="drugName" className='font-semibold'>Drug Name</label>
                    <input
                        id="drugName"
                        name="drugName"
                        className='w-full p-4 border border-gray-300 rounded-lg'
                        type="text"
                        value={formData.drugName}
                        onChange={handleChange}
                    />

                    <label htmlFor="issue" className='font-semibold'>Details of the report</label>
                    <textarea
                        id="issue"
                        name="issue"
                        className='w-full p-4 h-40 border border-gray-300 rounded-lg resize-none'
                        value={formData.issue}
                        onChange={handleChange}
                    />

                    <label htmlFor="barcode" className='font-semibold'>Barcode</label>
                    <input
                        id="barcode"
                        name="barcode"
                        className='w-full p-4 border border-gray-300 rounded-lg'
                        type="text"
                        value={formData.barcode}
                        onChange={handleChange}
                    />

                    <label htmlFor="email" className='font-semibold'>Contact Email (Optional)</label>
                    <input
                        id="email"
                        name="email"
                        className='w-full p-4 border border-gray-300 rounded-lg'
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        type="submit"
                        value="Submit"
                        className='cursor-pointer w-full bg-blue-500 text-white py-4 rounded-full'
                    />
                </form>
            </div>
        </div>
    );
}
