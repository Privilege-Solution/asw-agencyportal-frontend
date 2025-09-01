import { DownloadIcon, ExternalLinkIcon } from "lucide-react"

function FileUpload() {
  return (
    <div>
      <h2 className="text-2xl font-medium">เพิ่มข้อมูลผ่านการอัปโหลดไฟล์</h2>
      <div className="form-container">
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
              อัปโหลดไฟล์ CSV หรือ Excel <span className="text-red-500 text-lg">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>เลือกไฟล์</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv,.xlsx,.xls"
                    />
                  </label>
                  <p className="pl-1">หรือลากไฟล์มาวาง</p>
                </div>
                <p className="text-xs text-gray-500">
                  รองรับไฟล์ CSV, XLSX, XLS (ขนาดไม่เกิน 10MB)
                </p>
              </div>
            </div>
          </div>

          <div>
            <a href="/dashboard/file-upload/template.csv" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <DownloadIcon className="h-5 w-5 text-blue-600 mr-2" />
              ดาวน์โหลดเทมเพลต
            </a>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              อัปโหลด
            </button>
          </div>
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  )
}

export default FileUpload