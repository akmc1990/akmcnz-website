import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@akmcnz.org';

export async function POST(request: NextRequest) {
    try {
          const { name, email, address, phone, message } = await request.json();

          if (!name || !email || !message) {
                  return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
                }

          const resendApiKey = process.env.RESEND_API_KEY;

          if (resendApiKey) {
                  const res = await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                        'Authorization': `Bearer ${resendApiKey}`,
                                        'Content-Type': 'application/json',
                                      },
                            body: JSON.stringify({
                                                            from: 'onboarding@resend.dev',
                                        to: [ADMIN_EMAIL],
                                        reply_to: email,
                                        subject: `[문의하기] ${name}님의 문의`,
                                        html: `<h2>새 문의</h2><p><strong>성함:</strong> ${name}</p><p><strong>이메일:</strong> ${email}</p>${address ? `<p><strong>주소:</strong> ${address}</p>` : ''}${phone ? `<p><strong>전화:</strong> ${phone}</p>` : ''}<p><strong>내용:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
                                      }),
                          });

                  if (!res.ok) {
                            console.error('Email send error:', await res.text());
                            return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
                          }
                } else {
                  console.log(`[Contact] From: ${name} <${email}> -> To: ${ADMIN_EMAIL}`);
                  console.log(`[Contact] Message: ${message}`);
                }

          return NextResponse.json({ success: true });
        } catch (error) {
          console.error('Contact API error:', error);
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
  }
