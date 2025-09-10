import dayjs from 'dayjs';

import { PdiStudent } from './mock-data';
import { PdiSession, PdiSessionStudent } from '../types/pdi';

export const PDI_THRESHOLDS = {
  difficulty: 70,
  critical: 30,
  moderate: 50,
  light: 70,
};

export function computeGlobalScore(student: PdiStudent): number {
  const scores = [
    student.langage,
    student.conte,
    student.vocabulaire,
    student.lecture,
    student.graphisme,
  ];
  const sum = scores.reduce((acc, value) => acc + value, 0);
  return Math.round(sum / scores.length);
}

export function getDifficultyLevel(globalScore: number): 'critique' | 'modéré' | 'léger' | 'normal' {
  if (globalScore < PDI_THRESHOLDS.critical) return 'critique';
  if (globalScore < PDI_THRESHOLDS.moderate) return 'modéré';
  if (globalScore < PDI_THRESHOLDS.light) return 'léger';
  return 'normal';
}

export function needsAssistance(globalScore: number): boolean {
  return globalScore < PDI_THRESHOLDS.difficulty;
}

export function buildAlerts(student: PdiStudent, globalScore: number): PdiSessionStudent['alerts'] {
  const alerts: PdiSessionStudent['alerts'] = [];

  if (globalScore < PDI_THRESHOLDS.critical) {
    alerts.push({
      type: 'score_low',
      message: 'Score critique < 30%',
      severity: 'high',
    });
  } else if (globalScore < PDI_THRESHOLDS.light) {
    alerts.push({
      type: 'score_low',
      message: 'Score global < 70%',
      severity: 'medium',
    });
  }

  const competencesBelow50: string[] = [];
  if (student.langage < 50) competencesBelow50.push('Langage');
  if (student.conte < 50) competencesBelow50.push('Conte');
  if (student.vocabulaire < 50) competencesBelow50.push('Vocabulaire');
  if (student.lecture < 50) competencesBelow50.push('Lecture');
  if (student.graphisme < 50) competencesBelow50.push('Graphisme');
  if (competencesBelow50.length >= 3) {
    alerts.push({
      type: 'attention_urgente',
      message: 'Intervention immédiate requise',
      severity: 'high',
    });
  }

  // Régression simple basée sur le tableau de progression binaire (0/1)
  // Heuristique: présence d'un 0 après une séquence de 1 suggère une régression
  const prog = student.progression || [];
  if (prog.length >= 2) {
    let seenOne = false;
    for (const v of prog) {
      if (v === 1) seenOne = true;
      if (seenOne && v === 0) {
        alerts.push({
          type: 'regression',
          message: 'Régression détectée sur la progression récente',
          severity: 'low',
        });
        break;
      }
    }
  }

  return alerts;
}

export function buildSessionStudent(student: PdiStudent): PdiSessionStudent {
  const global = computeGlobalScore(student);
  const level = getDifficultyLevel(global);
  const assistance = needsAssistance(global);
  const alerts = buildAlerts(student, global);

  return {
    ...student,
    globalScore: global,
    difficultyLevel: level,
    needsAssistance: assistance,
    alerts,
    observations: level !== 'normal'
      ? `Élève en difficulté nécessitant un suivi.
Recommandation : séances de remédiation adaptées.`
      : '',
  };
}

// Utilitaires de calendrier
function getISOWeek(date: Date): { year: number; week: number } {
  // Source: algorithme ISO-8601 simplifié
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { year: tmp.getUTCFullYear(), week };
}

function parseDdMmYyyy(dateStr: string): Date | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
}

export function isDuplicateSessionThisWeek(sessions: PdiSession[]): boolean {
  const seen: Record<string, number> = {};
  for (const s of sessions) {
    const parsed = parseDdMmYyyy(s.date);
    const d = parsed ?? dayjs(s.date).toDate();
    const { year, week } = getISOWeek(d);
    const key = `${s.className}::${year}-W${week}`;
    seen[key] = (seen[key] || 0) + 1;
    if (seen[key] > 1) return true;
  }
  return false;
}

export function getDuplicateSessionIds(sessions: PdiSession[]): Set<string> {
  const counts: Record<string, { count: number; ids: string[] }> = {};
  for (const s of sessions) {
    const parsed = parseDdMmYyyy(s.date);
    const d = parsed ?? dayjs(s.date).toDate();
    const { year, week } = getISOWeek(d);
    const key = `${s.className}::${year}-W${week}`;
    if (!counts[key]) counts[key] = { count: 0, ids: [] };
    counts[key].count += 1;
    counts[key].ids.push(s.id);
  }
  const duplicates = new Set<string>();
  Object.values(counts).forEach(({ count, ids }) => {
    if (count > 1) {
      ids.forEach(id => duplicates.add(id));
    }
  });
  return duplicates;
}


