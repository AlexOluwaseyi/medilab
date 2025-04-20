import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import ErrorHandler from '@/lib/ErrorHandler';
import { NextRequest, NextResponse } from 'next/server';


// Nodemailer for Mailtrap
const MAILTRAP_USER = process.env.MAILTRAP_USER;
const MAILTRAP_PASS = process.env.MAILTRAP_PASS;
const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
const MAILTRAP_PORT = parseInt(process.env.MAILTRAP_PORT || '2525');
const MAILTRAP_FROM = process.env.MAILTRAP_FROM;


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, status, doctorId } = body;

    // Check for authentication using cookies properly in server context
    const authToken = request.cookies.get('auth-token')?.value;
    const isAdmin = authToken === 'authenticated';

    // Simple mock check for admin privileges
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    let doctor;

    if (status !== "DECLINED") {
      doctor = await prisma.doctors.findUnique({
        where: { id: doctorId },
      });

      if (!doctor) {
        return NextResponse.json(
          { message: 'Doctor not found' },
          { status: 404 }
        );
      }
    }

    // // Configure your email transporter (e.g., SMTP with nodemailer)
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.gmail.com', // Replace with your SMTP host
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // Initialize Email transporter - Mailtrap
    const mailtrapTransporter = nodemailer.createTransport({
      host: MAILTRAP_HOST,
      port: MAILTRAP_PORT,
      auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASS,
      },
    });

    // Verify mailtrap transporter
    mailtrapTransporter.verify((error, success) => {
      if (error) {
        console.error("SMTP Transport Error:", error);
      } else {
        // console.log(`${success}: Mailtrap Transporter is ready to send emails 🚀`);
        return success;
      }
    });

    // Format date nicely for email
    const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString();
    const formattedTime = new Date(appointment.appointmentDate).toLocaleTimeString();

    // Send email
    if (status === "APPROVED") {
      if (!doctor) {
        return NextResponse.json(
          { message: 'Doctor not found' },
          { status: 404 }
        );
      }
      await mailtrapTransporter.sendMail({
        from: MAILTRAP_FROM,
        to: 'akintolalex@gmail.com',
        subject: 'Your Appointment is Approved',
        text: `Hello ${appointment.patientName},\n\nYour appointment scheduled for ${formattedDate} at ${formattedTime} has been approved.\n\nThank you!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <p>Hello ${appointment.patientName},</p>
            <p>Your appointment scheduled for <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong> has been approved. You are schedule to meet with ${doctor.name} (${doctor.specialty}) upon arrival.</p> 
            <p>Thank you for choosing our services.</p>
          </div>
        `
      });
    }
    if (status === "DECLINED") {
      await mailtrapTransporter.sendMail({
        from: MAILTRAP_FROM || '"Default Sender" <noreply@example.com>',
        to: 'akintolalex@gmail.com',
        subject: 'Your Appointment is Declined',
        text: `Hello ${appointment.patientName},\n\nYour appointment scheduled for ${formattedDate} at ${formattedTime} has been declined.\n\nThank you!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <p>Hello ${appointment.patientName},</p>
            <p>Your appointment scheduled for <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong> has been declined. You may schedule a
            new appoint on our website.</p> 
            <p>We apologize for the inconvenience.</p>
          </div>
        `
      });
    }
    if (status === "COMPLETED") {
      const testResult = await prisma.testResult.findFirst({
        where: { appointmentId: appointment.id },
        include: {
          appointment: {
            select: {
              test: true,
            }
          }
        }
      })
      await mailtrapTransporter.sendMail({
        from: MAILTRAP_FROM || '"Default Sender" <noreply@example.com>',
        to: 'akintolalex@gmail.com',
        subject: 'Your Appointment is Completed',
        text: `Hello ${appointment.patientName},\n\nYour appointment scheduled for ${formattedDate} at ${formattedTime} has been declined.\n\nThank you!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <p>Hello ${appointment.patientName},</p>
            <p>Your appointment scheduled for <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong> has been completed. Your test result is shown below.</p> 
            <h3>Test Result</h3>
            <p>Your test result for ${testResult?.appointment.test} is <strong>${testResult?.result}</strong></p>
            <p>We hope you are doing well. If you have any questions, please feel free to reach out.</p>
            <p>Thank you for choosing our services.</p>
          </div>
        `
      });
    }

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    const { message, status } = ErrorHandler(error);
    return NextResponse.json(
      { message: `Error sending email: ${message}` },
      { status: status }
    );
  }
}
