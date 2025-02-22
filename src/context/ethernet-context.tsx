'use client'

import {createContext, ReactNode, useCallback, useContext, useMemo, useReducer} from "react";
import {Ethernet, Log} from "@/lib/types";

type EthernetAction =
  | { type: 'INTERFACES', payload: { interfaces: Ethernet[] } }
  | { type: 'LOGS', payload: { logs: Log } }

export type Route = { interfaces: Ethernet[], logs: Log[] }

type CodeContextType = {
  route: Route | undefined,
  interfaces: (interfaces: Ethernet[]) => void,
  logs: (alert: Log) => void
}

export const EthernetContext = createContext<CodeContextType | undefined>(undefined)

function reducer(code: Route | undefined, action: EthernetAction): Route {
  const current = code || initialState

  switch (action.type) {
    case 'INTERFACES': {
      const {interfaces} = action.payload
      return {...current, interfaces: [...interfaces]}
    }
    case 'LOGS':
      const {logs} = action.payload
      return {...current, logs: [...current.logs, logs]}
    default:
      return current
  }
}

export const initialState: Route = {
  interfaces: Array.from({length: 10}, (_, i) => ({
    name: `ether${i + 1}`,
    address: '',
    gateway: '',
    bridge: false,
    pcc: false,
    wan: false
  })),
  logs: []
}

export default function EthernetProvider({children}: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const interfaces = useCallback((interfaces: Ethernet[]) => {
    dispatch({type: 'INTERFACES', payload: {interfaces}})
  }, [])

  const logs = useCallback((logs: Log) => {
    dispatch({type: 'LOGS', payload: {logs: logs}})
  }, [])

  const value = useMemo(() => ({
    route: state,
    interfaces,
    logs
  }), [state])

  return (
    <EthernetContext.Provider value={value}>
      {children}
    </EthernetContext.Provider>
  )
}

export function useEthernet() {
  const context = useContext(EthernetContext)

  if (context === undefined) {
    throw new Error('useCode must be used within a CodeProvider')
  }
  return context
}