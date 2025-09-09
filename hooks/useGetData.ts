export const useGetAgencies = async () => {
    const response = await fetch(`/api/Agency/GetAgenciesByPagination`)
    const data = await response.json()
    return data
}

export const useGetAgencyById = async (agencyID: string, authToken: string | undefined) => {
    console.log('getting agency by id : ', agencyID)
    const response = await fetch(`/api/Agency/GetAgencyByID?agencyID=${agencyID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    })
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
}