import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'parampreetkaur059@gmail.com',
        pass: 'riie hcno ggle jqyo',
    },
});

const email = "preettkour001@gmail.com"
const name = "aryan"

const mailOptions = {
    from: ' <parampreetkaur059@gmail.com>',
    to: email,
    subject: "Welcome to Our Website",
    html: `
    <h2>Hello ${name} 👋</h2>

    <p>Welcome to our website.</p>

    <p>Thanks for creating an account with us.</p>

    <button style="
      background: black;
      color: white;
      padding: 10px 20px;
      border: none;
    ">
      Visit Website
    </button>
  `,
};

const res = await transporter.sendMail(mailOptions)
console.log(res)  
