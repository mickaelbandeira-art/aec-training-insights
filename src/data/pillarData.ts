export interface SubPillar {
  id: string;
  label: string;
}

export interface Pillar {
  id: string;
  label: string;
  subPillars: SubPillar[];
}

export const pillars: Pillar[] = [
  {
    id: 'motivos_operacionais',
    label: 'Motivos operacionais',
    subPillars: [
      { id: 'disponibilidade_horario', label: 'Disponibilidade de horário' },
      { id: 'localidade_treinamento', label: 'Localidade do treinamento' },
      { id: 'forma_entrega', label: 'Forma de entrega (presencial/online)' },
      { id: 'dificuldade_acesso_plataforma', label: 'Dificuldade de acesso à plataforma' },
      { id: 'problemas_conectividade', label: 'Problemas de conectividade / internet' },
      { id: 'duracao_treinamento', label: 'Duração do treinamento' },
    ],
  },
  {
    id: 'motivos_pessoais',
    label: 'Motivos pessoais',
    subPillars: [
      { id: 'questoes_saude', label: 'Questões de saúde' },
      { id: 'motivos_familiares', label: 'Motivos familiares' },
      { id: 'mudanca_rotina', label: 'Mudança repentina de rotina' },
      { id: 'compromissos_pessoais', label: 'Compromissos pessoais inadiáveis' },
    ],
  },
  {
    id: 'motivos_profissionais',
    label: 'Motivos profissionais',
    subPillars: [
      { id: 'outra_oportunidade', label: 'Outra oportunidade de emprego' },
      { id: 'conflito_jornada', label: 'Conflito com jornada do emprego atual' },
      { id: 'jornada_incompativel', label: 'Jornada de trabalho incompatível' },
    ],
  },
  {
    id: 'motivos_comportamentais',
    label: 'Motivos comportamentais / engajamento',
    subPillars: [
      { id: 'falta_interesse', label: 'Falta de interesse pelo produto' },
      { id: 'incompatibilidade_perfil', label: 'Incompatibilidade com o perfil da vaga' },
      { id: 'falta_engajamento', label: 'Falta de engajamento durante a trilha' },
      { id: 'quantidade_faltas', label: 'Quantidade de faltas' },
      { id: 'nao_adesao_regras', label: 'Não adesão às regras do treinamento' },
    ],
  },
  {
    id: 'motivos_estruturais',
    label: 'Motivos estruturais',
    subPillars: [
      { id: 'ausencia_home_office', label: 'Ausência de home office' },
      { id: 'equipamento_inadequado', label: 'Equipamento inadequado' },
      { id: 'falta_documentacao', label: 'Falta de documentação necessária' },
      { id: 'nao_entrega_documentacao', label: 'Não entrega das documentações necessárias' },
    ],
  },
];

// Helper function to get pillar by ID
export function getPillarById(id: string): Pillar | undefined {
  return pillars.find(p => p.id === id);
}

// Helper function to get sub-pillar by IDs
export function getSubPillarById(pillarId: string, subPillarId: string): SubPillar | undefined {
  const pillar = getPillarById(pillarId);
  return pillar?.subPillars.find(sp => sp.id === subPillarId);
}

// Helper function to get all sub-pillars for a pillar
export function getSubPillars(pillarId: string): SubPillar[] {
  const pillar = getPillarById(pillarId);
  return pillar?.subPillars || [];
}
