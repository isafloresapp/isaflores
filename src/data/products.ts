import { Product, CustomFlowerOption, Review } from '../types';
import heroBouquetImg from '../assets/images/hero_pipe_cleaner_bouquet_1786069749958.jpg';
import girasolesImg from '../assets/images/girasoles_limpiapipas_1786069760102.jpg';
import kitDiyImg from '../assets/images/kit_diy_limpiapipas_1786069771911.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'ramo-coral-eterno',
    name: 'ramo Coral duradera',
    category: 'ramos',
    price: 14990,
    rating: 4.9,
    reviewsCount: 214,
    description: 'Ensamble de 12 ramos de flores en tonos coral velvet, rubor y mostaza silvestre, envueltas en fino envoltorio artesanal.',
    fullDetails: 'flor hecha a mano compuesta por 5 rosas de chenille coral, 4 margaritas silvestres, 3 espigas de lavanda de alambre templado y follaje botánico en salvia. Presentación envuelta en papel artesanal con finos detalles de fibra natural.',
    badge: '🔥 Edición Emblemática',
    image: heroBouquetImg,
    bgTint: 'linear-gradient(135deg, #f70071 0%, #ff1b82 100%)',
    flowerCount: 12,
    tags: ['Atemporal', 'Exclusivo', 'Insignia']
  },
  {
    id: 'girasoles-alambre',
    name: 'Colección Girasoles Silvestres',
    category: 'ramos',
    price: 9990,
    rating: 5.0,
    reviewsCount: 58,
    description: 'Seis flores de girasoles esculpidos en chenille de alta densidad y centro en microfibra parda.',
    fullDetails: 'Moldeados individualmente a mano con núcleo de alambre de calibre botánico flexible. Sus pétalos conservan volumen, textura y curvatura inalterable con el paso del tiempo.',
    badge: '⭐ Novedad',
    image: girasolesImg,
    bgTint: 'linear-gradient(135deg, #ff1b82 0%, #ff5aa4 100%)',
    flowerCount: 6,
    tags: ['Escultural', 'Espacios', 'Girasoles']
  },
  {
    id: 'ramo-bosque-verde',
    name: 'ramo Botánica Bosque Salvia',
    category: 'ramos',
    price: 12490,
    rating: 4.8,
    reviewsCount: 97,
    description: 'Armonía orgánica en tonos verde eucalipto, marfil mineral y delicados matices dorados.',
    fullDetails: 'Diseño arquitectónico floral de 10 elementos. Una propuesta estética contemporánea ideal para enriquecer interiores minimalistas y conceptos de decoración de autor.',
    badge: '🌿 Alta Costura',
    image: heroBouquetImg,
    bgTint: 'linear-gradient(135deg, #ff5aa4 0%, #ff96c5 100%)',
    flowerCount: 10,
    tags: ['Minimalista', 'Contemporáneo', 'Elegante']
  },
  {
    id: 'ramo-blush-romance',
    name: 'ramo Blush & Seda',
    category: 'ramos',
    price: 15990,
    rating: 4.9,
    reviewsCount: 133,
    description: 'Gradación cromática en rosa cuarzo, malva aterciopelado y destellos metalizados con lazo de satén.',
    fullDetails: 'Colección romántica de 14 tallos moldeados minuciosamente. Incluye sobre de cortesía y tarjeta con caligrafía personalizada para dedicatorias especiales.',
    badge: '💖 Edición Limitada',
    image: heroBouquetImg,
    bgTint: 'linear-gradient(135deg, #f70071 0%, #ff96c5 100%)',
    flowerCount: 14,
    tags: ['Ceremonial', 'Aniversario', 'Alta Costura']
  },
  {
    id: 'kit-diy-completo',
    name: 'Kit para Armar Creación Floral',
    category: 'kits',
    price: 8490,
    rating: 4.7,
    reviewsCount: 41,
    description: 'Cofre artesanal con 50 fibras de chenille seleccionadas, guía de moldeado y componentes de fijación botánica.',
    fullDetails: 'Diseñado para apasionados del diseño y manualidades de autor. Incluye insumos para crear hasta 8 flores florales completas con acabado profesional.',
    badge: '🎨 Experiencia DIY',
    image: kitDiyImg,
    bgTint: 'linear-gradient(135deg, #ff96c5 0%, #ffc0dc 100%)',
    flowerCount: 8,
    tags: ['Taller', 'Experiencia', 'Manualidad']
  },
  {
    id: 'florero-mini-mostaza',
    name: 'Ensamble Botánico Mini & Cerámica',
    category: 'decoracion',
    price: 7990,
    rating: 4.9,
    reviewsCount: 76,
    description: 'Trío de margaritas de chenille dispuestas en florero artesanal de cerámica esmaltada.',
    fullDetails: 'Objeto de diseño para escritorios, bibliotecas o veladores. Florero de 10 cm con ensamble floral alcanzando 18 cm de altura total armoniosa.',
    badge: '🏺 decoración',
    image: girasolesImg,
    bgTint: 'linear-gradient(135deg, #ff1b82 0%, #ffc0dc 100%)',
    flowerCount: 3,
    tags: ['decoración', 'Escritorio', 'Objeto de Arte']
  },
  {
    id: 'ramo-novia-boho',
    name: 'Bouquet de Autor Ceremonias & Bodas',
    category: 'personalizados',
    price: 24990,
    rating: 5.0,
    reviewsCount: 189,
    description: '18 flores exclusivas en paleta marfil, champagne y eucalipto para momentos memorables.',
    fullDetails: 'Concebido especialmente para enlaces, celebraciones inolvidables y aniversarios de hito. Inalterable con el paso de las estaciones.',
    badge: '👑 Colección Real',
    image: heroBouquetImg,
    bgTint: 'linear-gradient(135deg, #f70071 0%, #ffc0dc 100%)',
    flowerCount: 18,
    tags: ['Novias', 'Boda', 'Colección de Autor']
  },
  {
    id: 'corona-mesa-lila',
    name: 'Corona Escultórica Terciopelo Lila',
    category: 'decoracion',
    price: 17990,
    rating: 4.8,
    reviewsCount: 64,
    description: 'Arreglo de centro de mesa circular en tonalidades lila silvestre, ciruela y follaje salvia.',
    fullDetails: 'Estructura circular de 25 cm de diámetro. Diseñada como pieza central arquitectónica para enmarcar iluminación cálida o vajilla fina en veladas especiales.',
    badge: '✨ Centro de Mesa',
    image: heroBouquetImg,
    bgTint: 'linear-gradient(135deg, #ff5aa4 0%, #f70071 100%)',
    flowerCount: 15,
    tags: ['Centro de Mesa', 'decoración', 'Colección']
  }
];

export const CUSTOM_FLOWER_OPTIONS: CustomFlowerOption[] = [
  {
    id: 'girasol',
    name: 'Girasol Silvestre',
    colorName: 'Amarillo Azafrán',
    colorHex: '#ffc0dc',
    pricePerStem: 1800,
    iconSvg: '🌻'
  },
  {
    id: 'rosa_coral',
    name: 'Rosa Velvet Coral',
    colorName: 'Coral Terracota',
    colorHex: '#f70071',
    pricePerStem: 2200,
    iconSvg: '🌹'
  },
  {
    id: 'tulipan_salvia',
    name: 'Tulipán Eucalipto',
    colorName: 'Verde Salvia',
    colorHex: '#ff1b82',
    pricePerStem: 1900,
    iconSvg: '🌷'
  },
  {
    id: 'margarita_blanca',
    name: 'Margarita Mineral',
    colorName: 'Blanco Marfil',
    colorHex: '#ff5aa4',
    pricePerStem: 1500,
    iconSvg: '🌼'
  },
  {
    id: 'lavanda_lila',
    name: 'Espiga Lavanda',
    colorName: 'Lila Aterciopelado',
    colorHex: '#ff96c5',
    pricePerStem: 1600,
    iconSvg: '🪻'
  },
  {
    id: 'peonia_blush',
    name: 'Peonía Cuarzo',
    colorName: 'Rosa Rubor',
    colorHex: '#f70071',
    pricePerStem: 2400,
    iconSvg: '🌸'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Dra. Camila Rojas',
    rating: 5,
    date: 'Hace 2 días',
    comment: 'Una pieza de arte sublime. El empaque y la textura de las fibras superaron todas mis expectativas. Llegó impecable a Providencia y el servicio de asesoría por WhatsApp fue impecable.',
    verified: true,
    location: 'Providencia, Santiago',
    productName: 'ramo Coral duradera'
  },
  {
    id: 'rev-2',
    author: 'Ignacio Fuentes V.',
    rating: 5,
    date: 'Hace 1 semana',
    comment: 'Elegí la colección de girasoles para nuestro aniversario. La terminación artesanal y el equilibrio de colores reflejan una dedicación extraordinaria. Totalmente recomendable.',
    verified: true,
    location: 'Viña del Mar',
    productName: 'Colección Girasoles Silvestres'
  },
  {
    id: 'rev-3',
    author: 'Francisca Morales M.',
    rating: 5,
    date: 'Hace 2 semanas',
    comment: 'El kit de Taller DIY es un regalo maravilloso. Los materiales son de máxima densidad y la guía paso a paso es extremadamente clara y pulcra.',
    verified: true,
    location: 'Concepción',
    productName: 'Kit para Armar Creación Floral'
  }
];
