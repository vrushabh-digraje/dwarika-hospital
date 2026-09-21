import { Router } from 'express';
import { protect } from '../middleware/optionalAuth.js';

/**
 * Builds standard REST routes for a CMS module.
 * mode: 'admin' | 'public'
 */
export function createCrudRouter(controller, { includeToggle = true, mode = 'admin' } = {}) {
  const router = Router();

  router.get('/', controller.list);
  router.get('/:id', controller.getOne);

  if (mode === 'admin') {
    router.post('/', protect, controller.create);
    router.put('/:id', protect, controller.update);
    router.patch('/:id', protect, controller.update);
    router.delete('/:id', protect, controller.remove);

    if (includeToggle && controller.toggleStatus) {
      router.patch('/:id/toggle-status', protect, controller.toggleStatus);
    }
  }

  return router;
}

export default createCrudRouter;
