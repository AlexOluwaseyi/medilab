import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ErrorHandler from "@/lib/ErrorHandler";

/**
 * GET /api/v1/tests - Get all diagnostic tests
 *
 * Fetches all diagnostic test records from the database through Prisma ORM.
 * @returns {Promise<Response>} JSON response with all records or error message
 * @throws Will be caught and handled by ErrorHandler for any database errors
 */
export async function GET(): Promise<Response> {
  try {
    // Fetch all records
    const allRecords = await prisma.diagnosticTest.findMany();

    // Check if no records are found
    if (allRecords.length === 0) {
      return NextResponse.json(
        { message: "No records found." },
        { status: 200 }
      );
    }

    // Return the records
    return Response.json({ message: "Records found", Records: allRecords });
  } catch (error) {
    // Handle errors
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}

/**
 * POST /api/v1/tests - Create a new diagnostic test
 *
 * Creates a new diagnostic test record in the database through Prisma ORM.
 *
 * Request body should contain:
 * - patientName: Name of the patient (required)
 * - testType: Type of diagnostic test (required)
 * - result: Result of the test (required)
 * - notes: Additional notes (optional)
 *
 * The record is created with an auto-generated ID and timestamp fields.
 *
 * @param {Request} request - The HTTP request object containing the JSON body
 * @returns {Promise<Response>} JSON response with created record or error message
 * @throws Will be caught and handled by ErrorHandler for any database errors
 */
export async function POST(request: Request): Promise<Response> {
  try {
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
    if (!body.patientName || !body.testType || !body.result) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Create a new test
    const record = await prisma.diagnosticTest.create({
      data: {
        patientName: body.patientName,
        testType: body.testType,
        result: body.result,
        notes: body.notes || null,
      },
    });

    return Response.json(
      { message: "Record created successfully", Record: record },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors
    const { status, message } = ErrorHandler(error);
    return NextResponse.json({ message: message }, { status });
  }
}
