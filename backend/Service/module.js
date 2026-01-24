require("module-alias/register")

const {AppError} = require("@util/errorHandler")
const Module = require("@model/module")

const createModuleService = async (moduleBody, instructorId) => {
  return await Module.create({ ...moduleBody, instructor: instructorId });
};

const getModulesService = async (filter, options) => {
  const modules = await Module.find(filter).select('-content');
  return modules;
};

const getModuleByIdService = async (moduleId) => {
  const module = await Module.findById(moduleId).populate('instructor', 'name email');
  if (!module) throw new AppError('Module not found', 404);
  return module;
};

const updateModuleService = async (moduleId, updateBody, userId) => {
  delete updateBody.content;
  delete updateBody.instructor;

  const module = await Module.findOneAndUpdate(
    { _id: moduleId, instructor: userId },
    updateBody,
    { new: true, runValidators: true }
  );

  if (!module) throw new AppError('Module not found or unauthorized', 404);
  return module;
};

const deleteModuleService = async (moduleId, userId) => {
  const module = await Module.findOneAndDelete({ _id: moduleId, instructor: userId });
  if (!module) throw new AppError('Module not found or unauthorized', 404);
  return module;
};

module.exports = {
  createModuleService,
  getModulesService,
  getModuleByIdService,
  updateModuleService,
  deleteModuleService
};