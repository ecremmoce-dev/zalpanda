import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Supplier {
  id: number
  supplyname?: string
  managername?: string
  created?: string
  companyid?: string
}

interface SupplierState {
  selectedSupplier: Supplier | null
  setSelectedSupplier: (supplier: Supplier | null) => void
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      selectedSupplier: null,
      setSelectedSupplier: (supplier) => set({ selectedSupplier: supplier }),
    }),
    {
      name: 'supplier-storage', // localStorage에 저장될 키 이름
    }
  )
) 