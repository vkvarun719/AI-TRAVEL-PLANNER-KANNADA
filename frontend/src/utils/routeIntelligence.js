// Hyper-local Karnataka Route Intelligence
// Provides accurate road distance, drive duration, primary highways, transit options, and travel tips

export const POPULAR_DESTINATIONS = [
  { value: 'Coorg', en: 'Coorg (Madikeri)', kn: 'ಕೂರ್ಗ್ (ಮಡಿಕೇರಿ)', category: 'ghats' },
  { value: 'Hampi', en: 'Hampi (Vijayanagara)', kn: 'ಹಂಪಿ (ವಿಜಯನಗರ)', category: 'heritage' },
  { value: 'Gokarna', en: 'Gokarna', kn: 'ಗೋಕರ್ಣ', category: 'coastal' },
  { value: 'Chikmagalur', en: 'Chikmagalur', kn: 'ಚಿಕ್ಕಮಗಳೂರು', category: 'ghats' },
  { value: 'Mysore', en: 'Mysuru (Mysore)', kn: 'ಮೈಸೂರು', category: 'heritage' },
  { value: 'Badami', en: 'Badami - Pattadakal', kn: 'ಬಾದಾಮಿ - ಪಟ್ಟದಕಲ್ಲು', category: 'heritage' },
  { value: 'Dandeli', en: 'Dandeli', kn: 'ದಾಂಡೇಲಿ', category: 'adventure' },
  { value: 'Udupi', en: 'Udupi - Malpe', kn: 'ಉಡುಪಿ - ಮಲ್ಪೆ', category: 'coastal' },
  { value: 'Jog Falls', en: 'Jog Falls (Shivamogga)', kn: 'ಜೋಗ ಜಲಪಾತ (ಶಿವಮೊಗ್ಗ)', category: 'nature' },
  { value: 'Western Ghats', en: 'Western Ghats (Agumbe / Sakleshpur)', kn: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು', category: 'ghats' },
  { value: 'Belur', en: 'Belur & Halebidu', kn: 'ಬೇಲೂರು & ಹಳೇಬೀಡು', category: 'heritage' },
  { value: 'Mangalore', en: 'Mangaluru', kn: 'ಮಂಗಳೂರು', category: 'coastal' },
]

// Curated highway data & realistic transit intel
const ROUTE_CORRIDORS = {
  // From Bangalore
  'bangalore:coorg': {
    distanceKm: 265,
    driveTime: '5h 15m',
    highway: 'Bengaluru-Mysuru Expressway (NH 275) ➔ Hunsur ➔ Kushalnagar ➔ Madikeri',
    highwayKn: 'ಬೆಂಗಳೂರು-ಮೈಸೂರು ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ (NH 275) ➔ ಹುಣಸೂರು ➔ ಕುಶಾಲನಗರ ➔ ಮಡಿಕೇರಿ',
    bestTransit: 'KSRTC Airavat Club Class bus (every 45 mins from Satellite Bus Stand) or Train to Mysuru + Taxi.',
    bestTransitKn: 'ಸ್ಯಾಟಲೈಟ್ ಬಸ್ ನಿಲ್ದಾಣದಿಂದ ಪ್ರತಿ ೪೫ ನಿಮಿಷಕ್ಕೊಮ್ಮೆ KSRTC ಐರಾವತ ಬಸ್ ಅಥವಾ ಮೈಸೂರಿಗೆ ರೈಲು + ಕ್ಯಾಬ್.',
    transitTip: 'Start early by 6:00 AM to breeze past Bidadi tolls and enjoy a hot breakfast at Bidadi (Thatte Idli) or Maddur (Vada).',
    transitTipKn: 'ಬೆಳಗ್ಗೆ ೬:೦೦ ಗಂಟೆಗೆ ಹೊರಟರೆ ಟೋಲ್ ದಟ್ಟಣೆ ತಪ್ಪಿಸಬಹುದು ಮತ್ತು ಬಿದದಿಯಲ್ಲಿ ತಟ್ಟೆ ಇಡ್ಲಿ ಸವಿಯಬಹುದು.',
    roadStatus: 'Paved 6-lane expressway up to Mysuru; winding scenic 2-lane ghat road beyond Hunsur.',
    roadStatusKn: 'ಮೈಸೂರಿನವರೆಗೆ ೬ ಪಥದ ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ; ನಂತರ ರಮಣೀಯ ತಿರುವುಗಳ ೨ ಪಥದ ರಸ್ತೆ.'
  },
  'bangalore:hampi': {
    distanceKm: 345,
    driveTime: '6h 30m',
    highway: 'NH 48 (Tumakuru) ➔ NH 50 (Chitradurga ➔ Hosapete ➔ Hampi)',
    highwayKn: 'ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ೪೮ (ತುಮಕೂರು) ➔ NH ೫೦ (ಚಿತ್ರದುರ್ಗ ➔ ಹೊಸಪೇಟೆ ➔ ಹಂಪಿ)',
    bestTransit: 'Hampi Express Overnight Train (16592) or KSRTC Non-AC/AC Sleeper bus directly to Hosapete.',
    bestTransitKn: 'ಹಂಪಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರಾತ್ರಿ ರೈಲು (16592) ಅಥವಾ ಹೊಸಪೇಟೆಗೆ KSRTC ಸ್ಲೀಪರ್ ಬಸ್.',
    transitTip: 'Stop for a 1-hour detour at Chitradurga Fort (Kallina Kote / Onake Obavva Kindi) right off NH 50.',
    transitTipKn: 'ಹೆದ್ದಾರಿಯಲ್ಲಿ ಚಿತ್ರದುರ್ಗ ಕೋಟೆಗೆ (ಕಲ್ಲಿನ ಕೋಟೆ) ಭೇಟಿ ನೀಡಿ ಒನಕೆ ಓಬವ್ವ ಕಿಂಡಿ ವೀಕ್ಷಿಸಿ.',
    roadStatus: 'Excellent 4-lane national highway throughout until Hosapete. Smooth driving.',
    roadStatusKn: 'ಹೊಸಪೇಟೆಯವರೆಗೆ ೪ ಪಥದ ಅತ್ಯುತ್ತಮ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ.'
  },
  'bangalore:gokarna': {
    distanceKm: 485,
    driveTime: '9h 00m',
    highway: 'NH 48 (Tumakuru ➔ Chitradurga ➔ Haveri) ➔ Sirsi Ghat ➔ Kumta ➔ Gokarna',
    highwayKn: 'NH ೪೮ (ಚಿತ್ರದುರ್ಗ ➔ ಹಾವೇರಿ) ➔ ಶಿರಸಿ ಘಾಟ್ ➔ ಕುಮಟಾ ➔ ಗೋಕರ್ಣ',
    bestTransit: 'Panchaganga Express overnight train (16595) to Kumta / Gokarna Road or KSRTC Airavat Sleeper.',
    bestTransitKn: 'ಪಂಚಗಂಗಾ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (16595) ರಾತ್ರಿ ರೈಲು ಅಥವಾ KSRTC ಐರಾವತ ಸ್ಲೀಪರ್ ಬಸ್.',
    transitTip: 'Scenic descent through Sirsi forest ghat. Visit Marikamba Temple in Sirsi for a spiritual pitstop.',
    transitTipKn: 'ಶಿರಸಿ ದಟ್ಟ ಕಾಡಿನ ಘಾಟ್ ಮಾರ್ಗ. ಶಿರಸಿಯ ಮಾರಿಕಾಂಬಾ ದೇವಿ ದರ್ಶನ ಪಡೆಯಿರಿ.',
    roadStatus: 'Fast highway till Haveri; lush forest roads with winding hairpins near Sirsi.',
    roadStatusKn: 'ಹಾವೇರಿಯವರೆಗೆ ವೇಗದ ಹೆದ್ದಾರಿ; ಶಿರಸಿ ಬಳಿ ರಮಣೀಯ ಕಾಡಿನ ತಿರುವುಗಳು.'
  },
  'bangalore:chikmagalur': {
    distanceKm: 245,
    driveTime: '4h 45m',
    highway: 'NH 75 (Nelamangala ➔ Kunigal ➔ Hassan) ➔ Belur Road ➔ Chikmagalur',
    highwayKn: 'NH ೭೫ (ಕುಣಿಗಲ್ ➔ ಹಾಸನ) ➔ ಬೇಲೂರು ರಸ್ತೆ ➔ ಚಿಕ್ಕಮಗಳೂರು',
    bestTransit: 'KSRTC Non-stop Express from Majestic, or Jan Shatabdi / Intercity train to Hassan + KSRTC bus.',
    bestTransitKn: 'ಮೆಜೆಸ್ಟಿಕ್‌ನಿಂದ ನೇರ KSRTC ಬಸ್ಸುಗಳು ಅಥವಾ ಹಾಸನದವರೆಗೆ ರೈಲು + ಬಸ್.',
    transitTip: 'Enjoy coffee country pitstops. Combine this with the 12th-century Chennakeshava Temple at Belur on the way.',
    transitTipKn: 'ದಾರಿಯಲ್ಲಿ ಬೇಲೂರಿನ ಹೊಯ್ಸಳ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಶಿಲ್ಪಕಲೆ ಕಣ್ತುಂಬಿಕೊಳ್ಳಿ.',
    roadStatus: 'Superb 4-lane toll road till Hassan; smooth scenic 2-lane road to Chikmagalur.',
    roadStatusKn: 'ಹಾಸನದವರೆಗೆ ೪ ಪಥದ ಸುಗಮ ರಸ್ತೆ; ನಂತರ ಕಾಫಿ ತೋಟಗಳ ಸುಂದರ ಹಾದಿ.'
  },
  'bangalore:mysore': {
    distanceKm: 145,
    driveTime: '2h 15m',
    highway: 'Bengaluru-Mysuru Access-Controlled Expressway (NH 275)',
    highwayKn: 'ಬೆಂಗಳೂರು-ಮೈಸೂರು ೧೦-ಪಥದ ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ (NH 275)',
    bestTransit: 'Vande Bharat Express (2h), Shatabdi Express, or KSRTC Electric EV buses every 15 minutes.',
    bestTransitKn: 'ವಂದೇ ಭಾರತ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್, ಶತಾಬ್ದಿ ಅಥವಾ ಪ್ರತಿ ೧೫ ನಿಮಿಷಕ್ಕೆ KSRTC ಎಲೆಕ್ಟ್ರಿಕ್ (EV) ಬಸ್.',
    transitTip: 'Savor Maddur Tiffany Vada and Channapatna wooden toy workshops off the service road.',
    transitTipKn: 'ಚನ್ನಪಟ್ಟಣದ ಬಣ್ಣದ ಮರದ ಆಟಿಕೆ ಮಳಿಗೆಗಳು ಮತ್ತು ಮದ್ದೂರು ವಡೆ ಸವಿಯಿರಿ.',
    roadStatus: 'World-class 10-lane expressway. 100 km/h cruising speed limit.',
    roadStatusKn: 'ವಿಶ್ವದರ್ಜೆಯ ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ; ಗಂಟೆಗೆ ೧೦೦ ಕಿ.ಮೀ ವೇಗದ ಮಿತಿ.'
  },
  'bangalore:badami': {
    distanceKm: 450,
    driveTime: '8h 30m',
    highway: 'NH 48 (Tumakuru ➔ Chitradurga ➔ Davanagere ➔ Hubli) ➔ Gadag ➔ Badami',
    highwayKn: 'NH ೪೮ (ಚಿತ್ರದುರ್ಗ ➔ ದಾವಣಗೆರೆ ➔ ಹುಬ್ಬಳ್ಳಿ) ➔ ಗದಗ ➔ ಬಾದಾಮಿ',
    bestTransit: 'Gol Gumbaz Express (16535) overnight train directly to Badami Station, or KSRTC Sleeper.',
    bestTransitKn: 'ಗೋಲ್ ಗುಂಬಜ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ (16535) ರಾತ್ರಿ ರೈಲು ನೇರವಾಗಿ ಬಾದಾಮಿ ನಿಲ್ದಾಣಕ್ಕೆ.',
    transitTip: 'Stop at Davanagere for famous wood-fired Benne Dosa at Sri Guru Kottureshwara.',
    transitTipKn: 'ದಾವಣಗೆರೆಯಲ್ಲಿ ವಿಶ್ವಪ್ರಸಿದ್ಧ ಬೆಣ್ಣೆ ದೋಸೆ ಸವಿಯಲು ಮರೆಯದಿರಿ.',
    roadStatus: 'Excellent 6-lane highway till Hubli/Gadag bypass; rural state highway to Badami.',
    roadStatusKn: 'ಹುಬ್ಬಳ್ಳಿಯವರೆಗೆ ೬ ಪಥದ ಹೆದ್ದಾರಿ; ನಂತರ ಬಾದಾಮಿಗೆ ಸುಗಮ ರಾಜ್ಯ ಹೆದ್ದಾರಿ.'
  },
  'bangalore:dandeli': {
    distanceKm: 460,
    driveTime: '8h 45m',
    highway: 'NH 48 (Davanagere ➔ Hubli Bypass) ➔ Haliyal ➔ Dandeli Jungle Corridor',
    highwayKn: 'NH ೪೮ (ದಾವಣಗೆರೆ ➔ ಹುಬ್ಬಳ್ಳಿ ಬೈಪಾಸ್) ➔ ಹಳಿಯಾಳ ➔ ದಾಂಡೇಲಿ ಅರಣ್ಯ ಮಾರ್ಗ',
    bestTransit: 'Train to Alnavar (LWR) or Hubli (UBL) + 40-min taxi into Dandeli hornbill forests.',
    bestTransitKn: 'ಅಳ್ನಾವರ ಅಥವಾ ಹುಬ್ಬಳ್ಳಿಗೆ ರೈಲು + ದಾಂಡೇಲಿ ಕಾಡಿಗೆ ೪೦ ನಿಮಿಷಗಳ ಕ್ಯಾಬ್.',
    transitTip: 'Book Kali river white-water rafting and hornbill watching slots ahead during weekends.',
    transitTipKn: 'ಕಾಳಿ ನದಿಯ ರಿವರ್ ರಾಫ್ಟಿಂಗ್ ಮತ್ತು ಹಾರ್ನ್‌ಬಿಲ್ ವೀಕ್ಷಣೆಯನ್ನು ಮೊದಲೇ ಕಾಯ್ದಿರಿಸಿ.',
    roadStatus: 'Smooth national highway till Hubli; dense teak forest canopy roads to Dandeli.',
    roadStatusKn: 'ಹುಬ್ಬಳ್ಳಿಯವರೆಗೆ ಹೆದ್ದಾರಿ; ದಾಂಡೇಲಿಗೆ ತೇಗದ ಮರಗಳ ತಂಪಾದ ಹಸಿರು ಹಾದಿ.'
  },
  'bangalore:udupi': {
    distanceKm: 400,
    driveTime: '7h 45m',
    highway: 'NH 75 (Hassan ➔ Sakleshpur ➔ Shiradi Ghat) ➔ Mangalore ➔ NH 66 ➔ Udupi',
    highwayKn: 'NH ೭೫ (ಶಿರಾಡಿ ಘಾಟ್) ➔ ಮಂಗಳೂರು ➔ NH ೬೬ ಕರಾವಳಿ ಹೆದ್ದಾರಿ ➔ ಉಡುಪಿ',
    bestTransit: 'Panchaganga Express (16595) or KSRTC Airavat / Ambari Dream Class sleeper buses.',
    bestTransitKn: 'ಪಂಚಗಂಗಾ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರೈಲು ಅಥವಾ KSRTC ಅಂಬಾರಿ ಡ್ರೀಮ್ ಕ್ಲಾಸ್ ಸ್ಲೀಪರ್.',
    transitTip: 'Stop at Car Street in Udupi for Sri Krishna Temple darshan and authentic Mitra Samaj goli baje.',
    transitTipKn: 'ಉಡುಪಿಯ ಮಿತ್ರ ಸಮಾಜದಲ್ಲಿ ಬಿಸಿ ಗೋಳಿಬಜೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ ಸವಿಯಿರಿ.',
    roadStatus: 'Shiradi Ghat is scenic; coastal highway (NH 66) is modern 4-lane.',
    roadStatusKn: 'ಶಿರಾಡಿ ಘಾಟ್ ರಮಣೀಯ ಪರ್ವತ ಮಾರ್ಗ; ಕರಾವಳಿ ಹೆದ್ದಾರಿ ೪ ಪಥದ್ದಾಗಿದೆ.'
  },
  // From Mysore
  'mysore:coorg': {
    distanceKm: 120,
    driveTime: '2h 45m',
    highway: 'NH 275 (Hunsur ➔ Periyapatna ➔ Kushalnagar ➔ Madikeri)',
    highwayKn: 'NH ೨೭೫ (ಹುಣಸೂರು ➔ ಕುಶಾಲನಗರ ➔ ಮಡಿಕೇರಿ)',
    bestTransit: 'KSRTC regular buses leave every 20 minutes from Mysore Suburban Bus Stand.',
    bestTransitKn: 'ಮೈಸೂರು ಬಸ್ ನಿಲ್ದಾಣದಿಂದ ಪ್ರತಿ ೨೦ ನಿಮಿಷಕ್ಕೊಮ್ಮೆ KSRTC ಬಸ್ಸುಗಳು.',
    transitTip: 'Visit Namdroling Monastery (Tibetan Golden Temple) in Bylakuppe en route.',
    transitTipKn: 'ದಾರಿಯಲ್ಲಿ ಬೈಲುಕುಪ್ಪೆಯ ಟಿಬೆಟಿಯನ್ ಸುವರ್ಣ ದೇವಾಲಯಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
    roadStatus: 'Scenic coffee and spice plantation roads.',
    roadStatusKn: 'ಕಾಫಿ ತೋಟಗಳ ರಮಣೀಯ ಮತ್ತು ಹಸಿರು ರಸ್ತೆ.'
  },
  'mysore:chikmagalur': {
    distanceKm: 175,
    driveTime: '3h 45m',
    highway: 'SH 86 / NH 373 (K.R. Pet ➔ Channarayapatna ➔ Hassan ➔ Belur ➔ Chikmagalur)',
    highwayKn: 'ರಾಜ್ಯ ಹೆದ್ದಾರಿ ೮೬ / NH ೩೭೩ (ಹಾಸನ ➔ ಬೇಲೂರು ➔ ಚಿಕ್ಕಮಗಳೂರು)',
    bestTransit: 'Direct KSRTC buses or private cabs across the gentle Deccan plains.',
    bestTransitKn: 'ನೇರ KSRTC ಬಸ್ ಅಥವಾ ಖಾಸಗಿ ಕ್ಯಾಬ್ ಸೇವೆ.',
    transitTip: 'Stop at Shravanabelagola to climb the monolithic Gommateshwara statue hill.',
    transitTipKn: 'ಶ್ರವಣಬೆಳಗೊಳದ ಗೊಮ್ಮಟೇಶ್ವರ ಬೆಟ್ಟಕ್ಕೆ ಭೇಟಿ ನೀಡಬಹುದು.',
    roadStatus: 'Good 2-lane state highway with pastoral countryside views.',
    roadStatusKn: 'ಹಳ್ಳಿಗಳ ನಡುವಿನ ಸುಂದರ ದ್ವಿಪಥ ರಾಜ್ಯ ಹೆದ್ದಾರಿ.'
  },
  'mysore:hampi': {
    distanceKm: 420,
    driveTime: '8h 00m',
    highway: 'NH 150A (Srirangapatna ➔ Nagamangala ➔ Bellary) ➔ Hosapete',
    highwayKn: 'NH ೧೫೦A (ಶ್ರೀರಂಗಪಟ್ಟಣ ➔ ನಾಗಮಂಗಲ ➔ ಹೊಸಪೇಟೆ ➔ ಹಂಪಿ)',
    bestTransit: 'Direct KSRTC Rajahamsa bus or train to Hosapete via Bengaluru/Arsikere.',
    bestTransitKn: 'ನೇರ KSRTC ರಾಜಹಂಸ ಬಸ್ ಅಥವಾ ರೈಲು ಸೇವೆ.',
    transitTip: 'Passes through central Karnataka heartland. Great scenic countryside photography.',
    transitTipKn: 'ಮಧ್ಯ ಕರ್ನಾಟಕದ ರಮಣೀಯ ಗ್ರಾಮೀಣ ನೋಟಗಳು.',
    roadStatus: 'Mix of newly built 4-lane and well-surfaced 2-lane highway.',
    roadStatusKn: '೪ ಪಥ ಹಾಗೂ ಸುಗಮ ದ್ವಿಪಥ ಹೆದ್ದಾರಿಗಳ ಸಂಯೋಜನೆ.'
  },
  // From Mangalore
  'mangalore:gokarna': {
    distanceKm: 230,
    driveTime: '4h 15m',
    highway: 'Coastal Highway NH 66 (Udupi ➔ Kundapura ➔ Bhatkal ➔ Kumta ➔ Gokarna)',
    highwayKn: 'ಕರಾವಳಿ ಹೆದ್ದಾರಿ NH ೬೬ (ಉಡುಪಿ ➔ ಕುಂದಾಪುರ ➔ ಭಟ್ಕಳ ➔ ಕುಮಟಾ ➔ ಗೋಕರ್ಣ)',
    bestTransit: 'Coastal passenger trains (Matsyagandha / Netravati) or KSRTC express buses.',
    bestTransitKn: 'ಕರಾವಳಿ ರೈಲುಗಳು (ಮತ್ಸ್ಯಗಂಧ / ನೇತ್ರಾವತಿ) ಅಥವಾ KSRTC ಕರಾವಳಿ ಸಾರಿಗೆ.',
    transitTip: 'Stop at Maravanthe Beach where the Arabian Sea is on your left and Souparnika River on your right!',
    transitTipKn: 'ಮರವಂತೆ ಬೀಚ್‌ನಲ್ಲಿ ಎಡಕ್ಕೆ ಅರಬ್ಬೀ ಸಮುದ್ರ ಮತ್ತು ಬಲಕ್ಕೆ ಸೌಪರ್ಣಿಕಾ ನದಿಯ ಅದ್ಭುತ ನೋಟ ಕಣ್ತುಂಬಿಕೊಳ್ಳಿ!',
    roadStatus: 'Spectacular coastal 4-lane expressway right along the turquoise Arabian Sea.',
    roadStatusKn: 'ಸಮುದ್ರ ತೀರದ ಅತ್ಯಂತ ಸುಂದರ ೪ ಪಥದ ಕರಾವಳಿ ಹೆದ್ದಾರಿ.'
  },
  'mangalore:coorg': {
    distanceKm: 140,
    driveTime: '3h 30m',
    highway: 'NH 275 (Bantwal ➔ Puttur ➔ Sullia ➔ Sampaje Ghat ➔ Madikeri)',
    highwayKn: 'NH ೨೭೫ (ಬಂಟ್ವಾಳ ➔ ಪುತ್ತೂರು ➔ ಸುಳ್ಯ ➔ ಸಂಪಾಜೆ ಘಾಟ್ ➔ ಮಡಿಕೇರಿ)',
    bestTransit: 'Frequent KSRTC buses climb up the Sampaje Ghat from Mangalore KSRTC stand.',
    bestTransitKn: 'ಮಂಗಳೂರಿನಿಂದ ಸಂಪಾಜೆ ಘಾಟ್ ಮೂಲಕ ಆಗಾಗ್ಗೆ KSRTC ಬಸ್ಸುಗಳು.',
    transitTip: 'Sampaje Ghat is filled with betel-nut groves, rubber plantations, and mountain waterfalls.',
    transitTipKn: 'ಅಡಿಕೆ, ರಬ್ಬರ್ ತೋಟಗಳು ಹಾಗೂ ಜಲಪಾತಗಳಿಂದ ಕಂಗೊಳಿಸುವ ಸಂಪಾಜೆ ಘಾಟ್.',
    roadStatus: 'Lush mountain curves and fresh tar. Caution during heavy monsoon downpours.',
    roadStatusKn: 'ಹಸಿರು ಪರ್ವತದ ತಿರುವುಗಳು; ಮಳೆಗಾಲದಲ್ಲಿ ಎಚ್ಚರಿಕೆಯಿಂದ ಚಲಿಸಿ.'
  },
  'mangalore:udupi': {
    distanceKm: 55,
    driveTime: '1h 10m',
    highway: 'NH 66 Coastal Corridor (Surathkal ➔ Mulki ➔ Kaup ➔ Udupi)',
    highwayKn: 'NH ೬೬ ಕರಾವಳಿ ಕಾರಿಡಾರ್ (ಸೂರತ್ಕಲ್ ➔ ಮುಲ್ಕಿ ➔ ಕಾಪು ➔ ಉಡುಪಿ)',
    bestTransit: 'Express city & KSRTC buses every 5 minutes from Statebank / KSRTC terminal.',
    bestTransitKn: 'ಪ್ರತಿ ೫ ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಮಂಗಳೂರು-ಉಡುಪಿ ವೇಗದ ಬಸ್ಸುಗಳು.',
    transitTip: 'Climb the 120-year-old active black-and-white Kaup Lighthouse for 360-degree ocean views.',
    transitTipKn: 'ಕಾಪುವಿನ ಐತಿಹಾಸಿಕ ಲೈಟ್‌ಹೌಸ್ ಹತ್ತಿ ವಿಶಾಲ ಸಮುದ್ರದ ನೋಟ ಸವಿಯಿರಿ.',
    roadStatus: 'Smooth 4-lane coastal highway with ocean breeze.',
    roadStatusKn: 'ವೇಗದ ಮತ್ತು ಆಹ್ಲಾದಕರ ೪ ಪಥದ ಕರಾವಳಿ ಹೆದ್ದಾರಿ.'
  }
}

// Estimates distance & route details for any origin & destination pair in Karnataka
export function getRouteIntelligence(originName = 'Bangalore', destName = 'Coorg') {
  if (!originName || !destName) return null

  const originNorm = originName.toLowerCase().replace(/[^a-z]/g, '')
  const destNorm = destName.toLowerCase().replace(/[^a-z]/g, '')

  // 1. Direct match in curated corridors
  const key1 = `${originNorm}:${destNorm}`
  const key2 = `${destNorm}:${originNorm}`

  if (ROUTE_CORRIDORS[key1]) {
    return {
      from: originName,
      to: destName,
      ...ROUTE_CORRIDORS[key1]
    }
  }

  if (ROUTE_CORRIDORS[key2]) {
    return {
      from: originName,
      to: destName,
      ...ROUTE_CORRIDORS[key2]
    }
  }

  // 2. Fallback smart heuristic approximation for any other Karnataka destination
  const isSameCity = originNorm === destNorm
  if (isSameCity) {
    return {
      from: originName,
      to: destName,
      distanceKm: 35,
      driveTime: '1h 00m',
      highway: `Local Ring Roads & Sightseeing Arteries in and around ${destName}`,
      highwayKn: `${destName} ಸುತ್ತಮುತ್ತಲಿನ ಸ್ಥಳೀಯ ಪ್ರವಾಸಿ ರಸ್ತೆಗಳು`,
      bestTransit: 'Local auto-rickshaw, city bus, or rental scooter for local exploration.',
      bestTransitKn: 'ಸ್ಥಳೀಯ ಆಟೋ ರಿಕ್ಷಾ, ನಗರ ಸಾರಿಗೆ ಅಥವಾ ಬಾಡಿಗೆ ಸ್ಕೂಟರ್.',
      transitTip: 'Start early morning to beat city school and market traffic hours.',
      transitTipKn: 'ಬೆಳಗ್ಗೆ ಬೇಗನೆ ಹೊರಟು ಸ್ಥಳೀಯ ದಟ್ಟಣೆಯಿಂದ ತಪ್ಪಿಸಿಕೊಳ್ಳಿ.',
      roadStatus: 'City roads with frequent heritage stops and local dining spots.',
      roadStatusKn: 'ಸ್ಥಳೀಯ ಪ್ರವಾಸಿ ತಾಣಗಳು ಮತ್ತು ಹೋಟೆಲ್‌ಗಳ ನಡುವಿನ ಸುಗಮ ನಗರ ರಸ್ತೆ.'
    }
  }

  // Generic estimation across Karnataka districts (avg 220 km, 4.5 hrs)
  return {
    from: originName,
    to: destName,
    distanceKm: 280,
    driveTime: '5h 30m',
    highway: `Direct Karnataka State / National Highway corridor connecting ${originName} and ${destName}`,
    highwayKn: `${originName} ಮತ್ತು ${destName} ನಡುವಿನ ನೇರ ಹೆದ್ದಾರಿ ಕಾರಿಡಾರ್`,
    bestTransit: 'KSRTC Express bus service from central bus stand or scenic self-drive / cab.',
    bestTransitKn: 'ಕೇಂದ್ರ ಬಸ್ ನಿಲ್ದಾಣದಿಂದ KSRTC ಸಾರಿಗೆ ಬಸ್ ಅಥವಾ ಸುಂದರ ಕಾರ್ ಪ್ರಯಾಣ.',
    transitTip: `Check local morning bus schedules at the KSRTC bus stand for direct non-stop trips towards ${destName}.`,
    transitTipKn: `ನೇರ ಬಸ್ ಪ್ರಯಾಣಕ್ಕಾಗಿ ಸ್ಥಳೀಯ KSRTC ವೇಳಾಪಟ್ಟಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.`,
    roadStatus: 'Well-connected Karnataka highway with regional toll plazas and fuel pitstops.',
    roadStatusKn: 'ಉತ್ತಮ ಸಂಪರ್ಕ ಹೊಂದಿರುವ ಕರ್ನಾಟಕ ಹೆದ್ದಾರಿ ಮಾರ್ಗ.'
  }
}
