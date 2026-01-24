require("module-alias/register")

const Module = require('@model/module');
const {AppError} = require('@util/errorHandler');

const addContentService = async (moduleId, contentData, userId) => {
  const module = await Module.findOne({ _id: moduleId, instructor: userId });
  if (!module) throw new AppError('Module not found or unauthorized', 404);

  module.content.push(contentData);
  await module.save();

  return module;
};

const removeContentService = async (moduleId, unitId, userId) => {
  const module = await Module.findOneAndUpdate(
    { _id: moduleId, instructor: userId },
    { $pull: { content: { _id: unitId } } },
    { new: true }
  );

  if (!module) throw new AppError('Module not found or unauthorized', 404);
  return module;
};

const updateContentService = async (moduleId, unitId, updateData, userId) => {
  delete updateData._id;
  delete updateData.type;

  const module = await Module.findOneAndUpdate(
    { _id: moduleId, instructor: userId, 'content._id': unitId },
    { 
      $set: {
        'content.$': { ...updateData, _id: unitId } // The $ symbol represents the matched array item
      }
    },
    { new: true, runValidators: true }
  );

  if (!module) throw new AppError('Content item not found', 404);
  return module;
};

module.exports = {
  addContentService,
  removeContentService,
  updateContentService
};