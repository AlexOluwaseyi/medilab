import prisma from '@/lib/prisma';
import ErrorHandler from '@/lib/ErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get appointmentId from search params if provided
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    let whereClause = {};
    if (appointmentId) {
      whereClause = { appointmentId };
    }

    const testResults = await prisma.testResult.findMany({
      where: whereClause,
      include: {
        appointment: {
          select: {
            patientName: true,
            test: true,
            status: true
          }
        },
        doctor: {
          select: {
            name: true,
            specialty: true
          }
        }
      }
    });

    return NextResponse.json(
      { message: "Test results retrieved", testResults, count: testResults.length },
      { status: 200 }
    );

  } catch (error) {
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message }, { status });
  }
}

// export async function POST(request: Request) {
//   try {
//     const { appointmentId } = await request.json();

//     if (!appointmentId) {
//       return NextResponse.json({ message: "Appointment ID is required." }, { status: 400 })
//     }
//     // Check if appointment exists
//     const appointmentExists = await prisma.testResult.findFirst({
//       where: { appointmentId: appointmentId }
//     });

//     if (appointmentExists) {
//       return NextResponse.json({ message: "Test result already exists." }, { status: 400 })
//     }

//     const appointment = await prisma.appointment.findUnique({
//       where: { id: appointmentId }
//     })

//     if (!appointment) {
//       return NextResponse.json({ message: "Appointment not found." }, { status: 400 })
//     }

//     if (appointment.status !== "APPROVED") {
//       return NextResponse.json(
//         { message: "Test results can only be added to approved." },
//         { status: 400 }
//       );
//     }

//     if (!appointment.doctorId) {
//       return NextResponse.json({ message: "Doctor ID is required. The appointment doesn't have an assigned doctor." }, { status: 400 })
//     }

//     const testResult = await prisma.testResult.create({
//       data: {
//         appointmentId,
//         doctorId: appointment.doctorId,
//         result: "N/A"
//       }
//     })

//     return NextResponse.json({ message: "Test result created successfully", testResult }, { status: 201 });

//   } catch (error) {
//     const { status, message } = ErrorHandler(error);
//     return NextResponse.json({ message }, { status });
//   }
// }

export async function PUT(request: Request) {
  try {
    const { appointmentId, doctorId, result, status } = await request.json()

    if (!appointmentId) {
      return NextResponse.json({ message: "Appointment ID is required." }, { status: 400 })
    }
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    })

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found." }, { status: 400 })
    }

    if (appointment.status !== "APPROVED") {
      return NextResponse.json(
        { message: "Test results can only be added to approved." },
        { status: 400 }
      );
    }

    if (!appointment.doctorId) {
      return NextResponse.json({ message: "Doctor ID is required. The appointment doesn't have an assigned doctor." }, { status: 400 })
    }

    const testData = await prisma.testResult.findFirst({
      where:
        { appointmentId: appointmentId }
    })

    if (!testData) {
      const newRecord = await prisma.testResult.create({
        data: {
          appointmentId,
          doctorId: appointment.doctorId,
          result: "N/A"
        }
      })
      return NextResponse.json({ message: "No existing test record. New record created successfully.", newRecord }, { status: 201 })
    }

    if (testData.doctorId !== doctorId) {
      await prisma.testResult.update({
        where: { id: testData.id },
        data: {
          doctorId: doctorId
        }
      })
    }

    const updatedTest = await prisma.testResult.update({
      where: { id: testData.id },
      data: {
        result: result,
      }
    })

    if (status === "COMPLETED") {
      // Set appointment as completed
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "COMPLETED"
        }
      })

      return NextResponse.json({ message: "Test record updated successfully. Appointment completed", updatedTest }, { status: 201 })
    }

    return NextResponse.json({ message: "Test record updated successfully", updatedTest }, { status: 200 })


  } catch (error) {
    const { message, status } = ErrorHandler(error)
    return NextResponse.json({ message }, { status })
  }
}