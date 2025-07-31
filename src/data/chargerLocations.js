const chargerLocations = [
  { 
    id: 1, 
    lat: -38.1582, 
    lng: 144.3745, 
    name: 'East Geelong Station',
    vehicleType: ['Sedan', 'SUV'],
    chargerType: ['CCS', 'Type 2'],
    chargingSpeed: '50-150kW',
    priceRange: 25,
    isAvailable: true
  },
  { 
    id: 2, 
    lat: -38.1800, 
    lng: 144.3500, 
    name: 'Belmont Station',
    vehicleType: ['Sedan', 'Hatchback'],
    chargerType: ['CHAdeMO', 'Type 1'],
    chargingSpeed: '22-50kW',
    priceRange: 15,
    isAvailable: true
  },
  { 
    id: 3, 
    lat: -38.2054, 
    lng: 144.3393, 
    name: 'Grovedale Station',
    vehicleType: ['SUV'],
    chargerType: ['CCS'],
    chargingSpeed: '150kW+',
    priceRange: 45,
    isAvailable: false
  },
  { 
    id: 4, 
    lat: -38.1407, 
    lng: 144.3367, 
    name: 'Geelong West Station',
    vehicleType: ['Sedan', 'Hatchback', 'SUV'],
    chargerType: ['Type 2'],
    chargingSpeed: '<22kW',
    priceRange: 10,
    isAvailable: true
  },
  { 
    id: 5, 
    lat: -38.1649, 
    lng: 144.3928, 
    name: 'Newcomb Station',
    vehicleType: ['Sedan'],
    chargerType: ['CCS', 'Type 2'],
    chargingSpeed: '50-150kW',
    priceRange: 30,
    isAvailable: true
  },
  { 
    id: 6, 
    lat: -38.1155, 
    lng: 144.3491, 
    name: 'North Geelong Station',
    vehicleType: ['Hatchback', 'SUV'],
    chargerType: ['CHAdeMO'],
    chargingSpeed: '22-50kW',
    priceRange: 20,
    isAvailable: false
  },
  { 
    id: 7, 
    lat: -38.1760, 
    lng: 144.3176, 
    name: 'Highton Station',
    vehicleType: ['Sedan', 'SUV'],
    chargerType: ['Type 1', 'Type 2'],
    chargingSpeed: '<22kW',
    priceRange: 12,
    isAvailable: true
  },
  { 
    id: 8, 
    lat: -38.1484, 
    lng: 144.3570, 
    name: 'Geelong CBD Station',
    vehicleType: ['Sedan', 'Hatchback', 'SUV'],
    chargerType: ['CCS', 'CHAdeMO', 'Type 1', 'Type 2'],
    chargingSpeed: '150kW+',
    priceRange: 60,
    isAvailable: true
  },
  { 
    id: 9, 
    lat: -38.2110, 
    lng: 144.3068, 
    name: 'Waurn Ponds Station',
    vehicleType: ['Sedan', 'Hatchback'],
    chargerType: ['CCS', 'Type 2'],
    chargingSpeed: '50-150kW',
    priceRange: 35,
    isAvailable: true
  },
  { 
    id: 10, 
    lat: -38.0730, 
    lng: 144.3591, 
    name: 'Corio Station',
    vehicleType: ['SUV'],
    chargerType: ['CHAdeMO', 'Type 1'],
    chargingSpeed: '22-50kW',
    priceRange: 18,
    isAvailable: false
  },
  { 
    id: 11, 
    lat: -38.1507, 
    lng: 144.3344, 
    name: 'Corio Station 2',
    vehicleType: ['Sedan', 'Hatchback'],
    chargerType: ['Type 2'],
    chargingSpeed: '<22kW',
    priceRange: 8,
    isAvailable: true
  },
  { 
    id: 12, 
    lat: -38.2363, 
    lng: 144.3708, 
    name: 'Armstrong Creek Station',
    vehicleType: ['Sedan', 'SUV'],
    chargerType: ['CCS', 'CHAdeMO'],
    chargingSpeed: '150kW+',
    priceRange: 50,
    isAvailable: true
  },
  { 
    id: 13, 
    lat: -38.2140, 
    lng: 144.3686, 
    name: 'Charlemont Station',
    vehicleType: ['Hatchback', 'SUV'],
    chargerType: ['Type 1', 'Type 2'],
    chargingSpeed: '22-50kW',
    priceRange: 22,
    isAvailable: true
  },
];

export default chargerLocations;