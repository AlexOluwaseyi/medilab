import ErrorHandler from "@/lib/ErrorHandler";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { message: "ID is required." },
                { status: 400 }
            );
        }

        const doctorExists = await prisma.doctors.findUnique({
            where: { id },
        });

        if (!doctorExists) {
            return NextResponse.json(
                { message: "Doctor not found." },
                { status: 404 }
            );
        }

        const body = await request.json();

        if (!body) {
            return NextResponse.json(
                { message: "Data not sent in request." },
                { status: 400 }
            );
        }

        const { name, email, specialty } = body;

        if (!name || !email || !specialty) {
            return NextResponse.json(
                { message: "Required fields missing." },
                { status: 400 }
            );
        }

        const updatedDoctor = await prisma.doctors.update({
            where: { id },
            data: {
                name,
                specialty,
                email,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(
            { message: "Doctor updated successfully", updatedDoctor },
            { status: 200 }
        );
    } catch (error) {
        const { status, message } = ErrorHandler(error);
        return NextResponse.json({ message: message }, { status });
    }
}