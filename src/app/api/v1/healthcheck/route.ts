import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ErrorHandler from "@/lib/ErrorHandler";

export async function GET() {
  try {
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as alive`;
    return NextResponse.json({ 
      status: "ok",
      database: "connected",
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}