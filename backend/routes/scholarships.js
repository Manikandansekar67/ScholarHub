const express = require('express');
const {
    getAllScholarships,
    getScholarship,
    createScholarship,
    updateScholarship,
    deleteScholarship,
    getMySponsoredScholarships
} = require('../controllers/scholarshipController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllScholarships);
router.get('/:id', getScholarship);

// Protected routes
router.get('/my/created', authenticate, authorize('sponsor'), getMySponsoredScholarships);
router.post('/', authenticate, authorize('sponsor'), createScholarship);
router.put('/:id', authenticate, authorize('sponsor'), updateScholarship);
router.delete('/:id', authenticate, authorize('sponsor'), deleteScholarship);

module.exports = router;
