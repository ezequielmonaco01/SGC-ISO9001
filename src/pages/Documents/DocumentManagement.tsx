// Módulo de Gestión Documental del SGC

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
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../contexts/AppContext';
import { getStatusColor } from '../../theme/theme';
import type { Document } from '../../types';
import { 
  Sector, 
  DocumentType, 
  DocumentStatus,
} from '../../types';

// Interface para el formulario
interface DocumentFormData {
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  sector: Sector;
  type: DocumentType;
  status: DocumentStatus;
  version: string;
  author: string;
}

const DocumentManagement: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [currentSector, setCurrentSector] = useState<Sector | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    description: '',
    fileName: '',
    fileSize: '',
    sector: Sector.DESARROLLO,
    type: DocumentType.PROCEDIMIENTO,
    status: DocumentStatus.BORRADOR,
    version: '1.0',
    author: '',
  });

  // Filtrar documentos por sector
  const filteredDocuments = useMemo(() => {
    if (currentSector === 'ALL') {
      return state.documents;
    }
    return state.documents.filter(doc => doc.sector === currentSector);
  }, [state.documents, currentSector]);

  // Estadísticas por sector
  const documentStats = useMemo(() => {
    const stats = Object.values(Sector).map(sector => ({
      sector,
      total: state.documents.filter(doc => doc.sector === sector).length,
      active: state.documents.filter(doc => doc.sector === sector && doc.status === DocumentStatus.ACTIVO).length,
      review: state.documents.filter(doc => doc.sector === sector && doc.status === DocumentStatus.EN_REVISION).length,
    }));
    
    const totalStats = {
      sector: 'TOTAL' as const,
      total: state.documents.length,
      active: state.documents.filter(doc => doc.status === DocumentStatus.ACTIVO).length,
      review: state.documents.filter(doc => doc.status === DocumentStatus.EN_REVISION).length,
    };

    return [totalStats, ...stats];
  }, [state.documents]);

  // Manejadores
  const handleSectorChange = (_: React.SyntheticEvent, newValue: Sector | 'ALL'): void => {
    setCurrentSector(newValue);
  };

  const handleAddDocument = (): void => {
    setEditingDocument(null);
    setFormData({
      title: '',
      description: '',
      fileName: '',
      fileSize: '',
      sector: Sector.DESARROLLO,
      type: DocumentType.PROCEDIMIENTO,
      status: DocumentStatus.BORRADOR,
      version: '1.0',
      author: '',
    });
    setIsModalOpen(true);
  };

  const handleEditDocument = (doc: Document): void => {
    setEditingDocument(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      sector: doc.sector,
      type: doc.type,
      status: doc.status,
      version: doc.version,
      author: doc.author,
    });
    setIsModalOpen(true);
  };

  const handleDeleteDocument = (id: string): void => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      dispatch({ type: 'DELETE_DOCUMENT', payload: id });
    }
  };

  const handleSaveDocument = (): void => {
    if (!formData.title || !formData.author || !formData.fileName) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    
    if (editingDocument) {
      // Actualizar documento existente
      const updatedDocument: Document = {
        ...editingDocument,
        ...formData,
        lastModified: now,
      };
      dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDocument });
    } else {
      // Crear nuevo documento
      const newDocument: Document = {
        id: Date.now().toString(),
        ...formData,
        uploadDate: now,
        lastModified: now,
      };
      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
    }

    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof DocumentFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSimulateUpload = (): void => {
    // Simular subida de archivo
    const fileName = `documento-${Date.now()}.pdf`;
    const fileSize = `${(Math.random() * 5 + 0.5).toFixed(1)} MB`;
    setFormData(prev => ({
      ...prev,
      fileName,
      fileSize,
    }));
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Gestión Documental
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Control de documentos por sector según ISO 9001
        </Typography>
      </Box>

      {/* Estadísticas por sector */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {documentStats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.sector}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <DocumentIcon color="primary" sx={{ mr: 1 }} />
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
          Documentos {currentSector !== 'ALL' ? `- ${currentSector}` : ''} 
          ({filteredDocuments.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDocument}
        >
          Nuevo Documento
        </Button>
      </Box>

      {/* Tabla de documentos */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Documento</strong></TableCell>
              <TableCell><strong>Sector</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Versión</strong></TableCell>
              <TableCell><strong>Autor</strong></TableCell>
              <TableCell><strong>Última Modificación</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No hay documentos para mostrar
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {doc.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doc.fileName} ({doc.fileSize})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{doc.sector}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(doc.status),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>{doc.author}</TableCell>
                  <TableCell>{doc.lastModified}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1}>
                      <Tooltip title="Ver documento">
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton size="small" color="secondary">
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          color="warning"
                          onClick={() => handleEditDocument(doc)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteDocument(doc.id)}
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

      {/* Modal para agregar/editar documento */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingDocument ? 'Editar Documento' : 'Nuevo Documento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Título del Documento *"
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
                <InputLabel>Tipo de Documento *</InputLabel>
                <Select
                  value={formData.type}
                  label="Tipo de Documento *"
                  onChange={handleFormChange('type')}
                >
                  {Object.values(DocumentType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
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
                  {Object.values(DocumentStatus).map((status) => (
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Autor *"
                value={formData.author}
                onChange={handleFormChange('author')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  fullWidth
                  label="Archivo"
                  value={formData.fileName}
                  onChange={handleFormChange('fileName')}
                  placeholder="Seleccione un archivo"
                />
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={handleSimulateUpload}
                >
                  Subir
                </Button>
              </Box>
              {formData.fileSize && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Tamaño: {formData.fileSize}
                </Typography>
              )}
            </Grid>
          </Grid>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <strong>Nota:</strong> Esta es una simulación. En un entorno real, aquí se implementaría la carga real de archivos.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveDocument}>
            {editingDocument ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentManagement; 