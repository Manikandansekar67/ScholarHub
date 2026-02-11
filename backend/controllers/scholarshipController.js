const Scholarship = require('../models/Scholarship');

// @desc    Get all scholarships
// @route   GET /api/scholarships
// @access  Public
exports.getAllScholarships = async (req, res, next) => {
    try {
        const { category, status, minAmount, maxAmount, search } = req.query;

        // Build query
        let query = { isActive: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = parseInt(minAmount);
            if (maxAmount) query.amount.$lte = parseInt(maxAmount);
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const scholarships = await Scholarship.find(query)
            .populate('sponsor', 'fullName organization')
            .sort({ createdAt: -1 });

        // Update status for each scholarship
        scholarships.forEach(scholarship => scholarship.updateStatus());

        res.status(200).json({
            success: true,
            count: scholarships.length,
            data: scholarships
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single scholarship
// @route   GET /api/scholarships/:id
// @access  Public
exports.getScholarship = async (req, res, next) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id)
            .populate('sponsor', 'fullName organization contactInfo');

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found'
            });
        }

        scholarship.updateStatus();

        res.status(200).json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create scholarship
// @route   POST /api/scholarships
// @access  Private (Sponsor only)
exports.createScholarship = async (req, res, next) => {
    try {
        // Add sponsor to req.body
        req.body.sponsor = req.user._id;

        const scholarship = await Scholarship.create(req.body);

        res.status(201).json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update scholarship
// @route   PUT /api/scholarships/:id
// @access  Private (Sponsor only)
exports.updateScholarship = async (req, res, next) => {
    try {
        let scholarship = await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found'
            });
        }

        // Make sure user is scholarship sponsor
        if (scholarship.sponsor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this scholarship'
            });
        }

        scholarship = await Scholarship.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private (Sponsor only)
exports.deleteScholarship = async (req, res, next) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found'
            });
        }

        // Make sure user is scholarship sponsor
        if (scholarship.sponsor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this scholarship'
            });
        }

        // Soft delete
        scholarship.isActive = false;
        await scholarship.save();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get scholarships created by sponsor
// @route   GET /api/scholarships/my/created
// @access  Private (Sponsor only)
exports.getMySponsoredScholarships = async (req, res, next) => {
    try {
        const scholarships = await Scholarship.find({
            sponsor: req.user._id,
            isActive: true
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: scholarships.length,
            data: scholarships
        });
    } catch (error) {
        next(error);
    }
};
