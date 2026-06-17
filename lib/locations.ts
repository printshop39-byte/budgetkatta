// lib/locations.ts
// Server-side location dataset for the bank/patsanstha directory.
//
// Hierarchy: District → Taluka → Village → branches.
// This module is the SINGLE access layer for location reads. Today it serves a
// curated in-memory dataset; in the next phase swap the bodies of getDistricts /
// getTalukas / getVillages for MongoDB Atlas queries (the function signatures and
// return shapes are already DB-friendly, so the API route + frontend won't change).
//
// NOTE: branch listings + pincodes are representative sample data, not an official
// RBI/postal export. The UI shows a "verify with the bank" disclaimer accordingly.

export type Bi = { en: string; mr: string };
export type BranchType = 'DCCB' | 'Patsanstha' | 'Commercial';

export interface Branch {
  name: Bi;
  type: BranchType;
  address: Bi;
  phone?: string; // optional; omitted where no safe public number exists
}
export interface Village {
  id: string;
  name: Bi;
  pincode: string;
  branches: Branch[];
}
export interface TalukaRef {
  id: string;
  name: Bi;
}
export interface DistrictRef {
  id: string;
  name: Bi;
}

interface TalukaRaw {
  id: string;
  name: Bi;
}
interface DistrictRaw {
  id: string;
  name: Bi;
  pinBase: string; // 4-digit prefix; village pincodes derive from this
  talukas: TalukaRaw[];
}

// Compact constructors keep the 36-district table readable.
const t = (id: string, en: string, mr: string): TalukaRaw => ({ id, name: { en, mr } });
const d = (id: string, en: string, mr: string, pinBase: string, talukas: TalukaRaw[]): DistrictRaw => ({
  id,
  name: { en, mr },
  pinBase,
  talukas,
});

// ── All 36 districts of Maharashtra, top-5 major talukas each ─────────────────
const MAHARASHTRA: DistrictRaw[] = [
  d('mumbai-city', 'Mumbai City', 'मुंबई शहर', '4000', [
    t('colaba', 'Colaba', 'कुलाबा'),
    t('fort', 'Fort', 'फोर्ट'),
    t('byculla', 'Byculla', 'भायखळा'),
    t('worli', 'Worli', 'वरळी'),
    t('mahalaxmi', 'Mahalaxmi', 'महालक्ष्मी'),
  ]),
  d('mumbai-suburban', 'Mumbai Suburban', 'मुंबई उपनगर', '4000', [
    t('andheri', 'Andheri', 'अंधेरी'),
    t('borivali', 'Borivali', 'बोरिवली'),
    t('kurla', 'Kurla', 'कुर्ला'),
    t('bandra', 'Bandra', 'वांद्रे'),
    t('goregaon', 'Goregaon', 'गोरेगाव'),
  ]),
  d('thane', 'Thane', 'ठाणे', '4006', [
    t('thane', 'Thane', 'ठाणे'),
    t('kalyan', 'Kalyan', 'कल्याण'),
    t('bhiwandi', 'Bhiwandi', 'भिवंडी'),
    t('murbad', 'Murbad', 'मुरबाड'),
    t('shahapur', 'Shahapur', 'शहापूर'),
  ]),
  d('palghar', 'Palghar', 'पालघर', '4015', [
    t('palghar', 'Palghar', 'पालघर'),
    t('vasai', 'Vasai', 'वसई'),
    t('dahanu', 'Dahanu', 'डहाणू'),
    t('vada', 'Vada', 'वाडा'),
    t('jawhar', 'Jawhar', 'जव्हार'),
  ]),
  d('raigad', 'Raigad', 'रायगड', '4022', [
    t('alibag', 'Alibag', 'अलिबाग'),
    t('panvel', 'Panvel', 'पनवेल'),
    t('pen', 'Pen', 'पेण'),
    t('mahad', 'Mahad', 'महाड'),
    t('karjat', 'Karjat', 'कर्जत'),
  ]),
  d('ratnagiri', 'Ratnagiri', 'रत्नागिरी', '4156', [
    t('ratnagiri', 'Ratnagiri', 'रत्नागिरी'),
    t('chiplun', 'Chiplun', 'चिपळूण'),
    t('dapoli', 'Dapoli', 'दापोली'),
    t('khed', 'Khed', 'खेड'),
    t('rajapur', 'Rajapur', 'राजापूर'),
  ]),
  d('sindhudurg', 'Sindhudurg', 'सिंधुदुर्ग', '4166', [
    t('sawantwadi', 'Sawantwadi', 'सावंतवाडी'),
    t('kudal', 'Kudal', 'कुडाळ'),
    t('kankavli', 'Kankavli', 'कणकवली'),
    t('vengurla', 'Vengurla', 'वेंगुर्ला'),
    t('devgad', 'Devgad', 'देवगड'),
  ]),
  d('pune', 'Pune', 'पुणे', '4110', [
    t('haveli', 'Haveli', 'हवेली'),
    t('maval', 'Maval', 'मावळ'),
    t('mulshi', 'Mulshi', 'मुळशी'),
    t('baramati', 'Baramati', 'बारामती'),
    t('shirur', 'Shirur', 'शिरूर'),
  ]),
  d('satara', 'Satara', 'सातारा', '4150', [
    t('satara', 'Satara', 'सातारा'),
    t('karad', 'Karad', 'कराड'),
    t('wai', 'Wai', 'वाई'),
    t('phaltan', 'Phaltan', 'फलटण'),
    t('koregaon', 'Koregaon', 'कोरेगाव'),
  ]),
  d('sangli', 'Sangli', 'सांगली', '4164', [
    t('miraj', 'Miraj', 'मिरज'),
    t('tasgaon', 'Tasgaon', 'तासगाव'),
    t('walwa', 'Walwa', 'वाळवा'),
    t('palus', 'Palus', 'पलूस'),
    t('kavathe-mahankal', 'Kavathe-Mahankal', 'कवठेमहांकाळ'),
  ]),
  d('solapur', 'Solapur', 'सोलापूर', '4130', [
    t('north-solapur', 'North Solapur', 'उत्तर सोलापूर'),
    t('south-solapur', 'South Solapur', 'दक्षिण सोलापूर'),
    t('pandharpur', 'Pandharpur', 'पंढरपूर'),
    t('barshi', 'Barshi', 'बार्शी'),
    t('akkalkot', 'Akkalkot', 'अक्कलकोट'),
  ]),
  d('kolhapur', 'Kolhapur', 'कोल्हापूर', '4160', [
    t('karveer', 'Karveer', 'करवीर'),
    t('hatkanangale', 'Hatkanangale', 'हातकणंगले'),
    t('shirol', 'Shirol', 'शिरोळ'),
    t('gadhinglaj', 'Gadhinglaj', 'गडहिंग्लज'),
    t('panhala', 'Panhala', 'पन्हाळा'),
  ]),
  d('nashik', 'Nashik', 'नाशिक', '4220', [
    t('nashik', 'Nashik', 'नाशिक'),
    t('malegaon', 'Malegaon', 'मालेगाव'),
    t('niphad', 'Niphad', 'निफाड'),
    t('sinnar', 'Sinnar', 'सिन्नर'),
    t('yeola', 'Yeola', 'येवला'),
  ]),
  d('dhule', 'Dhule', 'धुळे', '4240', [
    t('dhule', 'Dhule', 'धुळे'),
    t('sakri', 'Sakri', 'साक्री'),
    t('shirpur', 'Shirpur', 'शिरपूर'),
    t('sindkheda', 'Sindkheda', 'सिंदखेडा'),
    t('dondaicha', 'Dondaicha', 'दोंडाईचा'),
  ]),
  d('nandurbar', 'Nandurbar', 'नंदुरबार', '4254', [
    t('nandurbar', 'Nandurbar', 'नंदुरबार'),
    t('shahada', 'Shahada', 'शहादा'),
    t('taloda', 'Taloda', 'तळोदा'),
    t('akkalkuwa', 'Akkalkuwa', 'अक्कलकुवा'),
    t('navapur', 'Navapur', 'नवापूर'),
  ]),
  d('jalgaon', 'Jalgaon', 'जळगाव', '4250', [
    t('jalgaon', 'Jalgaon', 'जळगाव'),
    t('bhusawal', 'Bhusawal', 'भुसावळ'),
    t('chopda', 'Chopda', 'चोपडा'),
    t('amalner', 'Amalner', 'अमळनेर'),
    t('chalisgaon', 'Chalisgaon', 'चाळीसगाव'),
  ]),
  d('ahmednagar', 'Ahmednagar', 'अहमदनगर', '4140', [
    t('nagar', 'Nagar', 'नगर'),
    t('shrirampur', 'Shrirampur', 'श्रीरामपूर'),
    t('sangamner', 'Sangamner', 'संगमनेर'),
    t('kopargaon', 'Kopargaon', 'कोपरगाव'),
    t('rahuri', 'Rahuri', 'राहुरी'),
  ]),
  d('chh-sambhajinagar', 'Chhatrapati Sambhajinagar', 'छत्रपती संभाजीनगर', '4310', [
    t('aurangabad', 'Aurangabad', 'औरंगाबाद'),
    t('paithan', 'Paithan', 'पैठण'),
    t('sillod', 'Sillod', 'सिल्लोड'),
    t('vaijapur', 'Vaijapur', 'वैजापूर'),
    t('kannad', 'Kannad', 'कन्नड'),
  ]),
  d('jalna', 'Jalna', 'जालना', '4312', [
    t('jalna', 'Jalna', 'जालना'),
    t('ambad', 'Ambad', 'अंबड'),
    t('bhokardan', 'Bhokardan', 'भोकरदन'),
    t('partur', 'Partur', 'परतूर'),
    t('ghansawangi', 'Ghansawangi', 'घनसावंगी'),
  ]),
  d('beed', 'Beed', 'बीड', '4311', [
    t('beed', 'Beed', 'बीड'),
    t('georai', 'Georai', 'गेवराई'),
    t('ambajogai', 'Ambajogai', 'अंबाजोगाई'),
    t('majalgaon', 'Majalgaon', 'माजलगाव'),
    t('parli', 'Parli', 'परळी'),
  ]),
  d('latur', 'Latur', 'लातूर', '4135', [
    t('latur', 'Latur', 'लातूर'),
    t('ausa', 'Ausa', 'औसा'),
    t('udgir', 'Udgir', 'उदगीर'),
    t('nilanga', 'Nilanga', 'निलंगा'),
    t('ahmedpur', 'Ahmedpur', 'अहमदपूर'),
  ]),
  d('dharashiv', 'Dharashiv', 'धाराशिव', '4135', [
    t('osmanabad', 'Osmanabad', 'उस्मानाबाद'),
    t('tuljapur', 'Tuljapur', 'तुळजापूर'),
    t('omerga', 'Omerga', 'उमरगा'),
    t('paranda', 'Paranda', 'परंडा'),
    t('bhoom', 'Bhoom', 'भूम'),
  ]),
  d('nanded', 'Nanded', 'नांदेड', '4316', [
    t('nanded', 'Nanded', 'नांदेड'),
    t('deglur', 'Deglur', 'देगलूर'),
    t('kandhar', 'Kandhar', 'कंधार'),
    t('hadgaon', 'Hadgaon', 'हदगाव'),
    t('mukhed', 'Mukhed', 'मुखेड'),
  ]),
  d('parbhani', 'Parbhani', 'परभणी', '4314', [
    t('parbhani', 'Parbhani', 'परभणी'),
    t('gangakhed', 'Gangakhed', 'गंगाखेड'),
    t('jintur', 'Jintur', 'जिंतूर'),
    t('sailu', 'Sailu', 'सेलू'),
    t('pathri', 'Pathri', 'पाथरी'),
  ]),
  d('hingoli', 'Hingoli', 'हिंगोली', '4315', [
    t('hingoli', 'Hingoli', 'हिंगोली'),
    t('kalamnuri', 'Kalamnuri', 'कळमनुरी'),
    t('basmath', 'Basmath', 'बसमत'),
    t('sengaon', 'Sengaon', 'सेनगाव'),
    t('aundha-nagnath', 'Aundha Nagnath', 'औंढा नागनाथ'),
  ]),
  d('buldhana', 'Buldhana', 'बुलढाणा', '4430', [
    t('buldhana', 'Buldhana', 'बुलढाणा'),
    t('khamgaon', 'Khamgaon', 'खामगाव'),
    t('malkapur', 'Malkapur', 'मलकापूर'),
    t('chikhli', 'Chikhli', 'चिखली'),
    t('mehkar', 'Mehkar', 'मेहकर'),
  ]),
  d('akola', 'Akola', 'अकोला', '4440', [
    t('akola', 'Akola', 'अकोला'),
    t('akot', 'Akot', 'अकोट'),
    t('balapur', 'Balapur', 'बाळापूर'),
    t('murtizapur', 'Murtizapur', 'मूर्तिजापूर'),
    t('patur', 'Patur', 'पातूर'),
  ]),
  d('washim', 'Washim', 'वाशिम', '4445', [
    t('washim', 'Washim', 'वाशिम'),
    t('risod', 'Risod', 'रिसोड'),
    t('washim-malegaon', 'Malegaon', 'मालेगाव'),
    t('mangrulpir', 'Mangrulpir', 'मंगरूळपीर'),
    t('karanja', 'Karanja', 'कारंजा'),
  ]),
  d('amravati', 'Amravati', 'अमरावती', '4446', [
    t('amravati', 'Amravati', 'अमरावती'),
    t('achalpur', 'Achalpur', 'अचलपूर'),
    t('daryapur', 'Daryapur', 'दर्यापूर'),
    t('morshi', 'Morshi', 'मोर्शी'),
    t('warud', 'Warud', 'वरूड'),
  ]),
  d('yavatmal', 'Yavatmal', 'यवतमाळ', '4450', [
    t('yavatmal', 'Yavatmal', 'यवतमाळ'),
    t('pusad', 'Pusad', 'पुसद'),
    t('wani', 'Wani', 'वणी'),
    t('darwha', 'Darwha', 'दारव्हा'),
    t('ghatanji', 'Ghatanji', 'घाटंजी'),
  ]),
  d('wardha', 'Wardha', 'वर्धा', '4420', [
    t('wardha', 'Wardha', 'वर्धा'),
    t('hinganghat', 'Hinganghat', 'हिंगणघाट'),
    t('arvi', 'Arvi', 'आर्वी'),
    t('deoli', 'Deoli', 'देवळी'),
    t('samudrapur', 'Samudrapur', 'समुद्रपूर'),
  ]),
  d('nagpur', 'Nagpur', 'नागपूर', '4400', [
    t('nagpur-urban', 'Nagpur Urban', 'नागपूर शहर'),
    t('nagpur-rural', 'Nagpur Rural', 'नागपूर ग्रामीण'),
    t('kamptee', 'Kamptee', 'कामठी'),
    t('katol', 'Katol', 'काटोल'),
    t('umred', 'Umred', 'उमरेड'),
  ]),
  d('bhandara', 'Bhandara', 'भंडारा', '4419', [
    t('bhandara', 'Bhandara', 'भंडारा'),
    t('tumsar', 'Tumsar', 'तुमसर'),
    t('pauni', 'Pauni', 'पवनी'),
    t('sakoli', 'Sakoli', 'साकोली'),
    t('lakhani', 'Lakhani', 'लाखनी'),
  ]),
  d('gondia', 'Gondia', 'गोंदिया', '4416', [
    t('gondia', 'Gondia', 'गोंदिया'),
    t('tirora', 'Tirora', 'तिरोडा'),
    t('gondia-goregaon', 'Goregaon', 'गोरेगाव'),
    t('arjuni-morgaon', 'Arjuni Morgaon', 'अर्जुनी मोरगाव'),
    t('amgaon', 'Amgaon', 'आमगाव'),
  ]),
  d('chandrapur', 'Chandrapur', 'चंद्रपूर', '4424', [
    t('chandrapur', 'Chandrapur', 'चंद्रपूर'),
    t('ballarpur', 'Ballarpur', 'बल्लारपूर'),
    t('warora', 'Warora', 'वरोरा'),
    t('brahmapuri', 'Brahmapuri', 'ब्रह्मपुरी'),
    t('rajura', 'Rajura', 'राजुरा'),
  ]),
  d('gadchiroli', 'Gadchiroli', 'गडचिरोली', '4426', [
    t('gadchiroli', 'Gadchiroli', 'गडचिरोली'),
    t('aheri', 'Aheri', 'अहेरी'),
    t('chamorshi', 'Chamorshi', 'चामोर्शी'),
    t('armori', 'Armori', 'आरमोरी'),
    t('desaiganj', 'Desaiganj', 'देसाईगंज'),
  ]),
];

// Build the representative branch list for a taluka town. We attach a phone only
// where a genuine, safe public number exists (SBI's national toll-free), and omit
// it otherwise rather than invent a number that could dial a real person.
function makeBranches(district: DistrictRaw, taluka: TalukaRaw): Branch[] {
  const dn = district.name;
  const tn = taluka.name;
  return [
    {
      name: { en: `${dn.en} District Central Co-op Bank — ${tn.en} Branch`, mr: `${dn.mr} जिल्हा मध्यवर्ती सहकारी बँक — ${tn.mr} शाखा` },
      type: 'DCCB',
      address: { en: `Main Road, ${tn.en}`, mr: `मुख्य रस्ता, ${tn.mr}` },
    },
    {
      name: { en: `State Bank of India — ${tn.en}`, mr: `स्टेट बँक ऑफ इंडिया — ${tn.mr}` },
      type: 'Commercial',
      address: { en: `Market Area, ${tn.en}`, mr: `बाजार परिसर, ${tn.mr}` },
      phone: '1800112211', // SBI national toll-free (real, safe public helpline)
    },
  ];
}

// ── Access layer (MongoDB swap point) ─────────────────────────────────────────

/** All districts (lightweight: id + bilingual name). */
export async function getDistricts(): Promise<DistrictRef[]> {
  return MAHARASHTRA.map((dist) => ({ id: dist.id, name: dist.name }));
}

/** Talukas for a district. */
export async function getTalukas(districtId: string): Promise<TalukaRef[]> {
  const dist = MAHARASHTRA.find((x) => x.id === districtId);
  if (!dist) return [];
  return dist.talukas.map((tk) => ({ id: tk.id, name: tk.name }));
}

/** Villages (with pincode + branches) for a taluka. */
export async function getVillages(districtId: string, talukaId: string): Promise<Village[]> {
  const dist = MAHARASHTRA.find((x) => x.id === districtId);
  if (!dist) return [];
  const idx = dist.talukas.findIndex((tk) => tk.id === talukaId);
  if (idx === -1) return [];
  const tk = dist.talukas[idx];
  const pincode = `${dist.pinBase}${String(11 + idx).padStart(2, '0')}`; // representative
  return [
    {
      id: `${tk.id}-town`,
      name: tk.name,
      pincode,
      branches: makeBranches(dist, tk),
    },
  ];
}
