/**
 * vLLM Proxy Route - Proxies requests to GPT-OSS 120B vLLM service
 * This avoids CORS issues by making requests server-side
 */

import { NextRequest, NextResponse } from 'next/server'

const VLLM_URL = process.env.NEXT_PUBLIC_VLLM_URL || 'http://172.206.201.162:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to vLLM
    const response = await fetch(`${VLLM_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120000), // 2 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('vLLM API error:', response.status, errorText)
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('vLLM Proxy error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'Failed to connect to vLLM service', 
          details: `Cannot reach ${VLLM_URL}. Please check if the service is running.`,
          hint: 'Make sure port 8000 is open in Azure firewall'
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

