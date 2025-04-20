import prisma from '@/lib/prisma';
import ErrorHandler from '@/lib/ErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, status, doctorId } = body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Update appointment status 
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: status,
        doctorId: status !== 'DECLINED' ? doctorId : null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    const { message, status } = ErrorHandler(error);
    return NextResponse.json(
      { message: `Error approving appointment: ${message}` },
      { status }
    );
  }
}