'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { LuScanLine } from "react-icons/lu";
import { MdOutlineKeyboard } from "react-icons/md";
import barcode from "../media/barcode.png";
import Quagga from '@ericblade/quagga2';
import { FaCheck, FaTimes } from "react-icons/fa";
import { Html5Qrcode } from "html5-qrcode";

interface LookupResultType {
    status?: 'authenticated' | 'not_found' | 'error';
    barcode?: string;
    name?: string;
    manufacturer?: string;
    activeIngredients?: string;
    dosage?: string;
    description?: string;
    expiryDate?: string;
    batchNumber?: string;
    message: string;
}


export default function Body() {
    const scannerRef = useRef<HTMLDivElement | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const [scannerType, setScannerType] = useState<'barcode' | 'qrcode'>('barcode');
    const [isStarted, setIsStarted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lookupResult, setLookupResult] = useState<LookupResultType | null>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [isDrugFound, setIsDrugFound] = useState(false);
    const [manualInputVisible, setManualInputVisible] = useState(false);
    const [manualInput, setManualInput] = useState('');

    const handleDetected = async (code: string | null) => {
        if (!code) return;
        setScannedResult(code);
        stopScanner();

        // Call API lookup when code is detected
        await handleBarcodeLookup(code);
    };

    const handleBarcodeLookup = async (barcode: string) => {
        try {
            setIsLookingUp(true);
            const res = await fetch('/api/verify-medicine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ barcode })
            });

            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }

            const result = await res.json();
            console.log('API response:', result);

            // Check the status from the API response
            if (result.status === "authenticated") {
                setIsDrugFound(true);
                setLookupResult(result.medicine);
            } else if (result.status === "not_found") {
                setIsDrugFound(false);
                setLookupResult({ message: "No matching medicine found in our database." });
            } else if (result.status === "error") {
                throw new Error(result.message || "Unknown error occurred");
            } else {
                setIsDrugFound(false);
                setLookupResult({ message: "Unexpected response from server." });
            }
        } catch (err) {
            console.error("Error looking up barcode:", err);
            setError(`Failed to look up barcode: ${err instanceof Error ? err.message : String(err)}`);
            setIsDrugFound(false);
        } finally {
            setIsLookingUp(false);
        }
    };

    const startScanner = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setError(null);
        setScannedResult(null);
        setLookupResult(null);
        setManualInputVisible(false);

        try {
            if (scannerType === 'barcode') {
                if (!scannerRef.current) {
                    throw new Error("Scanner reference not available");
                }

                await Quagga.init({
                    inputStream: {
                        name: "Live",
                        type: "LiveStream",
                        target: scannerRef.current,
                        constraints: {
                            facingMode: "environment",
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
                });

                Quagga.offDetected();
                Quagga.onDetected((result) => {
                    const code = result?.codeResult?.code;
                    if (code) handleDetected(code);
                });

                Quagga.start();
                setIsStarted(true);
            } else {
                const regionId = "qr-reader";
                html5QrCodeRef.current = new Html5Qrcode(regionId);

                try {
                    // First try to use the back camera with facingMode: "environment"
                    await html5QrCodeRef.current.start(
                        { facingMode: { exact: "environment" } },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        (decodedText) => handleDetected(decodedText),
                        (scanErr) => console.warn("QR scan error", scanErr)
                    );
                } catch (err) {
                    console.warn("Could not start with environment camera, trying alternative method", err);

                    // Fallback: try with regular environment mode (not exact)
                    try {
                        await html5QrCodeRef.current.start(
                            { facingMode: "environment" },
                            { fps: 10, qrbox: { width: 250, height: 250 } },
                            (decodedText) => handleDetected(decodedText),
                            (scanErr) => console.warn("QR scan error", scanErr)
                        );
                    } catch (err2) {
                        console.warn("Could not start with environment camera, falling back to camera selection", err2);

                        // Final fallback: use camera selection
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
                        await html5QrCodeRef.current.start(
                            backCamera ? backCamera.id : cameras[0].id,
                            { fps: 10, qrbox: { width: 250, height: 250 } },
                            (decodedText) => handleDetected(decodedText),
                            (scanErr) => console.warn("QR scan error", scanErr)
                        );
                    }
                }

                setIsStarted(true);
            }
        } catch (err) {
            if (err instanceof Error) {
                const errorMsg = err.message || String(err);
                setError(`Failed to start ${scannerType} scanner: ${errorMsg}`);
            }
            await stopScanner();
        } finally {
            setIsProcessing(false);
        }
    };

    const stopScanner = useCallback(async () => {
        setIsProcessing(true);

        try {
            if (scannerType === 'barcode') {
                try {
                    Quagga.offDetected();
                    await Quagga.stop();
                } catch (err) {
                    console.error("Error stopping Quagga:", err);
                }
            }

            if (scannerType === 'qrcode' && html5QrCodeRef.current) {
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
            setIsStarted(false);
            setIsProcessing(false);
        }
    }, [scannerType, html5QrCodeRef, setIsStarted, setIsProcessing]);


    const toggleScannerType = async () => {
        if (isStarted || isProcessing) {
            await stopScanner();
        }
        setScannedResult(null);
        setLookupResult(null);
        setManualInputVisible(false);
        setScannerType((prev) => (prev === 'barcode' ? 'qrcode' : 'barcode'));
    };

    const handleManualSubmit = async () => {
        if (manualInput.trim() !== '') {
            const code = manualInput.trim();
            setScannedResult(code);
            setManualInput('');
            setManualInputVisible(false);

            // Call API lookup for manually entered code
            await handleBarcodeLookup(code);
        }
    };

    const handleManualKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleManualSubmit();
        }
    };

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, [stopScanner]);


    return (
        <div className="w-full min-h-screen bg-[#d5f7ff] py-[30px] lg:py-[50px] flex flex-col items-center lg:px-[100px] px-[20px]">
            <Image src={barcode} alt="barcode" className="w-[335px] h-[227px]" />

            <div className="mt-[40px] text-center">
                <div className="text-[#011F40] text-[30px]">
                    Verify your medication validity in <span className="text-[#007BFF]">seconds.</span>
                </div>
                <div className="text-[#325982] text-[16px]">
                    Scan and verify your medication using our barcode scanning feature.
                </div>
            </div>

            <div className="my-4 flex justify-center">
                <button
                    onClick={toggleScannerType}
                    disabled={isProcessing}
                    className={`cursor-pointer bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium py-2 px-4 rounded-full ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Current mode: {scannerType === 'barcode' ? 'Barcode' : 'QR Code'} (tap to switch)
                </button>
            </div>

            <div ref={scannerRef} className="h-[400px] border w-full max-w-lg relative">
                {scannerType === 'qrcode' && <div id="qr-reader" className="w-full h-full" />}

                {scannedResult && (
                    <div className="absolute inset-0 bg-white p-6 rounded-lg shadow-md text-center flex flex-col justify-center">
                        <p className="text-lg font-semibold mb-1">Scanned barcode:</p>
                        <p className="text-gray-700 mb-4">{scannedResult}</p>

                        {isLookingUp && (
                            <div className="flex justify-center items-center mt-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                <span className="text-gray-600">Looking up...</span>
                            </div>
                        )}

                        {lookupResult && !isLookingUp && (
                            <div className="mt-4 w-full max-w-lg rounded-xl p-4">
                                <div className="flex flex-col items-center text-center">
                                    {isDrugFound ? (
                                        <>
                                            {/* Check if expired */}
                                            {new Date(lookupResult.expiryDate ?? '') < new Date() ? (
                                                <FaTimes className="text-[4rem] text-red-500 mb-2" />
                                            ) : (
                                                <FaCheck className="text-[4rem] text-green-600 mb-2" />
                                            )}

                                            <p className="text-xl font-bold text-black">{lookupResult.name}</p>
                                            <p className="text-sm text-gray-500">by {lookupResult.manufacturer}</p>

                                            <div className="mt-3 text-left w-full">
                                                <div className='flex items-center space-x-1'>
                                                    <p className="font-medium">Name:</p>
                                                    <p className="text-gray-700 font-semibold">{lookupResult.name}</p>
                                                </div>
                                                <div className='flex items-center space-x-1'>
                                                    <p className="font-medium">Manufacturer:</p>
                                                    <p className="text-gray-700 font-semibold">{lookupResult.manufacturer}</p>
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
                                        </>

                                    ) : (
                                        <>
                                            <FaTimes className="text-[4rem] text-red-500 mb-2" />
                                            <p className="text-base font-medium text-red-600">
                                                {lookupResult.message || 'No matching medicine found.'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!isStarted && !scannedResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white text-center p-4">
                        <p>Click &quot;Start Scanner&quot; to activate the camera</p>
                    </div>
                )}

                {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white p-3 rounded-lg">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">Processing...</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-2 text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>
            )}

            <div className="mt-6 flex gap-4 justify-center flex-wrap">
                {!isStarted ? (
                    <button
                        onClick={startScanner}
                        disabled={isProcessing}
                        className={`relative cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full flex items-center ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <LuScanLine className="mr-2 text-lg" />
                        {isProcessing ? 'Starting...' : 'Start Scanner'}
                    </button>
                ) : (
                    <button
                        onClick={stopScanner}
                        disabled={isProcessing}
                        className={`relative cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isProcessing ? 'Stopping...' : 'Stop Scanner'}
                    </button>
                )}

                {scannedResult && (
                    <button
                        onClick={() => {
                            setScannedResult(null);
                            setLookupResult(null);
                            setError(null);
                            setIsDrugFound(false);
                        }}
                        className="relative cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full"
                    >
                        Scan Again
                    </button>
                )}

                <button
                    onClick={() => {
                        setManualInputVisible(true);
                        setScannedResult(null);
                        setLookupResult(null);
                        setError(null);
                        setIsDrugFound(false);
                        stopScanner();
                    }}
                    className="relative cursor-pointer border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold py-3 px-8 rounded-full flex items-center"
                >
                    <MdOutlineKeyboard className="mr-2 text-lg" />
                    Enter Barcode
                </button>
            </div>

            {manualInputVisible && (
                <div className="mt-6 w-full max-w-lg flex flex-col gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Enter barcode manually and press Enter"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value) }
                        onKeyDown={handleManualKeyDown}
                        className="w-full px-4 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                        onClick={handleManualSubmit}
                        className="mt-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}
