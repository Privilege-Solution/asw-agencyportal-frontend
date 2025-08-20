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