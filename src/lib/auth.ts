export async function verifyNetlifyToken(token: string): Promise<any> {
  try {
    // Decode JWT without verification for basic validation
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    if (payload.exp && Date.now() / 1000 > payload.exp) return null
    if (!payload.sub || !payload.email) return null
    return payload
  } catch (error) {
    return null
  }
}
