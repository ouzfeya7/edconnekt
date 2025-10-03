// Utils de rôles: mapping et capabilities centralisés

import type { EstablishmentRole } from './contextStorage';

// Mapping identity-service -> rôles applicatifs (UI)
// identity: 'teacher' | 'admin_staff' | 'student' | 'parent'
// app/UI: 'enseignant' | 'directeur' | 'eleve' | 'parent'
export function mapIdentityRoleToAppRole(identityRole: EstablishmentRole): string {
  switch (identityRole) {
    case 'teacher':
      return 'enseignant';
    case 'admin_staff':
      return 'directeur';
    case 'student':
      return 'eleve';
    case 'parent':
      return 'parent';
    default:
      return String(identityRole);
  }
}

export function mapAppRoleToIdentityRole(appRole: string): EstablishmentRole | null {
  switch (appRole) {
    case 'enseignant':
      return 'teacher';
    case 'directeur':
      return 'admin_staff';
    case 'eleve':
      return 'student';
    case 'parent':
      return 'parent';
    default:
      return null;
  }
}

// Capabilities standards utilisées dans l'UI
export interface AppCapabilities {
  canCreateLesson: boolean;
  canManageResources: boolean;
  isTeacher: boolean;
  isAdminStaff: boolean;
  isStudent: boolean;
  isParent: boolean;
}

export function computeCapabilitiesFromIdentityRole(identityRole?: EstablishmentRole | null): AppCapabilities {
  const isTeacher = identityRole === 'teacher';
  const isAdminStaff = identityRole === 'admin_staff';
  const isStudent = identityRole === 'student';
  const isParent = identityRole === 'parent';
  return {
    isTeacher,
    isAdminStaff,
    isStudent,
    isParent,
    canCreateLesson: isTeacher || isAdminStaff,
    canManageResources: isTeacher || isAdminStaff,
  };
}

export function computeCapabilitiesFromAppRoles(appRoles: string[]): AppCapabilities {
  const set = new Set(appRoles);
  const isTeacher = set.has('enseignant');
  const isAdminStaff = set.has('directeur');
  const isStudent = set.has('eleve');
  const isParent = set.has('parent');
  return {
    isTeacher,
    isAdminStaff,
    isStudent,
    isParent,
    canCreateLesson: isTeacher || isAdminStaff,
    canManageResources: isTeacher || isAdminStaff,
  };
}


