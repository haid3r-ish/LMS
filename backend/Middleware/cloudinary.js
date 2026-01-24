require("module-alias/register")

const multer = require("multer")
const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier")
const {CatchAsync, AppError} = require("@util/errorHandler")
    
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {fileSize: 100 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith("video") || file.mimetype === "application/pdf") {
            cb(null, true)
        } else {
            cb(new AppError('Invalid file type!', 400), false)
        }
    }
})  

const uploadToCloud = (req, res, next) => {
    if (!req.file) return next();

    let folder = 'lms/misc';
    let resourceType = 'raw';

    if (req.file.fieldname === 'video') {
        folder = 'lms/videos';
        resourceType = 'video';
    } else if (req.file.fieldname === 'certificate') {
        folder = 'lms/certificates';
    } else if (req.file.fieldname === 'assignment') {
        folder = 'lms/assignments';
    }

    const uploadStream = cloudinary.uploader.upload_stream(
        {
            resource_type: resourceType,
            folder: folder,
            public_id: `${Date.now()}-${req.file.originalname.split('.')[0]}`
        },
        (error, result) => {
            if (error) return next(new AppError('Upload failed', 500));

            if (req.file.fieldname === 'video') {
                req.body.videoUrl = result.secure_url;
                req.body.duration = result.duration;
            } else if (req.file.fieldname === 'certificate') {
                req.body.certificateUrl = result.secure_url;
            } else {
                req.body.instructionPdfUrl = result.secure_url;
            }

            next();
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
}

const multerFieldSelector = (req,res,next) => {
    if(!req.query.type) return next(new AppError("Content Type is not assigned",400))
    switch (req.query.type) {
        case "video":
            return upload.single("video")(req,res,next)
        case "assignment":
            return upload.single("assignment")(req,res,next)  
        case "certificate":
            return upload.single("certificate")(req,res,next)  
        case "quiz":
            return next()   
        default:
            return next(new AppError(`Invalid content type: ${req.query.type}`, 400));
    }
}

module.exports = {
    upload,
    uploadToCloud,
    multerFieldSelector
};