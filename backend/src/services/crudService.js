import { ApiError } from '../utils/ApiError.js';
import { getPagination, buildMeta } from '../utils/pagination.js';
import { uniqueSlug } from '../utils/slug.js';

/**
 * Generic CRUD service factory for CMS content modules.
 */
export function createCrudService(Model, options = {}) {
  const {
    searchFields = [],
    slugFrom = null,
    defaultFilter = {},
    populate = [],
  } = options;

  async function list(query = {}, { publicOnly = false } = {}) {
    const { page, limit, skip, sort } = getPagination(query);
    const filter = { ...defaultFilter };

    if (publicOnly) filter.status = 'published';
    else if (query.status) filter.status = query.status;

    if (query.category) filter.category = query.category;
    if (query.type) filter.type = query.type;
    if (query.album) filter.album = query.album;
    if (query.teamCategory) filter.teamCategory = query.teamCategory;
    if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured === 'true';
    if (query.isFeaturedOnHero !== undefined) filter.isFeaturedOnHero = query.isFeaturedOnHero === 'true';

    if (query.search && searchFields.length) {
      const regex = new RegExp(query.search, 'i');
      filter.$or = searchFields.map((field) => ({ [field]: regex }));
    }

    let q = Model.find(filter).sort(sort).skip(skip).limit(limit);
    if (populate.length) {
      populate.forEach((p) => {
        q = q.populate(p);
      });
    }

    const [items, total] = await Promise.all([q.lean(), Model.countDocuments(filter)]);
    return { items, meta: buildMeta(total, page, limit) };
  }

  async function getById(id, { publicOnly = false } = {}) {
    let q = Model.findById(id);
    populate.forEach((p) => {
      q = q.populate(p);
    });
    const item = await q.lean();
    if (!item) throw new ApiError(404, 'Resource not found');
    if (publicOnly && item.status && item.status !== 'published') {
      throw new ApiError(404, 'Resource not found');
    }
    return item;
  }

  async function getBySlug(slug, { publicOnly = false } = {}) {
    let q = Model.findOne({ slug });
    populate.forEach((p) => {
      q = q.populate(p);
    });
    const item = await q.lean();
    if (!item) throw new ApiError(404, 'Resource not found');
    if (publicOnly && item.status && item.status !== 'published') {
      throw new ApiError(404, 'Resource not found');
    }
    return item;
  }

  async function create(data) {
    const payload = { ...data };
    if (slugFrom && !payload.slug && payload[slugFrom]) {
      payload.slug = await uniqueSlug(Model, payload[slugFrom]);
    } else if (payload.slug) {
      payload.slug = await uniqueSlug(Model, payload.slug);
    }
    if (payload.status === 'published' && !payload.publishedAt) {
      payload.publishedAt = new Date();
    }
    const doc = await Model.create(payload);
    return doc.toObject();
  }

  async function update(id, data) {
    const existing = await Model.findById(id);
    if (!existing) throw new ApiError(404, 'Resource not found');

    const payload = { ...data };
    if (slugFrom && payload[slugFrom] && payload.slug === undefined) {
      payload.slug = await uniqueSlug(Model, payload[slugFrom], id);
    } else if (payload.slug) {
      payload.slug = await uniqueSlug(Model, payload.slug, id);
    }
    if (payload.status === 'published' && !existing.publishedAt) {
      payload.publishedAt = new Date();
    }

    Object.assign(existing, payload);
    await existing.save();
    return existing.toObject();
  }

  async function remove(id) {
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) throw new ApiError(404, 'Resource not found');
    return doc.toObject();
  }

  async function toggleStatus(id) {
    const doc = await Model.findById(id);
    if (!doc) throw new ApiError(404, 'Resource not found');
    if (!doc.status) throw new ApiError(400, 'Status not supported for this resource');
    doc.status = doc.status === 'published' ? 'draft' : 'published';
    if (doc.status === 'published' && !doc.publishedAt) doc.publishedAt = new Date();
    await doc.save();
    return doc.toObject();
  }

  return { list, getById, getBySlug, create, update, remove, toggleStatus, Model };
}

export default createCrudService;
