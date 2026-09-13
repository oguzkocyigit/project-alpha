import { z } from "zod";
import { DAYS_OF_WEEK } from "@/lib/constants";

const dayCodes = DAYS_OF_WEEK.map((d) => d.code) as [string, ...string[]];

export const LoginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı gerekli"),
  password: z.string().min(1, "Şifre gerekli"),
});

export const ProtocolItemSchema = z.object({
  category: z.enum(["SUPPLEMENT", "VITAMIN", "PEPTIDE", "ANABOLIC"]),
  productName: z.string().trim().min(1, "Ürün adı gerekli"),
  dosage: z.string().trim().min(1, "Doz gerekli"),
  daysOfWeek: z
    .array(z.enum(dayCodes))
    .min(1, "En az bir gün seçilmeli"),
  timeOfDay: z.string().trim().min(1, "Zaman gerekli"),
  notes: z.string().trim().optional().or(z.literal("")),
  active: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type ProtocolItemInput = z.infer<typeof ProtocolItemSchema>;

const StrengthExerciseSchema = z.object({
  type: z.literal("STRENGTH"),
  name: z.string().trim().min(1, "Egzersiz adı gerekli"),
  sets: z.coerce.number().int().min(1, "En az 1 set").max(50),
  reps: z.string().trim().min(1, "Tekrar gerekli"),
  restNote: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

const CardioExerciseSchema = z.object({
  type: z.literal("CARDIO"),
  name: z.string().trim().min(1, "Egzersiz adı gerekli"),
  durationMinutes: z.coerce.number().int().min(1, "En az 1 dakika").max(600),
  intensity: z.string().trim().optional().or(z.literal("")),
  restNote: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const WorkoutExerciseSchema = z.discriminatedUnion("type", [
  StrengthExerciseSchema,
  CardioExerciseSchema,
]);

export const WorkoutDaySchema = z.object({
  title: z.string().trim().min(1, "Başlık gerekli"),
  notes: z.string().trim().optional().or(z.literal("")),
  exercises: z.array(WorkoutExerciseSchema).default([]),
});

export type WorkoutDayInput = z.infer<typeof WorkoutDaySchema>;
export type WorkoutExerciseInput = z.infer<typeof WorkoutExerciseSchema>;

export const LibraryProductSchema = z.object({
  category: z.enum(["SUPPLEMENT", "VITAMIN", "PEPTIDE", "ANABOLIC"]),
  name: z.string().trim().min(1, "Ürün adı gerekli"),
  content: z.string().trim().min(1, "İçerik gerekli"),
  defaultDosage: z.string().trim().optional().or(z.literal("")),
  defaultTimeOfDay: z.string().trim().optional().or(z.literal("")),
});

export type LibraryProductInput = z.infer<typeof LibraryProductSchema>;
