export function parsePaging(q, { defaultSort = "-createdAt", defaultLimit = 20 } = {}) {
  const page = Math.max(1, parseInt(q.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(q.limit || String(defaultLimit), 10)));
  const sort = q.sort || defaultSort;
  const skip = (page - 1) * limit;
  return { page, limit, sort, skip };
}
