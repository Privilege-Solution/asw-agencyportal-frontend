# Role-Based Access Control (RBAC) Implementation

This document explains the comprehensive Role-Based Access Control system implemented for the ASW Agency Portal.

## Overview

The RBAC system provides a clean, maintainable way to control access to features and data based on user roles. It supports three role levels with different permission sets.

## Role Hierarchy

### 1. Super Admin (Role ID: 1)
- **Full system access** including site settings
- Can see **all views** and **all data**
- Highest privilege level
- Has access to system configuration and user management

### 2. Admin (Role ID: 2)
- **All features except site settings**
- Can see most views and all data
- User management capabilities
- Cannot modify system-wide settings

### 3. Agency (Role ID: 3)
- **Limited to own data and basic features**
- Can only see their agency's data
- Basic lead management and file upload
- Restricted view access

## Core Components

### 1. Role Types and Constants (`lib/types/roles.ts`)

```typescript
export const USER_ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  AGENCY: 3
} as const

export const PERMISSIONS = {
  SITE_SETTINGS: 'site_settings',
  USER_MANAGEMENT: 'user_management',
  VIEW_ALL_DATA: 'view_all_data',
  // ... more permissions
} as const

export const VIEWS = {
  DASHBOARD: 'dashboard',
  LEADS: 'leads',
  ANALYTICS: 'analytics',
  // ... more views
} as const
```

### 2. RBAC Utility Functions (`lib/rbac.ts`)

```typescript
// Check permissions
const hasPermission = (userRole: UserRole, permission: Permission): boolean

// Check view access
const canAccessView = (userRole: UserRole, view: View): boolean

// Check data ownership (for agency users)
const canAccessData = (user: UserWithRole, dataOwnerId?: string): boolean
```

### 3. Enhanced Auth Context (`lib/auth-context.tsx`)

Extended with role-based helper functions:

```typescript
const { 
  hasPermission, 
  canAccessView, 
  isSuperAdmin, 
  isAdmin, 
  isAgency 
} = useAuth()
```

## UI Components

### 1. RoleGuard Component (`components/rbac/RoleGuard.tsx`)

Conditional rendering based on roles/permissions:

```tsx
<RoleGuard requiredRole={USER_ROLES.ADMIN}>
  <AdminOnlyContent />
</RoleGuard>

<RoleGuard requiredPermission={PERMISSIONS.SITE_SETTINGS}>
  <SiteSettingsButton />
</RoleGuard>

<RoleGuard allowedRoles={[USER_ROLES.AGENCY]}>
  <AgencyOnlyFeature />
</RoleGuard>
```

**Convenience Components:**
```tsx
<SuperAdminOnly>...</SuperAdminOnly>
<AdminAndUp>...</AdminAndUp>
<AgencyOnly>...</AgencyOnly>
```

### 2. Route Protection HOC (`components/rbac/withRoleProtection.tsx`)

Protect entire pages/components:

```tsx
const ProtectedPage = withRoleProtection(MyComponent, {
  requiredRole: USER_ROLES.ADMIN,
  redirectTo: '/access-denied'
})

// Convenience HOCs
const SuperAdminPage = withSuperAdminProtection(MyComponent)
const AdminPage = withAdminProtection(MyComponent)
```

### 3. Role-Based Sidebar (`components/layout/sidebar.tsx`)

Navigation items automatically filtered by role:

```tsx
const menuItems = [
  { icon: Home, label: "Dashboard", view: VIEWS.DASHBOARD },
  { icon: Settings, label: "Site Settings", view: VIEWS.SITE_SETTINGS },
  // ... more items
]

// Only shows items user has access to
{menuItems.map(item => (
  <RoleGuard key={item.view} requiredView={item.view}>
    <NavigationItem {...item} />
  </RoleGuard>
))}
```

## Usage Examples

### Basic Permission Checking

```tsx
function MyComponent() {
  const { hasPermission, canAccessView } = useAuth()
  
  return (
    <div>
      {hasPermission(PERMISSIONS.USER_MANAGEMENT) && (
        <UserManagementButton />
      )}
      
      {canAccessView(VIEWS.ANALYTICS) && (
        <AnalyticsChart />
      )}
    </div>
  )
}
```

### Protecting Routes

```tsx
// pages/admin/users.tsx
export default withAdminProtection(function UsersPage() {
  return <UserManagement />
})

// pages/settings.tsx  
export default withSuperAdminProtection(function SettingsPage() {
  return <SiteSettings />
})
```

### Data Access Control

```tsx
function LeadsList() {
  const { user } = useAuth()
  
  const canViewAllLeads = hasPermission(PERMISSIONS.VIEW_ALL_DATA)
  const leads = canViewAllLeads 
    ? getAllLeads() 
    : getUserLeads(user.id)
  
  return <LeadsTable leads={leads} />
}
```

### Role-Based Dashboard Content

```tsx
function Dashboard() {
  return (
    <div>
      {/* Common content for all roles */}
      <WelcomeSection />
      
      {/* Super Admin only */}
      <SuperAdminOnly>
        <SystemHealthMetrics />
        <SiteConfigurationPanel />
      </SuperAdminOnly>
      
      {/* Admin and above */}
      <AdminAndUp>
        <UserManagementSummary />
        <SystemReports />
      </AdminAndUp>
      
      {/* Agency users only */}
      <AgencyOnly>
        <AgencyDataSummary />
        <AgencyOnlyFeatures />
      </AgencyOnly>
    </div>
  )
}
```

## Testing the System

### Role Test Panel

A testing component is included for development:

```tsx
<RoleTestPanel />
```

This allows you to:
- Switch between different user roles
- See how the interface changes
- Test permission and view restrictions
- Verify data access controls

### Mock Users for Testing

```javascript
// Super Admin
login('email', {
  role: USER_ROLES.SUPER_ADMIN,
  userRoleID: 1,
  name: 'Super Admin User'
})

// Admin  
login('email', {
  role: USER_ROLES.ADMIN,
  userRoleID: 2,
  name: 'Admin User'
})

// Agency
login('email', {
  role: USER_ROLES.AGENCY,
  userRoleID: 3,
  name: 'Agency User',
  agencyId: 'agency-001'
})
```

## Integration with Existing API

The system is designed to work with your existing user API structure:

```typescript
// Maps API response to RBAC roles
const mapApiUserToRole = (apiUser) => {
  let role = USER_ROLES.AGENCY // Default
  
  if (apiUser.userRoleID === 1) role = USER_ROLES.SUPER_ADMIN
  else if (apiUser.userRoleID === 2) role = USER_ROLES.ADMIN
  else if (apiUser.userRoleID === 3) role = USER_ROLES.AGENCY
  
  return {
    ...apiUser,
    role,
    // Preserve existing API fields
    userRoleID: apiUser.userRoleID,
    userRoleName: apiUser.userRoleName,
    departmentID: apiUser.departmentID,
    departmentName: apiUser.departmentName
  }
}
```

## Security Considerations

1. **Client-Side Only**: This RBAC system is for UI control only
2. **Server-Side Validation**: Always validate permissions on the server
3. **Token Security**: Use secure cookie-based auth tokens  
4. **Data Filtering**: Filter data based on user permissions on API level
5. **Audit Logging**: Log permission changes and access attempts

## Extending the System

### Adding New Roles

```typescript
// 1. Add to USER_ROLES
export const USER_ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MANAGER: 2.5, // New role between admin and agency
  AGENCY: 3
} as const

// 2. Update ROLE_PERMISSIONS
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.MANAGER]: [
    PERMISSIONS.VIEW_ALL_DATA,
    PERMISSIONS.LEADS,
    // ... specific permissions
  ]
}

// 3. Update ROLE_VIEWS
export const ROLE_VIEWS: Record<UserRole, View[]> = {
  [USER_ROLES.MANAGER]: [
    VIEWS.DASHBOARD,
    VIEWS.LEADS,
    VIEWS.ANALYTICS
  ]
}
```

### Adding New Permissions

```typescript
// 1. Add to PERMISSIONS
export const PERMISSIONS = {
  // ... existing permissions
  EXPORT_DATA: 'export_data',
  BULK_IMPORT: 'bulk_import'
} as const

// 2. Assign to roles
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.ADMIN]: [
    // ... existing permissions
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.BULK_IMPORT
  ]
}

// 3. Use in components
<RoleGuard requiredPermission={PERMISSIONS.EXPORT_DATA}>
  <ExportButton />
</RoleGuard>
```

### Adding New Views

```typescript
// 1. Add to VIEWS
export const VIEWS = {
  // ... existing views
  REPORTS: 'reports',
  AUDIT_LOGS: 'audit_logs'
} as const

// 2. Assign to roles
export const ROLE_VIEWS: Record<UserRole, View[]> = {
  [USER_ROLES.SUPER_ADMIN]: [
    // ... existing views
    VIEWS.REPORTS,
    VIEWS.AUDIT_LOGS
  ]
}

// 3. Protect routes/components
<RoleGuard requiredView={VIEWS.AUDIT_LOGS}>
  <AuditLogsPage />
</RoleGuard>
```

## Best Practices

1. **Consistent Naming**: Use clear, descriptive names for roles, permissions, and views
2. **Granular Permissions**: Create specific permissions rather than broad ones
3. **Default Deny**: Always default to denying access unless explicitly granted
4. **Component Composition**: Use `RoleGuard` extensively for clean component composition
5. **Testing**: Always test with different roles during development
6. **Documentation**: Keep role definitions and changes well documented
7. **Backward Compatibility**: Maintain compatibility with existing API structures

## Troubleshooting

### Common Issues

1. **User not seeing expected content**: Check role assignment and permission mapping
2. **Navigation not updating**: Verify view assignments for the user's role
3. **Access denied on valid access**: Check HOC configuration and redirect paths
4. **Hydration errors**: Ensure role checks are client-side safe

### Debug Helper

```typescript
// Add to development tools
const debugUserAccess = (user) => {
  console.log('User:', user)
  console.log('Permissions:', getUserPermissions(user.role))
  console.log('Views:', getUserViews(user.role))
}
```

This RBAC system provides a robust, maintainable foundation for controlling access throughout your application while remaining easy to extend and modify as requirements evolve.
