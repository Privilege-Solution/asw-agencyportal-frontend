export interface Lead {
  projectID: number; //Required
  firstName: string; //Required
  lastName: string; //Required
  tel: string; //Required
  email: string; //Required
  refDetail: string; //Required
  refDate: string;
  utm_source: string; //Required
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  priceInterest?: string;
  modelInterest?: string;
  promoCode?: string;
  purchasePurpose?: string;
  appointDate?: string;
  appointTime?: string; //Required ถ้ามีข้อมูล appointDate
  appointTimeEnd?: string; //Required ถ้ามีข้อมูล appointDate
  lineID?: string;
}

export interface Leads {
  Data: Lead[]
}

export interface User {
  id: string
  displayName: string
  givenName: string
  surename: string
  email: string
  userRoleID: number | null
  userRoleName: string
  departmentID: number
  departmentName: string
  jobTitle: string
  projectIDs: number[]
  createBy: string
  createDate: string
  updateBy: string
  updateDate: string
  isActive: boolean
  // Agency-specific fields (optional for agency users)
  agencyID?: string | number
  agencyName?: string
  agencyType?: string
  agencyTypeID?: number
  refCode?: string
  userType?: 'agency' | 'agent' // For agency role users, distinguishes between agency owner and agent
}

export interface Agency {
  id: string
  refCode: string
  name: string
  description: string
  email: string
  tel: string
  agencyTypeID: number
  createBy: string
  createDate: string
  updateBy: string
  updateDate: string
  isActive: boolean
  firstName: string
  lastName: string
  agencyType: {
    id: number
    name: string
    description: string
    createBy: string | null
    createDate: string
    updateBy: string | null
    updateDate: string
    isActive: boolean
  }
  projectIDs: number[]
  members?: any[]
}

export interface Agent {
  id: string
  email: string
  firstName: string
  lastName: string
  agencyID: string
  isActive: boolean
  createDate: string
}

export interface Project {
  buid: number
  bu: string
  projectID: number
  projectCode: string
  projectName: string
}
