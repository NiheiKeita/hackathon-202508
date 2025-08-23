import { useState, useEffect } from 'react'
import { Park } from '../../../types/kodama'
import { useKodamaApi } from '../../../hooks/useKodamaApi'

export const useHomeHooks = () => {
  const [parks, setParks] = useState<Park[]>([])
  const { getParks, loading, error } = useKodamaApi()

  useEffect(() => {
    const fetchParks = async () => {
      const parksData = await getParks()
      if (parksData) {
        setParks(parksData)
      }
    }

    fetchParks()
  }, [getParks])

  return {
    parks,
    loading,
    error,
  }
}