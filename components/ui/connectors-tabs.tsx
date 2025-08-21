import { CloudUpload, TableProperties, UserPlus, Webhook } from "lucide-react";
import { useState } from "react";
import LeadForm from "../methods/LeadForm";

function ConnectorsTabs() {
  const connectors = [
    {
      title: "Lead Form",
      icon: UserPlus,
      key: "lead_form",
      description: "เพิ่มข้อมูลผ่านแบบฟอร์ม",
    },
    {
      title: "File Upload",
      icon: CloudUpload,
      key: "file_upload",
      description: "อัพโหลดไฟล์ .csv",
    },
    {
      title: "Google Sheet",
      icon: TableProperties,
      key: "google_sheet",
      description: "เชื่อมต่อกับ Google Sheet",
    },
    {
      title: "Open API",
      icon: Webhook,
      key: "open_api",
      description: "Open API",
    },
  ];
  const [activeConnector, setActiveConnector] = useState(connectors[0].key);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="inline-flex h-fit items-center justify-center rounded-md bg-muted p-2 text-muted-foreground">
        {connectors.map((connector) => (
          <button key={connector.key} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${activeConnector === connector.key ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveConnector(connector.key)}>
            {connector.title}
          </button>
        ))}
      </div>
      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {activeConnector === "lead_form" && <LeadForm setSelectedMethod={setSelectedMethod} />}
        {activeConnector === "file_upload" && <p>File Upload</p>}
        {activeConnector === "google_sheet" && <p>Google Sheet</p>}
        {activeConnector === "open_api" && <p>Open API</p>}
      </div>
    </div>
  );
}

export default ConnectorsTabs;