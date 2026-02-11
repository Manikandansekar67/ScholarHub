const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Scholarship title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Scholarship amount is required'],
        min: [0, 'Amount must be positive']
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required']
    },
    eligibility: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: true,
        enum: ['STEM', 'Arts', 'Leadership', 'Need-Based', 'Business', 'Healthcare', 'Other']
    },
    status: {
        type: String,
        enum: ['open', 'closing-soon', 'closed'],
        default: 'open'
    },
    applicationCount: {
        type: Number,
        default: 0
    },
    requirements: {
        minGPA: Number,
        academicLevel: [String],
        documents: [String]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Update status based on deadline
scholarshipSchema.methods.updateStatus = function () {
    const now = new Date();
    const daysUntilDeadline = Math.ceil((this.deadline - now) / (1000 * 60 * 60 * 24));

    if (daysUntilDeadline < 0) {
        this.status = 'closed';
    } else if (daysUntilDeadline <= 7) {
        this.status = 'closing-soon';
    } else {
        this.status = 'open';
    }
};

module.exports = mongoose.model('Scholarship', scholarshipSchema);
