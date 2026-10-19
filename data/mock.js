export const categories = [
  { id: '1', name: 'Cerámica', image: require('../assets/images/Ceramica -1.png') },
  { id: '2', name: 'Bisutería', image: require('../assets/images/Bisuteria -1.png') },
  { id: '3', name: 'Mochilas', image: require('../assets/images/mochila artesanal 1.png') },
  { id: '4', name: 'Máscaras', image: require('../assets/images/Mascara -1.png') },
];

export const products = [
  { id: '1', name: 'Mochila Wayuu', price: 100000, image: require('../assets/images/mochila artesanal 1.png'), images: [require('../assets/images/mochila artesanal 1.png'), require('../assets/images/mochila artesanal 2.png'), require('../assets/images/mochila artesanal 3.png')], category: 'Mochilas', rating: 4, description: 'Mochila tejida a mano por artesanos wayuu.' },
  { id: '2', name: 'Collar Bisutería', price: 10000, image: require('../assets/images/Bisuteria -1.png'), images: [require('../assets/images/Bisuteria -1.png'), require('../assets/images/Bisuteria -2ng.png'), require('../assets/images/Bisuteria -3.png')], category: 'Bisutería', rating: 4, description: 'Collar de mostacilla hecho a mano.' },
  { id: '3', name: 'Jarrón Cerámica', price: 100000, image: require('../assets/images/Jarron.png'), images: [require('../assets/images/Jarron.png'), require('../assets/images/Ceramica -1.png'), require('../assets/images/Ceramica -2.png')], category: 'Cerámica', rating: 5, description: 'Jarrón de cerámica pintado a mano.' },
  { id: '4', name: 'Aretes Filigrana', price: 100000, image: require('../assets/images/Bisuteria -2ng.png'), images: [require('../assets/images/Bisuteria -2ng.png'), require('../assets/images/Bisuteria -1.png'), require('../assets/images/Bisuteria -3.png')], category: 'Bisutería', rating: 3, description: 'Aretes en filigrana de plata.' },
  { id: '5', name: 'Olla de Barro', price: 95000, image: require('../assets/images/Olla.png'), images: [require('../assets/images/Olla.png'), require('../assets/images/Ceramica -3.png'), require('../assets/images/vacijass.png')], category: 'Cerámica', rating: 4, description: 'Vasija artesanal de barro.' },
  { id: '6', name: 'Máscara Ceremonial', price: 80000, image: require('../assets/images/Mascara -1.png'), images: [require('../assets/images/Mascara -1.png'), require('../assets/images/Mascara -2.png'), require('../assets/images/Mascara -3.png')], category: 'Máscaras', rating: 4, description: 'Máscara ceremonial tallada en madera.' },
];

// Imágenes disponibles para que el administrador asigne a productos/categorías
export const imageLibrary = [
  { id: 'i1', name: 'Mochila', image: require('../assets/images/mochila artesanal 1.png') },
  { id: 'i2', name: 'Mochila 2', image: require('../assets/images/mochila artesanal 2.png') },
  { id: 'i3', name: 'Mochila 3', image: require('../assets/images/mochila artesanal 3.png') },
  { id: 'i4', name: 'Collar', image: require('../assets/images/Bisuteria -1.png') },
  { id: 'i5', name: 'Aretes', image: require('../assets/images/Bisuteria -2ng.png') },
  { id: 'i6', name: 'Pulsera', image: require('../assets/images/Bisuteria -3.png') },
  { id: 'i7', name: 'Jarrón', image: require('../assets/images/Jarron.png') },
  { id: 'i8', name: 'Cerámica', image: require('../assets/images/Ceramica -1.png') },
  { id: 'i9', name: 'Cerámica 2', image: require('../assets/images/Ceramica -2.png') },
  { id: 'i10', name: 'Olla', image: require('../assets/images/Olla.png') },
  { id: 'i11', name: 'Máscara', image: require('../assets/images/Mascara -1.png') },
  { id: 'i12', name: 'Máscara 2', image: require('../assets/images/Mascara -2.png') },
  { id: 'i13', name: 'Vasijas', image: require('../assets/images/vacijass.png') },
  { id: 'i14', name: 'Platos', image: require('../assets/images/platos.png') },
];

export const formatCOP = (value) =>
  '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' COP';
