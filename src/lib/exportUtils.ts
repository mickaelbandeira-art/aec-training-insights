import * as XLSX from 'xlsx';
import { FormResponse } from './storage';

export function exportToExcel(responses: FormResponse[], filename: string = 'respostas-treinamento-aec.xlsx') {
  // Prepare data for Excel
  const data = responses.map((response) => {
    // Group selections by pillar
    const selectionsByPillar: Record<string, string[]> = {};
    if (response.selections) {
      response.selections.forEach(selection => {
        if (!selectionsByPillar[selection.pillarLabel]) {
          selectionsByPillar[selection.pillarLabel] = [];
        }
        selectionsByPillar[selection.pillarLabel].push(selection.subPillarLabel);
      });
    }

    // Format selections as text
    const selectionsText = Object.entries(selectionsByPillar)
      .map(([pillar, subPillars]) => `${pillar}: ${subPillars.join(', ')}`)
      .join(' | ');

    return {
      'Data/Hora': new Date(response.timestamp).toLocaleString('pt-BR'),
      'Nome': response.nome || '-',
      'CPF': response.cpf || '-',
      'Telefone': response.telefone || '-',
      'Código da Turma': response.codigoTurma || '-',
      'Motivos Selecionados': selectionsText || '-',
      'Outros': response.outros || '-',
    };
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Respostas');

  // Auto-size columns
  const maxWidth = 50;
  const colWidths = Object.keys(data[0] || {}).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((row) => String(row[key as keyof typeof row]).length)
    );
    return { wch: Math.min(maxLength + 2, maxWidth) };
  });
  worksheet['!cols'] = colWidths;

  // Generate and download file
  XLSX.writeFile(workbook, filename);
}
