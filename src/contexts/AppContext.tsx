// Contexto principal para el Sistema de Gestión de la Calidad (SGC)

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction } from '../types';
import { getInitialData } from '../mocks/data';

// Tipo para el contexto
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Crear el contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer para manejar las acciones del estado
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Acciones para documentos
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload]
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        )
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload)
      };

    // Acciones para procesos
    case 'ADD_PROCESS':
      return {
        ...state,
        processes: [...state.processes, action.payload]
      };
    case 'UPDATE_PROCESS':
      return {
        ...state,
        processes: state.processes.map(process =>
          process.id === action.payload.id ? action.payload : process
        )
      };
    case 'DELETE_PROCESS':
      return {
        ...state,
        processes: state.processes.filter(process => process.id !== action.payload)
      };

    // Acciones para riesgos
    case 'ADD_RISK':
      return {
        ...state,
        risks: [...state.risks, action.payload]
      };
    case 'UPDATE_RISK':
      return {
        ...state,
        risks: state.risks.map(risk =>
          risk.id === action.payload.id ? action.payload : risk
        )
      };
    case 'DELETE_RISK':
      return {
        ...state,
        risks: state.risks.filter(risk => risk.id !== action.payload)
      };

    // Acciones para oportunidades
    case 'ADD_OPPORTUNITY':
      return {
        ...state,
        opportunities: [...state.opportunities, action.payload]
      };
    case 'UPDATE_OPPORTUNITY':
      return {
        ...state,
        opportunities: state.opportunities.map(opportunity =>
          opportunity.id === action.payload.id ? action.payload : opportunity
        )
      };
    case 'DELETE_OPPORTUNITY':
      return {
        ...state,
        opportunities: state.opportunities.filter(opportunity => opportunity.id !== action.payload)
      };

    // Acciones para PDCA
    case 'ADD_PDCA_ITEM':
      return {
        ...state,
        pdcaItems: [...state.pdcaItems, action.payload]
      };
    case 'UPDATE_PDCA_ITEM':
      return {
        ...state,
        pdcaItems: state.pdcaItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_PDCA_ITEM':
      return {
        ...state,
        pdcaItems: state.pdcaItems.filter(item => item.id !== action.payload)
      };

    // Acciones para no conformidades
    case 'ADD_NON_CONFORMITY':
      return {
        ...state,
        nonConformities: [...state.nonConformities, action.payload]
      };
    case 'UPDATE_NON_CONFORMITY':
      return {
        ...state,
        nonConformities: state.nonConformities.map(nc =>
          nc.id === action.payload.id ? action.payload : nc
        )
      };
    case 'DELETE_NON_CONFORMITY':
      return {
        ...state,
        nonConformities: state.nonConformities.filter(nc => nc.id !== action.payload)
      };

    // Acciones para KPIs
    case 'UPDATE_KPI':
      return {
        ...state,
        kpis: state.kpis.map(kpi =>
          kpi.id === action.payload.id ? action.payload : kpi
        )
      };

    // Acciones generales
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode
      };

    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

// Hook personalizado para usar el contexto
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};

// Función para cargar datos del localStorage
const loadStoredData = (): Partial<AppState> => {
  try {
    const storedData = localStorage.getItem('sgc-data');
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error cargando datos del localStorage:', error);
  }
  return {};
};

// Función para guardar datos en localStorage
const saveDataToStorage = (state: AppState): void => {
  try {
    localStorage.setItem('sgc-data', JSON.stringify(state));
  } catch (error) {
    console.error('Error guardando datos en localStorage:', error);
  }
};

// Proveedor del contexto
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Inicializar estado con datos mock y datos guardados
  const initialState: AppState = {
    ...getInitialData(),
    ...loadStoredData()
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Efecto para guardar datos en localStorage cuando el estado cambie
  useEffect(() => {
    saveDataToStorage(state);
  }, [state]);

  const value: AppContextType = {
    state,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 