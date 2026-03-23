export const marketingNav = [
  { label: 'Inicio', href: '/' },
  { label: 'Como funciona', href: '/como-funciona' },
  { label: 'Precios', href: '/precios' },
];

export const publicHighlights = [
  'Analiza enlaces, documentos, audio y texto en un solo flujo.',
  'Cruza senales publicas con fuentes privadas para emitir un veredicto claro.',
  'Entrega evidencia accionable para equipos legales, compliance y riesgo.',
];

export const verdictLevels = [
  {
    label: 'Seguir',
    title: 'Todo apunta a una oportunidad valida',
    body: 'Las fuentes coinciden, no hay alertas severas y el equipo recibe una ruta de accion sugerida.',
  },
  {
    label: 'Revisar',
    title: 'Hay zonas grises que requieren criterio humano',
    body: 'Veredicto identifica inconsistencias, huecos de informacion y preguntas abiertas antes de avanzar.',
  },
  {
    label: 'Frenar',
    title: 'Existen banderas rojas que elevan el riesgo',
    body: 'Se detectan conflictos, falta de trazabilidad o senales de riesgo reputacional y operativo.',
  },
];

export const useCases = [
  {
    title: 'Debida diligencia express',
    body: 'Resume contratos, antecedentes publicos y archivos internos para decidir si vale la pena continuar.',
  },
  {
    title: 'Revision de discursos y audios',
    body: 'Transforma reuniones, llamadas o audios en senales de riesgo y acciones sugeridas.',
  },
  {
    title: 'Validacion de proveedores',
    body: 'Contrasta enlaces, documentos y notas internas antes de aprobar nuevas relaciones comerciales.',
  },
];

export const methodologySteps = [
  {
    step: '01',
    title: 'Extraccion de datos',
    body: 'Conecta fuentes publicas y privadas, limpia el contexto y detecta los fragmentos que importan.',
  },
  {
    step: '02',
    title: 'Motor Obsidian',
    body: 'Cruza hechos, identifica contradicciones y prioriza el nivel de riesgo con reglas interpretables.',
  },
  {
    step: '03',
    title: 'Veredicto accionable',
    body: 'Entrega un dictamen con evidencia, resumen ejecutivo y siguientes pasos sugeridos.',
  },
];

export const pricingTiers = [
  {
    name: 'Basico',
    price: '$39',
    audience: 'Equipos pequenos que necesitan validar casos puntuales.',
    cta: 'Empezar ahora',
    href: '/inicio-de-sesion',
    featured: false,
    features: ['40 analisis / mes', '1 voz de IA', 'Historial de 30 dias', 'Reportes exportables'],
  },
  {
    name: 'Pro',
    price: '$119',
    audience: 'Operaciones legales y de compliance con trabajo recurrente.',
    cta: 'Suscribirse',
    href: '/inicio-de-sesion',
    featured: true,
    features: ['Analisis ilimitados', 'Biblioteca compartida', 'Plantillas de riesgo', 'Alertas prioritarias'],
  },
  {
    name: 'Elite',
    price: 'Custom',
    audience: 'Empresas con multiples equipos, gobernanza y soporte dedicado.',
    cta: 'Activar Elite',
    href: '/inicio-de-sesion',
    featured: false,
    features: ['Modelos de voz dedicados', 'Onboarding guiado', 'SLA prioritario', 'Integraciones privadas'],
  },
];

export const faqs = [
  {
    question: 'Que formatos analiza Veredicto?',
    answer: 'Puedes iniciar desde enlaces, PDFs, audio, texto libre y archivos del repositorio.',
  },
  {
    question: 'El veredicto reemplaza al equipo legal?',
    answer: 'No. Funciona como copiloto para acelerar la investigacion y dejar clara la evidencia.',
  },
  {
    question: 'Puedo compartir hallazgos con otras areas?',
    answer: 'Si. La libreria centraliza activos, notas, responsables y estados de cada analisis.',
  },
];

export const dashboardModes = [
  { id: 'enlace', label: 'Enlace' },
  { id: 'documento', label: 'Documento' },
  { id: 'audio', label: 'Audio' },
  { id: 'texto', label: 'Texto' },
];

export const dashboardSuggestions = [
  'Contrato de distribucion LATAM Q2',
  'Audio de reunion con proveedor nuevo',
  'Sitio publico del posible socio comercial',
  'Resumen de senales reputacionales recientes',
];

export const dashboardMetrics = [
  { label: 'Veredictos emitidos', value: '148', detail: '+19% este mes' },
  { label: 'Casos en revision', value: '12', detail: '4 con prioridad alta' },
  { label: 'Tiempo promedio', value: '4m 12s', detail: 'desde carga hasta informe' },
];

export const recentActivity = [
  {
    title: 'Proveedor Minerva Group',
    summary: 'Documentacion consistente y referencias verificadas en 3 fuentes.',
    verdict: 'Seguir',
    when: 'Hace 18 min',
  },
  {
    title: 'Acuerdo de licencias Orion',
    summary: 'Clausulas ambiguas y vacios en la cadena de aprobacion interna.',
    verdict: 'Revisar',
    when: 'Hace 2 h',
  },
  {
    title: 'Audio de negociacion Athena',
    summary: 'Se detectan promesas comerciales sin respaldo contractual.',
    verdict: 'Frenar',
    when: 'Ayer',
  },
];

export const libraryAssets = [
  {
    title: 'Dossier - Proveedor Atlas',
    kind: 'PDF',
    verdict: 'Seguir',
    meta: '12 paginas · 2.4 MB',
    updatedAt: 'Actualizado hoy',
  },
  {
    title: 'Llamada de aprobacion comercial',
    kind: 'AUDIO',
    verdict: 'Revisar',
    meta: '18 min · transcrito',
    updatedAt: 'Hace 3 horas',
  },
  {
    title: 'Sitio publico - Nova Legal',
    kind: 'LINK',
    verdict: 'Seguir',
    meta: '6 fuentes vinculadas',
    updatedAt: 'Hace 1 dia',
  },
  {
    title: 'Contrato de adquisicion Boreal',
    kind: 'DOCX',
    verdict: 'Frenar',
    meta: 'Version final sin firma',
    updatedAt: 'Hace 2 dias',
  },
  {
    title: 'Resumen de prensa - Proyecto Delta',
    kind: 'TEXT',
    verdict: 'Revisar',
    meta: '8 recortes analizados',
    updatedAt: 'Hace 5 dias',
  },
  {
    title: 'Checklist de onboarding socios',
    kind: 'PDF',
    verdict: 'Seguir',
    meta: 'Plantilla interna',
    updatedAt: 'Hace 1 semana',
  },
];

export const panelNavigation = [
  { label: 'Dashboard', href: '/panel' },
  { label: 'Libreria', href: '/panel/libreria' },
  { label: 'Analisis', href: '/panel/analisis/cargando' },
  { label: 'Configuracion', href: '/panel/configuracion' },
  { label: 'Soporte', href: '/como-funciona' },
];
