'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    netlifyIdentity: any
  }
}

export default function NetlifyIdentityInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('netlify-identity-widget').then((netlifyIdentity) => {
        netlifyIdentity.default.init({
          APIUrl: process.env.NEXT_PUBLIC_NETLIFY_IDENTITY_URL || undefined,
        })
        window.netlifyIdentity = netlifyIdentity.default
      }).catch(console.error)
    }
  }, [])

  return null
}
