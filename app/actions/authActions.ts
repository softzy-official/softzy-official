"use server";

import nodemailer from "nodemailer";
import connectToDatabase from "@/lib/db";
import { Otp } from "@/models/Otp";

type SendOtpResult = {
  success: boolean;
  message: string;
};

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateOtp(length: number): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function sendOtpEmailAction(
  rawEmail: string
): Promise<SendOtpResult> {
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return { success: false, message: "Please enter a valid email." };
  }

  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;

  if (!smtpUser || !smtpPass) {
    return {
      success: false,
      message:
        "Email service is not configured. Add EMAIL_USER and EMAIL_PASS.",
    };
  }

  await connectToDatabase();

  const latestOtp = await Otp.findOne({ email })
    .sort({ createdAt: -1 })
    .lean<{ createdAt: Date } | null>();

  if (latestOtp?.createdAt) {
    const ageSeconds = Math.floor(
      (Date.now() - new Date(latestOtp.createdAt).getTime()) / 1000
    );

    if (ageSeconds < RESEND_COOLDOWN_SECONDS) {
      return {
        success: false,
        message: `Please wait ${
          RESEND_COOLDOWN_SECONDS - ageSeconds
        }s before requesting another OTP.`,
      };
    }
  }

  const otpCode = generateOtp(OTP_LENGTH);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `SOFTZY <${smtpUser}>`,
      to: email,
      subject: "Your SOFTZY login OTP",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>SOFTZY Login Verification</h2>
          <p>Your one-time password is:</p>
          <p style="font-size:24px;font-weight:700;letter-spacing:2px">${otpCode}</p>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: otpCode });

    return { success: true, message: "OTP sent successfully." };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    // console.error("OTP email send failed:", message);

    return {
      success: false,
      message: "Failed to send OTP. Please try again.",
    };
  }
}