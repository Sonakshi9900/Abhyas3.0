const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
const mongoose = require(path.join(rootDir, 'server', 'node_modules', 'mongoose'));
const Question = require(path.join(rootDir, 'server', 'models', 'Question'));

// 20 Reasoning Topics for BPSC TRE
const REASONING_TOPICS = [
  { en: 'Analogy', hi: 'सादृश्यता' },
  { en: 'Classification & Odd One Out', hi: 'वर्गीकरण' },
  { en: 'Series & Pattern Completion', hi: 'श्रृंखला परीक्षण' },
  { en: 'Coding-Decoding', hi: 'कोडिंग-डिकोडिंग' },
  { en: 'Blood Relations', hi: 'रक्त संबंध' },
  { en: 'Direction & Distance', hi: 'दिशा एवं दूरी परीक्षण' },
  { en: 'Order & Ranking', hi: 'क्रम व्यवस्था एवं रैंकिंग' },
  { en: 'Syllogism', hi: 'न्याय निगमन' },
  { en: 'Venn Diagrams', hi: 'वेन आरेख' },
  { en: 'Seating Arrangement', hi: 'बैठक व्यवस्था' },
  { en: 'Clock & Calendar', hi: 'घड़ी एवं कैलेंडर' },
  { en: 'Mathematical Operations', hi: 'गणितीय संक्रियाएँ' },
  { en: 'Statement & Assumptions', hi: 'कथन एवं पूर्वधारणाएँ' },
  { en: 'Statement & Conclusion', hi: 'कथन एवं निष्कर्ष' },
  { en: 'Cube, Dice & Counting Figures', hi: 'घन, पासा एवं आकृतियाँ' },
  { en: 'Mirror & Water Image', hi: 'दर्पण एवं जल प्रतिबिंब' },
  { en: 'Paper Folding & Cutting', hi: 'कागज मोड़ना एवं काटना' },
  { en: 'Embedded Figures', hi: 'सन्निहित आकृतियाँ' },
  { en: 'Data Sufficiency', hi: 'आंकड़ा पर्याप्तता' },
  { en: 'Logical Reasoning & Decision Making', hi: 'तार्किक तर्कशक्ति एवं निर्णय' }
];

const reasoningQuestionsRaw = [
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
    topic: 'Classification & Odd One Out',
    enQ: 'Find the odd one out among the given options: Copper, Iron, Silver, Brass.',
    hiQ: 'दिए गए विकल्पों में से विजातीय (अलग) शब्द का चयन करें: ताँबा, लोहा, चाँदी, पीतल।',
    optsEn: ['Brass', 'Copper', 'Iron', 'More than one of the above', 'None of the above'],
    optsHi: ['पीतल (Brass)', 'ताँबा (Copper)', 'लोहा (Iron)', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Brass is an alloy, whereas Copper, Iron, and Silver are pure metals.',
    solHi: 'पीतल एक मिश्र धातु (alloy) है, जबकि ताँबा, लोहा और चाँदी शुद्ध धातुएँ हैं।'
  },
  {
    topic: 'Series & Pattern Completion',
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
    topic: 'Syllogism',
    enQ: 'Statements: All apples are fruits. All fruits are healthy. Conclusions: I. All apples are healthy. II. Some healthy items are apples.',
    hiQ: 'कथन: सभी सेब फल हैं। सभी फल स्वास्थ्यवर्धक हैं। निष्कर्ष: I. सभी सेब स्वास्थ्यवर्धक हैं। II. कुछ स्वास्थ्यवर्धक वस्तुएँ सेब हैं।',
    optsEn: ['Both I and II follow', 'Only I follows', 'Only II follows', 'More than one of the above', 'None of the above'],
    optsHi: ['दोनों I और II अनुसरण करते हैं', 'केवल I अनुसरण करता है', 'केवल II अनुसरण करता है', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'All Apples ⊂ Fruits ⊂ Healthy. Therefore, all apples are healthy and some healthy items are apples.',
    solHi: 'सभी सेब ⊂ फल ⊂ स्वास्थ्यवर्धक। अतः सभी सेब स्वास्थ्यवर्धक हैं तथा कुछ स्वास्थ्यवर्धक वस्तुएँ भी सेब हैं।'
  },
  {
    topic: 'Venn Diagrams',
    enQ: 'Which of the following Venn diagrams correctly represents the relationship between Animals, Dogs, and Cats?',
    hiQ: 'निम्नलिखित में से कौन सा वेन आरेख "जानवर, कुत्ते और बिल्ली" के बीच के संबंध को सही रूप से निरूपित करता है?',
    optsEn: ['Two separate circles inside one big circle', 'Three intersecting circles', 'Three concentric circles', 'More than one of the above', 'None of the above'],
    optsHi: ['एक बड़े वृत्त के अंदर दो अलग वृत्त', 'तीन प्रतिच्छेदी वृत्त', 'तीन संकेंद्री वृत्त', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Both Dogs and Cats are Animals, but Dogs and Cats are mutually exclusive sets.',
    solHi: 'कुत्ते और बिल्ली दोनों जानवर वर्ग में आते हैं, परंतु कुत्ते और बिल्ली परस्पर भिन्न (अलग) वर्ग हैं।'
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
  },
  {
    topic: 'Clock & Calendar',
    enQ: 'What is the angle between the hour hand and minute hand of a clock at 4:20?',
    hiQ: '4:20 बजे घड़ी की घंटे और मिनट की सुइयों के बीच कितने डिग्री का कोण होगा?',
    optsEn: ['10°', '0°', '15°', 'More than one of the above', 'None of the above'],
    optsHi: ['10°', '0°', '15°', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Angle formula = |30H - 5.5M| = |30(4) - 5.5(20)| = |120 - 110| = 10°.',
    solHi: 'कोण का सूत्र = |30H - 5.5M| = |30(4) - 5.5(20)| = |120 - 110| = 10°।'
  },
  {
    topic: 'Mathematical Operations',
    enQ: 'If "+" means "×", "-" means "÷", "×" means "-", and "÷" means "+", evaluate: 12 + 6 - 3 × 4 ÷ 8.',
    hiQ: 'यदि "+" का अर्थ "×", "-" का अर्थ "÷", "×" का अर्थ "-" और "÷" का अर्थ "+" हो, तो 12 + 6 - 3 × 4 ÷ 8 का मान क्या होगा?',
    optsEn: ['28', '24', '32', 'More than one of the above', 'None of the above'],
    optsHi: ['28', '24', '32', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: '12 × 6 ÷ 3 - 4 + 8 = 12 × 2 - 4 + 8 = 24 - 4 + 8 = 28.',
    solHi: '12 × 6 ÷ 3 - 4 + 8 = 12 × 2 - 4 + 8 = 24 - 4 + 8 = 28।'
  },
  {
    topic: 'Statement & Assumptions',
    enQ: 'Statement: "Please do not lean out of the train window." Assumptions: I. People may lean out. II. Leaning out may cause injury.',
    hiQ: 'कथन: "कृपया ट्रेन की खिड़की से बाहर न झुकें।" पूर्वधारणाएँ: I. लोग बाहर झुक सकते हैं। II. बाहर झुकने से चोट लग सकती है।',
    optsEn: ['Both I and II are implicit', 'Only I is implicit', 'Only II is implicit', 'More than one of the above', 'None of the above'],
    optsHi: ['दोनों I और II अंतर्निहित हैं', 'केवल I अंतर्निहित है', 'केवल II अंतर्निहित है', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Warnings are issued because people might do the action and doing so carries risk.',
    solHi: 'चेतावनी इसलिए दी जाती है क्योंकि लोग ऐसा कर सकते हैं और ऐसा करने में जोखिम है।'
  },
  {
    topic: 'Statement & Conclusion',
    enQ: 'Statement: Unemployment is one of the primary causes of poverty in developing nations. Conclusion: I. Creating job opportunities is essential to reduce poverty.',
    hiQ: 'कथन: विकासशील देशों में बेरोजगारी गरीबी के प्राथमिक कारणों में से एक है। निष्कर्ष: I. गरीबी कम करने के लिए रोजगार के अवसर पैदा करना आवश्यक है।',
    optsEn: ['Conclusion I follows', 'Conclusion I does not follow', 'Insufficient data', 'More than one of the above', 'None of the above'],
    optsHi: ['निष्कर्ष I अनुसरण करता है', 'निष्कर्ष I अनुसरण नहीं करता', 'पर्याप्त डेटा नहीं है', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Since unemployment causes poverty, creating jobs directly addresses the root cause.',
    solHi: 'चूँकि बेरोजगारी गरीबी का कारण है, अतः रोजगार के अवसर पैदा करने से गरीबी कम होगी।'
  },
  {
    topic: 'Cube, Dice & Counting Figures',
    enQ: 'Two positions of a standard dice are shown. If 3 is on the top face, which number will be on the bottom face?',
    hiQ: 'एक मानक पासे की दो स्थितियाँ दर्शाई गई हैं। यदि ऊपर की सतह पर 3 है, तो नीचे की सतह पर कौन सी संख्या होगी?',
    optsEn: ['4', '1', '6', 'More than one of the above', 'None of the above'],
    optsHi: ['4', '1', '6', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'In a standard dice, opposite faces sum up to 7. Opposite of 3 is 7 - 3 = 4.',
    solHi: 'मानक पासे में विपरीत सतहों का योग 7 होता है। 3 की विपरीत सतह = 7 - 3 = 4।'
  },
  {
    topic: 'Mirror & Water Image',
    enQ: 'What will be the correct mirror image of the word "BPSC" when the mirror is placed to its right?',
    hiQ: 'जब दर्पण दाएँ रखा जाए तो "BPSC" शब्द का सही दर्पण प्रतिबिंब क्या होगा?',
    optsEn: ['Reversed letters CS-P-B in mirror form', 'Direct BPSC', 'Inverted BPSC', 'More than one of the above', 'None of the above'],
    optsHi: ['दर्पण रूप में उल्टे अक्षर CS-P-B', 'सीधा BPSC', 'उल्टा BPSC', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Mirror image reverses the order of characters from right to left with lateral inversion.',
    solHi: 'दर्पण प्रतिबिंब में अक्षरों का क्रम दाएँ से बाएँ बदलता है तथा अक्षर पार्श्व उल्टे हो जाते हैं।'
  },
  {
    topic: 'Paper Folding & Cutting',
    enQ: 'A square sheet of paper is folded into half twice and a circular hole is punched at the corner. How many holes appear when opened?',
    hiQ: 'एक वर्गाकार कागज को दो बार आधा मोड़कर कोने पर एक गोलाकार छिद्र किया जाता है। खोलने पर कुल कितने छिद्र दिखाई देंगे?',
    optsEn: ['4 holes', '2 holes', '8 holes', 'More than one of the above', 'None of the above'],
    optsHi: ['4 छिद्र (4 holes)', '2 छिद्र', '8 छिद्र', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Folding twice creates 4 layers of paper. A single punch passes through all 4 layers.',
    solHi: 'दो बार मोड़ने पर कागज 4 परतों वाला बनता है। एक बार छेद करने पर चारों परतों में कुल 4 छिद्र बनेंगे।'
  },
  {
    topic: 'Embedded Figures',
    enQ: 'Which option figure contains the given question pattern hidden/embedded inside it?',
    hiQ: 'किस उत्तर आकृति में दी गई प्रश्न आकृति समाहित (hidden/embedded) है?',
    optsEn: ['Option Figure A', 'Option Figure B', 'Option Figure C', 'More than one of the above', 'None of the above'],
    optsHi: ['उत्तर आकृति A', 'उत्तर आकृति B', 'उत्तर आकृति C', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Option A contains the exact line segments forming the embedded question shape.',
    solHi: 'उत्तर आकृति A में दी गई प्रश्न आकृति की सभी रेखाएँ स्पष्ट रूप से समाहित हैं।'
  },
  {
    topic: 'Data Sufficiency',
    enQ: 'Is X greater than Y? Statement 1: X - Y = 5. Statement 2: X = 10.',
    hiQ: 'क्या X, Y से बड़ा है? कथन 1: X - Y = 5। कथन 2: X = 10।',
    optsEn: ['Statement 1 alone is sufficient', 'Statement 2 alone is sufficient', 'Both statements together are required', 'More than one of the above', 'None of the above'],
    optsHi: ['केवल कथन 1 पर्याप्त है', 'केवल कथन 2 पर्याप्त है', 'दोनों कथनों की आवश्यकता है', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'From Statement 1: X - Y = 5 => X = Y + 5, which directly proves X > Y.',
    solHi: 'कथन 1 से: X - Y = 5 ⇒ X = Y + 5, जिससे सीधे सिद्ध होता है कि X, Y से बड़ा है।'
  },
  {
    topic: 'Logical Reasoning & Decision Making',
    enQ: 'If all Zips are Zaps and all Zaps are Zops, are all Zips necessarily Zops?',
    hiQ: 'यदि सभी जिप, जैप हैं और सभी जैप, जोप हैं, तो क्या सभी जिप अनिवार्य रूप से जोप होंगे?',
    optsEn: ['Yes, All Zips are Zops', 'No, only some are Zops', 'Cannot be determined', 'More than one of the above', 'None of the above'],
    optsHi: ['हाँ, सभी जिप जोप हैं', 'नहीं, केवल कुछ जोप हैं', 'निर्धारित नहीं किया जा सकता', 'उपर्युक्त में से एक से अधिक', 'उपर्युक्त में से कोई नहीं'],
    correct: 0,
    solEn: 'Transitive property: Zips ⊂ Zaps ⊂ Zops => Zips ⊂ Zops.',
    solHi: 'संक्रामक नियम: जिप ⊂ जैप ⊂ जोप ⇒ सभी जिप जोप होंगे।'
  }
];

async function seedReasoning() {
  console.log('Seeding Reasoning questions for all 20 topics...');

  let idCounter = Date.now();
  const formattedQuestions = reasoningQuestionsRaw.map((q, idx) => ({
    qNo: `RSN-${idx + 1}`,
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

seedReasoning().catch(console.error);
