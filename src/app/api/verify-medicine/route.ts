import { NextResponse } from "next/server";
import drugs from "@/data/DRUGS.json";

// Helper function to extract ID from QR code URL
function extractIdFromUrl(url: string): string | null {
  try {
    // Check if it's a URL with an ID parameter
    if (url.includes('?id=')) {
      const idMatch = url.match(/[?&]id=([^&]+)/);
      return idMatch ? idMatch[1] : null;
    }
    // Check for other URL patterns that might contain medicine IDs
    if (url.includes('/medicine/') || url.includes('/drug/') || url.includes('/product/')) {
      const pathSegments = url.split('/');
      // Get the last segment which might be the ID
      const potentialId = pathSegments[pathSegments.length - 1];
      // Remove any query parameters
      return potentialId.split('?')[0];
    }
    return null;
  } catch (error) {
    console.error('Error extracting ID from URL:', error);
    return null;
  }
}

// Helper function to parse JSON QR codes
function parseJsonQrCode(jsonString: string): string | null {
  try {
    const data = JSON.parse(jsonString);
    // Return the ID if it exists, or construct an ID from product and strength
    if (data.id) return data.id;
    if (data.product) {
      return data.strength
        ? `MED-${data.product.toUpperCase()}-${data.strength.toUpperCase()}`
        : `MED-${data.product.toUpperCase()}`;
    }
    // Check for other common fields that might identify a medicine
    if (data.name || data.medicine || data.drug) {
      const productName = data.name || data.medicine || data.drug;
      const strength = data.strength || data.dosage || '';
      return strength
        ? `MED-${productName.toUpperCase()}-${strength.toUpperCase()}`
        : `MED-${productName.toUpperCase()}`;
    }
    return null;
  } catch (error) {
    console.error('Error parsing JSON QR code:', error);
    return null;
  }
}

// Helper function to extract medicine information from text
function extractMedicineInfoFromText(text: string): string | null {
  try {
    // Check if the text contains common medicine identifiers
    const medicineMatches = text.match(/(?:medicine|drug|product)[:\s]+([a-zA-Z0-9\s\-]+)/i);
    if (medicineMatches && medicineMatches[1]) {
      return `MED-${medicineMatches[1].trim().toUpperCase()}`;
    }

    // Check for patterns like "Name: Paracetamol, Strength: 500mg"
    const nameMatch = text.match(/(?:name|product)[:\s]+([a-zA-Z0-9\s\-]+)(?:,|\s|$)/i);
    const strengthMatch = text.match(/(?:strength|dosage)[:\s]+([a-zA-Z0-9\s\-]+)(?:,|\s|$)/i);

    if (nameMatch && nameMatch[1]) {
      const name = nameMatch[1].trim();
      const strength = strengthMatch && strengthMatch[1] ? strengthMatch[1].trim() : '';

      return strength
        ? `MED-${name.toUpperCase()}-${strength.toUpperCase()}`
        : `MED-${name.toUpperCase()}`;
    }

    return null;
  } catch (error) {
    console.error('Error extracting medicine info from text:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { barcode } = await request.json();
    console.log('Received barcode/QR code lookup request for:', barcode);

    // First try direct match (works for regular barcodes and simple QR codes)
    let medicine = drugs.find((drug) => drug.barcode === barcode);
    let extractedId = null;

    // If no direct match, try to parse the QR code in different formats
    if (!medicine) {
      console.log('No direct match found, trying to parse QR code...');

      // Try to extract ID from URL
      extractedId = extractIdFromUrl(barcode);
      if (extractedId) {
        console.log('Extracted ID from URL:', extractedId);
        medicine = drugs.find((drug) => drug.barcode === extractedId);
      }

      // Try to parse as JSON
      if (!medicine && barcode.startsWith('{') && barcode.endsWith('}')) {
        extractedId = parseJsonQrCode(barcode);
        if (extractedId) {
          console.log('Extracted ID from JSON:', extractedId);
          medicine = drugs.find((drug) => drug.barcode === extractedId);
        }
      }

      // Try to extract medicine info from plain text
      if (!medicine) {
        extractedId = extractMedicineInfoFromText(barcode);
        if (extractedId) {
          console.log('Extracted ID from text:', extractedId);
          medicine = drugs.find((drug) => drug.barcode === extractedId);
        }
      }

      // Try fuzzy matching for QR codes
      if (!medicine) {
        // First try exact substring matching
        medicine = drugs.find((drug) =>
          drug.qrCode &&
          (barcode.includes(drug.barcode) || drug.barcode.includes(barcode))
        );

        // If still no match, try case-insensitive matching
        if (!medicine) {
          const lowercaseBarcode = barcode.toLowerCase();
          medicine = drugs.find((drug) => {
            if (!drug.qrCode) return false;
            const lowercaseDrugBarcode = drug.barcode.toLowerCase();
            return lowercaseBarcode.includes(lowercaseDrugBarcode) ||
                   lowercaseDrugBarcode.includes(lowercaseBarcode);
          });
        }

        // Try to match by medicine name if included in the QR code
        if (!medicine) {
          medicine = drugs.find((drug) => {
            if (!drug.name) return false;
            const lowercaseName = drug.name.toLowerCase();
            const lowercaseBarcode = barcode.toLowerCase();
            return lowercaseBarcode.includes(lowercaseName);
          });
        }
      }
    }

    if (medicine) {
      console.log('Medicine found:', medicine);
      return NextResponse.json({
        status: "authenticated",
        message: "Medicine successfully verified.",
        medicine,
        extractedId: extractedId // Include the extracted ID for debugging
      });
    }

    console.log('No medicine found for barcode/QR code:', barcode);
    return NextResponse.json({
      status: "not_found",
      message: "No matching medicine found in our database.",
    });
  } catch (error) {
    console.error('Error in verify-medicine API:', error);
    return NextResponse.json(
      {
        status: "error",
        message: "Server error while verifying medicine.",
      },
      { status: 500 }
    );
  }
}
