export interface FormResponse {
  id: string;
  timestamp: Date;
  nome: string;
  telefone: string;
  disponibilidadeHorario: boolean;
  localidadeTreinamento: boolean;
  pendenciasDocumento: boolean;
  ausenciaHomeOffice: boolean;
  outraOportunidadeEmprego: boolean;
  periodoTreinamentoLongo: boolean;
  afinidadeProduto: boolean;
  residenciaOutraCidade: boolean;
  outros: string;
}

const STORAGE_KEY = 'aec-training-responses';

export function saveResponse(response: Omit<FormResponse, 'id' | 'timestamp'>): FormResponse {
  const responses = getResponses();
  const newResponse: FormResponse = {
    ...response,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };
  responses.push(newResponse);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  return newResponse;
}

export function getResponses(): FormResponse[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((r: FormResponse) => ({
      ...r,
      timestamp: new Date(r.timestamp),
    }));
  } catch {
    return [];
  }
}

export function clearResponses(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStatistics() {
  const responses = getResponses();
  const total = responses.length;

  if (total === 0) {
    return {
      total: 0,
      disponibilidadeHorario: { count: 0, percentage: 0 },
      localidadeTreinamento: { count: 0, percentage: 0 },
      pendenciasDocumento: { count: 0, percentage: 0 },
      ausenciaHomeOffice: { count: 0, percentage: 0 },
      outraOportunidadeEmprego: { count: 0, percentage: 0 },
      periodoTreinamentoLongo: { count: 0, percentage: 0 },
      afinidadeProduto: { count: 0, percentage: 0 },
      residenciaOutraCidade: { count: 0, percentage: 0 },
      outros: { count: 0, percentage: 0, entries: [] as string[] },
    };
  }

  const disponibilidadeHorario = responses.filter(r => r.disponibilidadeHorario).length;
  const localidadeTreinamento = responses.filter(r => r.localidadeTreinamento).length;
  const pendenciasDocumento = responses.filter(r => r.pendenciasDocumento).length;
  const ausenciaHomeOffice = responses.filter(r => r.ausenciaHomeOffice).length;
  const outraOportunidadeEmprego = responses.filter(r => r.outraOportunidadeEmprego).length;
  const periodoTreinamentoLongo = responses.filter(r => r.periodoTreinamentoLongo).length;
  const afinidadeProduto = responses.filter(r => r.afinidadeProduto).length;
  const residenciaOutraCidade = responses.filter(r => r.residenciaOutraCidade).length;
  const outrosEntries = responses.filter(r => r.outros.trim() !== '').map(r => r.outros);

  return {
    total,
    disponibilidadeHorario: { count: disponibilidadeHorario, percentage: (disponibilidadeHorario / total) * 100 },
    localidadeTreinamento: { count: localidadeTreinamento, percentage: (localidadeTreinamento / total) * 100 },
    pendenciasDocumento: { count: pendenciasDocumento, percentage: (pendenciasDocumento / total) * 100 },
    ausenciaHomeOffice: { count: ausenciaHomeOffice, percentage: (ausenciaHomeOffice / total) * 100 },
    outraOportunidadeEmprego: { count: outraOportunidadeEmprego, percentage: (outraOportunidadeEmprego / total) * 100 },
    periodoTreinamentoLongo: { count: periodoTreinamentoLongo, percentage: (periodoTreinamentoLongo / total) * 100 },
    afinidadeProduto: { count: afinidadeProduto, percentage: (afinidadeProduto / total) * 100 },
    residenciaOutraCidade: { count: residenciaOutraCidade, percentage: (residenciaOutraCidade / total) * 100 },
    outros: { count: outrosEntries.length, percentage: (outrosEntries.length / total) * 100, entries: outrosEntries },
  };
}
