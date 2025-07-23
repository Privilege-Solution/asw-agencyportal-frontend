"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAlert } from "@/hooks/use-alert"

export function AlertProvider() {
  const { alerts } = useAlert()

  return (
    <>
      {alerts.map((alertDialog) => (
        <AlertDialog key={alertDialog.id} open={alertDialog.open}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
              {alertDialog.description && (
                <AlertDialogDescription>
                  {alertDialog.description}
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={alertDialog.onCancel}>
                {alertDialog.cancelText || "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={alertDialog.onConfirm}
                className={alertDialog.variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {alertDialog.confirmText || "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </>
  )
} 