import ErrorHandler from "@/lib/ErrorHandler";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const doctors = await prisma.doctors.findMany({
      select: {
        id: true,
        name: true,
        specialty: true,
        email: true,
      }
    });
    if (!doctors) {
      return NextResponse.json(
        { message: "No doctors found." },
        { status: 200 }
      );
    }

    return Response.json({ message: "Doctors found", doctors }, { status: 200 });
  } catch (error) {
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { message: "Data not sent in request." },
        { status: 400 }
      );
    }

    const { name, specialty, email } = body;

    if (!name || !specialty || !email) {
      return NextResponse.json(
        { message: "Name, specialty, and email are required." },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctors.create({
      data: {
        name,
        specialty,
        email,
      },
    });

    return NextResponse.json(
      { message: "Doctor created successfully", doctor },
      { status: 201 }
    );
  } catch (error) {
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { message: "Data not sent in request." },
        { status: 400 }
      );
    }

    const { id, name, email, specialty } = body;

    if (!id || !name || !email || !specialty) {
      return NextResponse.json(
        { message: "Required fields missing." },
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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json(
        { message: "Data not sent in request." },
        { status: 400 }
      );
    }

    const { id } = body;

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

    await prisma.doctors.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Doctor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}
