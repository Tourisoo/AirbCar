'use client'
import { getAPIConfig } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [apiConfig, setApiConfig] = useState(null)
  const [backendTest, setBackendTest] = useState(null)

  useEffect(() => {
    // Get API configuration
    const config = getAPIConfig()
    setApiConfig(config)

    // Test backend connection
    const testBackend = async () => {
      try {
        console.log('Testing backend at:', config.API_BASE_URL)
        const response = await fetch(`${config.API_BASE_URL}/listings/`)
        if (response.ok) {
          const data = await response.json()
          setBackendTest({ 
            status: 'success', 
            message: 'Backend is reachable', 
            dataCount: Array.isArray(data) ? data.length : 'N/A'
          })
        } else {
          setBackendTest({ status: 'error', message: `Backend returned ${response.status}` })
        }
      } catch (error) {
        setBackendTest({ status: 'error', message: error.message })
      }
    }

    testBackend()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#f5f5f5' }}>
      <h1>🔍 API Debug Information</h1>
      
      <div style={{ backgroundColor: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>📍 Current Location:</h2>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
Origin: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}{'\n'}
Host: {typeof window !== 'undefined' ? window.location.host : 'N/A'}
        </pre>
      </div>

      <div style={{ backgroundColor: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>⚙️ API Configuration:</h2>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
{apiConfig ? JSON.stringify(apiConfig, null, 2) : 'Loading...'}
        </pre>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>🌐 Backend Connection Test:</h2>
        <pre style={{ 
          backgroundColor: backendTest?.status === 'success' ? '#d4edda' : '#f8d7da', 
          padding: '10px',
          color: backendTest?.status === 'success' ? '#155724' : '#721c24'
        }}>
{backendTest ? JSON.stringify(backendTest, null, 2) : 'Testing...'}
        </pre>
      </div>

      <div style={{ backgroundColor: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>🔧 Manual Tests:</h2>
        <button 
          onClick={() => window.open('http://localhost:8000/listings/', '_blank')}
          style={{ padding: '10px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
        >
          Test Backend Directly
        </button>
      </div>
    </div>
  )
}