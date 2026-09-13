-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('STRENGTH', 'CARDIO');

-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "intensity" TEXT,
ADD COLUMN     "type" "ExerciseType" NOT NULL DEFAULT 'STRENGTH',
ALTER COLUMN "sets" DROP NOT NULL,
ALTER COLUMN "reps" DROP NOT NULL;
