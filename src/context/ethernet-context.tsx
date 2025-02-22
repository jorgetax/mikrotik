'use client'

import {createContext, ReactNode, useCallback, useContext, useMemo, useReducer} from "react";
import {Ethernet, Log} from "@/lib/types";

type CodeAction =
  | { type: 'INTERFACES', payload: { interfaces: Ethernet[] } }
  | { type: 'LOGS', payload: { alert: Log } }

export type Code = { interfaces: Ethernet[], logs: Log[] }
type CodeContextType = {
  code: Code | undefined,
  interfaces: (interfaces: Ethernet[]) => void,
  logs: (alert: Log) => void
}

export const CodeContext = createContext<CodeContextType | undefined>(undefined)

function reducer(code: Code | undefined, action: CodeAction): Code {
  const current = code || initialState

  switch (action.type) {
    case 'INTERFACES': {
      const {interfaces} = action.payload
      return {...current, interfaces: [...interfaces]}
    }
    case 'LOGS':
      const {alert} = action.payload
      return {...current, logs: [...current.logs, alert]}
    default:
      return current
  }
}

export const initialState: Code = {
  interfaces: Array.from({length: 11}, (_, i) => ({
    name: `ether${i + 1}`,
    address: '',
    gateway: '',
    bridge: false,
    pcc: false,
    wan: false
  })),
  logs: []
}

export default function CodeProvider({children}: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const interfaces = useCallback((interfaces: Ethernet[]) => {
    dispatch({type: 'INTERFACES', payload: {interfaces}})
  }, [])

  const logs = useCallback((logs: Log) => {
    dispatch({type: 'LOGS', payload: {alert: logs}})
  }, [])

  const value = useMemo(() => ({
    code: state,
    interfaces,
    logs
  }), [state])

  return (
    <CodeContext.Provider value={value}>
      {children}
    </CodeContext.Provider>
  )
}

export function useCode() {
  const context = useContext(CodeContext)

  if (context === undefined) {
    throw new Error('useCode must be used within a CodeProvider')
  }
  return context
}