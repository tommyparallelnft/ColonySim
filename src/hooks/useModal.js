import { useState, useCallback } from 'react'

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState(null)

  const openModal = useCallback((data) => {
    setModalData(data)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setModalData(null)
  }, [])

  return {
    isOpen,
    modalData,
    openModal,
    closeModal
  }
}

