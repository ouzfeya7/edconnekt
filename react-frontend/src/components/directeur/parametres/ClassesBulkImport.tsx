import React, { useMemo, useState } from 'react';
import { Button } from '../../../components/ui/button';
import type { ClasseCreate } from '../../../api/classe-service/api';
import { useCreateClasse } from '../../../hooks/useCreateClasse';

interface ClassesBulkImportProps {
  etablissementId: string;
}

type ParsedRow = {
  code: string;
  nom: string;
  niveau: string;
  annee_scolaire: string;
  capacity?: number;
  line: number;
};

const expectedHeaders = ['code', 'nom', 'niveau', 'annee_scolaire', 'capacity'];

const sampleCsv = `code,nom,niveau,annee_scolaire,capacity\n` +
  `4B-2024,4ème B,4EME,2024-2025,30\n` +
  `6A-2024,6ème A,6EME,2024-2025,45`;

function downloadSample() {
  const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'classes_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function parseCsv(content: string): { rows: ParsedRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return { rows: [], errors: ['Fichier CSV vide'] };
  }
  const header = lines[0].split(',').map(h => h.trim());
  // Vérifier entêtes attendues (au moins celles requises)
  const missing = expectedHeaders.filter(h => !header.includes(h));
  if (missing.length > 0) {
    errors.push(`Entêtes manquantes: ${missing.join(', ')}`);
  }
  const idx = (name: string) => header.indexOf(name);

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = line.split(',');
    const row: ParsedRow = {
      code: (cols[idx('code')] || '').trim(),
      nom: (cols[idx('nom')] || '').trim(),
      niveau: (cols[idx('niveau')] || '').trim(),
      annee_scolaire: (cols[idx('annee_scolaire')] || '').trim(),
      capacity: cols[idx('capacity')] !== undefined && cols[idx('capacity')].trim() !== ''
        ? Number(cols[idx('capacity')])
        : undefined,
      line: i,
    };
    rows.push(row);
  }
  return { rows, errors };
}

function validateRow(r: ParsedRow): string[] {
  const errs: string[] = [];
  if (!r.code) errs.push('code requis');
  if (!r.nom) errs.push('nom requis');
  if (!r.niveau) errs.push('niveau requis');
  if (!r.annee_scolaire) errs.push('annee_scolaire requise');
  // format minimal YYYY-YYYY
  if (r.annee_scolaire && !/^\d{4}-\d{4}$/.test(r.annee_scolaire)) {
    errs.push('annee_scolaire doit être au format YYYY-YYYY');
  }
  if (r.capacity !== undefined && (isNaN(r.capacity) || r.capacity < 0)) {
    errs.push('capacity doit être un entier >= 0');
  }
  return errs;
}

const ClassesBulkImport: React.FC<ClassesBulkImportProps> = ({ etablissementId }) => {
  const [fileName, setFileName] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<number, string[]>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  const createMutation = useCreateClasse();

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
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    let success = 0;
    let failed = 0;
    for (const r of parsed) {
      const payload: ClasseCreate = {
        code: r.code,
        nom: r.nom,
        niveau: r.niveau,
        annee_scolaire: r.annee_scolaire,
        etablissement_id: etablissementId,
        capacity: r.capacity ?? 0,
      };
      try {
        await createMutation.mutateAsync(payload);
        success += 1;
      } catch {
        failed += 1;
      }
    }
    setResult({ success, failed });
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Import CSV des classes</h3>
        <Button onClick={downloadSample} variant="secondary">Télécharger un modèle</Button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Colonnes attendues: code, nom, niveau, annee_scolaire, capacity (optionnel). L'établissement est fixé par contexte.
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
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Nom</th>
                <th className="p-2 text-left">Niveau</th>
                <th className="p-2 text-left">Année scolaire</th>
                <th className="p-2 text-left">Capacité</th>
                <th className="p-2 text-left">Erreurs</th>
              </tr>
            </thead>
            <tbody>
              {parsed.map((r) => (
                <tr key={r.line} className="border-b">
                  <td className="p-2">{r.line}</td>
                  <td className="p-2">{r.code}</td>
                  <td className="p-2">{r.nom}</td>
                  <td className="p-2">{r.niveau}</td>
                  <td className="p-2">{r.annee_scolaire}</td>
                  <td className="p-2">{r.capacity ?? ''}</td>
                  <td className="p-2 text-red-600">
                    {(rowErrors[r.line] || []).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {result && (
            <span>
              Import terminé: {result.success} succès, {result.failed} échecs.
            </span>
          )}
        </div>
        <Button onClick={handleSubmit} disabled={!isValid || submitting || !etablissementId}>
          {submitting ? 'Import en cours…' : 'Importer les classes'}
        </Button>
      </div>
    </div>
  );
};

export default ClassesBulkImport;


