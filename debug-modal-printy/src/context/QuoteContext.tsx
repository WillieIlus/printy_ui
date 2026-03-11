import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { QuoteItem } from '../types'

interface QuoteContextType {
  items: QuoteItem[]
  addItem: (item: Omit<QuoteItem, 'id'>) => void
  removeItem: (id: string) => void
  clearQuote: () => void
  itemCount: number
}

const QuoteContext = createContext<QuoteContextType | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])

  const addItem = useCallback((item: Omit<QuoteItem, 'id'>) => {
    const id = `qi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setItems(prev => [...prev, { ...item, id }])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearQuote = useCallback(() => setItems([]), [])

  return (
    <QuoteContext.Provider value={{ items, addItem, removeItem, clearQuote, itemCount: items.length }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider')
  return ctx
}
