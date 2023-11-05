import deviceOs from "@/utils/deviceOs.utils";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    result: deviceOs.result().os,
  });
}
