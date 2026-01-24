require("module-alias/register")

const express = require('express');
const router = express.Router();

const moduleController = require('@controller/module');
const contentController = require('@controller/content');
const reviewController = require('@controller/review');
const auth = require('@middleware/auth');
const { upload, uploadToCloud, multerFieldSelector } = require('@middleware/cloudinary');

router.route('/')
  .get(moduleController.getModules) 
  .post(
    auth('instructor'), 
    moduleController.createModule 
  );

router.route('/:moduleId')
  .get(moduleController.getModule)
  .patch(
    auth('instructor'),
    multerFieldSelector, 
    uploadToCloud,
    moduleController.updateModule
  )
  .delete(
    auth('instructor'),
    moduleController.deleteModule
  );

router.route('/:moduleId/reviews')
  .get(reviewController.getReviews); 

router.route('/:moduleId/content?type')
  .post(
    auth('instructor'),
    multerFieldSelector,
    uploadToCloud,
    contentController.addContent
  );

router.route('/:moduleId/content/assignment')
  .post(
    auth('instructor'),
    multerFieldSelector,
    uploadToCloud,
    contentController.addContent
  );

// C. Manage Specific Content Units (Update/Delete)
// URL: /api/v1/modules/:moduleId/content/:unitId
router.route('/:moduleId/content/:unitId')
  .patch(
    auth('instructor'),
    multerFieldSelector, // Optional: Allow re-uploading video if fixing a mistake
    uploadToCloud,
    contentController.updateContent
  )
  .delete(
    auth('instructor'),
    contentController.removeContent
  );

module.exports = router;