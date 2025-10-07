export const roomsFromEstablishment: boolean = (
  // Par défaut activé; peut être désactivé via VITE_ROOMS_FROM_ESTABLISHMENT="false"
  (import.meta.env?.VITE_ROOMS_FROM_ESTABLISHMENT as unknown as string | undefined) ?? 'true'
) === 'true';


