// Funciones de utilidad para el Sistema de Gestión de la Calidad (SGC)

/**
 * Formatea una fecha en formato ISO a formato legible en español
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY)
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

/**
 * Obtiene la fecha actual en formato ISO (YYYY-MM-DD)
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Calcula los días transcurridos desde una fecha
 */
export const getDaysAgo = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calcula los días hasta una fecha futura
 */
export const getDaysUntil = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Valida si una cadena de texto es un email válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una cadena de texto no está vacía o solo contiene espacios
 */
export const isNotEmpty = (text: string): boolean => {
  return text.trim().length > 0;
};

/**
 * Genera un ID único basado en timestamp
 */
export const generateId = (): string => {
  return Date.now().toString();
};

/**
 * Convierte un texto a título (Primera Letra De Cada Palabra En Mayúscula)
 */
export const toTitleCase = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Trunca un texto a una longitud específica y añade "..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('es-ES');
};

/**
 * Calcula el porcentaje de dos números
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Ordena un array de objetos por una propiedad específica
 */
export const sortByProperty = <T>(
  array: T[], 
  property: keyof T, 
  ascending: boolean = true
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Filtra un array de objetos por múltiples criterios
 */
export const filterByMultipleCriteria = <T>(
  array: T[],
  filters: Partial<T>
): T[] => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key as keyof T];
      const itemValue = item[key as keyof T];
      
      if (filterValue === undefined || filterValue === null || filterValue === '') {
        return true;
      }
      
      return itemValue === filterValue;
    });
  });
};

/**
 * Busca texto en múltiples propiedades de un objeto
 */
export const searchInMultipleFields = <T>(
  array: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return array;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return array.filter(item => {
    return fields.some(field => {
      const fieldValue = item[field];
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(lowerSearchTerm);
      }
      return false;
    });
  });
};

/**
 * Agrupa un array de objetos por una propiedad específica
 */
export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Debounce function para optimizar búsquedas
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Convierte bytes a formato legible (KB, MB, GB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Valida si una fecha está en el futuro
 */
export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date > today;
};

/**
 * Valida si una fecha está vencida
 */
export const isOverdue = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date < today;
};

/**
 * Obtiene el estado de vencimiento de una fecha
 */
export const getDateStatus = (dateString: string): 'upcoming' | 'due-soon' | 'overdue' | 'current' => {
  const daysUntil = getDaysUntil(dateString);
  
  if (daysUntil < 0) return 'overdue';
  if (daysUntil === 0) return 'current';
  if (daysUntil <= 7) return 'due-soon';
  return 'upcoming';
};

/**
 * Exporta datos a CSV
 */
export const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
): void => {
  if (data.length === 0) return;
  
  const csvHeaders = headers ? Object.values(headers) : Object.keys(data[0]);
  const csvRows = data.map(row => 
    Object.keys(data[0]).map(key => {
      const value = row[key];
      return typeof value === 'string' ? `"${value}"` : value;
    })
  );
  
  const csvContent = [
    csvHeaders.join(','),
    ...csvRows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Valida la estructura de un documento
 */
export const validateDocumentStructure = (doc: Record<string, unknown>): string[] => {
  const errors: string[] = [];
  
  if (!doc.title || !isNotEmpty(doc.title)) {
    errors.push('El título es obligatorio');
  }
  
  if (!doc.author || !isNotEmpty(doc.author)) {
    errors.push('El autor es obligatorio');
  }
  
  if (!doc.fileName || !isNotEmpty(doc.fileName)) {
    errors.push('El nombre del archivo es obligatorio');
  }
  
  if (!doc.version || !isNotEmpty(doc.version)) {
    errors.push('La versión es obligatoria');
  }
  
  return errors;
};

/**
 * Calcula la prioridad de una tarea basada en fechas y estado
 */
export const calculateTaskPriority = (
  dueDate: string,
  status: string
): 'high' | 'medium' | 'low' => {
  const dateStatus = getDateStatus(dueDate);
  
  if (status === 'Vencida' || dateStatus === 'overdue') return 'high';
  if (dateStatus === 'due-soon') return 'medium';
  return 'low';
};

/**
 * Genera un color hexadecimal aleatorio
 */
export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Convierte un color hexadecimal a RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Determina si un color es claro u oscuro
 */
export const isLightColor = (hex: string): boolean => {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128;
}; 