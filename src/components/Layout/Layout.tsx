// Componente Layout principal del SGC con navegación lateral

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  AccountTree as ProcessIcon,
  Warning as RiskIcon,
  TrendingUp as OpportunityIcon,
  Loop as PDCAIcon,
  ReportProblem as NonConformityIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Assessment as QualityIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../contexts/AppContext';

// Ancho del drawer
const DRAWER_WIDTH = 280;

// Interfaces
interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  description: string;
}

// Items de navegación
const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    description: 'Panel de indicadores y resumen ejecutivo'
  },
  {
    id: 'documents',
    label: 'Gestión Documental',
    icon: <DocumentIcon />,
    description: 'Documentos por sector y control de versiones'
  },
  {
    id: 'processes',
    label: 'Procesos',
    icon: <ProcessIcon />,
    description: 'Gestión y seguimiento de procesos organizacionales'
  },
  {
    id: 'risks',
    label: 'Matriz de Riesgos',
    icon: <RiskIcon />,
    description: 'Identificación y tratamiento de riesgos'
  },
  {
    id: 'opportunities',
    label: 'Oportunidades',
    icon: <OpportunityIcon />,
    description: 'Gestión de oportunidades de mejora'
  },
  {
    id: 'pdca',
    label: 'Ciclo PDCA',
    icon: <PDCAIcon />,
    description: 'Planificar, Hacer, Verificar, Actuar'
  },
  {
    id: 'non-conformities',
    label: 'No Conformidades',
    icon: <NonConformityIcon />,
    description: 'Gestión de no conformidades y acciones correctivas'
  },
];

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, dispatch } = useAppContext();
  
  // Estado local para controlar el drawer en móviles
  const [mobileOpen, setMobileOpen] = useState(false);

  // Manejador para toggle del drawer móvil
  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  // Manejador para cambio de página
  const handlePageChange = (pageId: string): void => {
    onPageChange(pageId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Manejador para toggle del tema
  const handleThemeToggle = (): void => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  // Contenido del drawer
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del drawer */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <QualityIcon sx={{ mr: 2, fontSize: 32 }} />
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            SGC ISO 9001
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Sistema de Gestión de Calidad
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Lista de navegación */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {navigationItems.map((item) => (
          <Tooltip
            key={item.id}
            title={item.description}
            placement="right"
            arrow
          >
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={currentPage === item.id}
                onClick={() => handlePageChange(item.id)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: currentPage === item.id 
                      ? theme.palette.primary.contrastText 
                      : 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: currentPage === item.id ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider />

      {/* Footer del drawer */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Versión 1.0.0
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          © 2024 Software Factory
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: theme.zIndex.drawer + 1,
          borderRadius: 0
        }}
      >
        <Toolbar>
          {/* Botón de menú para móviles */}
          <IconButton
            color="inherit"
            aria-label="abrir menú de navegación"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Título de la página actual */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {navigationItems.find(item => item.id === currentPage)?.label || 'SGC'}
          </Typography>

          {/* Toggle de tema */}
          <Tooltip title={state.darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              aria-label="cambiar tema"
            >
              {state.darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Drawer de navegación */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Drawer temporal para móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejor rendimiento en móviles
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Drawer permanente para desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Spacer para el AppBar */}
        <Toolbar />
        
        {/* Contenido de la página */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 