/* eslint-disable react/no-unescaped-entities */
'use client';


import React from 'react'

const Troubleshooting = () => {
  return (
    <section className='ml-[5%] mr-[5%]'>
    <div>
        <div>
            <div>
                <header className='flex justify-between items-center w-full pt-4 pb-4'>
                    <div>
                        <a href="#"><img src="/arrow.png" alt="Arrow" /></a>
                    </div>
                    <div>
                        <a href="#"><img src="/Frame45.png" alt="Logo" /></a>
                    </div>
                </header>
                <div className='text-start flex pt-3 pb-3'>
                    <h1>Troubleshooting Tips for Scanning</h1>
                </div>

                <div className='text-start items-start flex-col justify-center pt-4 pb-2'>
                    <div className='flex-col pt-3 pb-2'>
                        <b className='pb-2 flex-col'>Ensure Proper Lighting:</b>
                        <ul>
                        <li className='list-disc list-inside'>Use the website in a well-lit area to ensure the barcode is clearly visible to the camera</li>
                        <li className='list-disc list-inside'>Avoid glare or shadows over the barcode.</li>
                        </ul>
                        
                    </div>

                    <div className='flex-col pt-2 pb-2'>
                      <b>Position the Barcode Correctly:</b>
                        <ul>
                        <li className='list-disc list-inside'>Use the website in a well-lit area to ensure the barcode is clearly visible to the camera</li>
                        <li className='list-disc list-inside'>Avoid glare or shadows over the barcode</li>
                        </ul>
                        
                    </div>

                    <div className='flex-col pt-2 pb-2'>
                     <b>Check the Barcode Condition:</b>
                        <ul>
                        <li className='list-disc list-inside'>Make sure the barcode is clean and not damaged. If unclear, use the manual entry option</li>
                        </ul>
                        
                    </div>

                    <div className='flex-col pt-2 pb-2'>
                     <b>Grant Camera Access:</b>
                        <ul>
                        <li className='list-disc list-inside'>Allow the website to access your device’s camera through your browser settings.</li>
                        </ul>
                    </div>

                    <div className='flex-col pt-2 pb-2'>
                    <b>Use Manual Entry as a Backup:</b>
                    <ul>
                        <li className='list-disc list-inside'>If the scanner doesn’t work, type the barcode number in the provided text box.</li>
                    </ul>
                    </div>


                </div>
            </div>
        </div>
    </div>
</section>
  )
}

export default Troubleshooting