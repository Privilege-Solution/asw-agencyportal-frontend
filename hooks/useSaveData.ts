import { Lead } from "@/app/types"
import { apiCall } from "@/lib/api-utils"

export const useSaveLead = async (authToken: string | undefined, leadData: Lead) => {
  const response = await fetch('/agency/api/Lead/SaveLead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(leadData),
  })
  const data = await response.json()
  console.log('Response:', data)
  return data
}