// Datos mock para el Sistema de Gestión de la Calidad (SGC)

import type {
  Document,
  Process,
  Risk,
  Opportunity,
  PDCAItem,
  NonConformity,
  KPI,
} from '../types';
import {
  Sector,
  DocumentType,
  DocumentStatus,
  ProcessStatus,
  RiskCategory,
  RiskLevel,
  RiskStatus,
  OpportunityCategory,
  Priority,
  OpportunityStatus,
  PDCAPhase,
  PDCAStatus,
  Severity,
  NonConformitySource,
  NonConformityStatus,
  ActionStatus
} from '../types';

// Documentos mock
export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Manual de Calidad',
    description: 'Manual principal del Sistema de Gestión de la Calidad',
    fileName: 'manual-calidad-v3.1.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2024-01-15',
    sector: Sector.DIRECCION,
    type: DocumentType.MANUAL,
    status: DocumentStatus.ACTIVO,
    version: '3.1',
    author: 'María González',
    lastModified: '2024-01-15'
  },
  {
    id: '2',
    title: 'Procedimiento de Desarrollo de Software',
    description: 'Procedimiento para el ciclo de vida del desarrollo de software',
    fileName: 'proc-desarrollo-sw-v2.3.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2024-02-10',
    sector: Sector.DESARROLLO,
    type: DocumentType.PROCEDIMIENTO,
    status: DocumentStatus.ACTIVO,
    version: '2.3',
    author: 'Carlos Rodríguez',
    lastModified: '2024-02-10'
  },
  {
    id: '3',
    title: 'Política de Testing',
    description: 'Política para asegurar la calidad en las pruebas de software',
    fileName: 'politica-testing-v1.5.pdf',
    fileSize: '850 KB',
    uploadDate: '2024-01-20',
    sector: Sector.QA,
    type: DocumentType.POLITICA,
    status: DocumentStatus.ACTIVO,
    version: '1.5',
    author: 'Ana López',
    lastModified: '2024-01-20'
  },
  {
    id: '4',
    title: 'Instructivo de Reclutamiento',
    description: 'Instructivo para el proceso de selección de personal',
    fileName: 'inst-reclutamiento-v1.2.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2024-03-05',
    sector: Sector.RRHH,
    type: DocumentType.INSTRUCTIVO,
    status: DocumentStatus.EN_REVISION,
    version: '1.2',
    author: 'Laura Martínez',
    lastModified: '2024-03-05'
  }
];

// Procesos mock
export const mockProcesses: Process[] = [
  {
    id: '1',
    name: 'Desarrollo de Software',
    description: 'Proceso integral para el desarrollo de aplicaciones de software',
    sector: Sector.DESARROLLO,
    owner: 'Carlos Rodríguez',
    status: ProcessStatus.ACTIVO,
    lastReview: '2024-01-15',
    nextReview: '2024-07-15',
    version: '2.1',
    steps: [
      {
        id: '1-1',
        name: 'Análisis de Requerimientos',
        description: 'Relevamiento y documentación de requerimientos del cliente',
        responsible: 'Analista Funcional',
        estimatedTime: '2-3 días',
        resources: ['Documento de requerimientos', 'Entrevistas con cliente']
      },
      {
        id: '1-2',
        name: 'Diseño de Arquitectura',
        description: 'Definición de la arquitectura técnica de la solución',
        responsible: 'Arquitecto de Software',
        estimatedTime: '1-2 días',
        resources: ['Herramientas de diseño', 'Patrones de arquitectura']
      },
      {
        id: '1-3',
        name: 'Implementación',
        description: 'Codificación de la solución según especificaciones',
        responsible: 'Desarrollador',
        estimatedTime: '5-10 días',
        resources: ['IDE', 'Frameworks', 'Librerías']
      }
    ]
  },
  {
    id: '2',
    name: 'Testing y QA',
    description: 'Proceso de aseguramiento de la calidad del software',
    sector: Sector.QA,
    owner: 'Ana López',
    status: ProcessStatus.ACTIVO,
    lastReview: '2024-02-01',
    nextReview: '2024-08-01',
    version: '1.8',
    steps: [
      {
        id: '2-1',
        name: 'Planificación de Pruebas',
        description: 'Diseño del plan de pruebas y casos de test',
        responsible: 'QA Lead',
        estimatedTime: '1-2 días',
        resources: ['Casos de prueba', 'Herramientas de testing']
      },
      {
        id: '2-2',
        name: 'Ejecución de Pruebas',
        description: 'Ejecución de casos de prueba manuales y automatizados',
        responsible: 'QA Tester',
        estimatedTime: '3-5 días',
        resources: ['Ambiente de testing', 'Datos de prueba']
      }
    ]
  }
];

// Riesgos mock
export const mockRisks: Risk[] = [
  {
    id: '1',
    title: 'Falla en Servidores de Producción',
    description: 'Riesgo de caída de servidores que afecte la disponibilidad del servicio',
    sector: Sector.DESARROLLO,
    category: RiskCategory.TECNOLOGICO,
    probability: RiskLevel.MEDIO,
    impact: RiskLevel.ALTO,
    riskLevel: RiskLevel.ALTO,
    mitigation: 'Implementar redundancia y monitoreo 24/7',
    responsible: 'Jefe de Infraestructura',
    status: RiskStatus.EN_TRATAMIENTO,
    identifiedDate: '2024-01-10',
    reviewDate: '2024-04-10'
  },
  {
    id: '2',
    title: 'Rotación de Personal Clave',
    description: 'Pérdida de conocimiento crítico por salida de empleados senior',
    sector: Sector.RRHH,
    category: RiskCategory.OPERACIONAL,
    probability: RiskLevel.MEDIO,
    impact: RiskLevel.MEDIO,
    riskLevel: RiskLevel.MEDIO,
    mitigation: 'Programa de mentorías y documentación del conocimiento',
    responsible: 'Gerente de RRHH',
    status: RiskStatus.IDENTIFICADO,
    identifiedDate: '2024-02-05',
    reviewDate: '2024-05-05'
  },
  {
    id: '3',
    title: 'Vulnerabilidades de Seguridad',
    description: 'Potenciales brechas de seguridad en las aplicaciones desarrolladas',
    sector: Sector.QA,
    category: RiskCategory.TECNOLOGICO,
    probability: RiskLevel.BAJO,
    impact: RiskLevel.MUY_ALTO,
    riskLevel: RiskLevel.ALTO,
    mitigation: 'Auditorías de seguridad regulares y capacitación en desarrollo seguro',
    responsible: 'Security Officer',
    status: RiskStatus.MITIGADO,
    identifiedDate: '2024-01-20',
    reviewDate: '2024-04-20'
  }
];

// Oportunidades mock
export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Automatización de Pruebas',
    description: 'Implementar herramientas de testing automatizado para mejorar eficiencia',
    sector: Sector.QA,
    category: OpportunityCategory.EFICIENCIA,
    priority: Priority.ALTA,
    expectedBenefit: 'Reducción del 40% en tiempo de testing y mejora en cobertura',
    responsible: 'Ana López',
    status: OpportunityStatus.EN_IMPLEMENTACION,
    identifiedDate: '2024-01-15',
    targetDate: '2024-06-30'
  },
  {
    id: '2',
    title: 'Capacitación en Metodologías Ágiles',
    description: 'Formar equipos en Scrum y Kanban para mejorar productividad',
    sector: Sector.DESARROLLO,
    category: OpportunityCategory.MEJORA_PROCESO,
    priority: Priority.MEDIA,
    expectedBenefit: 'Mejora en tiempos de entrega y satisfacción del cliente',
    responsible: 'Carlos Rodríguez',
    status: OpportunityStatus.IDENTIFICADA,
    identifiedDate: '2024-02-01',
    targetDate: '2024-08-31'
  },
  {
    id: '3',
    title: 'Programa de Retención de Talento',
    description: 'Desarrollar beneficios adicionales para retener empleados clave',
    sector: Sector.RRHH,
    category: OpportunityCategory.TALENTO,
    priority: Priority.ALTA,
    expectedBenefit: 'Reducción del 30% en rotación de personal',
    responsible: 'Laura Martínez',
    status: OpportunityStatus.EN_EVALUACION,
    identifiedDate: '2024-02-10',
    targetDate: '2024-12-31'
  }
];

// Items PDCA mock
export const mockPDCAItems: PDCAItem[] = [
  {
    id: '1',
    title: 'Mejora en Proceso de Testing',
    description: 'Optimizar el proceso de testing para reducir defectos',
    phase: PDCAPhase.DO,
    sector: Sector.QA,
    responsible: 'Ana López',
    status: PDCAStatus.EN_PROGRESO,
    startDate: '2024-01-15',
    targetDate: '2024-06-15',
    results: 'Implementación de nuevas herramientas de testing automatizado'
  },
  {
    id: '2',
    title: 'Estandarización de Documentación',
    description: 'Unificar formatos y plantillas de documentos técnicos',
    phase: PDCAPhase.PLAN,
    sector: Sector.DESARROLLO,
    responsible: 'Carlos Rodríguez',
    status: PDCAStatus.PENDIENTE,
    startDate: '2024-03-01',
    targetDate: '2024-09-01'
  },
  {
    id: '3',
    title: 'Evaluación de Satisfacción del Cliente',
    description: 'Implementar encuestas regulares de satisfacción',
    phase: PDCAPhase.CHECK,
    sector: Sector.COMERCIAL,
    responsible: 'Roberto Silva',
    status: PDCAStatus.COMPLETADO,
    startDate: '2024-01-01',
    targetDate: '2024-03-31',
    completionDate: '2024-03-25',
    results: 'Índice de satisfacción del 92%, identificadas 3 áreas de mejora',
    nextActions: 'Implementar plan de acción para áreas identificadas'
  }
];

// No conformidades mock
export const mockNonConformities: NonConformity[] = [
  {
    id: '1',
    title: 'Falta de Validación en Formularios',
    description: 'Se detectó falta de validación en formularios de entrada de datos',
    sector: Sector.DESARROLLO,
    severity: Severity.MODERADA,
    source: NonConformitySource.AUDITORIA_INTERNA,
    identifiedBy: 'Ana López',
    identifiedDate: '2024-02-15',
    rootCause: 'Ausencia de checklist de validación en el proceso de desarrollo',
    status: NonConformityStatus.EN_TRATAMIENTO,
    correctiveActions: [
      {
        id: '1-1',
        description: 'Crear checklist de validaciones obligatorias',
        responsible: 'Carlos Rodríguez',
        targetDate: '2024-04-01',
        status: ActionStatus.EN_PROGRESO
      },
      {
        id: '1-2',
        description: 'Capacitar equipo en mejores prácticas de validación',
        responsible: 'Tech Lead',
        targetDate: '2024-04-15',
        status: ActionStatus.PENDIENTE
      }
    ]
  },
  {
    id: '2',
    title: 'Documentos Desactualizados',
    description: 'Se encontraron procedimientos con versiones obsoletas en uso',
    sector: Sector.ADMINISTRACION,
    severity: Severity.MENOR,
    source: NonConformitySource.REVISION_DIRECCION,
    identifiedBy: 'María González',
    identifiedDate: '2024-01-30',
    rootCause: 'Falta de proceso de control de versiones documentales',
    status: NonConformityStatus.CERRADA,
    closeDate: '2024-03-15',
    correctiveActions: [
      {
        id: '2-1',
        description: 'Implementar sistema de control de versiones',
        responsible: 'Responsable de Calidad',
        targetDate: '2024-03-01',
        completionDate: '2024-02-28',
        status: ActionStatus.COMPLETADA,
        verification: 'Sistema implementado y funcionando correctamente',
        effectiveness: 'Reducción del 95% en uso de documentos obsoletos'
      }
    ]
  }
];

// KPIs mock
export const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Defectos por Release',
    description: 'Cantidad de defectos encontrados por versión liberada',
    sector: Sector.QA,
    currentValue: 3.2,
    targetValue: 2.0,
    unit: 'defectos',
    frequency: 'Por release',
    trend: 'down',
    lastUpdate: '2024-03-15'
  },
  {
    id: '2',
    name: 'Tiempo de Resolución de Issues',
    description: 'Tiempo promedio para resolver issues críticos',
    sector: Sector.DESARROLLO,
    currentValue: 4.5,
    targetValue: 3.0,
    unit: 'horas',
    frequency: 'Semanal',
    trend: 'down',
    lastUpdate: '2024-03-20'
  },
  {
    id: '3',
    name: 'Satisfacción del Cliente',
    description: 'Índice de satisfacción basado en encuestas',
    sector: Sector.COMERCIAL,
    currentValue: 92,
    targetValue: 95,
    unit: '%',
    frequency: 'Mensual',
    trend: 'up',
    lastUpdate: '2024-03-01'
  },
  {
    id: '4',
    name: 'Rotación de Personal',
    description: 'Porcentaje anual de rotación de empleados',
    sector: Sector.RRHH,
    currentValue: 8.5,
    targetValue: 5.0,
    unit: '%',
    frequency: 'Anual',
    trend: 'stable',
    lastUpdate: '2024-02-29'
  },
  {
    id: '5',
    name: 'Cobertura de Testing',
    description: 'Porcentaje de código cubierto por pruebas automatizadas',
    sector: Sector.QA,
    currentValue: 78,
    targetValue: 85,
    unit: '%',
    frequency: 'Por sprint',
    trend: 'up',
    lastUpdate: '2024-03-18'
  },
  {
    id: '6',
    name: 'Cumplimiento de Deadlines',
    description: 'Porcentaje de proyectos entregados a tiempo',
    sector: Sector.DESARROLLO,
    currentValue: 85,
    targetValue: 90,
    unit: '%',
    frequency: 'Mensual',
    trend: 'up',
    lastUpdate: '2024-03-20'
  }
];

// Función para obtener datos iniciales
export const getInitialData = () => ({
  documents: mockDocuments,
  processes: mockProcesses,
  risks: mockRisks,
  opportunities: mockOpportunities,
  pdcaItems: mockPDCAItems,
  nonConformities: mockNonConformities,
  kpis: mockKPIs,
  darkMode: false
}); 