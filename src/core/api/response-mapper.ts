export function mapPaginatedResponse<T>(data: {
  items: T[]
  total: number
  page: number
  limit: number
}) {
  return {
    items: data.items,
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages: Math.ceil(data.total / data.limit),
  }
}
