const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gfsBucket;

// Initialize GridFS
mongoose.connection.once('open', () => {
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Private
exports.uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        res.status(201).json({
            success: true,
            data: {
                fileId: req.file.id,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                contentType: req.file.contentType
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Download document
// @route   GET /api/documents/:id
// @access  Private
exports.downloadDocument = async (req, res, next) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);

        // Check if file exists
        const files = await gfsBucket.find({ _id: fileId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const file = files[0];

        // Set headers
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${file.metadata.originalName}"`);

        // Stream file to response
        const downloadStream = gfsBucket.openDownloadStream(fileId);
        downloadStream.pipe(res);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res, next) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);

        // Check if file exists
        const files = await gfsBucket.find({ _id: fileId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        await gfsBucket.delete(fileId);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get document metadata
// @route   GET /api/documents/:id/metadata
// @access  Private
exports.getDocumentMetadata = async (req, res, next) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);

        const files = await gfsBucket.find({ _id: fileId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.status(200).json({
            success: true,
            data: files[0]
        });
    } catch (error) {
        next(error);
    }
};
