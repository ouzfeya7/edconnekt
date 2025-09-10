import { PdiStudent } from '../lib/mock-data';

export interface PdiSessionStudent extends PdiStudent {
  observations?: string;
  globalScore: number;
  difficultyLevel: 'critique' | 'modéré' | 'léger' | 'normal';
  needsAssistance: boolean;
  alerts: Array<{
    type: 'score_low' | 'regression' | 'attention_urgente';
    message: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export interface PdiSession {
  id: string;
  date: string;
  classId: string;
  className: string;
  status: 'completed' | 'in_progress' | 'scheduled' | 'published';
  students: PdiSessionStudent[];
  observations: string;
  reportGenerated: boolean;
  published: boolean;
  // F-06 publication flow
  version?: number;
  publishedAt?: string;
  isFrozen?: boolean;
  pendingApproval?: boolean;
} 