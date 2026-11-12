/** Shared data contracts between the React frontend and the Flask backend. */

export type Role = "admin" | "peserta";
export type OptionKey = "A" | "B" | "C" | "D";
export const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  identityNumber?: string | undefined;
  className?: string | undefined;
}

export interface Participant {
  id: string;
  username: string;
  name: string;
  identityNumber: string;
  className: string;
  createdAt: string;
}

export interface ParticipantInput {
  username: string;
  name: string;
  identityNumber: string;
  className: string;
  /** Required when creating; optional when editing (empty = keep). */
  password?: string | undefined;
}

export interface Question {
  id: string;
  subject: string;
  text: string;
  options: Record<OptionKey, string>;
  correct: OptionKey;
  points: number;
}

export type QuestionInput = Omit<Question, "id">;

/** Question as sent to a participant — never includes the answer key. */
export type PublicQuestion = Omit<Question, "correct">;

export type ExamStatus = "belum_dimulai" | "berlangsung" | "selesai";

export interface Exam {
  id: string;
  name: string;
  subject: string;
  durationMinutes: number;
  questionIds: string[];
  status: ExamStatus;
  createdAt: string;
}

export type ExamInput = Omit<Exam, "id" | "createdAt">;

export type Answers = Partial<Record<string, OptionKey>>;

export interface AttemptResult {
  totalQuestions: number;
  correct: number;
  wrong: number;
  unanswered: number;
  earnedPoints: number;
  totalPoints: number;
  /** 0–100, one decimal. */
  score: number;
}

export type AttemptStatus = "in_progress" | "submitted";

export interface Attempt {
  id: string;
  examId: string;
  participantId: string;
  startedAt: string;
  deadline: string;
  answers: Answers;
  status: AttemptStatus;
  submittedAt?: string | undefined;
  result?: AttemptResult | undefined;
}

export interface DashboardStats {
  totalParticipants: number;
  totalExams: number;
  activeExams: number;
  inProgress: number;
  recentResults: ResultRow[];
}

export interface ResultRow {
  attemptId: string;
  participantName: string;
  identityNumber: string;
  className: string;
  examName: string;
  subject: string;
  status: AttemptStatus;
  submittedAt?: string | undefined;
  result?: AttemptResult | undefined;
}

export type ParticipantExamState = "belum_dikerjakan" | "sedang_dikerjakan" | "selesai";

export interface ParticipantExamView {
  exam: Pick<Exam, "id" | "name" | "subject" | "durationMinutes" | "status">;
  questionCount: number;
  state: ParticipantExamState;
  attemptId?: string | undefined;
}

export interface ExamSession {
  attempt: Pick<Attempt, "id" | "examId" | "startedAt" | "deadline" | "answers" | "status">;
  exam: Pick<Exam, "id" | "name" | "subject" | "durationMinutes">;
  questions: PublicQuestion[];
  /** Server clock at response time, used to correct client clock drift. */
  serverTime: string;
}

export interface ResultDetail extends ResultRow {
  participantId: string;
  examId: string;
  startedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

/** Every backend (mock or Flask) implements this contract. */
export interface UjianixApi {
  login(username: string, password: string): Promise<LoginResponse>;
  logout(): Promise<void>;
  health(): Promise<{ ok: boolean; mode: string }>;

  // Admin
  getDashboardStats(): Promise<DashboardStats>;
  listParticipants(): Promise<Participant[]>;
  createParticipant(input: ParticipantInput): Promise<Participant>;
  updateParticipant(id: string, input: ParticipantInput): Promise<Participant>;
  deleteParticipant(id: string): Promise<void>;
  listQuestions(): Promise<Question[]>;
  createQuestion(input: QuestionInput): Promise<Question>;
  updateQuestion(id: string, input: QuestionInput): Promise<Question>;
  deleteQuestion(id: string): Promise<void>;
  listExams(): Promise<Exam[]>;
  createExam(input: ExamInput): Promise<Exam>;
  updateExam(id: string, input: ExamInput): Promise<Exam>;
  setExamStatus(id: string, status: ExamStatus): Promise<Exam>;
  deleteExam(id: string): Promise<void>;
  listResults(): Promise<ResultRow[]>;
  resetDemoData(): Promise<void>;

  // Peserta
  listMyExams(): Promise<ParticipantExamView[]>;
  startExam(examId: string): Promise<ExamSession>;
  saveAnswer(attemptId: string, questionId: string, answer: OptionKey | null): Promise<void>;
  submitAttempt(attemptId: string, answers: Answers): Promise<{ attemptId: string }>;
  getResult(attemptId: string): Promise<ResultDetail>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Thrown when the server cannot be reached (LAN down, server off). */
export class NetworkError extends Error {
  constructor(message = "Tidak dapat terhubung ke server") {
    super(message);
    this.name = "NetworkError";
  }
}
