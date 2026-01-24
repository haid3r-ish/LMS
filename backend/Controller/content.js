require("module-alias/register")

const {CatchAsync} = require("@util/errorHandler")
const contentService = require("@service/content")

const addContent = CatchAsync(async (req, res) => {
  const module = await contentService.addContentService(req.params.moduleId, req.body, req.user.id);
  res.status(200).send(module);
});

const removeContent = CatchAsync(async (req, res) => {
  const module = await contentService.removeContentService(req.params.moduleId, req.params.unitId, req.user.id);
  res.status(200).send(module);
});

const updateContent = CatchAsync(async (req, res) => {
  const module = await contentService.updateContentService(
    req.params.moduleId, 
    req.params.unitId, 
    req.body, 
    req.user.id
  );
  res.status(200).send(module);
});

module.exports = {
  addContent,
  removeContent,
  updateContent
};