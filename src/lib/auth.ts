export async function verifyNetlifyToken(token: string): Promise<any> {
  try {
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

// Alias for backward compatibility
export const verifyToken = verifyNetlifyToken;
