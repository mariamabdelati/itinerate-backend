const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Create a new schema for the database
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A first name is required"],
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, "An email address is required"],
            unique: true,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email address"],
        },
        role : {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "A password is required"],
            trim: true,
            minlength: 8,
            maxlength: 20,
            validator: [validator.isStrongPassword, "Please provide a strong password"],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your password"],
            trim: true,
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: "Passwords do not match",
            }
        },
        passwordChangedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

// Create a pre-save hook to encrypt the password before saving it to the database
userSchema.pre("save", async function (next) {
    // If the password has not been modified, continue
    if (!this.isModified("password")) return next();

    // Encrypt the password using bcrypt with a base cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the passwordConfirm field
    this.passwordConfirm = undefined;

    next();
});

// Create an instance method to check if the password is correct
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// Create an instance method to check if the user has changed their password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

// Create a new model using the schema
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;