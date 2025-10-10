export const roomsFromEstablishment: boolean = (
  // Par défaut activé; peut être désactivé via VITE_ROOMS_FROM_ESTABLISHMENT="false"
  (import.meta.env?.VITE_ROOMS_FROM_ESTABLISHMENT as unknown as string | undefined) ?? 'true'
) === 'true';


// Contrôle l'affichage et l'usage local de la création d'élève dans l'UI
// Par défaut désactivé conformément à l'orientation backend (création gérée par identité)
export const studentCreationEnabled: boolean = (
  (import.meta.env?.VITE_STUDENT_CREATION_ENABLED as unknown as string | undefined) ?? 'false'
) === 'true';

