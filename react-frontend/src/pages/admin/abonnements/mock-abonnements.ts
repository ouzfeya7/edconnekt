
import { etablissementsData } from '../etablissements/mock-etablissements';
import { plansData } from '../plans/mock-plans';

export interface Abonnement {
  id: string;
  etablissementId: string;
  etablissementNom: string;
  planId: string;
  planNom: string;
  dateDebut: string;
  dateFin: string;
  statut: 'actif' | 'expiré' | 'annulé';
}

// Helper pour créer des dates
const aAn = (date: Date, years: number) => new Date(date.setFullYear(date.getFullYear() + years));
const aMois = (date: Date, months: number) => new Date(date.setMonth(date.getMonth() + months));

// const aujourdhui = new Date();

export const abonnementsData: Abonnement[] = [
  {
    id: 'sub-001',
    etablissementId: etablissementsData[0].id, // Lycée Lamine Guèye
    etablissementNom: etablissementsData[0].name,
    planId: plansData[1].id, // Pro
    planNom: plansData[1].nom,
    dateDebut: aAn(new Date(), -1).toISOString().split('T')[0],
    dateFin: aAn(new Date(), 1).toISOString().split('T')[0], // Valide 1 an
    statut: 'actif',
  },
  {
    id: 'sub-002',
    etablissementId: etablissementsData[1].id, // Collège Sacré-Cœur
    etablissementNom: etablissementsData[1].name,
    planId: plansData[0].id, // Basic
    planNom: plansData[0].nom,
    dateDebut: aMois(new Date(), -2).toISOString().split('T')[0],
    dateFin: aMois(new Date(), 1).toISOString().split('T')[0], // Expire le mois prochain
    statut: 'actif',
  },
  {
    id: 'sub-003',
    etablissementId: etablissementsData[3].id, // Maison d'Éducation Mariama Bâ
    etablissementNom: etablissementsData[3].name,
    planId: plansData[2].id, // Premium
    planNom: plansData[2].nom,
    dateDebut: aAn(new Date(), -2).toISOString().split('T')[0],
    dateFin: aMois(new Date(), -1).toISOString().split('T')[0], // Expiré
    statut: 'expiré',
  },
  {
    id: 'sub-004',
    etablissementId: etablissementsData[4].id, // Groupe Scolaire Les Pédagogues
    etablissementNom: etablissementsData[4].name,
    planId: plansData[0].id, // Basic
    planNom: plansData[0].nom,
    dateDebut: aMois(new Date(), -6).toISOString().split('T')[0],
    dateFin: aMois(new Date(), 6).toISOString().split('T')[0],
    statut: 'actif',
  },
];
