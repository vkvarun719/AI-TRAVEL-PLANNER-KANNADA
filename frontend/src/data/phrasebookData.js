// Comprehensive Kannada Travel Phrasebook Data
// Structured into 5 key categories: greetings, food, transport, emergencies, shopping

export const PHRASEBOOK_CATEGORIES = [
  { id: 'all', labelEn: 'All Phrases', labelKn: 'ಎಲ್ಲಾ ನುಡಿಗಟ್ಟು' },
  { id: 'greetings', labelEn: 'Greetings', labelKn: 'ಶುಭಾಶಯಗಳು' },
  { id: 'food', labelEn: 'Food & Dining', labelKn: 'ಆಹಾರ & ಊಟ' },
  { id: 'transport', labelEn: 'Transport', labelKn: 'ಸಾರಿಗೆ & ದಾರಿ' },
  { id: 'emergencies', labelEn: 'Emergencies', labelKn: 'ತುರ್ತು & ಸಹಾಯ' },
  { id: 'shopping', labelEn: 'Shopping & Money', labelKn: 'ಖರೀದಿ & ಹಣ' },
]

export const PHRASEBOOK_DATA = [
  // 1. Greetings & Everyday Basics
  {
    id: 'g1',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'Hello / Greetings',
    kannada: 'ನಮಸ್ಕಾರ',
    phonetic: 'Namaskāra',
    context: 'Traditional respectful greeting used any time of day across Karnataka.'
  },
  {
    id: 'g2',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'How are you?',
    kannada: 'ಹೇಗಿದ್ದೀರಾ?',
    phonetic: 'Hēgiddīrā?',
    context: 'Respectful way to ask how someone is doing.'
  },
  {
    id: 'g3',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'I am doing well, thank you',
    kannada: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು',
    phonetic: 'Nānu chennāgiddēne, dhanyavādagalu',
    context: 'Polite response when asked how you are.'
  },
  {
    id: 'g4',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'Thank you very much',
    kannada: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು',
    phonetic: 'Thumbā dhanyavādagalu',
    context: 'Warm appreciation to homestay hosts, drivers, and helpers.'
  },
  {
    id: 'g5',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'Please',
    kannada: 'ದಯವಿಟ್ಟು',
    phonetic: 'Dayavittu',
    context: 'Universal polite prefix when making any request.'
  },
  {
    id: 'g6',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'Excuse me / Sorry',
    kannada: 'ಕ್ಷಮಿಸಿ',
    phonetic: 'Kshamisi',
    context: 'Use when navigating crowded temples, markets, or bus stands.'
  },
  {
    id: 'g7',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'What is your name?',
    kannada: 'ನಿಮ್ಮ ಹೆಸರೇನು?',
    phonetic: 'Nimma hesarēnu?',
    context: 'Polite question to get to know locals.'
  },
  {
    id: 'g8',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'My name is...',
    kannada: 'ನನ್ನ ಹೆಸರು...',
    phonetic: 'Nanna hesaru...',
    context: 'Introduce yourself in Kannada.'
  },
  {
    id: 'g9',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'Goodbye / See you again',
    kannada: 'ಹೋಗಿ ಬರ್ತೇನೆ (ಬರ್ತೀನಿ)',
    phonetic: 'Hōgi barthēne (Barthīni)',
    context: 'In Kannada culture, saying "I will go and return" is customary instead of final goodbye.'
  },
  {
    id: 'g10',
    category: 'greetings',
    categoryKn: 'ಶುಭಾಶಯಗಳು',
    english: 'I speak a little Kannada',
    kannada: 'ನನಗೆ ಕನ್ನಡ ಸ್ವಲ್ಪ ಬರುತ್ತೆ',
    phonetic: 'Nanage kannada swalpa baruththe',
    context: 'Instantly brings a warm, proud smile to any local.'
  },

  // 2. Food & Dining
  {
    id: 'f1',
    category: 'food',
    categoryKn: 'ಆಹಾರ & ಊಟ',
    english: 'Where can I get good local food?',
    kannada: 'ಇಲ್ಲಿ ಒಳ್ಳೆಯ ಸ್ಥಳೀಯ ಊಟ ಎಲ್ಲಿ ಸಿಗುತ್ತೆ?',
    phonetic: 'Illi olleya sthalīya oota elli siguththe?',
    context: 'Finding authentic mess, military hotels, or tiffin centres.'
  },
  {
    id: 'f2',
    category: 'food',
    categoryKn: 'ಆಹಾರ & ಊಟ',
    english: 'Please give one plate Masala Dosa',
    kannada: 'ಒಂದು ಪ್ಲೇಟ್ ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ',
    phonetic: 'Ondu plēt masāle dōse kodi',
    context: 'Ordering at iconic breakfast places (Vidyarthi Bhavan, Mylari).'
  },
  {
    id: 'f3',
    category: 'food',
    categoryKn: 'ಆಹಾರ & ಊಟ',
    english: 'One cup of hot Filter Coffee, please',
    kannada: 'ಒಂದು ಕಪ್ ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
    phonetic: 'Ondu kap bisi philtar kāphi kodi',
    context: 'Ordering Karnataka style piping hot aromatic filter coffee.'
  },
  {
    id: 'f4',
    category: 'food',
    categoryKn: 'ಆಹಾರ & ಊಟ',
    english: 'Please give drinking water',
    kannada: 'ದಯವಿಟ್ಟು ಕುಡಿಯುವ ನೀರು ಕೊಡಿ',
    phonetic: 'Dayavittu kudiyuva neeru kodi',
    context: 'Requesting clean drinking water at any hotel or stall.'
  },
  {
    id: 'f5',
    category: 'food',
    categoryKn: 'ಆಹಾರ & ಊಟ',
    english: 'Please make it less spicy',
    kannada: 'ಖಾರ ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ',
    phonetic: 'Khāra swalpa kadime mādi',
    context: 'Crucial for spicy Mangalorean ghee roast or Sauji curries.'
  },
  {
    id: 'f6',
    category: 'food',
    categoryKn: 'ಆಹಾರ & ಊಟ',
    english: 'Is this pure vegetarian?',
    kannada: 'ಇದು ಶುದ್ಧ ಸಸ್ಯಾಹಾರವೇ?',
    phonetic: 'Idu shuddha sasyāhāravē?',
    context: 'Checking food dietary suitability at roadside eateries.'
  },
  {
    id: 'f7',
    category: 'food',
    categoryKn: 'ಆಹಾರ & ಊಟ',
    english: 'The food is very delicious!',
    kannada: 'ಊಟ ತುಂಬಾ ರುಚಿಯಾಗಿದೆ / ಅದ್ಭುತವಾಗಿದೆ!',
    phonetic: 'Oota thumbā ruchiyāgide / adbhuthavāgide!',
    context: 'Complimenting your homestay cook, chef, or hotel server.'
  },
  {
    id: 'f8',
    category: 'food',
    categoryKn: 'ಆಹಾರ & ಊಟ',
    english: 'Please bring the bill',
    kannada: 'ದಯವಿಟ್ಟು ಬಿಲ್ ಕೊಡಿ',
    phonetic: 'Dayavittu bil kodi',
    context: 'Asking for the bill at the end of a meal.'
  },

  // 3. Transport & Directions
  {
    id: 't1',
    category: 'transport',
    categoryKn: 'ಸಾರಿಗೆ & ದಾರಿ',
    english: 'Where is the bus stand / railway station?',
    kannada: 'ಬಸ್ ನಿಲ್ದಾಣ / ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
    phonetic: 'Bas nildāna / Railway nildāna ellide?',
    context: 'Essential when navigating towns and transit hubs.'
  },
  {
    id: 't2',
    category: 'transport',
    categoryKn: 'ಸಾರಿಗೆ & ದಾರಿ',
    english: 'Does this bus go to Hampi / Mysore?',
    kannada: 'ಈ ಬಸ್ ಹಂಪಿಗೆ / ಮೈಸೂರಿಗೆ ಹೋಗುತ್ತಾ?',
    phonetic: 'Ee bas Hampige / Mysūrige hōguththeeyā?',
    context: 'Asking conductors at KSRTC platforms before boarding.'
  },
  {
    id: 't3',
    category: 'transport',
    categoryKn: 'ಸಾರಿಗೆ & ದಾರಿ',
    english: 'Please turn on the auto meter',
    kannada: 'ಮೀಟರ್ ಹಾಕಿ ಸರ್',
    phonetic: 'Mītar hāki sar',
    context: 'Polite standard request when hailing auto rickshaws.'
  },
  {
    id: 't4',
    category: 'transport',
    categoryKn: 'ಸಾರಿಗೆ & ದಾರಿ',
    english: 'How much fare to this location?',
    kannada: 'ಇಲ್ಲಿಗೆ ಎಷ್ಟು ಬಾಡಿಗೆ ಆಗುತ್ತೆ?',
    phonetic: 'Illige eshtu bādige āguththe?',
    context: 'Confirming taxi or auto rickshaw fare beforehand.'
  },
  {
    id: 't5',
    category: 'transport',
    categoryKn: 'ಸಾರಿಗೆ & ದಾರಿ',
    english: 'Please turn right / left',
    kannada: 'ಬಲಕ್ಕೆ / ಎಡಕ್ಕೆ ತಿರುಗಿ',
    phonetic: 'Balakke / Edakke thirugi',
    context: 'Guiding drivers on local streets or hill turns.'
  },
  {
    id: 't6',
    category: 'transport',
    categoryKn: 'ಸಾರಿಗೆ & ದಾರಿ',
    english: 'Go straight ahead',
    kannada: 'ನೇರವಾಗಿ ಹೋಗಿ',
    phonetic: 'Nēravāgi hōgi',
    context: 'Giving directions on main highways or bypasses.'
  },
  {
    id: 't7',
    category: 'transport',
    categoryKn: 'ಸಾರಿಗೆ & ದಾರಿ',
    english: 'Please stop here',
    kannada: 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ ದಯವಿಟ್ಟು',
    phonetic: 'Illi nillisi dayavittu',
    context: 'Telling driver to halt for scenic viewpoint or photo stop.'
  },
  {
    id: 't8',
    category: 'transport',
    categoryKn: 'ಸಾರಿಗೆ & ದಾರಿ',
    english: 'Is this road safe / open?',
    kannada: 'ಈ ರಸ್ತೆ ಚೆನ್ನಾಗಿದೆಯಾ / ತೆರೆದಿದೆಯಾ?',
    phonetic: 'Ee raste channāgideyā / theredideyā?',
    context: 'Vital when checking Western Ghat roads during monsoon.'
  },

  // 4. Emergencies & Safety
  {
    id: 'e1',
    category: 'emergencies',
    categoryKn: 'ತುರ್ತು & ಸಹಾಯ',
    english: 'Please help me',
    kannada: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ',
    phonetic: 'Dayavittu nanage sahāya mādi',
    context: 'Requesting urgent help from bystanders or staff.'
  },
  {
    id: 'e2',
    category: 'emergencies',
    categoryKn: 'ತುರ್ತು & ಸಹಾಯ',
    english: 'Where is the nearest hospital / clinic?',
    kannada: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ / ಕ್ಲಿನಿಕ್ ಎಲ್ಲಿದೆ?',
    phonetic: 'Hatthirada āspatre / klinik ellide?',
    context: 'Locating medical care in an emergency.'
  },
  {
    id: 'e3',
    category: 'emergencies',
    categoryKn: 'ತುರ್ತು & ಸಹಾಯ',
    english: 'Please call an ambulance (108)',
    kannada: 'ದಯವಿಟ್ಟು ಆಂಬ್ಯುಲೆನ್ಸ್ (108) ಕರೆಯಿರಿ',
    phonetic: 'Dayavittu ambulance (108) kareyiri',
    context: '108 is Karnataka state emergency ambulance toll-free hotline.'
  },
  {
    id: 'e4',
    category: 'emergencies',
    categoryKn: 'ತುರ್ತು & ಸಹಾಯ',
    english: 'Where is the police station? (112)',
    kannada: 'ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ? (112)',
    phonetic: 'Polīs thāne ellide?',
    context: '112 is the universal emergency response support number in Karnataka.'
  },
  {
    id: 'e5',
    category: 'emergencies',
    categoryKn: 'ತುರ್ತು & ಸಹಾಯ',
    english: 'I have lost my way',
    kannada: 'ನನಗೆ ದಾರಿ ತಪ್ಪಿದೆ',
    phonetic: 'Nanage dāri thappide',
    context: 'Use when navigating dense forests, heritage ruins, or trails.'
  },
  {
    id: 'e6',
    category: 'emergencies',
    categoryKn: 'ತುರ್ತು & ಸಹಾಯ',
    english: 'I need a doctor urgently',
    kannada: 'ನನಗೆ ತುರ್ತಾಗಿ ವೈದ್ಯರ ಅಗತ್ಯವಿದೆ',
    phonetic: 'Nanage thurtāgi vaidyara agathyavide',
    context: 'Seeking prompt medical attention.'
  },

  // 5. Shopping & Money
  {
    id: 's1',
    category: 'shopping',
    categoryKn: 'ಖರೀದಿ & ಹಣ',
    english: 'How much does this cost?',
    kannada: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು? / ಇದು ಎಷ್ಟು?',
    phonetic: 'Idara bele eshtu? / Idu eshtu?',
    context: 'Asking the price at spice markets, souvenir shops, and bazaars.'
  },
  {
    id: 's2',
    category: 'shopping',
    categoryKn: 'ಖರೀದಿ & ಹಣ',
    english: 'Please reduce the price a little bit',
    kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿಕೊಳ್ಳಿ',
    phonetic: 'Swalpa kadime mādikolli',
    context: 'Polite bargaining at street markets and handicrafts stalls.'
  },
  {
    id: 's3',
    category: 'shopping',
    categoryKn: 'ಖರೀದಿ & ಹಣ',
    english: 'Do you accept Google Pay / UPI?',
    kannada: 'ಗೂಗಲ್ ಪೇ / ಯುಪಿಐ (UPI) ಇದೆಯಾ?',
    phonetic: 'Google Pay / UPI ideyā?',
    context: 'Almost every street stall in Karnataka accepts QR code UPI payments.'
  },
  {
    id: 's4',
    category: 'shopping',
    categoryKn: 'ಖರೀದಿ & ಹಣ',
    english: 'Is this genuine Mysore silk / sandalwood?',
    kannada: 'ಇದು ಅಸಲಿ ಮೈಸೂರು ಸಿಲ್ಕ್ / ಶ್ರೀಗಂಧವೇ?',
    phonetic: 'Idu asali Mysūru silk / shrīgandhavē?',
    context: 'Checking authenticity at markets in Mysuru.'
  },
  {
    id: 's5',
    category: 'shopping',
    categoryKn: 'ಖರೀದಿ & ಹಣ',
    english: 'Where is the local market / bazaar?',
    kannada: 'ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಎಲ್ಲಿದೆ?',
    phonetic: 'Sthalīya mārukatte ellide?',
    context: 'Finding vibrant local produce and spice markets (e.g., Devaraja Market).'
  }
]
