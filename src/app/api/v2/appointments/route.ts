import prisma from "@/lib/prisma";
import ErrorHandler from "@/lib/ErrorHandler";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                TestResult: {
                    select: {
                        id: true,
                        result: true,
                        createdAt: true,
                        // updatedAt: true
                    }
                },
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        specialty: true
                    }
                }
            }
        });

        if (!appointments) {
            return NextResponse.json(
                { message: "No appointments found." },
                { status: 200 }
            );
        }

        return Response.json(
            { message: "Appointments found", appointments },
            { status: 200 }
        );
    } catch (error) {
        const { status, message } = ErrorHandler(error);
        return NextResponse.json({ message: message }, { status });
    }
}