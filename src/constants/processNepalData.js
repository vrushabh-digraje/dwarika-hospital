
const districts = [
  { district_id: 1, name: "Kaski", province_id: 4 },
  { district_id: 2, name: "Chitwan", province_id: 3 },
  { district_id: 3, name: "Parsa", province_id: 2 },
  { district_id: 4, name: "Morang", province_id: 1 },
  { district_id: 5, name: "Kathmandu", province_id: 3 },
  { district_id: 6, name: "Lalitpur", province_id: 3 },
  { district_id: 7, name: "Dang", province_id: 5 },
  { district_id: 8, name: "Bara", province_id: 2 },
  { district_id: 9, name: "Kailali", province_id: 7 },
  { district_id: 10, name: "Makwanpur", province_id: 3 },
  { district_id: 11, name: "Sunsari", province_id: 1 },
  { district_id: 12, name: "Rupandehi", province_id: 5 },
  { district_id: 13, name: "Humla", province_id: 6 },
  { district_id: 14, name: "Banke", province_id: 5 },
  { district_id: 15, name: "Taplejung", province_id: 1 },
  { district_id: 16, name: "Sankhuwasabha", province_id: 1 },
  { district_id: 17, name: "Solukhumbu", province_id: 1 },
  { district_id: 18, name: "Okhaldhunga", province_id: 1 },
  { district_id: 19, name: "Khotang", province_id: 1 },
  { district_id: 20, name: "Bhojpur", province_id: 1 },
  { district_id: 21, name: "Dhankuta", province_id: 1 },
  { district_id: 22, name: "Terhathum", province_id: 1 },
  { district_id: 23, name: "Pachthar", province_id: 1 },
  { district_id: 24, name: "Ilam", province_id: 1 },
  { district_id: 25, name: "Jhapa", province_id: 1 },
  { district_id: 26, name: "Udayapur", province_id: 1 },
  { district_id: 27, name: "Saptari", province_id: 2 },
  { district_id: 28, name: "Siraha", province_id: 2 },
  { district_id: 29, name: "Dhanusha", province_id: 2 },
  { district_id: 30, name: "Mahottari", province_id: 2 },
  { district_id: 31, name: "Sarlahi", province_id: 2 },
  { district_id: 32, name: "Rautahat", province_id: 2 },
  { district_id: 33, name: "Dolakha", province_id: 3 },
  { district_id: 34, name: "Sindhupalchok", province_id: 3 },
  { district_id: 35, name: "Dhading", province_id: 3 },
  { district_id: 36, name: "Nuwakot", province_id: 3 },
  { district_id: 37, name: "Bhaktapur", province_id: 3 },
  { district_id: 38, name: "Kavrepalanchok", province_id: 3 },
  { district_id: 39, name: "Ramechhap", province_id: 3 },
  { district_id: 40, name: "Sindhuli", province_id: 3 },
  { district_id: 41, name: "Gorkha", province_id: 4 },
  { district_id: 42, name: "Myagdi", province_id: 4 },
  { district_id: 43, name: "Lamjung", province_id: 4 },
  { district_id: 44, name: "Tanahu", province_id: 4 },
  { district_id: 45, name: "Nawalparari East", province_id: 4 },
  { district_id: 46, name: "Syangja", province_id: 4 },
  { district_id: 47, name: "Parbat", province_id: 4 },
  { district_id: 48, name: "Baglung", province_id: 4 },
  { district_id: 49, name: "Rolpa", province_id: 5 },
  { district_id: 50, name: "Pyuthan", province_id: 5 },
  { district_id: 51, name: "Gulmi", province_id: 5 },
  { district_id: 52, name: "Arghakhanchi", province_id: 5 },
  { district_id: 53, name: "Palpa", province_id: 5 },
  { district_id: 54, name: "Nawalparasi West", province_id: 5 },
  { district_id: 55, name: "Kapilbastu", province_id: 5 },
  { district_id: 56, name: "Bardiya", province_id: 5 },
  { district_id: 57, name: "Dolpa", province_id: 6 },
  { district_id: 58, name: "Mugu", province_id: 6 },
  { district_id: 59, name: "Jumla", province_id: 6 },
  { district_id: 60, name: "Kalikot", province_id: 6 },
  { district_id: 61, name: "Dailekh", province_id: 6 },
  { district_id: 62, name: "Jajarkot", province_id: 6 },
  { district_id: 63, name: "Rukum West", province_id: 6 },
  { district_id: 64, name: "Salyan", province_id: 6 },
  { district_id: 65, name: "Surkhet", province_id: 6 },
  { district_id: 66, name: "Bajura", province_id: 7 },
  { district_id: 67, name: "Bajhang", province_id: 7 },
  { district_id: 68, name: "Darchula", province_id: 7 },
  { district_id: 69, name: "Baitadi", province_id: 7 },
  { district_id: 70, name: "Dadeldhura", province_id: 7 },
  { district_id: 71, name: "Doti", province_id: 7 },
  { district_id: 72, name: "Achham", province_id: 7 },
  { district_id: 73, name: "Kanchanpur", province_id: 7 },
  { district_id: 74, name: "Rasuwa", province_id: 3 },
  { district_id: 75, name: "Manang", province_id: 4 },
  { district_id: 76, name: "Mustang", province_id: 4 },
  { district_id: 77, name: "Rukum East", province_id: 5 }
];

const provinceNames = {
  1: "Koshi Province",
  2: "Madhesh Province",
  3: "Bagmati Province",
  4: "Gandaki Province",
  5: "Lumbini Province",
  6: "Karnali Province",
  7: "Sudurpashchim Province"
};

const fs = require('fs');
const localLevels = JSON.parse(fs.readFileSync('/Users/chinmaypradeepwagh/.gemini/antigravity/brain/cf9c92e6-c2d9-4d39-abbf-4e61ffadf5ac/.system_generated/steps/139/content.md', 'utf8').split('---')[1]);

const districtsByProvince = {};
const municipalitiesByDistrict = {};

districts.forEach(d => {
  const pName = provinceNames[d.province_id];
  if (!districtsByProvince[pName]) districtsByProvince[pName] = [];
  districtsByProvince[pName].push(d.name);
  
  municipalitiesByDistrict[d.name] = localLevels
    .filter(ll => ll.district_id === d.district_id)
    .map(ll => ll.name);
});

const output = `
export const PROVINCES = ${JSON.stringify(Object.values(provinceNames), null, 2)};

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = ${JSON.stringify(districtsByProvince, null, 2)};

export const MUNICIPALITIES_BY_DISTRICT: Record<string, string[]> = ${JSON.stringify(municipalitiesByDistrict, null, 2)};

export const GET_MUNICIPALITIES = (district: string) => {
  return MUNICIPALITIES_BY_DISTRICT[district] || [\`\${district} Municipality\`, \`\${district} Rural Municipality\`, "Other Local Level"];
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
`;

fs.writeFileSync('/Users/chinmaypradeepwagh/Desktop/hospital-website-main/src/constants/nepalData.ts', output);
