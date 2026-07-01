import type React from 'react'
import { createContext, useContext } from 'react'

const PathCtx = createContext<string>('')

export function FormPathProvider({
  prefix,
  children,
}: {
  prefix: string
  children: React.ReactNode
}) {
  return <PathCtx.Provider value={prefix}>{children}</PathCtx.Provider>
}

export function usePathName(name: string) {
  const prefix = useContext(PathCtx)
  return prefix ? `${prefix}.${name}` : name
}
