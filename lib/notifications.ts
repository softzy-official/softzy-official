import nodemailer from "nodemailer";

interface UserInfo {
  name: string;
  email: string;
  phone?: string;
}

export async function sendOrderNotification(
  user: UserInfo,
  orderId: string,
  updateType: "status" | "tracking",
  value: string
) {

  const shortOrderId = orderId.slice(-6).toUpperCase();
  
  // 1. Prepare Content
  let subject = "";
  let emailHtml = "";

  if (updateType === "status") {
    subject = `Order Update: Your SOFTZY Order #${shortOrderId} is now ${value.toUpperCase()}`;
    emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-w: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Updated</h2>
        <p>Hi ${user.name},</p>
        <p>The status of your SOFTZY order <strong>#${shortOrderId}</strong> has been updated to: <span style="font-weight: bold; color: #2563eb;">${value.toUpperCase()}</span>.</p>
        <p>You can track your order in your profile.</p>
        <p>Thank you for shopping with SOFTZY!</p>
      </div>
    `;
  } else if (updateType === "tracking") {
    subject = `Your SOFTZY Order #${shortOrderId} has been Shipped!`;
    emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-w: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Shipped</h2>
        <p>Hi ${user.name},</p>
        <p>Your SOFTZY order <strong>#${shortOrderId}</strong> has been dispatched.</p>
        <p>Tracking AWB: <strong>${value}</strong></p>
        <p>Thank you for shopping with SOFTZY!</p>
      </div>
    `;
  }

  // 2. Transporter created INSIDE the function
  const transUser = process.env.EMAIL_USER;
  const transPass = process.env.EMAIL_PASS;

  if (!transUser || !transPass) {
    console.error("❌ Email variables missing in .env");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: transUser,
      pass: transPass,
    },
  });

  // 3. Send Email
  if (user.email) {
    try {
      const info = await transporter.sendMail({
        from: `"Softzy" <${transUser}>`,
        to: user.email,
        subject,
        html: emailHtml,
      });
    } catch (error) {
    }
  }
}