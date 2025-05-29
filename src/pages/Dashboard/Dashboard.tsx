// Dashboard principal del Sistema de Gestión de la Calidad (SGC)

import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Warning,
  Error,
  Assignment,
  Security,
  Speed,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useAppContext } from '../../contexts/AppContext';
import { getStatusColor, getRiskColor } from '../../theme/theme';
import { Sector } from '../../types';

// Componente para tarjeta de KPI
interface KPICardProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, target, unit, trend, color }) => {
  const progress = Math.min((value / target) * 100, 100);
  const isOnTarget = value >= target;

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'down':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return <TrendingFlat sx={{ color: 'warning.main' }} />;
    }
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="div" color="text.secondary" fontSize="0.875rem">
            {title}
          </Typography>
          {getTrendIcon()}
        </Box>
        
        <Typography variant="h4" component="div" fontWeight="bold" color={color}>
          {value.toLocaleString()} {unit}
        </Typography>
        
        <Box mt={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Objetivo: {target} {unit}
            </Typography>
            <Chip
              label={isOnTarget ? 'Cumplido' : 'En Progreso'}
              color={isOnTarget ? 'success' : 'warning'}
              size="small"
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { state } = useAppContext();

  // Calcular estadísticas de resumen
  const totalDocuments = state.documents.length;
  const activeDocuments = state.documents.filter(doc => doc.status === 'Activo').length;
  const totalProcesses = state.processes.length;
  const activeProcesses = state.processes.filter(proc => proc.status === 'Activo').length;
  const openNonConformities = state.nonConformities.filter(nc => nc.status !== 'Cerrada').length;
  const highRisks = state.risks.filter(risk => 
    risk.riskLevel === 'Alto' || risk.riskLevel === 'Muy Alto'
  ).length;

  // Datos para gráfico de documentos por sector
  const documentsBySector = Object.values(Sector).map(sector => ({
    name: sector,
    cantidad: state.documents.filter(doc => doc.sector === sector).length,
  }));

  // Datos para gráfico de estado de procesos
  const processStatusData = [
    {
      name: 'Activos',
      value: state.processes.filter(p => p.status === 'Activo').length,
      color: getStatusColor('activo'),
    },
    {
      name: 'En Revisión',
      value: state.processes.filter(p => p.status === 'En Revisión').length,
      color: getStatusColor('en revisión'),
    },
    {
      name: 'Obsoletos',
      value: state.processes.filter(p => p.status === 'Obsoleto').length,
      color: getStatusColor('obsoleto'),
    },
  ];

  // Datos para gráfico de tendencia de no conformidades (simulado)
  const nonConformityTrend = [
    { mes: 'Ene', cantidad: 5 },
    { mes: 'Feb', cantidad: 3 },
    { mes: 'Mar', cantidad: 7 },
    { mes: 'Abr', cantidad: 4 },
    { mes: 'May', cantidad: 2 },
    { mes: 'Jun', cantidad: 6 },
  ];

  // Datos para gráfico de riesgos por nivel
  const risksByLevel = [
    {
      name: 'Muy Alto',
      value: state.risks.filter(r => r.riskLevel === 'Muy Alto').length,
      color: getRiskColor('muy alto'),
    },
    {
      name: 'Alto',
      value: state.risks.filter(r => r.riskLevel === 'Alto').length,
      color: getRiskColor('alto'),
    },
    {
      name: 'Medio',
      value: state.risks.filter(r => r.riskLevel === 'Medio').length,
      color: getRiskColor('medio'),
    },
    {
      name: 'Bajo',
      value: state.risks.filter(r => r.riskLevel === 'Bajo').length,
      color: getRiskColor('bajo'),
    },
  ];

  return (
    <Box>
      {/* Header del Dashboard */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard SGC
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Panel de control del Sistema de Gestión de la Calidad ISO 9001
        </Typography>
      </Box>

      {/* Alertas importantes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {highRisks > 0 && (
          <Grid size={12}>
            <Alert 
              severity="error" 
              icon={<Security />}
              action={
                <Chip label={`${highRisks} riesgos`} color="error" size="small" />
              }
            >
              <strong>Atención:</strong> Hay {highRisks} riesgo(s) de nivel alto que requieren tratamiento inmediato.
            </Alert>
          </Grid>
        )}
        
        {openNonConformities > 5 && (
          <Grid size={12}>
            <Alert 
              severity="warning"
              icon={<Warning />}
              action={
                <Chip label={`${openNonConformities} abiertas`} color="warning" size="small" />
              }
            >
              <strong>Seguimiento requerido:</strong> Hay {openNonConformities} no conformidades abiertas pendientes de cierre.
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* KPIs principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {state.kpis.slice(0, 4).map((kpi) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.id}>
            <KPICard
              title={kpi.name}
              value={kpi.currentValue}
              target={kpi.targetValue}
              unit={kpi.unit}
              trend={kpi.trend}
              color={theme.palette.primary.main}
            />
          </Grid>
        ))}
      </Grid>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <Assignment />
              </Avatar>
              <Typography variant="h4" component="div" fontWeight="bold">
                {totalDocuments}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Documentos Totales
              </Typography>
              <Chip 
                label={`${activeDocuments} activos`} 
                color="success" 
                size="small" 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                <Speed />
              </Avatar>
              <Typography variant="h4" component="div" fontWeight="bold">
                {totalProcesses}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Procesos Totales
              </Typography>
              <Chip 
                label={`${activeProcesses} activos`} 
                color="success" 
                size="small" 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 2 }}>
                <Error />
              </Avatar>
              <Typography variant="h4" component="div" fontWeight="bold">
                {openNonConformities}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                No Conformidades Abiertas
              </Typography>
              <Chip 
                label="Requiere atención" 
                color={openNonConformities > 5 ? 'error' : 'warning'} 
                size="small" 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <Security />
              </Avatar>
              <Typography variant="h4" component="div" fontWeight="bold">
                {highRisks}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Riesgos Altos/Críticos
              </Typography>
              <Chip 
                label={highRisks > 0 ? 'Acción requerida' : 'Bajo control'} 
                color={highRisks > 0 ? 'error' : 'success'} 
                size="small" 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos y análisis */}
      <Grid container spacing={3}>
        {/* Documentos por Sector */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Documentos por Sector
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={documentsBySector}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Estado de Procesos */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Estado de Procesos
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={processStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {processStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Tendencia de No Conformidades */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Tendencia de No Conformidades
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={nonConformityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cantidad" 
                  stroke={theme.palette.error.main} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Distribución de Riesgos */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={2} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Riesgos por Nivel
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={risksByLevel}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                >
                  {risksByLevel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 