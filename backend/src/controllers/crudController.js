import { success, created } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export function createCrudController(service, options = {}) {
  const { resourceName = 'Item' } = options;

  return {
    list: asyncHandler(async (req, res) => {
      const publicOnly = req.baseUrl.includes('/public');
      const result = await service.list(req.query, { publicOnly });
      return success(res, result.items, `${resourceName} list`, 200, result.meta);
    }),

    getOne: asyncHandler(async (req, res) => {
      const publicOnly = req.baseUrl.includes('/public');
      const { id } = req.params;
      const item = id.match(/^[0-9a-fA-F]{24}$/)
        ? await service.getById(id, { publicOnly })
        : await service.getBySlug(id, { publicOnly });
      return success(res, item);
    }),

    create: asyncHandler(async (req, res) => {
      const item = await service.create(req.body);
      return created(res, item, `${resourceName} created`);
    }),

    update: asyncHandler(async (req, res) => {
      const item = await service.update(req.params.id, req.body);
      return success(res, item, `${resourceName} updated`);
    }),

    remove: asyncHandler(async (req, res) => {
      await service.remove(req.params.id);
      return success(res, null, `${resourceName} deleted`);
    }),

    toggleStatus: asyncHandler(async (req, res) => {
      const item = await service.toggleStatus(req.params.id);
      return success(res, item, `${resourceName} status updated`);
    }),
  };
}

export default createCrudController;
