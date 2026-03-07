// Pagination helper

exports.paginate = async (Model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
    populate = null,
    select = null
  } = options;

  const skip = (page - 1) * limit;

  let query = Model.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip(skip);

  if (populate) query = query.populate(populate);
  if (select) query = query.select(select);

  const [data, total] = await Promise.all([
    query.exec(),
    Model.countDocuments(filter)
  ]);

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};
