const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');
const Notification = require('../models/Notification');

// Helper function to create notification
const createNotification = async (userId, title, message, type, relatedApplication) => {
    await Notification.create({
        user: userId,
        title,
        message,
        type,
        relatedApplication
    });
};

// @desc    Submit application
// @route   POST /api/applications
// @access  Private (Student only)
exports.submitApplication = async (req, res, next) => {
    try {
        const { scholarshipId, personalStatement, documents } = req.body;

        // Check if scholarship exists
        const scholarship = await Scholarship.findById(scholarshipId);
        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found'
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            student: req.user._id,
            scholarship: scholarshipId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this scholarship'
            });
        }

        // Create application
        const application = await Application.create({
            student: req.user._id,
            scholarship: scholarshipId,
            personalStatement,
            documents: documents || []
        });

        // Update scholarship application count
        scholarship.applicationCount += 1;
        await scholarship.save();

        // Create notification for student
        await createNotification(
            req.user._id,
            'Application Submitted',
            `Your application for ${scholarship.title} has been submitted successfully`,
            'application_update',
            application._id
        );

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student's applications
// @route   GET /api/applications/my
// @access  Private (Student only)
exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .populate('scholarship', 'title sponsor amount deadline')
            .populate({
                path: 'scholarship',
                populate: {
                    path: 'sponsor',
                    select: 'fullName organization'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('student', 'fullName email institution academicDetails')
            .populate('scholarship')
            .populate('verifiedBy', 'fullName')
            .populate('reviewedBy', 'fullName');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check authorization
        const isStudent = application.student._id.toString() === req.user._id.toString();
        const isSponsor = application.scholarship.sponsor.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isStudent && !isSponsor && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this application'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify application (Admin)
// @route   PUT /api/applications/:id/verify
// @access  Private (Admin only)
exports.verifyApplication = async (req, res, next) => {
    try {
        const { verificationNotes, approved } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.status !== 'submitted') {
            return res.status(400).json({
                success: false,
                message: 'Application has already been processed'
            });
        }

        application.status = approved ? 'under-verification' : 'rejected';
        application.verifiedBy = req.user._id;
        application.verificationNotes = verificationNotes;
        application.verifiedAt = Date.now();

        await application.save();

        // Create notification for student
        await createNotification(
            application.student,
            'Application Status Updated',
            approved
                ? 'Your application is now under verification'
                : 'Your application was not approved for verification',
            'application_update',
            application._id
        );

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forward application to sponsor (Admin)
// @route   PUT /api/applications/:id/forward
// @access  Private (Admin only)
exports.forwardApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('scholarship');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.status !== 'under-verification') {
            return res.status(400).json({
                success: false,
                message: 'Application must be verified before forwarding'
            });
        }

        application.status = 'forwarded';
        application.forwardedAt = Date.now();
        await application.save();

        // Create notification for student
        await createNotification(
            application.student,
            'Application Forwarded',
            'Your application has been forwarded to the sponsor for review',
            'application_update',
            application._id
        );

        // Create notification for sponsor
        await createNotification(
            application.scholarship.sponsor,
            'New Application to Review',
            `A new application for ${application.scholarship.title} requires your review`,
            'application_update',
            application._id
        );

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Review application (Sponsor)
// @route   PUT /api/applications/:id/review
// @access  Private (Sponsor only)
exports.reviewApplication = async (req, res, next) => {
    try {
        const { reviewNotes, approved } = req.body;

        const application = await Application.findById(req.params.id)
            .populate('scholarship');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check if user is the sponsor
        if (application.scholarship.sponsor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to review this application'
            });
        }

        if (application.status !== 'forwarded') {
            return res.status(400).json({
                success: false,
                message: 'Application must be forwarded before review'
            });
        }

        application.status = approved ? 'approved' : 'rejected';
        application.reviewedBy = req.user._id;
        application.reviewNotes = reviewNotes;
        application.reviewedAt = Date.now();
        application.decidedAt = Date.now();

        await application.save();

        // Create notification for student
        await createNotification(
            application.student,
            `Application ${approved ? 'Approved' : 'Rejected'}`,
            approved
                ? `Congratulations! Your application for ${application.scholarship.title} has been approved`
                : `Your application for ${application.scholarship.title} was not approved`,
            'application_update',
            application._id
        );

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get applications for sponsor
// @route   GET /api/applications/sponsor
// @access  Private (Sponsor only)
exports.getApplicationsForSponsor = async (req, res, next) => {
    try {
        // Get all scholarships by this sponsor
        const scholarships = await Scholarship.find({ sponsor: req.user._id });
        const scholarshipIds = scholarships.map(s => s._id);

        const applications = await Application.find({
            scholarship: { $in: scholarshipIds },
            status: { $in: ['forwarded', 'approved', 'rejected'] }
        })
            .populate('student', 'fullName email institution')
            .populate('scholarship', 'title amount')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get applications for admin
// @route   GET /api/applications/admin
// @access  Private (Admin only)
exports.getApplicationsForAdmin = async (req, res, next) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate('student', 'fullName email institution')
            .populate('scholarship', 'title sponsor amount')
            .populate({
                path: 'scholarship',
                populate: {
                    path: 'sponsor',
                    select: 'fullName organization'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};
