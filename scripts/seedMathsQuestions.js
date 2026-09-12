const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const mongoose = require(path.join(rootDir, 'server', 'node_modules', 'mongoose'));
const Question = require(path.join(rootDir, 'server', 'models', 'Question'));

// 1. Define the 10 topics for Mathematics as provided by user
const MATHS_TOPICS = [
  { en: 'Work and Time', hi: 'समय और कार्य' },
  { en: 'Pipes and Cisterns', hi: 'नल और टंकी' },
  { en: 'Time, Speed and Distance', hi: 'समय, चाल और दूरी' },
  { en: 'Train, Boat and Stream', hi: 'रेलगाड़ी, नाव और धारा' },
  { en: 'Trigonometry', hi: 'त्रिकोणमिति' },
  { en: 'Height and Distance', hi: 'ऊँचाई और दूरी' },
  { en: 'Geometry', hi: 'ज्यामिति' },
  { en: 'Coordinate Geometry', hi: 'निर्देशांक ज्यामिति' },
  { en: 'Statistics & Probability', hi: 'सांख्यिकी और प्रायिकता' },
  { en: 'Permutation, Combination & DI', hi: 'क्रमचय, संचय और आँकड़ा विश्लेषण' }
];

// 2. High-quality structured Maths questions matching all 10 topics
const mathsQuestionsRaw = [
  // --- Work and Time ---
  {
    topic: 'Work and Time',
    enQ: 'A and B can do a piece of work in 10 and 12 days respectively. They started the work together and after 3 days A left the work. Find the total time taken to complete the work.',
    hiQ: 'A और B किसी काम को क्रमशः 10 और 12 दिन में कर सकते हैं। दोनों ने साथ मिलकर काम शुरू किया और 3 दिन बाद A ने काम छोड़ दिया। काम पूरा होने में कुल कितना समय लगा?',
    optsEn: ['8.4 days', '9 days', '7.5 days', 'More than one of the above', 'None of the above'],
    optsHi: ['8.4 दिन', '9 दिन', '7.5 दिन', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Total work = LCM(10,12) = 60 units. A eff = 6, B eff = 5. A worked for 3 days = 18 units. Remaining = 42 units. Time by B = 42/5 = 8.4 days.',
    solHi: 'कुल काम = 60। A की क्षमता = 6, B की क्षमता = 5। A का 3 दिन का काम = 18 यूनिट। बचा काम = 42। B का समय = 42/5 = 8.4 दिन।'
  },
  {
    topic: 'Work and Time',
    enQ: 'A, B and C can complete a work in 10, 12 and 15 days respectively. They started together. After 2 days A left and after 2 more days C left. In how many days was the work completed?',
    hiQ: 'A, B और C किसी काम को क्रमशः 10, 12 और 15 दिन में कर सकते हैं। तीनों ने साथ काम शुरू किया। 2 दिन बाद A ने काम छोड़ दिया और उसके 2 दिन बाद C ने भी काम छोड़ दिया। पूरा काम कितने दिनों में समाप्त हुआ?',
    optsEn: ['6.4 days', '6 days', '7.5 days', 'More than one of the above', 'None of the above'],
    optsHi: ['6.4 दिन', '6 दिन', '7.5 दिन', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Total work = LCM(10,12,15) = 60. Eff: A=6, B=5, C=4. A worked 2 days=12, C worked 4 days=16. Remaining=32. B time = 32/5 = 6.4 days.',
    solHi: 'कुल काम = 60। क्षमता: A=6, B=5, C=4। A (2 दिन) = 12, C (4 दिन) = 16। बचा = 32। B का समय = 32/5 = 6.4 दिन।'
  },
  {
    topic: 'Work and Time',
    enQ: 'A monkey climbs a 100-meter-high pole. In the 1st minute he climbs 6m and in the 2nd minute he slips 4m. In how much time will he reach the top?',
    hiQ: 'एक बंदर 100 मीटर ऊँचे खंभे पर चढ़ता है। वह पहले मिनट में 6 मीटर चढ़ता है और दूसरे मिनट में 4 मीटर फिसल जाता है। वह कितने समय में खंभे के शीर्ष पर पहुँच जाएगा?',
    optsEn: ['95 minutes', '96 minutes', '100 minutes', 'More than one of the above', 'None of the above'],
    optsHi: ['95 मिनट', '96 मिनट', '100 मिनट', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Net climb = 2m in 2 mins. For (100-6) = 94m, it takes 94 mins. Next 1 min he climbs 6m to reach top. Total = 95 mins.',
    solHi: '2 मिनट में शुद्ध चढ़ाई = 2 मीटर। 94 मीटर के लिए = 94 मिनट। अगले 1 मिनट में 6 मीटर चढ़कर शीर्ष पर पहुँचेगा = 95 मिनट।'
  },

  // --- Pipes and Cisterns ---
  {
    topic: 'Pipes and Cisterns',
    enQ: 'Two pipes A and B can fill a cistern in 48 and 36 minutes respectively. After how much time should pipe A be closed so that the cistern fills in 25 min 30 sec?',
    hiQ: 'दो नल A और B किसी टंकी को क्रमशः 48 और 36 मिनट में भर सकते हैं। दोनों को एक साथ खोला गया, कितनी देर बाद नल A को बंद किया जाए कि पूरी टंकी 25 मिनट 30 सेकंड में भर जाए?',
    optsEn: ['14 mins', '12 mins', '16 mins', 'More than one of the above', 'None of the above'],
    optsHi: ['14 मिनट', '12 मिनट', '16 मिनट', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Total capacity = 144. Eff A=3, B=4. B works 25.5 mins = 102 units. Remaining = 42 units. Time for A = 42/3 = 14 mins.',
    solHi: 'कुल क्षमता = 144। A=3, B=4। B (25.5 मिनट) = 102 यूनिट। बचा काम = 42। A का समय = 42/3 = 14 मिनट।'
  },
  {
    topic: 'Pipes and Cisterns',
    enQ: 'A leak at the bottom of a tank can empty it in 6 hours. A fill pipe adding 4 liters/min is opened and now tank empties in 8 hours. Find the capacity of the tank.',
    hiQ: 'टंकी के नीचे एक रिसाव इसे 6 घंटे में खाली कर सकता है। एक अन्य नल जो 4 लीटर प्रति मिनट पानी भरता है, उसे भी खोल दिया गया। अब टंकी 8 घंटे में खाली होती है। टंकी की क्षमता ज्ञात करें।',
    optsEn: ['5760 liters', '5000 liters', '6000 liters', 'More than one of the above', 'None of the above'],
    optsHi: ['5760 लीटर', '5000 लीटर', '6000 लीटर', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Fill pipe eff = 1/6 - 1/8 = 1/24. Takes 24 hrs = 1440 mins to fill. Capacity = 1440 * 4 = 5760 liters.',
    solHi: 'भरने वाले नल की क्षमता = 1/6 - 1/8 = 1/24। समय = 24 घंटे = 1440 मिनट। कुल क्षमता = 1440 × 4 = 5760 लीटर।'
  },

  // --- Time, Speed and Distance ---
  {
    topic: 'Time, Speed and Distance',
    enQ: 'A person walking at 5/7 of his usual speed reaches his destination 20 minutes late. Find his usual time to reach the destination.',
    hiQ: 'एक व्यक्ति अपनी वास्तविक चाल की 5/7 चाल से चलने पर 20 मिनट की देरी से पहुँचता है। उसका वास्तविक समय ज्ञात कीजिए।',
    optsEn: ['50 minutes', '40 minutes', '70 minutes', 'More than one of the above', 'None of the above'],
    optsHi: ['50 मिनट', '40 मिनट', '70 मिनट', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Speed ratio = 5:7 => Time ratio = 7:5. Diff = 2 units = 20 mins => 1 unit = 10 mins. Usual time = 5 units = 50 mins.',
    solHi: 'चाल अनुपात = 5:7 ⇒ समय अनुपात = 7:5। अंतर = 2 यूनिट = 20 मिनट ⇒ 1 यूनिट = 10 मिनट। मूल समय = 5 × 10 = 50 मिनट।'
  },
  {
    topic: 'Time, Speed and Distance',
    enQ: 'A policeman sees a thief at a distance of 200m. The thief runs at 10 km/hr and policeman chases at 12 km/hr. How far will the thief run before being caught?',
    hiQ: 'एक चोर को एक पुलिसकर्मी 200 मीटर की दूरी पर देखता है। चोर 10 किमी/घंटा और पुलिसकर्मी 12 किमी/घंटा की गति से भागता है। पकड़े जाने से पहले चोर कितनी दूरी तय कर चुका होगा?',
    optsEn: ['1000 meters', '1200 meters', '800 meters', 'More than one of the above', 'None of the above'],
    optsHi: ['1000 मीटर', '1200 मीटर', '800 मीटर', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Speed ratio = 12:10 = 6:5. Distance ratio = 6:5. Diff = 1 unit = 200m. Thief distance = 5 units = 1000m.',
    solHi: 'चाल का अनुपात = 12:10 = 6:5। दूरी अनुपात = 6:5। अंतर = 1 यूनिट = 200 मीटर। चोर द्वारा दूरी = 5 × 200 = 1000 मीटर।'
  },

  // --- Train, Boat and Stream ---
  {
    topic: 'Train, Boat and Stream',
    enQ: 'A 180-meter long train traveling at a speed of 54 km/hr crosses a platform in 20 seconds. Find the length of the platform.',
    hiQ: '180 मीटर लंबी एक रेलगाड़ी 54 किमी/घंटा की चाल से चलते हुए एक प्लेटफॉर्म को 20 सेकंड में पार करती है। प्लेटफॉर्म की लंबाई ज्ञात करें।',
    optsEn: ['120 m', '150 m', '100 m', 'More than one of the above', 'None of the above'],
    optsHi: ['120 मीटर', '150 मीटर', '100 मीटर', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Speed = 54 * 5/18 = 15 m/s. Distance in 20s = 15 * 20 = 300m. Platform = 300 - 180 = 120m.',
    solHi: 'चाल = 15 मीटर/सेकंड। 20 सेकंड में तय दूरी = 300 मीटर। प्लेटफॉर्म = 300 - 180 = 120 मीटर।'
  },

  // --- Trigonometry ---
  {
    topic: 'Trigonometry',
    enQ: 'Find the simplest value of the expression (sin θ)/(1 + cos θ) + (1 + cos θ)/(sin θ).',
    hiQ: 'व्यंजक (sin θ)/(1 + cos θ) + (1 + cos θ)/(sin θ) का सरलतम मान ज्ञात कीजिए।',
    optsEn: ['2 sec θ', '2 cosec θ', '2 sin θ', 'More than one of the above', 'None of the above'],
    optsHi: ['2 sec θ', '2 cosec θ', '2 sin θ', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 1,
    solEn: 'Numerator = sin²θ + (1+cosθ)² = 2(1+cosθ). Expression = 2(1+cosθ) / [sinθ(1+cosθ)] = 2/sinθ = 2 cosec θ.',
    solHi: 'अंश = sin²θ + 1 + 2cosθ + cos²θ = 2(1+cosθ)। व्यंजक = 2/sinθ = 2 cosec θ।'
  },

  // --- Height and Distance ---
  {
    topic: 'Height and Distance',
    enQ: 'The angle of elevation of the top of a tower from a point on the ground is 30°. On moving 20m towards the foot, it becomes 60°. Find the height of the tower.',
    hiQ: 'जमीन पर स्थित किसी बिंदु से एक मीनार के शिखर का उन्नयन कोण 30° है। मीनार के पाद की ओर 20 मीटर चलने पर यह कोण 60° हो जाता है। मीनार की ऊँचाई ज्ञात कीजिए।',
    optsEn: ['10√3 meters', '20√3 meters', '15√3 meters', 'More than one of the above', 'None of the above'],
    optsHi: ['10√3 मीटर', '20√3 मीटर', '15√3 मीटर', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Formula: d = h(cot 30° - cot 60°) => 20 = h(√3 - 1/√3) = h(2/√3) => h = 10√3 meters.',
    solHi: '20 = h(√3 - 1/√3) ⇒ 20 = h(2/√3) ⇒ ऊँचाई h = 10√3 मीटर।'
  },

  // --- Geometry ---
  {
    topic: 'Geometry',
    enQ: 'In ΔABC, AD is the angle bisector of ∠A. If AB = 6 cm, AC = 8 cm and BD = 3 cm, find the length of DC.',
    hiQ: 'ΔABC में AD, ∠A का कोण समद्विभाजक (angle bisector) है। यदि AB = 6 सेमी, AC = 8 सेमी और BD = 3 सेमी हो, तो DC की लंबाई ज्ञात कीजिए।',
    optsEn: ['5 cm', '4 cm', '4.5 cm', 'More than one of the above', 'None of the above'],
    optsHi: ['5 सेमी', '4 सेमी', '4.5 सेमी', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 1,
    solEn: 'Angle Bisector Theorem: AB/AC = BD/DC => 6/8 = 3/DC => DC = 4 cm.',
    solHi: 'कोण समद्विभाजक प्रमेय: AB/AC = BD/DC ⇒ 6/8 = 3/DC ⇒ DC = 4 सेमी।'
  },
  {
    topic: 'Geometry',
    enQ: 'What will be the length of a chord located at a distance of 3 cm from the center of a circle of radius 5 cm?',
    hiQ: '5 सेमी त्रिज्या वाले एक वृत्त के केंद्र से 3 सेमी की दूरी पर स्थित जीवा (chord) की लंबाई क्या होगी?',
    optsEn: ['6 cm', '8 cm', '10 cm', 'More than one of the above', 'None of the above'],
    optsHi: ['6 सेमी', '8 सेमी', '10 सेमी', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 1,
    solEn: 'Half chord = √(5² - 3²) = √16 = 4 cm. Total chord = 2 * 4 = 8 cm.',
    solHi: 'जीवा का आधा = √(5² - 3²) = 4 सेमी। कुल जीवा = 8 सेमी।'
  },

  // --- Coordinate Geometry ---
  {
    topic: 'Coordinate Geometry',
    enQ: 'Find the mid-point of the line segment joining the points (2, 3) and (6, 7).',
    hiQ: 'बिंदुओं (2, 3) और (6, 7) को जोड़ने वाले रेखाखंड का मध्य-बिंदु (mid-point) ज्ञात कीजिए।',
    optsEn: ['(4, 5)', '(4, 4)', '(8, 10)', 'More than one of the above', 'None of the above'],
    optsHi: ['(4, 5)', '(4, 4)', '(8, 10)', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Midpoint = ((2+6)/2, (3+7)/2) = (4, 5).',
    solHi: 'मध्य-बिंदु = ((2+6)/2, (3+7)/2) = (4, 5)।'
  },
  {
    topic: 'Coordinate Geometry',
    enQ: 'Find the perpendicular distance between two parallel lines 3x + 4y + 5 = 0 and 3x + 4y - 15 = 0.',
    hiQ: 'दो समांतर रेखाओं 3x + 4y + 5 = 0 और 3x + 4y − 15 = 0 के बीच की लंबवत दूरी ज्ञात कीजिए।',
    optsEn: ['2 units', '4 units', '5 units', 'More than one of the above', 'None of the above'],
    optsHi: ['2 इकाई', '4 इकाई', '5 इकाई', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 1,
    solEn: 'Distance = |C1 - C2| / √(A²+B²) = |5 - (-15)| / √(3²+4²) = 20 / 5 = 4 units.',
    solHi: 'दूरी = |5 - (-15)| / √(3²+4²) = 20 / 5 = 4 इकाई।'
  },

  // --- Statistics & Probability ---
  {
    topic: 'Statistics & Probability',
    enQ: 'If the mean of a distribution is 20 and the mode is 14, find the value of the median using the empirical formula.',
    hiQ: 'यदि किसी बंटन का माध्य (Mean) 20 और बहुलक (Mode) 14 हो, तो एम्पेरिकल सूत्र का उपयोग करके मध्यिका (Median) का मान ज्ञात करें।',
    optsEn: ['16', '18', '20', 'More than one of the above', 'None of the above'],
    optsHi: ['16', '18', '20', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 1,
    solEn: 'Mode = 3*Median - 2*Mean => 14 = 3*Median - 40 => 3*Median = 54 => Median = 18.',
    solHi: 'बहुलक = 3×मध्यिका - 2×माध्य ⇒ 14 = 3×मध्यिका - 40 ⇒ 3×मध्यिका = 54 ⇒ मध्यिका = 18।'
  },
  {
    topic: 'Statistics & Probability',
    enQ: 'A card is drawn randomly from a pack of 52 cards. What is the probability that it is a King or a Diamond?',
    hiQ: 'ताश की 52 पत्तों की गड्डी में से एक पत्ता यादृच्छिक रूप से निकाला जाता है। इसके बादशाह (King) या ईंट (Diamond) होने की प्रायिकता क्या होगी?',
    optsEn: ['1/4', '3/13', '4/13', 'More than one of the above', 'None of the above'],
    optsHi: ['1/4', '3/13', '4/13', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 2,
    solEn: 'Diamonds = 13, Kings = 4 (1 already in diamonds). Favorable = 13+3 = 16. Probability = 16/52 = 4/13.',
    solHi: 'कुल अनुकूल परिणाम = 13 (ईंट) + 3 (अन्य बादशाह) = 16। प्रायिकता = 16/52 = 4/13।'
  },

  // --- Permutation, Combination & DI ---
  {
    topic: 'Permutation, Combination & DI',
    enQ: 'How many different words can be formed from the letters of "LOGARITHM" such that all vowels are always together?',
    hiQ: '\'LOGARITHM\' शब्द के अक्षरों से ऐसे कितने अलग-अलग शब्द बनाए जा सकते हैं, जिनमें सभी स्वर (vowels) हमेशा एक साथ रहें?',
    optsEn: ['30240', '40320', '15120', 'More than one of the above', 'None of the above'],
    optsHi: ['30240', '40320', '15120', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Vowels (O,A,I) = 1 unit + 6 consonants = 7 units. Ways = 7! * 3! = 5040 * 6 = 30240.',
    solHi: 'स्वर (O,A,I) = 1 इकाई + 6 व्यंजन = 7 इकाइयाँ। तरीके = 7! × 3! = 5040 × 6 = 30240।'
  },
  {
    topic: 'Permutation, Combination & DI',
    enQ: 'Total family expenditure is ₹72,000 in a pie chart. If the central angle showing education is 60°, what is the total expenditure on education?',
    hiQ: 'एक पाई-चार्ट में कुल पारिवारिक व्यय ₹ 72,000 दर्शाया गया है। यदि शिक्षा पर व्यय दर्शाने वाला केंद्रीय कोण 60° है, तो शिक्षा पर कुल कितना खर्च हुआ?',
    optsEn: ['₹ 12,000', '₹ 15,000', '₹ 10,000', 'More than one of the above', 'None of the above'],
    optsHi: ['₹ 12,000', '₹ 15,000', '₹ 10,000', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Expenditure = (60° / 360°) * 72000 = 1/6 * 72000 = ₹12,000.',
    solHi: 'शिक्षा पर खर्च = (60° / 360°) × 72000 = 1/6 × 72000 = ₹ 12,000।'
  }
];

async function seedMaths() {
  console.log('Seeding Mathematics questions for all 10 CSV topics...');

  let idCounter = Date.now();
  const formattedQuestions = mathsQuestionsRaw.map((q, idx) => ({
    qNo: `MTH-${idx + 1}`,
    numId: idCounter++,
    levels: ['prt', 'tgt68', 'tgt910', 'pgt1112'],
    paper: 'gs',
    subject: 'Mathematics',
    topic: q.topic,
    year: 2024,
    examName: 'BPSC TRE Practice',
    en: {
      q: q.enQ,
      opts: q.optsEn,
      sol: q.solEn
    },
    hi: {
      q: q.hiQ,
      opts: q.optsHi,
      sol: q.solHi
    },
    correct: q.correct,
    originalCorrectChar: String(q.correct + 1)
  }));

  // Update server/data/questions_cache.json
  const cachePath = path.join(rootDir, 'server', 'data', 'questions_cache.json');
  let existingCache = [];
  if (fs.existsSync(cachePath)) {
    try { existingCache = JSON.parse(fs.readFileSync(cachePath, 'utf-8')); } catch(e) {}
  }

  const nonMathsCache = existingCache.filter(q => q.subject !== 'Mathematics' && q.subject !== 'Maths');
  const newCache = [...nonMathsCache, ...formattedQuestions];

  fs.writeFileSync(cachePath, JSON.stringify(newCache, null, 2), 'utf-8');
  console.log(`Updated questions_cache.json. Total questions in cache: ${newCache.length}`);

  // Also save CSV to data/subjMathsPractise.csv
  const csvHeader = '"Subject","Topic","Q_No","Question_EN","Question_HI","Opt1_EN","Opt1_HI","Opt2_EN","Opt2_HI","Opt3_EN","Opt3_HI","Opt4_EN","Opt4_HI","Opt5_EN","Opt5_HI","Correct_Option","Sol_EN","Sol_HI"';
  const csvRows = formattedQuestions.map(q => {
    return [
      `"${q.subject}"`,
      `"${q.topic}"`,
      `"${q.qNo}"`,
      `"${q.en.q.replace(/"/g, '""')}"`,
      `"${q.hi.q.replace(/"/g, '""')}"`,
      `"${q.en.opts[0]}"`, `"${q.hi.opts[0]}"`,
      `"${q.en.opts[1]}"`, `"${q.hi.opts[1]}"`,
      `"${q.en.opts[2]}"`, `"${q.hi.opts[2]}"`,
      `"${q.en.opts[3]}"`, `"${q.hi.opts[3]}"`,
      `"${q.en.opts[4]}"`, `"${q.hi.opts[4]}"`,
      `"${q.originalCorrectChar}"`,
      `"${q.en.sol.replace(/"/g, '""')}"`,
      `"${q.hi.sol.replace(/"/g, '""')}"`
    ].join(',');
  });

  const fullCSV = [csvHeader, ...csvRows].join('\n');
  fs.writeFileSync(path.join(rootDir, 'data', 'subjMathsPractise.csv'), fullCSV, 'utf-8');
  console.log(`Saved ${formattedQuestions.length} Maths questions to data/subjMathsPractise.csv`);

  // Sync with MongoDB
  try {
    await mongoose.connect('mongodb://localhost:27017/abhyastre');
    await Question.deleteMany({ subject: { $in: ['Mathematics', 'Maths'] } });
    await Question.insertMany(formattedQuestions);
    console.log(`Successfully seeded ${formattedQuestions.length} Mathematics questions into MongoDB!`);
    await mongoose.disconnect();
  } catch (err) {
    console.warn('MongoDB sync skipped:', err.message);
  }
}

seedMaths().catch(console.error);
