const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['application_update', 'deadline_reminder', 'new_scholarship', 'system'],
        default: 'system'
    },
    relatedApplication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    },
    relatedScholarship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship'
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date
}, {
    timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
