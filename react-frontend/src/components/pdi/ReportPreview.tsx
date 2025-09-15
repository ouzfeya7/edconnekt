import React from 'react';
import { Download, FileText, Eye, Share2, Users, AlertTriangle, Target } from 'lucide-react';
import { PdiSession } from '../../types/pdi';

interface ReportPreviewProps {
  session: PdiSession;
  onDownload: () => void;
  onGenerate: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ session, onDownload, onGenerate }) => {
  const studentsInDifficulty = session.students.filter(student => student.needsAssistance);
  const averageScore = Math.round(session.students.reduce((sum, student) => sum + student.globalScore, 0) / session.students.length);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* En-tête avec actions */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" size={20} />
            <div>
              <h3 className="font-semibold text-slate-800">Rapport de séance PDI</h3>
              <p className="text-sm text-slate-600">{session.className} - {session.date}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!session.reportGenerated ? (
              <button
                onClick={onGenerate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText size={16} />
                Générer le rapport
              </button>
            ) : (
              <>
                <button
                  onClick={onDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Download size={16} />
                  Télécharger PDF
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                  <Share2 size={16} />
                  Partager
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Prévisualisation du contenu */}
      <div className="p-6">
        {!session.reportGenerated ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <Eye className="mx-auto mb-4 text-slate-400" size={48} />
            <h4 className="text-lg font-medium text-slate-700 mb-2">Aperçu du rapport</h4>
            <p className="text-slate-500 mb-4">
              Le rapport sera généré avec les données actuelles de la séance
            </p>
            <button
              onClick={onGenerate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={16} />
              Générer maintenant
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Simulation de la prévisualisation PDF */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              {/* En-tête du rapport */}
              <div className="text-center border-b border-slate-200 pb-4 mb-6">
                <h1 className="text-xl font-bold text-slate-800 mb-2">
                  Rapport de Séance PDI
                </h1>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><strong>Classe :</strong> {session.className}</p>
                  <p><strong>Date :</strong> {session.date}</p>
                  <p><strong>Statut :</strong> {session.status === 'published' ? 'Publié' : 'En attente'}</p>
                </div>
              </div>

              {/* Indicateurs généraux */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Users className="mx-auto mb-2 text-blue-600" size={24} />
                  <div className="text-2xl font-bold text-blue-800">{session.students.length}</div>
                  <div className="text-sm text-blue-600">Élèves suivis</div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                  <Target className="mx-auto mb-2 text-emerald-600" size={24} />
                  <div className="text-2xl font-bold text-emerald-800">{averageScore}%</div>
                  <div className="text-sm text-emerald-600">Score moyen</div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <AlertTriangle className="mx-auto mb-2 text-red-600" size={24} />
                  <div className="text-2xl font-bold text-red-800">{studentsInDifficulty.length}</div>
                  <div className="text-sm text-red-600">En difficulté</div>
                </div>
              </div>

              {/* Élèves en difficulté */}
              {studentsInDifficulty.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-red-600" size={18} />
                    Élèves nécessitant un suivi
                  </h3>
                  <div className="space-y-2">
                    {studentsInDifficulty.slice(0, 3).map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div>
                          <span className="font-medium text-red-800">{student.name}</span>
                          <span className="text-sm text-red-600 ml-2">({student.globalScore}%)</span>
                        </div>
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                          {student.difficultyLevel}
                        </span>
                      </div>
                    ))}
                    {studentsInDifficulty.length > 3 && (
                      <p className="text-sm text-slate-600 italic">
                        ... et {studentsInDifficulty.length - 3} autre(s) élève(s)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Observations générales */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Observations générales</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed">
                    {session.observations || "Aucune observation générale pour cette séance."}
                  </p>
                </div>
              </div>

              {/* Recommandations */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Recommandations</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2 text-blue-800">
                    {studentsInDifficulty.length > 0 ? (
                      <>
                        <li>• Mettre en place des séances de remédiation pour les élèves en difficulté</li>
                        <li>• Renforcer le suivi individuel des élèves avec scores &lt; 50%</li>
                        <li>• Prévoir des activités de consolidation en classe</li>
                      </>
                    ) : (
                      <li>• Maintenir le niveau actuel et poursuivre les bonnes pratiques</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions post-génération */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600">
                <p>Rapport généré le {new Date().toLocaleDateString('fr-FR')}</p>
                <p className="text-xs text-slate-500">Prêt pour téléchargement et partage</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onDownload}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <Download size={14} />
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPreview;
