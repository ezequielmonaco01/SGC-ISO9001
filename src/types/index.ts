// Tipos principales para el Sistema de Gestión de la Calidad (SGC) - ISO 9001

export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  sector: Sector;
  type: DocumentType;
  status: DocumentStatus;
  version: string;
  author: string;
  lastModified: string;
}

export interface Process {
  id: string;
  name: string;
  description: string;
  sector: Sector;
  owner: string;
  status: ProcessStatus;
  lastReview: string;
  nextReview: string;
  version: string;
  steps: ProcessStep[];
}

export interface ProcessStep {
  id: string;
  name: string;
  description: string;
  responsible: string;
  estimatedTime: string;
  resources: string[];
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  sector: Sector;
  category: RiskCategory;
  probability: RiskLevel;
  impact: RiskLevel;
  riskLevel: RiskLevel;
  mitigation: string;
  responsible: string;
  status: RiskStatus;
  identifiedDate: string;
  reviewDate: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  sector: Sector;
  category: OpportunityCategory;
  priority: Priority;
  expectedBenefit: string;
  responsible: string;
  status: OpportunityStatus;
  identifiedDate: string;
  targetDate: string;
}

export interface PDCAItem {
  id: string;
  title: string;
  description: string;
  phase: PDCAPhase;
  sector: Sector;
  priority: Priority;
  responsible: string;
  status: PDCAStatus;
  plannedActions: string;
  actualResults: string;
  lessons: string;
  nextSteps: string;
  createdDate: string;
  lastUpdated: string;
  targetDate: string;
  completionDate?: string;
  results?: string;
  nextActions?: string;
}

export interface NonConformity {
  id: string;
  title: string;
  description: string;
  sector: Sector;
  severity: Severity;
  source: NonConformitySource;
  identifiedBy: string;
  identifiedDate: string;
  rootCause?: string;
  correctiveActions: CorrectiveAction[];
  status: NonConformityStatus;
  closeDate?: string;
}

export interface CorrectiveAction {
  id: string;
  description: string;
  responsible: string;
  targetDate: string;
  completionDate?: string;
  status: ActionStatus;
  verification?: string;
  effectiveness?: string;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  sector: Sector;
  currentValue: number;
  targetValue: number;
  unit: string;
  frequency: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
}

// Constantes para mayor consistencia de datos

export const Sector = {
  DESARROLLO: 'Desarrollo',
  QA: 'QA',
  ADMINISTRACION: 'Administración',
  RRHH: 'RRHH',
  DIRECCION: 'Dirección',
  COMERCIAL: 'Comercial'
} as const;

export type Sector = typeof Sector[keyof typeof Sector];

export const DocumentType = {
  PROCEDIMIENTO: 'Procedimiento',
  POLITICA: 'Política',
  MANUAL: 'Manual',
  INSTRUCTIVO: 'Instructivo',
  FORMATO: 'Formato',
  REGISTRO: 'Registro'
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

export const DocumentStatus = {
  ACTIVO: 'Activo',
  EN_REVISION: 'En Revisión',
  OBSOLETO: 'Obsoleto',
  BORRADOR: 'Borrador'
} as const;

export type DocumentStatus = typeof DocumentStatus[keyof typeof DocumentStatus];

export const ProcessStatus = {
  ACTIVO: 'Activo',
  EN_REVISION: 'En Revisión',
  OBSOLETO: 'Obsoleto',
  SUSPENDIDO: 'Suspendido'
} as const;

export type ProcessStatus = typeof ProcessStatus[keyof typeof ProcessStatus];

export const RiskCategory = {
  OPERACIONAL: 'Operacional',
  FINANCIERO: 'Financiero',
  TECNOLOGICO: 'Tecnológico',
  REPUTACIONAL: 'Reputacional',
  LEGAL: 'Legal',
  AMBIENTAL: 'Ambiental'
} as const;

export type RiskCategory = typeof RiskCategory[keyof typeof RiskCategory];

export const OpportunityCategory = {
  MEJORA_PROCESO: 'Mejora de Proceso',
  INNOVACION: 'Innovación',
  EXPANSION: 'Expansión',
  EFICIENCIA: 'Eficiencia',
  CLIENTE: 'Cliente',
  TALENTO: 'Talento'
} as const;

export type OpportunityCategory = typeof OpportunityCategory[keyof typeof OpportunityCategory];

export const RiskLevel = {
  MUY_BAJO: 'Muy Bajo',
  BAJO: 'Bajo',
  MEDIO: 'Medio',
  ALTO: 'Alto',
  MUY_ALTO: 'Muy Alto'
} as const;

export type RiskLevel = typeof RiskLevel[keyof typeof RiskLevel];

export const Priority = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica'
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export const RiskStatus = {
  IDENTIFICADO: 'Identificado',
  EN_TRATAMIENTO: 'En Tratamiento',
  MITIGADO: 'Mitigado',
  CERRADO: 'Cerrado'
} as const;

export type RiskStatus = typeof RiskStatus[keyof typeof RiskStatus];

export const OpportunityStatus = {
  IDENTIFICADA: 'Identificada',
  EN_EVALUACION: 'En Evaluación',
  EN_IMPLEMENTACION: 'En Implementación',
  IMPLEMENTADA: 'Implementada',
  CANCELADA: 'Cancelada'
} as const;

export type OpportunityStatus = typeof OpportunityStatus[keyof typeof OpportunityStatus];

export const PDCAPhase = {
  PLAN: 'Plan',
  DO: 'Do',
  CHECK: 'Check',
  ACT: 'Act'
} as const;

export type PDCAPhase = typeof PDCAPhase[keyof typeof PDCAPhase];

export const PDCAStatus = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En Progreso',
  COMPLETADO: 'Completado',
  BLOQUEADO: 'Bloqueado',
  PLANIFICADO: 'Planificado'
} as const;

export type PDCAStatus = typeof PDCAStatus[keyof typeof PDCAStatus];

export const Severity = {
  MENOR: 'Menor',
  MODERADA: 'Moderada',
  MAYOR: 'Mayor',
  CRITICA: 'Crítica'
} as const;

export type Severity = typeof Severity[keyof typeof Severity];

export const NonConformitySource = {
  AUDITORIA_INTERNA: 'Auditoría Interna',
  AUDITORIA_EXTERNA: 'Auditoría Externa',
  REVISION_DIRECCION: 'Revisión por la Dirección',
  QUEJA_CLIENTE: 'Queja de Cliente',
  AUTODETECCION: 'Autodetección',
  MEJORA_CONTINUA: 'Mejora Continua'
} as const;

export type NonConformitySource = typeof NonConformitySource[keyof typeof NonConformitySource];

export const NonConformityStatus = {
  ABIERTA: 'Abierta',
  EN_ANALISIS: 'En Análisis',
  EN_TRATAMIENTO: 'En Tratamiento',
  EN_VERIFICACION: 'En Verificación',
  CERRADA: 'Cerrada'
} as const;

export type NonConformityStatus = typeof NonConformityStatus[keyof typeof NonConformityStatus];

export const ActionStatus = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En Progreso',
  COMPLETADA: 'Completada',
  VENCIDA: 'Vencida'
} as const;

export type ActionStatus = typeof ActionStatus[keyof typeof ActionStatus];

// Tipos para el contexto de la aplicación
export interface AppState {
  documents: Document[];
  processes: Process[];
  risks: Risk[];
  opportunities: Opportunity[];
  pdcaItems: PDCAItem[];
  nonConformities: NonConformity[];
  kpis: KPI[];
  darkMode: boolean;
}

// Tipos para las acciones del contexto
export type AppAction =
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'ADD_PROCESS'; payload: Process }
  | { type: 'UPDATE_PROCESS'; payload: Process }
  | { type: 'DELETE_PROCESS'; payload: string }
  | { type: 'ADD_RISK'; payload: Risk }
  | { type: 'UPDATE_RISK'; payload: Risk }
  | { type: 'DELETE_RISK'; payload: string }
  | { type: 'ADD_OPPORTUNITY'; payload: Opportunity }
  | { type: 'UPDATE_OPPORTUNITY'; payload: Opportunity }
  | { type: 'DELETE_OPPORTUNITY'; payload: string }
  | { type: 'ADD_PDCA_ITEM'; payload: PDCAItem }
  | { type: 'UPDATE_PDCA_ITEM'; payload: PDCAItem }
  | { type: 'DELETE_PDCA_ITEM'; payload: string }
  | { type: 'ADD_NON_CONFORMITY'; payload: NonConformity }
  | { type: 'UPDATE_NON_CONFORMITY'; payload: NonConformity }
  | { type: 'DELETE_NON_CONFORMITY'; payload: string }
  | { type: 'UPDATE_KPI'; payload: KPI }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }; 