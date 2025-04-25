/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from "@/app/landingpage/navbar";
import Quagga from 'quagga';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

type QuaggaResult = {
  codeResult: {
    code: string;
  };
};

interface ScanResult {
  code: string;
  type: 'barcode' | 'qrcode';
}

export default function Activate() {
  const router = useRouter();
  const quaggaRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startQuaggaScanner = () => {
    if (quaggaRef.current) {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: quaggaRef.current,
          constraints: {
            facingMode: 'environment',
            width: { min: 450 },
            height: { min: 300 },
            aspectRatio: { min: 1, max: 2 },
          },
        },
        locator: { patchSize: "medium", halfSample: true },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 10,
        decoder: {
          readers: [
            "ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader",
            "code_128_reader", "code_39_reader", "code_93_reader", "codabar_reader"
          ]
        },
        locate: true,
      }, (err: unknown) => {
        if (err) {
          console.error('Quagga init error:', err);
          return;
        }
        Quagga.start();
        Quagga.onDetected((data: QuaggaResult) => {
          console.log('Barcode detected:', data.codeResult.code);
          handleCodeDetected(data.codeResult.code, 'barcode');
        });
      });
    }
  };

  const startHtml5QrScanner = async () => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true
      },
      rememberLastUsedCamera: true,
      aspectRatio: 1.0,
      formatsToSupport: [
        'QR_CODE',
        'DATA_MATRIX',
        'UPC_A',
        'UPC_E',
        'EAN_13',
        'EAN_8',
        'CODE_39',
        'CODE_93',
        'CODE_128'
      ]
    };

    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = html5QrCode;

    try {
      // First try to use the back camera with facingMode: "environment"
      await html5QrCode.start(
        { facingMode: { exact: "environment" } },
        config,
        (decodedText: string) => {
          console.log(`QR Code detected: ${decodedText}`);
          handleCodeDetected(decodedText, 'qrcode');
        },
        (errorMessage: string) => {
          console.warn('QR scan error:', errorMessage);
        }
      );
    } catch (err) {
      console.warn("Could not start with environment camera, trying alternative method", err);

      // Fallback: try with regular environment mode (not exact)
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText: string) => {
            console.log(`QR Code detected: ${decodedText}`);
            handleCodeDetected(decodedText, 'qrcode');
          },
          (errorMessage: string) => {
            console.warn('QR scan error:', errorMessage);
          }
        );
      } catch (err2) {
        console.warn("Could not start with environment camera, falling back to camera selection", err2);

        // Final fallback: use camera selection
        try {
          const cameras = await Html5Qrcode.getCameras();

          if (!cameras.length) {
            throw new Error("No camera devices found.");
          }

          // Try to find a back camera by looking for "back" in the label
          const backCamera = cameras.find(camera =>
            camera.label.toLowerCase().includes('back') ||
            camera.label.toLowerCase().includes('rear') ||
            camera.label.toLowerCase().includes('environment'));

          // Use the back camera if found, otherwise use the first available camera
          await html5QrCode.start(
            backCamera ? backCamera.id : cameras[0].id,
            config,
            (decodedText: string) => {
              console.log(`QR Code detected: ${decodedText}`);
              handleCodeDetected(decodedText, 'qrcode');
            },
            (errorMessage: string) => {
              console.warn('QR scan error:', errorMessage);
            }
          );
        } catch (err3) {
          console.error("Failed to start QR scanner:", err3);
        }
      }
    }
  };

  const handleCodeDetected = async (code: string, type: 'barcode' | 'qrcode') => {
    if (isProcessing) return;

    setIsProcessing(true);
    setScanResult({ code, type });
    await stopScanners();

    // Redirect to results page or process the code
    try {
      const res = await fetch('/api/verify-medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: code })
      });

      if (res.ok) {
        const result = await res.json();
        console.log('API response:', result);

        // Here you could redirect to a results page with the data
        // For now, we'll just set scanning to false
        setScanning(false);
      }
    } catch (error) {
      console.error('Error verifying medicine:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActivate = () => {
    if (scanning) {
      stopScanners();
      return;
    }

    setScanning(true);
    setScanResult(null);
    startQuaggaScanner();
    startHtml5QrScanner();
  };

  const stopScanners = async () => {
    setIsProcessing(true);

    try {
      // Stop Quagga scanner
      try {
        Quagga.offDetected();
        await Quagga.stop();
      } catch (err) {
        console.error("Error stopping Quagga:", err);
      }

      // Stop HTML5 QR scanner
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
            html5QrCodeRef.current.clear();
          }
        } catch (err) {
          console.error("Error stopping QR scanner:", err);
        }
      }
    } finally {
      setScanning(false);
      setIsProcessing(false);
    }
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
      <div className="w-full min-h-screen bg-[#d5f7ff] pt-[30px] lg:pt-[50px] flex flex-col items-center lg:px-[100px] px-[20px]">
        <div className="text-[#325982] text-[16px] text-center">
          Align the barcode or QR code within the scanning frame to verify the drug's authenticity.
        </div>

        <div className="mt-[40px] relative w-[307px] h-[383.75px] rounded-md border-4 border-yellow-500">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-yellow-500" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-yellow-500" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-yellow-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-yellow-500" />

          {scanning && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-400 animate-scan-line z-10" />
          )}

          {/* Scanner Targets */}
          <div id="qr-reader" className="w-full h-[373.75px] absolute z-0" />
          <div ref={quaggaRef} className="w-full h-full absolute hidden" />

          {/* Stop Camera Button - Only show when scanning */}
          {scanning && !isProcessing && (
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={stopScanners}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full shadow-md flex items-center justify-center"
              >
                <span className="mr-1">✕</span> Stop Camera
              </button>
            </div>
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-30">
              <div className="bg-white p-3 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Processing...</p>
              </div>
            </div>
          )}

          {/* Scan Result Overlay */}
          {scanResult && !isProcessing && (
            <div className="absolute inset-0 bg-white p-6 rounded-lg shadow-md text-center flex flex-col justify-center z-20">
              <p className="text-lg font-semibold mb-1">Scanned {scanResult.type}:</p>
              <p className="text-gray-700 mb-4 break-words">{scanResult.code}</p>
              <p className="text-sm text-gray-500">Verifying medicine...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col mt-[30px] lg:mt-[40px] w-full justify-center lg:items-center">
          <button
            onClick={handleActivate}
            disabled={isProcessing}
            className={`lg:w-[350px] flex items-center justify-center h-[60px] ${scanning ? 'bg-red-500 hover:bg-red-600' : 'bg-[#007BFF] hover:bg-blue-600'} px-3 py-2 rounded-[200px] text-white ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? "Processing..." : scanning ? "Stop Scanner" : "Activate Scanner"}
          </button>

          {scanResult && (
            <button
              onClick={() => {
                setScanResult(null);
                setScanning(false);
              }}
              className="mt-4 lg:w-[350px] flex items-center justify-center h-[60px] bg-gray-500 hover:bg-gray-600 px-3 py-2 rounded-[200px] text-white"
            >
              Scan Again
            </button>
          )}

          <div className="text-[#007BFF] text-[14px] mt-2">
            Having trouble scanning?{" "}
            <span className="font-medium underline cursor-pointer">Click here for tips.</span>
          </div>
        </div>
      </div>
    </>
  );
}
