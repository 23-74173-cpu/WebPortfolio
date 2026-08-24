import { createContext, useContext } from 'react'

export const PaletteContext = createContext(null)

export function usePalette() {
  return useContext(PaletteContext)
}