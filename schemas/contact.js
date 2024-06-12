const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            trim: true,
            unique: true
        },
        phoneNumber: {
            type: String,
            required: false,
            trim: true,
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        linkedId: {
            type: Number,
            required: false,
            trim: true,
        },
        linkPrecedence: {
            type: String,
            required: false,
            trim: true,
            enum: ['secondary', 'primary']
        },
        deletedAt: {
            type: Date,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Contact", contactSchema);
