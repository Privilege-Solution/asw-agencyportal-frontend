const useGetAgencies = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Agency/GetAgenciesByPagination`)
    const data = await response.json()
    return data
}

export default useGetAgencies