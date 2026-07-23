import { Destination, PosterFolder, Promotion, Poster } from '../types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 1,
    title: 'Viajes Culturales Colombia',
    category: 'cultural',
    tag: 'Cultural',
    description: 'Viaja por Colombia, el país del encanto. Descubre la magia y tradición de nuestra tierra.',
    image: 'https://images.unsplash.com/photo-1583531172005-814191b8b6c0?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $899.000 COP',
    duration: '5 días / 4 noches',
    highlights: ['Centro Histórico Candelaria', 'Museo del Oro', 'Catedral de Sal de Zipaquirá', 'Guatavita']
  },
  {
    id: 2,
    title: 'Experiencias Antioquia',
    category: 'naturaleza',
    tag: 'Naturaleza',
    description: 'Antioquia es mágica. Pueblos patrimoniales, el Peñol de Guatapé y la hospitalidad paisa.',
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $750.000 COP',
    duration: '4 días / 3 noches',
    highlights: ['Piedra del Peñol & Guatapé', 'Jardín Pueblo Patrimonio', 'Santa Fe de Antioquia', 'Tour de Cafetales']
  },
  {
    id: 3,
    title: 'Déjate Sorprender por Medellín',
    category: 'ciudad',
    tag: 'Ciudad',
    description: 'La ciudad de la eterna primavera te espera con innovación, metrocable, cultura y vida nocturna.',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $650.000 COP',
    duration: '3 días / 2 noches',
    highlights: ['Comuna 13 & Graffitour', 'Plaza Botero', 'Parque Arví por Metrocables', 'El Poblado']
  },
  {
    id: 4,
    title: 'Feria de las Flores 2026',
    category: 'evento',
    tag: 'Evento',
    description: 'No son solo flores, es tradición. Vive el desfile de Silleteros y la fiesta más grande de Colombia.',
    image: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $1.299.000 COP',
    duration: '5 días / 4 noches',
    highlights: ['Pase VIP Desfile Silleteros', 'Ruta Silletera en Santa Elena', 'Concierto Oficial', 'Chiva Rumbera']
  },
  {
    id: 5,
    title: 'Bogotá: 2.600m Más Cerca de las Estrellas',
    category: 'ciudad',
    tag: 'Ciudad',
    description: 'La capital vibrante de Colombia con cultura cosmopolita, gastronomía internacional y arte urbano.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $599.000 COP',
    duration: '3 días / 2 noches',
    highlights: ['Cerro de Monserrate', 'Usaquén Gastronómico', 'Zona T', 'Chorro de Quevedo']
  },
  {
    id: 6,
    title: 'Experiencias Caribe Colombiano',
    category: 'playa',
    tag: 'Playa',
    description: 'Mar turquesa e historia colonial en Cartagena, Santa Marta, Parque Tayrona y San Andrés.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $1.199.000 COP',
    duration: '6 días / 5 noches',
    highlights: ['Ciudad Amurallada Cartagena', 'Islas del Rosario', 'Playa Cristal Tayrona', 'Sunset Catamarán']
  },
  {
    id: 7,
    title: 'Cali: Capital Mundial de la Salsa',
    category: 'cultural',
    tag: 'Cultural',
    description: 'La sucursal del cielo con ritmo, gastronomía vallecaucana, clima cálido y alegría inigualable.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $699.000 COP',
    duration: '4 días / 3 noches',
    highlights: ['Show de Salsa Ensálsate', 'Cristo Rey & San Antonio', 'Ruta del Cholado', 'Río Pance']
  },
  {
    id: 8,
    title: 'Eje Cafetero Imperdible',
    category: 'naturaleza',
    tag: 'Naturaleza',
    description: 'Paisajes de café, palmas de cera gigantes en Salento, Cocora y termales de Santa Rosa.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $849.000 COP',
    duration: '4 días / 3 noches',
    highlights: ['Valle de Cocora & Salento', 'Termales de Santa Rosa', 'Parque del Café', 'Cata de Café Premium']
  },
  {
    id: 9,
    title: 'Bienestar y Naturaleza en la Amazonía',
    category: 'bienestar',
    tag: 'Bienestar',
    description: 'Reconecta con la naturaleza virgen en Leticia, avistamiento de delfines rosados y selva mística.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $1.399.000 COP',
    duration: '5 días / 4 noches',
    highlights: ['Delfines Rosados Puerto Nariño', 'Comunidad Indígena Yagua', 'Isla de los Micos', 'Night Canopy']
  },
  {
    id: 10,
    title: 'Cruceros y Viajes Internacionales',
    category: 'aventura',
    tag: 'Aventura',
    description: 'Navega por el Caribe y Europa con todo incluido, gastronomía gourmet y tours exclusivos.',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1000&q=80',
    price: 'Desde $2.499.000 COP',
    duration: '8 días / 7 noches',
    highlights: ['Todo Incluido a Bordo', 'Paradas en Islas Exóticas', 'Espectáculos Estilo Broadway', 'Camarote Balcón']
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    title: 'Escapada Caribe Colombiano',
    description: '7 días y 6 noches visitando Cartagena, Santa Marta y Parque Tayrona. Vuelos + Hotel 4★ + Desayunos.',
    price: 'Desde $1.899.000 COP',
    badge: '-20% DESC',
    category: 'caribe',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Medellín + Eje Cafetero VIP',
    description: '5 días explorando la Ciudad de la Eterna Primavera, Guatapé y haciendas cafeteras tradicionales.',
    price: 'Desde $1.299.000 COP',
    badge: 'NUEVO',
    category: 'medellin',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Feria de las Flores 2026',
    description: 'Paquete especial con palcos reservados para el Desfile de Silleteros, alojamiento y tours culturales.',
    price: 'Desde $1.499.000 COP',
    badge: 'POPULAR',
    category: 'medellin',
    image: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_POSTERS: Poster[] = [
  {
    id: 1,
    title: 'Cartagena Colonial y Murallas',
    folder: 'caribe',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Medellín Innovación y Metro',
    folder: 'medellin',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Valle de Cocora & Salento',
    folder: 'eje-cafetero',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Playas Paradisíacas San Andrés',
    folder: 'caribe',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'Silleteros Tradición Antioqueña',
    folder: 'medellin',
    image: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    title: 'Bogotá Monserrate & Candelaria',
    folder: 'bogota',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  }
];

export const POSTER_FOLDERS: PosterFolder[] = [
  { name: 'colombia', label: 'Colombia', icon: 'Flag', color: 'from-amber-400 to-orange-500' },
  { name: 'antioquia', label: 'Antioquia', icon: 'Mountain', color: 'from-emerald-400 to-teal-500' },
  { name: 'medellin', label: 'Medellín', icon: 'Building2', color: 'from-sky-400 to-blue-600' },
  { name: 'caribe', label: 'Caribe', icon: 'Palmtree', color: 'from-cyan-400 to-teal-500' },
  { name: 'bogota', label: 'Bogotá', icon: 'Landmark', color: 'from-purple-400 to-pink-500' },
  { name: 'cali', label: 'Cali', icon: 'Music', color: 'from-red-400 to-orange-500' },
  { name: 'eje-cafetero', label: 'Eje Cafetero', icon: 'Coffee', color: 'from-amber-600 to-yellow-700' }
];
