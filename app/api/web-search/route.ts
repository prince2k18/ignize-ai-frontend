/**
 * Web Search Proxy - Calls Current Affairs service for UPSC-focused web search
 * Only searches trusted UPSC sources: The Hindu, PIB, Indian Express, PRS India
 */

import { NextRequest, NextResponse } from 'next/server'

const CURRENT_AFFAIRS_URL = process.env.NEXT_PUBLIC_CURRENT_AFFAIRS_URL || 'http://172.206.201.162:8008'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, sources } = body
    
    // Call Current Affairs service web search
    const response = await fetch(`${CURRENT_AFFAIRS_URL}/api/current-affairs/web-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        sources: sources || ['the_hindu', 'pib', 'indian_express', 'prs_india'],
        max_results: 5
      }),
      signal: AbortSignal.timeout(60000), // 60 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Current Affairs API error:', response.status, errorText)
      return NextResponse.json(
        { error: `API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Web Search Proxy error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Fallback: Return error message
    return NextResponse.json(
      { 
        error: 'Failed to fetch current affairs', 
        details: errorMessage,
        hint: 'Web search will use LLM knowledge instead'
      },
      { status: 503 }
    )
  }
}

