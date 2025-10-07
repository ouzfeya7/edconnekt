import React, { useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import type { EtablissementCreate, PlanEnum, StatusEnum } from '../../../api/establishment-service/api';
import { useCreateEstablishmentsBulk } from '../../../hooks/useCreateEstablishmentsBulk';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { useEstablishmentLastCode } from '../../../hooks/useEstablishmentLastCode';

interface EstablishmentsBulkImportProps {
  onSuccessClose?: () => void;
}

type ParsedRow = {
  nom: string;
  code_etablissement: string;
  adresse: string;
  email: string;
  telephone: string;
  ville?: string | null;
  pays?: string | null;
  plan?: PlanEnum;
  status?: StatusEnum;
  date_debut?: string | null;
  date_fin?: string | null;
  line: number;
};

const expectedHeaders = ['nom', 'code_etablissement', 'adresse', 'email', 'telephone', 'ville', 'pays', 'plan', 'status', 'date_debut', 'date_fin'];

const sampleCsv = `nom,code_etablissement,adresse,email,telephone,ville,pays,plan,status,date_debut,date_fin\n` +
  `Lycée Cheikh Anta Diop,ETB0002,Avenue Blaise Diagne,contact@l-cad.sn,+221338000000,Dakar,Sénégal,PRO,ACTIVE,2024-10-01,2025-09-30\n` +
  `Collège Yoff Route de l'aéroport,ETB0003,Route de l'aéroport,info@college-yoff.sn,0337000000,Dakar,Sénégal,BASIC,TRIAL,2024-10-01,`;

function downloadSample() {
  const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'etablissements_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function parseCsv(content: string): { rows: ParsedRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return { rows: [], errors: ['Fichier CSV vide'] };
  const header = lines[0].split(',').map(h => h.trim());
  const missing = expectedHeaders.filter(h => !header.includes(h));
  if (missing.length > 0) errors.push(`Entêtes manquantes: ${missing.join(', ')}`);
  const idx = (name: string) => header.indexOf(name);

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = line.split(',');
    const planRaw = (cols[idx('plan')] || '').trim() as PlanEnum;
    const statusRaw = (cols[idx('status')] || '').trim() as StatusEnum;
    const row: ParsedRow = {
      nom: (cols[idx('nom')] || '').trim(),
      code_etablissement: (cols[idx('code_etablissement')] || '').trim(),
      adresse: (cols[idx('adresse')] || '').trim(),
      email: (cols[idx('email')] || '').trim(),
      telephone: (cols[idx('telephone')] || '').trim(),
      ville: (cols[idx('ville')] || '').trim() || null,
      pays: (cols[idx('pays')] || '').trim() || null,
      plan: planRaw || undefined,
      status: statusRaw || undefined,
      date_debut: (cols[idx('date_debut')] || '').trim() || null,
      date_fin: (cols[idx('date_fin')] || '').trim() || null,
      line: i,
    };
    rows.push(row);
  }
  return { rows, errors };
}

function validateRow(r: ParsedRow): string[] {
  const errs: string[] = [];
  if (!r.nom) errs.push('nom requis');
  // code_etablissement peut être vide: sera auto-généré
  if (r.code_etablissement) {
    const ce = (r.code_etablissement || '').trim().toUpperCase();
    if (!/^ETB\d{4}$/.test(ce)) errs.push('code_etablissement invalide (format ETB0001)');
  }
  if (!r.adresse) errs.push('adresse requise');
  if (!r.email) errs.push('email requis');
  if (!r.telephone) errs.push('telephone requis');
  if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) errs.push('email invalide');
  const tel = (r.telephone || '').replace(/\s+/g, '');
  const phoneOk = /^\+221\d{9}$/.test(tel) || /^0\d{9}$/.test(tel);
  if (!phoneOk) errs.push('telephone invalide (formats: +221XXXXXXXXX ou 0XXXXXXXXX)');
  if (r.plan && !['BASIC','PRO','ENTREPRISE'].includes(r.plan)) errs.push('plan invalide');
  if (r.status && !['TRIAL','ACTIVE','SUSPENDED','CLOSED'].includes(r.status)) errs.push('status invalide');
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (r.date_debut && !dateRegex.test(r.date_debut)) errs.push('date_debut doit être YYYY-MM-DD');
  if (r.date_fin && !dateRegex.test(r.date_fin)) errs.push('date_fin doit être YYYY-MM-DD');
  return errs;
}

const EstablishmentsBulkImport: React.FC<EstablishmentsBulkImportProps> = ({ onSuccessClose }) => {
  const [fileName, setFileName] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<number, string[]>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  // Résultat non utilisé à l'écran; supprimé pour éviter l'avertissement linter
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const createBulkMutation = useCreateEstablishmentsBulk();
  const { data: lastCode } = useEstablishmentLastCode();

  function computeNextEtb(from?: string): string {
    const match = (from || '').toUpperCase().match(/^ETB(\d{4})$/);
    const n = match ? parseInt(match[1], 10) : 0;
    const next = (n + 1);
    return `ETB${String(next).padStart(4, '0')}`;
  }

  const isValid = useMemo(() => {
    if (parseErrors.length > 0) return false;
    if (parsed.length === 0) return false;
    return Object.values(rowErrors).every(arr => arr.length === 0);
  }, [parseErrors, parsed, rowErrors]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const { rows, errors } = parseCsv(text);
      setParseErrors(errors);
      setParsed(rows);
      const re: Record<number, string[]> = {};
      rows.forEach((r) => {
        re[r.line] = validateRow(r);
      });
      setRowErrors(re);
      // reset de tout état dérivé
    };
    reader.readAsText(file);
  };

  const doSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    // Préparer un générateur séquentiel unique à partir du lastCode
    let cursor = lastCode && /^ETB\d{4}$/.test(lastCode.toUpperCase()) ? lastCode.toUpperCase() : 'ETB0000';
    const used = new Set<string>();
    // Marquer les codes fournis pour éviter collisions
    parsed.forEach(r => {
      const c = (r.code_etablissement || '').trim().toUpperCase();
      if (c) used.add(c);
    });
    const nextUnique = (): string => {
      let candidate = computeNextEtb(cursor);
      // Incrémenter jusqu'à trouver un code non utilisé localement
      while (used.has(candidate)) {
        cursor = candidate;
        candidate = computeNextEtb(cursor);
      }
      cursor = candidate;
      used.add(candidate);
      return candidate;
    };

    const payloads: EtablissementCreate[] = parsed.map((r) => {
      let code = (r.code_etablissement || '').trim().toUpperCase();
      if (!code) {
        code = nextUnique();
      }
      return {
        nom: r.nom,
        code_etablissement: code,
        adresse: r.adresse,
        email: r.email,
        telephone: normalizeTelephoneSn(r.telephone),
        ville: r.ville ?? undefined,
        pays: r.pays ?? undefined,
        plan: r.plan,
        status: r.status,
      } as EtablissementCreate;
    });
    try {
      await createBulkMutation.mutateAsync(payloads);
      toast.success(`${payloads.length} établissement(s) créés`);
      // Reset local state et fermer le modal si demandé
      setFileName('');
      setParsed([]);
      setParseErrors([]);
      setRowErrors({});
      onSuccessClose?.();
    } catch (error: unknown) {
      // si rollback total côté backend, tout échoue
      interface ErrorWithMessage { message?: string }
      interface ErrorWithResponse { response?: { data?: unknown } }
      interface ErrorDataWithDetail { detail?: string }

      const err = error as ErrorWithMessage & ErrorWithResponse;
      const data = err.response?.data;
      let serverMsg: string = 'Erreur inconnue';
      if (typeof data === 'string') {
        serverMsg = data;
      } else if (data && typeof (data as ErrorDataWithDetail).detail === 'string') {
        serverMsg = (data as ErrorDataWithDetail).detail as string;
      } else if (err.message) {
        serverMsg = err.message;
      }
      console.error('Erreur import établissements:', error);
      toast.error(`Échec de l'import (${payloads.length}) : ${typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)}`);
    } finally {
      setSubmitting(false);
    }
  };

function normalizeTelephoneSn(input: string): string {
  const raw = (input || '').replace(/\s+/g, '');
  if (/^\+221\d{9}$/.test(raw)) return raw;
  if (/^0\d{9}$/.test(raw)) return raw; // déjà au format local
  if (/^221\d{9}$/.test(raw)) return `+${raw}`; // ajouter + si manquant
  if (/^00221\d{9}$/.test(raw)) return `+221${raw.slice(5)}`; // convertir 00221 -> +221
  return raw; // laisser tel quel, le validateur affichera l'erreur
}

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Import CSV des établissements</h3>
        <Button onClick={downloadSample} variant="secondary">Télécharger un modèle</Button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Colonnes attendues: {expectedHeaders.join(', ')}. Les champs plan/status sont optionnels.
      </p>
      <div className="flex items-center space-x-3 mb-4">
        <input type="file" accept=".csv" onChange={onFileChange} />
        {fileName && <span className="text-sm text-gray-500">{fileName}</span>}
      </div>
      {parseErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded mb-4">
          {parseErrors.map((e, i) => (
            <div key={i}>- {e}</div>
          ))}
        </div>
      )}
      {parsed.length > 0 && (
        <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Nom</th>
              <th className="p-2 text-left">Code établissement</th>
              <th className="p-2 text-left">Adresse</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Téléphone</th>
              <th className="p-2 text-left">Ville</th>
              <th className="p-2 text-left">Pays</th>
              <th className="p-2 text-left">Plan</th>
              <th className="p-2 text-left">Statut</th>
              <th className="p-2 text-left">Erreurs</th>
            </tr>
          </thead>
          <tbody>
            {parsed.map((r) => (
              <tr key={r.line} className="border-b">
                <td className="p-2">{r.line}</td>
                <td className="p-2">{r.nom}</td>
                <td className="p-2">{r.code_etablissement || <span className="text-xs text-gray-500">(auto)</span>}</td>
                <td className="p-2">{r.adresse}</td>
                <td className="p-2">{r.email}</td>
                <td className="p-2">{r.telephone}</td>
                <td className="p-2">{r.ville ?? ''}</td>
                <td className="p-2">{r.pays ?? ''}</td>
                <td className="p-2">{r.plan ?? ''}</td>
                <td className="p-2">{r.status ?? ''}</td>
                <td className="p-2 text-red-600">{(rowErrors[r.line] || []).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {parsed.length > 0 && (
        <div className="text-xs text-gray-500 mb-2">Remarque: si le code établissement est vide, il sera auto-généré à partir du dernier code ({(lastCode || 'ETB0000')}).</div>
      )}
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsConfirmOpen(true)} disabled={!isValid || submitting}>
          {submitting ? 'Import en cours…' : 'Importer les établissements'}
        </Button>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => { setIsConfirmOpen(false); doSubmit(); }}
        title={`Confirmer l'import de ${parsed.length} établissement(s)`}
        description="Cette opération va créer tous les établissements listés. Vérifiez les erreurs éventuelles avant de confirmer."
      />
    </div>
    </div>
  );
};

export default EstablishmentsBulkImport;


