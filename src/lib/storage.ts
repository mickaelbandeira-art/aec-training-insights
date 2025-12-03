export interface PillarSelection {
  pillarId: string;
  pillarLabel: string;
  subPillarId: string;
  subPillarLabel: string;
}

export interface FormResponse {
  id: string;
  timestamp: Date;
  nome: string;
  cpf: string;
  telefone: string;
  selections: PillarSelection[];
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

export interface PillarStats {
  pillarId: string;
  pillarLabel: string;
  count: number;
  percentage: number;
  subPillars: {
    subPillarId: string;
    subPillarLabel: string;
    count: number;
    percentage: number;
  }[];
}

export function getStatistics() {
  const responses = getResponses();
  const total = responses.length;

  if (total === 0) {
    return {
      total: 0,
      pillars: [] as PillarStats[],
      outros: { count: 0, percentage: 0, entries: [] as string[] },
    };
  }

  // Count selections by pillar and sub-pillar
  const pillarMap = new Map<string, Map<string, { count: number; label: string }>>();

  responses.forEach(response => {
    response.selections.forEach(selection => {
      if (!pillarMap.has(selection.pillarId)) {
        pillarMap.set(selection.pillarId, new Map());
      }
      const subPillarMap = pillarMap.get(selection.pillarId)!;

      if (!subPillarMap.has(selection.subPillarId)) {
        subPillarMap.set(selection.subPillarId, { count: 0, label: selection.subPillarLabel });
      }
      subPillarMap.get(selection.subPillarId)!.count++;
    });
  });

  // Convert to array format
  const pillarStats: PillarStats[] = [];
  pillarMap.forEach((subPillarMap, pillarId) => {
    let pillarLabel = '';
    let pillarTotalCount = 0;

    const subPillars = Array.from(subPillarMap.entries()).map(([subPillarId, data]) => {
      pillarTotalCount += data.count;
      return {
        subPillarId,
        subPillarLabel: data.label,
        count: data.count,
        percentage: (data.count / total) * 100,
      };
    });

    // Get pillar label from first sub-pillar selection
    responses.forEach(r => {
      const selection = r.selections.find(s => s.pillarId === pillarId);
      if (selection && !pillarLabel) {
        pillarLabel = selection.pillarLabel;
      }
    });

    pillarStats.push({
      pillarId,
      pillarLabel,
      count: pillarTotalCount,
      percentage: (pillarTotalCount / total) * 100,
      subPillars,
    });
  });

  const outrosEntries = responses.filter(r => r.outros.trim() !== '').map(r => r.outros);

  return {
    total,
    pillars: pillarStats,
    outros: { count: outrosEntries.length, percentage: (outrosEntries.length / total) * 100, entries: outrosEntries },
  };
}

export function filterResponsesByMonth(responses: FormResponse[], month: number | null, year: number): FormResponse[] {
  if (month === null) {
    // Filter by year only
    return responses.filter(r => {
      const date = new Date(r.timestamp);
      return date.getFullYear() === year;
    });
  }

  // Filter by month and year
  return responses.filter(r => {
    const date = new Date(r.timestamp);
    return date.getMonth() === month && date.getFullYear() === year;
  });
}

export function getAvailableYears(responses: FormResponse[]): number[] {
  const years = responses.map(r => new Date(r.timestamp).getFullYear());
  const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
  return uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];
}

export function getStatisticsForFiltered(responses: FormResponse[]) {
  const total = responses.length;

  if (total === 0) {
    return {
      total: 0,
      pillars: [] as PillarStats[],
      outros: { count: 0, percentage: 0, entries: [] as string[] },
    };
  }

  // Count selections by pillar and sub-pillar
  const pillarMap = new Map<string, Map<string, { count: number; label: string }>>();

  responses.forEach(response => {
    response.selections.forEach(selection => {
      if (!pillarMap.has(selection.pillarId)) {
        pillarMap.set(selection.pillarId, new Map());
      }
      const subPillarMap = pillarMap.get(selection.pillarId)!;

      if (!subPillarMap.has(selection.subPillarId)) {
        subPillarMap.set(selection.subPillarId, { count: 0, label: selection.subPillarLabel });
      }
      subPillarMap.get(selection.subPillarId)!.count++;
    });
  });

  // Convert to array format
  const pillarStats: PillarStats[] = [];
  pillarMap.forEach((subPillarMap, pillarId) => {
    let pillarLabel = '';
    let pillarTotalCount = 0;

    const subPillars = Array.from(subPillarMap.entries()).map(([subPillarId, data]) => {
      pillarTotalCount += data.count;
      return {
        subPillarId,
        subPillarLabel: data.label,
        count: data.count,
        percentage: (data.count / total) * 100,
      };
    });

    // Get pillar label from first sub-pillar selection
    responses.forEach(r => {
      const selection = r.selections.find(s => s.pillarId === pillarId);
      if (selection && !pillarLabel) {
        pillarLabel = selection.pillarLabel;
      }
    });

    pillarStats.push({
      pillarId,
      pillarLabel,
      count: pillarTotalCount,
      percentage: (pillarTotalCount / total) * 100,
      subPillars,
    });
  });

  const outrosEntries = responses.filter(r => r.outros.trim() !== '').map(r => r.outros);

  return {
    total,
    pillars: pillarStats,
    outros: { count: outrosEntries.length, percentage: (outrosEntries.length / total) * 100, entries: outrosEntries },
  };
}
