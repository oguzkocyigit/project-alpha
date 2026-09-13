import { FlaskConical, HeartPulse, Shield, Syringe } from "lucide-react";
import type { Category } from "@prisma/client";

export const CATEGORY_ICON: Record<Category, typeof Shield> = {
  SUPPLEMENT: Shield,
  VITAMIN: HeartPulse,
  PEPTIDE: FlaskConical,
  ANABOLIC: Syringe,
};
