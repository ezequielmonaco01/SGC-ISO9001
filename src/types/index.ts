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

// Enums para mayor consistencia de datos

export enum Sector {
  DESARROLLO = 'Desarrollo',
  QA = 'QA',
  ADMINISTRACION = 'Administración',
  RRHH = 'RRHH',
  DIRECCION = 'Dirección',
  COMERCIAL = 'Comercial'
}

export enum DocumentType {
  PROCEDIMIENTO = 'Procedimiento',
  POLITICA = 'Política',
  MANUAL = 'Manual',
  INSTRUCTIVO = 'Instructivo',
  FORMATO = 'Formato',
  REGISTRO = 'Registro'
}

export enum DocumentStatus {
  ACTIVO = 'Activo',
  EN_REVISION = 'En Revisión',
  OBSOLETO = 'Obsoleto',
  BORRADOR = 'Borrador'
}

export enum ProcessStatus {
  ACTIVO = 'Activo',
  EN_REVISION = 'En Revisión',
  OBSOLETO = 'Obsoleto',
  SUSPENDIDO = 'Suspendido'
}

export enum RiskCategory {
  OPERACIONAL = 'Operacional',
  FINANCIERO = 'Financiero',
  TECNOLOGICO = 'Tecnológico',
  REPUTACIONAL = 'Reputacional',
  LEGAL = 'Legal',
  AMBIENTAL = 'Ambiental'
}

export enum OpportunityCategory {
  MEJORA_PROCESO = 'Mejora de Proceso',
  INNOVACION = 'Innovación',
  EXPANSION = 'Expansión',
  EFICIENCIA = 'Eficiencia',
  CLIENTE = 'Cliente',
  TALENTO = 'Talento'
}

export enum RiskLevel {
  MUY_BAJO = 'Muy Bajo',
  BAJO = 'Bajo',
  MEDIO = 'Medio',
  ALTO = 'Alto',
  MUY_ALTO = 'Muy Alto'
}

export enum Priority {
  BAJA = 'Baja',
  MEDIA = 'Media',
  ALTA = 'Alta',
  CRITICA = 'Crítica'
}

export enum RiskStatus {
  IDENTIFICADO = 'Identificado',
  EN_TRATAMIENTO = 'En Tratamiento',
  MITIGADO = 'Mitigado',
  CERRADO = 'Cerrado'
}

export enum OpportunityStatus {
  IDENTIFICADA = 'Identificada',
  EN_EVALUACION = 'En Evaluación',
  EN_IMPLEMENTACION = 'En Implementación',
  IMPLEMENTADA = 'Implementada',
  CANCELADA = 'Cancelada'
}

export enum PDCAPhase {
  PLAN = 'Plan',
  DO = 'Do',
  CHECK = 'Check',
  ACT = 'Act'
}

export enum PDCAStatus {
  PENDIENTE = 'Pendiente',
  EN_PROGRESO = 'En Progreso',
  COMPLETADO = 'Completado',
  BLOQUEADO = 'Bloqueado',
  PLANIFICADO = 'Planificado'
}

export enum Severity {
  MENOR = 'Menor',
  MODERADA = 'Moderada',
  MAYOR = 'Mayor',
  CRITICA = 'Crítica'
}

export enum NonConformitySource {
  AUDITORIA_INTERNA = 'Auditoría Interna',
  AUDITORIA_EXTERNA = 'Auditoría Externa',
  REVISION_DIRECCION = 'Revisión por la Dirección',
  QUEJA_CLIENTE = 'Queja de Cliente',
  AUTODETECCION = 'Autodetección',
  MEJORA_CONTINUA = 'Mejora Continua'
}

export enum NonConformityStatus {
  ABIERTA = 'Abierta',
  EN_ANALISIS = 'En Análisis',
  EN_TRATAMIENTO = 'En Tratamiento',
  EN_VERIFICACION = 'En Verificación',
  CERRADA = 'Cerrada'
}

export enum ActionStatus {
  PENDIENTE = 'Pendiente',
  EN_PROGRESO = 'En Progreso',
  COMPLETADA = 'Completada',
  VENCIDA = 'Vencida'
}

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