// Módulo de Matriz de Riesgos y Oportunidades del SGC

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
  Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as RiskIcon,
  TrendingUp as OpportunityIcon,
  Assessment as AnalysisIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../contexts/AppContext';
import { getRiskColor, getPriorityColor, getStatusColor } from '../../theme/theme';
import type { Risk, Opportunity } from '../../types';
import { 
  Sector, 
  RiskCategory,
  RiskLevel,
  RiskStatus,
  OpportunityCategory,
  Priority,
  OpportunityStatus,
} from '../../types';

// Interface para el formulario de riesgo
interface RiskFormData {
  title: string;
  description: string;
  sector: Sector;
  category: RiskCategory;
  probability: RiskLevel;
  impact: RiskLevel;
  mitigation: string;
  responsible: string;
  status: RiskStatus;
}

// Interface para el formulario de oportunidad
interface OpportunityFormData {
  title: string;
  description: string;
  sector: Sector;
  category: OpportunityCategory;
  priority: Priority;
  expectedBenefit: string;
  responsible: string;
  status: OpportunityStatus;
  targetDate: string;
}

// Valores numéricos para cálculo de nivel de riesgo
const riskLevelValues = {
  [RiskLevel.MUY_BAJO]: 1,
  [RiskLevel.BAJO]: 2,
  [RiskLevel.MEDIO]: 3,
  [RiskLevel.ALTO]: 4,
  [RiskLevel.MUY_ALTO]: 5,
};

const RiskMatrix: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [currentTab, setCurrentTab] = useState(0); // 0: Riesgos, 1: Oportunidades
  const [currentSector, setCurrentSector] = useState<Sector | 'ALL'>('ALL');
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  
  const [riskFormData, setRiskFormData] = useState<RiskFormData>({
    title: '',
    description: '',
    sector: Sector.DESARROLLO,
    category: RiskCategory.OPERACIONAL,
    probability: RiskLevel.MEDIO,
    impact: RiskLevel.MEDIO,
    mitigation: '',
    responsible: '',
    status: RiskStatus.IDENTIFICADO,
  });

  const [opportunityFormData, setOpportunityFormData] = useState<OpportunityFormData>({
    title: '',
    description: '',
    sector: Sector.DESARROLLO,
    category: OpportunityCategory.MEJORA_PROCESO,
    priority: Priority.MEDIA,
    expectedBenefit: '',
    responsible: '',
    status: OpportunityStatus.IDENTIFICADA,
    targetDate: '',
  });

  // Filtrar datos por sector
  const filteredRisks = useMemo(() => {
    if (currentSector === 'ALL') return state.risks;
    return state.risks.filter(risk => risk.sector === currentSector);
  }, [state.risks, currentSector]);

  const filteredOpportunities = useMemo(() => {
    if (currentSector === 'ALL') return state.opportunities;
    return state.opportunities.filter(opp => opp.sector === currentSector);
  }, [state.opportunities, currentSector]);

  // Estadísticas
  const riskStats = useMemo(() => {
    const total = filteredRisks.length;
    const high = filteredRisks.filter(r => r.riskLevel === RiskLevel.ALTO || r.riskLevel === RiskLevel.MUY_ALTO).length;
    const medium = filteredRisks.filter(r => r.riskLevel === RiskLevel.MEDIO).length;
    const low = filteredRisks.filter(r => r.riskLevel === RiskLevel.BAJO || r.riskLevel === RiskLevel.MUY_BAJO).length;
    
    return { total, high, medium, low };
  }, [filteredRisks]);

  const opportunityStats = useMemo(() => {
    const total = filteredOpportunities.length;
    const critical = filteredOpportunities.filter(o => o.priority === Priority.CRITICA).length;
    const high = filteredOpportunities.filter(o => o.priority === Priority.ALTA).length;
    const medium = filteredOpportunities.filter(o => o.priority === Priority.MEDIA).length;
    
    return { total, critical, high, medium };
  }, [filteredOpportunities]);

  // Calcular nivel de riesgo
  const calculateRiskLevel = (probability: RiskLevel, impact: RiskLevel): RiskLevel => {
    const riskValue = riskLevelValues[probability] * riskLevelValues[impact];
    
    if (riskValue >= 20) return RiskLevel.MUY_ALTO;
    if (riskValue >= 15) return RiskLevel.ALTO;
    if (riskValue >= 9) return RiskLevel.MEDIO;
    if (riskValue >= 4) return RiskLevel.BAJO;
    return RiskLevel.MUY_BAJO;
  };

  // Manejadores
  const handleTabChange = (_: React.SyntheticEvent, newValue: number): void => {
    setCurrentTab(newValue);
  };

  const handleSectorChange = (_: React.SyntheticEvent, newValue: Sector | 'ALL'): void => {
    setCurrentSector(newValue);
  };

  // Manejadores de Riesgos
  const handleAddRisk = (): void => {
    setEditingRisk(null);
    setRiskFormData({
      title: '',
      description: '',
      sector: Sector.DESARROLLO,
      category: RiskCategory.OPERACIONAL,
      probability: RiskLevel.MEDIO,
      impact: RiskLevel.MEDIO,
      mitigation: '',
      responsible: '',
      status: RiskStatus.IDENTIFICADO,
    });
    setIsRiskModalOpen(true);
  };

  const handleEditRisk = (risk: Risk): void => {
    setEditingRisk(risk);
    setRiskFormData({
      title: risk.title,
      description: risk.description,
      sector: risk.sector,
      category: risk.category,
      probability: risk.probability,
      impact: risk.impact,
      mitigation: risk.mitigation,
      responsible: risk.responsible,
      status: risk.status,
    });
    setIsRiskModalOpen(true);
  };

  const handleDeleteRisk = (id: string): void => {
    if (window.confirm('¿Está seguro de que desea eliminar este riesgo?')) {
      dispatch({ type: 'DELETE_RISK', payload: id });
    }
  };

  const handleSaveRisk = (): void => {
    if (!riskFormData.title || !riskFormData.responsible) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const riskLevel = calculateRiskLevel(riskFormData.probability, riskFormData.impact);
    const now = new Date().toISOString().split('T')[0];
    
    if (editingRisk) {
      const updatedRisk: Risk = {
        ...editingRisk,
        ...riskFormData,
        riskLevel,
        reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 meses
      };
      dispatch({ type: 'UPDATE_RISK', payload: updatedRisk });
    } else {
      const newRisk: Risk = {
        id: Date.now().toString(),
        ...riskFormData,
        riskLevel,
        identifiedDate: now,
        reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      dispatch({ type: 'ADD_RISK', payload: newRisk });
    }

    setIsRiskModalOpen(false);
  };

  // Manejadores de Oportunidades
  const handleAddOpportunity = (): void => {
    setEditingOpportunity(null);
    setOpportunityFormData({
      title: '',
      description: '',
      sector: Sector.DESARROLLO,
      category: OpportunityCategory.MEJORA_PROCESO,
      priority: Priority.MEDIA,
      expectedBenefit: '',
      responsible: '',
      status: OpportunityStatus.IDENTIFICADA,
      targetDate: '',
    });
    setIsOpportunityModalOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity): void => {
    setEditingOpportunity(opportunity);
    setOpportunityFormData({
      title: opportunity.title,
      description: opportunity.description,
      sector: opportunity.sector,
      category: opportunity.category,
      priority: opportunity.priority,
      expectedBenefit: opportunity.expectedBenefit,
      responsible: opportunity.responsible,
      status: opportunity.status,
      targetDate: opportunity.targetDate,
    });
    setIsOpportunityModalOpen(true);
  };

  const handleDeleteOpportunity = (id: string): void => {
    if (window.confirm('¿Está seguro de que desea eliminar esta oportunidad?')) {
      dispatch({ type: 'DELETE_OPPORTUNITY', payload: id });
    }
  };

  const handleSaveOpportunity = (): void => {
    if (!opportunityFormData.title || !opportunityFormData.responsible) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    
    if (editingOpportunity) {
      const updatedOpportunity: Opportunity = {
        ...editingOpportunity,
        ...opportunityFormData,
      };
      dispatch({ type: 'UPDATE_OPPORTUNITY', payload: updatedOpportunity });
    } else {
      const newOpportunity: Opportunity = {
        id: Date.now().toString(),
        ...opportunityFormData,
        identifiedDate: now,
      };
      dispatch({ type: 'ADD_OPPORTUNITY', payload: newOpportunity });
    }

    setIsOpportunityModalOpen(false);
  };

  const handleRiskFormChange = (field: keyof RiskFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ): void => {
    setRiskFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleOpportunityFormChange = (field: keyof OpportunityFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ): void => {
    setOpportunityFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Matriz de riesgos visual
  const renderRiskMatrix = () => {
    const matrixSize = 5;
    const matrix = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill([]));
    
    filteredRisks.forEach(risk => {
      const probIndex = riskLevelValues[risk.probability] - 1;
      const impactIndex = riskLevelValues[risk.impact] - 1;
      if (probIndex >= 0 && impactIndex >= 0) {
        matrix[probIndex][impactIndex] = [...matrix[probIndex][impactIndex], risk];
      }
    });

    const levelLabels = ['Muy Bajo', 'Bajo', 'Medio', 'Alto', 'Muy Alto'];

    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Matriz de Riesgos Visual
        </Typography>
        <Box sx={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
                  Probabilidad / Impacto
                </th>
                {levelLabels.map(label => (
                  <th key={label} style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5', fontSize: '0.75rem' }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levelLabels.reverse().map((probLabel, probIndex) => (
                <tr key={probLabel}>
                  <td style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {probLabel}
                  </td>
                  {levelLabels.map((impactLabel, impactIndex) => {
                    const cellRisks = matrix[4 - probIndex][impactIndex] || [];
                    const riskLevel = calculateRiskLevel(
                      Object.values(RiskLevel)[4 - probIndex],
                      Object.values(RiskLevel)[impactIndex]
                    );
                    return (
                      <td 
                        key={impactLabel}
                        style={{ 
                          padding: '4px', 
                          border: '1px solid #ddd',
                          backgroundColor: getRiskColor(riskLevel) + '20',
                          height: '60px',
                          width: '80px',
                          verticalAlign: 'top'
                        }}
                      >
                        {cellRisks.map((risk: Risk, index: number) => (
                          <Chip
                            key={risk.id}
                            label={`R${index + 1}`}
                            size="small"
                            sx={{ 
                              fontSize: '0.6rem', 
                              height: '16px',
                              backgroundColor: getRiskColor(riskLevel),
                              color: 'white',
                              mb: 0.5,
                              mr: 0.5
                            }}
                            onClick={() => handleEditRisk(risk)}
                          />
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Haga clic en los chips para editar riesgos. Los colores indican el nivel de riesgo resultante.
        </Typography>
      </Paper>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Matriz de Riesgos y Oportunidades
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Identificación, evaluación y gestión de riesgos y oportunidades según ISO 9001
        </Typography>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <RiskIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Riesgos Totales
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {riskStats.total}
              </Typography>
              <Stack direction="row" spacing={1} mt={2}>
                <Chip label={`${riskStats.high} altos`} color="error" size="small" />
                <Chip label={`${riskStats.medium} medios`} color="warning" size="small" />
                <Chip label={`${riskStats.low} bajos`} color="success" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <OpportunityIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Oportunidades
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {opportunityStats.total}
              </Typography>
              <Stack direction="row" spacing={1} mt={2}>
                <Chip label={`${opportunityStats.critical} críticas`} color="error" size="small" />
                <Chip label={`${opportunityStats.high} altas`} color="warning" size="small" />
                <Chip label={`${opportunityStats.medium} medias`} color="info" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AnalysisIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Análisis Global
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Ratio R/O: {riskStats.total > 0 ? (opportunityStats.total / riskStats.total).toFixed(2) : '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Proporción de oportunidades por riesgo
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SecurityIcon 
                  color={riskStats.high > 0 ? 'error' : 'success'} 
                  sx={{ mr: 1 }} 
                />
                <Typography variant="h6" fontWeight="bold">
                  Estado de Seguridad
                </Typography>
              </Box>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color={riskStats.high > 0 ? 'error.main' : 'success.main'}
              >
                {riskStats.high > 0 ? 'Atención Requerida' : 'Bajo Control'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {riskStats.high > 0 
                  ? `${riskStats.high} riesgo(s) alto(s) requieren acción`
                  : 'No hay riesgos críticos identificados'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Matriz visual de riesgos */}
      {currentTab === 0 && renderRiskMatrix()}

      {/* Tabs para Riesgos y Oportunidades */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label={`Riesgos (${filteredRisks.length})`} />
          <Tab label={`Oportunidades (${filteredOpportunities.length})`} />
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
          {currentTab === 0 ? 'Riesgos' : 'Oportunidades'}
          {currentSector !== 'ALL' ? ` - ${currentSector}` : ''} 
          ({currentTab === 0 ? filteredRisks.length : filteredOpportunities.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={currentTab === 0 ? handleAddRisk : handleAddOpportunity}
          color={currentTab === 0 ? 'error' : 'success'}
        >
          {currentTab === 0 ? 'Nuevo Riesgo' : 'Nueva Oportunidad'}
        </Button>
      </Box>

      {/* Tabla de contenido según tab activo */}
      {currentTab === 0 ? (
        // Tabla de Riesgos
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Riesgo</strong></TableCell>
                <TableCell><strong>Sector</strong></TableCell>
                <TableCell><strong>Categoría</strong></TableCell>
                <TableCell><strong>Probabilidad</strong></TableCell>
                <TableCell><strong>Impacto</strong></TableCell>
                <TableCell><strong>Nivel</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Responsable</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRisks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay riesgos para mostrar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRisks.map((risk) => (
                  <TableRow key={risk.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {risk.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {risk.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{risk.sector}</TableCell>
                    <TableCell>{risk.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={risk.probability}
                        size="small"
                        sx={{
                          backgroundColor: getRiskColor(risk.probability),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={risk.impact}
                        size="small"
                        sx={{
                          backgroundColor: getRiskColor(risk.impact),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={risk.riskLevel}
                        size="small"
                        sx={{
                          backgroundColor: getRiskColor(risk.riskLevel),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={risk.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(risk.status),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>{risk.responsible}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="Ver riesgo">
                          <IconButton size="small" color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleEditRisk(risk)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteRisk(risk.id)}
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
        // Tabla de Oportunidades
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Oportunidad</strong></TableCell>
                <TableCell><strong>Sector</strong></TableCell>
                <TableCell><strong>Categoría</strong></TableCell>
                <TableCell><strong>Prioridad</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Responsable</strong></TableCell>
                <TableCell><strong>Fecha Objetivo</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOpportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay oportunidades para mostrar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOpportunities.map((opportunity) => (
                  <TableRow key={opportunity.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {opportunity.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {opportunity.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{opportunity.sector}</TableCell>
                    <TableCell>{opportunity.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={opportunity.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(opportunity.priority),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={opportunity.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(opportunity.status),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>{opportunity.responsible}</TableCell>
                    <TableCell>{opportunity.targetDate}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="Ver oportunidad">
                          <IconButton size="small" color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleEditOpportunity(opportunity)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteOpportunity(opportunity.id)}
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
      )}

      {/* Modal para agregar/editar riesgo */}
      <Dialog 
        open={isRiskModalOpen} 
        onClose={() => setIsRiskModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingRisk ? 'Editar Riesgo' : 'Nuevo Riesgo'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Título del Riesgo *"
                value={riskFormData.title}
                onChange={handleRiskFormChange('title')}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={riskFormData.description}
                onChange={handleRiskFormChange('description')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Sector *</InputLabel>
                <Select
                  value={riskFormData.sector}
                  label="Sector *"
                  onChange={handleRiskFormChange('sector')}
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
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={riskFormData.category}
                  label="Categoría"
                  onChange={handleRiskFormChange('category')}
                >
                  {Object.values(RiskCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Probabilidad</InputLabel>
                <Select
                  value={riskFormData.probability}
                  label="Probabilidad"
                  onChange={handleRiskFormChange('probability')}
                >
                  {Object.values(RiskLevel).map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Impacto</InputLabel>
                <Select
                  value={riskFormData.impact}
                  label="Impacto"
                  onChange={handleRiskFormChange('impact')}
                >
                  {Object.values(RiskLevel).map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Nivel de Riesgo Calculado:</strong> {calculateRiskLevel(riskFormData.probability, riskFormData.impact)}
              </Alert>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Estrategia de Mitigación"
                value={riskFormData.mitigation}
                onChange={handleRiskFormChange('mitigation')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Responsable *"
                value={riskFormData.responsible}
                onChange={handleRiskFormChange('responsible')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={riskFormData.status}
                  label="Estado"
                  onChange={handleRiskFormChange('status')}
                >
                  {Object.values(RiskStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRiskModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleSaveRisk}>
            {editingRisk ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para agregar/editar oportunidad */}
      <Dialog 
        open={isOpportunityModalOpen} 
        onClose={() => setIsOpportunityModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingOpportunity ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Título de la Oportunidad *"
                value={opportunityFormData.title}
                onChange={handleOpportunityFormChange('title')}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={opportunityFormData.description}
                onChange={handleOpportunityFormChange('description')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Sector *</InputLabel>
                <Select
                  value={opportunityFormData.sector}
                  label="Sector *"
                  onChange={handleOpportunityFormChange('sector')}
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
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={opportunityFormData.category}
                  label="Categoría"
                  onChange={handleOpportunityFormChange('category')}
                >
                  {Object.values(OpportunityCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={opportunityFormData.priority}
                  label="Prioridad"
                  onChange={handleOpportunityFormChange('priority')}
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
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={opportunityFormData.status}
                  label="Estado"
                  onChange={handleOpportunityFormChange('status')}
                >
                  {Object.values(OpportunityStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Beneficio Esperado"
                value={opportunityFormData.expectedBenefit}
                onChange={handleOpportunityFormChange('expectedBenefit')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Responsable *"
                value={opportunityFormData.responsible}
                onChange={handleOpportunityFormChange('responsible')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Objetivo"
                value={opportunityFormData.targetDate}
                onChange={handleOpportunityFormChange('targetDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpportunityModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" color="success" onClick={handleSaveOpportunity}>
            {editingOpportunity ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RiskMatrix; 