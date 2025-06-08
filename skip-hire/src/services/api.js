/**
 * API Service Layer
 */

const API_BASE_URL = 'https://app.wewantwaste.co.uk/api'

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    }

    try {
        const response = await fetch(url, config)

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        throw error
    }
}

// Skip-specific API methods
export const skipAPI = {
    // Get skips by location
    getSkipsByLocation: async (postcode, area = '') => {
        const params = new URLSearchParams({ postcode })
        if (area) params.append('area', area)

        return apiRequest(`/skips/by-location?${params}`)
    },

}

export const api = {
    get: (endpoint) => apiRequest(endpoint),
    post: (endpoint, data) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    put: (endpoint, data) => apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
}

export default { skipAPI, api } 