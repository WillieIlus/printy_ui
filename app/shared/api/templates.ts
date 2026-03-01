import type {
  TemplateCategoryDTO,
  PrintTemplateListDTO,
  PrintTemplateDetailDTO,
  TemplatePriceResponseDTO,
  TemplateCalculatePricePayload,
} from '~/shared/types/templates'
import type { PaginatedResponse } from '~/shared/types'
import { API } from '~/shared/api-paths'

export interface ListTemplatesParams {
  category__slug?: string
  is_popular?: boolean
  is_best_value?: boolean
  is_new?: boolean
  search?: string
  ordering?: string
}

export async function listCategories(): Promise<TemplateCategoryDTO[]> {
  const { get } = useApi()
  const data = await get<TemplateCategoryDTO[] | { results: TemplateCategoryDTO[] }>(API.templateCategories())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: TemplateCategoryDTO[] }).results)) {
    return (data as { results: TemplateCategoryDTO[] }).results
  }
  return []
}

export async function listTemplates(
  params?: ListTemplatesParams
): Promise<PaginatedResponse<PrintTemplateListDTO>> {
  const { get } = useApi()
  const query: Record<string, string | number | boolean> = {}
  if (params?.category__slug) query.category__slug = params.category__slug
  if (params?.is_popular !== undefined) query.is_popular = params.is_popular
  if (params?.is_best_value !== undefined) query.is_best_value = params.is_best_value
  if (params?.is_new !== undefined) query.is_new = params.is_new
  if (params?.search) query.search = params.search
  if (params?.ordering) query.ordering = params.ordering

  const response = await get<PaginatedResponse<PrintTemplateListDTO>>(API.templates(), query)
  return {
    count: response?.count ?? 0,
    next: response?.next ?? null,
    previous: response?.previous ?? null,
    results: response?.results ?? [],
  }
}

export async function getTemplate(slug: string): Promise<PrintTemplateDetailDTO | null> {
  const { get } = useApi()
  try {
    return await get<PrintTemplateDetailDTO>(API.templateDetail(slug))
  } catch {
    return null
  }
}

export async function calculateTemplatePrice(
  slug: string,
  payload: TemplateCalculatePricePayload
): Promise<TemplatePriceResponseDTO | null> {
  const { post } = useApi()
  try {
    return await post<TemplatePriceResponseDTO>(API.templateCalculatePrice(slug), payload)
  } catch {
    return null
  }
}
