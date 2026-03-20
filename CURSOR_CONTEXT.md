# Contexto del Proyecto: Agenda Platzi MVP

Este documento sirve como punto de partida y contexto para continuar el desarrollo en Cursor o cualquier otro entorno asistido por IA.

## 🎯 Objetivo del Proyecto
Rediseñar la "Agenda Platzi", un calendario de eventos con múltiples vistas (mes, semana, día, agenda), una barra lateral colapsada y un sistema de filtros avanzados. El diseño debe seguir estrictamente la referencia de Figma proporcionada inicialmente.

## 🎨 Reglas de Diseño y UI/UX
- **Fondo de la aplicación:** `#13171B`
- **Bordes:** `#314158` (o variantes de `slate-800/50` según el contexto)
- **Cabeceras/Fondos secundarios:** `#1F2229` y `#1C2230`
- **Color de acento/selección:** `#7BE88E`
- **Barras de Scroll:** Ocultas en toda la aplicación (`[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`), pero manteniendo la capacidad de hacer scroll.
- **TopBar en Móvil:** Se oculta automáticamente al hacer scroll hacia abajo y reaparece al hacer scroll hacia arriba (implementado en `<main>` dentro de `App.tsx`).
- **Iconografía:** Se utiliza `lucide-react` (ej. se cambió el icono de filtros a `SlidersHorizontal`).
- **Tarjetas de Escuelas:** Diseño simplificado según requerimientos.

## 🛠 Stack Tecnológico
- React
- Tailwind CSS v4 (Clases utilitarias directas, sin archivo de configuración `tailwind.config.js`)
- `lucide-react` (Iconos)
- `date-fns` (Manejo y formateo de fechas)
- `motion/react` (Animaciones)
- React Router (Configurado en modo Data Router)

## 📂 Estructura Principal y Estado Actual
- **/src/app/App.tsx**: Contiene el Layout principal (`Root`, `Sidebar`, `TopBar`) y el estado principal de la aplicación (vistas de calendario, filtrado). Se implementó la lógica de ocultamiento de la `TopBar` en móvil aquí.
- **/src/app/components/EventOverlay.tsx**: Modal/Overlay para visualizar los detalles de un evento específico.
- **/src/app/components/FilterOverlay.tsx**: Modal/Overlay para el sistema de filtros avanzados (Escuelas, Cursos, En Vivo, etc.).
- **/src/app/components/FeaturedEvents.tsx**: Sección de eventos destacados debajo de la introducción.
- **/src/app/data/events.ts**: Contiene los datos mockeados (`MOCK_EVENTS`) utilizados para renderizar el calendario.

## 🚀 Próximos Pasos Sugeridos
1. **Refinamiento de Tarjetas:** Continuar puliendo los detalles visuales de las tarjetas de eventos en las distintas vistas (mes, semana, día).
2. **Modales:** Asegurar que los modales (`EventOverlay`, `FilterOverlay`) sean completamente responsivos y sus animaciones fluyan correctamente en dispositivos móviles.
3. **Filtros:** Conectar la lógica del estado de los filtros en `App.tsx` con la renderización condicional de los eventos en el calendario.

---
**Tip para Cursor:** Al iniciar tu sesión en Cursor, puedes referenciar este archivo usando `@CURSOR_CONTEXT.md` en el chat para que la IA entienda de inmediato el contexto, paleta de colores y reglas del proyecto.