import { motion } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#22C55E'; // green
  if (score >= 75) return '#3B82F6'; // blue
  if (score >= 60) return '#EAB308'; // yellow
  if (score >= 40) return '#F97316'; // orange
  return '#EF4444'; // red
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return '#22C55E';
    case 'B':
      return '#3B82F6';
    case 'C':
      return '#EAB308';
    case 'D':
      return '#F97316';
    default:
      return '#EF4444';
  }
}

export function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  const color = getScoreColor(score);
  const gradeColor = getGradeColor(grade);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="6" />
          {/* Score arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-text-muted">分</span>
        </div>
      </div>
      {/* Grade badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
        style={{ backgroundColor: `${gradeColor}20`, color: gradeColor }}
      >
        {grade}
      </motion.div>
    </div>
  );
}
