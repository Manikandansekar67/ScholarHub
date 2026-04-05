const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scholarship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship',
        required: true
    },
    status: {
        type: String,
        enum: ['submitted', 'under-verification', 'forwarded', 'approved', 'rejected'],
        default: 'submitted'
    },
    // Application data
    personalStatement: {
        type: String,
        required: true
    },
    documents: [{
        name: String,
        fileId: mongoose.Schema.Types.ObjectId,
        uploadedAt: Date
    }],
    // Admin verification
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verificationNotes: String,
    verifiedAt: Date,
    // Sponsor review
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: String,
    reviewedAt: Date,
    // Timeline
    submittedAt: {
        type: Date,
        default: Date.now
    },
    forwardedAt: Date,
    decidedAt: Date
}, {
    timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ student: 1, scholarship: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
