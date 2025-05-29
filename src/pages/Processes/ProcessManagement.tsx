// Módulo de Gestión de Procesos del SGC

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
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AccountTree as ProcessIcon,
  PlayArrow as StepIcon,
  Schedule as TimeIcon,
  Person as ResponsibleIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../contexts/AppContext';
import { getStatusColor } from '../../theme/theme';
import type { Process, ProcessStep } from '../../types';
import { 
  Sector, 
  ProcessStatus,
} from '../../types';

// Interface para el formulario de proceso
interface ProcessFormData {
  name: string;
  description: string;
  sector: Sector;
  owner: string;
  status: ProcessStatus;
  version: string;
  steps: ProcessStep[];
}

// Interface para el formulario de paso
interface StepFormData {
  name: string;
  description: string;
  responsible: string;
  estimatedTime: string;
  resources: string;
}

const ProcessManagement: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [currentSector, setCurrentSector] = useState<Sector | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [editingStepIndex, setEditingStepIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<ProcessFormData>({
    name: '',
    description: '',
    sector: Sector.DESARROLLO,
    owner: '',
    status: ProcessStatus.ACTIVO,
    version: '1.0',
    steps: [],
  });
  const [stepFormData, setStepFormData] = useState<StepFormData>({
    name: '',
    description: '',
    responsible: '',
    estimatedTime: '',
    resources: '',
  });

  // Filtrar procesos por sector
  const filteredProcesses = useMemo(() => {
    if (currentSector === 'ALL') {
      return state.processes;
    }
    return state.processes.filter(process => process.sector === currentSector);
  }, [state.processes, currentSector]);

  // Estadísticas por sector
  const processStats = useMemo(() => {
    const stats = Object.values(Sector).map(sector => ({
      sector,
      total: state.processes.filter(process => process.sector === sector).length,
      active: state.processes.filter(process => process.sector === sector && process.status === ProcessStatus.ACTIVO).length,
      review: state.processes.filter(process => process.sector === sector && process.status === ProcessStatus.EN_REVISION).length,
    }));
    
    const totalStats = {
      sector: 'TOTAL' as const,
      total: state.processes.length,
      active: state.processes.filter(process => process.status === ProcessStatus.ACTIVO).length,
      review: state.processes.filter(process => process.status === ProcessStatus.EN_REVISION).length,
    };

    return [totalStats, ...stats];
  }, [state.processes]);

  // Manejadores principales
  const handleSectorChange = (_: React.SyntheticEvent, newValue: Sector | 'ALL'): void => {
    setCurrentSector(newValue);
  };

  const handleAddProcess = (): void => {
    setEditingProcess(null);
    setFormData({
      name: '',
      description: '',
      sector: Sector.DESARROLLO,
      owner: '',
      status: ProcessStatus.ACTIVO,
      version: '1.0',
      steps: [],
    });
    setIsModalOpen(true);
  };

  const handleEditProcess = (process: Process): void => {
    setEditingProcess(process);
    setFormData({
      name: process.name,
      description: process.description,
      sector: process.sector,
      owner: process.owner,
      status: process.status,
      version: process.version,
      steps: [...process.steps],
    });
    setIsModalOpen(true);
  };

  const handleDeleteProcess = (id: string): void => {
    if (window.confirm('¿Está seguro de que desea eliminar este proceso?')) {
      dispatch({ type: 'DELETE_PROCESS', payload: id });
    }
  };

  const handleSaveProcess = (): void => {
    if (!formData.name || !formData.owner) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    
    if (editingProcess) {
      // Actualizar proceso existente
      const updatedProcess: Process = {
        ...editingProcess,
        ...formData,
        lastReview: now,
      };
      dispatch({ type: 'UPDATE_PROCESS', payload: updatedProcess });
    } else {
      // Crear nuevo proceso
      const newProcess: Process = {
        id: Date.now().toString(),
        ...formData,
        lastReview: now,
        nextReview: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 meses
      };
      dispatch({ type: 'ADD_PROCESS', payload: newProcess });
    }

    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof ProcessFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Manejadores de pasos
  const handleAddStep = (): void => {
    setEditingStepIndex(-1);
    setStepFormData({
      name: '',
      description: '',
      responsible: '',
      estimatedTime: '',
      resources: '',
    });
    setIsStepModalOpen(true);
  };

  const handleEditStep = (index: number): void => {
    const step = formData.steps[index];
    setEditingStepIndex(index);
    setStepFormData({
      name: step.name,
      description: step.description,
      responsible: step.responsible,
      estimatedTime: step.estimatedTime,
      resources: step.resources.join(', '),
    });
    setIsStepModalOpen(true);
  };

  const handleDeleteStep = (index: number): void => {
    if (window.confirm('¿Está seguro de que desea eliminar este paso?')) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSaveStep = (): void => {
    if (!stepFormData.name || !stepFormData.responsible) {
      alert('Por favor complete todos los campos obligatorios del paso');
      return;
    }

    const newStep: ProcessStep = {
      id: editingStepIndex >= 0 ? formData.steps[editingStepIndex].id : Date.now().toString(),
      name: stepFormData.name,
      description: stepFormData.description,
      responsible: stepFormData.responsible,
      estimatedTime: stepFormData.estimatedTime,
      resources: stepFormData.resources.split(',').map(r => r.trim()).filter(r => r),
    };

    if (editingStepIndex >= 0) {
      // Editar paso existente
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.map((step, i) => i === editingStepIndex ? newStep : step),
      }));
    } else {
      // Agregar nuevo paso
      setFormData(prev => ({
        ...prev,
        steps: [...prev.steps, newStep],
      }));
    }

    setIsStepModalOpen(false);
  };

  const handleStepFormChange = (field: keyof StepFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setStepFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Gestión de Procesos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Control y seguimiento de procesos organizacionales según ISO 9001
        </Typography>
      </Box>

      {/* Estadísticas por sector */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {processStats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.sector}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ProcessIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {stat.sector === 'TOTAL' ? 'Total General' : stat.sector}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                  {stat.total}
                </Typography>
                <Box display="flex" gap={1} mt={2}>
                  <Chip 
                    label={`${stat.active} activos`} 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    label={`${stat.review} revisión`} 
                    color="warning" 
                    size="small" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
          Procesos {currentSector !== 'ALL' ? `- ${currentSector}` : ''} 
          ({filteredProcesses.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProcess}
        >
          Nuevo Proceso
        </Button>
      </Box>

      {/* Tabla de procesos */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Proceso</strong></TableCell>
              <TableCell><strong>Sector</strong></TableCell>
              <TableCell><strong>Responsable</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Versión</strong></TableCell>
              <TableCell><strong>Pasos</strong></TableCell>
              <TableCell><strong>Última Revisión</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProcesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No hay procesos para mostrar
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProcesses.map((process) => (
                <TableRow key={process.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {process.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {process.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{process.sector}</TableCell>
                  <TableCell>{process.owner}</TableCell>
                  <TableCell>
                    <Chip
                      label={process.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(process.status),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>{process.version}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${process.steps.length} pasos`} 
                      color="info" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{process.lastReview}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1}>
                      <Tooltip title="Ver proceso">
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          color="warning"
                          onClick={() => handleEditProcess(process)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteProcess(process.id)}
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

      {/* Modal para agregar/editar proceso */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingProcess ? 'Editar Proceso' : 'Nuevo Proceso'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre del Proceso *"
                value={formData.name}
                onChange={handleFormChange('name')}
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
              <TextField
                fullWidth
                label="Responsable *"
                value={formData.owner}
                onChange={handleFormChange('owner')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.status}
                  label="Estado"
                  onChange={handleFormChange('status')}
                >
                  {Object.values(ProcessStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Versión *"
                value={formData.version}
                onChange={handleFormChange('version')}
              />
            </Grid>

            {/* Sección de pasos del proceso */}
            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="div">
                  Pasos del Proceso ({formData.steps.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddStep}
                  size="small"
                >
                  Agregar Paso
                </Button>
              </Box>
              
              {formData.steps.length === 0 ? (
                <Alert severity="info">
                  No hay pasos definidos para este proceso. Agregue al menos un paso.
                </Alert>
              ) : (
                <List>
                  {formData.steps.map((step, index) => (
                    <ListItem key={step.id} divider>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <StepIcon color="primary" />
                            <Typography fontWeight="bold">
                              {index + 1}. {step.name}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              {step.description}
                            </Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <ResponsibleIcon fontSize="small" />
                                <Typography variant="caption">
                                  {step.responsible}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <TimeIcon fontSize="small" />
                                <Typography variant="caption">
                                  {step.estimatedTime}
                                </Typography>
                              </Box>
                              {step.resources.length > 0 && (
                                <Typography variant="caption" color="primary">
                                  Recursos: {step.resources.join(', ')}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditStep(index)}
                          color="warning"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteStep(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <strong>Nota:</strong> Es recomendable definir al menos 3-5 pasos por proceso para una correcta gestión según ISO 9001.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveProcess}>
            {editingProcess ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para agregar/editar paso */}
      <Dialog 
        open={isStepModalOpen} 
        onClose={() => setIsStepModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingStepIndex >= 0 ? 'Editar Paso' : 'Nuevo Paso'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre del Paso *"
                value={stepFormData.name}
                onChange={handleStepFormChange('name')}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={stepFormData.description}
                onChange={handleStepFormChange('description')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Responsable *"
                value={stepFormData.responsible}
                onChange={handleStepFormChange('responsible')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Tiempo Estimado"
                value={stepFormData.estimatedTime}
                onChange={handleStepFormChange('estimatedTime')}
                placeholder="ej: 2-3 días, 4 horas"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Recursos"
                value={stepFormData.resources}
                onChange={handleStepFormChange('resources')}
                placeholder="Separe los recursos con comas"
                helperText="Ejemplo: Software, Documentos, Personal especializado"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsStepModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveStep}>
            {editingStepIndex >= 0 ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProcessManagement; 