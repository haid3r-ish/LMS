require("module-alias/register")

const {CatchAsync} = require("@util/errorHandler")
const moduleService = require("@service/module")

const createModule = CatchAsync(async (req, res) => {
  const module = await moduleService.createModuleService(req.body, req.user.id);
  res.status(201).send(module);
});

const getModules = CatchAsync(async (req, res) => {
  const modules = await moduleService.getModulesService(req.query);
  res.status(200).send(modules);
});

const getModule = CatchAsync(async (req, res) => {
  const module = await moduleService.getModuleByIdService(req.params.moduleId);
  res.status(200).send(module);
});

const updateModule = CatchAsync(async (req, res) => {
  const module = await moduleService.updateModuleService(req.params.moduleId, req.body, req.user.id);
  res.status(200).send(module);
});

const deleteModule = CatchAsync(async (req, res) => {
  await moduleService.deleteModuleService(req.params.moduleId, req.user.id);
  res.status(204).send();
});

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule
};