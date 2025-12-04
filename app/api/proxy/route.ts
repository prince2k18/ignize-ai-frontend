/**
 * API Proxy Route - Helps bypass CORS issues in development
 * This creates a Next.js API route that proxies requests to the RAG service
 */

import { NextRequest, NextResponse } from 'next/server'

const RAG_API_URL = process.env.NEXT_PUBLIC_RAG_API_URL || 'http://172.206.201.162:8005'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to the actual RAG API
    const response = await fetch(`${RAG_API_URL}/api/rag/query-with-llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Add timeout
      signal: AbortSignal.timeout(120000), // 2 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('RAG API error:', response.status, errorText)
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Check if it's a network error
    if (errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'Failed to connect to RAG service', 
          details: `Cannot reach ${RAG_API_URL}. Please check if the service is running.`,
          hint: 'Make sure the RAG service is accessible at the configured URL'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Proxy error', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint') || 'health'
    
    // Build the full URL
    const targetUrl = endpoint.startsWith('http') 
      ? endpoint 
      : `${RAG_API_URL}/${endpoint}`
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy GET error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Failed to connect to RAG service', 
        details: errorMessage,
        hint: `Cannot reach ${RAG_API_URL}. Check if service is running.`
      },
      { status: 503 }
    )
  }
}

