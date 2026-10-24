'use client'

import { useEffect } from 'react'
import { initHeronSignal } from '@heronsignal/web'

export function HeronSignalProvider() {
  useEffect(() => {
    void initHeronSignal({ publicKey: 'pk_dSrC6lnKvNFN9arrAC5KJ2VOnDzKqK1i' })
  }, [])

  return null
}
