'use client'

import { useState } from "react";
import Image from 'next/image';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import barcode from "../media/Barcode Gen Z.png";
import Navbar from "../landingpage/navbar";
import { FaCheck, FaTimes } from "react-icons/fa";
import red from "../media/red.svg";
import greencheck from "../media/greencheck.svg";

interface LookupResultType {
  barcode?: string;
  name?: string;
  manufacturer?: string;
  activeIngredients?: string;
  dosage?: string;
  description?: string;
  expiryDate?: string;
  batchNumber?: string;
}

export default function DrugVerification() {
  const [manualInput, setManualInput] = useState('');
  const [status, setStatus] = useState<'valid' | 'expired' | 'fake' | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [lookupResult, setLookupResult] = useState<LookupResultType | null>(null);

  const handleManualSubmit = async () => {
    if (manualInput.length !== 13) return;

    setLoading(true);
    setMessage('');
    setStatus(null);
    setLookupResult(null);

    try {
      const res = await fetch('/api/verify-medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: manualInput })
      });

      const data = await res.json();

      switch (data.status) {
        case 'authenticated':
          setStatus('valid');
          setLookupResult(data.medicine); // ✅ Grab medicine from API
          break;
        case 'not_found':
          setStatus('fake');
          break;
        case 'error':
        default:
          setStatus('expired');
          break;
      }

      setMessage(data.message);
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('fake');
      setMessage('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex flex-col items-center lg:justify-center px-3 bg-gray-50">
        <div className="w-full max-w-lg">
          {status === null && (
            <div className="mt-6 w-full flex flex-col gap-2 items-center">
              <div className="w-[265px] lg:w-[400px] mb-[120px] h-[170px]">
                <div className="bg-black h-[60px] flex items-center justify-center roboto text-white">BARCODE (ISBN)</div>
                <Image src={barcode} alt="barcode" className="w-[265px] lg:w-[400px]" />
              </div>

              <div className="w-full  flex items-center sm:px-0">
                <InputOTP
                  maxLength={13}
                  value={manualInput}
                  onChange={setManualInput}
                  className="flex flex-wrap justify-center gap-2"
                >
                  <div className="flex gap-1">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={1} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={2} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                    </InputOTPGroup>
                  </div>
                  <InputOTPSeparator className="hidden sm:inline-block" />
                  <div className="flex gap-1">
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={4} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={5} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                    </InputOTPGroup>
                  </div>
                  <InputOTPSeparator className="hidden sm:inline-block" />
                  <div className="flex gap-1">
                    <InputOTPGroup>
                      <InputOTPSlot index={6} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={7} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={8} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={9} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                    </InputOTPGroup>
                  </div>
                  <InputOTPSeparator className="hidden sm:inline-block" />
                  <div className="flex gap-1">
                    <InputOTPGroup>
                      <InputOTPSlot index={10} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={11} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                      <InputOTPSlot index={12} className="xs:w-5 xs:h-7 sm:w-5 sm:h-7 lg:w-10 lg:h-10" />
                    </InputOTPGroup>
                  </div>
                </InputOTP>
              </div>

              <button
                onClick={handleManualSubmit}
                disabled={loading || manualInput.length !== 13}
                className="mt-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Submit'}
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            {status === 'valid' && lookupResult && (
              <div>
                

                {/* Check if expired */}
                <div className="flex flex-col items-center">
                  {new Date(lookupResult.expiryDate ?? '') < new Date() ? (
                     <Image src={red} alt="red" />
                  ) : (
                      <Image src={greencheck} alt="green" />
                  )}
                </div>
                <div className="flex flex-col items-center">
                  {new Date(lookupResult.expiryDate ?? '') < new Date() ? (
                     <div> 

                      <div className="text-[20px]"> EXPIRED</div>
                      <div className="text-red mt-[20px]">This medication has expired; Do not use</div>
                     </div>
                    
                  ) : (
                      <div className="text-[#008000] text-[20px]"> AUTHENTIC MEDICATION</div>
                  )}
                </div>

                <div className="mt-3 text-left w-full space-y-1">
                  <div className='flex items-center space-x-1'>
                    <p className="font-medium">Name:</p>
                    <p className="text-gray-700 font-semibold">{lookupResult.name}</p>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <p className="font-medium">Manufacturer:</p>
                    <p className="text-gray-700 font-semibold">{lookupResult.manufacturer}</p>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <p className="font-medium">Dosage:</p>
                    <p className="text-gray-700 font-semibold">{lookupResult.dosage}</p>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <p className="font-medium">Ingredients:</p>
                    <p className="text-gray-700 font-semibold">{lookupResult.activeIngredients}</p>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <p className="font-medium">Description:</p>
                    <p className="text-gray-700 font-semibold">{lookupResult.description}</p>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <p className="font-medium">Expiry:</p>
                    <p className="text-gray-700 font-semibold">{lookupResult.expiryDate}</p>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <p className="font-medium">Batch No.:</p>
                    <p className="text-gray-700 font-semibold">{lookupResult.batchNumber}</p>
                  </div>
                  <div className='flex items-center space-x-1'>
                      <p className="font-medium">Expiry Date:</p>
                      <p className={`font-semibold ${new Date(lookupResult.expiryDate ?? '') < new Date() ? 'text-red-500' : 'text-gray-700'}`}>
                          {new Date(lookupResult.expiryDate ?? '') < new Date()
                              ? `Expired on ${lookupResult.expiryDate}`
                              : lookupResult.expiryDate}
                      </p>
                  </div>

                  <div className="flex flex-col items-center">
                    {new Date(lookupResult.expiryDate ?? '') < new Date() ? (
                      <div> 

                        
                      </div>
                      
                    ) : (
                        <div className="text-[#008000] mt-5"> This medication has been verified as authentic and safe to use</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {status === 'expired' && lookupResult && (
              <div>
              <p className="text-xl font-bold text-black">{lookupResult.name}</p>
              <p className="text-sm text-gray-500">by {lookupResult.manufacturer}</p>

              <div className="mt-3 text-left w-full space-y-1">
                <div className='flex items-center space-x-1'>
                  <p className="font-medium">Name:</p>
                  <p className="text-gray-700 font-semibold">{lookupResult.name}</p>
                </div>
                <div className='flex items-center space-x-1'>
                  <p className="font-medium">Manufacturer:</p>
                  <p className="text-gray-700 font-semibold">{lookupResult.manufacturer}</p>
                </div>
                <div className='flex items-center space-x-1'>
                  <p className="font-medium">Dosage:</p>
                  <p className="text-gray-700 font-semibold">{lookupResult.dosage}</p>
                </div>
                <div className='flex items-center space-x-1'>
                  <p className="font-medium">Ingredients:</p>
                  <p className="text-gray-700 font-semibold">{lookupResult.activeIngredients}</p>
                </div>
                <div className='flex items-center space-x-1'>
                  <p className="font-medium">Description:</p>
                  <p className="text-gray-700 font-semibold">{lookupResult.description}</p>
                </div>
                <div className='flex items-center space-x-1'>
                  <p className="font-medium">Expiry:</p>
                  <p className="text-gray-700 font-semibold">{lookupResult.expiryDate}</p>
                </div>
                <div className='flex items-center space-x-1'>
                  <p className="font-medium">Batch Number:</p>
                  <p className="text-gray-700 font-semibold">{lookupResult.batchNumber}</p>
                </div>
                <div className='flex items-center space-x-1'>
                    <p className="font-medium">Expiry Date:</p>
                    <p className={`font-semibold ${new Date(lookupResult.expiryDate ?? '') < new Date() ? 'text-red-500' : 'text-gray-700'}`}>
                        {new Date(lookupResult.expiryDate ?? '') < new Date()
                            ? `Expired on ${lookupResult.expiryDate}`
                            : lookupResult.expiryDate}
                    </p>
                </div>
              </div>
            </div>
            )}
            {status === 'fake' && (
              <Image src="/drug is fake.png" alt="Fake Medication" width={300} height={400} />
            )}

            {message && <p className="text-red-500 mt-4">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
