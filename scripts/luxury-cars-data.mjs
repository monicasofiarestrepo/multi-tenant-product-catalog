/** Catalog seed: luxury / premium cars per brand */

export const BRANDS = [
  { slug: 'bmw', name: 'BMW' },
  { slug: 'honda', name: 'Honda' },
  { slug: 'mini', name: 'MINI' },
  { slug: 'jeep', name: 'Jeep' },
  { slug: 'hyundai', name: 'Hyundai' },
  { slug: 'mercedes', name: 'Mercedes-Benz' },
  { slug: 'mazda', name: 'Mazda' },
  { slug: 'volvo', name: 'Volvo' },
  { slug: 'lexus', name: 'Lexus' },
]

/** Unsplash JPEGs validados (w=1200) — se rotan entre productos */
export const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617531653635-4b0e357c091b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1577496549804-8b05f1f67338?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568074532099-1e0dc3206a74?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=1200&q=80',
]

export const PRODUCTS_BY_BRAND = {
  bmw: [
    {
      name: 'BMW X5 xDrive40i',
      category: 'SUV',
      price: 67900,
      description:
        'SUV premium con motor de 6 cilindros, tracción integral y acabados de lujo. Ideal para viajes largos con espacio y tecnología BMW.',
    },
    {
      name: 'BMW X7 M60i',
      category: 'SUV',
      price: 112900,
      description:
        'El flagship de la gama X: tres filas, presencia imponente y potencia V8. Confort de primera clase para siete ocupantes.',
    },
    {
      name: 'BMW M4 Competition',
      category: 'Deportivo',
      price: 84900,
      description:
        'Coupé de altas prestaciones con chasis M y sonido característico. Diseñado para circuito y carretera con el mismo rigor.',
    },
    {
      name: 'BMW M8 Gran Coupé',
      category: 'Gran Turismo',
      price: 139900,
      description:
        'Cuatro puertas, alma de supersport. Combina lujo discreto con aceleración brutal y detalles M exclusivos.',
    },
    {
      name: 'BMW Serie 7 740i',
      category: 'Sedán',
      price: 98900,
      description:
        'Sedán ejecutivo de nueva generación: cabina digital, asientos Executive y un silencio de marcha impecable.',
    },
    {
      name: 'BMW iX xDrive50',
      category: 'Eléctrico',
      price: 87900,
      description:
        'SUV 100% eléctrico con autonomía generosa, carga rápida y el lenguaje de diseño más futurista de BMW.',
    },
    {
      name: 'BMW Z4 M40i',
      category: 'Roadster',
      price: 69900,
      description:
        'Roadster de dos plazas con techo de lona y motor de 6 cilindros en línea. Placer de conducción al aire libre.',
    },
    {
      name: 'BMW XM Label Red',
      category: 'SUV',
      price: 179900,
      description:
        'Híbrido enchufable de alto rendimiento firmado por M. Exclusividad, potencia y un diseño que no pasa desapercibido.',
    },
  ],
  honda: [
    {
      name: 'Honda Civic Type R',
      category: 'Deportivo',
      price: 45900,
      description:
        'El hot hatch de referencia: diferencial LSD, aerodinámica agresiva y un manejo preciso digno de circuito.',
    },
    {
      name: 'Honda Accord Touring Hybrid',
      category: 'Sedán',
      price: 38900,
      description:
        'Sedán híbrido con acabado Touring: techo panorámico, audio premium y eficiencia sin renunciar al confort.',
    },
    {
      name: 'Honda CR-V Hybrid Touring',
      category: 'SUV',
      price: 41900,
      description:
        'SUV familiar híbrido con gran maletero, asistencias Honda Sensing y un consumo contenido en ciudad.',
    },
    {
      name: 'Honda Pilot Elite',
      category: 'SUV',
      price: 52900,
      description:
        'Tres filas y capacidad de remolque real. Acabado Elite con pantallas duales y asientos ventilados.',
    },
    {
      name: 'Honda Passport Trailsport',
      category: 'SUV',
      price: 47900,
      description:
        'SUV aventurero con suspensión elevada, protecciones off-road y tracción lista para caminos de tierra.',
    },
    {
      name: 'Honda HR-V Sport',
      category: 'Crossover',
      price: 28900,
      description:
        'Crossover compacto ágil y versátil. Perfecto para ciudad con un toque deportivo en el paquete Sport.',
    },
    {
      name: 'Honda Odyssey Elite',
      category: 'Minivan',
      price: 51900,
      description:
        'La minivan premium de Honda: asientos Magic Slide, entretenimiento a bordo y un habitáculo silencioso.',
    },
    {
      name: 'Honda Ridgeline Black Edition',
      category: 'Pickup',
      price: 46900,
      description:
        'Pickup unibody con caja Dual-Action y confort de SUV. Black Edition con detalles exclusivos en negro.',
    },
  ],
  mini: [
    {
      name: 'MINI Cooper S 3 puertas',
      category: 'Hatchback',
      price: 34900,
      description:
        'El icono británico con motor turbo y manejo ágil. Personalizable al extremo y perfecto para la ciudad.',
    },
    {
      name: 'MINI John Cooper Works',
      category: 'Deportivo',
      price: 42900,
      description:
        'La versión más radical: frenos Brembo, modo Sport y un carácter que se siente en cada curva.',
    },
    {
      name: 'MINI Countryman ALL4',
      category: 'Crossover',
      price: 41900,
      description:
        'El MINI más espacioso, con tracción ALL4 y maletero generoso. Estilo go-kart en formato familiar.',
    },
    {
      name: 'MINI Clubman JCW',
      category: 'Wagon',
      price: 44900,
      description:
        'Wagon de seis puertas con alma JCW. Espacio práctico y prestaciones que sorprenden en carretera.',
    },
    {
      name: 'MINI Cooper Convertible',
      category: 'Convertible',
      price: 38900,
      description:
        'Techo soft-top eléctrico y el mismo manejo divertido. Listo para el fin de semana en la costa.',
    },
    {
      name: 'MINI Cooper SE Eléctrico',
      category: 'Eléctrico',
      price: 36900,
      description:
        'MINI 100% eléctrico con respuesta inmediata y cero emisiones locales. Ideal para entornos urbanos.',
    },
    {
      name: 'MINI Aceman SE',
      category: 'Crossover',
      price: 39900,
      description:
        'Crossover eléctrico de nueva generación: diseño minimalista, cabina digital y autonomía competitiva.',
    },
    {
      name: 'MINI Paceman Cooper S',
      category: 'Crossover',
      price: 32900,
      description:
        'Coupé crossover de colección: silueta única, dos puertas y el ADN Cooper S en cada detalle.',
    },
  ],
  jeep: [
    {
      name: 'Jeep Wrangler Rubicon',
      category: 'Off-road',
      price: 54900,
      description:
        'El rey del 4x4: bloqueos de diferencial, ángulos de ataque extremos y techos removibles.',
    },
    {
      name: 'Jeep Grand Cherokee Summit Reserve',
      category: 'SUV',
      price: 72900,
      description:
        'Lujo y capacidad off-road en un mismo SUV. Asientos de napa, McIntosh audio y Quadra-Lift.',
    },
    {
      name: 'Jeep Grand Wagoneer Series III',
      category: 'SUV',
      price: 98900,
      description:
        'SUV full-size de lujo americano: tres filas, materiales premium y una presencia imponente.',
    },
    {
      name: 'Jeep Gladiator Mojave',
      category: 'Pickup',
      price: 58900,
      description:
        'Pickup abierta al desierto: suspensión Fox, ruedas de 33" y la versatilidad de una caja real.',
    },
    {
      name: 'Jeep Compass Trailhawk',
      category: 'Crossover',
      price: 36900,
      description:
        'Crossover con credenciales Trailhawk: altura extra, tracción Selec-Terrain y look aventurero.',
    },
    {
      name: 'Jeep Renegade 4xe Trailhawk',
      category: 'Híbrido',
      price: 39900,
      description:
        'Híbrido enchufable compacto con modo eléctrico en ciudad y 4x4 cuando el camino se complica.',
    },
    {
      name: 'Jeep Wagoneer L Series II',
      category: 'SUV',
      price: 84900,
      description:
        'Batalla larga para máximo espacio en tercera fila. Confort de viaje y capacidad de remolque elevada.',
    },
    {
      name: 'Jeep Cherokee Trailhawk',
      category: 'SUV',
      price: 42900,
      description:
        'SUV mediano con ADN Jeep: Active Drive Lock y un perfil listo para caminos poco transitados.',
    },
  ],
  hyundai: [
    {
      name: 'Hyundai Ioniq 5 Limited',
      category: 'Eléctrico',
      price: 52900,
      description:
        'Crossover eléctrico con plataforma E-GMP, carga ultrarrápida y un interior espacioso tipo lounge.',
    },
    {
      name: 'Hyundai Ioniq 6 Exclusive',
      category: 'Eléctrico',
      price: 54900,
      description:
        'Sedán aerodinámico 100% eléctrico. Silencio, autonomía competitiva y un diseño streamliner único.',
    },
    {
      name: 'Hyundai Palisade Calligraphy',
      category: 'SUV',
      price: 56900,
      description:
        'SUV de tres filas con el acabado más exclusivo: asientos relajantes, audio Bose y presencia premium.',
    },
    {
      name: 'Hyundai Santa Fe Calligraphy',
      category: 'SUV',
      price: 48900,
      description:
        'Nueva generación con diseño robusto, HTRAC y un habitáculo tecnológico de nivel Calligraphy.',
    },
    {
      name: 'Hyundai Tucson Limited Hybrid',
      category: 'Híbrido',
      price: 39900,
      description:
        'SUV compacto híbrido con gran eficiencia, pantalla panorámica y asistencia de conducción avanzada.',
    },
    {
      name: 'Hyundai Sonata N Line',
      category: 'Sedán',
      price: 36900,
      description:
        'Sedán con toque deportivo N Line: spoiler, escape dual y un chasis más firme sin perder confort.',
    },
    {
      name: 'Hyundai Elantra N',
      category: 'Deportivo',
      price: 35900,
      description:
        'Sedán deportivo de alto rendimiento: diferencial electrónico, asientos bucket y modo N Drift.',
    },
    {
      name: 'Hyundai Kona Electric Limited',
      category: 'Eléctrico',
      price: 42900,
      description:
        'Crossover urbano eléctrico renovado: más autonomía, carga más rápida y un cockpit digital moderno.',
    },
  ],
  mercedes: [
    {
      name: 'Mercedes-Benz Clase C 300',
      category: 'Sedán',
      price: 52900,
      description:
        'Sedán compacto de lujo con MBUX de última generación, acabados de alta calidad y manejo equilibrado.',
    },
    {
      name: 'Mercedes-Benz Clase E 450',
      category: 'Sedán',
      price: 68900,
      description:
        'El ejecutivo por excelencia: confort de suspensión, aislamiento acústico y tecnología de asistencia.',
    },
    {
      name: 'Mercedes-Benz Clase S 580',
      category: 'Sedán',
      price: 129900,
      description:
        'El buque insignia: asientos con masaje, Hyperscreen opcional y un nivel de refinamiento sin rival.',
    },
    {
      name: 'Mercedes-Benz GLE 450',
      category: 'SUV',
      price: 71900,
      description:
        'SUV mediano premium con motor mild-hybrid, habitáculo amplio y presencia de estrella en la calzada.',
    },
    {
      name: 'Mercedes-Benz GLS 580',
      category: 'SUV',
      price: 99900,
      description:
        'SUV de tres filas de lujo extremo. Espacio, potencia V8 y un silencio digno de la Clase S.',
    },
    {
      name: 'Mercedes-AMG GT 63 S',
      category: 'Deportivo',
      price: 169900,
      description:
        'Gran Turismo AMG de cuatro puertas: biturbo V8, tracción 4MATIC+ y prestaciones de supersport.',
    },
    {
      name: 'Mercedes-Benz Clase G 550',
      category: 'Off-road',
      price: 149900,
      description:
        'El icono off-road de lujo. Capacidad 4x4 legendaria envuelta en materiales premium y tecnología actual.',
    },
    {
      name: 'Mercedes-Benz EQS 450+',
      category: 'Eléctrico',
      price: 109900,
      description:
        'Sedán eléctrico de lujo con Hyperscreen, autonomía de referencia y un coeficiente aerodinámico récord.',
    },
  ],
  mazda: [
    {
      name: 'Mazda MX-5 Miata RF',
      category: 'Roadster',
      price: 38900,
      description:
        'El roadster ligero por excelencia. Techo retráctil hardtop, equilibrio perfecto y pura diversión.',
    },
    {
      name: 'Mazda CX-90 PHEV Premium Plus',
      category: 'Híbrido',
      price: 57900,
      description:
        'SUV de tres filas híbrido enchufable con motor de 6 cilindros en línea y acabados de lujo japonés.',
    },
    {
      name: 'Mazda CX-50 Meridian Edition',
      category: 'SUV',
      price: 42900,
      description:
        'SUV aventurero con look Meridian, techo de lona opcional y tracción lista para escapadas de fin de semana.',
    },
    {
      name: 'Mazda CX-5 Signature',
      category: 'SUV',
      price: 39900,
      description:
        'SUV compacto con acabado Signature: Nappa, head-up display y el manejo ágil típico de Mazda.',
    },
    {
      name: 'Mazda3 Hatchback Turbo',
      category: 'Hatchback',
      price: 34900,
      description:
        'Hatchback premium con turbo y AWD. Diseño Kodo, interior refinado y un chasis muy comunicativo.',
    },
    {
      name: 'Mazda CX-30 Turbo',
      category: 'Crossover',
      price: 33900,
      description:
        'Crossover compacto turbo con tracción integral. Ideal para quien busca estilo y respuesta en ciudad.',
    },
    {
      name: 'Mazda6 Signature',
      category: 'Sedán',
      price: 36900,
      description:
        'Sedán elegante con acabado Signature, asientos ventilados y un nivel de refinamiento poco común en su clase.',
    },
    {
      name: 'Mazda MX-30 EV',
      category: 'Eléctrico',
      price: 35900,
      description:
        'Crossover eléctrico con puertas suicide traseras y materiales sostenibles. Perfecto para movilidad urbana.',
    },
  ],
  volvo: [
    {
      name: 'Volvo XC90 Recharge T8',
      category: 'Híbrido',
      price: 74900,
      description:
        'SUV de tres filas híbrido enchufable. Seguridad escandinava, Bowers & Wilkins y autonomía eléctrica diaria.',
    },
    {
      name: 'Volvo XC60 Recharge T8',
      category: 'Híbrido',
      price: 62900,
      description:
        'SUV mediano PHEV con Pilot Assist, interior minimalista y un equilibrio impecable entre confort y eficiencia.',
    },
    {
      name: 'Volvo XC40 Recharge',
      category: 'Eléctrico',
      price: 55900,
      description:
        'Crossover compacto 100% eléctrico. Diseño escandinavo, Google integrado y carga rápida en DC.',
    },
    {
      name: 'Volvo S90 Recharge',
      category: 'Sedán',
      price: 67900,
      description:
        'Sedán ejecutivo híbrido enchufable. Silencio nórdico, asientos ergonómicos y presencia discreta de lujo.',
    },
    {
      name: 'Volvo S60 Polestar Engineered',
      category: 'Sedán',
      price: 58900,
      description:
        'Sedán deportivo afinado por Polestar: frenos Brembo, Öhlins y un carácter más afilado sin perder elegancia.',
    },
    {
      name: 'Volvo C40 Recharge',
      category: 'Eléctrico',
      price: 57900,
      description:
        'Coupé-crossover eléctrico con techo fijo, silueta dinámica y la misma plataforma que el XC40 Recharge.',
    },
    {
      name: 'Volvo V60 Cross Country',
      category: 'Wagon',
      price: 51900,
      description:
        'Wagon elevado listo para cualquier clima. Espacio de carga real y tracción integral de serie.',
    },
    {
      name: 'Volvo EX90 Twin Motor',
      category: 'Eléctrico',
      price: 84900,
      description:
        'SUV eléctrico de nueva generación: LiDAR, tres filas y la visión de seguridad más avanzada de Volvo.',
    },
  ],
  lexus: [
    {
      name: 'Lexus RX 500h F Sport',
      category: 'Híbrido',
      price: 67900,
      description:
        'SUV híbrido de alto desempeño F Sport. Diseño afilado, manejo ágil y el refinamiento típico de Lexus.',
    },
    {
      name: 'Lexus NX 450h+ F Sport',
      category: 'Híbrido',
      price: 59900,
      description:
        'Crossover PHEV con autonomía eléctrica generosa, acabado F Sport y una cabina digital de última generación.',
    },
    {
      name: 'Lexus ES 350 Ultra Luxury',
      category: 'Sedán',
      price: 52900,
      description:
        'Sedán de confort extremo: asientos con shiatsu, Mark Levinson y un silencio de marcha de referencia.',
    },
    {
      name: 'Lexus LS 500h',
      category: 'Sedán',
      price: 89900,
      description:
        'El buque insignia híbrido: artesanía Takumi, suspensión adaptativa y un nivel de lujo japonés inigualable.',
    },
    {
      name: 'Lexus GX 550 Overtrail',
      category: 'Off-road',
      price: 74900,
      description:
        'SUV body-on-frame listo para el trail: bloqueos, neumáticos todo terreno y lujo que aguanta el castigo.',
    },
    {
      name: 'Lexus LX 600 Ultra Luxury',
      category: 'SUV',
      price: 109900,
      description:
        'SUV full-size de lujo extremo. Capacidad off-road, tres filas y un habitáculo digno de limusina.',
    },
    {
      name: 'Lexus IS 500 F Sport Performance',
      category: 'Sedán',
      price: 61900,
      description:
        'Sedán deportivo con V8 aspirado. Sonido analógico, chasis F Sport y carácter puro de conducción.',
    },
    {
      name: 'Lexus LC 500 Convertible',
      category: 'Convertible',
      price: 109900,
      description:
        'Gran turismo convertible: V8, diseño escultural y una experiencia de lujo al aire libre sin concesiones.',
    },
  ],
}
