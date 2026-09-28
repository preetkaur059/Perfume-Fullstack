import OTP from "../models/otpModel.js";
import User from "../models/user.js";
import transporter from "../config/email.js";

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // OTP expires after 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Delete previous OTP
        await OTP.deleteMany({ email });

        // Save new OTP
        await OTP.create({
            email,
            otp,
            expiresAt,
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Perfume Store - Email Verification OTP",

            html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Verify Your Email</h2>

          <p>Your OTP for Perfume Store signup is:</p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>
            This OTP is valid for 5 minutes.
          </p>

          <p>
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
      `,
        });

        return res.status(200).json({
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error(error);
        console.error("SEND OTP ERROR:", error);
        return res.status(500).json({
            message: "Failed to send OTP",
        });
    }
};
export const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
            });
        }

        // Find OTP
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP not found or expired",
            });
        }

        // Check expiry
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });

            return res.status(400).json({
                message: "OTP has expired",
            });
        }

        // Check OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        // OTP verified
        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            message: "OTP verified successfully",
            verified: true,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to verify OTP",
        });
    }
};