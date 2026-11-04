import { Bird } from '../types/bird';

export const OFFICIAL_ECOQUEST_BIRDS: Bird[] = [
  // --- AVES ACUÁTICAS Y DE HUMEDALES (11 Especies) ---
  {
    id: 'pato-de-collar',
    name: 'Pato de collar',
    scientificName: 'Callonetta leucophrys',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Pato pequeño y vistoso. Los machos tienen una franja negra en la cabeza y el cuello, pecho rosáceo con pecas negras y costados grisáceos, mientras que las hembras son más pardas con manchas blancas. Ambos tienen una mancha blanca muy notable en las alas al volar.',
    photoUrl: '/birds/pato-de-collar.jpg'
  },
  {
    id: 'pato-maicero',
    name: 'Pato maicero',
    scientificName: 'Anas georgica',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Es un pato de tamaño mediano, su cuerpo tiene plumas de tonos marrones y beige con manchas oscuras, tiene un cuello largo y fino de color marrón claro y su pico es de color amarillo, con una mancha negra en la punta y en los costados.',
    photoUrl: '/birds/pato-maicero.jpg'
  },
  {
    id: 'pato-barcino',
    name: 'Pato barcino',
    scientificName: 'Anas flavirostris',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'De tamaño mediano con cuerpo compacto y aspecto pardo finamente moteado. Tiene cabeza oscura, cuello corto, cola corta, patas grisáceas y pico amarillo. Presenta un característico espejo alar negro y verde.',
    photoUrl: '/birds/pato-barcino.jpg'
  },
  {
    id: 'pollona-negra',
    name: 'Pollona negra',
    scientificName: 'Gallinula galeata',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Presenta cabeza y pecho de color gris plomizo, dorso pardo oliváceo, alas y cola cortas y patas rojizas. Su característica principal es el pico largo verdoso, con zonas celestes y rojas acompañado junto con un iris rojo.',
    photoUrl: '/birds/pollona-negra.jpg'
  },
  {
    id: 'maca-comun',
    name: 'Macá común',
    scientificName: 'Rollandia rolland',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Es un ave acuática pequeña y excelente buceadora, y pasa gran parte de su tiempo en el agua. Puede sumergirse rápidamente para escapar de amenazas o para buscar alimento bajo la superficie. Durante la época reproductiva presenta un aspecto más llamativo, con un penacho blanco en la cabeza y ojos rojos.',
    photoUrl: '/birds/maca-comun.jpg'
  },
  {
    id: 'gallareta',
    name: 'Gallareta',
    scientificName: 'Fulica leucoptera',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Ave acuática pequeña, de color gris oscuro a negruzco. Tiene un escudo frontal sobre el pico de color amarillo o rojizo, y se destaca por tener una mancha blanca muy visible en el borde trasero de sus alas.',
    photoUrl: '/birds/gallareta.jpg'
  },
  {
    id: 'gallineta-pico-pintado',
    name: 'Gallineta pico pintado',
    scientificName: 'Pardirallus sanguinolentus',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Presenta cabeza y pecho de color gris plomizo, dorso pardo oliváceo, alas y cola cortas y patas rojizas. Su característica principal es el pico largo verdoso, con zonas celestes y rojas acompañado junto con un iris rojo.',
    photoUrl: '/birds/gallineta-pico-pintado.jpg'
  },
  {
    id: 'garza-blanca',
    name: 'Garza blanca',
    scientificName: 'Ardea alba',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Tamaño grande, plumaje completamente blanco, pico largo y de color amarillo brillante (en época reproductiva se torna más oscuro); patas y piernas de color oscuro o negro.',
    photoUrl: '/birds/garza-blanca.jpg'
  },
  {
    id: 'cuervillo-cara-pelada',
    name: 'Cuervillo cara pelada',
    scientificName: 'Phimosus infuscatus',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Ave de tamaño mediano y silueta esbelta, con plumaje compacto de color castaño oscuro a negruzco y leves reflejos opacos. Sus alas presentan tonalidades más uniformes. Se caracteriza por tener la cara desnuda de color rosado, patas largas y rojizas, y un pico largo, grueso y curvado hacia abajo.',
    photoUrl: '/birds/cuervillo-cara-pelada.jpg'
  },
  {
    id: 'tero-real',
    name: 'Tero real',
    scientificName: 'Himantopus mexicanus',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Ave estilizada que se destaca por el contraste de su plumaje bicolor: presenta el dorso, las alas y la corona de negro, mientras que la frente, el cuello y el vientre son de color blanco. Su rasgo más llamativo son sus patas largas de color rojo intenso y un pico recto, fino y largo de color negro.',
    photoUrl: '/birds/tero-real.jpg'
  },
  {
    id: 'bigua',
    name: 'Biguá',
    scientificName: 'Nannopterum brasilianum',
    category: 'acuaticas',
    categoryLabel: 'Aves acuáticas y de humedales',
    description: 'Ave acuática grande, de entre 70 y 75 cm, con plumaje negro brillante, cuello largo, pico con punta en forma de gancho y patas negras palmeadas. Tiene una zona amarillenta en la base del pico y la garganta. En época reproductiva presenta detalles blancos en la garganta y finos penachos en la cabeza y el cuello. Los juveniles son pardos, con el pecho y el vientre más claros.',
    photoUrl: '/birds/bigua.jpg'
  },

  // --- AVES DE ÁRBOLES Y ARBUSTOS (6 Especies) ---
  {
    id: 'paloma',
    name: 'Paloma',
    scientificName: 'Columba livia',
    category: 'arboles',
    categoryLabel: 'Aves de árboles y arbustos',
    description: 'Ave de plumaje muy variable (gris, ceniza, castaño o manchado), con cabeza oscura y reflejos iridiscentes verdosos y violáceos en el cuello. Pico fino con cera blanca en la base.',
    photoUrl: '/birds/paloma.jpg'
  },
  {
    id: 'cotorra',
    name: 'Cotorra',
    scientificName: 'Myiopsitta monachus',
    category: 'arboles',
    categoryLabel: 'Aves de árboles y arbustos',
    description: 'Ave de tamaño mediano, de color verde brillante en su espalda y alas, con la frente y el pecho de un tono gris claro con líneas. Tiene un pico correoso, curvado y de color carne o amarillento. Son muy sociales y famosas por hacer ruido de chillidos.',
    photoUrl: '/birds/cotorra.jpg'
  },
  {
    id: 'calandria-grande',
    name: 'Calandria grande',
    scientificName: 'Mimus saturninus',
    category: 'arboles',
    categoryLabel: 'Aves de árboles y arbustos',
    description: 'Ave mediana de plumaje pardo grisáceo en el dorso, vientre claro y cola larga con puntas blancas visibles en vuelo. Presenta una ceja blanca definida y una fina lista negra a través del ojo.',
    photoUrl: '/birds/calandria-grande.jpg'
  },
  {
    id: 'benteveo',
    name: 'Benteveo',
    scientificName: 'Pitangus sulphuratus',
    category: 'arboles',
    categoryLabel: 'Aves de árboles y arbustos',
    description: 'Ave pequeña y robusta, con pecho y vientre amarillo intenso y dorso pardo oliváceo. Su cabeza presenta una corona negra, una ceja blanca y garganta blanquecina. Tiene un pico largo, fuerte y negro, ligeramente curvado en la punta. Además, oculta plumas amarillas brillantes que despliega cuando está alarmada o en cortejo.',
    photoUrl: '/birds/benteveo.jpg'
  },
  {
    id: 'chingolo-comun',
    name: 'Chingolo común',
    scientificName: 'Zonotrichia capensis',
    category: 'arboles',
    categoryLabel: 'Aves de árboles y arbustos',
    description: 'Pájaro pequeño. Tiene la cabeza gris y un copete con rayas negras. Su pecho es de color claro, con algunos reflejos oscuros. Sus dedos le permiten sujetarse a las ramas de los árboles. Se alimenta principalmente de semillas y frutas, que busca en el suelo y entre los arbustos.',
    photoUrl: '/birds/chingolo-comun.jpg'
  },
  {
    id: 'hornero',
    name: 'Hornero',
    scientificName: 'Furnarius rufus',
    category: 'arboles',
    categoryLabel: 'Aves de árboles y arbustos',
    description: 'Ave mediana, de plumaje predominantemente pardo rojizo, alas algo más oscuras y garganta clara. Tiene cuerpo robusto, cola corta y pico recto y fuerte.',
    photoUrl: '/birds/hornero.jpg'
  },

  // --- AVES DE ESPACIOS ABIERTOS Y PASTIZALES (5 Especies) ---
  {
    id: 'carpintero-campestre',
    name: 'Carpintero campestre',
    scientificName: 'Colaptes campestris',
    category: 'pastizales',
    categoryLabel: 'Aves de espacios abiertos y pastizales',
    description: 'Pájaro de tamaño mediano. Tiene la cara y el pecho de color amarillo intenso, con la parte superior de la cabeza y la nuca de color negro. Su espalda y alas tienen líneas o barras negras y pardas. Los machos se diferencian por tener una línea roja a los costados de la garganta.',
    photoUrl: '/birds/carpintero-campestre.jpg'
  },
  {
    id: 'picabuey',
    name: 'Picabuey',
    scientificName: 'Machetornis rixosa',
    category: 'pastizales',
    categoryLabel: 'Aves de espacios abiertos y pastizales',
    description: 'Ave pequeña y silueta esbelta. Presenta un plumaje de color pardo suave en el dorso, una cabeza grisácea con garganta blanquecina y un pecho y vientre de color amarillo. Cuenta con un pico corto y patas negras, y posee una corona oculta de plumas de un rojo o naranja encendido, la cual despliega cuando se encuentra alterado.',
    photoUrl: '/birds/picabuey.jpg'
  },
  {
    id: 'tordo-renegrido',
    name: 'Tordo renegrido',
    scientificName: 'Molothrus bonariensis',
    category: 'pastizales',
    categoryLabel: 'Aves de espacios abiertos y pastizales',
    description: 'Es un ave de tamaño mediano. El macho adulto tiene un plumaje negro brillante con reflejos azulados o violáceos que brillan a la luz del sol. En cambio, la hembra es de un color marrón más apagado u oscuro. Tiene un pico cónico, fuerte y puntiagudo.',
    photoUrl: '/birds/tordo-renegrido.jpg'
  },
  {
    id: 'chimango',
    name: 'Chimango',
    scientificName: 'Daptrius chimango',
    category: 'pastizales',
    categoryLabel: 'Aves de espacios abiertos y pastizales',
    description: 'Rapaz de tamaño mediano (unos 37-40 cm) y plumaje predominantemente pardo castaño. Presenta alas largas con una franja o "ventana" clara notable en vuelo, cola larga barrada y pico claro con cera amarillenta.',
    photoUrl: '/birds/chimango.jpg'
  },
  {
    id: 'tero-comun',
    name: 'Tero común (o Teru-Teru)',
    scientificName: 'Vanellus chilensis',
    category: 'pastizales',
    categoryLabel: 'Aves de espacios abiertos y pastizales',
    description: 'Ave mediana de patas largas y aspecto elegante. Su plumaje combina tonos grises y pardos con el vientre blanco. Tiene cresta larga y fina en la parte de atrás de la cabeza, un pico rojizo con punta negra, tienen una espina afilada en la articulación de cada ala que usan para defenderse.',
    photoUrl: '/birds/tero-comun.jpg'
  }
];
