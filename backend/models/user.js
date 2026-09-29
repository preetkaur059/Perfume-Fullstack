import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    // fullName: {
    //     type: String,
    //     required: true,
    // },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },

    // password: {
    //     type: String,
    //     required: true
    // },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    }
);


const User = mongoose.model('users', userSchema)

export default User