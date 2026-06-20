import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const emails = process.env.ALLOWED_ADMIN_EMAILS
    ? process.env.ALLOWED_ADMIN_EMAILS.split(',').map((e) => e.trim()).filter(Boolean)
    : ['gungsan0@gmail.com'];
  return NextResponse.json({ emails });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const vercelToken = process.env.VERCEL_ACCESS_TOKEN;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID;
  if (!vercelToken || !vercelProjectId) {
    return NextResponse.json({ error: 'VERCEL_ACCESS_TOKEN or VERCEL_PROJECT_ID not set' }, { status: 500 });
  }
  const { emails } = await request.json();
  if (!Array.isArray(emails)) {
    return NextResponse.json({ error: 'emails must be an array' }, { status: 400 });
  }
  const newValue = emails.map((e: string) => e.trim()).filter(Boolean).join(',');
  const listRes = await fetch(
    `https://api.vercel.com/v9/projects/${vercelProjectId}/env`,
    { headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' } }
  );
  if (!listRes.ok) {
    const err = await listRes.text();
    return NextResponse.json({ error: 'Vercel API error: ' + err }, { status: 500 });
  }
  const listData = await listRes.json();
  const envVars: { id: string; key: string }[] = listData.envs || [];
  const existing = envVars.find((e) => e.key === 'ALLOWED_ADMIN_EMAILS');
  let updateRes;
  if (existing) {
    updateRes = await fetch(
      `https://api.vercel.com/v9/projects/${vercelProjectId}/env/${existing.id}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue }),
      }
    );
  } else {
    updateRes = await fetch(
      `https://api.vercel.com/v10/projects/${vercelProjectId}/env`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'ALLOWED_ADMIN_EMAILS', value: newValue, type: 'encrypted', target: ['production', 'preview'] }),
      }
    );
  }
  if (!updateRes.ok) {
    const err = await updateRes.text();
    return NextResponse.json({ error: 'Vercel update failed: ' + err }, { status: 500 });
  }
  return NextResponse.json({
    success: true,
    message: '관리자 이메일이 업데이트되었습니다. 변경사항은 다음 배포 시 적용됩니다.',
    emails: emails.map((e: string) => e.trim()).filter(Boolean),
  });
          }
