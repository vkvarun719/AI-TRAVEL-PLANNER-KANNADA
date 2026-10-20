// Pre-built, instant static Karnataka itineraries for SEO & 1-click loading

export const CURATED_ITINERARIES = {
  'hampi-3-day': {
    id: 'static_hampi_3day',
    starting_point: 'Hampi',
    days: 3,
    budget: 'mid-range',
    vibe: 'Cultural & Heritage',
    travelers: 2,
    travel_month: 'October',
    summary: 'A breathtaking journey across the boulder-strewn capital of the 14th-century Vijayanagara Empire. Marvel at the stone chariot of Vijaya Vittala, cross the Tungabhadra river on a circular coracle boat, and watch the sun dip behind the Anjanadri monkey hill.',
    best_time_to_visit: 'October to February when winter winds make temple exploration breezy and cool.',
    packing_tips: 'Sturdy walking shoes for climbing Matanga Hill boulders, cotton clothes, sunglasses, and camera with wide-angle lens.',
    cost_breakdown: {
      stay: 5500,
      food: 3200,
      transport: 2400,
      activities: 1200,
      total: 12300,
      currency: 'INR'
    },
    season_info: {
      season_name: 'Winter',
      weather_summary: 'Pleasant daytime temperatures around 28°C and cool night breezes across the Tungabhadra banks.',
      destination_weather_notes: [
        { destination: 'Hampi Heritage Zone', note: 'Clear blue skies with low humidity; ideal for sunrise hikes up Matanga hill.', temperature_range: '19°C - 30°C' }
      ]
    },
    itinerary: [
      {
        day: 1,
        title: 'Virupaksha & Sacred Center Exploration',
        morning: 'Begin at sunrise at the 7th-century Virupaksha Temple. Walk through the Hampi Bazaar colonnade and ascend Hemakuta Hill for monolithic Ganesha statues.',
        afternoon: 'Savor traditional South Indian banana-leaf meals at Mango Tree Restaurant. Visit the massive Lakshmi Narasimha statue and Badavilinga.',
        evening: 'Climb Matanga Hill for a panoramic golden hour sunset over the Tungabhadra boulder expanse.',
        tips: 'Keep shoes with temple attendants and beware of mischievous temple monkeys.',
        estimated_cost: '₹1,500 for two',
        stay: {
          name: 'Heritage Resort Hampi / Kamalapura Homestay',
          type: 'Heritage Boutique Stay',
          area: 'Kamalapura',
          approx_price: '₹3,500 / night',
          why_special: 'Surrounded by lush fields just 3 km from royal ruins.'
        },
        places_to_visit: [
          { name: 'Virupaksha Temple', best_time: '6:30 AM', entry_fee: 'Free / ₹25 sanctum', highlight: 'Active worship since Vijayanagara empire' },
          { name: 'Hemakuta Hill & Sasivekalu Ganesha', best_time: '8:30 AM', entry_fee: 'Free', highlight: 'Ancient shrines and monolithic rock carvings' }
        ],
        where_to_eat: [
          { name: 'Mango Tree Restaurant', dish: 'North Karnataka Thali with Jowar Rotti', meal_type: 'Lunch', approx_cost: '₹400 for two', address_or_area: 'Near New Hampi' }
        ]
      },
      {
        day: 2,
        title: 'Royal Enclosure & Stone Chariot of Vittala',
        morning: 'Explore the Queen\'s Bath, stepped tank pushkarani, and King\'s Audience Hall in the Royal Enclosure. Walk to the Lotus Mahal and Elephant Stables.',
        afternoon: 'Take an electric buggy or riverside walkway to the UNESCO masterpiece: Vijaya Vittala Temple with its musical pillars and iconic Stone Chariot.',
        evening: 'Glide across the Tungabhadra river on a traditional circular coracle boat near riverside gorge ruins.',
        tips: 'Stone Chariot entry ticket is valid for both Vittala and Lotus Mahal on the same day.',
        estimated_cost: '₹2,200 for two',
        stay: {
          name: 'Heritage Resort Hampi / Kamalapura Homestay',
          type: 'Heritage Boutique Stay',
          area: 'Kamalapura',
          approx_price: '₹3,500 / night',
          why_special: 'Comfortable evening pool and regional thali meals.'
        },
        places_to_visit: [
          { name: 'Vijaya Vittala Temple & Stone Chariot', best_time: '2:30 PM - 5:00 PM', entry_fee: '₹40 (ASI ticket)', highlight: 'World-famous chariot and acoustic pillars' },
          { name: 'Lotus Mahal & Elephant Stables', best_time: '10:00 AM', entry_fee: 'Included in ASI ticket', highlight: 'Indo-Islamic royal palace architecture' }
        ],
        where_to_eat: [
          { name: 'Suresh Restaurant', dish: 'Crispy Dosa with fresh coconut chutney & filter coffee', meal_type: 'Breakfast', approx_cost: '₹200 for two', address_or_area: 'Kamalapura Main Road' }
        ]
      },
      {
        day: 3,
        title: 'Anegundi Village, Hippie Island & Sanapur Lake',
        morning: 'Cross over to Anegundi—the mythical Kishkindha kingdom. Visit Chintamani temple complex and Navabrindavana on river island.',
        afternoon: 'Cliff-view relaxation at Sanapur Lake and boulder-hopping near bamboo cafes. Savor wood-fired regional pizzas and fresh juices.',
        evening: 'Climb the 575 whitewashed steps of Anjanadri Hill (Hanuman birth place) for an unforgettable 360-degree sunset over paddy fields.',
        tips: 'Wear modest clothing for the temple hill climb and bring plenty of water.',
        estimated_cost: '₹1,800 for two',
        stay: {
          name: 'Uramma Heritage Homes',
          type: 'Rural Artisan Homestay',
          area: 'Anegundi Village',
          approx_price: '₹2,800 / night',
          why_special: 'Restored 100-year-old village homes promoting local weavers.'
        },
        places_to_visit: [
          { name: 'Sanapur Lake', best_time: '1:00 PM - 3:30 PM', entry_fee: 'Free / ₹100 coracle ride', highlight: 'Serene blue reservoir nested between volcanic granite rocks' },
          { name: 'Anjanadri Hill', best_time: '4:45 PM - 6:30 PM', entry_fee: 'Free', highlight: 'Panoramic bird-eye view of Vijayanagara empire terrain' }
        ],
        where_to_eat: [
          { name: 'Laughing Buddha Cafe', dish: 'Nutella banana pancake & lemon mint nana', meal_type: 'Dinner', approx_cost: '₹550 for two', address_or_area: 'Virupapur Gaddi / Anegundi' }
        ]
      }
    ],
    local_food_trail: [
      { dish_name: 'Jolada Rotti Oota', regional_origin: 'North Karnataka', iconic_spot: 'Shanti Restaurant, Hampi', description: 'Handcrafted sorghum flatbreads served with Yennegai stuffed brinjal, shenga peanut chutney, and spiced sprouts.', vegetarian: true },
      { dish_name: 'Bellary Dum Biryani', regional_origin: 'Ballari / Tungabhadra', iconic_spot: 'Nawaab Biryani Hub, Hospet', description: 'Fragrant seeraga samba rice slow-cooked with tender marinated mutton and secret dry spice mix.', vegetarian: false },
      { dish_name: 'Benne Dosa', regional_origin: 'Davanagere / Central Karnataka', iconic_spot: 'Sri Guru Kottureshwara Butter Dosa, Hospet Road', description: 'Thick, airy golden crepe roasted with dollops of churned white butter and potato masala.', vegetarian: true }
    ]
  },

  'bengaluru-weekend': {
    id: 'static_bengaluru_weekend',
    starting_point: 'Bengaluru',
    days: 2,
    budget: 'mid-range',
    vibe: 'Relaxed & Nature',
    travelers: 2,
    travel_month: 'October',
    summary: 'The quintessential Karnataka weekend escape from Bengaluru through Mysuru highway into Coorg coffee estates. Includes Tibetan golden temples in Bylakuppe, cascading Abbey falls, and authentic Kodava Pandi curry.',
    best_time_to_visit: 'August to March during monsoon and lush post-monsoon coffee bloom.',
    packing_tips: 'Light fleece or jacket for cool evening estate breezes, umbrella for occasional mountain showers, and mosquito repellent.',
    cost_breakdown: {
      stay: 6000,
      food: 3500,
      transport: 4200,
      activities: 800,
      total: 14500,
      currency: 'INR'
    },
    season_info: {
      season_name: 'Post-Monsoon / Autumn',
      weather_summary: 'Pleasant days with mist-blanketed valleys in early mornings and starry crisp nights.',
      destination_weather_notes: [
        { destination: 'Madikeri & Coorg Hills', note: 'Cool temperatures with occasional afternoon mountain mist.', temperature_range: '16°C - 24°C' }
      ]
    },
    itinerary: [
      {
        day: 1,
        title: 'Bengaluru to Coorg via Bylakuppe Monastery',
        morning: 'Depart early from Bengaluru via Mysore Expressway. Stop for iconic Bidadi Thatte Idli. Reach Bylakuppe to explore Namdroling Monastery (Golden Temple) and hear monks chanting.',
        afternoon: 'Savor traditional Kodava pork or veg curry with Akki Rotti at Madikeri. Check into a scenic coffee plantation homestay.',
        evening: 'Watch the sun sink into misty blue ridges at Raja\'s Seat accompanied by the musical fountain show.',
        tips: 'Leave Bengaluru by 6:00 AM to beat toll traffic on Mysore highway.',
        estimated_cost: '₹2,500 for two',
        stay: {
          name: 'Honey Valley Estate / Plantation Homestay',
          type: 'Working Coffee Plantation Stay',
          area: 'Madikeri / Virajpet',
          approx_price: '₹3,500 / night',
          why_special: 'Organic coffee aroma, spice trails, and Kodava homemade meals.'
        },
        places_to_visit: [
          { name: 'Namdroling Golden Temple', best_time: '11:00 AM', entry_fee: 'Free', highlight: '40-foot golden Buddha statues & peaceful Tibetan prayer bells' },
          { name: 'Raja\'s Seat Sunset Point', best_time: '5:00 PM - 6:30 PM', entry_fee: '₹10', highlight: 'Panoramic mist-filled Western Ghats sunset' }
        ],
        where_to_eat: [
          { name: 'Raintree Restaurant', dish: 'Pandi Curry & Kadambuttu (rice dumplings)', meal_type: 'Dinner', approx_cost: '₹700 for two', address_or_area: 'Pension Lane, Madikeri' }
        ]
      },
      {
        day: 2,
        title: 'Coffee Trails, Abbey Falls & Return',
        morning: 'Wake up to bird songs and a fresh-brewed Coorg Arabica cup. Guided walk through pepper vines and coffee bushes. Drive to roaring Abbey Falls through private spice valleys.',
        afternoon: 'Visit Omkareshwara Temple built in unique Gothic-Islamic architecture with a large lotus pond. Pick up Coorg spices, homemade dark chocolates, and coffee beans.',
        evening: 'Scenic drive back to Bengaluru with evening filter coffee stop at Maddur Tiffany’s.',
        tips: 'Buy unadulterated pepper and whole-bean coffee directly from estate shops for best freshness.',
        estimated_cost: '₹2,000 for two',
        stay: null,
        places_to_visit: [
          { name: 'Abbey Falls', best_time: '9:30 AM', entry_fee: '₹15', highlight: '70-foot waterfall cascading into boulder ravine' },
          { name: 'Omkareshwara Temple', best_time: '11:30 AM', entry_fee: 'Free', highlight: '1820 AD temple with central dome and minarets' }
        ],
        where_to_eat: [
          { name: 'Coorg Cuisine', dish: 'Bamboo Shoot Curry (Kani Curry) & Paputtu', meal_type: 'Lunch', approx_cost: '₹500 for two', address_or_area: 'Main Street, Madikeri' }
        ]
      }
    ],
    local_food_trail: [
      { dish_name: 'Pandi Curry with Kadambuttu', regional_origin: 'Kodagu (Coorg)', iconic_spot: 'Coorg Cuisine, Madikeri', description: 'Slow-simmered pork in roasted dark spices with sour Kachampuli wild vinegar, served with steamed rice balls.', vegetarian: false },
      { dish_name: 'Maddur Vada & Filter Kaapi', regional_origin: 'Mandya Highway', iconic_spot: 'Maddur Tiffany\'s, Bengaluru-Mysuru Highway', description: 'Crispy deep-fried onion and semolina savory patty infused with curry leaves and asafoetida.', vegetarian: true },
      { dish_name: 'Thatte Idli with Red Chutney', regional_origin: 'Bidadi', iconic_spot: 'Renukamba Thatte Idli, Bidadi', description: 'Plate-sized fluffy steamed idli crowned with dollops of melted butter and spicy podi.', vegetarian: true }
    ]
  },

  'coastal-karnataka': {
    id: 'static_coastal_karnataka',
    starting_point: 'Gokarna',
    days: 3,
    budget: 'mid-range',
    vibe: 'Beaches & Spiritual',
    travelers: 2,
    travel_month: 'November',
    summary: 'The ultimate coastal Karnataka journey along the Arabian Sea coast. Trek across Gokarna\'s cliffside beaches, witness the towering 123-foot Shiva statue at Murudeshwar, and relish authentic Mangalore Ghee Roast and Udupi Mattu Gulla.',
    best_time_to_visit: 'October to March when skies are clear blue and sea waves are tranquil.',
    packing_tips: 'Flip flops and sandals, swimwear, sunscreen, breezy linen shirts, and beach towel.',
    cost_breakdown: {
      stay: 6200,
      food: 3800,
      transport: 3000,
      activities: 900,
      total: 13900,
      currency: 'INR'
    },
    season_info: {
      season_name: 'Winter',
      weather_summary: 'Sun-drenched days with pleasant sea breezes and calm waters.',
      destination_weather_notes: [
        { destination: 'Gokarna & Murudeshwar Coast', note: 'Dry and sunny with sparkling Arabian sea visibility.', temperature_range: '22°C - 31°C' }
      ]
    },
    itinerary: [
      {
        day: 1,
        title: 'Gokarna 5-Beach Cliff Trek & Mahabaleshwar Temple',
        morning: 'Visit the 4th-century sacred Mahabaleshwar Temple with its Atmalinga. Walk along Gokarna Main Beach and ascend cliffs towards Kudle Beach.',
        afternoon: 'Relax under coconut canopies at Om Beach (shaped naturally like the sacred Om symbol). Savor fresh seafood or vegan bowls at Namaste Cafe.',
        evening: 'Trek the rocky trail from Om Beach to Half Moon Beach and Paradise Beach. Sunset view over the Arabian Sea waves.',
        tips: 'Keep trekking to daylight hours as cliff trails do not have electric lights.',
        estimated_cost: '₹1,600 for two',
        stay: {
          name: 'Kahani Paradise / Kudle Beach Clifftop Resort',
          type: 'Boutique Beach Resort',
          area: 'Kudle Beach, Gokarna',
          approx_price: '₹3,500 / night',
          why_special: 'Panoramic cliff views overlooking Kudle bay.'
        },
        places_to_visit: [
          { name: 'Om Beach', best_time: '2:00 PM - 5:00 PM', entry_fee: 'Free', highlight: 'Geographical shoreline formed in the shape of Om ॐ' },
          { name: 'Mahabaleshwar Temple', best_time: '7:00 AM - 10:00 AM', entry_fee: 'Free', highlight: 'Atmalinga shrine facing the ocean' }
        ],
        where_to_eat: [
          { name: 'Namaste Cafe', dish: 'Fish Thali / Woodfired Pizza & Fresh Pineapple Juice', meal_type: 'Lunch', approx_cost: '₹600 for two', address_or_area: 'Om Beach, Gokarna' }
        ]
      },
      {
        day: 2,
        title: 'Murudeshwar Colossus & Netrani Island View',
        morning: 'Drive 1.5 hours south along scenic NH66 coastal highway to Murudeshwar. Ascend the 20-story Raja Gopuram via elevator for a jaw-dropping view of the world\'s second-tallest Shiva statue surrounded by ocean on three sides.',
        afternoon: 'Explore the cave museum below the statue depicting the Ravana Atmalinga epic. Savor Coastal Karavali thali with Kane Rava Fry.',
        evening: 'Relax on Murudeshwar beach promenade with street corn and tender coconut as waves light up with evening temple spotlights.',
        tips: 'Elevator inside the 249-foot gopuram costs ₹10 and offers stunning 360-degree aerial sea photos.',
        estimated_cost: '₹2,100 for two',
        stay: {
          name: 'RNS Residency Sea View',
          type: 'Oceanfront Hotel',
          area: 'Murudeshwar Beach',
          approx_price: '₹3,200 / night',
          why_special: 'Balconies opening directly over the breaking Arabian sea waves.'
        },
        places_to_visit: [
          { name: 'Murudeshwar Shiva Statue & Gopuram', best_time: '9:30 AM', entry_fee: 'Free (₹10 for Gopuram lift)', highlight: '123-foot colossal Shiva statue flanked by ocean' },
          { name: 'Murudeshwar Beach & Water Sports', best_time: '4:00 PM', entry_fee: 'Nominal for boat rides', highlight: 'Jet ski, speed boat rides, and ocean promenade' }
        ],
        where_to_eat: [
          { name: 'Naveen Beach Restaurant', dish: 'Anjal (Kingfish) Tawa Fry with Ghee Rice', meal_type: 'Lunch', approx_cost: '₹750 for two', address_or_area: 'Adjacent to sea jetty' }
        ]
      },
      {
        day: 3,
        title: 'Udupi Krishna Matha, Malpe St. Mary\'s Island',
        morning: 'Drive further south to Udupi. Visit the famous Sri Krishna Matha and peer through the silver-plated Kanakana Kindi window where Lord Krishna turned around for his devotee.',
        afternoon: 'Head to Malpe Beach and take a 20-minute ferry to St. Mary\'s Island, featuring hexagonal basaltic rock pillars formed by prehistoric volcanic activity millions of years ago.',
        evening: 'Taste world-famous authentic Udupi Masala Dosa with coconut chutney and filter coffee at Mitra Samaj.',
        tips: 'St. Mary\'s Island is a zero-plastic zone; carry eco-friendly bags and water bottles.',
        estimated_cost: '₹1,900 for two',
        stay: null,
        places_to_visit: [
          { name: 'St. Mary\'s Island (Hexagonal Basalt Columns)', best_time: '1:30 PM - 4:30 PM', entry_fee: '₹400 ferry return', highlight: 'National Geological Monument of volcanic columns' },
          { name: 'Udupi Sri Krishna Matha', best_time: '8:00 AM', entry_fee: 'Free', highlight: 'Kanakana Kindi window and traditional chariot street' }
        ],
        where_to_eat: [
          { name: 'Mitra Samaj', dish: 'Traditional Udupi Masala Dosa & Goli Baje', meal_type: 'Snack / Lunch', approx_cost: '₹250 for two', address_or_area: 'Car Street, Udupi' }
        ]
      }
    ],
    local_food_trail: [
      { dish_name: 'Mangalorean Anjal (Kingfish) Rava Fry', regional_origin: 'Coastal Karnataka', iconic_spot: 'Giri Manja\'s, Mangaluru', description: 'Fresh sea kingfish marinated in spicy Byadgi chilli paste, coated in semolina and pan-fried to crisp perfection.', vegetarian: false },
      { dish_name: 'Udupi Mattu Gulla Sambar', regional_origin: 'Udupi', iconic_spot: 'Mitra Samaj, Car Street, Udupi', description: 'GI-tagged special green brinjals cooked in lentil broth with fresh ground spices, coconut, and jaggery.', vegetarian: true },
      { dish_name: 'Neer Dosa with Chicken Ghee Roast', regional_origin: 'Tulu Nadu', iconic_spot: 'Maharaja Restaurant, Bunts Hostel Road', description: 'Lace-thin delicate rice crepes served with succulent chicken slow-roasted in pure country ghee and fiery red spices.', vegetarian: false }
    ]
  }
}
