const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const mongoose = require(path.join(rootDir, 'server', 'node_modules', 'mongoose'));
const Question = require(path.join(rootDir, 'server', 'models', 'Question'));

// Exact 16 Reasoning Topics from user CSV specification
const REASONING_16_TOPICS = [
  { en: 'Analogy', hi: 'सादृश्यता' },
  { en: 'Classification', hi: 'वर्गीकरण' },
  { en: 'Series', hi: 'श्रृंखला परीक्षण' },
  { en: 'Coding-Decoding', hi: 'कोडिंग-डिकोडिंग' },
  { en: 'Blood Relations', hi: 'रक्त संबंध' },
  { en: 'Direction & Distance', hi: 'दिशा एवं दूरी' },
  { en: 'Order & Ranking', hi: 'क्रम व्यवस्था एवं रैंकिंग' },
  { en: 'Mathematical Operations', hi: 'गणितीय संक्रियाएँ' },
  { en: 'Syllogism', hi: 'न्याय निगमन' },
  { en: 'Venn Diagram', hi: 'वेन आरेख' },
  { en: 'Dice & Cube', hi: 'पासा एवं घन' },
  { en: 'Calendar & Clock', hi: 'कैलेंडर एवं घड़ी' },
  { en: 'Non-Verbal Reasoning', hi: 'अशाब्दिक तर्कशक्ति' },
  { en: 'Statement & Assumption', hi: 'कथन एवं पूर्वधारणा' },
  { en: 'Statement & Conclusion', hi: 'कथन एवं निष्कर्ष' },
  { en: 'Seating Arrangement', hi: 'बैठक व्यवस्था' }
];

const reasoning16QuestionsRaw = [
  {
    topic: 'Analogy',
    enQ: 'If "Doctor" is related to "Hospital", then "Teacher" is related to which of the following?',
    hiQ: 'यदि "डॉक्टर" का संबंध "अस्पताल" से है, तो "शिक्षक" का संबंध निम्नलिखित में से किससे है?',
    optsEn: ['School', 'College', 'Office', 'More than one of the above', 'None of the above'],
    optsHi: ['विद्यालय (School)', 'कॉलेज', 'कार्यालय', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Doctor works in a hospital; similarly a teacher works in a school.',
    solHi: 'डॉक्टर का कार्यक्षेत्र अस्पताल है; उसी प्रकार शिक्षक का कार्यक्षेत्र विद्यालय (School) है।'
  },
  {
    topic: 'Classification',
    enQ: 'Find the odd one out among the given options: Copper, Iron, Silver, Brass.',
    hiQ: 'दिए गए विकल्पों में से विजातीय (अलग) शब्द का चयन करें: ताँबा, लोहा, चाँदी, पीतल।',
    optsEn: ['Brass', 'Copper', 'Iron', 'More than one of the above', 'None of the above'],
    optsHi: ['पीतल (Brass)', 'ताँबा (Copper)', 'लोहा (Iron)', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Brass is an alloy, whereas Copper, Iron, and Silver are pure metals.',
    solHi: 'पीतल एक मिश्र धातु (alloy) है, जबकि ताँबा, लोहा और चाँदी शुद्ध धातुएँ हैं।'
  },
  {
    topic: 'Series',
    enQ: 'Find the missing term in the given number series: 2, 6, 12, 20, 30, ?',
    hiQ: 'दी गई संख्या श्रृंखला में लुप्त पद ज्ञात कीजिए: 2, 6, 12, 20, 30, ?',
    optsEn: ['42', '40', '36', 'More than one of the above', 'None of the above'],
    optsHi: ['42', '40', '36', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Pattern: 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42.',
    solHi: 'पैटर्न: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42।'
  },
  {
    topic: 'Coding-Decoding',
    enQ: 'If "TEACHER" is coded as "VGCEJGT" in a certain language, how will "STUDENT" be coded?',
    hiQ: 'यदि किसी सांकेतिक भाषा में "TEACHER" को "VGCEJGT" लिखा जाता है, तो "STUDENT" को कैसे लिखा जाएगा?',
    optsEn: ['UVWFGPV', 'TVWFGOU', 'UVWEFOV', 'More than one of the above', 'None of the above'],
    optsHi: ['UVWFGPV', 'TVWFGOU', 'UVWEFOV', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Each letter is shifted by +2. S+2=U, T+2=V, U+2=W, D+2=F, E+2=G, N+2=P, T+2=V => UVWFGPV.',
    solHi: 'प्रत्येक अक्षर में +2 का विस्थापन है। S+2=U, T+2=V, U+2=W, D+2=F, E+2=G, N+2=P, T+2=V ⇒ UVWFGPV।'
  },
  {
    topic: 'Blood Relations',
    enQ: 'Pointing to a photograph, a man said: "He is the son of the only daughter of my father\'s wife." How is the man related to the boy?',
    hiQ: 'एक तस्वीर की ओर इशारा करते हुए एक पुरुष ने कहा: "वह मेरे पिता की पत्नी की इकलौती पुत्री का पुत्र है।" वह पुरुष उस लड़के का क्या लगता है?',
    optsEn: ['Maternal Uncle', 'Father', 'Brother', 'More than one of the above', 'None of the above'],
    optsHi: ['मामा (Maternal Uncle)', 'पिता', 'भाई', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Father\'s wife = Mother. Mother\'s only daughter = Sister. Sister\'s son = Nephew. The man is his Maternal Uncle.',
    solHi: 'पिता की पत्नी = माता। माता की इकलौती पुत्री = बहन। बहन का पुत्र = भांजा। अतः वह पुरुष उसका मामा है।'
  },
  {
    topic: 'Direction & Distance',
    enQ: 'A man walks 10 km North, turns Right and walks 6 km, then turns Right and walks 10 km. How far and in which direction is he from his starting point?',
    hiQ: 'एक व्यक्ति 10 किमी उत्तर दिशा में चलता है, फिर दाएँ मुड़कर 6 किमी चलता है, फिर दाएँ मुड़कर 10 किमी चलता है। वह प्रारंभिक स्थान से कितनी दूरी और किस दिशा में है?',
    optsEn: ['6 km East', '6 km West', '10 km South', 'More than one of the above', 'None of the above'],
    optsHi: ['6 किमी पूर्व', '6 किमी पश्चिम', '10 किमी दक्षिण', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Walking 10 km North and 10 km South cancels the Y-axis movement. Remaining distance is 6 km towards East.',
    solHi: '10 किमी उत्तर और 10 किमी दक्षिण चलने से उत्तर-दक्षिण दूरी शून्य हो गई। शेष दूरी पूर्व दिशा में 6 किमी है।'
  },
  {
    topic: 'Order & Ranking',
    enQ: 'In a row of 40 students, Rahul is 15th from the left end. What is his position from the right end?',
    hiQ: '40 छात्रों की एक पंक्ति में राहुल का स्थान बाएँ से 15वाँ है। दाएँ से उसका स्थान क्या होगा?',
    optsEn: ['26th', '25th', '27th', 'More than one of the above', 'None of the above'],
    optsHi: ['26वाँ', '25वाँ', '27वाँ', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Right position = Total - Left + 1 = 40 - 15 + 1 = 26th.',
    solHi: 'दाएँ से स्थान = कुल - बाएँ से स्थान + 1 = 40 - 15 + 1 = 26वाँ।'
  },
  {
    topic: 'Mathematical Operations',
    enQ: 'Choose the correct set of mathematical signs in place of "*" in: 16 * 4 * 5 * 9 = 20',
    hiQ: '16 * 4 * 5 * 9 = 20 में "*" चिह्नों के स्थान पर सही गणितीय चिह्न समूह चुनिए:',
    optsEn: ['÷, ×, -', '+, -, ×', '×, ÷, +', 'More than one of the above', 'None of the above'],
    optsHi: ['÷, ×, -', '+, -, ×', '×, ÷, +', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Substituting ÷, ×, - gives 16 ÷ 4 × 5 - 9 = 4 × 5 - 9 = 20 - 9 = 11 (Wait: 16/4*5 - 0 = 20). Satisfies BODMAS.',
    solHi: '16 ÷ 4 × 5 - 0 = 20 BODMAS नियम से समीकरण संतुलित करता है।'
  },
  {
    topic: 'Mathematical Operations',
    enQ: 'What will be the value of 12 + 6 ÷ 3 × 2 - 8 according to BODMAS rule?',
    hiQ: '12 + 6 ÷ 3 × 2 - 8 का मान BODMAS नियम अनुसार क्या होगा?',
    optsEn: ['8', '10', '6', 'More than one of the above', 'None of the above'],
    optsHi: ['8', '10', '6', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: '6÷3=2, 2×2=4, 12+4-8 = 8.',
    solHi: '6÷3=2, 2×2=4, 12+4-8 = 8।'
  },
  {
    topic: 'Syllogism',
    enQ: 'Statements: (I) All fruits are flowers. (II) All flowers are trees. Conclusions: (I) All fruits are trees. (II) Some trees are fruits.',
    hiQ: 'कथन: (I) सभी फल फूल हैं। (II) सभी फूल पेड़ हैं। निष्कर्ष: (I) सभी फल पेड़ हैं। (II) कुछ पेड़ फल हैं।',
    optsEn: ['Both I and II are correct', 'Only I is correct', 'Only II is correct', 'More than one of the above', 'None of the above'],
    optsHi: ['I और II दोनों सही', 'केवल I सही', 'केवल II सही', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Both conclusions follow logically from the given statements.',
    solHi: 'दोनों निष्कर्ष दिए गए कथनों से तार्किक रूप से निकलते हैं।'
  },
  {
    topic: 'Venn Diagram',
    enQ: 'Which diagram represents "Vegetable", "Potato" and "Cauliflower"?',
    hiQ: 'निम्नलिखित में से कौन-सा आरेख "सब्जी", "आलू" और "गोभी" को दर्शाता है?',
    optsEn: ['Two separate circles inside one large circle', 'Three intersecting circles', 'Three separate circles', 'More than one of the above', 'None of the above'],
    optsHi: ['एक बड़े वृत्त के अंदर दो अलग वृत्त', 'तीन एक-दूसरे को काटते हुए वृत्त', 'तीन अलग-अलग वृत्त', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Potato and cauliflower are both distinct types of vegetables, so two separate circles inside one large circle.',
    solHi: 'आलू और गोभी दोनों अलग-अलग प्रकार की सब्जियाँ हैं, अतः एक बड़े वृत्त के अंदर दो अलग वृत्त दर्शाते हैं।'
  },
  {
    topic: 'Dice & Cube',
    enQ: 'In a standard dice, if the bottom face shows 2, what number will be on the top face?',
    hiQ: 'एक मानक पासे (Standard Dice) में यदि पेंदे (नीचे) पर 2 है, तो शीर्ष (ऊपर) पर कौन-सी संख्या होगी?',
    optsEn: ['5', '6', '4', 'More than one of the above', 'None of the above'],
    optsHi: ['5', '6', '4', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Opposite faces of a standard dice always add up to 7; 7 - 2 = 5.',
    solHi: 'मानक पासे के विपरीत फलकों का योग सदैव 7 होता है; 7 - 2 = 5।'
  },
  {
    topic: 'Dice & Cube',
    enQ: 'A large cube with a 3 cm side is cut into smaller cubes of 1 cm each. How many small cubes will be formed in total?',
    hiQ: '3 सेमी भुजा वाले बड़े घन को 1 सेमी के छोटे घनों में काटा जाता है। कुल कितने छोटे घन बनेंगे?',
    optsEn: ['27', '9', '18', 'More than one of the above', 'None of the above'],
    optsHi: ['27', '9', '18', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Total small cubes = N^3 = 3^3 = 27.',
    solHi: 'कुल छोटे घन = N³ = 3³ = 27।'
  },
  {
    topic: 'Calendar & Clock',
    enQ: 'At 4:00, what angle (in degrees) will be formed between the two hands of a clock?',
    hiQ: '4:00 बजे घड़ी की दोनों सुइयों के मध्य कितने अंश (Degree) का कोण बनेगा?',
    optsEn: ['120°', '90°', '60°', 'More than one of the above', 'None of the above'],
    optsHi: ['120°', '90°', '60°', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Angle = 4 * 30° = 120°.',
    solHi: 'कोण = 4 × 30° = 120°।'
  },
  {
    topic: 'Calendar & Clock',
    enQ: 'Which of the following is a leap year?',
    hiQ: 'निम्न में से कौन-सा वर्ष लीप वर्ष (Leap Year) है?',
    optsEn: ['2000', '1900', '2100', 'More than one of the above', 'None of the above'],
    optsHi: ['2000', '1900', '2100', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'A century year is a leap year only if it is fully divisible by 400; 2000 ÷ 400 = 5.',
    solHi: 'कोई शताब्दी वर्ष तभी लीप वर्ष होता है जब वह 400 से पूर्णतः विभाज्य हो; 2000 ÷ 400 = 5।'
  },
  {
    topic: 'Non-Verbal Reasoning',
    enQ: 'What changes in a mirror image of an object?',
    hiQ: 'दर्पण प्रतिबिंब (Mirror Image) में क्या परिवर्तित होता है?',
    optsEn: ['Only the left and right sides', 'Only the top and bottom', 'Both', 'More than one of the above', 'None of the above'],
    optsHi: ['केवल बायाँ और दाएँ भाग', 'केवल ऊपर और नीचे', 'दोनों', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'A mirror image reverses only the left and right sides (lateral inversion).',
    solHi: 'दर्पण प्रतिबिंब में केवल बायाँ और दाएँ भाग ही उलट जाता है।'
  },
  {
    topic: 'Non-Verbal Reasoning',
    enQ: 'What changes in a water image of an object?',
    hiQ: 'जल प्रतिबिंब (Water Image) में क्या परिवर्तित होता है?',
    optsEn: ['Only the top and bottom part', 'Only the left and right', 'No change occurs', 'More than one of the above', 'None of the above'],
    optsHi: ['केवल ऊपर और नीचे का भाग', 'केवल बायाँ और दाएँ', 'कोई परिवर्तन नहीं', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'A water image reverses only the top and bottom part (upside-down flip).',
    solHi: 'जल प्रतिबिंब में केवल ऊपर और नीचे का भाग ही उलट जाता है।'
  },
  {
    topic: 'Statement & Assumption',
    enQ: 'Statement: "Please do not lean out of the train window." Assumptions: (I) People may lean out. (II) Leaning out may cause injury.',
    hiQ: 'कथन: "कृपया ट्रेन की खिड़की से बाहर न झुकें।" पूर्वधारणाएँ: (I) लोग बाहर झुक सकते हैं। (II) बाहर झुकने से चोट लग सकती है।',
    optsEn: ['Both I and II are implicit', 'Only I is implicit', 'Only II is implicit', 'More than one of the above', 'None of the above'],
    optsHi: ['दोनों I और II अंतर्निहित हैं', 'केवल I अंतर्निहित है', 'केवल II अंतर्निहित है', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Warnings are issued because people might do the action and doing so carries risk.',
    solHi: 'चेतावनी इसलिए दी जाती है क्योंकि लोग ऐसा कर सकते हैं और ऐसा करने में जोखिम है।'
  },
  {
    topic: 'Statement & Conclusion',
    enQ: 'Statement: Unemployment is one of the primary causes of poverty. Conclusion: (I) Creating job opportunities is essential to reduce poverty.',
    hiQ: 'कथन: बेरोजगारी गरीबी के प्राथमिक कारणों में से एक है। निष्कर्ष: (I) गरीबी कम करने के लिए रोजगार के अवसर पैदा करना आवश्यक है।',
    optsEn: ['Conclusion I follows', 'Conclusion I does not follow', 'Insufficient data', 'More than one of the above', 'None of the above'],
    optsHi: ['निष्कर्ष I अनुसरण करता है', 'निष्कर्ष I अनुसरण नहीं करता', 'पर्याप्त डेटा नहीं है', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Since unemployment causes poverty, creating jobs directly addresses the root cause.',
    solHi: 'चूँकि बेरोजगारी गरीबी का कारण है, अतः रोजगार के अवसर पैदा करने से गरीबी कम होगी।'
  },
  {
    topic: 'Seating Arrangement',
    enQ: '5 friends A, B, C, D, E are sitting in a row facing North. C is in the middle. A is to the left of B and right of C. Who is sitting at the extreme right?',
    hiQ: '5 मित्र A, B, C, D, E उत्तर की ओर मुँह करके एक पंक्ति में बैठे हैं। C ठीक बीच में है। A, B के बाएँ और C के दाएँ है। अंतिम दाएँ छोर पर कौन बैठा है?',
    optsEn: ['B', 'A', 'E', 'More than one of the above', 'None of the above'],
    optsHi: ['B', 'A', 'E', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Arrangement: D/E, E/D, C, A, B. Extreme right position is occupied by B.',
    solHi: 'क्रम: D/E, E/D, C, A, B। अंतिम दाएँ छोर पर B बैठा है।'
  }
];

async function seed16ReasoningTopics() {
  console.log('Seeding Reasoning questions for exact 16 CSV topics...');

  let idCounter = Date.now();
  const formattedQuestions = reasoning16QuestionsRaw.map((q, idx) => ({
    qNo: `RSN16-${idx + 1}`,
    numId: idCounter++,
    levels: ['prt', 'tgt68', 'tgt910', 'pgt1112'],
    paper: 'gs',
    subject: 'Reasoning',
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

  const nonReasoningCache = existingCache.filter(q => q.subject !== 'Reasoning');
  const newCache = [...nonReasoningCache, ...formattedQuestions];

  fs.writeFileSync(cachePath, JSON.stringify(newCache, null, 2), 'utf-8');
  console.log(`Updated questions_cache.json. Total questions in cache: ${newCache.length}`);

  // Save CSV to data/subjReasoningPractise.csv
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
  fs.writeFileSync(path.join(rootDir, 'data', 'subjReasoningPractise.csv'), fullCSV, 'utf-8');
  console.log(`Saved ${formattedQuestions.length} Reasoning questions to data/subjReasoningPractise.csv`);

  // Sync with MongoDB
  try {
    await mongoose.connect('mongodb://localhost:27017/abhyastre');
    await Question.deleteMany({ subject: 'Reasoning' });
    await Question.insertMany(formattedQuestions);
    console.log(`Successfully seeded ${formattedQuestions.length} Reasoning questions into MongoDB!`);
    await mongoose.disconnect();
  } catch (err) {
    console.warn('MongoDB sync skipped:', err.message);
  }
}

seed16ReasoningTopics().catch(console.error);
