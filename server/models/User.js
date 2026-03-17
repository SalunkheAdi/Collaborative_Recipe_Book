const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer_not_to_say'],
            default: 'prefer_not_to_say'
        },
        dietaryPreference: {
            type: String,
            enum: ['all', 'veg', 'non-veg'],
            default: 'all'
        },
        avatarUrl: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isSuspended: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        isVerified: {
            type: Boolean,
            default: true,
        },
        otp: String,
        otpExpire: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
