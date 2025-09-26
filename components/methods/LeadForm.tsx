import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Lead, Project } from "@/app/types";
import { toast } from "@/hooks/use-toast";
import { useGetProjects } from "@/hooks/useGetData";
import { cookieUtils } from "@/lib/cookie-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLead } from "@/hooks/useSaveData";

function LeadForm({ setSelectedMethod }: { setSelectedMethod: (method: string | null) => void }) {
  const [sourceUrl, setSourceUrl] = useState<string>('')
  const [utmData, setUtmData] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await useGetProjects(cookieUtils.getAuthToken())
      //console.log('Projects:', projects)
      setProjects(projects.data)
    }
    fetchProjects()
  }, [user])

  const [leadData, setLeadData] = useState<Lead>({
    projectID: 0,
    refDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
    firstName: '',
    lastName: '',
    tel: '',
    email: '',
    refDetail: new Date().toISOString(),
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    priceInterest: '',
    modelInterest: '',
    promoCode: '',
    purchasePurpose: '',
    appointDate: '',
    appointTime: '',
    appointTimeEnd: '',
    lineID: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const requiredFields = ['firstName', 'lastName', 'tel', 'email']
    const missingFields = requiredFields.filter(field => !leadData[field as keyof Lead])
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return
    }
    const requestBody = {
      ...leadData
    }
    const saveLead = await useSaveLead(cookieUtils.getAuthToken(), requestBody)
    console.log('Lead data:', saveLead)
  }

  const handleCancel = () => {
    setSelectedMethod(null)
    //setUtmData([])
    //setSourceUrl('')
  }

  useEffect(() => {
    //console.log('UTM data:', utmData)
    if (utmData.length > 0) {
      // Create an object with all UTM updates
      const utmUpdates: Partial<Lead> = {}
      utmData.forEach((utm) => {
        const [key, value] = utm.split(':')
        
        // Only update UTM-related fields that exist in the Lead interface
        const utmFields = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content', 'utm_id']
        if (utmFields.includes(key)) {
          (utmUpdates as any)[key] = value
        }
      })
      
      // Update leadData with all UTM data at once
      setLeadData(prevLeadData => ({
        ...prevLeadData,
        ...utmUpdates
      }))
    }
  }, [utmData])

  useEffect(() => {
    if (sourceUrl) {
      try {
        const url = new URL(sourceUrl)
        const queryParams = Object.fromEntries(url.searchParams.entries())
        const utmData = Object.entries(queryParams).map(([key, value]) => `${key}:${value}`)
        setUtmData(utmData)
      } catch (error) {
        toast({
          title: 'Invalid URL',
          variant: 'destructive',
        })
        console.error('Invalid URL:', error)
      }
    }
  }, [sourceUrl])

  return (
    <div>
      <h2 className="text-2xl font-medium mb-3">เพิ่มข้อมูลผ่านแบบฟอร์ม</h2>
      <div className="form-container">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="project" className="block  font-medium text-gray-700 mb-1">เลือกโครงการ</label>
            <Select
              name="project"
              value={leadData?.projectID.toString()}
              onValueChange={(value) => setLeadData({ ...leadData, projectID: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกโครงการ" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.projectID} value={project.projectID.toString()}>
                    {project.projectName} [ ID : {project.projectID} ]
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL <span className="text-red-500 text-lg">*</span>
            </label>
            <textarea
              id="url"
              name="url"
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
              onChange={(e) => setSourceUrl(e.target.value)}
            />
          </div>
          <div className={`utm-reviewer ${utmData.length > 0 ? 'bg-green-100' : 'bg-gray-100'} p-4 rounded-md`}>
            {utmData.length > 0 ? utmData.map((utm, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <label className="font-medium text-gray-800 min-w-[80px]">{utm.split(':')[0]}:</label>
                <Input
                  type="text"
                  value={utm.split(':')[1] || ''}
                  onChange={(e) => {
                    const newUtmData = [...utmData];
                    newUtmData[index] = `${utm.split(':')[0]}:${e.target.value}`;
                    setUtmData(newUtmData);
                  }}
                  className="flex-1"
                  placeholder={`Enter ${utm.split(':')[0]}`}
                />
              </div>
            )) : <p className={`*:text-gray-500 text-center text-[16px] ${utmData.length > 0 ? 'text-green-800' : 'text-gray-500'} p-4 rounded-md`}>กรอก URL เพื่อระบุข้อมูล UTM</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fname" className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ <span className="text-red-500 text-lg">*</span>
              </label>
              <Input
                id="fname"
                name="fname"
                type="text"
                placeholder="ชื่อ"
                className="w-full"
                required
                value={leadData?.firstName}
                onChange={(e) => setLeadData({ ...leadData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-1">
                นามสกุล <span className="text-red-500 text-lg">*</span>
              </label>
              <Input
                id="lname"
                name="lname"
                type="text"
                placeholder="นามสกุล"
                className="w-full"
                required
                value={leadData?.lastName}
                onChange={(e) => setLeadData({ ...leadData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์ <span className="text-red-500 text-lg">*</span>
              </label>
              <Input
                id="tel"
                name="tel"
                type="tel"
                placeholder="เบอร์โทรศัพท์"
                className="w-full"
                required
                value={leadData?.tel}
                onChange={(e) => setLeadData({ ...leadData, tel: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล <span className="text-red-500 text-lg">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="อีเมล"
                className="w-full"
                required
                value={leadData?.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="priceInterest" className="block text-sm font-medium text-gray-700 mb-1">
              ราคาที่สนใจ
            </label>
            <Input
              id="priceInterest"
              name="priceInterest"
              type="text"
              placeholder="ราคาที่สนใจ"
              className="w-full"
              value={leadData?.priceInterest}
              onChange={(e) => setLeadData({ ...leadData, priceInterest: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="purchasePurpose" className="block text-sm font-medium text-gray-700 mb-1">
              วัตถุประสงค์การซื้อ
            </label>
            <Input
              id="purchasePurpose"
              name="purchasePurpose"
              type="text"
              placeholder="วัตถุประสงค์การซื้อ"
              className="w-full"
              value={leadData?.purchasePurpose}
              onChange={(e) => setLeadData({ ...leadData, purchasePurpose: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointTime" className="block text-sm font-medium text-gray-700 mb-1">
                ช่วงเวลาที่สะดวกให้ติดต่อกลับ
              </label>
              <div className="flex gap-3 items-center">
                <Input
                  id="appointTime"
                  name="appointTime"
                  type="time"
                  className="!text-base w-fit"
                  value={leadData?.appointTime}
                  onChange={(e) => setLeadData({ ...leadData, appointTime: e.target.value })}
                />
                <span className="text-gray-500">ถึง</span>
                <Input
                  id="appointTimeEnd"
                  name="appointTimeEnd"
                  type="time"
                  className="!text-base w-fit"
                  value={leadData?.appointTimeEnd}
                  onChange={(e) => setLeadData({ ...leadData, appointTimeEnd: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                id="flagPersonalAccept"
                name="flagPersonalAccept"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="flagPersonalAccept" className="text-sm text-gray-700">
                ยินยอมให้ใช้ข้อมูลส่วนบุคคล
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="flagContactAccept"
                name="flagContactAccept"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="flagContactAccept" className="text-sm text-gray-700">
                ยินยอมให้ติดต่อ
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setSelectedMethod(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
      <div className="h-10"></div>
    </div>
  )
}

export default LeadForm