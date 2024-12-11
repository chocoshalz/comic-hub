import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // npm install nodemailer @types/nodemailer

// Define a type for the request body
interface EmailRequestBody {
  to: string;
  subject: string;
  text: string;
}

// Handle GET requests
export async function GET() {
  return NextResponse.json({ hello: "world" });
}

// Handle POST requests
export async function POST(req: Request) {
  try {
    // Parse the request body
    const body: EmailRequestBody = await req.json();

    const { to, subject, text } = body;

    // Validate the input
    if (!to || !subject || !text) {
      return NextResponse.json(
        { message: "Missing required fields: to, subject, or text" },
        { status: 400 }
      );
    }

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
   
    auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
    },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`, // Sender address
      to, // Recipient's email
      subject, // Subject line
      text, // Plain text body
      // html: '<b>Hello world?</b>', // Uncomment to use HTML body
    });

    // Return success response
    return NextResponse.json({ message: "Email sent successfully", info });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error: error.message },
      { status: 500 }
    );
  }
}
