import * as XLSX from 'xlsx';
import { FormResponse } from './storage';

export function exportToExcel(responses: FormResponse[], filename: string = 'respostas-treinamento-aec.xlsx') {
  // Prepare data for Excel
  const data = responses.map((response) => ({
    'Data/Hora': new Date(response.timestamp).toLocaleString('pt-BR'),
    'Nome': response.nome || '-',
    'Telefone': response.telefone || '-',
    'Disponibilidade de Horário': response.disponibilidadeHorario ? 'Sim' : 'Não',
    'Localidade do Treinamento': response.localidadeTreinamento ? 'Sim' : 'Não',
    'Pendências de Documento': response.pendenciasDocumento ? 'Sim' : 'Não',
    'Ausência de Home Office': response.ausenciaHomeOffice ? 'Sim' : 'Não',
    'Outra Oportunidade de Emprego': response.outraOportunidadeEmprego ? 'Sim' : 'Não',
    'Período de Treinamento Longo': response.periodoTreinamentoLongo ? 'Sim' : 'Não',
    'Afinidade com o Produto': response.afinidadeProduto ? 'Sim' : 'Não',
    'Resido em Outra Cidade': response.residenciaOutraCidade ? 'Sim' : 'Não',
    'Outros': response.outros || '-',
  }));

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
