export interface Lead {
  ProjectID: number
  ContactChannelID: number
  ContactTypeID: number
  RefID: number
  Fname: string
  Lname: string
  Tel: string
  Email: string
  Ref: string
  RefDate: string
  FollowUpID: number
  utm_source: string
  PriceInterest: string
  PurchasePurpose: string
  FlagPersonalAccept: boolean
  FlagContactAccept: boolean
  AppointTime: string
  AppointTimeEnd: string
  utm_campaign: string
  utm_medium: string
  utm_term: string
  utm_content: string
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
