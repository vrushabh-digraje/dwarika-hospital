export const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "Koshi Province": [
    "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", 
    "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", 
    "Sunsari", "Taplejung", "Tehrathum", "Udayapur"
  ],
  "Madhesh Province": [
    "Bara", "Dhanusa", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"
  ],
  "Bagmati Province": [
    "Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", 
    "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"
  ],
  "Gandaki Province": [
    "Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", 
    "Myagdi", "Nawalpur", "Parbat", "Syangja", "Tanahun"
  ],
  "Lumbini Province": [
    "Arghakhanchi", "Banke", "Bardiya", "Dang", "Eastern Rukum", "Gulmi", 
    "Kapilavastu", "Parasi", "Palpa", "Pyuthan", "Rolpa", "Rupandehi"
  ],
  "Karnali Province": [
    "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Salyan", "Surkhet", "Western Rukum"
  ],
  "Sudurpashchim Province": [
    "Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", "Kailali", "Kanchanpur"
  ],
};

export const MUNICIPALITIES_BY_DISTRICT: Record<string, string[]> = {
  "Kathmandu": ["Kathmandu Metropolitan City", "Kirtipur Municipality", "Budhanilkantha Municipality", "Gokarneshwor Municipality", "Tokha Municipality", "Tarakeshwar Municipality", "Nagarjun Municipality", "Chandragiri Municipality", "Dakshinkali Municipality", "Shankharapur Municipality", "Kageshwori Manohara Municipality"],
  "Lalitpur": ["Lalitpur Metropolitan City", "Mahalaxmi Municipality", "Godawari Municipality", "Konjyosom Rural Municipality", "Bagmati Rural Municipality", "Mahankal Rural Municipality"],
  "Bhaktapur": ["Bhaktapur Municipality", "Madhyapur Thimi Municipality", "Changunarayan Municipality", "Suryabinayak Municipality"],
  "Kaski": ["Pokhara Metropolitan City", "Annapurna Rural Municipality", "Machhapuchchhre Rural Municipality", "Madi Rural Municipality", "Rupa Rural Municipality"],
  "Chitwan": ["Bharatpur Metropolitan City", "Ratnanagar Municipality", "Khairahani Municipality", "Rapti Municipality", "Kalika Municipality", "Madi Municipality", "Ichchhakamana Rural Municipality"],
  "Morang": ["Biratnagar Metropolitan City", "Belbari Municipality", "Letang Municipality", "Pathari Sanischare Municipality", "Rangeli Municipality", "Ratuwamai Municipality", "Sunawarshi Municipality", "Urlabari Municipality"],
  "Sunsari": ["Itahari Sub-Metropolitan City", "Dharan Sub-Metropolitan City", "Inaruwa Municipality", "Duhabi Municipality", "Ramdhuni Municipality", "Barahachhetra Municipality"],
  "Jhapa": ["Birtamod Municipality", "Damak Municipality", "Bhadrapur Municipality", "Mechinagar Municipality", "Arjundhara Municipality", "Kankai Municipality", "Shivasatakshi Municipality", "Gauradaha Municipality"],
  "Dhanusa": ["Janakpur Sub-Metropolitan City", "Ganeshman Charnath Municipality", "Dhanusadham Municipality", "Dhanauji Rural Municipality"],
  "Rupandehi": ["Butwal Sub-Metropolitan City", "Siddharthanagar Municipality", "Tilottama Municipality", "Lumbini Sanskritik Municipality", "Devdaha Municipality", "Sainamaina Municipality"],
  "Banke": ["Nepalgunj Sub-Metropolitan City", "Kohalpur Municipality", "Khajura Rural Municipality"],
  "Dang": ["Ghorahi Sub-Metropolitan City", "Tulsipur Sub-Metropolitan City", "Lamahi Municipality"],
  "Surkhet": ["Birendranagar Municipality", "Gurbhakot Municipality", "Panchapuri Municipality", "Bheri Ganga Municipality"],
  "Kailali": ["Dhangadhi Metropolitan City", "Tikapur Municipality", "Ghoghoda Municipality", "Lamki Chuha Municipality"],
  // Default for other districts
  "Other": ["Municipality 1", "Municipality 2", "Rural Municipality 1"]
};

export const GET_MUNICIPALITIES = (district: string) => {
  return MUNICIPALITIES_BY_DISTRICT[district] || [`${district} Municipality`, `${district} Rural Municipality`, "Other Local Level"];
};

export const MUNICIPALITY_TYPES = [
  "Metropolitan City",
  "Sub-Metropolitan City",
  "Municipality",
  "Rural Municipality",
];

export const WARDS = Array.from({ length: 32 }, (_, i) => (i + 1).toString());

export const COMMON_VILLAGES = [
  "Kalyanpur",
  "Baluwatar",
  "Koteshwor",
  "Baneshwor",
  "Jhamsikhel",
  "Patan",
  "Sanepa",
  "Lalitpur",
  "Bhaktapur",
  "Thimi",
  "Other"
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const RELIGIONS = ["Hinduism", "Buddhism", "Islam", "Christianity", "Kirat", "Christian", "Sikhism", "Jainism", "Other"];

export const USER_TYPES = [
  "STUDENT",
  "EMPLOYEE",
  "DOCTOR",
  "PHARMACIST",
  "HA",
  "STAFF NURSE",
  "ANM",
  "CMA",
  "LAB ASSISTANT",
  "OTHER"
];

export const CASTE_GROUPS = [
  "Dalit",
  "Janajati",
  "Madhesi",
  "Muslim",
  "Brahman/Chhetri",
  "Others"
];

export const CASTES_BY_GROUP: Record<string, string[]> = {
  "Dalit": [
    "Biswokarma", "Pariyar", "Sarki", "Gandharwa", "Badi",
    "Kalar", "Kakahiya", "Kori", "Khatik", "Kathwe", "Chamar",
    "Chidimar", "Dom", "Tatma", "Dushad", "Dhobi", "Pattharkatta",
    "Pasi", "Batar", "Mushahar", "Mestar", "Sarbhanga", "Sonar",
    "Lohar", "Natuwa"
  ],
  "Janajati": [
    "Sherpa", "Bhote", "Thakali", "Byansi", "Wallung", "Chhairotan",
    "Dolpo", "Tangbe", "Tin Gaule Thakali", "Topkegola", "Bara Gaunle Thakali",
    "Marphali Thakali", "Mugali", "Lhopa", "Ihomi", "Siyar", "Thudam",
    "Magar", "Tamang", "Newar", "Rai", "Gurung", "Limbu", "Bhujel",
    "Sunuwar", "Chepang", "Thami", "Yakkha", "Pahari", "Kusunda", "Jirel",
    "Dura", "Lepcha", "Hayu", "Yehlmo", "Kushbadia", "Phree", "Bankaria",
    "Baramo", "Larke", "Surel", "Kumal", "Majhi", "Danuwar", "Darai", "Bote",
    "Raji", "Raute", "Tharu", "Dhanuk", "Rajbanshi", "Satar", "Jhagar", "Gangai",
    "Dhimal", "Tajpuriya", "Meche", "Kisan"
  ],
  "Madhesi": [
    "Yadav", "Teli", "Kalwar", "Sudhi", "Koiri", "Kurmi", "Kanu", "Haluwai",
    "Hajam", "Badhaee", "Rajbhar", "Kewat", "Mallah", "Nuniya", "Kumhar",
    "Kahar", "Lodha", "Binna", "Gaderi", "Mali", "Kamar", "Dhiniya", "Baraee",
    "Munda", "Badai", "Panjabi", "Bangali", "Marwadi", "Nurang", "Kayastha",
    "Rajput", "Jaine", "Brahman (Terai)", "Baniya", "Amat", "Kathawaniya",
    "Rajdhob", "Kushbaha"
  ],
  "Muslim": ["Muslim", "Churaute"],
  "Brahman/Chhetri": ["Brahman (Hill)", "Chhetri (Hill)"],
  "Others": ["Thakuri", "Sanyasi/Dasnami"]
};
