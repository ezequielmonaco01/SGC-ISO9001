// Aplicación principal del Sistema de Gestión de la Calidad (SGC)

import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { lightTheme, darkTheme } from './theme/theme';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import DocumentManagement from './pages/Documents/DocumentManagement';
import ProcessManagement from './pages/Processes/ProcessManagement';
import RiskMatrix from './pages/RiskMatrix/RiskMatrix';
import PDCAManagement from './pages/PDCA/PDCAManagement';
import NonConformityManagement from './pages/NonConformities/NonConformityManagement';

// Componente interno que usa el contexto
const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Seleccionar tema según el estado
  const theme = state.darkMode ? darkTheme : lightTheme;

  // Función para manejar cambio de página
  const handlePageChange = (page: string): void => {
    setCurrentPage(page);
  };

  // Función para renderizar el contenido de la página actual
  const renderPageContent = (): React.ReactNode => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'documents':
        return <DocumentManagement />;
      case 'processes':
        return <ProcessManagement />;
      case 'risks':
      case 'opportunities':
        return <RiskMatrix />;
      case 'pdca':
        return <PDCAManagement />;
      case 'non-conformities':
        return <NonConformityManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
      >
        {renderPageContent()}
      </Layout>
    </ThemeProvider>
  );
};

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
