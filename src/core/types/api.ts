export interface OffsetPageDTO {
  page: number
  limit: number
  total: number
  pages: number
  offset: number
  has_next: boolean
  has_prev: boolean
}

export interface PaginatedApiResponse<T> {
  success: boolean
  data: {
    items: T[]
    pagination: OffsetPageDTO
  }
  message: string
  timestamp: string
  request_id: string
}

export interface ApiResponse<T> {
  success?: boolean
  data: T | { item: T }
  message?: string
  timestamp?: string
  request_id?: string
}
