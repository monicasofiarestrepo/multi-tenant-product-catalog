/** Extra brands: Bike House, Biky, Keybe */

export const EXTRA_BRANDS = [
  { slug: 'bikystore', name: 'Bike House' },
  { slug: 'biky', name: 'Biky' },
  { slug: 'keybe', name: 'Keybe' },
]

/** Precios en COP como en bikehouse.co */
export const BIKEHOUSE_PRODUCTS = [
  {
    name: 'Trek Domane AL 2 Gen 4 2027',
    category: 'Ruta',
    price: 4090000,
    description:
      'Bicicleta de ruta de aluminio, ideal para iniciarse en el ciclismo de carretera. Cómoda, ligera y disponible en Bike House Colombia.',
  },
  {
    name: 'Trek Domane AL 4 Gen 4 2027',
    category: 'Ruta',
    price: 6290000,
    description:
      'Domane de aluminio con mejor grupo y más confort para rutas largas. Perfecta para resistir y disfrutar el asfalto.',
  },
  {
    name: 'Trek Procaliber 6 2027',
    category: 'Montaña',
    price: 4990000,
    description:
      'MTB hardtail de cross country: cuadro rígido, eficiente en subidas y lista para senderos técnicos de nivel intermedio.',
  },
  {
    name: 'Trek Procaliber 8 2027',
    category: 'Montaña',
    price: 5990000,
    description:
      'Versión superior del Procaliber con mejor transmisión y componentes. Competir o entrenar en XC con más precisión.',
  },
  {
    name: 'Trek Madone SLR 9 AXS Gen 8 2026',
    category: 'Ruta',
    price: 61900000,
    description:
      'La aero de competencia tope de gama: cuadro SLR, transmisión electrónica AXS y el máximo rendimiento Trek en carretera.',
  },
  {
    name: 'Trek Madone SL 5 Gen 8 2026',
    category: 'Ruta',
    price: 11636500,
    description:
      'Madone aerodinámica accesible dentro de la línea SL. Velocidad, integración y look de equipo profesional.',
  },
  {
    name: 'Trek Marlin 4 2026',
    category: 'Montaña',
    price: 2195000,
    description:
      'Entrada a la montaña Trek: confiable para ciudad, caminos y primeros senderos. Excelente relación calidad-precio.',
  },
  {
    name: 'Trek Marlin 5 Gen 3 2026',
    category: 'Montaña',
    price: 2589000,
    description:
      'Marlin renovada: más control y comodidad para trail ligero y uso diario. Una de las más vendidas en Bike House.',
  },
  {
    name: 'Trek Marlin 7 2026',
    category: 'Montaña',
    price: 4290000,
    description:
      'Marlin con mejores frenos y transmisión. Lista para senderos más exigentes sin perder versatilidad urbana.',
  },
  {
    name: 'Trek Rail+ 8 Gen 5 2026',
    category: 'E-Bike',
    price: 28190000,
    description:
      'E-MTB de enduro con asistencia potente. Subidas sin drama y bajadas con confianza total en montaña.',
  },
  {
    name: 'Trek Checkpoint ALR 5 AXS 2025',
    category: 'Gravel',
    price: 9766500,
    description:
      'Gravel de aluminio con transmisión AXS. Ideal para rutas mixtas, bikepacking y aventura fuera del asfalto.',
  },
  {
    name: 'Trek Precaliber 20 2026',
    category: 'Niños',
    price: 1369000,
    description:
      'Bici para niños (aprox. 5–7 años / rin 20). Segura, ligera y perfecta para aprender a pedalear con estilo Trek.',
  },
]

/** Planes y add-ons según biky.ai/pricing (USD / mes o one-shot) */
export const BIKY_PRODUCTS = [
  {
    name: 'Plan Essential — Autopilot AI Messages',
    category: 'Suscripción',
    price: 790,
    description:
      'Plan Essential de Biky (USD 790/mes): 7.000 mensajes IA, analytics esencial y 1 h/mes de consultoría KGM. Ideal para pasar de responder chats a cerrar ventas 24/7 en WhatsApp, Instagram, Facebook y Web Chat. Incluye catálogo inteligente hasta 300 SKUs.',
  },
  {
    name: 'Plan Pro — Autopilot AI Messages',
    category: 'Suscripción',
    price: 1190,
    description:
      'Plan Pro (USD 1.190/mes): 15.000 mensajes IA, 2 h/mes de KGM y control total del ciclo comercial. Catálogo hasta 800 SKUs, Avatar PRO y analytics profesional por canal, sede y campaña. Pensado para operaciones multi-equipo y omnicanal.',
  },
  {
    name: 'Plan Prime — Autopilot AI Messages',
    category: 'Suscripción',
    price: 2280,
    description:
      'Plan Prime (USD 2.280/mes): 30.000 mensajes IA, 4 h/mes de KGM y arquitectura multi-marca / multi-país. Hasta 2.000 SKUs, Avatar PRIME exclusivo y analytics predictivo (propensión de compra, recomendaciones y escenarios).',
  },
  {
    name: 'Onboarding Essential (Nitro)',
    category: 'Onboarding',
    price: 980,
    description:
      'Onboarding Essential (USD 980). Recomendado con Nitro para que la IA quede lista para convertir desde el día uno: configuración, entrenamiento emocional y puesta en marcha del Autopilot.',
  },
  {
    name: 'Onboarding Pro (Nitro)',
    category: 'Onboarding',
    price: 1480,
    description:
      'Onboarding Pro (USD 1.480). Acompañamiento ampliado para operaciones con varias sedes o canales: data architecture para nuevos/usados, taller y servicio.',
  },
  {
    name: 'Onboarding Prime (Nitro)',
    category: 'Onboarding',
    price: 1980,
    description:
      'Onboarding Prime (USD 1.980). Implementación enterprise para grupos multi-unidad y multi-país, con foco en analítica corporativa y escala.',
  },
  {
    name: 'Smart Product & Service Catalog',
    category: 'Módulo',
    price: 0,
    description:
      'Catálogo inteligente omnicanal incluido en los planes Biky: fotos, videos, variantes, disponibilidad, precios, bundles y promociones centralizados para cotizar y vender sin fricción (límites de SKU según plan).',
  },
  {
    name: 'Autopilot AI Chats',
    category: 'Suscripción',
    price: 790,
    description:
      'Modalidad Autopilot orientada a chats (sesiones 24 h). Misma plataforma de Emotional AI 24/7, seguimiento proactivo con LAM y sitio conversacional en biky.app/tu-marca.',
  },
]

/** Productos Keybe — SmartChat y suite (USD/mes aprox.) */
export const KEYBE_PRODUCTS = [
  {
    name: 'Keybe SmartChat',
    category: 'Plataforma',
    price: 890,
    description:
      'Sistema de comunicación comercial chat-first de Keybe: omnicanal (WhatsApp, Messenger, Instagram DM y Web Chat), multiagente, autoasignación, análisis de sentimientos, CSAT, tipificación, métricas y trazabilidad. Integra datos al CRM/CDP y detecta oportunidades con Biky Asistente (Tesseract). *Precio aproximado, a pactar según las necesidades de la empresa.',
  },
  {
    name: 'SmartChat — Omnicanal',
    category: 'Módulo',
    price: 290,
    description:
      'Unifica conversaciones de WhatsApp, Facebook Messenger, Instagram DM y Chat Web en un solo inbox con experiencia consistente para el cliente. *Precio aproximado, a pactar según las necesidades de la empresa.',
  },
  {
    name: 'SmartChat — Multiagente & Spaces',
    category: 'Módulo',
    price: 350,
    description:
      'Varios agentes en paralelo, spaces por equipo/zona/campaña y chat interno para coordinar respuestas sin perder el hilo con el cliente. *Precio aproximado, a pactar según las necesidades de la empresa.',
  },
  {
    name: 'SmartChat — Autoasignación & SLA',
    category: 'Módulo',
    price: 320,
    description:
      'Distribuye cada conversación al agente correcto según disponibilidad, prioridad o skills, y monitorea tiempos de espera para cumplir SLA. *Precio aproximado, a pactar según las necesidades de la empresa.',
  },
  {
    name: 'SmartChat — Sentimientos & CSAT',
    category: 'Analytics',
    price: 250,
    description:
      'Detecta el tono (positivo, neutral, negativo) para priorizar con empatía y envía encuestas CSAT al cerrar la sesión. *Precio aproximado, a pactar según las necesidades de la empresa.',
  },
  {
    name: 'SmartChat — Biky Asistente',
    category: 'IA',
    price: 490,
    description:
      'Asistente Biky dentro de SmartChat: extrae identidad, demográficos y oportunidades de venta del chat y alimenta Contactos y Funnels en tiempo real. *Precio aproximado, a pactar según las necesidades de la empresa.',
  },
  {
    name: 'SmartChat — Métricas & Logs',
    category: 'Analytics',
    price: 280,
    description:
      'Dashboards de rendimiento del equipo, canales y tipificaciones, más logs completos para auditoría y cumplimiento. *Precio aproximado, a pactar según las necesidades de la empresa.',
  },
  {
    name: 'Suite de ventas Keybe + SmartChat',
    category: 'Suite',
    price: 1890,
    description:
      'SmartChat como núcleo de la suite de ventas Keybe: conecta conversación, CRM inteligente, CDP y automatización para vender con talento humano + IA. *Precio aproximado, a pactar según las necesidades de la empresa.',
  },
]

export const BIKE_IMAGES = [
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?auto=format&fit=crop&w=1200&q=80',
]

export const SAAS_IMAGES = [
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
]
