/* Context storage utilities for establishment/role selection */

export type EstablishmentRole = 'student' | 'parent' | 'teacher' | 'admin_staff';

const KEY_ETAB_ID = 'edc.activeEtabId';
const KEY_ROLE = 'edc.activeRole';
const KEY_CTX_AT = 'edc.activeCtxAt';

export interface ActiveContext {
  etabId?: string | null;
  role?: EstablishmentRole | null;
  ctxAt?: string | null; // ISO timestamp
}

export function getActiveContext(): ActiveContext {
  const etabId = localStorage.getItem(KEY_ETAB_ID);
  const roleRaw = localStorage.getItem(KEY_ROLE) as EstablishmentRole | null;
  const ctxAt = localStorage.getItem(KEY_CTX_AT);
  return {
    etabId: etabId ?? null,
    role: (roleRaw as EstablishmentRole | null) ?? null,
    ctxAt: ctxAt ?? null,
  };
}

export function setActiveContext(etabId: string, role: EstablishmentRole): void {
  if (typeof etabId === 'string' && etabId.trim()) {
    localStorage.setItem(KEY_ETAB_ID, etabId.trim());
  }
  if (role) {
    localStorage.setItem(KEY_ROLE, role);
  }
  localStorage.setItem(KEY_CTX_AT, new Date().toISOString());
}

export function setActiveEtabId(etabId: string): void {
  localStorage.setItem(KEY_ETAB_ID, (etabId ?? '').trim());
  localStorage.setItem(KEY_CTX_AT, new Date().toISOString());
}

export function setActiveRole(role: EstablishmentRole): void {
  localStorage.setItem(KEY_ROLE, role);
  localStorage.setItem(KEY_CTX_AT, new Date().toISOString());
}

export function clearActiveContext(): void {
  localStorage.removeItem(KEY_ETAB_ID);
  localStorage.removeItem(KEY_ROLE);
  localStorage.removeItem(KEY_CTX_AT);
}
