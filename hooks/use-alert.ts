"use client"

import * as React from "react"

export interface AlertDialogOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

type AlertDialog = AlertDialogOptions & {
  id: string
  open: boolean
}

const actionTypes = {
  ADD_ALERT: "ADD_ALERT",
  DISMISS_ALERT: "DISMISS_ALERT",
  REMOVE_ALERT: "REMOVE_ALERT",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_ALERT"]
      alert: AlertDialog
    }
  | {
      type: ActionType["DISMISS_ALERT"]
      alertId?: AlertDialog["id"]
    }
  | {
      type: ActionType["REMOVE_ALERT"]
      alertId?: AlertDialog["id"]
    }

interface State {
  alerts: AlertDialog[]
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ALERT":
      return {
        ...state,
        alerts: [action.alert, ...state.alerts],
      }

    case "DISMISS_ALERT": {
      const { alertId } = action

      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === alertId || alertId === undefined
            ? {
                ...alert,
                open: false,
              }
            : alert
        ),
      }
    }

    case "REMOVE_ALERT":
      if (action.alertId === undefined) {
        return {
          ...state,
          alerts: [],
        }
      }
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.alertId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { alerts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type AlertOptions = Omit<AlertDialog, "id" | "open">

function alert(options: AlertOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const id = genId()

    const dismiss = (confirmed: boolean = false) => {
      dispatch({ type: "DISMISS_ALERT", alertId: id })
      
      // Remove after animation
      setTimeout(() => {
        dispatch({ type: "REMOVE_ALERT", alertId: id })
      }, 300)
      
      resolve(confirmed)
    }

    const handleConfirm = async () => {
      if (options.onConfirm) {
        await options.onConfirm()
      }
      dismiss(true)
    }

    const handleCancel = () => {
      if (options.onCancel) {
        options.onCancel()
      }
      dismiss(false)
    }

    dispatch({
      type: "ADD_ALERT",
      alert: {
        ...options,
        id,
        open: true,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      },
    })
  })
}

function useAlert() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    alert,
    dismiss: (alertId?: string) => dispatch({ type: "DISMISS_ALERT", alertId }),
  }
}

export { useAlert, alert } 