// Configuración del tema para Material UI con soporte claro/oscuro

import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Configuración base del tema
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
        },
        elevation3: {
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
  },
};

// Tema claro
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
});

// Tema oscuro
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: '#000000',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
      contrastText: '#000000',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
});

// Colores personalizados para el SGC
export const sgcColors = {
  // Estados de documentos
  status: {
    active: '#4caf50',
    review: '#ff9800',
    obsolete: '#f44336',
    draft: '#9e9e9e',
  },
  // Niveles de riesgo
  risk: {
    veryLow: '#4caf50',
    low: '#8bc34a',
    medium: '#ff9800',
    high: '#ff5722',
    veryHigh: '#f44336',
  },
  // Prioridades
  priority: {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#ff5722',
    critical: '#f44336',
  },
  // Fases PDCA
  pdca: {
    plan: '#2196f3',
    do: '#ff9800',
    check: '#9c27b0',
    act: '#4caf50',
  },
  // Sectores
  sectors: {
    desarrollo: '#2196f3',
    qa: '#9c27b0',
    administracion: '#4caf50',
    rrhh: '#ff9800',
    direccion: '#f44336',
    comercial: '#795548',
  },
};

// Función para obtener color por estado
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'activo':
    case 'completado':
    case 'mitigado':
    case 'cerrada':
    case 'implementada':
      return sgcColors.status.active;
    case 'en revisión':
    case 'en progreso':
    case 'en tratamiento':
    case 'en evaluación':
    case 'en implementación':
      return sgcColors.status.review;
    case 'obsoleto':
    case 'cancelada':
    case 'vencida':
      return sgcColors.status.obsolete;
    case 'borrador':
    case 'pendiente':
    case 'identificado':
    case 'identificada':
      return sgcColors.status.draft;
    default:
      return sgcColors.status.draft;
  }
};

// Función para obtener color por nivel de riesgo
export const getRiskColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'muy bajo':
      return sgcColors.risk.veryLow;
    case 'bajo':
      return sgcColors.risk.low;
    case 'medio':
      return sgcColors.risk.medium;
    case 'alto':
      return sgcColors.risk.high;
    case 'muy alto':
      return sgcColors.risk.veryHigh;
    default:
      return sgcColors.risk.medium;
  }
};

// Función para obtener color por prioridad
export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'baja':
      return sgcColors.priority.low;
    case 'media':
      return sgcColors.priority.medium;
    case 'alta':
      return sgcColors.priority.high;
    case 'crítica':
      return sgcColors.priority.critical;
    default:
      return sgcColors.priority.medium;
  }
};

// Función para obtener color por fase PDCA
export const getPDCAColor = (phase: string): string => {
  switch (phase.toLowerCase()) {
    case 'plan':
      return sgcColors.pdca.plan;
    case 'do':
      return sgcColors.pdca.do;
    case 'check':
      return sgcColors.pdca.check;
    case 'act':
      return sgcColors.pdca.act;
    default:
      return sgcColors.pdca.plan;
  }
}; 