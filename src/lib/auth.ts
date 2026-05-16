import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function verifyAdminSession(): Promise<boolean> {
    try {
          const session = await getServerSession(authOptions);
          return !!session?.user;
    } catch {
          return false;
    }
}

// Backward compatibility alias
export const verifyToken = verifyAdminSession;
export const verifyNetlifyToken = verifyAdminSession;
