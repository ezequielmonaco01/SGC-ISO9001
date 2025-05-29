# Sistema de Gestión de la Calidad (SGC) - ISO 9001

Una aplicación frontend completa para el Sistema de Gestión de la Calidad basada en la norma ISO 9001, desarrollada específicamente para una software factory.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **📊 Dashboard Ejecutivo**: Panel de control con KPIs, estadísticas y gráficos en tiempo real
- **📄 Gestión Documental**: Control completo de documentos por sector con CRUD, filtros y versionado
- **🎨 Tema Claro/Oscuro**: Soporte completo para modo claro y oscuro optimizado para entornos laborales
- **📱 Diseño Responsive**: Interfaz adaptativa para desktop, tablet y móvil
- **💾 Persistencia Local**: Almacenamiento automático en localStorage

### 🔄 Módulos en Desarrollo

- **⚙️ Gestión de Procesos**: Listar y actualizar procesos internos por sector
- **⚠️ Matriz de Riesgos y Oportunidades**: Registro visual de riesgos, oportunidades, fortalezas y debilidades
- **🔄 Ciclo PDCA**: Tablero visual para Planificar, Hacer, Verificar y Actuar
- **❌ No Conformidades**: Gestión de incidencias y acciones correctivas/preventivas

## 🛠️ Tecnologías Utilizadas

- **React 19.1.0** con TypeScript
- **Material UI 7.1.0** para componentes y diseño
- **Recharts 2.15.3** para gráficos y visualizaciones
- **Vite 6.3.5** como bundler y servidor de desarrollo
- **Context API** para manejo de estado global
- **localStorage** para persistencia de datos

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd sgc-iso9001-adviters
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter para revisar código

## 📁 Estructura del Proyecto

```
sgc-iso9001-adviters/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   └── Layout/         # Layout principal con navegación
│   ├── pages/              # Páginas principales
│   │   ├── Dashboard/      # Dashboard con KPIs y gráficos
│   │   └── Documents/      # Gestión documental
│   ├── contexts/           # Context API para estado global
│   ├── types/              # Definiciones de TypeScript
│   ├── mocks/              # Datos simulados
│   ├── theme/              # Configuración de Material UI
│   └── App.tsx             # Componente principal
├── public/                 # Archivos estáticos
└── package.json            # Dependencias y scripts
```

## 🎯 Módulos del SGC

### 1. Dashboard
- **KPIs en tiempo real**: Defectos por release, satisfacción del cliente, etc.
- **Gráficos interactivos**: Distribución por sectores, tendencias, estados
- **Alertas automáticas**: Notificaciones para riesgos altos y no conformidades
- **Resumen ejecutivo**: Estadísticas clave por sector

### 2. Gestión Documental
- **Filtros por sector**: Desarrollo, QA, Administración, RRHH, Dirección, Comercial
- **CRUD completo**: Crear, editar, ver y eliminar documentos
- **Control de versiones**: Versionado automático de documentos
- **Tipos de documento**: Procedimientos, políticas, manuales, instructivos, formatos, registros
- **Estados**: Activo, en revisión, obsoleto, borrador

### 3. Sectores Organizacionales

La aplicación está estructurada por sectores específicos de una software factory:

- **🖥️ Desarrollo**: Gestión de documentos técnicos, procesos de desarrollo, coding standards
- **🧪 QA**: Procedimientos de testing, planes de prueba, métricas de calidad
- **🏢 Administración**: Documentos administrativos, políticas generales, procedimientos corporativos  
- **👥 RRHH**: Políticas de personal, procedimientos de contratación, capacitación
- **🎯 Dirección**: Documentos estratégicos, políticas de calidad, revisiones gerenciales
- **💼 Comercial**: Procedimientos de ventas, atención al cliente, contratos

## 💡 Características de UX/UI

### Diseño Laboral
- **Colores profesionales**: Paleta optimizada para entornos de trabajo
- **Tipografía clara**: Roboto con jerarquías bien definidas
- **Espaciado consistente**: Grid system de 8px para consistency
- **Iconografía intuitiva**: Material Icons para acciones comunes

### Accesibilidad
- **Navegación por teclado**: Soporte completo para navegación con Tab
- **Contraste adecuado**: Cumple estándares WCAG para legibilidad
- **Tooltips informativos**: Ayuda contextual en toda la interfaz
- **Responsive design**: Optimizado para todas las resoluciones

### Modo Oscuro/Claro
- **Toggle automático**: Cambio instantáneo entre temas
- **Persistencia**: Recuerda la preferencia del usuario
- **Colores optimizados**: Paletas diferentes para cada modo
- **Legibilidad**: Contraste optimizado en ambos modos

## 📊 Datos y Simulación

### Datos Mock Incluidos
- **4 Documentos de ejemplo** distribuidos entre sectores
- **2 Procesos principales** (Desarrollo y QA)
- **3 Riesgos identificados** con diferentes niveles
- **3 Oportunidades de mejora** en evaluación
- **6 KPIs principales** con valores realistas
- **Items PDCA y No Conformidades** para demostración

### Persistencia
- **localStorage automático**: Todos los cambios se guardan localmente
- **Carga inicial**: Combina datos mock con datos guardados
- **Estado sincronizado**: Cambios reflejados inmediatamente en toda la app

## 🔧 Personalización

### Configurar Sectores
Edita `src/types/index.ts` para modificar los sectores:

```typescript
export enum Sector {
  DESARROLLO = 'Desarrollo',
  QA = 'QA',
  // Agregar nuevos sectores aquí
}
```

### Modificar Colores
Personaliza el tema en `src/theme/theme.ts`:

```typescript
export const sgcColors = {
  sectors: {
    desarrollo: '#2196f3',
    // Agregar colores para nuevos sectores
  },
};
```

### Agregar KPIs
Incluye nuevos KPIs en `src/mocks/data.ts`:

```typescript
export const mockKPIs: KPI[] = [
  // Agregar nuevos KPIs aquí
];
```

## 🚀 Próximas Funcionalidades

### Fase 2 - Desarrollo Pendiente
- [ ] **Gestión de Procesos**: CRUD completo con pasos detallados
- [ ] **Matriz de Riesgos**: Matriz interactiva con probabilidad/impacto
- [ ] **Ciclo PDCA**: Tablero Kanban para seguimiento de mejoras
- [ ] **No Conformidades**: Sistema completo de acciones correctivas
- [ ] **Reportes**: Generación de reportes en PDF
- [ ] **Búsqueda global**: Buscador transversal en todos los módulos

### Fase 3 - Mejoras Avanzadas
- [ ] **Notificaciones**: Sistema de alertas y recordatorios
- [ ] **Calendarios**: Programación de auditorías y revisiones
- [ ] **Flujos de trabajo**: Aprobaciones y workflows automáticos
- [ ] **Integración**: APIs para sistemas externos
- [ ] **Analytics**: Métricas avanzadas y predicciones

## 📈 Métricas y KPIs Incluidos

### KPIs de Calidad
- **Defectos por Release**: Control de calidad del software
- **Tiempo de Resolución**: Eficiencia en resolución de issues
- **Satisfacción del Cliente**: Índice basado en encuestas
- **Rotación de Personal**: Estabilidad del equipo
- **Cobertura de Testing**: Porcentaje de código testeado
- **Cumplimiento de Deadlines**: Puntualidad en entregas

### Gráficos Incluidos
- **Barras**: Documentos por sector
- **Torta**: Estados de procesos y distribución de riesgos
- **Líneas**: Tendencias de no conformidades en el tiempo

## 🐛 Solución de Problemas

### Errores Comunes

1. **Error de dependencias**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Puerto ocupado**
   ```bash
   npm run dev -- --port 3001
   ```

3. **Build fallando**
   ```bash
   npm run lint
   npm run build
   ```

### Soporte
Para reportar bugs o solicitar funcionalidades, crear un issue en el repositorio.

## 📄 Licencia

Este proyecto está desarrollado para uso interno de la software factory. Todos los derechos reservados.

---

**Desarrollado con ❤️ para mejorar la gestión de calidad en software factories**

*Versión 1.0.0 - Marzo 2024*
