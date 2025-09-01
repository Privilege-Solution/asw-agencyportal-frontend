import { useState } from "react"
import LeadForm from "../methods/LeadForm"
import FileUpload from "../methods/FileUpload"

function LeadsMethod({ selectedMethod, setSelectedMethod }: { selectedMethod: string | null, setSelectedMethod: (method: string | null) => void }) {

  if (selectedMethod === 'lead_form') {
    return <LeadForm setSelectedMethod={setSelectedMethod} />
  }
  if (selectedMethod === 'file_upload') {
    return <FileUpload/>
  }
  return <p>Leads Method</p>
}

export default LeadsMethod