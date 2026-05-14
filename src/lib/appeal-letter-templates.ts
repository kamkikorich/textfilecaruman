/**
 * Appeal Letter Templates for PERKESO Rayuan
 * Returns formatted HTML for each letter type
 */

interface LetterData {
  companyName: string
  employerCode: string
  companyAddress?: string
  companyCity?: string
  companyState?: string
  companyPostcode?: string
  penaltyAmount: string
  penaltyPeriod: string
  reason: string
  customReason?: string
  currentDate: string
}

function formatRM(amount: string): string {
  const num = parseFloat(amount)
  return `RM${num.toLocaleString("ms-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function getReasonText(reason: string, customReason?: string): string {
  const reasons: Record<string, string> = {
    "kewangan": "Syarikat sedang menghadapi masalah kewangan sementara akibat kelewatan menerima bayaran dari pelanggan.",
    "teknikal": "Terdapat masalah teknikal dalam sistem semasa tempoh caruman yang menyebabkan kelewatan pembayaran.",
    "kesilapan": "Terdapat kesilapan tidak sengaja dalam pengiraan caruman bagi tempoh tersebut.",
    "staff": "Pegawai yang bertanggungjawab telah cuti sakit/meletak jawatan secara tiba-tiba.",
    "lain-lain": customReason || "Sebab-sebab yang di luar kawalan pihak majikan.",
  }
  return reasons[reason] || reasons["lain-lain"]
}

export function generateFaedahTemplate(data: LetterData): string {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 25mm; }
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #000; max-width: 170mm; margin: 0 auto; }
  .header { text-align: right; margin-bottom: 20px; }
  .company-name { font-size: 14pt; font-weight: bold; }
  .company-info { font-size: 10pt; color: #333; }
  .recipient { margin: 20px 0; }
  .recipient-line { margin: 2px 0; }
  .ref-date { display: flex; justify-content: space-between; margin: 15px 0; }
  .subject { text-align: center; font-weight: bold; text-decoration: underline; margin: 20px 0; font-size: 13pt; }
  .content { text-align: justify; margin: 10px 0; }
  .highlight { font-weight: bold; }
  .table-penalty { width: 100%; border-collapse: collapse; margin: 15px 0; }
  .table-penalty th, .table-penalty td { border: 1px solid #000; padding: 8px; text-align: left; }
  .table-penalty th { background-color: #f0f0f0; }
  .closing { margin: 20px 0; }
  .signature { margin-top: 40px; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72pt; color: rgba(255, 0, 0, 0.08); font-weight: bold; pointer-events: none; z-index: 0; }
  @media print { .no-print { display: none; } }
</style>
</head>
<body>

${data.currentDate ? `<div class="watermark">BELUM DIBAYAR</div>` : ""}

<div class="header">
  <div class="company-name">${data.companyName}</div>
  <div class="company-info">Kod Majikan: ${data.employerCode}</div>
  ${data.companyAddress ? `<div class="company-info">${data.companyAddress}</div>` : ""}
  ${data.companyCity ? `<div class="company-info">${data.companyCity}${data.companyState ? `, ${data.companyState}` : ""}${data.companyPostcode ? ` ${data.companyPostcode}` : ""}</div>` : ""}
</div>

<div class="recipient">
  <div class="recipient-line"><strong>Pejabat PERKESO</strong></div>
  <div class="recipient-line">Cawangan Berkenaan</div>
</div>

<div class="ref-date">
  <span>Rujukan: ${data.employerCode}/RAYUAN/${new Date().getFullYear()}</span>
  <span>Tarikh: ${data.currentDate || new Date().toLocaleDateString("ms-MY", { day: "numeric", month: "long", year: "numeric" })}</span>
</div>

<div class="subject">PERKARA: RAYUAN PENANGGUHAN / PENGURANGAN FAEDAH KEWANGAN (LEWAT BAYAR) CARUMAN SOCSO DAN EIS</div>

<div class="content">
  <p>Dengan segala hormatnya, perkara di atas adalah dirujuk.</p>

  <p>2. Pihak kami, <span class="highlight">${data.companyName}</span> (Kod Majikan: <span class="highlight">${data.employerCode}</span>), dengan ini ingin membuat rayuan rasmi bagi penangguhan atau pengurangan faedah kewangan (denda lewat bayar) atas caruman SOCSO dan EIS untuk tempoh <span class="highlight">${data.penaltyPeriod}</span> berjumlah <span class="highlight">${formatRM(data.penaltyAmount)}</span>.</p>

  <p>3. Kelewatan pembayaran ini adalah berpunca daripada:</p>
  <blockquote>${getReasonText(data.reason, data.customReason)}</blockquote>

  <p>4. Pihak kami ingin menegaskan bahawa kelewatan ini adalah <strong>tidak disengajakan</strong> dan pihak kami komited untuk mematuhi segala kewajipan di bawah Akta Keselamatan Sosial Pekerja 1969 dan Akta Insurans Pekerjaan 1951.</p>

  <p>5. Sehubungan dengan itu, pihak kami dengan rendah diri memohon agar PERKESO dapat mempertimbangkan rayuan ini dengan penuh sabar dan simpati. Segala perhatian dan pertimbangan pihak PERKESO didahului dengan ucapan ribuan terima kasih.</p>

  <p>6. Bersama-sama surat ini, kami lampirkan dokumen sokongan untuk rujukan pihak tuan/puan.</p>

  <p>Sekian, terima kasih.</p>
</div>

<div class="closing">
  <p><strong>"BERKHIDMAT UNTUK NEGARA"</strong></p>
</div>

<div class="signature">
  <p>Yang benar,</p>
  <br><br>
  <p>..................................................</p>
  <p>(Nama Tandatangan)</p>
  <p>Jawatan</p>
  <p>${data.companyName}</p>
</div>

</body>
</html>`
}

export function generateKompaunTemplate(data: LetterData): string {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 25mm; }
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #000; max-width: 170mm; margin: 0 auto; }
  .header { text-align: right; margin-bottom: 20px; }
  .company-name { font-size: 14pt; font-weight: bold; }
  .company-info { font-size: 10pt; color: #333; }
  .recipient { margin: 20px 0; }
  .recipient-line { margin: 2px 0; }
  .ref-date { display: flex; justify-content: space-between; margin: 15px 0; }
  .subject { text-align: center; font-weight: bold; text-decoration: underline; margin: 20px 0; font-size: 13pt; }
  .content { text-align: justify; margin: 10px 0; }
  .highlight { font-weight: bold; }
  .closing { margin: 20px 0; }
  .signature { margin-top: 40px; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72pt; color: rgba(255, 0, 0, 0.08); font-weight: bold; pointer-events: none; z-index: 0; }
  @media print { .no-print { display: none; } }
</style>
</head>
<body>

<div class="watermark">BELUM DIBAYAR</div>

<div class="header">
  <div class="company-name">${data.companyName}</div>
  <div class="company-info">Kod Majikan: ${data.employerCode}</div>
  ${data.companyAddress ? `<div class="company-info">${data.companyAddress}</div>` : ""}
  ${data.companyCity ? `<div class="company-info">${data.companyCity}${data.companyState ? `, ${data.companyState}` : ""}${data.companyPostcode ? ` ${data.companyPostcode}` : ""}</div>` : ""}
</div>

<div class="recipient">
  <div class="recipient-line"><strong>Pejabat PERKESO</strong></div>
  <div class="recipient-line">Cawangan Berkenaan</div>
</div>

<div class="ref-date">
  <span>Rujukan: ${data.employerCode}/RAYUAN-KOMPAUN/${new Date().getFullYear()}</span>
  <span>Tarikh: ${data.currentDate || new Date().toLocaleDateString("ms-MY", { day: "numeric", month: "long", year: "numeric" })}</span>
</div>

<div class="subject">PERKARA: RAYUAN PENGURANGAN / PENANGGUHAN KOMPAUN DI BAWAH AKTA KESELAMATAN SOSPEKERJA 1969</div>

<div class="content">
  <p>Dengan segala hormatnya, perkara di atas adalah dirujuk.</p>

  <p>2. Pihak kami, <span class="highlight">${data.companyName}</span> (Kod Majikan: <span class="highlight">${data.employerCode}</span>), dengan ini ingin membuat rayuan rasmi bagi pengurangan atau penangguhan kompaun yang dikenakan berjumlah <span class="highlight">${formatRM(data.penaltyAmount)}</span> bagi tempoh <span class="highlight">${data.penaltyPeriod}</span>.</p>

  <p>3. Kami acknowledges bahawa pihak kami telah gagal mematuhi peruntukan di bawah Akta Keselamatan Sosial Pekerja 1969. Walau bagaimanapun, kegagalan ini adalah disebabkan:</p>
  <blockquote>${getReasonText(data.reason, data.customReason)}</blockquote>

  <p>4. Pihak kami ingin menegaskan bahawa:</p>
  <ul>
    <li>Kegagalan ini adalah <strong>tidak disengajakan</strong> dan bukan atas kecuaian yang serius.</li>
    <li>Pihak kami sentiasa komited untuk mematuhi segala kewajipan di bawah akta tersebut.</li>
    <li>Pihak kami telah mengambil langkah-langkah pembetulan untuk memastikan perkara ini tidak berulang.</li>
  </ul>

  <p>5. Sehubungan dengan itu, pihak kami dengan rendah diri memohon agar PERKESO dapat mempertimbangkan rayuan ini dengan penuh sabar dan simpati. Kompaun yang dikenakan akan memberi kesan kewangan yang ketara kepada operasi syarikat kami.</p>

  <p>6. Bersama-sama surat ini, kami lampirkan dokumen sokongan untuk rujukan pihak tuan/puan.</p>

  <p>Sekian, terima kasih.</p>
</div>

<div class="closing">
  <p><strong>"BERKHIDMAT UNTUK NEGARA"</strong></p>
</div>

<div class="signature">
  <p>Yang benar,</p>
  <br><br>
  <p>..................................................</p>
  <p>(Nama Tandatangan)</p>
  <p>Jawatan</p>
  <p>${data.companyName}</p>
</div>

</body>
</html>`
}

export function getTemplate(type: string, data: LetterData): string {
  switch (type) {
    case "faedah":
      return generateFaedahTemplate(data)
    case "kompaun":
      return generateKompaunTemplate(data)
    default:
      throw new Error(`Unknown letter type: ${type}`)
  }
}
