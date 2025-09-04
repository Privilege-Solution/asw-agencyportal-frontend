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
  userType?: 'agency' | 'agent' // For agency role users, distinguishes between agency owner and agent
}

export interface Agency {
  id?: string
  name: string
  description: string
  email: string
  tel: string
  agencyTypeID: number
  isActive: boolean
  firstName: string
  lastName: string
  projectIDs: number[]
}

export interface Agent {
  agencyID: string
  agentID: string
  isActive: boolean
  agent: {
    firstName: string
    lastName: string
    email: string
    tel: string
  }
}