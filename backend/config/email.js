import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log("EMAIL ERROR:", error);
    } else {
        console.log("Email server is ready");
    }
});
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASSWORD ? "PASS EXISTS" : "PASS MISSING"
);

export default transporter;