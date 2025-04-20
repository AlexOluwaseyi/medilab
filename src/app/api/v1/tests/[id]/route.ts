import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ErrorHandler from "@/lib/ErrorHandler";


/**
 * GET /api/v1/tests/[id] - Get a diagnostic test by ID
 * 
 * Gets a single diagnostic test record by ID from the database using Prisma ORM.
 * Gets ID from the request parameters and returns the record if found.
 * @param {Request} request - The HTTP request object containing the ID parameter
 * @param {Promise<{ id: string }>} params - The ID parameter from the request
 * @returns {Promise<Response>} JSON response with record or error message
 * @throws Will be caught and handled by ErrorHandler for any database errors
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // Fetch the ID from the request parameters
    const { id } = await params;

    // Check if no ID is provided
    if (!id) {
      return NextResponse.json(
        { message: "No ID provided in request." },
        { status: 400 }
      );
    }

    // Find the record by ID using PrismaORM
    const record = await prisma.diagnosticTest.findUnique({
      where: { id: (id) },
    });

    // Check if no record is found
    if (!record) {
      return NextResponse.json(
        { message: "Record not found." },
        { status: 404 }
      );
    }

    // Return the record and status 200
    return NextResponse.json(
      { message: "Record found", Record: record },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}

/**
 * PUT /api/v1/tests/[id] - Update a diagnostic test by ID
 * 
 * Updates a single diagnostic test record by ID in the database using Prisma ORM.
 * Gets ID from the request parameters and updates the record with the request body.
 * @param {Request} request - The HTTP request object containing the ID parameter and JSON body
 * @param {Promise<{ id: string }>} params - The ID parameter from the request
 * @returns {Promise<Response>} JSON response with updated record or error message
 * @throws Will be caught and handled by ErrorHandler for any database errors
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // Fetch the ID from the request parameters
    const { id } = await params;

    // Check if no ID is provided
    if (!id) {
      return NextResponse.json(
        { message: "No ID provided in request." },
        { status: 400 }
      );
    }

    // Parse the request body as JSON
    const body = await request.json();

    // Check if the request body is empty
    if (!body) {
      return NextResponse.json(
        { message: "Data not sent in request." },
        { status: 400 }
      );
    }

    // Check if the request body is missing any required fields
    if (!body.testType || !body.result) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Fetch record by ID from database using PrismaORM
    const record = await prisma.diagnosticTest.findUnique({
      where: { id: (id) },
    });

    // Check if no record is found
    if (!record) {
      return NextResponse.json(
        { message: "Record not found." },
        { status: 404 }
      );
    }

    // Update the record using PrismaORM
    const updatedRecord = await prisma.diagnosticTest.update({
      where: { id: (id) },
      data: {
        patientName: body.patientName || record.patientName,
        testType: body.testType,
        result: body.result,
        testDate: new Date(),
        updatedAt: new Date(),
        notes: body.notes || null,
      },
    });

    // Return the updated record and status 200
    return NextResponse.json(
      { message: "Record updated", Record: updatedRecord },
      { status: 200 }
    );
  } catch (error) {
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}

/**
 * DELETE /api/v1/tests/[id] - Delete a diagnostic test by ID
 * 
 * Deletes a single diagnostic test record by ID from the database using Prisma ORM.
 * Gets ID from the request parameters and deletes the record if found.
 * @param {Request} request - The HTTP request object containing the ID parameter
 * @param {Promise<{ id: string }>} params - The ID parameter from the request
 * @returns {Promise<Response>} JSON response with success message or error message
 * @throws Will be caught and handled by ErrorHandler for any database errors
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // Fetch the ID from the request parameters
    const { id } = await params;

    // Check if no ID is provided
    if (!id) {
      return NextResponse.json(
        { message: "No ID provided in request." },
        { status: 400 }
      );
    }

    // Find the record by ID using PrismaORM
    const record = await prisma.diagnosticTest.findUnique({
      where: { id: (id) },
    });

    // Check if no record is found
    if (!record) {
      return NextResponse.json(
        { message: "Record not found." },
        { status: 404 }
      );
    }

    // Delete record from database using PrismaORM
    await prisma.diagnosticTest.delete({ where: { id: (id) } });

    // Return success message and status 200
    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (error) {
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}
