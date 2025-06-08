/**
 * Custom Hook for Skip Data Management
 * Handles fetching, loading states, and error handling for skip data
 */
import { useState, useEffect } from 'react'
import { skipAPI } from '../services/api'

export const useSkips = (postcode = 'NR32', area = 'Lowestoft') => {
    const [skips, setSkips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Transform API data to  component format
    const transformSkipData = (apiSkips) => {
        return apiSkips.map(skip => {
            const priceAfterVat = skip.price_before_vat + (skip.price_before_vat * skip.vat / 100)
            return {
                id: skip.id,
                name: `${skip.size} YARD SKIP CONTAINER`,
                price: `£${priceAfterVat.toFixed(2)}`, // Price AFTER VAT (main display price)
                capacity: `${skip.size} cubic yards`,
                size: skip.size,
                hirePeriod: skip.hire_period_days,
                allowedOnRoad: skip.allowed_on_road,
                allowsHeavyWaste: skip.allows_heavy_waste,
                priceBeforeVat: skip.price_before_vat, // Price BEFORE VAT
                priceAfterVat: priceAfterVat, // Store calculated value
                vat: skip.vat,
                transportCost: skip.transport_cost,
                perTonneCost: skip.per_tonne_cost,
                forbidden: skip.forbidden,
                postcode: skip.postcode,
                area: skip.area,
                createdAt: skip.created_at,
                updatedAt: skip.updated_at,
            }
        })
    }

    const fetchSkips = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await skipAPI.getSkipsByLocation(postcode, area)
            const transformedData = transformSkipData(data)
            setSkips(transformedData)
        } catch (err) {
            setError(err.message)
            setSkips([])
        } finally {
            setLoading(false)
        }
    }

    // manual refresh
    const refetchSkips = () => {
        fetchSkips()
    }

    useEffect(() => {
        fetchSkips()
    }, [postcode, area])

    return {
        skips,
        loading,
        error,
        refetchSkips
    }
}

export default useSkips 