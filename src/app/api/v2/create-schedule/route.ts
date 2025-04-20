import prisma from '@/lib/prisma';
import ErrorHandler from '@/lib/ErrorHandler';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Parse the request body
        const body = await request.json();
        const { patientName, email, phone, appointmentDate, test } = body;

        // Input validation can be expanded here

        const appointment = await prisma.appointment.create({
            data: {
                patientName,
                email,
                phone,
                appointmentDate: new Date(appointmentDate),
                status: 'PENDING',
                test,
            },
        });
        // Send a response back
        return NextResponse.json(
            { message: 'Appointment created successfully', appointment },
            { status: 201 }
        );
    } catch (error) {
        const { message, status } = ErrorHandler(error);
        return NextResponse.json(
            { message: `Error creating appointment: ${message}` },
            { status: status }
        );
    }
}
