/**
 * Logik Pengiraan Caruman PERKESO
 * Ported dari Google Apps Script asal (D:\TextFileSKBBK\Index.html)
 *
 * Jadual Caruman Bersepadu PERKESO (Lampiran 1 - SKBBK Fasa 1)
 * Format CT: [GajiMin, JP_Majikan, JP_Pekerja, SKBBK_Pekerja, JK_Majikan, JK_SKBBK, EIS_Majikan, EIS_Pekerja]
 */

export const CT: number[][] = [
  [0, 0.40, 0.10, 0.20, 0.30, 0.20, 0.05, 0.05],
  [30.01, 0.70, 0.20, 0.30, 0.50, 0.30, 0.10, 0.10],
  [50.01, 1.10, 0.30, 0.50, 0.80, 0.50, 0.15, 0.15],
  [70.01, 1.50, 0.40, 0.65, 1.10, 0.65, 0.20, 0.20],
  [100.01, 2.10, 0.60, 0.90, 1.50, 0.90, 0.25, 0.25],
  [140.01, 2.95, 0.85, 1.25, 2.10, 1.25, 0.35, 0.35],
  [200.01, 4.35, 1.25, 1.85, 3.10, 1.85, 0.50, 0.50],
  [300.01, 6.15, 1.75, 2.65, 4.40, 2.65, 0.70, 0.70],
  [400.01, 7.85, 2.25, 3.35, 5.60, 3.35, 0.90, 0.90],
  [500.01, 9.65, 2.75, 4.15, 6.90, 4.15, 1.10, 1.10],
  [600.01, 11.35, 3.25, 4.85, 8.10, 4.85, 1.30, 1.30],
  [700.01, 13.15, 3.75, 5.65, 9.40, 5.65, 1.50, 1.50],
  [800.01, 14.85, 4.25, 6.35, 10.60, 6.35, 1.70, 1.70],
  [900.01, 16.65, 4.75, 7.15, 11.90, 7.15, 1.90, 1.90],
  [1000.01, 18.35, 5.25, 7.85, 13.10, 7.85, 2.10, 2.10],
  [1100.01, 20.15, 5.75, 8.65, 14.40, 8.65, 2.30, 2.30],
  [1200.01, 21.85, 6.25, 9.35, 15.60, 9.35, 2.50, 2.50],
  [1300.01, 23.65, 6.75, 10.15, 16.90, 10.15, 2.70, 2.70],
  [1400.01, 25.35, 7.25, 10.85, 18.10, 10.85, 2.90, 2.90],
  [1500.01, 27.15, 7.75, 11.65, 19.40, 11.65, 3.10, 3.10],
  [1600.01, 28.85, 8.25, 12.35, 20.60, 12.35, 3.30, 3.30],
  [1700.01, 30.65, 8.75, 13.15, 21.90, 13.15, 3.50, 3.50],
  [1800.01, 32.35, 9.25, 13.85, 23.10, 13.85, 3.70, 3.70],
  [1900.01, 34.15, 9.75, 14.65, 24.40, 14.65, 3.90, 3.90],
  [2000.01, 35.85, 10.25, 15.35, 25.60, 15.35, 4.10, 4.10],
  [2100.01, 37.65, 10.75, 16.15, 26.90, 16.15, 4.30, 4.30],
  [2200.01, 39.35, 11.25, 16.85, 28.10, 16.85, 4.50, 4.50],
  [2300.01, 41.15, 11.75, 17.65, 29.40, 17.65, 4.70, 4.70],
  [2400.01, 42.85, 12.25, 18.35, 30.60, 18.35, 4.90, 4.90],
  [2500.01, 44.65, 12.75, 19.15, 31.90, 19.15, 5.10, 5.10],
  [2600.01, 46.35, 13.25, 19.85, 33.10, 19.85, 5.30, 5.30],
  [2700.01, 48.15, 13.75, 20.65, 34.40, 20.65, 5.50, 5.50],
  [2800.01, 49.85, 14.25, 21.35, 35.60, 21.35, 5.70, 5.70],
  [2900.01, 51.65, 14.75, 22.15, 36.90, 22.15, 5.90, 5.90],
  [3000.01, 53.35, 15.25, 22.85, 38.10, 22.85, 6.10, 6.10],
  [3100.01, 55.15, 15.75, 23.65, 39.40, 23.65, 6.30, 6.30],
  [3200.01, 56.85, 16.25, 24.35, 40.60, 24.35, 6.50, 6.50],
  [3300.01, 58.65, 16.75, 25.15, 41.90, 25.15, 6.70, 6.70],
  [3400.01, 60.35, 17.25, 25.85, 43.10, 25.85, 6.90, 6.90],
  [3500.01, 62.15, 17.75, 26.65, 44.40, 26.65, 7.10, 7.10],
  [3600.01, 63.85, 18.25, 27.35, 45.60, 27.35, 7.30, 7.30],
  [3700.01, 65.65, 18.75, 28.15, 46.90, 28.15, 7.50, 7.50],
  [3800.01, 67.35, 19.25, 28.85, 48.10, 28.85, 7.70, 7.70],
  [3900.01, 69.15, 19.75, 29.65, 49.40, 29.65, 7.90, 7.90],
  [4000.01, 70.85, 20.25, 30.35, 50.60, 30.35, 8.10, 8.10],
  [4100.01, 72.65, 20.75, 31.15, 51.90, 31.15, 8.30, 8.30],
  [4200.01, 74.35, 21.25, 31.85, 53.10, 31.85, 8.50, 8.50],
  [4300.01, 76.15, 21.75, 32.65, 54.40, 32.65, 8.70, 8.70],
  [4400.01, 77.85, 22.25, 33.35, 55.60, 33.35, 8.90, 8.90],
  [4500.01, 79.65, 22.75, 34.15, 56.90, 34.15, 9.10, 9.10],
  [4600.01, 81.35, 23.25, 34.85, 58.10, 34.85, 9.30, 9.30],
  [4700.01, 83.15, 23.75, 35.65, 59.40, 35.65, 9.50, 9.50],
  [4800.01, 84.85, 24.25, 36.35, 60.60, 36.35, 9.70, 9.70],
  [4900.01, 86.65, 24.75, 37.15, 61.90, 37.15, 9.90, 9.90],
  [5000.01, 88.35, 25.25, 37.85, 63.10, 37.85, 10.10, 10.10],
  [5100.01, 90.15, 25.75, 38.65, 64.40, 38.65, 10.30, 10.30],
  [5200.01, 91.85, 26.25, 39.35, 65.60, 39.35, 10.50, 10.50],
  [5300.01, 93.65, 26.75, 40.15, 66.90, 40.15, 10.70, 10.70],
  [5400.01, 95.35, 27.25, 40.85, 68.10, 40.85, 10.90, 10.90],
  [5500.01, 97.15, 27.75, 41.65, 69.40, 41.65, 11.10, 11.10],
  [5600.01, 98.85, 28.25, 42.35, 70.60, 42.35, 11.30, 11.30],
  [5700.01, 100.65, 28.75, 43.15, 71.90, 43.15, 11.50, 11.50],
  [5800.01, 102.35, 29.25, 43.85, 73.10, 43.85, 11.70, 11.70],
  [5900.01, 104.15, 29.75, 44.65, 74.40, 44.65, 11.90, 11.90],
  [6000.01, 104.15, 29.75, 44.65, 74.40, 44.65, 11.90, 11.90],
];

export interface ContributionLookup {
  jp_se: number; // Jenis Pertama Majikan
  jp_ss: number; // Jenis Pertama Pekerja
  skbbk: number; // SKBBK Pekerja
  jk_se: number; // Jenis Kedua Majikan
  jk_skbbk: number; // Jenis Kedua SKBBK
  ee: number; // EIS Majikan
  es: number; // EIS Pekerja
}

export interface SkbbkInfo {
  rate: number;
  phase: string;
  label: string;
}

export interface CalculatedRow {
  socsoEmployer: number;
  socsoEmployee: number;
  eisEmployer: number;
  eisEmployee: number;
  skbbkEmployee: number;
  totalEmployer: number;
  totalEmployee: number;
}

/**
 * Cari kadar caruman berasaskan gaji
 */
export function lookupContribution(salary: number): ContributionLookup {
  const s = Math.min(salary || 0, 6000.01);
  for (let i = CT.length - 1; i >= 0; i--) {
    if (s >= CT[i][0]) {
      return {
        jp_se: CT[i][1],
        jp_ss: CT[i][2],
        skbbk: CT[i][3],
        jk_se: CT[i][4],
        jk_skbbk: CT[i][5],
        ee: CT[i][6],
        es: CT[i][7],
      };
    }
  }
  return { jp_se: 0, jp_ss: 0, skbbk: 0, jk_se: 0, jk_skbbk: 0, ee: 0, es: 0 };
}

/**
 * Dapatkan kadar SKBBK berasaskan bulan/tahun
 */
export function getSkbbkRate(month: number, year: number): SkbbkInfo {
  const dt = new Date(year, month - 1, 1);
  const phase1Start = new Date(2026, 5, 1); // Jun 2026
  const phase2Start = new Date(2028, 5, 1); // Jun 2028
  const phase3Start = new Date(2031, 5, 1); // Jun 2031

  if (dt < phase1Start) {
    return { rate: 0, phase: "Tiada", label: "Tiada SKBBK" };
  }
  if (dt >= phase3Start) {
    return { rate: 0.0125, phase: "Fasa 3", label: "SKBBK 1.25%" };
  }
  if (dt >= phase2Start) {
    return { rate: 0.01, phase: "Fasa 2", label: "SKBBK 1.00%" };
  }
  return { rate: 0.0075, phase: "Fasa 1", label: "SKBBK 0.75%" };
}

/**
 * Kira caruman untuk satu pekerja
 */
export function calculateContribution(
  salary: number,
  age: number,
  category: string,
  isEnteredAfter55: boolean,
  isEisNoContribution57: boolean,
  isForeign: boolean,
  month: number,
  year: number
): CalculatedRow {
  const base = lookupContribution(salary);

  // Penentuan Jenis berdasarkan UMUR + syarat (Akta 4)
  const isJenisKedua = age >= 60 || category === "JENIS2" || isEnteredAfter55;

  // Akta 4 - SOCSO
  let socsoEmpl: number, socsoEmp: number;
  if (isJenisKedua) {
    socsoEmpl = base.jk_se;
    socsoEmp = 0;
  } else {
    socsoEmpl = base.jp_se;
    socsoEmp = base.jp_ss;
  }

  // Akta 800 - EIS: Umur 18-59, Warganegara sahaja, KECUALI umur 57+ tanpa caruman EIS sebelum itu
  let eisEmpl = base.ee;
  let eisEmp = base.es;
  if (age < 18 || age >= 60 || isEisNoContribution57 || isForeign) {
    eisEmpl = 0;
    eisEmp = 0;
  }

  // SKBBK - Jadual bersepadu Lampiran 1
  const skbbkInfo = getSkbbkRate(month, year);
  let skbbk = skbbkInfo.rate === 0 ? 0 : (isJenisKedua ? base.jk_skbbk : base.skbbk);

  return {
    socsoEmployer: socsoEmpl,
    socsoEmployee: socsoEmp,
    eisEmployer: eisEmpl,
    eisEmployee: eisEmp,
    skbbkEmployee: skbbk,
    totalEmployer: socsoEmpl + eisEmpl,
    totalEmployee: socsoEmp + eisEmp + skbbk,
  };
}

/**
 * Format satu baris rekod 278 aksara
 * Berdasarkan format PERKESO rasmi: https://www.perkeso.gov.my/images/borang/lindung24jam/formatteksfail.pdf
 * 
 * Layout:
 *  Pos  1-12  : Kod Majikan (12 chars, kiri, ruang)
 *  Pos 13-32  : Kosong (20 ruang)
 *  Pos 33-44  : No. IC/Passport (12 chars, kiri, ruang)
 *  Pos 45-194 : Nama Pekerja (150 chars, kiri, ruang, UPPERCASE)
 *  Pos 195-200: Bulan/Tahun MMYYYY (6 chars)
 *  Pos 201-214: Gaji dalam sen (14 chars, kanan, ruang)
 *  Pos 215-220: SOCSO Majikan dalam sen (6 chars, kanan, ruang)
 *  Pos 221-226: SOCSO Pekerja dalam sen (6 chars, kanan, ruang)
 *  Pos 227-232: EIS Majikan dalam sen (6 chars, kanan, ruang)
 *  Pos 233-238: EIS Pekerja dalam sen (6 chars, kanan, ruang)
 *  Pos 239-244: SKBBK dalam sen (6 chars, kanan, ruang)
 *  Pos 245-278: Kosong (34 ruang)
 *  Total: 278 chars + CRLF
 */
export function format278(
  empCode: string,
  ic: string,
  name: string,
  monthYear: string,
  salary: number,
  socsoEmpl: number,
  socsoEmp: number,
  eisEmpl: number,
  eisEmp: number,
  skbbk: number
): string {
  // Pos 1-12: Kod Majikan
  const p1 = String(empCode || "").padEnd(12, " ").substring(0, 12);
  // Pos 13-32: 20 ruang kosong
  const p2 = "".padEnd(20, " ");
  // Pos 33-44: No. IC (12 chars, kiri)
  const p3 = String(ic || "").padEnd(12, " ").substring(0, 12);
  // Pos 45-194: Nama (150 chars, kiri, uppercase)
  const p4 = String(name || "").toUpperCase().padEnd(150, " ").substring(0, 150);
  // Pos 195-200: MMYYYY
  const p5 = String(monthYear || "").padEnd(6, " ").substring(0, 6);
  // Pos 201-214: Gaji dalam sen (14 chars, kanan, RUANG - bukan sifar)
  const p6 = String(Math.round((salary || 0) * 100)).padStart(14, " ").substring(0, 14);
  // Pos 215-220: SOCSO Majikan (6 chars, kanan, RUANG)
  const p7 = String(Math.round((socsoEmpl || 0) * 100)).padStart(6, " ").substring(0, 6);
  // Pos 221-226: SOCSO Pekerja (6 chars, kanan, RUANG)
  const p8 = String(Math.round((socsoEmp || 0) * 100)).padStart(6, " ").substring(0, 6);
  // Pos 227-232: EIS Majikan (6 chars, kanan, RUANG)
  const p9 = String(Math.round((eisEmpl || 0) * 100)).padStart(6, " ").substring(0, 6);
  // Pos 233-238: EIS Pekerja (6 chars, kanan, RUANG)
  const p10 = String(Math.round((eisEmp || 0) * 100)).padStart(6, " ").substring(0, 6);
  // Pos 239-244: SKBBK (6 chars, kanan, RUANG)
  const p11 = String(Math.round((skbbk || 0) * 100)).padStart(6, " ").substring(0, 6);
  // Pos 245-278: 34 ruang kosong
  const p12 = "".padEnd(34, " ");

  const line = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11 + p12;
  if (line.length !== 278) {
    throw new Error(`Panjang rekod ${line.length} aksara (dijangka 278). Semak semula setiap medan.`);
  }
  return line;
}

/**
 * Sahkan format kod majikan PERKESO
 */
export function validateEmployerCode(code: string): { valid: boolean; error?: string } {
  const c = code.trim().toUpperCase();
  if (!c) return { valid: false, error: "Kod majikan diperlukan." };
  if (c.length !== 12) return { valid: false, error: "Kod majikan mesti tepat 12 aksara." };
  if (!/^[A-Z]\d{10}[A-Z]$/i.test(c))
    return { valid: false, error: "Format tidak sah. Contoh: E2303381K" };
  return { valid: true };
}

/**
 * Jana keseluruhan fail teks
 */
export function generateTextFile(
  empCode: string,
  month: number,
  year: number,
  rows: {
    ic: string;
    name: string;
    salary: number;
    age: number;
    category: string;
    enteredAfter55: boolean;
    eisNoContribution57: boolean;
    workerType: string;
  }[]
): { content: string; filename: string } {
  const v = validateEmployerCode(empCode);
  if (!v.valid) throw new Error(v.error);

  const monthYear = String(month).padStart(2, "0") + String(year);
  let content = "";

  for (const r of rows) {
    const calc = calculateContribution(
      r.salary,
      r.age,
      r.category,
      r.enteredAfter55,
      r.eisNoContribution57,
      r.workerType === "FOREIGN",
      month,
      year
    );
    content +=
      format278(
        empCode,
        r.ic,
        r.name,
        monthYear,
        r.salary,
        calc.socsoEmployer,
        calc.socsoEmployee,
        calc.eisEmployer,
        calc.eisEmployee,
        calc.skbbkEmployee
      ) + "\r\n";
  }

  return {
    content,
    filename: `PERKESO_${empCode}_${monthYear}.txt`,
  };
}
