import ErrorHandler from '@/lib/ErrorHandler';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // const body = await request.json()
    // const { email } = body
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ message: "Email not provided" }, { status: 400 })
    }

    // Check if email exists in the appointment database
    const appointment = await prisma.appointment.findFirst({
      where: { email: email },
      select: {
        patientName: true,
        phone: true,
      }
    })
    if (!appointment) {
      return NextResponse.json({
        message: "Email not found. Create new record.", data: {
          patientName: "",
          phone: "",
        }
      }, { status: 200 })
    }
    // If email exists, return the data
    return NextResponse.json({
      message: "Email found",
      data: {
        patientName: appointment.patientName,
        phone: appointment.phone,
      }
    }, { status: 200 })

  } catch (error) {
    const { message, status } = ErrorHandler(error)
    return NextResponse.json({ message: `Error checking email: ${message}` }, { status: status })
  }
}