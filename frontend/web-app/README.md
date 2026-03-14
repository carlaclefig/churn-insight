# Churn Insight – Frontend

Interfaz de usuario construida con React, TypeScript y Tailwind CSS para visualizar predicciones de churn y planes de retención.

## Stack

- React 18 + TypeScript
- Tailwind CSS 3
- Chart.js + react-chartjs-2
- React Router v6
- Vite + SWC

## Estructura
```
src/
├── pages/          → Home, CustomerDetail, Dashboard
├── components/
│   ├── ui/         → Navbar, RiskBadge, LoadingSpinner, icons
│   ├── charts/     → 4 gráficos del dashboard
│   └── customer/   → CustomerCard, AnalysisCard, RetentionPlans
├── hooks/          → useTheme (dark/light mode)
├── services/       → api.ts (fetch al backend)
└── types/          → interfaces TypeScript
```

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Buscador de clientes por ID |
| `/customer/:id` | Detalle del cliente + análisis + planes |
| `/dashboard` | Analytics con 4 gráficos |

## Correr localmente
```bash
npm install
npm run dev
```

## Correr con Docker
```bash
docker-compose up --build frontend
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:
```
VITE_API_URL=http://localhost:8080
```

## Dark Mode

El tema se persiste en `localStorage` con la key `churn-theme`.