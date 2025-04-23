/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from "@/app/landingpage/navbar";
import Quagga from 'quagga'; 
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

type QuaggaResult = {
  codeResult: {
    code: string;
  };
};

export default function Activate() {
  const quaggaRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);

  const startQuaggaScanner = () => {
    if (quaggaRef.current) {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: quaggaRef.current,
          constraints: {
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'upc_reader'],
        },
      }, (err: unknown) => {
        if (err) {
          console.error('Quagga init error:', err);
          return;
        }
        Quagga.start();
        Quagga.onDetected((data: QuaggaResult) => {
          console.log('Barcode detected:', data.codeResult.code);
          Quagga.stop();
        });
      });
    }
  };

  const startHtml5QrScanner = () => {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText: string) => {
        console.log(`QR Code detected: ${decodedText}`);
        html5QrCode.stop().catch(console.error);
      },
      (errorMessage: string) => {
        console.warn('QR scan error:', errorMessage);
      }
    ).catch(console.error);
  };

  const handleActivate = () => {
    setScanning(true);
    startQuaggaScanner();
    startHtml5QrScanner();
  };

  useEffect(() => {
    return () => {
      Quagga.stop();
      html5QrCodeRef.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full h-screen bg-[#d5f7ff] pt-[30px] lg:pt-[50px] flex flex-col items-center lg:px-[100px] px-[20px]">
        <div className="text-[#325982] text-[16px] text-center">
          Align the barcode or QR code within the scanning frame to verify the drug's authenticity.
        </div>

        <div className="mt-[40px] relative w-[307px] h-[383.75px] rounded-md border-4 border-yellow-500">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-yellow-500" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-yellow-500" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-yellow-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-yellow-500" />
          <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-400 animate-scan-line" />
          {/* Scanner Targets */}
          <div id="qr-reader" className="w-full h-full absolute" />
          <div ref={quaggaRef} className="w-full h-full absolute" />
        </div>

        <div className="flex flex-col mt-[30px] lg:mt-[40px] w-full justify-center lg:items-center">
          <button
            onClick={handleActivate}
            className="lg:w-[350px] flex items-center justify-center h-[60px] bg-[#007BFF] px-3 py-2 rounded-[200px] text-white"
          >
            {scanning ? "Scanning..." : "Activate Scanner"}
          </button>
          <div className="text-[#007BFF] text-[14px] mt-2">
            Having trouble scanning?{" "}
            <span className="font-medium underline cursor-pointer">Click here for tips.</span>
          </div>
        </div>
      </div>
    </>
  );
}
