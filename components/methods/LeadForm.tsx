import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Lead } from "@/app/types";

function LeadForm({ setSelectedMethod }: { setSelectedMethod: (method: string | null) => void }) {
  const [sourceUrl, setSourceUrl] = useState<string>('')
  const [utmData, setUtmData] = useState<string[]>([])
  const [leadData, setLeadData] = useState<Lead>()

  return (
    <div>
      <h2 className="text-2xl font-medium">เพิ่มข้อมูลผ่านแบบฟอร์ม</h2>
      <div className="form-container">
          <form className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL <span className="text-red-500 text-lg">*</span>
              </label>
              <textarea
                id="url"
                name="url"
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                required
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>
            <div className={`utm-reviewer ${utmData.length > 0 ? 'bg-green-100' : 'bg-gray-100'} p-4 rounded-md`}>
              {utmData.length > 0 ? utmData.map((utm, index) => (
                <div key={index}>
                  <p className="text-gray-800">
                    <span className="font-medium">{utm.split(':')[0]}:</span>
                    <span className="ml-1">{utm.split(':')[1]}</span>
                  </p>
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
                  value={leadData?.Fname}
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
                  />
                  <span className="text-gray-500">ถึง</span>
                  <Input
                  id="appointTimeEnd"
                  name="appointTimeEnd"
                  type="time"
                  className="!text-base w-fit"
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
    </div>
  )
}

export default LeadForm