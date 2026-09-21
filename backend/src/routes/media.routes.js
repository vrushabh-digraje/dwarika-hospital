import { Router } from 'express';
import { protect } from '../middleware/optionalAuth.js';
import { upload } from '../middleware/upload.js';
import * as mediaController from '../controllers/mediaController.js';

const router = Router();

router.get('/', mediaController.list);
router.get('/folders', mediaController.folders);
router.get('/:id', mediaController.getOne);

router.post('/upload', protect, upload.single('file'), mediaController.uploadOne);
router.post('/upload-many', protect, upload.array('files', 20), mediaController.uploadMany);
router.put('/:id/replace', protect, upload.single('file'), mediaController.replace);
router.patch('/:id', protect, mediaController.update);
router.delete('/:id', protect, mediaController.remove);

export default router;
