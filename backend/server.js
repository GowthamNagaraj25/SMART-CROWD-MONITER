const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8080; // Force port 8080 to prevent global env var conflicts

app.use(cors({ origin: "*" }));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

/* ══════════════════════════════════════════
   IN-MEMORY DATABASE (no MongoDB needed)
══════════════════════════════════════════ */
const PLACES = [
  {
    id: 1, name: 'Marina Beach', emoji: '🏖️', category: 'beach', crowd: 'low', crowdPct: 22,
    rating: 4.6, wait: '5 min', best: '6am–9am', region: 'Chennai', type: 'Public Beach',
    desc: 'Marina Beach stretches 13 km along the Bay of Bengal making it the longest natural urban beach in Asia. The beach comes alive at dawn with walkers, vendors, and fishermen.',
    hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    forecast: [10,8,15,30,55,70,80,75,60,40,25,18],
    alts: [5,8,12],
    mapLink: 'https://maps.google.com/?q=Marina+Beach+Chennai',
    mapText: 'Marina Beach, Kamarajar Salai, Chennai, Tamil Nadu 600006',
    hotels: [
      { name: 'Vivanta Chennai', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', rating: 4.5, dist: '2.1 km', price: '₹8,500/night', tags: ['Pool','Spa','Sea View'] },
      { name: 'Hyatt Regency Chennai', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80', rating: 4.7, dist: '3.4 km', price: '₹12,000/night', tags: ['Luxury','Rooftop','Business'] },
      { name: 'Hotel Ranjith', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80', rating: 4.1, dist: '0.8 km', price: '₹2,800/night', tags: ['Budget','Clean','Central'] }
    ],
    restaurants: [
      { name: 'Murugan Idli Shop', emoji: '🥘', rating: 4.7, dist: '1.2 km', cuisine: 'South Indian Vegetarian', tags: ['Breakfast','Idli','Dosa'] },
      { name: 'Ponnusamy Hotel', emoji: '🍖', rating: 4.5, dist: '2.0 km', cuisine: 'Chettinad Non-Veg', tags: ['Lunch','Chettinad','Biryani'] },
      { name: 'Mahabs Seafood Corner', emoji: '🦐', rating: 4.3, dist: '0.4 km', cuisine: 'Seafood', tags: ['Beach Side','Fresh Fish','Prawns'] }
    ],
    shops: [
      { name: 'Marina Beach Handicrafts Market', emoji: '🪆', desc: 'Shell crafts, local artifacts, kites', rating: 4.2, dist: 'On beach' },
      { name: 'Pondy Bazaar', emoji: '🛍️', desc: 'Clothing, textiles, electronics', rating: 4.4, dist: '2.5 km' },
      { name: 'Higginbothams Book Store', emoji: '📚', desc: "India's oldest bookshop since 1844", rating: 4.6, dist: '3.1 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Government-maintained restrooms at every 500 m along beach' },
      { icon: '🅿️', name: 'Parking', desc: 'Free parking at MGR Statue area & Napier Bridge end' },
      { icon: '🚌', name: 'Bus Stop', desc: 'Buses: 27B, 29C, M70 halt at Marina' },
      { icon: '🚑', name: 'First Aid', desc: 'Lifeguard posts every 1 km with basic first aid' },
      { icon: '🌊', name: 'Lighthouse', desc: 'Madras Lighthouse (1844) — open Fri–Wed 3–5pm' },
      { icon: '🎠', name: 'Amusement Zone', desc: "Children's play area near Santhome end" },
      { icon: '🏋️', name: 'Open Gym', desc: 'Outdoor fitness equipment installed by GCC' },
      { icon: '📸', name: 'Photography', desc: 'Sunrise & sunset light is exceptional; tripods allowed' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Marina_Beach_morning_panorama.jpg/640px-Marina_Beach_morning_panorama.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Marina_Beach_Aerial.jpg/640px-Marina_Beach_Aerial.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Marina_Beach_Chennai_India.jpg/640px-Marina_Beach_Chennai_India.jpg'
    ]
  },
  {
    id: 2, name: 'Kapaleeshwarar Temple', emoji: '🛕', category: 'heritage', crowd: 'high', crowdPct: 88,
    rating: 4.8, wait: '45 min', best: '7am–9am', region: 'Mylapore, Chennai', type: 'Hindu Temple',
    desc: 'The Kapaleeshwarar Temple is a Dravidian-style Hindu temple built in the 7th century CE. Its towering 37-metre gopuram is adorned with 1,000 intricately painted stucco sculptures.',
    hero: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    forecast: [90,85,80,78,82,88,92,88,80,70,60,40],
    alts: [3,7,9],
    mapLink: 'https://maps.google.com/?q=Kapaleeshwarar+Temple+Chennai',
    mapText: 'Kapaleeshwarar Temple, Mylapore, Chennai, Tamil Nadu 600004',
    hotels: [
      { name: 'GRT Grand Chennai', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', rating: 4.6, dist: '1.2 km', price: '₹6,500/night', tags: ['Heritage Area','Restaurant','Pool'] },
      { name: 'Raj Park Hotel', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80', rating: 4.4, dist: '2.0 km', price: '₹5,200/night', tags: ['Business','Central','Rooftop'] },
      { name: 'New Woodlands Hotel', img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&q=80', rating: 4.3, dist: '0.9 km', price: '₹3,500/night', tags: ['Vegetarian','Heritage','Cultural'] }
    ],
    restaurants: [
      { name: "Rayar's Mess", emoji: '🍛', rating: 4.8, dist: '0.2 km', cuisine: 'Traditional Tamil Meals', tags: ['Authentic','Vegetarian','Breakfast'] },
      { name: 'Junior Kuppanna', emoji: '🥘', rating: 4.6, dist: '1.5 km', cuisine: 'Tamil Chettinad', tags: ['Meals','Non-Veg','Popular'] },
      { name: 'Residency Towers Restaurant', emoji: '🍱', rating: 4.5, dist: '1.0 km', cuisine: 'Multi-cuisine', tags: ['Buffet','AC','Rooftop'] }
    ],
    shops: [
      { name: 'Mylapore Flower Market', emoji: '🌸', desc: 'Jasmine garlands & temple flowers — opens at 5am', rating: 4.7, dist: '50 m from temple' },
      { name: 'Pattammal Silk Sarees', emoji: '🥻', desc: 'Premium Kanchipuram silk sarees since 1952', rating: 4.5, dist: '0.3 km' },
      { name: 'Sundaram Books', emoji: '📖', desc: 'Tamil literature, devotional books, CDs', rating: 4.3, dist: '0.5 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Clean pay-restrooms inside temple complex (₹5)' },
      { icon: '🅿️', name: 'Parking', desc: 'Paid parking on Kutchery Rd, ₹30/2 hrs' },
      { icon: '👟', name: 'Shoe Locker', desc: 'Shoe-deposit counters at all 4 entrances — ₹5' },
      { icon: '📸', name: 'Photography', desc: 'Photography banned inside main sanctum; allowed in courtyard' },
      { icon: '🛕', name: 'Dress Code', desc: 'Traditional attire preferred; sarong rental available' },
      { icon: '🌙', name: 'Pooja Times', desc: 'Abhishekam 5:30am; Uchikalam 12pm; Evening 6pm' },
      { icon: '♿', name: 'Accessibility', desc: 'Wheelchair ramp available at east entrance' },
      { icon: '🏧', name: 'ATM', desc: 'SBI and Canara ATM within 100 m of temple' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kapaleeshwarar_Temple_Chennai.jpg/640px-Kapaleeshwarar_Temple_Chennai.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kapaleeshwarar_temple_Chennai_gopuram.jpg/640px-Kapaleeshwarar_temple_Chennai_gopuram.jpg'
    ]
  },
  {
    id: 3, name: 'Mahabalipuram', emoji: '🏛️', category: 'heritage', crowd: 'moderate', crowdPct: 55,
    rating: 4.7, wait: '20 min', best: '8am–11am', region: 'Kanchipuram District', type: 'UNESCO World Heritage',
    desc: 'Mahabalipuram (Mamallapuram) is a 7th-century port city of the Pallava dynasty. Its cave temples, monolithic rathas, and the majestic Shore Temple are inscribed as a UNESCO World Heritage Site since 1984.',
    hero: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    forecast: [20,18,35,50,65,70,60,55,48,42,30,20],
    alts: [9,6,4],
    mapLink: 'https://maps.google.com/?q=Shore+Temple+Mahabalipuram',
    mapText: 'Shore Temple, Mahabalipuram, Tamil Nadu 603104',
    hotels: [
      { name: 'Radisson Blu Resort Temple Bay', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', rating: 4.7, dist: '0.5 km', price: '₹9,500/night', tags: ['Beach Resort','Pool','Heritage View'] },
      { name: 'Mamalla Heritage Hotel', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80', rating: 4.4, dist: '0.3 km', price: '₹4,200/night', tags: ['Heritage','Near Shore Temple','Restaurant'] },
      { name: 'Le Pondy Beach Hotel', img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80', rating: 4.2, dist: '1.5 km', price: '₹3,100/night', tags: ['Budget','Beach Access','Comfortable'] }
    ],
    restaurants: [
      { name: 'Moonrakers Restaurant', emoji: '🌊', rating: 4.6, dist: '0.1 km', cuisine: 'Seafood', tags: ['Sea View','Fresh Catch','Beachfront'] },
      { name: 'Santana Beach Restaurant', emoji: '🦞', rating: 4.4, dist: '0.2 km', cuisine: 'Multi-cuisine Seafood', tags: ['Outdoor','Beer','Fish Fry'] },
      { name: 'Village Restaurant', emoji: '🍛', rating: 4.3, dist: '0.8 km', cuisine: 'Traditional Tamil', tags: ['Thali','Vegetarian','Local Favourite'] }
    ],
    shops: [
      { name: 'Stone Carving Street', emoji: '🗿', desc: 'Live stone sculptors; buy direct from artisans', rating: 4.8, dist: '0.3 km' },
      { name: 'Five Rathas Souvenir Market', emoji: '🛒', desc: 'Miniature temple replicas, silk scarves, coconut crafts', rating: 4.3, dist: 'Near Five Rathas' },
      { name: "Arjuna's Penance Gift Shop", emoji: '🎁', desc: 'Quality replicas, books on Pallava art', rating: 4.5, dist: '0.2 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'ASI-maintained restrooms near ticket counters' },
      { icon: '🅿️', name: 'Parking', desc: 'Large free parking lot outside Shore Temple complex' },
      { icon: '🎟️', name: 'Entry Fee', desc: 'Indians ₹40; Foreigners ₹600; Camera ₹25' },
      { icon: '🎧', name: 'Audio Guide', desc: 'Official audio guide ₹100 available at counter' },
      { icon: '🌊', name: 'Beach Access', desc: 'Direct beach adjacent to Shore Temple' },
      { icon: '🦁', name: 'Pancha Rathas', desc: '5 monolithic rock-cut chariots — 1 km away' },
      { icon: '🐘', name: "Arjuna's Penance", desc: "World's largest bas-relief carving — open air" },
      { icon: '🍦', name: 'Refreshments', desc: 'Government-run café near Shore Temple entrance' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Shore_Temple_Mahabalipuram.jpg/640px-Shore_Temple_Mahabalipuram.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Pancha_Rathas_Mahabalipuram.jpg/640px-Pancha_Rathas_Mahabalipuram.jpg'
    ]
  },
  {
    id: 4, name: 'Ooty Botanical Garden', emoji: '🌿', category: 'nature', crowd: 'moderate', crowdPct: 62,
    rating: 4.5, wait: '15 min', best: '9am–12pm', region: 'Nilgiris', type: 'Botanical Garden',
    desc: 'The Government Botanical Garden in Ooty was established in 1848. Spread over 22 hectares at 2,200 m altitude, it houses over 650 plant species including a 20 million-year-old fossil tree.',
    hero: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    forecast: [10,8,20,45,65,70,68,60,50,35,20,12],
    alts: [6,3,10],
    mapLink: 'https://maps.google.com/?q=Government+Botanical+Garden+Ooty',
    mapText: 'Government Botanical Garden, Ooty, Tamil Nadu 643001',
    hotels: [
      { name: 'Savoy Hotel Ooty', img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80', rating: 4.6, dist: '1.0 km', price: '₹7,800/night', tags: ['Heritage','Colonial','Garden View'] },
      { name: 'Fortune Resort Sullivan Court', img: 'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=400&q=80', rating: 4.4, dist: '1.8 km', price: '₹6,500/night', tags: ['Resort','Hill View','Restaurant'] },
      { name: 'Sinclairs Retreat Ooty', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', rating: 4.3, dist: '2.2 km', price: '₹4,500/night', tags: ['Valley View','Cosy','Tea Garden'] }
    ],
    restaurants: [
      { name: 'Sidewalk Café Ooty', emoji: '☕', rating: 4.5, dist: '0.5 km', cuisine: 'Café', tags: ['Tea','Snacks','Quiet'] },
      { name: "Shinkow's Chinese Restaurant", emoji: '🥡', rating: 4.3, dist: '1.2 km', cuisine: 'Chinese', tags: ['Noodles','Oldest in Ooty','Cosy'] },
      { name: 'Hyderabad House Ooty', emoji: '🍗', rating: 4.4, dist: '0.8 km', cuisine: 'Multi-cuisine', tags: ['Biryani','Veg & Non-Veg','Family'] }
    ],
    shops: [
      { name: 'Ooty Tea Factory Shop', emoji: '🍵', desc: 'Nilgiri tea, oils, chocolates — direct factory prices', rating: 4.7, dist: '1.5 km' },
      { name: 'Tribal Art & Craft Store', emoji: '🧵', desc: 'Toda embroidery, bamboo crafts, honey', rating: 4.5, dist: '0.4 km' },
      { name: 'Ooty Varkey Bakery', emoji: '🍞', desc: 'Famous Ooty chocolates and homemade breads since 1943', rating: 4.6, dist: '1.0 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Paid restrooms inside garden ₹5; free near entrance' },
      { icon: '🅿️', name: 'Parking', desc: 'Paid parking outside main gate ₹30/vehicle' },
      { icon: '🎟️', name: 'Entry Fee', desc: 'Adults ₹30; Children ₹15; Camera ₹50' },
      { icon: '🌸', name: 'Flower Show', desc: 'Annual flower show held every May in the garden' },
      { icon: '🌳', name: 'Fossil Tree', desc: '20 million-year-old petrified tree trunk on display' },
      { icon: '🚂', name: 'Toy Train', desc: 'Nilgiri Mountain Railway station 1.5 km away' },
      { icon: '🧊', name: 'Italian Garden', desc: '18th century Italian-style terraced garden section' },
      { icon: '🦋', name: 'Butterfly Park', desc: 'Mini butterfly conservatory adjacent to main garden' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Botanical_Garden_Ooty.jpg/640px-Botanical_Garden_Ooty.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Nilgiri_Mountain_Railway.jpg/640px-Nilgiri_Mountain_Railway.jpg'
    ]
  },
  {
    id: 5, name: "Elliot's Beach", emoji: '🌊', category: 'beach', crowd: 'low', crowdPct: 18,
    rating: 4.4, wait: '0 min', best: '7am–10am', region: 'Besant Nagar, Chennai', type: 'Urban Beach',
    desc: "Elliot's Beach (locally called Bessy Beach) is a clean, calm beach in Besant Nagar, Chennai. Popular with morning joggers and families, it features the Karl Schmidt Memorial and the Ashtalakshmi Temple.",
    hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    forecast: [5,4,6,12,20,28,32,28,22,15,10,6],
    alts: [1,8,2],
    mapLink: "https://maps.google.com/?q=Elliot's+Beach+Chennai",
    mapText: "Elliot's Beach, Besant Nagar, Chennai, Tamil Nadu 600090",
    hotels: [
      { name: 'Raintree Hotel', img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&q=80', rating: 4.5, dist: '2.5 km', price: '₹6,200/night', tags: ['Eco-friendly','Pool','Restaurant'] },
      { name: 'Accord Metropolitan', img: 'https://images.unsplash.com/photo-1607890097861-90a21da7d4e1?w=400&q=80', rating: 4.3, dist: '3.0 km', price: '₹5,000/night', tags: ['Business','Central','Comfortable'] },
      { name: 'Nestle Guest House', img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80', rating: 4.0, dist: '1.2 km', price: '₹2,200/night', tags: ['Budget','Clean','Beach Proximity'] }
    ],
    restaurants: [
      { name: 'Broken Tusk', emoji: '🍕', rating: 4.6, dist: '0.3 km', cuisine: 'Continental & Pub', tags: ['Beer','Burger','Night Life'] },
      { name: "Zara's Tapas Bar", emoji: '🥂', rating: 4.5, dist: '0.5 km', cuisine: 'Mediterranean', tags: ['Tapas','Wine','Romantic'] },
      { name: 'Madurai Idli Shop', emoji: '🥣', rating: 4.4, dist: '0.8 km', cuisine: 'South Indian Breakfast', tags: ['Idli','Early Morning','Affordable'] }
    ],
    shops: [
      { name: 'Besant Nagar Market', emoji: '🥦', desc: 'Fresh produce, flowers, local grocery', rating: 4.2, dist: '0.7 km' },
      { name: 'Ampa SkyMall', emoji: '🛍️', desc: 'Branded clothing, electronics, food court', rating: 4.1, dist: '3.5 km' },
      { name: 'Art Shoppe Beach Store', emoji: '🎨', desc: 'Local art prints, handmade jewellery, crafts', rating: 4.4, dist: '100 m from beach' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'GCC public restrooms at north and south ends of beach' },
      { icon: '🅿️', name: 'Parking', desc: 'Free street parking along Besant Nagar 5th Cross' },
      { icon: '⛪', name: 'Church', desc: "Russian Orthodox Church (St. Andrew's Kirk) on beachfront" },
      { icon: '🛕', name: 'Temple', desc: 'Ashtalakshmi Temple — stunning architecture on beachfront' },
      { icon: '🏃', name: 'Jogging Track', desc: '4 km jogging path along the entire beach length' },
      { icon: '🐾', name: 'Pet Friendly', desc: 'Dogs allowed on beach; water bowls provided' },
      { icon: '🌅', name: 'Sunrise', desc: 'Best sunrise views from the northern tip of the beach' },
      { icon: '🎭', name: 'Karl Schmidt', desc: 'Historic German merchant memorial — interesting history' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Elliots_Beach_Chennai.jpg/640px-Elliots_Beach_Chennai.jpg'
    ]
  },
  {
    id: 6, name: 'Kodaikanal Lake', emoji: '🏔️', category: 'nature', crowd: 'moderate', crowdPct: 48,
    rating: 4.6, wait: '10 min', best: '8am–11am', region: 'Palani Hills, Dindigul', type: 'Hill Station',
    desc: "Kodaikanal Lake is a star-shaped artificial lake created in 1863 at an elevation of 2,133 m. The 24-hectare lake set amidst dense shola forests is perfect for boating and mist-wrapped walks.",
    hero: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    forecast: [8,6,15,38,55,62,58,50,42,32,20,10],
    alts: [4,10,3],
    mapLink: 'https://maps.google.com/?q=Kodaikanal+Lake',
    mapText: 'Kodaikanal Lake, Kodaikanal, Tamil Nadu 624101',
    hotels: [
      { name: 'Sterling Kodai Lake', img: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400&q=80', rating: 4.5, dist: '0.4 km', price: '₹8,500/night', tags: ['Lake View','Resort','Cottages'] },
      { name: 'Hotel Kodai International', img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80', rating: 4.3, dist: '0.2 km', price: '₹4,000/night', tags: ['Lake Side','Restaurant','Cosy'] },
      { name: 'Valley of Flowers Hotel', img: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&q=80', rating: 4.2, dist: '1.0 km', price: '₹3,200/night', tags: ['Garden','Hill View','Family'] }
    ],
    restaurants: [
      { name: 'Pastry Corner Kodai', emoji: '🥐', rating: 4.6, dist: '0.3 km', cuisine: 'Bakery & Café', tags: ['Homemade Bread','Coffee','View'] },
      { name: 'Royal Tibet Restaurant', emoji: '🍜', rating: 4.5, dist: '0.5 km', cuisine: 'Tibetan Chinese', tags: ['Momos','Noodles','Warm'] },
      { name: 'Tava Restaurant', emoji: '🍱', rating: 4.3, dist: '0.8 km', cuisine: 'Indian Multi-cuisine', tags: ['Thali','Veg','Affordable'] }
    ],
    shops: [
      { name: 'Kodai Chocolate Factory Shop', emoji: '🍫', desc: 'Fresh homemade chocolates — eucalyptus, cardamom flavours', rating: 4.8, dist: '0.6 km' },
      { name: 'Sikkim Hill Craft Centre', emoji: '🧶', desc: 'Handwoven shawls, Toda embroidery, essential oils', rating: 4.4, dist: '0.3 km' },
      { name: 'Kodai Farmers Market', emoji: '🍓', desc: 'Local fruits, home-pickles, honey, coffee', rating: 4.5, dist: '0.5 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Municipal restrooms near boathouse ₹5' },
      { icon: '🅿️', name: 'Parking', desc: 'Paid parking near boathouse ₹50/day' },
      { icon: '🚣', name: 'Boating', desc: 'Row boats ₹80/30min; Pedal boats ₹100/30min' },
      { icon: '🚲', name: 'Cycling', desc: 'Cycle rental ₹50/hr along 3.5 km lake circuit road' },
      { icon: '🌺', name: 'Bryant Park', desc: 'Botanical garden adjacent to lake — ₹30 entry' },
      { icon: '🌫️', name: "Coaker's Walk", desc: '1.4 km cliff-edge walk with stunning valley views' },
      { icon: '📷', name: 'Pine Forest', desc: 'Dense pine forest 2 km — popular photography spot' },
      { icon: '🦅', name: 'Pillar Rocks', desc: '3 vertical granite pillars — 7 km from lake' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Kodaikanal_Lake.jpg/640px-Kodaikanal_Lake.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Coakers_Walk_Kodaikanal.jpg/640px-Coakers_Walk_Kodaikanal.jpg'
    ]
  },
  {
    id: 7, name: 'Meenakshi Temple', emoji: '🏯', category: 'heritage', crowd: 'high', crowdPct: 91,
    rating: 4.9, wait: '60 min', best: '5am–7am', region: 'Madurai', type: 'Dravidian Temple',
    desc: "Meenakshi Amman Temple has 14 magnificent gopurams covered with 33,000 colourful sculptures and a 1,000-pillar hall. One of India's most important pilgrimage sites.",
    hero: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    forecast: [95,90,88,85,90,94,96,92,88,80,70,55],
    alts: [9,3,12],
    mapLink: 'https://maps.google.com/?q=Meenakshi+Amman+Temple+Madurai',
    mapText: 'Meenakshi Amman Temple, Madurai, Tamil Nadu 625001',
    hotels: [
      { name: 'Heritage Madurai', img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&q=80', rating: 4.7, dist: '2.0 km', price: '₹10,000/night', tags: ['Heritage','Pool','Temple View'] },
      { name: 'Courtyard by Marriott Madurai', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', rating: 4.6, dist: '1.5 km', price: '₹7,500/night', tags: ['Business','Modern','Rooftop Bar'] },
      { name: 'Hotel Park Plaza Madurai', img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80', rating: 4.3, dist: '0.8 km', price: '₹4,200/night', tags: ['Central','Restaurant','Family'] }
    ],
    restaurants: [
      { name: 'Surya Restaurant', emoji: '🌞', rating: 4.6, dist: '0.5 km', cuisine: 'Traditional Tamil', tags: ['Rooftop','Temple View','Meals'] },
      { name: 'Amma Mess', emoji: '🍛', rating: 4.8, dist: '0.3 km', cuisine: 'Authentic Madurai Meals', tags: ['Banana Leaf','Lunch Only','Famous'] },
      { name: 'Murugan Idli Shop', emoji: '🥘', rating: 4.7, dist: '0.7 km', cuisine: 'South Indian Breakfast', tags: ['Idli','Chutney','Morning'] }
    ],
    shops: [
      { name: 'Madurai Main Bazaar', emoji: '🛍️', desc: 'Textiles, silk sarees, jasmine, incense', rating: 4.5, dist: 'Adjacent to temple' },
      { name: 'Puthu Mandapam Market', emoji: '🎪', desc: 'Handicrafts, brass idols, local street food', rating: 4.4, dist: '50 m from East Tower' },
      { name: 'Khadi Gramodyog Bhavan', emoji: '🧵', desc: 'Khadi fabric, natural dyes, handloom products', rating: 4.6, dist: '1.0 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Free restrooms at all four entrance towers (gopurams)' },
      { icon: '🅿️', name: 'Parking', desc: 'Multi-level paid parking ₹40 near North Tower' },
      { icon: '👟', name: 'Footwear', desc: 'Free shoe deposit at all gopuram entrances' },
      { icon: '🎟️', name: 'Entry Fee', desc: 'Free entry; Camera ₹50; Special Darshan ₹50' },
      { icon: '🕌', name: '1000 Pillars', desc: 'Hall of 1000 Pillars — each pillar sings a different note' },
      { icon: '🏛️', name: 'Museum', desc: 'Temple Art Museum inside complex — free entry' },
      { icon: '🌙', name: 'Pooja Timings', desc: 'Kaalai 5am; Uchikalam 12pm; Iravagam 9pm' },
      { icon: '🎪', name: 'Chithirai Festival', desc: 'Annual festival in April draws 1 million+ visitors' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Meenakshi_Amman_Temple.jpg/640px-Meenakshi_Amman_Temple.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Meenakshi_temple_Madurai.jpg/640px-Meenakshi_temple_Madurai.jpg'
    ]
  },
  {
    id: 8, name: 'Covelong Beach', emoji: '🤿', category: 'beach', crowd: 'low', crowdPct: 15,
    rating: 4.3, wait: '0 min', best: '6am–10am', region: 'Kovalam, Kanchipuram', type: 'Surf Beach',
    desc: "Covelong (Kovalam) is a pristine fishing village beach 40 km south of Chennai. Tamil Nadu's premier surf destination, hosting the annual Covelong Point Surf & Music Festival.",
    hero: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
    forecast: [5,4,8,14,18,22,25,22,18,12,8,4],
    alts: [5,1,11],
    mapLink: 'https://maps.google.com/?q=Covelong+Beach+Kovalam',
    mapText: 'Covelong Beach, Kovalam, Kanchipuram District, Tamil Nadu 603112',
    hotels: [
      { name: 'Sheraton Grand Chennai Resort', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80', rating: 4.8, dist: '1.5 km', price: '₹14,000/night', tags: ['Luxury Beach Resort','Pool','Spa'] },
      { name: 'Kanan Beach Resort', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', rating: 4.5, dist: '0.3 km', price: '₹5,500/night', tags: ['Beach Front','Cottages','Surf School'] },
      { name: "Fisherman's Cove Resort", img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80', rating: 4.6, dist: '0.5 km', price: '₹9,000/night', tags: ['Heritage','Sea View','Pool'] }
    ],
    restaurants: [
      { name: 'Covelong Point Café', emoji: '🏄', rating: 4.5, dist: 'On beach', cuisine: 'Surf Café', tags: ['Smoothies','Burgers','Post-Surf'] },
      { name: "Fisherman's Hut", emoji: '🦐', rating: 4.4, dist: '0.2 km', cuisine: 'Fresh Seafood', tags: ['Catch of the Day','Grilled','Outdoor'] },
      { name: 'Sea Rock Restaurant', emoji: '🍺', rating: 4.2, dist: '0.4 km', cuisine: 'Multi-cuisine Beach Bar', tags: ['Beer','Sunset View','Music'] }
    ],
    shops: [
      { name: 'Covelong Surf Shop', emoji: '🏄', desc: 'Surf gear, boards for rent, lessons ₹800/session', rating: 4.7, dist: 'On beach' },
      { name: 'Village Craft Market', emoji: '🐚', desc: 'Shell jewellery, local beach crafts, fresh coconuts', rating: 4.2, dist: '0.5 km' },
      { name: 'Kovalam Fish Market', emoji: '🐟', desc: 'Morning fresh catch — best between 6–8am', rating: 4.5, dist: '0.3 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Resort-maintained restrooms; public toilets near bus stop' },
      { icon: '🅿️', name: 'Parking', desc: 'Free parking near village junction; ₹30 at resort lots' },
      { icon: '🏄', name: 'Surfing', desc: 'Best surf Nov–Mar; lessons available for beginners' },
      { icon: '🤿', name: 'Snorkeling', desc: 'Clear water visibility up to 5 m near rocky outcrops' },
      { icon: '⚓', name: 'Boat Rides', desc: 'Fishing boat rides with local fishermen — ₹300/person' },
      { icon: '🌅', name: 'Sunset', desc: 'West-facing coast gives spectacular evening colours' },
      { icon: '🐢', name: 'Turtle Nesting', desc: 'Olive Ridley turtles nest Nov–Jan; guided night walks' },
      { icon: '🔦', name: 'Lighthouse', desc: 'Covelong Lighthouse gives panoramic coastal view' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Covelong_Beach_Tamil_Nadu.jpg/640px-Covelong_Beach_Tamil_Nadu.jpg'
    ]
  },
  {
    id: 9, name: 'Vedanthangal Sanctuary', emoji: '🦅', category: 'nature', crowd: 'low', crowdPct: 25,
    rating: 4.5, wait: '5 min', best: '6am–9am', region: 'Kanchipuram', type: 'Bird Sanctuary',
    desc: "Vedanthangal Bird Sanctuary is one of Asia's oldest bird sanctuaries, established in 1798. The 30-hectare wetland shelters over 40,000 migratory birds annually.",
    hero: 'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?w=800&q=80',
    forecast: [12,10,18,25,30,28,25,22,18,15,10,8],
    alts: [4,6,10],
    mapLink: 'https://maps.google.com/?q=Vedanthangal+Bird+Sanctuary',
    mapText: 'Vedanthangal Bird Sanctuary, Kanchipuram District, Tamil Nadu 603209',
    hotels: [
      { name: 'TTDC Tourist Complex', img: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=400&q=80', rating: 4.0, dist: '0.3 km', price: '₹1,800/night', tags: ['Government','Basic','Near Sanctuary'] },
      { name: 'Feathers Hotel Kanchipuram', img: 'https://images.unsplash.com/photo-1544124065-8c0d64ee7fd9?w=400&q=80', rating: 4.4, dist: '35 km', price: '₹5,500/night', tags: ['Nearest City Hotel','Restaurant','Clean'] },
      { name: 'Hotel Sri Devi Kanchipuram', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&q=80', rating: 3.9, dist: '36 km', price: '₹1,500/night', tags: ['Budget','Pilgrimage Area','Clean'] }
    ],
    restaurants: [
      { name: 'TTDC Rest House Café', emoji: '☕', rating: 3.9, dist: 'On site', cuisine: 'Basic South Indian', tags: ['Tea','Meals','Simple'] },
      { name: 'Annapoorna Hotel Madurantakam', emoji: '🍛', rating: 4.3, dist: '18 km', cuisine: 'South Indian Meals', tags: ['Thali','Lunch','Veg'] },
      { name: 'Saravana Bhavan Kanchipuram', emoji: '🥘', rating: 4.6, dist: '35 km', cuisine: 'South Indian', tags: ['Reliable','AC','Tiffin'] }
    ],
    shops: [
      { name: 'Sanctuary Gift Stall', emoji: '🐦', desc: 'Bird guide books, binoculars for rent, postcards', rating: 3.8, dist: 'At entrance' },
      { name: 'Madurantakam Local Market', emoji: '🧺', desc: 'Local crafts, pottery, fresh vegetables', rating: 4.0, dist: '18 km' },
      { name: 'Kanchipuram Silk Market', emoji: '🥻', desc: 'Pure Kanchipuram silk at weaver workshops', rating: 4.7, dist: '35 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Forest dept restrooms at main entrance — free' },
      { icon: '🅿️', name: 'Parking', desc: 'Free parking outside sanctuary gate' },
      { icon: '🎟️', name: 'Entry Fee', desc: 'Indians ₹25; Foreigners ₹250; Camera ₹25/video ₹100' },
      { icon: '🔭', name: 'Watch Tower', desc: '2 observation platforms inside sanctuary for bird viewing' },
      { icon: '🦢', name: 'Peak Season', desc: 'Nov–Jan best for migration; up to 40,000 birds' },
      { icon: '🧭', name: 'Forest Guide', desc: 'Free forest guards available as guides on request' },
      { icon: '📵', name: 'No Noise', desc: 'Silence mandatory inside — no loud music or vehicles' },
      { icon: '🎒', name: 'Bird Guide Books', desc: 'Available at entrance; self-guided trail map free' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Vedanthangal_Bird_Sanctuary.jpg/640px-Vedanthangal_Bird_Sanctuary.jpg'
    ]
  },
  {
    id: 10, name: 'Yercaud Hills', emoji: '⛰️', category: 'nature', crowd: 'low', crowdPct: 30,
    rating: 4.4, wait: '0 min', best: '7am–11am', region: 'Salem', type: 'Hill Station',
    desc: "Yercaud, called the 'jewel of the south', is a hill station in the Shevaroy Hills at 1,515 m. Famous for its coffee and orange plantations, serene lake, and dense forests.",
    hero: 'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?w=800&q=80',
    forecast: [8,6,12,25,38,42,40,35,28,20,12,8],
    alts: [6,4,9],
    mapLink: 'https://maps.google.com/?q=Yercaud+Lake+Salem',
    mapText: 'Yercaud, Salem District, Tamil Nadu 636601',
    hotels: [
      { name: 'Sterling Yercaud', img: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=400&q=80', rating: 4.5, dist: '0.8 km', price: '₹6,800/night', tags: ['Resort','Lake View','Pool'] },
      { name: 'Hotel Grand Palace Yercaud', img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&q=80', rating: 4.2, dist: '0.5 km', price: '₹3,500/night', tags: ['Hill View','Restaurant','Family'] },
      { name: "Nature's Embrace Cottages", img: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&q=80', rating: 4.4, dist: '2.0 km', price: '₹4,000/night', tags: ['Coffee Estate','Peaceful','Cottages'] }
    ],
    restaurants: [
      { name: 'Hotel Sri Lakshmi', emoji: '🍛', rating: 4.4, dist: '0.4 km', cuisine: 'South Indian', tags: ['Meals','Veg','Affordable'] },
      { name: 'Yercaud Coffee House', emoji: '☕', rating: 4.6, dist: '0.2 km', cuisine: 'Café', tags: ['Estate Coffee','Snacks','View'] },
      { name: 'Raj Mahal Restaurant', emoji: '🍗', rating: 4.2, dist: '0.7 km', cuisine: 'Multi-cuisine', tags: ['Lunch','Dinner','Family'] }
    ],
    shops: [
      { name: 'Yercaud Coffee Estate Shop', emoji: '☕', desc: 'Arabica coffee, pepper, cardamom — straight from estates', rating: 4.8, dist: '1.5 km' },
      { name: 'Orange Grove Market', emoji: '🍊', desc: 'Fresh oranges, guavas, local honey and homemade jams', rating: 4.5, dist: '0.5 km' },
      { name: 'Tribal Art Gallery', emoji: '🎨', desc: 'Malayali tribal crafts, beeswax candles, natural dye clothes', rating: 4.3, dist: '1.0 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Municipal restrooms at lakefront — free' },
      { icon: '🅿️', name: 'Parking', desc: 'Free open parking near Yercaud Lake boathouse' },
      { icon: '🚣', name: 'Boating', desc: 'Row & pedal boats on Yercaud Lake ₹80/30min' },
      { icon: '🏚️', name: 'Pagoda Point', desc: 'Scenic viewpoint with valley panorama — 2 km from lake' },
      { icon: '🌹', name: 'Botanical Garden', desc: 'Anna Park with rose garden — seasonal flowers' },
      { icon: '🦋', name: "Lady's Seat", desc: 'Cliff viewpoint with paragliding base in season' },
      { icon: '☕', name: 'Coffee Tours', desc: 'Guided coffee estate plantation tours ₹200/person' },
      { icon: '🌿', name: 'Trekking', desc: '5 km Shevaroy Temple trek through dense forest' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Yercaud_Lake.jpg/640px-Yercaud_Lake.jpg'
    ]
  },
  {
    id: 11, name: 'Rameswaram Temple', emoji: '🌺', category: 'heritage', crowd: 'high', crowdPct: 82,
    rating: 4.8, wait: '40 min', best: '5am–7am', region: 'Ramanathapuram', type: 'Pilgrimage Site',
    desc: "Ramanathaswamy Temple has the world's longest temple corridor at 1,220 m with 1,200 pillars. One of the 12 Jyotirlinga temples in India, located on Rameswaram island.",
    hero: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    forecast: [85,80,78,80,85,88,90,88,82,75,68,60],
    alts: [3,9,12],
    mapLink: 'https://maps.google.com/?q=Ramanathaswamy+Temple+Rameswaram',
    mapText: 'Ramanathaswamy Temple, Rameswaram, Tamil Nadu 623526',
    hotels: [
      { name: 'Hotel Daiwik Rameswaram', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', rating: 4.5, dist: '0.5 km', price: '₹5,500/night', tags: ['Sea View','Pilgrimage','Modern'] },
      { name: 'Hyatt Place Rameswaram', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80', rating: 4.6, dist: '0.8 km', price: '₹7,000/night', tags: ['Luxury','Pool','Vegetarian Kitchen'] },
      { name: 'Hotel Tamil Nadu Rameswaram', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80', rating: 4.0, dist: '0.3 km', price: '₹2,000/night', tags: ['Government','Budget','Pilgrimage'] }
    ],
    restaurants: [
      { name: 'Vasantha Bhavan', emoji: '🍛', rating: 4.5, dist: '0.4 km', cuisine: 'South Indian Vegetarian', tags: ['Pure Veg','Meals','Morning Tiffin'] },
      { name: 'Amar Vilas Restaurant', emoji: '🥥', rating: 4.3, dist: '0.6 km', cuisine: 'Tamil Vegetarian', tags: ['Thali','No Onion No Garlic','Pilgrimage Meal'] },
      { name: 'Sea Shell Restaurant', emoji: '🦞', rating: 4.4, dist: '1.0 km', cuisine: 'Seafood', tags: ['Crab','Fish','Prawns'] }
    ],
    shops: [
      { name: 'Temple Bazaar Street', emoji: '🛍️', desc: 'Sacred items, rudraksha, conch shells, temple silk', rating: 4.4, dist: 'Adjacent to temple' },
      { name: 'Rameswaram Conch Market', emoji: '🐚', desc: 'Sacred Shankh shells, coral items, sea crafts', rating: 4.3, dist: '0.2 km' },
      { name: 'Khadi Bhandar Rameswaram', emoji: '🧵', desc: 'White dhoti, spiritual clothing, cotton fabrics', rating: 4.2, dist: '0.5 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Free restrooms at all temple entrances' },
      { icon: '🅿️', name: 'Parking', desc: 'Large free parking area 300 m from main eastern tower' },
      { icon: '🌊', name: 'Agni Tirtham', desc: 'Sacred sea bathing spot — 22 sacred wells (Theerthas) in temple' },
      { icon: '🐚', name: '22 Wells', desc: 'Pilgrims must bathe in all 22 sacred wells inside temple' },
      { icon: '🌉', name: 'Pamban Bridge', desc: 'Historic railway bridge over Palk Strait — 2 km from temple' },
      { icon: '🏝️', name: 'Dhanushkodi', desc: 'Abandoned ghost town at tip of island — 18 km from temple' },
      { icon: '👟', name: 'Shoe Deposit', desc: 'Free shoe deposit at all 4 entrances' },
      { icon: '🎟️', name: 'Entry', desc: 'Free; Special darshan ₹100; Camera inside not allowed' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ramanathaswamy_Temple_Rameswaram.jpg/640px-Ramanathaswamy_Temple_Rameswaram.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Pamban_Bridge_Rameswaram.jpg/640px-Pamban_Bridge_Rameswaram.jpg'
    ]
  },
  {
    id: 12, name: 'Pichavaram Mangroves', emoji: '🌳', category: 'nature', crowd: 'low', crowdPct: 20,
    rating: 4.6, wait: '0 min', best: '8am–11am', region: 'Cuddalore', type: 'Mangrove Forest',
    desc: "Pichavaram is home to the world's second largest mangrove forest. The 1,100-hectare labyrinthine waterway network is perfect for boat rides through dense mangrove channels.",
    hero: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
    forecast: [6,5,8,18,24,28,25,22,18,14,10,6],
    alts: [9,8,5],
    mapLink: 'https://maps.google.com/?q=Pichavaram+Mangrove+Forest',
    mapText: 'Pichavaram, Cuddalore District, Tamil Nadu 608502',
    hotels: [
      { name: 'TTDC Pichavaram Hotel', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80', rating: 4.0, dist: 'At site', price: '₹1,500/night', tags: ['On Site','Backwater View','Basic'] },
      { name: 'Hotel Chidambaram Regal', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80', rating: 4.2, dist: '14 km', price: '₹2,800/night', tags: ['Nearest City','Restaurant','AC'] },
      { name: 'Hotel Sri Annamalaiyar', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&q=80', rating: 3.9, dist: '15 km', price: '₹1,200/night', tags: ['Budget','Pilgrimage','Chidambaram'] }
    ],
    restaurants: [
      { name: 'TTDC Boathouse Restaurant', emoji: '🐟', rating: 4.0, dist: 'On site', cuisine: 'Fresh Seafood', tags: ['Fish Fry','Rice','Scenic View'] },
      { name: 'Hotel Saradharam Chidambaram', emoji: '🍛', rating: 4.3, dist: '14 km', cuisine: 'South Indian Meals', tags: ['Vegetarian','Thali','Lunch'] },
      { name: 'Muthu Mess', emoji: '🦐', rating: 4.4, dist: '15 km', cuisine: 'Cuddalore Seafood', tags: ['Prawns','Crab Curry','Local Favourite'] }
    ],
    shops: [
      { name: 'Pichavaram Boathouse Gift Shop', emoji: '🐚', desc: 'Shell items, mangrove honey, nature books', rating: 3.9, dist: 'At boathouse' },
      { name: 'Chidambaram Textile Market', emoji: '🧵', desc: 'Cotton fabrics, traditional weaves, handlooms', rating: 4.3, dist: '15 km' },
      { name: 'Local Fish Market Pichavaram', emoji: '🐠', desc: 'Freshest morning catch — crab, prawn, pomfret', rating: 4.5, dist: '1 km' }
    ],
    pois: [
      { icon: '🚻', name: 'Restrooms', desc: 'Restrooms available at TTDC boathouse complex' },
      { icon: '🅿️', name: 'Parking', desc: 'Free parking at TTDC boathouse area' },
      { icon: '🚣', name: 'Boat Rides', desc: 'Row boat ₹120/person; Motor boat ₹200/person; 1 hr circuit' },
      { icon: '🐦', name: 'Bird Watching', desc: '200+ bird species including kingfishers, herons, egrets' },
      { icon: '🦦', name: 'Otters', desc: 'Smooth-coated otters spotted in early morning' },
      { icon: '🌿', name: 'Nature Trail', desc: 'Walking trail through mangrove forest edge — 1.5 km' },
      { icon: '🎣', name: 'Fishing', desc: 'Permit fishing available through TTDC — ₹150' },
      { icon: '📷', name: 'Photography', desc: 'Excellent morning light through mangrove canopy' }
    ],
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pichavaram_Mangrove_Forest.jpg/640px-Pichavaram_Mangrove_Forest.jpg'
    ]
  }
];

// Simulate live crowd fluctuation every 30 seconds
function simulateCrowd() {
  PLACES.forEach(p => {
    const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4);
    p.crowdPct = Math.min(97, Math.max(5, p.crowdPct + delta));
    p.crowd = p.crowdPct < 40 ? 'low' : p.crowdPct < 70 ? 'moderate' : 'high';
  });
}
setInterval(simulateCrowd, 30000);

/* ══════════════════════════════════════════
   BOOKINGS (in-memory store)
══════════════════════════════════════════ */
const BOOKINGS = [];

/* ══════════════════════════════════════════
   API ROUTES
══════════════════════════════════════════ */

// GET all places (with optional filters)
app.get('/api/places', (req, res) => {
  let result = [...PLACES];
  const { category, crowd, search } = req.query;

  if (category && category !== 'all') {
    if (['low','moderate','high'].includes(category)) {
      result = result.filter(p => p.crowd === category);
    } else {
      result = result.filter(p => p.category === category);
    }
  }
  if (crowd && crowd !== 'all') {
    result = result.filter(p => p.crowd === crowd);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET single place by ID
app.get('/api/places/:id', (req, res) => {
  const place = PLACES.find(p => p.id === parseInt(req.params.id));
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
  res.json({ success: true, data: place });
});

// GET live crowd stats summary
app.get('/api/stats', (req, res) => {
  const low    = PLACES.filter(p => p.crowd === 'low').length;
  const mod    = PLACES.filter(p => p.crowd === 'moderate').length;
  const high   = PLACES.filter(p => p.crowd === 'high').length;
  const avgWait = Math.round(PLACES.reduce((s, p) => s + parseInt(p.wait) || 0, 0) / PLACES.length);
  res.json({ success: true, data: { total: PLACES.length, low, moderate: mod, high, avgWait } });
});

// GET alternatives for a place
app.get('/api/places/:id/alternatives', (req, res) => {
  const place = PLACES.find(p => p.id === parseInt(req.params.id));
  if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
  const alts = place.alts.map(aid => PLACES.find(x => x.id === aid)).filter(Boolean);
  res.json({ success: true, data: alts });
});

// GET all hotels across all places
app.get('/api/hotels', (req, res) => {
  const hotels = [];
  PLACES.forEach(p => p.hotels.forEach(h => hotels.push({ ...h, place: p.name, placeId: p.id })));
  res.json({ success: true, count: hotels.length, data: hotels });
});

// GET all restaurants
app.get('/api/restaurants', (req, res) => {
  const restaurants = [];
  PLACES.forEach(p => p.restaurants.forEach(r => restaurants.push({ ...r, place: p.name, placeId: p.id })));
  res.json({ success: true, count: restaurants.length, data: restaurants });
});

// POST create a booking
app.post('/api/bookings', (req, res) => {
  const { placeId, amenityName, amenityType, slot, userName, userEmail } = req.body;
  if (!amenityName || !slot) {
    return res.status(400).json({ success: false, message: 'amenityName and slot are required' });
  }
  const booking = {
    id: Date.now(),
    placeId,
    amenityName,
    amenityType: amenityType || 'hotel',
    slot,
    userName: userName || 'Guest',
    userEmail: userEmail || '',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  BOOKINGS.push(booking);
  res.status(201).json({ success: true, message: 'Booking confirmed!', data: booking });
});

// GET all bookings
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, count: BOOKINGS.length, data: BOOKINGS });
});

// DELETE a booking
app.delete('/api/bookings/:id', (req, res) => {
  const idx = BOOKINGS.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
  BOOKINGS.splice(idx, 1);
  res.json({ success: true, message: 'Booking cancelled' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CrowdMonitor API is running', timestamp: new Date().toISOString() });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 CrowdMonitor Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   GET  /api/places          - All places (supports ?search=, ?category=, ?crowd=)`);
  console.log(`   GET  /api/places/:id      - Single place details`);
  console.log(`   GET  /api/places/:id/alternatives`);
  console.log(`   GET  /api/stats           - Live crowd stats`);
  console.log(`   GET  /api/hotels          - All hotels`);
  console.log(`   GET  /api/restaurants     - All restaurants`);
  console.log(`   POST /api/bookings        - Create booking`);
  console.log(`   GET  /api/bookings        - All bookings`);
  console.log(`   DELETE /api/bookings/:id  - Cancel booking`);
  console.log(`   GET  /api/health          - Health check\n`);
});m o d u l e . e x p o r t s   =   a p p ;  
 