import bcrypt from "bcrypt";
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
// solve error 
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
        console.error("Error in sendSignupOTP:", error);

        return res.status(500).json({
            message: "Failed to send OTP",
            error: error.message,
        });
    }
};

// export const verifySignupOTP = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         // Only email and OTP are required
//         if (!email || !otp) {
//             return res.status(400).json({
//                 message: "Email and OTP are required",
//             });
//         }

//         const normalizedEmail = email.trim().toLowerCase();

//         // Find OTP
//         const otpRecord = await OTP.findOne({
//             email: normalizedEmail,
//             otp: otp.trim(),
//         });

//         if (!otpRecord) {
//             return res.status(400).json({
//                 message: "Invalid OTP",
//             });
//         }

//         // Check expiry
//         if (otpRecord.expiresAt < new Date()) {
//             await OTP.deleteOne({
//                 _id: otpRecord._id,
//             });

//             return res.status(400).json({
//                 message: "OTP expired",
//             });
//         }

//         // Check if user already exists
//         const existingUser = await User.findOne({
//             email: normalizedEmail,
//         });

//         if (existingUser) {
//             await OTP.deleteOne({
//                 _id: otpRecord._id,
//             });

//             return res.status(400).json({
//                 message: "User already exists",
//             });
//         }

//         // Create user
//         const user = await User.create({
//             email: normalizedEmail,
//             isAdmin: false,
//             isEmailVerified: true,
//         });

//         // Delete OTP after successful verification
//         await OTP.deleteOne({
//             _id: otpRecord._id,
//         });

//         return res.status(201).json({
//             message: "Signup successful",
//             user: {
//                 id: user._id,
//                 email: user.email,
//             },
//         });

//     } catch (error) {
//         console.error("VERIFY OTP ERROR:", error);

//         return res.status(500).json({
//             message: "Signup failed",
//             error: error.message,
//         });
//     }
// };
export const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp, fullName, password } = req.body;

        if (!email || !otp || !fullName || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Find OTP
        const otpRecord = await OTP.findOne({
            email,
            otp,
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        // Check expiry
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });

            return res.status(400).json({
                message: "OTP expired",
            });
        }

        // Check user again
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            isAdmin: false,
            isEmailVerified: true,
        });

        // Delete OTP after successful verification
        await OTP.deleteOne({
            _id: otpRecord._id,
        });

        return res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Signup failed",
        });
    }
};