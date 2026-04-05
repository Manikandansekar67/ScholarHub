const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'sponsor', 'admin'],
        required: true
    },
    // Common fields
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    // Student-specific fields
    institution: {
        type: String,
        required: function () { return this.role === 'student'; }
    },
    academicDetails: {
        major: String,
        year: String,
        gpa: Number,
        studentId: String
    },
    // Sponsor-specific fields
    organization: {
        type: String,
        required: function () { return this.role === 'sponsor'; }
    },
    contactInfo: {
        phone: String,
        website: String,
        address: String
    },
    // Admin-specific fields
    permissions: [{
        type: String,
        enum: ['verify_applications', 'manage_users', 'view_reports']
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
