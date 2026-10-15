import "dotenv/config";
import dns from "node:dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASSWORD
  ? process.env.EMAIL_PASSWORD.replace(/\s+/g, "").trim()
  : "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("EMAIL ERROR:", error.message);
  } else {
    console.log("EMAIL SERVER READY");
  }
});

export default transporter;