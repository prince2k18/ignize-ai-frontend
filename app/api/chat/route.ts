/**
 * Chat Proxy - Proxies requests to API Gateway /api/v1/chat
 * Returns answer + sources (RAG citations) without CORS issues.
 */

import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, mode = 'general', use_rag = true, use_reranker = true } = body

    const response = await fetch(`${API_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        mode,
        use_rag,
        use_reranker,
      }),
      signal: AbortSignal.timeout(120000), // 2 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Gateway error:', response.status, errorText)
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat Proxy error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to connect to API Gateway',
        details: errorMessage,
        hint: `Check API gateway at ${API_URL} and ensure port 8080 is open`,
      },
      { status: 503 }
    )
  }
}


