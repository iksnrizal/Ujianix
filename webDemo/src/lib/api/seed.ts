import { scoreAttempt } from "@/lib/scoring";
import type { Attempt, Exam, OptionKey, Participant, Question } from "./types";

export interface StoredParticipant extends Participant {
  password: string;
}

export interface MockDb {
  version: 1;
  admins: { id: string; username: string; password: string; name: string }[];
  participants: StoredParticipant[];
  questions: Question[];
  exams: Exam[];
  attempts: Attempt[];
}

export const DEMO_ACCOUNTS = {
  admin: { username: "admin", password: "admin123" },
  peserta: { username: "alrijal", password: "pink floyd" },
};

type Q = [
  id: string,
  subject: string,
  text: string,
  opts: [string, string, string, string],
  correct: OptionKey,
  points?: number,
];

const QUESTIONS: Q[] = [
  [
    "m1",
    "Matematika",
    "Hasil dari 3/4 + 2/3 adalah …",
    ["5/7", "1 5/12", "5/12", "1 1/12"],
    "B",
    10,
  ],
  ["m2", "Matematika", "Jika 2x + 5 = 17, maka nilai x adalah …", ["5", "6", "7", "11"], "B", 10],
  [
    "m3",
    "Matematika",
    "Luas lingkaran dengan jari-jari 7 cm (π = 22/7) adalah …",
    ["44 cm²", "154 cm²", "144 cm²", "308 cm²"],
    "B",
    20,
  ],
  [
    "m4",
    "Matematika",
    "Rata-rata dari data 6, 7, 8, 8, 9, 10 adalah …",
    ["8", "7,5", "8,5", "9"],
    "A",
    10,
  ],
  ["m5", "Matematika", "Nilai dari 2⁵ adalah …", ["10", "25", "32", "64"], "C", 10],
  [
    "m6",
    "Matematika",
    "Gradien garis dengan persamaan y = 3x − 4 adalah …",
    ["−4", "−3", "4", "3"],
    "D",
    20,
  ],
  [
    "i1",
    "Informatika",
    "Perangkat keras yang berfungsi sebagai pusat pengolahan data adalah …",
    ["Monitor", "CPU", "Keyboard", "Printer"],
    "B",
    10,
  ],
  [
    "i2",
    "Informatika",
    "Sistem bilangan biner hanya menggunakan angka …",
    ["0 dan 1", "1 dan 2", "0 sampai 7", "0 sampai 9"],
    "A",
    10,
  ],
  [
    "i3",
    "Informatika",
    "Kepanjangan dari LAN adalah …",
    ["Large Area Network", "Local Access Node", "Local Area Network", "Linked Area Network"],
    "C",
    10,
  ],
  [
    "i4",
    "Informatika",
    "Bilangan biner 1010 jika dikonversi ke desimal adalah …",
    ["8", "12", "5", "10"],
    "D",
    20,
  ],
  [
    "i5",
    "Informatika",
    "Struktur data yang bekerja dengan prinsip LIFO (Last In First Out) adalah …",
    ["Queue", "Array", "Stack", "Tree"],
    "C",
    20,
  ],
  [
    "i6",
    "Informatika",
    "Perintah Linux untuk menampilkan isi sebuah direktori adalah …",
    ["ls", "cd", "rm", "mkdir"],
    "A",
    10,
  ],
  [
    "b1",
    "Bahasa Indonesia",
    "Kalimat yang penulisannya sesuai dengan ejaan yang benar adalah …",
    [
      "Ibu membeli sayur di pasar.",
      "ibu membeli sayur di Pasar.",
      "Ibu Membeli Sayur di pasar.",
      "ibu membeli sayur dipasar.",
    ],
    "A",
    10,
  ],
  [
    "b2",
    "Bahasa Indonesia",
    "Sinonim dari kata “cermat” adalah …",
    ["ceroboh", "teliti", "cepat", "malas"],
    "B",
    10,
  ],
  [
    "b3",
    "Bahasa Indonesia",
    "Gagasan utama yang terdapat dalam sebuah paragraf disebut …",
    ["kalimat penjelas", "kesimpulan", "ide pokok", "judul"],
    "C",
    10,
  ],
  [
    "b4",
    "Bahasa Indonesia",
    "Antonim dari kata “optimis” adalah …",
    ["pesimis", "realistis", "dinamis", "agamis"],
    "A",
    10,
  ],
  [
    "b5",
    "Bahasa Indonesia",
    "Teks yang bertujuan meyakinkan pembaca untuk melakukan sesuatu disebut teks …",
    ["narasi", "deskripsi", "prosedur", "persuasi"],
    "D",
    10,
  ],
  ["s1", "IPA", "Satuan SI untuk gaya adalah …", ["Joule", "Newton", "Watt", "Pascal"], "B", 10],
  [
    "s2",
    "IPA",
    "Proses tumbuhan membuat makanan dengan bantuan cahaya matahari disebut …",
    ["respirasi", "transpirasi", "fotosintesis", "fermentasi"],
    "C",
    10,
  ],
  ["s3", "IPA", "Rumus kimia air adalah …", ["H₂O", "CO₂", "O₂", "NaCl"], "A", 10],
  [
    "s4",
    "IPA",
    "Planet terbesar di tata surya adalah …",
    ["Saturnus", "Bumi", "Neptunus", "Jupiter"],
    "D",
    10,
  ],
  [
    "s5",
    "IPA",
    "Organ yang berfungsi memompa darah ke seluruh tubuh adalah …",
    ["paru-paru", "jantung", "hati", "ginjal"],
    "B",
    10,
  ],
];

const PEOPLE: [string, string, string][] = [
  ["Alrijal", "2024001", "XII IPA 1"],
  ["Siti Nurhaliza", "2024002", "XII IPA 1"],
  ["Budi Santoso", "2024003", "XII IPA 1"],
  ["Dewi Lestari", "2024004", "XII IPA 2"],
  ["Rizky Ramadhan", "2024005", "XII IPA 2"],
  ["Nabila Putri", "2024006", "XII IPS 1"],
  ["Fajar Nugroho", "2024007", "XII IPS 1"],
  ["Aulia Rahman", "2024008", "XII IPS 1"],
];

const minutesAgo = (now: number, m: number) => new Date(now - m * 60_000).toISOString();

export function createSeed(now = Date.now()): MockDb {
  const questions: Question[] = QUESTIONS.map(([id, subject, text, o, correct, points = 10]) => ({
    id,
    subject,
    text,
    options: { A: o[0], B: o[1], C: o[2], D: o[3] },
    correct,
    points,
  }));

  const participants: StoredParticipant[] = PEOPLE.map(([name, nis, cls], i) => ({
    id: `p${i + 1}`,
    username: i === 0 ? DEMO_ACCOUNTS.peserta.username : `siswa${String(i + 1).padStart(2, "0")}`,
    password: i === 0 ? DEMO_ACCOUNTS.peserta.password : "siswa123",
    name,
    identityNumber: nis,
    className: cls,
    createdAt: minutesAgo(now, 60 * 24 * 7),
  }));

  const exams: Exam[] = [
    {
      id: "e1",
      name: "Penilaian Tengah Semester Matematika",
      subject: "Matematika",
      durationMinutes: 30,
      questionIds: ["m1", "m2", "m3", "m4", "m5", "m6"],
      status: "berlangsung",
      createdAt: minutesAgo(now, 60 * 24 * 2),
    },
    {
      id: "e2",
      name: "Asesmen Informatika Dasar",
      subject: "Informatika",
      durationMinutes: 20,
      questionIds: ["i1", "i2", "i3", "i4", "i5", "i6"],
      status: "berlangsung",
      createdAt: minutesAgo(now, 60 * 24),
    },
    {
      id: "e3",
      name: "Tryout Bahasa Indonesia",
      subject: "Bahasa Indonesia",
      durationMinutes: 25,
      questionIds: ["b1", "b2", "b3", "b4", "b5"],
      status: "belum_dimulai",
      createdAt: minutesAgo(now, 60 * 5),
    },
    {
      id: "e4",
      name: "Ulangan Harian IPA",
      subject: "IPA",
      durationMinutes: 15,
      questionIds: ["s1", "s2", "s3", "s4", "s5"],
      status: "selesai",
      createdAt: minutesAgo(now, 60 * 24 * 3),
    },
  ];

  const byId = new Map(questions.map((q) => [q.id, q]));
  const attempts: Attempt[] = [];
  let n = 1;

  const addSubmitted = (examId: string, pid: string, pattern: string, endedMinutesAgo: number) => {
    const exam = exams.find((e) => e.id === examId)!;
    const answers: Attempt["answers"] = {};
    exam.questionIds.forEach((qid, i) => {
      const c = pattern[i];
      if (c && c !== "-") answers[qid] = c as OptionKey;
    });
    const qs = exam.questionIds.map((id) => byId.get(id)!);
    attempts.push({
      id: `a${n++}`,
      examId,
      participantId: pid,
      startedAt: minutesAgo(now, endedMinutesAgo + 12),
      deadline: minutesAgo(now, endedMinutesAgo + 12 - exam.durationMinutes),
      answers,
      status: "submitted",
      submittedAt: minutesAgo(now, endedMinutesAgo),
      result: scoreAttempt(qs, answers),
    });
  };

  // Ulangan Harian IPA (correct: B C A D B)
  addSubmitted("e4", "p1", "BCADB", 60 * 26);
  addSubmitted("e4", "p2", "BCADA", 60 * 26 + 3);
  addSubmitted("e4", "p3", "BAADB", 60 * 26 + 5);
  addSubmitted("e4", "p4", "BCA-B", 60 * 26 + 8);
  addSubmitted("e4", "p5", "ACBDB", 60 * 26 + 9);
  addSubmitted("e4", "p6", "BCADB", 60 * 26 + 11);
  addSubmitted("e4", "p7", "DCADC", 60 * 26 + 14);
  addSubmitted("e4", "p8", "BBADB", 60 * 26 + 15);
  // PTS Matematika (correct: B B B A C D)
  addSubmitted("e1", "p4", "BBBACD", 40);
  addSubmitted("e1", "p6", "BCBACA", 25);

  // Two participants currently working on Asesmen Informatika
  for (const [pid, answers] of [
    ["p3", { i1: "B", i2: "A" }],
    ["p5", { i1: "B", i2: "A", i3: "C", i4: "B" }],
  ] as const) {
    attempts.push({
      id: `a${n++}`,
      examId: "e2",
      participantId: pid,
      startedAt: minutesAgo(now, 4),
      deadline: new Date(now + 16 * 60_000).toISOString(),
      answers: { ...answers },
      status: "in_progress",
    });
  }

  return {
    version: 1,
    admins: [
      {
        id: "admin1",
        username: DEMO_ACCOUNTS.admin.username,
        password: DEMO_ACCOUNTS.admin.password,
        name: "Pengawas Ujian",
      },
    ],
    participants,
    questions,
    exams,
    attempts,
  };
}
