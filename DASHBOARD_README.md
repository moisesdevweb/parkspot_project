# Dashboard de Estadísticas - ParkSpot

## Descripción
Dashboard elegante y moderno para mostrar estadísticas en tiempo real del sistema de estacionamiento ParkSpot. Integra con las APIs del backend para mostrar información relevante según el rol del usuario.

## Funcionalidades Implementadas

### Para Administradores (`ROLE_ADMIN`)
- **Vista Completa de Estadísticas**: Muestra todas las métricas del sistema
- **Espacios de Estacionamiento**:
  - Total de espacios configurados
  - Espacios ocupados con porcentaje de ocupación
  - Espacios disponibles, reservados y en mantenimiento
  - Gráfico circular de ocupación
- **Gestión de Reservas**:
  - Reservas pendientes, confirmadas, utilizadas y canceladas
  - Métricas detalladas por estado
- **Registros Activos**: Total de vehículos actualmente estacionados
- **Acciones Rápidas**: Botones de navegación a las secciones principales

### Para Vigilantes (`ROLE_VIGILANTE`)
- **Vista Simplificada**: Información esencial para operaciones diarias
- **Espacios**: Solo disponibles y ocupados
- **Registros Activos**: Vehículos actualmente en el estacionamiento
- **Reservas Pendientes**: Reservas que requieren atención
- **Gráfico de Ocupación**: Estado visual del estacionamiento
- **Acciones Rápidas**: Navegación a funciones relevantes para vigilantes

## Componentes Desarrollados

### 1. `StatsCard.jsx`
Componente reutilizable para mostrar métricas individuales con:
- Iconos personalizados
- Colores temáticos
- Indicadores de tendencia (opcional)
- Diseño glassmorphism

### 2. `CircularProgress.jsx`
Gráfico circular animado para mostrar porcentajes:
- Animación fluida
- Colores configurables
- Texto central con porcentaje

### 3. `DashboardEstadisticas.jsx`
Componente principal que:
- Consume las APIs del backend (`/api/dashboard/estadisticas` y `/api/dashboard/estadisticas-vigilante`)
- Renderiza vistas diferentes según el rol
- Maneja estados de carga y errores
- Integra navegación a otras secciones

## APIs Utilizadas

### Endpoint para Administradores
```
GET /api/dashboard/estadisticas
```
**Requiere**: `ROLE_ADMIN`
**Respuesta**:
```json
{
  "espacios": {
    "disponibles": 25,
    "ocupados": 15,
    "reservados": 5,
    "mantenimiento": 2,
    "total": 47,
    "porcentajeOcupacion": 31.9
  },
  "registros": {
    "activos": 15,
    "total": 150
  },
  "reservas": {
    "pendientes": 3,
    "confirmadas": 8,
    "canceladas": 2,
    "utilizadas": 45
  }
}
```

### Endpoint para Vigilantes
```
GET /api/dashboard/estadisticas-vigilante
```
**Requiere**: `ROLE_VIGILANTE`
**Respuesta**:
```json
{
  "espaciosDisponibles": 25,
  "espaciosOcupados": 15,
  "registrosActivos": 15,
  "reservasPendientes": 3
}
```

## Rutas Configuradas

- `/dashboard/estadisticas` - Dashboard principal (Admin/Vigilante)
- `/dashboard/home` - Redirección al dashboard de estadísticas
- `/dashboard/admin` - Redirección automática al dashboard de estadísticas

## Navegación

El dashboard se integra con el sidebar existente:
- **Dashboard**: Nueva opción en la navegación principal
- **Acciones Rápidas**: Botones que redirigen a:
  - Gestión de Espacios
  - Estacionamiento en Tiempo Real
  - Gestión de Clientes/Vigilantes
  - Reportes

## Diseño y UX

### Paleta de Colores
- **Azul**: Espacios totales, acciones principales
- **Verde**: Espacios disponibles, acciones positivas
- **Rojo**: Espacios ocupados, alertas
- **Amarillo**: Reservas pendientes, advertencias
- **Púrpura**: Gestión de usuarios
- **Naranja**: Reportes e informes

### Elementos Visuales
- Gradientes sutiles en las tarjetas
- Efectos de hover y transiciones suaves
- Iconos emoji para mejor reconocimiento visual
- Layout responsivo para diferentes tamaños de pantalla

### Responsive Design
- **Mobile**: Una columna con tarjetas apiladas
- **Tablet**: Dos columnas para tarjetas y una columna para gráficos
- **Desktop**: Hasta 4 columnas para tarjetas principales

## Futuras Mejoras

1. **Gráficos Adicionales**: 
   - Historial de ocupación por horas/días
   - Tendencias de reservas
   - Análisis de ingresos

2. **Notificaciones en Tiempo Real**:
   - WebSocket para actualizaciones automáticas
   - Alertas de espacios críticos

3. **Filtros Temporales**:
   - Estadísticas por día, semana, mes
   - Comparativas históricas

4. **Exportación de Datos**:
   - Reportes PDF/Excel
   - Gráficos imprimibles

## Instalación y Uso

1. Las dependencias ya están incluidas en el proyecto
2. El dashboard se integra automáticamente con el sistema de autenticación existente
3. Solo los usuarios con roles `ROLE_ADMIN` o `ROLE_VIGILANTE` pueden acceder
4. La navegación se actualiza automáticamente según los permisos del usuario

## Tecnologías Utilizadas

- **React 18**: Framework principal
- **Tailwind CSS**: Estilos y diseño responsivo
- **React Router**: Navegación y rutas
- **React Hot Toast**: Notificaciones de usuario
- **Heroicons**: Iconografía consistente
