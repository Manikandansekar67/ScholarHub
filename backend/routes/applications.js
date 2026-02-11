const express = require('express');
const {
    submitApplication,
    getMyApplications,
    getApplication,
    verifyApplication,
    forwardApplication,
    reviewApplication,
    getApplicationsForSponsor,
    getApplicationsForAdmin
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Student routes
router.post('/', authenticate, authorize('student'), submitApplication);
router.get('/my', authenticate, authorize('student'), getMyApplications);

// Sponsor routes
router.get('/sponsor', authenticate, authorize('sponsor'), getApplicationsForSponsor);
router.put('/:id/review', authenticate, authorize('sponsor'), reviewApplication);

// Admin routes
router.get('/admin', authenticate, authorize('admin'), getApplicationsForAdmin);
router.put('/:id/verify', authenticate, authorize('admin'), verifyApplication);
router.put('/:id/forward', authenticate, authorize('admin'), forwardApplication);

// Common routes
router.get('/:id', authenticate, getApplication);

module.exports = router;
