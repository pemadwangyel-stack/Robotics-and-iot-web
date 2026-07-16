// ============================================
// API Utility - Connects Frontend to Backend
// ============================================

/**
 * Build a full API URL
 * @param {string} path - API endpoint path (e.g. '/api/health')
 * @param {object} options - Options object
 * @param {string} options.apiBase - Override API base URL
 * @returns {string} Full URL
 */
export function buildApiUrl(path, options = {}) {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Get API base from options, environment, or use default
  const apiBase = options.apiBase ?? import.meta.env?.VITE_API_BASE ?? 'http://localhost:5000';
  
  // Remove trailing slash from base if present
  const cleanBase = apiBase.replace(/\/$/, '');
  
  // Return full URL
  return `${cleanBase}${normalizedPath}`;
}

/**
 * Make an API call with error handling
 * @param {string} endpoint - API endpoint (e.g. '/api/health')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} Response data
 */
export async function callApi(endpoint, options = {}) {
  try {
    const url = buildApiUrl(endpoint, options);
    console.log(`📡 API Call: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Error:', error.message);
    throw error;
  }
}

/**
 * Test backend connection
 * @returns {Promise<boolean>} True if connected
 */
export async function testBackendConnection() {
  try {
    const data = await callApi('/api/health');
    return data.success === true;
  } catch (error) {
    console.warn('⚠️ Backend not available:', error.message);
    return false;
  }
}

// Default export
export default { 
  buildApiUrl, 
  callApi, 
  testBackendConnection 
};