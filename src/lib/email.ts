import nodemailer from "nodemailer"

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter

  console.log("[Email] Initializing SMTP transporter:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
  })

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    debug: true,
    logger: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  return transporter
}

/**
 * Send email verification to user after registration
 */
export async function sendVerificationEmail(data: {
  email: string
  name: string
  verificationToken: string
}) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify/${data.verificationToken}`

  const mailOptions = {
    from: `"TextFile SKBBK System" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "✅ Sahkan Email Anda - TextFile SKBBK",
    html: `
      <!DOCTYPE html>
      <html lang="ms">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; }
          .logo { width: 60px; height: 60px; background: white; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 16px; }
          .header h1 { color: white; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
          .header p { color: rgba(255,255,255,0.9); font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
          .message { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
          .button-container { text-align: center; margin: 32px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59,130,246,0.4); transition: transform 0.2s; }
          .button:hover { transform: translateY(-2px); }
          .url-text { font-size: 13px; color: #94a3b8; text-align: center; margin-top: 16px; word-break: break-all; }
          .info-box { background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .info-item:last-child { border-bottom: none; }
          .info-label { color: #64748b; font-size: 14px; }
          .info-value { color: #1e293b; font-weight: 600; font-size: 14px; }
          .warning-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 24px 0; }
          .warning-box p { color: #92400e; font-size: 14px; line-height: 1.6; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 30px; text-align: center; }
          .footer p { color: #94a3b8; font-size: 13px; line-height: 1.6; }
          .footer a { color: #3b82f6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo">T</div>
            <h1>TextFile SKBBK</h1>
            <p>Sistem Pengurusan Caruman Digital</p>
          </div>

          <!-- Content -->
          <div class="content">
            <p class="greeting">👋 Hi ${data.name}!</p>
            
            <p class="message">
              Terima kasih kerana mendaftar dengan <strong>TextFile SKBBK</strong>. 
              Untuk melengkapkan pendaftaran anda, sila sahkan alamat email anda dengan 
              mengklik butang di bawah:
            </p>

            <div class="button-container">
              <a href="${verificationUrl}" class="button">
                ✅ Sahkan Email Saya
              </a>
            </div>

            <p class="url-text">
              Atau salin dan tampal URL ini ke browser anda:<br>
              ${verificationUrl}
            </p>

            <div class="info-box">
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">${data.email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Tarikh Pendaftaran</span>
                <span class="info-value">${new Date().toLocaleDateString("ms-MY", { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>

            <div class="warning-box">
              <p>
                <strong>⚠️ Penting:</strong> Link pengesahan ini akan tamat dalam 
                <strong>24 jam</strong>. Jika anda tidak meminta pendaftaran ini, 
                sila abaikan email ini.
              </p>
            </div>

            <p class="message">
              Selepas pengesahan, anda akan mendapat akses kepada:
            </p>
            <ul style="color: #64748b; font-size: 15px; line-height: 1.8; padding-left: 20px;">
              <li>✅ Jana fail teks 278-aksara untuk PERKESO</li>
              <li>✅ Pengiraan automatik SKBBK</li>
              <li>✅ Urusan caruman majikan & pekerja</li>
              <li>✅ 30 hari percubaan percuma</li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>
              <strong>TextFile SKBBK SaaS</strong><br>
              Sistem Pengurusan Caruman Digital Malaysia<br><br>
              Ada soalan? Hubungi kami di 
              <a href="mailto:${process.env.SMTP_USER || 'admin@example.com'}">${process.env.SMTP_USER || 'admin@example.com'}</a> atau 
              <a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '60123456789'}">WhatsApp</a>
            </p>
            <p style="margin-top: 16px; font-size: 12px;">
              Ini adalah email automatik. Sila jangan balas email ini.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${data.name},

Terima kasih kerana mendaftar dengan TextFile SKBBK!

Sahkan email anda dengan klik link ini:
${verificationUrl}

Link ini akan tamat dalam 24 jam.

Jika anda tidak meminta pendaftaran ini, sila abaikan email ini.

---
TextFile SKBBK SaaS
Sistem Pengurusan Caruman Digital Malaysia
    `,
  }

  try {
    const info = await getTransporter().sendMail(mailOptions)
    console.log(`[Email] Verification email sent to: ${data.email}`, {
      messageId: info.messageId,
      rejected: info.rejected,
    })
    return { success: true }
  } catch (error: any) {
    console.error("[Email] Verification email failed:", {
      to: data.email,
      code: error.code,
      message: error.message,
      responseCode: error.responseCode,
      response: error.response,
      command: error.command,
    })
    return { success: false, error }
  }
}

/**
 * Send welcome email after verification is complete
 */
export async function sendWelcomeEmail(data: {
  email: string
  name: string
}) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`
  const billingUrl = `${process.env.NEXTAUTH_URL}/dashboard/billing`

  const mailOptions = {
    from: `"TextFile SKBBK System" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "🎉 Selamat Datang ke TextFile SKBBK!",
    html: `
      <!DOCTYPE html>
      <html lang="ms">
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
          .icon { width: 60px; height: 60px; background: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 16px; }
          .header h1 { color: white; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
          .header p { color: rgba(255,255,255,0.9); font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
          .message { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59,130,246,0.4); margin: 16px 0; }
          .features { background: #f1f5f9; border-radius: 12px; padding: 24px; margin: 24px 0; }
          .feature-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
          .feature-item:last-child { margin-bottom: 0; }
          .feature-icon { font-size: 20px; }
          .feature-text { color: #475569; font-size: 14px; line-height: 1.5; }
          .trial-box { background: #dbeafe; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .trial-box p { color: #1e40af; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
          .trial-box strong { color: #1e3a8a; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 30px; text-align: center; }
          .footer p { color: #94a3b8; font-size: 13px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">✓</div>
            <h1>Email Disahkan!</h1>
            <p>Akaun anda telah diaktifkan</p>
          </div>

          <div class="content">
            <p class="greeting">🎉 Tahniah ${data.name}!</p>
            
            <p class="message">
              Email anda telah berjaya disahkan. Akaun <strong>TextFile SKBBK</strong> 
              anda kini aktif dan sedia untuk digunakan!
            </p>

            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="button">
                🚀 Mula Sekarang
              </a>
            </div>

            <div class="features">
              <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 16px;">Apa yang anda dapat:</h3>
              <div class="feature-item">
                <span class="feature-icon">📄</span>
                <span class="feature-text">Jana fail teks 278-aksara untuk caruman PERKESO</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🧮</span>
                <span class="feature-text">Pengiraan automatik SOCSO, EIS & SKBBK</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">👥</span>
                <span class="feature-text">Urus rekod majikan dan pekerja</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span class="feature-text">Lihat sejarah caruman dan statistik</span>
              </div>
            </div>

            <div class="trial-box">
              <p>
                <strong>🎁 Percubaan Percuma 30 Hari</strong>
              </p>
              <p>
                Anda telah diberikan percubaan percuma selama 30 hari. 
                 Selepas tempoh percubaan, langganan adalah <strong>RM10/bulan</strong>.
              </p>
              <p style="margin-bottom: 0;">
                <a href="${billingUrl}" style="color: #1d4ed8; font-weight: 600;">Lihat butiran langganan →</a>
              </p>
            </div>

            <p class="message">
              Perlukan bantuan? Kami sedia membantu:
            </p>
            <ul style="color: #64748b; font-size: 15px; line-height: 1.8; padding-left: 20px;">
              <li>📧 Emel: ${process.env.SMTP_USER || 'admin@example.com'}</li>
              <li>📱 WhatsApp: +60 XX-XXX XXXX</li>
              <li>💬 Live chat dalam dashboard</li>
            </ul>
          </div>

          <div class="footer">
            <p>
              <strong>TextFile SKBBK SaaS</strong><br>
              Sistem Pengurusan Caruman Digital Malaysia<br><br>
              © ${new Date().getFullYear()} TextFile SKBBK. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Tahniah ${data.name}!

Email anda telah berjaya disahkan. Akaun TextFile SKBBK anda kini aktif!

Mula sekarang: ${dashboardUrl}

Anda mendapat percubaan percuma 30 hari. Selepas itu, langganan adalah RM10/bulan.

Perlukan bantuan?
- Emel: ${process.env.SMTP_USER || 'admin@example.com'}
- WhatsApp: +60 XX-XXX XXXX

---
TextFile SKBBK SaaS
Sistem Pengurusan Caruman Digital Malaysia
    `,
  }

  try {
    const info = await getTransporter().sendMail(mailOptions)
    console.log(`[Email] Welcome email sent to: ${data.email}`, {
      messageId: info.messageId,
      rejected: info.rejected,
    })
    return { success: true }
  } catch (error: any) {
    console.error("[Email] Welcome email failed:", {
      to: data.email,
      code: error.code,
      message: error.message,
      responseCode: error.responseCode,
      response: error.response,
      command: error.command,
    })
    return { success: false, error }
  }
}

/**
 * Send notification to admin when new user registers
 */
export async function sendAdminNotification(userData: {
  name: string
  email: string
  companyName?: string
  isVerified?: boolean
}) {
  const adminEmail = `${process.env.SMTP_USER || "admin@example.com"}`
  const verificationStatus = userData.isVerified ? "✅ Disahkan" : "⏳ Belum Disahkan"

  const mailOptions = {
    from: `"TextFile SKBBK System" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `🔔 Pendaftaran Baru: ${userData.email}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">📋 Pendaftaran Pengguna Baru</h2>
        <p>Halo Admin,</p>
        <p>Seorang pengguna baru telah mendaftar di platform TextFile SKBBK-SaaS.</p>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Nama:</strong> ${userData.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${userData.email}</p>
          <p style="margin: 5px 0;"><strong>Syarikat:</strong> ${userData.companyName || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Status Email:</strong> ${verificationStatus}</p>
          <p style="margin: 5px 0;"><strong>Tarikh:</strong> ${new Date().toLocaleString("ms-MY")}</p>
        </div>

        <p>Sila log masuk ke <a href="${process.env.NEXTAUTH_URL}/admin/users" style="color: #2563eb; text-decoration: none; font-weight: bold;">Panel Admin</a> untuk menguruskan akses pengguna ini.</p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">Ini adalah email automatik. Sila jangan balas email ini.</p>
      </div>
    `,
  }

  try {
    const info = await getTransporter().sendMail(mailOptions)
    console.log(`[Email] Admin notification sent for: ${userData.email}`, {
      messageId: info.messageId,
      rejected: info.rejected,
    })
    return { success: true }
  } catch (error: any) {
    console.error("[Email] Admin notification failed:", {
      user: userData.email,
      adminTo: adminEmail,
      code: error.code,
      message: error.message,
      responseCode: error.responseCode,
      response: error.response,
      command: error.command,
    })
    return { success: false, error }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: {
  email: string
  name: string
  resetUrl: string
}) {
  const mailOptions = {
    from: `"TextFile SKBBK System" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "🔑 Reset Password - TextFile SKBBK",
    html: `
      <!DOCTYPE html>
      <html lang="ms">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center; }
          .icon { width: 60px; height: 60px; background: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px; }
          .header h1 { color: white; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
          .header p { color: rgba(255,255,255,0.9); font-size: 14px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
          .message { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
          .button-container { text-align: center; margin: 32px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(245,158,11,0.4); transition: transform 0.2s; }
          .button:hover { transform: translateY(-2px); }
          .url-text { font-size: 13px; color: #94a3b8; text-align: center; margin-top: 16px; word-break: break-all; }
          .warning-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 24px 0; }
          .warning-box p { color: #92400e; font-size: 14px; line-height: 1.6; }
          .security-box { background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .security-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
          .security-item:last-child { margin-bottom: 0; }
          .security-icon { font-size: 18px; }
          .security-text { color: #475569; font-size: 14px; line-height: 1.5; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 30px; text-align: center; }
          .footer p { color: #94a3b8; font-size: 13px; line-height: 1.6; }
          .footer a { color: #3b82f6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="icon">🔑</div>
            <h1>Reset Password</h1>
            <p>TextFile SKBBK</p>
          </div>

          <!-- Content -->
          <div class="content">
            <p class="greeting">👋 Hi ${data.name}!</p>

            <p class="message">
              Kami menerima permintaan untuk reset password akaun <strong>TextFile SKBBK</strong> anda.
              Klik butang di bawah untuk menetapkan password baru:
            </p>

            <div class="button-container">
              <a href="${data.resetUrl}" class="button">
                🔑 Reset Password Saya
              </a>
            </div>

            <p class="url-text">
              Atau salin dan tampal URL ini ke browser anda:<br>
              ${data.resetUrl}
            </p>

            <div class="security-box">
              <div class="security-item">
                <span class="security-icon">⏰</span>
                <span class="security-text">
                  <strong>Tempoh sah:</strong> Link ini akan tamat dalam <strong>1 jam</strong>
                </span>
              </div>
              <div class="security-item">
                <span class="security-icon">🔒</span>
                <span class="security-text">
                  <strong>Keamanan:</strong> Password lama akan ditukar selepas reset
                </span>
              </div>
              <div class="security-item">
                <span class="security-icon">🛡️</span>
                <span class="security-text">
                  <strong>Privasi:</strong> Token reset adalah unik dan hanya boleh digunakan sekali
                </span>
              </div>
            </div>

            <div class="warning-box">
              <p>
                <strong>⚠️ Tidak meminta reset?</strong><br>
                Jika anda tidak meminta reset password, sila abaikan email ini.
                Password anda akan kekal sama dan tiada tindakan lanjut diperlukan.
              </p>
            </div>

            <p class="message">
              Untuk keselamatan akaun anda:
            </p>
            <ul style="color: #64748b; font-size: 15px; line-height: 1.8; padding-left: 20px;">
              <li>✅ Gunakan password yang unik (tidak digunakan di tempat lain)</li>
              <li>✅ Minimum 8 karakter dengan kombinasi huruf, nombor & simbol</li>
              <li>✅ Jangan kongsi password dengan sesiapa</li>
              <li>✅ Log keluar dari peranti yang tidak dikenali</li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>
              <strong>TextFile SKBBK SaaS</strong><br>
              Sistem Pengurusan Caruman Digital Malaysia<br><br>
              Ada soalan? Hubungi kami di
              <a href="mailto:${process.env.SMTP_USER || 'admin@example.com'}">${process.env.SMTP_USER || 'admin@example.com'}</a> atau
              <a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '60123456789'}">WhatsApp</a>
            </p>
            <p style="margin-top: 16px; font-size: 12px;">
              Ini adalah email automatik. Sila jangan balas email ini.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${data.name},

Kami menerima permintaan untuk reset password akaun TextFile SKBBK anda.

Reset password anda dengan klik link ini:
${data.resetUrl}

Link ini akan tamat dalam 1 jam.

Jika anda tidak meminta reset password, sila abaikan email ini. Password anda akan kekal sama.

---
TextFile SKBBK SaaS
Sistem Pengurusan Caruman Digital Malaysia
    `,
  }

  try {
    const info = await getTransporter().sendMail(mailOptions)
    console.log(`[Email] Password reset email sent to: ${data.email}`, {
      messageId: info.messageId,
      rejected: info.rejected,
    })
    return { success: true }
  } catch (error: any) {
    console.error("[Email] Password reset email failed:", {
      to: data.email,
      code: error.code,
      message: error.message,
      responseCode: error.responseCode,
      response: error.response,
      command: error.command,
    })
    return { success: false, error }
  }
}
