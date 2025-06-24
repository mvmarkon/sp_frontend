# SanPedrito - Sistema de Gestión de Inventario

Una aplicación frontend moderna desarrollada con React.js y Vite para la gestión de inventario, conectada a una API REST de Django.

## 🚀 Características

- **Dashboard interactivo** con estadísticas y gráficos
- **Gestión completa de productos** (CRUD)
- **Gestión de categorías** para organizar productos
- **Sistema de autenticación** con JWT
- **Reportes y exportación** a CSV
- **Alertas de stock bajo**
- **Interfaz responsive** y moderna
- **Tema claro/oscuro**
- **Notificaciones en tiempo real**

## 🛠️ Tecnologías Utilizadas

- **React 18+** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **Zustand** - Gestión de estado
- **React Router DOM** - Enrutamiento
- **React Hook Form** - Manejo de formularios
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos y visualizaciones
- **React Hot Toast** - Notificaciones

## 📋 Prerrequisitos

- Node.js 16+ 
- npm o yarn
- API Backend de Django ejecutándose en `http://127.0.0.1:8000`

## 🔧 Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd san-pedrito-frontend
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
\`\`\`

Editar el archivo `.env`:
\`\`\`env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=SanPedrito
\`\`\`

4. **Ejecutar en modo desarrollo**
\`\`\`bash
npm run dev
\`\`\`

5. **Construir para producción**
\`\`\`bash
npm run build
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
src/
├── components/          # Componentes reutilizables
│   ├── layout/         # Componentes de layout
│   ├── ui/             # Componentes de UI base
│   └── ProtectedRoute.tsx
├── pages/              # Páginas de la aplicación
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Products.tsx
│   ├── ProductForm.tsx
│   ├── Categories.tsx
│   ├── CategoryForm.tsx
│   └── Reports.tsx
├── services/           # Servicios de API
│   ├── api.ts
│   ├── auth.ts
│   ├── products.ts
│   └── categories.ts
├── store/              # Gestión de estado
│   └── authStore.ts
├── types/              # Definiciones de tipos
│   └── index.ts
├── lib/                # Utilidades
│   └── utils.ts
└── App.tsx             # Componente principal
\`\`\`

## 🔐 Autenticación

La aplicación utiliza JWT tokens para la autenticación:

- **Login**: `/login`
- **Logout**: Automático al cerrar sesión
- **Protección de rutas**: Todas las rutas excepto login requieren autenticación
- **Renovación automática**: Los tokens se renuevan automáticamente

## 📊 Funcionalidades Principales

### Dashboard
- Estadísticas generales del inventario
- Gráficos de productos por categoría
- Lista de productos recientes
- Acciones rápidas

### Gestión de Productos
- Lista con filtros y búsqueda
- Formulario de creación/edición
- Carga de imágenes
- Gestión de stock y precios
- Alertas de stock bajo

### Gestión de Categorías
- CRUD completo de categorías
- Organización de productos

### Reportes
- Productos con stock bajo
- Exportación a CSV
- Estadísticas del inventario

## 🎨 Personalización

### Temas
La aplicación soporta tema claro y oscuro. El tema se guarda en localStorage.

### Estilos
Los estilos están basados en Tailwind CSS y pueden personalizarse en:
- `tailwind.config.js` - Configuración de Tailwind
- `src/index.css` - Variables CSS personalizadas

## 🔧 Scripts Disponibles

\`\`\`bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de la construcción
npm run lint         # Linting del código
\`\`\`

## 🌐 API Endpoints

La aplicación se conecta a los siguientes endpoints:

- `GET/POST /api/products/` - Gestión de productos
- `GET/PUT/DELETE /api/products/{id}/` - Operaciones específicas de producto
- `GET/POST /api/categories/` - Gestión de categorías
- `GET/PUT/DELETE /api/categories/{id}/` - Operaciones específicas de categoría
- `POST /api/auth/login/` - Autenticación
- `POST /api/auth/logout/` - Cerrar sesión

## 🚀 Despliegue

### Desarrollo
\`\`\`bash
npm run dev
\`\`\`

### Producción
\`\`\`bash
npm run build
npm run preview
\`\`\`

### Variables de Entorno para Producción
\`\`\`env
VITE_API_BASE_URL=https://tu-api-backend.com/api
VITE_APP_NAME=SanPedrito
\`\`\`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.

---

Desarrollado con ❤️ para SanPedrito
