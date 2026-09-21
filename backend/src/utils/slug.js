import slugify from 'slugify';

export function makeSlug(text) {
  return slugify(String(text || ''), { lower: true, strict: true, trim: true });
}

export async function uniqueSlug(Model, text, excludeId = null) {
  let base = makeSlug(text) || `item-${Date.now()}`;
  let slug = base;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const filter = { slug };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await Model.exists(filter);
    if (!exists) return slug;
    slug = `${base}-${i++}`;
  }
}

export default { makeSlug, uniqueSlug };
