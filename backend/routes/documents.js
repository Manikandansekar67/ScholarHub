const express = require('express');
const {
    uploadDocument,
    downloadDocument,
    deleteDocument,
    getDocumentMetadata
} = require('../controllers/documentController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload', authenticate, upload.single('file'), uploadDocument);
router.get('/:id', authenticate, downloadDocument);
router.get('/:id/metadata', authenticate, getDocumentMetadata);
router.delete('/:id', authenticate, deleteDocument);

module.exports = router;
