export const PROVINCES = [
  "Koshi Pradesh",
  "Madhesh Pradesh",
  "Bagmati Pradesh",
  "Gandaki Pradesh",
  "Lumbini Pradesh",
  "Karnali Pradesh",
  "Sudurpashchim Pradesh"
];

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "Koshi Pradesh": [
    "Taplejung", "Sankhuwasabha", "Solukhumbu", "Okhaldhunga", "Khotang", 
    "Bhojpur", "Dhankuta", "Terhathum", "Pachthar", "Ilam", "Jhapa", 
    "Morang", "Sunsari", "Udayapur"
  ],
  "Madhesh Pradesh": [
    "Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi", "Rautahat", "Bara", "Parsa"
  ],
  "Bagmati Pradesh": [
    "Dolakha", "Sindhupalchok", "Dhading", "Nuwakot", "Bhaktapur", "Kavrepalanchok", 
    "Ramechhap", "Sindhuli", "Kathmandu", "Lalitpur", "Makwanpur", "Rasuwa", "Chitwan"
  ],
  "Gandaki Pradesh": [
    "Gorkha", "Myagdi", "Lamjung", "Tanahu", "Nawalparari East", "Syangja", 
    "Parbat", "Baglung", "Kaski", "Manang", "Mustang"
  ],
  "Lumbini Pradesh": [
    "Rolpa", "Pyuthan", "Gulmi", "Arghakhanchi", "Palpa", "Nawalparasi West", 
    "Kapilbastu", "Bardiya", "Dang", "Rupandehi", "Banke", "Rukum East"
  ],
  "Karnali Pradesh": [
    "Dolpa", "Mugu", "Jumla", "Kalikot", "Dailekh", "Jajarkot", "Rukum West", 
    "Salyan", "Surkhet", "Humla"
  ],
  "Sudurpashchim Pradesh": [
    "Bajura", "Bajhang", "Darchula", "Baitadi", "Dadeldhura", "Doti", 
    "Achham", "Kanchanpur", "Kailali"
  ]
};

export const MUNICIPALITIES_BY_DISTRICT: Record<string, string[]> = {
  "Kaski": ["Pokhara", "Rupa", "Madi", "Annapurna", "Machhapuchchhre"],
  "Chitwan": ["Bharatpur", "Kalika", "Khairahani", "Madi", "Rapti", "Ratnanagar", "Ichchhyakamana"],
  "Parsa": ["Birgunj", "Bahudaramai", "Pokhariya", "Parsagadhi", "Thori", "Dhobini", "Chhipaharmai", "Jirabhawani", "Jagarnathpur", "Kalikamai", "Bindabasini", "Pakaha mainpur", "Sakhuwa Prasauni", "Paterwa sugauli"],
  "Morang": ["Biratnagar", "Letang", "Sunwarshi", "Rangeli", "Pathari Shanishchare", "Uralabari", "Belbari", "Sundarharaicha", "Ratuwamai", "Jahada", "Katahari", "Gramthan", "Dhanpalthan", "Kerabari", "Budhiganga", "Kanepokhari", "Miklajung"],
  "Kathmandu": ["Kathmandu", "Kirtipur", "Shankharapur", "Nagarjun", "Kageshwori Manohara", "Dakshinkali", "Budhanilakantha", "Tarakeshwor", "Tokha", "Chandragiri", "Gokarneshwor"],
  "Lalitpur": ["Lalitpur", "Mahalaxmi", "Godawari", "Bagmati", "Mahankal", "Konjyosom"],
  "Dang": ["Ghorahi", "Tulsipur", "Lamahi", "Babai", "Gadhawa", "Rapti", "Rajpur", "Dangisharan", "Shantinagar", "Banglachuli"],
  "Bara": ["Jitpursimara", "Kalaiya", "Pacharauta", "Nijgadh", "Simraungadh", "Mahagadhimai", "Kolhabi", "Pheta", "Devtal", "Prasauni", "Suwarna", "Baragadhi", "Karaiyamai", "Parwanipur", "Bishrampur", "Adarsh kotwal"],
  "Kailali": ["Dhangadhi", "Tikapur", "Ghodaghodi", "Bhajani", "Gauriganga", "Godawari", "Lamkichuha", "Chure", "Janaki", "Kailari", "Joshipur", "Mohanyal", "Bardagoriya"],
  "Makwanpur": ["Hetauda", "Thaha", "Bakaiya", "Kailash", "Manahari", "Bhimphedi", "Bagmati", "Raksirang", "Makawanpurgadhi", "Indrasarowar"],
  "Sunsari": ["Dharan", "Itahari", "Ramdhuni", "Barahchhetra", "Duhabi", "Inaruwa", "Gadhi", "Koshi", "Barju", "Harinagar", "Dewanganj", "Bhokraha Narsing"],
  "Rupandehi": ["Butwal", "Lumbini Sanskritik", "Devdaha", "Sainamaina", "Siddharthanagar", "Tillotama", "Kanchan", "Siyari", "Rohini", "Gaidahawa", "Omsatiya", "Sudhdhodhan", "Mayadevi", "Marchawari", "Kotahimai", "Sammarimai"],
  "Humla": ["Simkot", "Namkha", "Chankheli", "Tanjakot", "Sarkegad", "Adanchuli", "Kharpunath"],
  "Banke": ["Nepalgunj", "Kohalpur", "Khajura", "Janki", "Baijanath", "Duduwa", "Narainapur", "Rapti Sonari"],
  "Taplejung": ["Phungling", "Sidingba", "Meringden", "Maiwakhola", "Phaktanglung", "Sirijangha", "Mikwakhola", "Aathrai Tribeni", "Pathivara Yangwarak"],
  "Sankhuwasabha": ["Dharmadevi", "Madi", "Panchakhapan", "Chainpur", "Khandbari", "Makalu", "Chichila", "Silichong", "Bhotkhola", "Sabhapokhari"],
  "Solukhumbu": ["Solududhakunda", "Sotang", "Mahakulung", "Likhupike", "Nechasalyan", "Thulung Dudhkoshi", "Maapya Dudhkoshi", "Khumbupasanglahmu"],
  "Okhaldhunga": ["Siddhicharan", "Likhu", "Molung", "Sunkoshi", "Champadevi", "Chisankhugadhi", "Khijidemba", "Manebhanjyang"],
  "Khotang": ["Halesi Tuwachung", "Diktel Rupakot Majhuwagadhi", "Sakela", "Khotehang", "Barahapokhari", "Ainselukhark", "Rawa Besi", "Kepilasagadhi", "Jantedhunga", "Diprung"],
  "Bhojpur": ["Shadananda", "Bhojpur", "Arun", "Aamchowk", "Hatuwagadhi", "Pauwadungma", "Temkemaiyung", "Salpasilichho", "Ramprasad"],
  "Dhankuta": ["Pakhribas", "Mahalaxmi", "Dhankuta", "Chaubise", "Shahidbhumi", "Sangurigadhi", "Chhathar Jorpati"],
  "Terhathum": ["Laligurans", "Myanglung", "Chhathar", "Phedap", "Aathrai", "Menchayam"],
  "Pachthar": ["Phidim", "Yangwarak", "Hilihang", "Falelung", "Tumbewa", "Kummayak", "Miklajung", "Falgunanda"],
  "Ilam": ["Illam", "Mai", "Deumai", "Suryodaya", "Rong", "Mangsebung", "Chulachuli", "Sandakpur", "Fakphokthum", "Maijogmai"],
  "Jhapa": ["Shivasataxi", "Bhadrapur", "Kankai", "Birtamod", "Mechinagar", "Damak", "Arjundhara", "Gauradhaha", "Kamal", "Jhapa", "Kachankawal", "Gauriganj", "Barhadashi", "Haldibari", "Buddhashanti"],
  "Udayapur": ["Triyuga", "Katari", "Chaudandigadhi", "Belaka", "Tapli", "Rautamai", "Udayapurgadhi", "Limchungbung"],
  "Saptari": ["Hanumannagar Kankalini", "Kanchanrup", "Rajbiraj", "Khadak", "Dakneshwori", "Saptakoshi", "Surunga", "Shambhunath", "Bode Barsain", "Rajgadh", "Rupani", "Tirahut", "Mahadeva", "Bishnupur", "Chhinnamasta", "Balan Bihul", "Tilathi Koiladi", "Agnisair Krishna Savaran"],
  "Siraha": ["Mirchaiya", "Lahan", "Siraha", "Dhangadhimai", "Kalyanpur", "Karjanha", "Golbazar", "Sukhipur", "Aurahi", "Naraha", "Arnama", "Bhagawanpur", "Nawarajpur", "Bishnupur", "Bariyarpatti", "Laxmipur Patari", "Sakhuwanankarkatti"],
  "Dhanusha": ["Janakpurdham", "Mithila Bihari", "Nagarain", "Ganeshman Charnath", "Mithila", "Dhanusadham", "Bideha", "Sabaila", "Kamala", "Hansapur", "Sahidnagar", "Chhireshwarnath", "Aaurahi", "Dhanauji", "Bateshwor", "Janaknandani", "Lakshminiya", "Mukhiyapatti Musarmiya"],
  "Mahottari": ["Gaushala", "Ramgopalpur", "Aurahi", "Bardibas", "Bhangaha", "Jaleswor", "Balwa", "Manra Siswa", "Matihani", "Loharpatti", "Pipra", "Sonama", "Samsi", "Ekdanra", "Mahottari"],
  "Sarlahi": ["Barahathawa", "Haripur", "Ishworpur", "Lalbandi", "Malangawa", "Kabilasi", "Bagmati", "Hariwan", "Balara", "Haripurwa", "Godaita", "Dhankaul", "Parsa", "Bishnu", "Ramnagar", "Kaudena", "Basbariya", "Chandranagar", "Chakraghatta", "Bramhapuri"],
  "Rautahat": ["Katahariya", "Maulapur", "Madhav Narayan", "Gaur", "Gujara", "Garuda", "Ishanath", "Chandrapur", "Dewahi Gonahi", "Brindaban", "Rajpur", "Rajdevi", "Gadhimai", "Phatuwa Bijayapur", "Baudhimai", "Paroha", "Yemunamai", "Durga Bhagwati"],
  "Dolakha": ["Jiri", "Bhimeshwor", "Bigu", "Sailung", "Melung", "Baiteshwor", "Tamakoshi", "Gaurishankar", "Kalinchok"],
  "Sindhupalchok": ["Chautara SangachokGadhi", "Barhabise", "Melamchi", "Jugal", "Balefi", "Sunkoshi", "Helambu", "Bhotekoshi", "Lisangkhu", "Indrawati", "Tripurasundari", "Panchpokhari Thangpal"],
  "Dhading": ["Nilakantha", "Dhunibesi", "Gajuri", "Galchi", "Thakre", "Siddhalek", "Khaniyabash", "Jwalamukhi", "Gangajamuna", "Rubi Valley", "Tripura Sundari", "Netrawati Dabjong", "Benighat Rorang"],
  "Nuwakot": ["Belkotgadhi", "Bidur", "Kakani", "Tadi", "Likhu", "Myagang", "Shivapuri", "Kispang", "Suryagadhi", "Tarkeshwar", "Panchakanya", "Dupcheshwar"],
  "Bhaktapur": ["Changunarayan", "Suryabinayak", "Bhaktapur", "Madhyapur Thimi"],
  "Kavrepalanchok": ["Banepa", "Mandandeupur", "Dhulikhel", "Panauti", "Namobuddha", "Panchkhal", "Roshi", "Temal", "Bhumlu", "Mahabharat", "Bethanchowk", "Khanikhola", "Chaurideurali"],
  "Ramechhap": ["Manthali", "Ramechhap", "Sunapati", "Doramba", "Umakunda", "Khadadevi", "Gokulganga", "Likhu Tamakoshi"],
  "Sindhuli": ["Dudhouli", "Kamalamai", "Marin", "Phikkal", "Tinpatan", "Sunkoshi", "Golanjor", "Ghanglekh", "Hariharpurgadhi"],
  "Gorkha": ["Palungtar", "Gorkha", "Gandaki", "Dharche", "Aarughat", "Ajirkot", "Sahid Lakhan", "Siranchok", "Bhimsenthapa", "Chum Nubri", "Barpak Sulikot"],
  "Myagdi": ["Beni", "Mangala", "Malika", "Raghuganga", "Dhaulagiri", "Annapurna"],
  "Lamjung": ["Sundarbazar", "Besishahar", "Rainas", "MadhyaNepal", "Dordi", "Dudhpokhari", "Marsyangdi", "Kwholasothar"],
  "Tanahu": ["Byas", "Shuklagandaki", "Bhimad", "Bhanu", "Ghiring", "Devghat", "Rhishing", "Myagde", "Bandipur", "Anbukhaireni"],
  "Nawalparari East": ["Madhyabindu", "Devchuli", "Gaidakot", "Kawasoti", "Baudeekali", "Bulingtar", "Hupsekot", "Binayee"],
  "Syangja": ["Putalibazar", "Bhirkot", "Galyang", "Chapakot", "Waling", "Harinas", "Biruwa", "Aandhikhola", "Phedikhola", "Kaligandagi", "Arjunchaupari"],
  "Parbat": ["Kushma", "Phalebas", "Modi", "Painyu", "Jaljala", "Bihadi", "Mahashila"],
  "Baglung": ["Jaimuni", "Baglung", "Galkot", "Dhorpatan", "Bareng", "Badigad", "Nisikhola", "Kanthekhola", "Tara Khola", "Taman Khola"],
  "Rolpa": ["Rolpa", "Madi", "Thawang", "Sunchhahari", "Lungri", "Gangadev", "Tribeni", "Pariwartan", "Runtigadi", "Sunil Smriti"],
  "Pyuthan": ["Pyuthan", "Sworgadwary", "Ayirabat", "Gaumukhi", "Jhimruk", "Naubahini", "Mandavi", "Mallarani", "Sarumarani"],
  "Gulmi": ["Resunga", "Musikot", "Ruru", "Isma", "Madane", "Malika", "Chatrakot", "Satyawati", "Chandrakot", "Kaligandaki", "Gulmidarbar"],
  "Arghakhanchi": ["Bhumekasthan", "Sitganga", "Sandhikharka", "Panini", "Chhatradev", "Malarani"],
  "Palpa": ["Tansen", "Rampur", "Rambha", "Tinau", "Nisdi", "Mathagadhi", "Ribdikot", "Purbakhola", "Bagnaskali", "Rainadevi"],
  "Nawalparasi West": ["Bardaghat", "Sunwal", "Ramgram", "Sarawal", "Susta", "Pratappur", "Palhi Nandan"],
  "Kapilbastu": ["Shivaraj", "Kapilbastu", "Buddhabhumi", "Maharajgunj", "Banganga", "Krishnanagar", "Yashodhara", "Bijayanagar", "Mayadevi", "Suddhodhan"],
  "Bardiya": ["Thakurbaba", "Bansagadhi", "Barbardiya", "Rajapur", "Madhuwan", "Gulariya", "Geruwa", "Badhaiyatal"],
  "Dolpa": ["Kaike", "Jagadulla", "Mudkechula", "Dolpo Buddha", "Shey Phoksundo", "Chharka Tangsong"],
  "Mugu": ["Chhayanath Rara", "Soru", "Khatyad", "Mugum Karmarong"],
  "Jumla": ["Chandannath", "Hima", "Tila", "Sinja", "Guthichaur", "Tatopani", "Patrasi", "Kanakasundari"],
  "Kalikot": ["Khandachakra", "Raskot", "Tilagufa", "Mahawai", "Palata", "Naraharinath", "Pachaljharana", "Subha Kalika", "Sanni Tribeni"],
  "Dailekh": ["Aathabis", "Dullu", "Chamunda Bindrasaini", "Narayan", "Bhairabi", "Mahabu", "Gurans", "Naumule", "Bhagawatimai", "Thantikandh", "Dungeshwor"],
  "Jajarkot": ["Nalagad", "Bheri", "Chhedagad", "Kuse", "Shiwalaya", "Barekot", "Junichande"],
  "Rukum West": ["Aathbiskot", "Chaurjahari", "Musikot", "Tribeni", "Sani Bheri", "Banfikot"],
  "Salyan": ["Sharada", "Bangad", "Bagchaur", "Kumakh", "Darma", "Kapurkot", "Kalimati", "Tribeni", "Chhatreshwori", "Siddha Kumakh"],
  "Surkhet": ["Gurbhakot", "Panchpuri", "Bheriganga", "Lekbeshi", "Birendranagar", "Chaukune", "Simta", "Chingad", "Barahtal"],
  "Bajura": ["Badimalika", "Tribeni", "Budhiganga", "Budhinanda", "Gaumul", "Himali", "Jagannath", "Khaptad Chhededaha", "Swami Kartik Khaapar"],
  "Bajhang": ["JayaPrithivi", "Bungal", "Masta", "Thalara", "Talkot", "Surma", "SaiPaal", "Durgathali", "Bithadchir", "Kedarseu", "Khaptadchhanna", "Chabispathivera"],
  "Darchula": ["Mahakali", "Shailyashikhar", "Lekam", "Naugad", "Byas", "Dunhu", "Marma", "Apihimal", "Malikaarjun"],
  "Baitadi": ["Melauli", "Dasharathchanda", "Purchaudi", "Patan", "Sigas", "Shivanath", "Surnaya", "Dilasaini", "Pancheshwar", "Dogadakedar"],
  "Dadeldhura": ["Amargadhi", "Parashuram", "Alital", "Ajaymeru", "Bhageshwar", "Nawadurga", "Ganayapdhura"],
  "Doti": ["Dipayal Silgadi", "Shikhar", "Sayal", "Adharsha", "Jorayal", "Badikedar", "Purbichauki", "K I Singh", "Bogtan Foodsil"],
  "Achham": ["Sanphebagar", "Mangalsen", "Kamalbazar", "Panchadewal Binayak", "Dhakari", "Mellekh", "Chaurpati", "Ramaroshan", "Turmakhad", "Bannigadhi"],
  "Kanchanpur": ["Punarbas", "Krishnapur", "Mahakali", "Bedkot", "Belauri", "Bhimdatta", "Shuklaphanta", "Beldandi", "Laljhandi"],
  "Rasuwa": ["Kalika", "Naukunda", "Uttargaya", "Gosaikunda", "Amachodingmo"],
  "Manang": ["Chame", "Narshon", "Narpa Bhumi", "Manang Ingshyang"],
  "Mustang": ["Thasang", "Gharapjhong", "Lomanthang", "Lo-Ghekar Damodarkunda", "Waragung Muktikhsetra"],
  "Rukum East": ["Bhume", "Sisne", "Putha Uttarganga"]
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

export const NATIONALITIES = ["Nepali", "Indian", "Chinese", "American", "Other"];

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
