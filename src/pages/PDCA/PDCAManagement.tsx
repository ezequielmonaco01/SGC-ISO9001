// Módulo del Ciclo PDCA (Plan-Do-Check-Act) del SGC

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
  LinearProgress,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PlayCircle as PlanIcon,
  Build as DoIcon,
  Assessment as CheckIcon,
  Loop as ActIcon,
  TrendingUp as ImprovementIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../contexts/AppContext';
import { getStatusColor, getPriorityColor } from '../../theme/theme';
import type { PDCAItem } from '../../types';
import { 
  Sector, 
  PDCAPhase,
  PDCAStatus,
  Priority,
} from '../../types';

// Interface para el formulario de PDCA
interface PDCAFormData {
  title: string;
  description: string;
  sector: Sector;
  phase: PDCAPhase;
  status: PDCAStatus;
  priority: Priority;
  responsible: string;
  plannedActions: string;
  actualResults: string;
  lessons: string;
  nextSteps: string;
  targetDate: string;
}

// Información de las fases PDCA
const phaseInfo = {
  [PDCAPhase.PLAN]: {
    title: 'Planificar',
    description: 'Identificar problemas y planificar mejoras',
    color: '#2196F3',
    icon: PlanIcon,
  },
  [PDCAPhase.DO]: {
    title: 'Hacer',
    description: 'Implementar las acciones planificadas',
    color: '#FF9800',
    icon: DoIcon,
  },
  [PDCAPhase.CHECK]: {
    title: 'Verificar',
    description: 'Evaluar los resultados obtenidos',
    color: '#4CAF50',
    icon: CheckIcon,
  },
  [PDCAPhase.ACT]: {
    title: 'Actuar',
    description: 'Estandarizar mejoras y planificar el siguiente ciclo',
    color: '#9C27B0',
    icon: ActIcon,
  },
};

const PDCAManagement: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [currentTab, setCurrentTab] = useState(0); // 0: Por Fase, 1: Por Estado, 2: General
  const [currentSector, setCurrentSector] = useState<Sector | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PDCAItem | null>(null);
  
  const [formData, setFormData] = useState<PDCAFormData>({
    title: '',
    description: '',
    sector: Sector.DESARROLLO,
    phase: PDCAPhase.PLAN,
    status: PDCAStatus.PLANIFICADO,
    priority: Priority.MEDIA,
    responsible: '',
    plannedActions: '',
    actualResults: '',
    lessons: '',
    nextSteps: '',
    targetDate: '',
  });

  // Filtrar datos por sector
  const filteredItems = useMemo(() => {
    if (currentSector === 'ALL') return state.pdcaItems;
    return state.pdcaItems.filter(item => item.sector === currentSector);
  }, [state.pdcaItems, currentSector]);

  // Estadísticas por fase
  const phaseStats = useMemo(() => {
    const stats = Object.values(PDCAPhase).map(phase => ({
      phase,
      total: filteredItems.filter(item => item.phase === phase).length,
      active: filteredItems.filter(item => item.phase === phase && item.status !== PDCAStatus.COMPLETADO).length,
      completed: filteredItems.filter(item => item.phase === phase && item.status === PDCAStatus.COMPLETADO).length,
    }));
    
    return stats;
  }, [filteredItems]);

  // Estadísticas generales
  const generalStats = useMemo(() => {
    const total = filteredItems.length;
    const completed = filteredItems.filter(item => item.status === PDCAStatus.COMPLETADO).length;
    const inProgress = filteredItems.filter(item => item.status === PDCAStatus.EN_PROGRESO).length;
    const planned = filteredItems.filter(item => item.status === PDCAStatus.PLANIFICADO).length;
    const highPriority = filteredItems.filter(item => item.priority === Priority.ALTA || item.priority === Priority.CRITICA).length;
    
    return { total, completed, inProgress, planned, highPriority };
  }, [filteredItems]);

  // Calcular progreso de un ciclo PDCA
  const calculateProgress = (item: PDCAItem): number => {
    const phaseValues = {
      [PDCAPhase.PLAN]: 25,
      [PDCAPhase.DO]: 50,
      [PDCAPhase.CHECK]: 75,
      [PDCAPhase.ACT]: 100,
    };
    
    let progress = phaseValues[item.phase];
    
    if (item.status === PDCAStatus.COMPLETADO) {
      progress = 100;
    } else if (item.status === PDCAStatus.EN_PROGRESO) {
      progress = progress - 10; // Reducir si está en progreso pero no completado
    } else if (item.status === PDCAStatus.PLANIFICADO) {
      progress = Math.max(0, progress - 20); // Reducir más si solo está planificado
    }
    
    return progress;
  };

  // Manejadores
  const handleTabChange = (_: React.SyntheticEvent, newValue: number): void => {
    setCurrentTab(newValue);
  };

  const handleSectorChange = (_: React.SyntheticEvent, newValue: Sector | 'ALL'): void => {
    setCurrentSector(newValue);
  };

  const handleAddItem = (): void => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      sector: Sector.DESARROLLO,
      phase: PDCAPhase.PLAN,
      status: PDCAStatus.PLANIFICADO,
      priority: Priority.MEDIA,
      responsible: '',
      plannedActions: '',
      actualResults: '',
      lessons: '',
      nextSteps: '',
      targetDate: '',
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: PDCAItem): void => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      sector: item.sector,
      phase: item.phase,
      status: item.status,
      priority: item.priority,
      responsible: item.responsible,
      plannedActions: item.plannedActions,
      actualResults: item.actualResults,
      lessons: item.lessons,
      nextSteps: item.nextSteps,
      targetDate: item.targetDate,
    });
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id: string): void => {
    if (window.confirm('¿Está seguro de que desea eliminar este elemento del ciclo PDCA?')) {
      dispatch({ type: 'DELETE_PDCA_ITEM', payload: id });
    }
  };

  const handleSaveItem = (): void => {
    if (!formData.title || !formData.responsible) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    
    if (editingItem) {
      const updatedItem: PDCAItem = {
        ...editingItem,
        ...formData,
        lastUpdated: now,
      };
      dispatch({ type: 'UPDATE_PDCA_ITEM', payload: updatedItem });
    } else {
      const newItem: PDCAItem = {
        id: Date.now().toString(),
        ...formData,
        createdDate: now,
        lastUpdated: now,
      };
      dispatch({ type: 'ADD_PDCA_ITEM', payload: newItem });
    }

    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof PDCAFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Renderizar visualización de ciclo PDCA
  const renderPDCACycle = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Visualización del Ciclo PDCA
        </Typography>
        <Grid container spacing={3}>
          {Object.values(PDCAPhase).map((phase) => {
            const info = phaseInfo[phase];
            const phaseItems = filteredItems.filter(item => item.phase === phase);
            const Icon = info.icon;
            
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={phase}>
                <Card 
                  elevation={3}
                  sx={{ 
                    border: `2px solid ${info.color}`,
                    backgroundColor: `${info.color}10`,
                    minHeight: 200,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Icon sx={{ color: info.color, mr: 1, fontSize: 30 }} />
                      <Typography variant="h6" fontWeight="bold" color={info.color}>
                        {info.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {info.description}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: info.color, mb: 1 }}>
                      {phaseItems.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      elementos en esta fase
                    </Typography>
                    {phaseItems.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="caption" color="text.secondary">
                          Últimos elementos:
                        </Typography>
                        {phaseItems.slice(0, 2).map(item => (
                          <Chip
                            key={item.id}
                            label={item.title}
                            size="small"
                            sx={{ 
                              mt: 0.5, 
                              mr: 0.5, 
                              backgroundColor: info.color, 
                              color: 'white',
                              fontSize: '0.7rem',
                            }}
                            onClick={() => handleEditItem(item)}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Ciclo PDCA - Mejora Continua
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gestión del ciclo de mejora continua Plan-Do-Check-Act según ISO 9001
        </Typography>
      </Box>

      {/* Estadísticas generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ImprovementIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Total Elementos
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                {generalStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                en el ciclo PDCA
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Completados
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {generalStats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {generalStats.total > 0 ? `${Math.round((generalStats.completed / generalStats.total) * 100)}%` : '0%'} del total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DoIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  En Progreso
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                {generalStats.inProgress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                requieren seguimiento
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PlanIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Alta Prioridad
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {generalStats.highPriority}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                elementos críticos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Visualización del ciclo PDCA */}
      {currentTab === 0 && renderPDCACycle()}

      {/* Tabs para diferentes vistas */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Vista por Fases" />
          <Tab label="Lista General" />
          <Tab label="Análisis de Progreso" />
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
          Elementos PDCA
          {currentSector !== 'ALL' ? ` - ${currentSector}` : ''} 
          ({filteredItems.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          color="primary"
        >
          Nuevo Elemento PDCA
        </Button>
      </Box>

      {/* Contenido según tab activo */}
      {currentTab === 0 ? (
        // Vista por fases con estadísticas
        <Grid container spacing={3}>
          {phaseStats.map((stat) => (
            <Grid size={{ xs: 12, lg: 6 }} key={stat.phase}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: phaseInfo[stat.phase].color }}>
                    {phaseInfo[stat.phase].title} - {stat.phase}
                  </Typography>
                </Box>
                <Box display="flex" gap={2} mb={3}>
                  <Chip label={`${stat.total} total`} color="primary" size="small" />
                  <Chip label={`${stat.active} activos`} color="warning" size="small" />
                  <Chip label={`${stat.completed} completados`} color="success" size="small" />
                </Box>
                
                {filteredItems.filter(item => item.phase === stat.phase).slice(0, 3).map(item => (
                  <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.title}
                        </Typography>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(item.status),
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                        {item.description}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption">
                          Responsable: {item.responsible}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleEditItem(item)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem(item.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box mt={1}>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateProgress(item)} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Progreso: {calculateProgress(item)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : currentTab === 1 ? (
        // Lista general en tabla
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Elemento</strong></TableCell>
                <TableCell><strong>Sector</strong></TableCell>
                <TableCell><strong>Fase</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Prioridad</strong></TableCell>
                <TableCell><strong>Responsable</strong></TableCell>
                <TableCell><strong>Progreso</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay elementos PDCA para mostrar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.sector}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.phase}
                        size="small"
                        sx={{
                          backgroundColor: phaseInfo[item.phase].color,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(item.status),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(item.priority),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.responsible}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateProgress(item)} 
                          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption">
                          {calculateProgress(item)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="Ver elemento">
                          <IconButton size="small" color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleEditItem(item)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Análisis de progreso
        <Grid container spacing={3}>
          <Grid size={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Análisis de Progreso del Ciclo PDCA
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Metodología PDCA:</strong> El ciclo Plan-Do-Check-Act es fundamental para la mejora continua.
                Cada elemento debe pasar por las 4 fases para asegurar una implementación efectiva.
              </Alert>

              {phaseStats.map((stat) => (
                <Box key={stat.phase} mb={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body1" fontWeight="bold" sx={{ color: phaseInfo[stat.phase].color }}>
                      {phaseInfo[stat.phase].title} ({stat.phase})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.total} elementos ({stat.completed} completados)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stat.total > 0 ? (stat.completed / stat.total) * 100 : 0}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: phaseInfo[stat.phase].color + '20',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: phaseInfo[stat.phase].color
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0}% completado
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Modal para agregar/editar elemento PDCA */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Editar Elemento PDCA' : 'Nuevo Elemento PDCA'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Título del Elemento *"
                value={formData.title}
                onChange={handleFormChange('title')}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={formData.description}
                onChange={handleFormChange('description')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Sector *</InputLabel>
                <Select
                  value={formData.sector}
                  label="Sector *"
                  onChange={handleFormChange('sector')}
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
                <InputLabel>Fase PDCA</InputLabel>
                <Select
                  value={formData.phase}
                  label="Fase PDCA"
                  onChange={handleFormChange('phase')}
                >
                  {Object.values(PDCAPhase).map((phase) => (
                    <MenuItem key={phase} value={phase}>
                      {phaseInfo[phase].title} - {phase}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.status}
                  label="Estado"
                  onChange={handleFormChange('status')}
                >
                  {Object.values(PDCAStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={formData.priority}
                  label="Prioridad"
                  onChange={handleFormChange('priority')}
                >
                  {Object.values(Priority).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Responsable *"
                value={formData.responsible}
                onChange={handleFormChange('responsible')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Objetivo"
                value={formData.targetDate}
                onChange={handleFormChange('targetDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Acciones Planificadas (PLAN)"
                value={formData.plannedActions}
                onChange={handleFormChange('plannedActions')}
                helperText="Qué se planifica hacer para resolver el problema o mejorar"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Resultados Obtenidos (DO/CHECK)"
                value={formData.actualResults}
                onChange={handleFormChange('actualResults')}
                helperText="Qué se implementó y qué resultados se obtuvieron"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Lecciones Aprendidas (CHECK)"
                value={formData.lessons}
                onChange={handleFormChange('lessons')}
                helperText="Qué se aprendió del proceso y resultados"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Próximos Pasos (ACT)"
                value={formData.nextSteps}
                onChange={handleFormChange('nextSteps')}
                helperText="Cómo estandarizar o mejorar para el siguiente ciclo"
              />
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <strong>Guía PDCA:</strong> PLAN (Planificar solución), DO (Implementar), CHECK (Verificar resultados), ACT (Estandarizar mejoras).
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveItem}>
            {editingItem ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PDCAManagement; 