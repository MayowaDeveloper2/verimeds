import { NextResponse } from "next/server";
import drugs from "@/data/DRUGS.json";

export async function POST(request: Request) {
  try {
    const { barcode } = await request.json();

    const medicine = drugs.find((drug) => drug.barcode === barcode);

    if (medicine) {
      return NextResponse.json({
        status: "authenticated",
        message: "Medicine successfully verified.",
        medicine,
      });
    }
   

    return NextResponse.json({
      status: "not_found",
      message: "No medicine found for the given barcode.",
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      {
        status: "error",
        message: "Server error while verifying medicine.",
      },
      { status: 500 }
    );
  }
}
