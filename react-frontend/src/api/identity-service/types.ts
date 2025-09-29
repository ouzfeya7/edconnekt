// Lightweight UI-first types to decouple components from generated models

export type EstablishmentId = string;

// Re-export the role union used across the UI
export type { EstablishmentRole } from '../../utils/contextStorage';

// Minimal identity item used by lists in UI
export interface UIIdentityListItem {
  id: string;
  firstname: string;
  lastname: string;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
}
