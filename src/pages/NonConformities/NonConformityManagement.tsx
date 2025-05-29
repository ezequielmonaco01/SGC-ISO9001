// Módulo de Gestión de No Conformidades del SGC

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ReportProblem as NonConformityIcon,
  PlayArrow as ActionIcon,
  CheckCircle as EffectivenessIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../contexts/AppContext';
import { getStatusColor } from '../../theme/theme';
import type { NonConformity, CorrectiveAction } from '../../types';
import { 
  Sector, 
  Severity,
  NonConformitySource,
  NonConformityStatus,
  ActionStatus,
} from '../../types';

// Interface para el formulario de no conformidad
interface NonConformityFormData {
  title: string;
  description: string;
  sector: Sector;
  severity: Severity;
  source: NonConformitySource;
  identifiedBy: string;
  rootCause: string;
}

// Interface para el formulario de acción correctiva
interface ActionFormData {
  description: string;
  responsible: string;
  targetDate: string;
  verification: string;
  effectiveness: string;
}

const NonConformityManagement: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [currentTab, setCurrentTab] = useState(0); // 0: No Conformidades, 1: Acciones, 2: Análisis
  const [currentSector, setCurrentSector] = useState<Sector | 'ALL'>('ALL');
  const [isNCModalOpen, setIsNCModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingNC, setEditingNC] = useState<NonConformity | null>(null);
  const [editingAction, setEditingAction] = useState<CorrectiveAction | null>(null);
  const [selectedNCForAction, setSelectedNCForAction] = useState<string>('');
  
  const [ncFormData, setNCFormData] = useState<NonConformityFormData>({
    title: '',
    description: '',
    sector: Sector.DESARROLLO,
    severity: Severity.MODERADA,
    source: NonConformitySource.AUTODETECCION,
    identifiedBy: '',
    rootCause: '',
  });

  const [actionFormData, setActionFormData] = useState<ActionFormData>({
    description: '',
    responsible: '',
    targetDate: '',
    verification: '',
    effectiveness: '',
  });

  // Filtrar datos por sector
  const filteredNCs = useMemo(() => {
    if (currentSector === 'ALL') return state.nonConformities;
    return state.nonConformities.filter(nc => nc.sector === currentSector);
  }, [state.nonConformities, currentSector]);

  // Estadísticas
  const ncStats = useMemo(() => {
    const total = filteredNCs.length;
    const open = filteredNCs.filter(nc => nc.status !== NonConformityStatus.CERRADA).length;
    const closed = filteredNCs.filter(nc => nc.status === NonConformityStatus.CERRADA).length;
    const critical = filteredNCs.filter(nc => nc.severity === Severity.CRITICA || nc.severity === Severity.MAYOR).length;
    const overdue = filteredNCs.filter(nc => {
      const hasOverdueActions = nc.correctiveActions.some(action => 
        action.status !== ActionStatus.COMPLETADA && 
        new Date(action.targetDate) < new Date()
      );
      return hasOverdueActions && nc.status !== NonConformityStatus.CERRADA;
    }).length;
    
    return { total, open, closed, critical, overdue };
  }, [filteredNCs]);

  // Estadísticas de acciones correctivas
  const actionStats = useMemo(() => {
    const allActions = filteredNCs.flatMap(nc => nc.correctiveActions);
    const total = allActions.length;
    const pending = allActions.filter(action => action.status === ActionStatus.PENDIENTE).length;
    const inProgress = allActions.filter(action => action.status === ActionStatus.EN_PROGRESO).length;
    const completed = allActions.filter(action => action.status === ActionStatus.COMPLETADA).length;
    const overdue = allActions.filter(action => 
      action.status !== ActionStatus.COMPLETADA && 
      new Date(action.targetDate) < new Date()
    ).length;
    
    return { total, pending, inProgress, completed, overdue };
  }, [filteredNCs]);

  // Manejadores
  const handleTabChange = (_: React.SyntheticEvent, newValue: number): void => {
    setCurrentTab(newValue);
  };

  const handleSectorChange = (_: React.SyntheticEvent, newValue: Sector | 'ALL'): void => {
    setCurrentSector(newValue);
  };

  // Manejadores de No Conformidades
  const handleAddNC = (): void => {
    setEditingNC(null);
    setNCFormData({
      title: '',
      description: '',
      sector: Sector.DESARROLLO,
      severity: Severity.MODERADA,
      source: NonConformitySource.AUTODETECCION,
      identifiedBy: '',
      rootCause: '',
    });
    setIsNCModalOpen(true);
  };

  const handleEditNC = (nc: NonConformity): void => {
    setEditingNC(nc);
    setNCFormData({
      title: nc.title,
      description: nc.description,
      sector: nc.sector,
      severity: nc.severity,
      source: nc.source,
      identifiedBy: nc.identifiedBy,
      rootCause: nc.rootCause || '',
    });
    setIsNCModalOpen(true);
  };

  const handleDeleteNC = (id: string): void => {
    if (window.confirm('¿Está seguro de que desea eliminar esta no conformidad?')) {
      dispatch({ type: 'DELETE_NON_CONFORMITY', payload: id });
    }
  };

  const handleSaveNC = (): void => {
    if (!ncFormData.title || !ncFormData.identifiedBy) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    
    if (editingNC) {
      const updatedNC: NonConformity = {
        ...editingNC,
        title: ncFormData.title,
        description: ncFormData.description,
        sector: ncFormData.sector,
        severity: ncFormData.severity,
        source: ncFormData.source,
        identifiedBy: ncFormData.identifiedBy,
        rootCause: ncFormData.rootCause,
      };
      dispatch({ type: 'UPDATE_NON_CONFORMITY', payload: updatedNC });
    } else {
      const newNC: NonConformity = {
        id: Date.now().toString(),
        title: ncFormData.title,
        description: ncFormData.description,
        sector: ncFormData.sector,
        severity: ncFormData.severity,
        source: ncFormData.source,
        identifiedBy: ncFormData.identifiedBy,
        identifiedDate: now,
        rootCause: ncFormData.rootCause,
        correctiveActions: [],
        status: NonConformityStatus.ABIERTA,
      };
      dispatch({ type: 'ADD_NON_CONFORMITY', payload: newNC });
    }

    setIsNCModalOpen(false);
  };

  // Manejadores de Acciones Correctivas
  const handleAddAction = (ncId: string): void => {
    setEditingAction(null);
    setSelectedNCForAction(ncId);
    setActionFormData({
      description: '',
      responsible: '',
      targetDate: '',
      verification: '',
      effectiveness: '',
    });
    setIsActionModalOpen(true);
  };

  const handleEditAction = (action: CorrectiveAction, ncId: string): void => {
    setEditingAction(action);
    setSelectedNCForAction(ncId);
    setActionFormData({
      description: action.description,
      responsible: action.responsible,
      targetDate: action.targetDate,
      verification: action.verification || '',
      effectiveness: action.effectiveness || '',
    });
    setIsActionModalOpen(true);
  };

  const handleDeleteAction = (actionId: string, ncId: string): void => {
    if (window.confirm('¿Está seguro de que desea eliminar esta acción correctiva?')) {
      const nc = state.nonConformities.find(nc => nc.id === ncId);
      if (nc) {
        const updatedNC: NonConformity = {
          ...nc,
          correctiveActions: nc.correctiveActions.filter(action => action.id !== actionId),
        };
        dispatch({ type: 'UPDATE_NON_CONFORMITY', payload: updatedNC });
      }
    }
  };

  const handleSaveAction = (): void => {
    if (!actionFormData.description || !actionFormData.responsible || !actionFormData.targetDate) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const nc = state.nonConformities.find(nc => nc.id === selectedNCForAction);
    if (!nc) return;

    if (editingAction) {
      // Actualizar acción existente
      const updatedActions = nc.correctiveActions.map(action =>
        action.id === editingAction.id
          ? {
              ...action,
              description: actionFormData.description,
              responsible: actionFormData.responsible,
              targetDate: actionFormData.targetDate,
              verification: actionFormData.verification,
              effectiveness: actionFormData.effectiveness,
            }
          : action
      );
      
      const updatedNC: NonConformity = {
        ...nc,
        correctiveActions: updatedActions,
      };
      dispatch({ type: 'UPDATE_NON_CONFORMITY', payload: updatedNC });
    } else {
      // Agregar nueva acción
      const newAction: CorrectiveAction = {
        id: Date.now().toString(),
        description: actionFormData.description,
        responsible: actionFormData.responsible,
        targetDate: actionFormData.targetDate,
        status: ActionStatus.PENDIENTE,
        verification: actionFormData.verification,
        effectiveness: actionFormData.effectiveness,
      };

      const updatedNC: NonConformity = {
        ...nc,
        correctiveActions: [...nc.correctiveActions, newAction],
        status: NonConformityStatus.EN_TRATAMIENTO,
      };
      dispatch({ type: 'UPDATE_NON_CONFORMITY', payload: updatedNC });
    }

    setIsActionModalOpen(false);
  };

  const handleNCFormChange = (field: keyof NonConformityFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ): void => {
    setNCFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleActionFormChange = (field: keyof ActionFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setActionFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Actualizar estado de acción
  const handleUpdateActionStatus = (actionId: string, ncId: string, newStatus: ActionStatus): void => {
    const nc = state.nonConformities.find(nc => nc.id === ncId);
    if (!nc) return;

    const updatedActions = nc.correctiveActions.map(action => {
      if (action.id === actionId) {
        return {
          ...action,
          status: newStatus,
          completionDate: newStatus === ActionStatus.COMPLETADA ? new Date().toISOString().split('T')[0] : action.completionDate,
        };
      }
      return action;
    });

    // Verificar si todas las acciones están completadas para cerrar la NC
    const allCompleted = updatedActions.every(action => action.status === ActionStatus.COMPLETADA);
    
    const updatedNC: NonConformity = {
      ...nc,
      correctiveActions: updatedActions,
      status: allCompleted ? NonConformityStatus.EN_VERIFICACION : nc.status,
      closeDate: allCompleted ? new Date().toISOString().split('T')[0] : nc.closeDate,
    };

    dispatch({ type: 'UPDATE_NON_CONFORMITY', payload: updatedNC });
  };

  // Cerrar no conformidad
  const handleCloseNC = (ncId: string): void => {
    if (window.confirm('¿Está seguro de que desea cerrar esta no conformidad? Verifique que todas las acciones hayan sido efectivas.')) {
      const nc = state.nonConformities.find(nc => nc.id === ncId);
      if (nc) {
        const updatedNC: NonConformity = {
          ...nc,
          status: NonConformityStatus.CERRADA,
          closeDate: new Date().toISOString().split('T')[0],
        };
        dispatch({ type: 'UPDATE_NON_CONFORMITY', payload: updatedNC });
      }
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Gestión de No Conformidades
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Control de no conformidades y acciones correctivas según ISO 9001
        </Typography>
      </Box>

      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NonConformityIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  No Conformidades
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {ncStats.total}
              </Typography>
              <Box display="flex" gap={1} mt={2}>
                <Chip label={`${ncStats.open} abiertas`} color="error" size="small" />
                <Chip label={`${ncStats.closed} cerradas`} color="success" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ActionIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Acciones Correctivas
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                {actionStats.total}
              </Typography>
              <Box display="flex" gap={1} mt={2}>
                <Chip label={`${actionStats.pending} pendientes`} color="warning" size="small" />
                <Chip label={`${actionStats.completed} completadas`} color="success" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ScheduleIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Críticas/Vencidas
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {ncStats.critical} / {actionStats.overdue}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NC Críticas / Acciones Vencidas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <EffectivenessIcon 
                  color={actionStats.total > 0 ? (actionStats.completed / actionStats.total > 0.8 ? 'success' : 'warning') : 'success'} 
                  sx={{ mr: 1 }} 
                />
                <Typography variant="h6" fontWeight="bold">
                  Efectividad
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                component="div" 
                fontWeight="bold" 
                color={actionStats.total > 0 ? (actionStats.completed / actionStats.total > 0.8 ? 'success.main' : 'warning.main') : 'success.main'}
              >
                {actionStats.total > 0 ? Math.round((actionStats.completed / actionStats.total) * 100) : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                de acciones completadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para diferentes vistas */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label={`No Conformidades (${filteredNCs.length})`} />
          <Tab label={`Acciones Correctivas (${actionStats.total})`} />
          <Tab label="Análisis y Tendencias" />
        </Tabs>
      </Paper>

      {/* Filtros por sector */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={currentSector}
          onChange={handleSectorChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab label="Todos los Sectores" value="ALL" />
          {Object.values(Sector).map((sector) => (
            <Tab key={sector} label={sector} value={sector} />
          ))}
        </Tabs>
      </Paper>

      {/* Acciones principales */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          {currentTab === 0 ? 'No Conformidades' : currentTab === 1 ? 'Acciones Correctivas' : 'Análisis'}
          {currentSector !== 'ALL' ? ` - ${currentSector}` : ''} 
        </Typography>
        {currentTab === 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNC}
            color="error"
          >
            Nueva No Conformidad
          </Button>
        )}
      </Box>

      {/* Contenido según tab activo */}
      {currentTab === 0 ? (
        // Lista de No Conformidades
        <Grid container spacing={3}>
          {filteredNCs.map((nc) => (
            <Grid size={12} key={nc.id}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" width="100%" mr={2}>
                    <Box flexGrow={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {nc.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {nc.description}
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip
                          label={nc.severity}
                          size="small"
                          color={nc.severity === Severity.CRITICA || nc.severity === Severity.MAYOR ? 'error' : 'warning'}
                        />
                        <Chip
                          label={nc.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(nc.status),
                            color: 'white',
                          }}
                        />
                        <Chip label={nc.sector} size="small" color="info" />
                        <Chip 
                          label={`${nc.correctiveActions.length} acciones`} 
                          size="small" 
                          color="primary" 
                        />
                      </Box>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => handleEditNC(nc)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteNC(nc.id)}>
                        <DeleteIcon />
                      </IconButton>
                      {nc.status !== NonConformityStatus.CERRADA && nc.correctiveActions.length > 0 && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => handleCloseNC(nc.id)}
                        >
                          Cerrar NC
                        </Button>
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Detalles de la No Conformidad
                      </Typography>
                      <Typography variant="body2"><strong>Fuente:</strong> {nc.source}</Typography>
                      <Typography variant="body2"><strong>Identificado por:</strong> {nc.identifiedBy}</Typography>
                      <Typography variant="body2"><strong>Fecha:</strong> {nc.identifiedDate}</Typography>
                      {nc.rootCause && (
                        <Typography variant="body2"><strong>Causa Raíz:</strong> {nc.rootCause}</Typography>
                      )}
                      {nc.closeDate && (
                        <Typography variant="body2"><strong>Fecha de Cierre:</strong> {nc.closeDate}</Typography>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Acciones Correctivas ({nc.correctiveActions.length})
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddAction(nc.id)}
                        >
                          Agregar Acción
                        </Button>
                      </Box>
                      
                      {nc.correctiveActions.length === 0 ? (
                        <Alert severity="warning">
                          No hay acciones correctivas definidas. Es necesario agregar al menos una acción.
                        </Alert>
                      ) : (
                        <List dense>
                          {nc.correctiveActions.map((action) => (
                            <ListItem key={action.id} divider>
                              <ListItemText
                                primary={action.description}
                                secondary={
                                  <Box>
                                    <Typography variant="caption" display="block">
                                      <strong>Responsable:</strong> {action.responsible}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      <strong>Fecha objetivo:</strong> {action.targetDate}
                                    </Typography>
                                    {action.completionDate && (
                                      <Typography variant="caption" display="block">
                                        <strong>Fecha completada:</strong> {action.completionDate}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                              <ListItemSecondaryAction>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select
                                      value={action.status}
                                      onChange={(e) => handleUpdateActionStatus(action.id, nc.id, e.target.value as ActionStatus)}
                                      size="small"
                                    >
                                      {Object.values(ActionStatus).map((status) => (
                                        <MenuItem key={status} value={status}>
                                          {status}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <IconButton size="small" onClick={() => handleEditAction(action, nc.id)}>
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteAction(action.id, nc.id)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
          
          {filteredNCs.length === 0 && (
            <Grid size={12}>
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                <NonConformityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay no conformidades registradas
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Las no conformidades son desviaciones de los requisitos del SGC que deben ser tratadas
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNC}>
                  Registrar Primera No Conformidad
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      ) : currentTab === 1 ? (
        // Lista de Acciones Correctivas
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Acción Correctiva</strong></TableCell>
                <TableCell><strong>No Conformidad</strong></TableCell>
                <TableCell><strong>Responsable</strong></TableCell>
                <TableCell><strong>Fecha Objetivo</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Progreso</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNCs.flatMap(nc => 
                nc.correctiveActions.map(action => ({ ...action, ncTitle: nc.title, ncId: nc.id }))
              ).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay acciones correctivas para mostrar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNCs.flatMap(nc => 
                  nc.correctiveActions.map(action => (
                    <TableRow key={`${nc.id}-${action.id}`} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {action.description}
                        </Typography>
                        {action.verification && (
                          <Typography variant="caption" color="text.secondary">
                            Verificación: {action.verification}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{nc.title}</Typography>
                      </TableCell>
                      <TableCell>{action.responsible}</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color={
                            action.status !== ActionStatus.COMPLETADA && new Date(action.targetDate) < new Date() 
                              ? 'error.main' 
                              : 'text.primary'
                          }
                        >
                          {action.targetDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={action.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(action.status),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {action.completionDate ? (
                          <Typography variant="body2" color="success.main">
                            Completada: {action.completionDate}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            En proceso...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1}>
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => handleEditAction(action, nc.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteAction(action.id, nc.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Análisis y tendencias
        <Grid container spacing={3}>
          <Grid size={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Análisis de No Conformidades y Tendencias
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>ISO 9001 - Mejora Continua:</strong> El análisis de no conformidades es esencial 
                para identificar oportunidades de mejora y prevenir recurrencias.
              </Alert>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Distribución por Severidad
                  </Typography>
                  {Object.values(Severity).map(severity => {
                    const count = filteredNCs.filter(nc => nc.severity === severity).length;
                    const percentage = filteredNCs.length > 0 ? (count / filteredNCs.length) * 100 : 0;
                    return (
                      <Box key={severity} mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">{severity}</Typography>
                          <Typography variant="body2">{count} ({percentage.toFixed(1)}%)</Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            position: 'relative',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              borderRadius: 4,
                              backgroundColor: severity === Severity.CRITICA ? 'error.main' : 
                                              severity === Severity.MAYOR ? 'warning.main' : 'info.main',
                              width: `${percentage}%`,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Distribución por Fuente
                  </Typography>
                  {Object.values(NonConformitySource).map(source => {
                    const count = filteredNCs.filter(nc => nc.source === source).length;
                    const percentage = filteredNCs.length > 0 ? (count / filteredNCs.length) * 100 : 0;
                    return (
                      <Box key={source} mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" fontSize="0.8rem">{source}</Typography>
                          <Typography variant="body2">{count} ({percentage.toFixed(1)}%)</Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            position: 'relative',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              borderRadius: 4,
                              backgroundColor: 'primary.main',
                              width: `${percentage}%`,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Recomendaciones de Mejora
              </Typography>
              
              <Grid container spacing={2}>
                {ncStats.critical > 0 && (
                  <Grid size={12}>
                    <Alert severity="error">
                      <strong>Acción Urgente:</strong> Hay {ncStats.critical} no conformidad(es) de severidad alta/crítica que requieren atención inmediata.
                    </Alert>
                  </Grid>
                )}
                
                {actionStats.overdue > 0 && (
                  <Grid size={12}>
                    <Alert severity="warning">
                      <strong>Seguimiento Requerido:</strong> Hay {actionStats.overdue} acción(es) correctiva(s) vencida(s). 
                      Revisar con los responsables el estado de avance.
                    </Alert>
                  </Grid>
                )}
                
                {ncStats.total > 0 && actionStats.completed / actionStats.total < 0.8 && (
                  <Grid size={12}>
                    <Alert severity="warning">
                      <strong>Efectividad Baja:</strong> La tasa de completitud de acciones correctivas está por debajo del 80%. 
                      Considerar revisar la planificación y seguimiento de las acciones.
                    </Alert>
                  </Grid>
                )}
                
                {ncStats.total === 0 && (
                  <Grid size={12}>
                    <Alert severity="success">
                      <strong>¡Excelente!</strong> No hay no conformidades registradas actualmente. 
                      Mantener los procesos de monitoreo y mejora continua.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Modal para agregar/editar no conformidad */}
      <Dialog 
        open={isNCModalOpen} 
        onClose={() => setIsNCModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingNC ? 'Editar No Conformidad' : 'Nueva No Conformidad'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Título de la No Conformidad *"
                value={ncFormData.title}
                onChange={handleNCFormChange('title')}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción detallada *"
                value={ncFormData.description}
                onChange={handleNCFormChange('description')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Sector *</InputLabel>
                <Select
                  value={ncFormData.sector}
                  label="Sector *"
                  onChange={handleNCFormChange('sector')}
                >
                  {Object.values(Sector).map((sector) => (
                    <MenuItem key={sector} value={sector}>
                      {sector}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Severidad</InputLabel>
                <Select
                  value={ncFormData.severity}
                  label="Severidad"
                  onChange={handleNCFormChange('severity')}
                >
                  {Object.values(Severity).map((severity) => (
                    <MenuItem key={severity} value={severity}>
                      {severity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Fuente de Detección</InputLabel>
                <Select
                  value={ncFormData.source}
                  label="Fuente de Detección"
                  onChange={handleNCFormChange('source')}
                >
                  {Object.values(NonConformitySource).map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Identificado por *"
                value={ncFormData.identifiedBy}
                onChange={handleNCFormChange('identifiedBy')}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Análisis de Causa Raíz"
                value={ncFormData.rootCause}
                onChange={handleNCFormChange('rootCause')}
                helperText="Identifique la(s) causa(s) fundamental(es) que originaron la no conformidad"
              />
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <strong>Siguiente paso:</strong> Después de registrar la no conformidad, defina las acciones correctivas necesarias 
            para eliminar la causa y prevenir la recurrencia.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNCModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleSaveNC}>
            {editingNC ? 'Actualizar' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para agregar/editar acción correctiva */}
      <Dialog 
        open={isActionModalOpen} 
        onClose={() => setIsActionModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAction ? 'Editar Acción Correctiva' : 'Nueva Acción Correctiva'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción de la Acción *"
                value={actionFormData.description}
                onChange={handleActionFormChange('description')}
                helperText="Describa claramente qué se debe hacer para corregir la no conformidad"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Responsable *"
                value={actionFormData.responsible}
                onChange={handleActionFormChange('responsible')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Objetivo *"
                value={actionFormData.targetDate}
                onChange={handleActionFormChange('targetDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Método de Verificación"
                value={actionFormData.verification}
                onChange={handleActionFormChange('verification')}
                helperText="Cómo se verificará que la acción fue implementada correctamente"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Evaluación de Efectividad"
                value={actionFormData.effectiveness}
                onChange={handleActionFormChange('effectiveness')}
                helperText="Cómo se medirá la efectividad de la acción para prevenir recurrencias"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsActionModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveAction}>
            {editingAction ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NonConformityManagement; 