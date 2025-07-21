"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Users, FileText, Settings, BarChart3, Briefcase, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Briefcase, label: "Assets", active: false },
  { icon: Users, label: "Clients", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn("bg-white border-r border-gray-200 transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img
                src="https://cdn.assetwise.co.th/wp-content/themes/seed-spring/img/asw-logo_horizontal.svg"
                alt="AssetWise Logo"
                className="h-8 w-auto"
              />
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center">
              <img
                src="https://cdn.assetwise.co.th/wp-content/themes/seed-spring/img/asw-logo_horizontal.svg"
                alt="AssetWise Logo"
                className="h-6 w-auto"
              />
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed ? "px-2" : "px-3",
                    item.active && "bg-blue-600 text-white hover:bg-blue-700",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
