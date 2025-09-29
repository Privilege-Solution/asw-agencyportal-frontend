export const useGetAgencies = async (authToken: string | undefined) => {
    const response = await fetch(`/agency/api/Agency/GetAgenciesByPagination`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    })
    const data = await response.json()
    return data
}

export const useGetAgencyById = async (agencyID: string, authToken: string | undefined) => {
    console.log('getting agency by id : ', agencyID)
    const response = await fetch(`/agency/api/Agency/GetAgencyByID?agencyID=${agencyID}`, {
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

export const useGetProjects = async (authToken: string | undefined) => {
    const response = await fetch('/agency/api/Project/GetProjects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    })
    const data = await response.json()
    return data
}