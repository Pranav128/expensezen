import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content for admin notification
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: `ExpenseZen Contact Form: Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    };

    // Thank you email content for the user
    const thankYouMailOptions = {
      from: `"ExpenseZen Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank You for Contacting ExpenseZen`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Contacting Us</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(to right, #4f46e5, #3b82f6);
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .message {
              margin-bottom: 25px;
              font-size: 16px;
            }
            .highlight {
              font-weight: 600;
              color: #4f46e5;
            }
            .button {
              display: inline-block;
              background: linear-gradient(to right, #4f46e5, #3b82f6);
              color: white;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 6px;
              font-weight: 600;
              margin: 15px 0;
              text-align: center;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 14px;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 10px;
              color: #4f46e5;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Reaching Out!</h1>
            </div>
            <div class="content">
              <div class="message">
                <p>Hello <span class="highlight">${name}</span>,</p>
                <p>Thank you for contacting ExpenseZen! We've received your message and appreciate you taking the time to reach out to us.</p>
                <p>Our team is reviewing your inquiry and will get back to you as soon as possible, typically within 24-48 hours.</p>
                <p>Here's a summary of what you shared with us:</p>
                <p><strong>Subject:</strong> Contact Form Submission<br>
                <strong>Message:</strong> "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"</p>
                <p>If you have any additional information to share or questions in the meantime, please don't hesitate to reply to this email.</p>
                <p>In the meantime, you might find answers to common questions in our Help & Support section:</p>
                <a href="https://expense-tracker-eight-flax.vercel.app/help-support" class="button">Visit Help & Support</a>
                <p>We look forward to assisting you!</p>
                <p>Best regards,<br>
                <span class="highlight">The ExpenseZen Team</span></p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ExpenseZen. All rights reserved.</p>
              <p>This is an automated response. Please do not reply directly to this email.</p>
              <div class="social-links">
                <a href="#">Twitter</a> | 
                <a href="#">Facebook</a> | 
                <a href="#">Instagram</a> | 
                <a href="#">LinkedIn</a>
              </div>
              <p>
                <small>If you did not submit this contact form, please disregard this email.</small>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(thankYouMailOptions)
    ]);

    return NextResponse.json(
      { success: true, message: 'Your message has been sent! We\'ve also sent you a confirmation email.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}