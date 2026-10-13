// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     service: "gmail",

//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//     },
// });

// transporter.verify((error, success) => {
//     if (error) {
//         console.log("EMAIL ERROR:", error);
//     } else {
//         console.log("EMAIL SERVER READY");
//     }
// });

// export default transporter;
import dns from "node:dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
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