import { NextResponse } from "next/server";
import drugs from "@/data/DRUGS.json";

export async function POST(request: Request) {
  try {
    const { barcode } = await request.json();
    console.log('Received barcode lookup request for:', barcode);
    console.log('Available drugs in database:', drugs);

    const medicine = drugs.find((drug) => drug.barcode === barcode);

    if (medicine) {
      console.log('Medicine found:', medicine);
      return NextResponse.json({
        status: "authenticated",
        message: "Medicine successfully verified.",
        medicine,
      });
    }

    console.log('No medicine found for barcode:', barcode);
    return NextResponse.json({
      status: "not_found",
      message: "No medicine found for the given barcode.",
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
