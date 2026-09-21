export function getPagination(query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || 'updatedAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  return { page, limit, skip, sort: { [sortBy]: sortOrder } };
}

export function buildMeta(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

export default { getPagination, buildMeta };
