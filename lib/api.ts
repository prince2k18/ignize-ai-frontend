/**
 * API client for Ignize AI RAG system
 */

// Use Next.js API route as proxy to avoid CORS issues
// Check if we should use proxy (default to true for development)
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY !== 'false' // Default to true
const RAG_API_URL = USE_PROXY 
  ? '/api/proxy' 
  : (process.env.NEXT_PUBLIC_RAG_API_URL || 'http://172.206.201.162:8005')
const DOC_API_URL = process.env.NEXT_PUBLIC_DOC_API_URL || 'http://172.206.201.162:8004'

export interface QueryRequest {
  query: string
  document_type?: string
  top_k?: number
  use_llm?: boolean
  use_web_search?: boolean
}

export interface QueryResponse {
  query: string
  context: string
  answer: string | null
  sources: Array<{
    rank: number
    filename: string
    page: string
    similarity_score: number
  }>
  total_results: number
}

export async function queryRAG(request: QueryRequest): Promise<QueryResponse> {
  try {
    // If using proxy, the URL is already /api/proxy, don't append path
    // If not using proxy, append the full path
    const url = USE_PROXY 
      ? '/api/proxy' 
      : `${RAG_API_URL}/api/rag/query-with-llm`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: request.query,
        document_type: request.document_type || 'textbook',
        top_k: request.top_k || 5,
        use_web_search: request.use_web_search || false,
        use_llm: request.use_llm !== false,
      }),
      // Add timeout
      signal: AbortSignal.timeout(120000), // 2 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error (${response.status}): ${errorText || response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's a network error
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error(`Network error: Cannot connect to API. ${USE_PROXY ? 'Proxy route may not be working.' : `Please check if the service is running at ${RAG_API_URL}`}`)
      }
      throw error
    }
    throw new Error('Unknown error occurred')
  }
}

export async function uploadDocument(file: File): Promise<{ status: string; document_id: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${DOC_API_URL}/api/documents/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload error: ${response.statusText}`)
  }

  return response.json()
}

export async function uploadImage(file: File): Promise<{ status: string; analysis: string }> {
  // For now, images are processed similarly to documents
  // In the future, this will call OCR service (OLMOCR/Chandra/EasyOCR)
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${DOC_API_URL}/api/documents/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload error: ${response.statusText}`)
  }

  return response.json()
}

export async function getCollections() {
  const url = USE_PROXY 
    ? '/api/proxy?endpoint=api/rag/collections'
    : `${RAG_API_URL}/api/rag/collections`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }
  return response.json()
}

export async function healthCheck() {
  const url = USE_PROXY 
    ? '/api/proxy?endpoint=health'
    : `${RAG_API_URL}/health`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`)
  }
  return response.json()
}

