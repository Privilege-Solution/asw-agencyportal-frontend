"use client"

import { Button } from "@/components/ui/button"
import { alert } from "@/hooks/use-alert"

export function AlertExamples() {
  const showBasicAlert = async () => {
    const confirmed = await alert({
      title: "Are you sure?",
      description: "This action cannot be undone.",
    })
    
    console.log("User confirmed:", confirmed)
  }

  const showDestructiveAlert = async () => {
    const confirmed = await alert({
      title: "Delete Account",
      description: "This will permanently delete your account and all data.",
      confirmText: "Delete",
      cancelText: "Keep Account",
      variant: "destructive",
      onConfirm: async () => {
        console.log("Deleting account...")
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    })
    
    if (confirmed) {
      await alert({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        confirmText: "OK"
      })
    }
  }

  const showCustomAlert = async () => {
    await alert({
      title: "Custom Alert",
      description: "This is a custom alert with custom buttons.",
      confirmText: "Proceed",
      cancelText: "Go Back",
      onConfirm: () => {
        console.log("Custom action executed!")
      },
      onCancel: () => {
        console.log("User cancelled")
      }
    })
  }

  const showSimpleNotification = async () => {
    await alert({
      title: "Notification",
      description: "This is a simple notification alert.",
      confirmText: "Got it"
    })
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Alert Dialog Examples</h3>
      <div className="flex flex-wrap gap-2">
        <Button onClick={showBasicAlert} variant="outline">
          Basic Alert
        </Button>
        <Button onClick={showDestructiveAlert} variant="destructive">
          Destructive Alert
        </Button>
        <Button onClick={showCustomAlert} variant="outline">
          Custom Alert
        </Button>
        <Button onClick={showSimpleNotification} variant="outline">
          Simple Notification
        </Button>
      </div>
    </div>
  )
} 