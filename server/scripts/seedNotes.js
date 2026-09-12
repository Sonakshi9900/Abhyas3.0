const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Note = require('../models/Note');
const connectDB = require('../config/db');

const initialNotesData = [
  /* ============================================================
     SUBJECT S-01: Contemporary Indian Society and Education
  ============================================================= */
  {
    year: '2nd',
    subjectCode: 'S-01',
    subjectNameEn: 'Contemporary Indian Society and Education (S-01)',
    subjectNameHi: 'समकालीन भारतीय समाज में शिक्षा (S-01)',
    language: 'hi',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-01][(hi)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-01][(hi)][1].pdf',
    author: 'AEPS Official (Gaurav Verma)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Study Notes for S-01 (Units 1-5 in Hindi)',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-01 (इकाई 1 से 5 संपूर्ण नोट्स - AEPS ऑफिशियल)',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Challenges of Contemporary Indian Society and Education',
        titleHi: 'इकाई 1: समकालीन भारतीय समाज की चुनौतियाँ और शिक्षा',
        topics: [
          {
            titleEn: '1. Diversity, Inequality and Deprivation',
            titleHi: '1. विविधता, असमानता तथा वंचना',
            contentEn: 'Diversity: Variations in language, religion, culture, and traditions. Inequality: Differences in society based on caste, gender, and economics. Deprivation: Lack of access to education, health, and resources.',
            contentHi: 'विविधता – भारत में भाषा, धर्म, संस्कृति और परंपराओं की भिन्नता। असमानता – जाति, लिंग और आर्थिक आधार पर अंतर। वंचना – शिक्षा, स्वास्थ्य और संसाधनों से वंचित रहना।'
          },
          {
            titleEn: '2. Authority, Hegemony and Resistance',
            titleHi: '2. सत्ता, वर्चस्व तथा प्रतिरोध',
            contentEn: 'Authority: The legitimate power to govern. Hegemony: Dominance of a particular group. Resistance: Struggle against injustice and discrimination.',
            contentHi: 'सत्ता – समाज को नियंत्रित करने और निर्णय लेने की शक्ति। वर्चस्व – किसी वर्ग का दूसरों पर प्रभुत्व। प्रतिरोध – अन्याय के विरुद्ध संघर्ष।'
          }
        ]
      }
    ]
  },
  {
    year: '2nd',
    subjectCode: 'S-01',
    subjectNameEn: 'Contemporary Indian Society and Education (S-01)',
    subjectNameHi: 'समकालीन भारतीय समाज में शिक्षा (S-01)',
    language: 'en',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-01][(en)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-01][(en)][1].pdf',
    author: 'AEPS Official (English Edition)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Study Notes S-01 in English (Option 1)',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-01 के अंग्रेज़ी माध्यम के नोट्स (विकल्प 1)',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Diversity, Inequality and Deprivation',
        titleHi: 'इकाई 1: विविधता, असमानता तथा वंचना',
        topics: [
          {
            titleEn: 'Core Concepts of Diversity & Equity',
            titleHi: 'विविधता एवं समता की मूल अवधारणाएँ',
            contentEn: 'Explores regional, linguistic, religious and cultural diversity in India and methods to reduce educational inequality.',
            contentHi: 'भारत में क्षेत्रीय, भाषाई और सांस्कृतिक विविधता तथा शैक्षिक असमानता दूर करने के उपाय।'
          }
        ]
      }
    ]
  },

  /* ============================================================
     SUBJECT S-02: Cognition, Learning and Child Development
     (संज्ञान, सीखना और बाल विकास)
  ============================================================= */
  {
    year: '2nd',
    subjectCode: 'S-02',
    subjectNameEn: 'Cognition, Learning and Child Development (S-02)',
    subjectNameHi: 'संज्ञान, सीखना और बाल विकास (S-02)',
    language: 'en',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-02][(en)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-02][(en)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Complete Notes S-02 (Cognition & Learning - Session 2024-26)',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-02 (संज्ञान, सीखना और बाल विकास - 2024-26 नोट्स)',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Cognitive and Concept Development in Children',
        titleHi: 'इकाई 1: बच्चों में संज्ञानात्मक एवं अवधारणात्मक विकास',
        topics: [
          {
            titleEn: 'Cognitive Development & Jean Piaget\'s Theory (4 Stages & Schemas)',
            titleHi: 'संज्ञानात्मक विकास एवं जिन पियाजे का सिद्धांत (4 चरण एवं स्कीमा)',
            contentEn: 'Cognition includes mental abilities like intelligence, memory, attention, thinking and problem solving. Jean Piaget propounded 4 stages: 1. Sensorimotor (0-2y), 2. Pre-operational (2-6y), 3. Concrete Operational (6-11y), 4. Formal Operational (11-15y+). Key concepts: Schema, Organization, Adaptation, Assimilation, Accommodation, Equilibrium, Serialization.',
            contentHi: 'संज्ञान में अवधान, स्मृति, तर्क और समस्या समाधान की मानसिक क्षमताएँ शामिल हैं। जिन पियाजे ने 4 चरण दिए: संवेदी-गामक (0-2 वर्ष), पूर्व-संक्रियात्मक (2-6 वर्ष), मूर्त-संक्रियात्मक (6-11 वर्ष) एवं औपचारिक-संक्रियात्मक (11-15+ वर्ष)। प्रमुख अवधारणाएँ: स्कीमा, संगठन, आत्मसातीकरण, समंजन एवं संतुलन।'
          },
          {
            titleEn: 'Howard Gardner\'s Multiple Intelligences & Jerome Bruner\'s 3 Stages',
            titleHi: 'हावर्ड गार्डनर का बहु-बुद्धि सिद्धांत एवं ब्रूनर के 3 चरण',
            contentEn: 'Gardner (1983) proposed 8 Intelligences: Linguistic, Logical-Mathematical, Spatial ("ART Smart"), Bodily-Kinesthetic ("Body Smart"), Musical, Interpersonal, Intrapersonal, Naturalistic. Bruner\'s 3 Cognitive Stages: 1. Enactive (0-18m), 2. Iconic (18-24m), 3. Symbolic (7y+).',
            contentHi: 'गार्डनर ने 8 प्रकार की बुद्धि बताई: भाषाई, तार्किक-गणितीय, स्थानिक, शारीरिक-गतिक, संगीतात्मक, व्यक्तिगत-पर, व्यक्तिगत-स्व एवं प्राकृतिक। ब्रूनर के 3 चरण: सक्रियता (0-18 माह), दृश्य-प्रतिमा (18-24 माह) एवं सांकेतिक (7 वर्ष से आगे)।'
          }
        ]
      },
      {
        unitNum: 2,
        titleEn: 'Unit 2: Children Development and Learning Interrelationship',
        titleHi: 'इकाई 2: बाल विकास एवं अधिगम का अंतरसंबंध',
        topics: [
          {
            titleEn: 'Growth vs Development & Human Developmental Stages',
            titleHi: 'अभिवृद्धि बनाम विकास एवं मानव विकास के चरण',
            contentEn: 'Growth is quantitative physical increase (height/weight) that stops at adulthood. Development is a lifelong, qualitative and quantitative process across physical, cognitive, emotional, and social dimensions. Stages: Prenatal, Infancy (0-2y), Early Childhood (2-6y), Later Childhood (6-11y), Adolescence (11-18y), Adulthood.',
            contentHi: 'अभिवृद्धि मात्रात्मक शारीरिक वृद्धि (ऊँचाई/वजन) है जो प्रौढ़ावस्था में रुक जाती है। विकास जीवन पर्यंत चलने वाली गुणात्मक एवं मात्रात्मक प्रक्रिया है। चरण: गर्भावस्था, शैशवावस्था (0-2 वर्ष), प्रारंभिक बाल्यावस्था (2-6 वर्ष), उत्तर बाल्यावस्था (6-11 वर्ष), किशोरावस्था (11-18 वर्ष)।'
          },
          {
            titleEn: 'Maturation & Learning Disabilities (Dyslexia, Dysgraphia, Dyscalculia, ADHD)',
            titleHi: 'परिपक्वता एवं अधिगम अक्षमताएँ (डिसलेक्सिया, डिसग्राफिया, डिसकैलकुलिया, ADHD)',
            contentEn: 'Maturation is biological functional readiness. Learning Disabilities: 1. Dyslexia (Reading difficulty: confuse B-D, SAW-WAS), 2. Dysgraphia (Writing difficulty), 3. Dyscalculia (Math calculation difficulty), 4. Dyspraxia (Motor skills), 5. Dysmorphia, 6. ADHD (Attention Deficit).',
            contentHi: 'परिपक्वता जैविक क्षमता है। अधिगम विकार: 1. डिसलेक्सिया (पठन विकार), 2. डिसग्राफिया (लेखन विकार), 3. डिसकैलकुलिया (गणितीय गणना विकार), 4. डिसप्राक्सिया (गामक कौशल), 5. ADHD (अवधान की कमी)।'
          }
        ]
      },
      {
        unitNum: 3,
        titleEn: 'Unit 3: Behavioural and Information Processing Theories',
        titleHi: 'इकाई 3: व्यवहारात्मक एवं सूचना प्रसंस्करण सिद्धांत',
        topics: [
          {
            titleEn: 'Pavlov\'s Classical Conditioning, Skinner\'s Operant Conditioning & Information Processing',
            titleHi: 'पावलोव का अनुबंधन, स्किनर का क्रिया-प्रसूति एवं सूचना प्रसंस्करण मॉडल',
            contentEn: 'Pavlov\'s Classical Conditioning (Dog experiment with bell, food, natural/conditioned stimulus). Skinner\'s Operant Conditioning (Rat in Skinner Box, lever press reinforcement). Memory Model: 1. Sensory Memory (1s), 2. Short-Term Memory (15-30s), 3. Long-Term Memory (permanent).',
            contentHi: 'पावलोव का शास्त्रीय अनुबंधन (कुत्ते और घंटी का प्रयोग)। स्किनर का क्रिया-प्रसूति अनुबंधन (स्किनर बॉक्स में चूहे का प्रयोग)। स्मृति के 3 भंडार: संवेदी स्मृति (1 से.), अल्पकालिक स्मृति (15-30 से.) एवं दीर्घकालिक स्मृति (स्थायी)।'
          }
        ]
      },
      {
        unitNum: 4,
        titleEn: 'Unit 4: Bandura & Vygotsky Social Learning Theories',
        titleHi: 'इकाई 4: बांडुरा एवं वाइगोत्स्की का सामाजिक अधिगम सिद्धांत',
        topics: [
          {
            titleEn: 'Albert Bandura\'s Social Learning & Lev Vygotsky\'s ZPD',
            titleHi: 'अल्बर्ट बांडुरा का सामाजिक अधिगम एवं लेव वाइगोत्स्की का ZPD',
            contentEn: 'Bandura\'s Social Learning Theory (Bobo doll experiment: 4 steps - Attention, Retention, Reproduction, Reinforcement). Vygotsky\'s Social Development Theory: Culture, Zone of Proximal Development (ZPD), Scaffolding (support), Collaborative Learning & Reciprocal Teaching.',
            contentHi: 'बांडुरा का सामाजिक अधिगम (बोबो डॉल प्रयोग, 4 चरण: अवधान, धारणा, पुनः प्रस्तुतीकरण, प्रबलन)। वाइगोत्स्की का सिद्धांत: समाज एवं संस्कृति की भूमिका, समीपस्थ विकास का क्षेत्र (ZPD), पाड़ (Scaffolding), सहयोगात्मक अधिगम।'
          }
        ]
      },
      {
        unitNum: 5,
        titleEn: 'Unit 5: Factors Affecting Learning & Motivation',
        titleHi: 'इकाई 5: अधिगम को प्रभावित करने वाले कारक एवं अभिप्रेरणा',
        topics: [
          {
            titleEn: 'Motivation (Intrinsic vs Extrinsic), Attention & Memory',
            titleHi: 'अभिप्रेरणा (आंतरिक बनाम बाह्य), अवधान एवं स्मृति',
            contentEn: 'Motivation (Latin "MOVE"): Intrinsic vs Extrinsic motivation. Skinner called motivation the highway to learning. Attention features and external factors. Characteristics of good memory: quick recall, retention durability.',
            contentHi: 'अभिप्रेरणा (आंतरिक एवं बाह्य)। स्किनर ने अभिप्रेरणा को अधिगम का राजमार्ग कहा। अवधान की विशेषताएँ तथा अच्छी स्मृति के गुण।'
          }
        ]
      }
    ]
  },
  {
    year: '2nd',
    subjectCode: 'S-02',
    subjectNameEn: 'Cognition, Learning and Child Development (S-02)',
    subjectNameHi: 'संज्ञान, सीखना और बाल विकास (S-02)',
    language: 'hi',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-02][(hi)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-02][(hi)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Notes S-02 in Hindi (Option 1)',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-02 (संज्ञान, सीखना और बाल विकास) हस्तलिखित नोट्स (हिंदी)',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Cognition & Cognitive Processes',
        titleHi: 'इकाई 1: संज्ञान एवं संज्ञानात्मक प्रक्रियाएँ',
        topics: [
          {
            titleEn: 'Cognitive Development & Piaget Stages',
            titleHi: 'संज्ञानात्मक विकास एवं पियाजे के चरण',
            contentEn: 'Mental processes like memory, attention, and reasoning. Piaget\'s 4 stages of development.',
            contentHi: 'स्मृति, अवधान और तर्क जैसी मानसिक प्रक्रियाएँ। जिन पियाजे के संज्ञानात्मक विकास के 4 चरण।'
          }
        ]
      }
    ]
  },

  /* ============================================================
     SUBJECT S-04: Understanding of the Self (स्व की समझ)
  ============================================================= */
  {
    year: '2nd',
    subjectCode: 'S-04',
    subjectNameEn: 'Understanding of the Self (S-04)',
    subjectNameHi: 'स्व की समझ (S-04)',
    language: 'en',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-04][(en)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-04][(en)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Complete Notes S-04 (Understanding of the Self in English)',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-04 (स्व की समझ) संपूर्ण नोट्स (हिंदी/अंग्रेज़ी)',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Understanding Oneself as a Person',
        titleHi: 'इकाई 1: व्यक्ति के रूप में स्व की समझ',
        topics: [
          {
            titleEn: 'Persona, Personality Definitions & Carl Jung\'s 3 Types',
            titleHi: 'व्यक्तित्व की परिभाषाएँ एवं जुंग के 3 प्रकार',
            contentEn: 'Definitions: Guilford ("Coordinated form of qualities"), Woodworth ("Overall characteristics"), Allport ("Environmental adjustment"). Carl Jung classified personality into: 1. Introvert (quiet, contemplative, good writers), 2. Extrovert (outgoing, social, leaders), 3. Ambivert / Ambidextrous (mixture of both).',
            contentHi: 'व्यक्तित्व की परिभाषाएँ (गिल्फोर्ड, वुडवर्थ, ऑलपोर्ट)। कार्ल जुंग के 3 प्रकार: 1. अंतर्मुखी (शांत, चिंतनशील, अच्छे लेखक), 2. बहिर्मुखी (सामाजिक, आशावादी, नेता), 3. उभयमुखी (दोनों का मिश्रण)।'
          },
          {
            titleEn: 'Self vs Ego & Personal vs Social Identity',
            titleHi: 'स्व बनाम अहम् एवं व्यक्तिगत बनाम सामाजिक पहचान',
            contentEn: 'Self creates self-confidence and positive emotions. Ego involves narrow mindset and anger. Social Identity (Tajfel 1979 - belonging to group) vs Personal Identity (stable individual traits).',
            contentHi: 'स्व (Self) आत्मविश्वास पैदा करता है। अहम् (Ego) संकीर्ण सोच और क्रोध लाता है। सामाजिक पहचान (ताजफेल 1979) समूह से जुड़ने पर बनती है जबकि व्यक्तिगत पहचान स्थिर होती है।'
          },
          {
            titleEn: 'Self Portrait, Swabhiman (Self-Respect) & Motivation',
            titleHi: 'आत्मचित्रण, स्वाभिमान एवं अभिप्रेरणा',
            contentEn: 'Self Portrait is a medium of self-evaluation for trainee teachers. Swabhiman (Self-Respect) brings mental peace; Pride/Arrogance leads to downfall. Intrinsic vs Extrinsic motivation (Skinner highway to learning). Teacher Profile: Strengths vs Weaknesses.',
            contentHi: 'आत्मचित्रण शिक्षक के आत्म-मूल्यांकन का माध्यम है। स्वाभिमान मानसिक शांति लाता है जबकि अहंकार पतन का कारण बनता है। आंतरिक एवं बाह्य अभिप्रेरणा। शिक्षक की शक्तियाँ और कमजोरियाँ।'
          }
        ]
      },
      {
        unitNum: 2,
        titleEn: 'Unit 2: Awareness of One\'s Identity & Ideal Teacher Concept',
        titleHi: 'इकाई 2: अपनी पहचान की जागरूकता एवं आदर्श शिक्षक',
        topics: [
          {
            titleEn: 'Identity of Teacher & NCF-2005 Perspective',
            titleHi: 'शिक्षक की पहचान एवं NCF-2005 का दृष्टिकोण',
            contentEn: 'A teacher is a lamp of knowledge and builder of society. Ideal teacher is punctual, secular, democratic and protects self-respect. NCF-2005 sees teacher as facilitator, counselor, evaluator, and innovator.',
            contentHi: 'शिक्षक ज्ञान का दीपक और समाज का निर्माता है। आदर्श शिक्षक समयनिष्ठ, धर्मनिरपेक्ष और लोकतांत्रिक होता है। NCF-2005 में शिक्षक सुविधा-प्रदाता (Facilitator) है।'
          }
        ]
      },
      {
        unitNum: 3,
        titleEn: 'Unit 3: Understanding One\'s Actions and Life Goals & Reflective Diary',
        titleHi: 'इकाई 3: जीवन लक्ष्य एवं दैनिक चिंतनशील डायरी लेखन',
        topics: [
          {
            titleEn: 'Daily Reflective Diary Writing & Strengths Showcase',
            titleHi: 'दैनिक चिंतनशील डायरी लेखन एवं शक्तियों का प्रदर्शन',
            contentEn: 'Reflective diary is a personal document capturing daily classroom behavior, challenges, and self-assessment. What to write (daily work, positive thoughts) vs what not to write (vulnerable personal issues). Showcasing strengths in teaching.',
            contentHi: 'चिंतनशील डायरी कक्षा व्यवहार और आत्म-मूल्यांकन का दस्तावेज़ है। क्या लिखें (दैनिक कार्य, सकारात्मक सोच) और क्या न लिखें। शिक्षण में अपनी शक्तियों का प्रदर्शन करना।'
          }
        ]
      }
    ]
  },
  {
    year: '2nd',
    subjectCode: 'S-04',
    subjectNameEn: 'Understanding of the Self (S-04)',
    subjectNameHi: 'स्व की समझ (S-04)',
    language: 'hi',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-04][(hi)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-04][(hi)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Study Notes S-04 in Hindi',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-04 (स्व की समझ) हस्तलिखित हिंदी नोट्स',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Self Concepts and Personality Development',
        titleHi: 'इकाई 1: स्व की अवधारणाएँ एवं व्यक्तित्व विकास',
        topics: [
          {
            titleEn: 'Understanding Self & Personality',
            titleHi: 'स्व एवं व्यक्तित्व की समझ',
            contentEn: 'Detailed discussion of self-concept, self-expression, identity formation, and inner peace.',
            contentHi: 'आत्म-प्रत्यय, आत्म-अभिव्यक्ति, पहचान निर्माण और मानसिक शांति की विस्तृत व्याख्या।'
          }
        ]
      }
    ]
  },

  /* ============================================================
     SUBJECT S-05: Health, Yoga, Physical Education in School
     (स्वास्थ्य, योग एवं शारीरिक शिक्षा)
  ============================================================= */
  {
    year: '2nd',
    subjectCode: 'S-05',
    subjectNameEn: 'Health, Yoga, Physical Education in School (S-05)',
    subjectNameHi: 'स्वास्थ्य, योग एवं शारीरिक शिक्षा (S-05)',
    language: 'en',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-05][(en)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-05][(en)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Complete Notes S-05 (Health, Yoga, Physical Education in English)',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-05 (स्वास्थ्य, योग एवं शारीरिक शिक्षा) संपूर्ण नोट्स',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Physical Education Understanding',
        titleHi: 'इकाई 1: शारीरिक शिक्षा की समझ',
        topics: [
          {
            titleEn: 'Concept & Linkage of Physical Education with Health',
            titleHi: 'शारीरिक शिक्षा की अवधारणा एवं स्वास्थ्य से संबंध',
            contentEn: 'Physical Education (PT = Physical Training) keeps the body healthy and improves physical, mental, emotional, and social well-being. A healthy mind resides in a healthy body. Aims of health education & roles of Principal and Teachers.',
            contentHi: 'शारीरिक शिक्षा (PT) शरीर को स्वस्थ रखती है और शारीरिक, मानसिक, संवेगात्मक और सामाजिक विकास करती है। स्वस्थ शरीर में ही स्वस्थ मस्तिष्क का निवास होता है।'
          }
        ]
      },
      {
        unitNum: 2,
        titleEn: 'Unit 2: Games, Sports and First Aid',
        titleHi: 'इकाई 2: खेलकूद एवं प्राथमिक चिकित्सा',
        topics: [
          {
            titleEn: 'Types of Games, Athletics Rules & First Aid Basics',
            titleHi: 'खेलों के प्रकार, एथलेटिक्स नियम एवं प्राथमिक चिकित्सा',
            contentEn: 'Definitions (Gulick, Caldwell Cook). Types: Indoor (Ludo, Sudoku, Chess), Outdoor (Football 45m, Hockey 11p, Badminton, Kabaddi 7p, Cricket 11p/42 rules, Kho-Kho 27x16m). Athletics: Running, Jumping, Throwing. First Aid: Emergency assistance before hospital, First Aid kit items.',
            contentHi: 'खेलों के प्रकार: इनडोर (शतरंज, लूडो), आउटडोर (फुटबॉल, हॉकी, कबड्डी, क्रिकेट, खो-खो)। एथलेटिक्स नियम। प्राथमिक चिकित्सा: अस्पताल जाने से पूर्व दी जाने वाली आपातकालीन सहायता एवं किट सामग्री।'
          }
        ]
      },
      {
        unitNum: 3,
        titleEn: 'Unit 3: Yoga in Schools',
        titleHi: 'इकाई 3: विद्यालयों में योग',
        topics: [
          {
            titleEn: 'Meaning of Yoga, Pranayama, 84 Asanas & Elementary Activities',
            titleHi: 'योग का अर्थ, प्राणायाम, 84 आसन एवं प्राथमिक योग गतिविधियाँ',
            contentEn: 'Yoga (Sanskrit "yuj" = union). Definitions (Patanjali, Gita). 8 Types of Yoga (Hatha, Karma, Bhakti, Ashtanga). Pranayama regulates life vitality. Asanas: Sitting (Padmasana), Lying (Halasana, Shavasana), Standing (Tadasana). Elementary activities: Sun, Tree, Flying bird, Superhero pose.',
            contentHi: 'योग संस्कृत के "युज" शब्द से बना है। प्राणायाम प्राण वायु को नियंत्रित करता है। प्रमुख आसन: पद्मासन, ताड़ासन, शवासन। प्राथमिक स्तर की योग गतिविधियाँ (सूर्य, वृक्ष, पक्षी pose)।'
          }
        ]
      },
      {
        unitNum: 4,
        titleEn: 'Unit 4: Understanding Health Education & Infectious Diseases',
        titleHi: 'इकाई 4: स्वास्थ्य शिक्षा एवं संक्रामक रोग',
        topics: [
          {
            titleEn: 'Nutrition, Balanced Diet & Infectious Disease Prevention',
            titleHi: 'पोषण, संतुलित आहार एवं संक्रामक रोगों से बचाव',
            contentEn: 'Nutrition & Balanced Diet: Calories, proteins (450g / 12g protein target in MDM). Infectious Diseases (malaria, typhoid, smallpox): Spread via pathogens (protozoa, virus, bacteria), symptoms & hygiene prevention.',
            contentHi: 'पोषण एवं संतुलित आहार: प्रोटीन, विटामिन, खनिज एवं कैलोरी (MDM में 450 ग्राम कैलोरी / 12 ग्राम प्रोटीन)। संक्रामक रोग (मलेरिया, टाइफाइड) एवं बचाव के उपाय।'
          }
        ]
      },
      {
        unitNum: 5,
        titleEn: 'Unit 5: School Physical Environment & Mid-Day Meal',
        titleHi: 'इकाई 5: विद्यालय का भौतिक वातावरण एवं मध्याह्न भोजन',
        topics: [
          {
            titleEn: 'School Physical Environment, Mid-Day Meal & Health Cards',
            titleHi: 'विद्यालयी वातावरण, मध्याह्न भोजन योजना एवं स्वास्थ्य कार्ड',
            contentEn: 'School Environment: Building, playground, clean drinking water, toilets. Mid-Day Meal Scheme (started 15 Aug 1995) boosts enrollment & nutrition. Health Cards / PM Modi Health ID card. 2 Health & Wellness Ambassadors per school.',
            contentHi: 'विद्यालय वातावरण: स्वच्छ पेयजल, शौचालय, खेल का मैदान। मध्याह्न भोजन योजना (15 अगस्त 1995 से प्रारंभ)। डिजिटल स्वास्थ्य कार्ड एवं स्वास्थ्य राजदूत।'
          }
        ]
      }
    ]
  },
  {
    year: '2nd',
    subjectCode: 'S-05',
    subjectNameEn: 'Health, Yoga, Physical Education in School (S-05)',
    subjectNameHi: 'स्वास्थ्य, योग एवं शारीरिक शिक्षा (S-05)',
    language: 'hi',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-05][(hi)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-05][(hi)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Notes S-05 in Hindi',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-05 (स्वास्थ्य, योग एवं शारीरिक शिक्षा) हिंदी नोट्स',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Health & Physical Education in Primary Schools',
        titleHi: 'इकाई 1: प्राथमिक विद्यालयों में स्वास्थ्य एवं शारीरिक शिक्षा',
        topics: [
          {
            titleEn: 'Physical Education & Hygiene',
            titleHi: 'शारीरिक शिक्षा एवं व्यक्तिगत स्वच्छता',
            contentEn: 'Importance of physical exercises, yoga, hygiene, and nutrition for elementary school students.',
            contentHi: 'प्राथमिक स्तर के बच्चों के लिए शारीरिक व्यायाम, योगासन, स्वच्छता और पोषण का महत्व।'
          }
        ]
      }
    ]
  },

  /* ============================================================
     SUBJECT S-06: Pedagogy of English (Primary Level)
     (अंग्रेज़ी का शिक्षाशास्त्र)
  ============================================================= */
  {
    year: '2nd',
    subjectCode: 'S-06',
    subjectNameEn: 'Pedagogy of English (Primary Level) (S-06)',
    subjectNameHi: 'अंग्रेज़ी का शिक्षाशास्त्र (S-06)',
    language: 'en',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-06][(en)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-06][(en)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Complete Notes S-06 (Pedagogy of English in English)',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-06 (अंग्रेज़ी का शिक्षाशास्त्र) संपूर्ण नोट्स',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Teaching English as a Second Language',
        titleHi: 'इकाई 1: द्वितीय भाषा के रूप में अंग्रेज़ी शिक्षण',
        topics: [
          {
            titleEn: 'Principles & NCF 2005 / BCF 2008 Tenets',
            titleHi: 'द्वितीय भाषा शिक्षण के सिद्धांत एवं NCF 2005/BCF 2008',
            contentEn: 'English acts as a link language in India. 4 Aims: Understand spoken, speak, understand written, write English. 12 Principles (Naturalness, Exposure, LSRW order, Mother tongue scaffold). NCF 2005 promotes learning without burden. BCF 2008 connects English with local Bihar contexts.',
            contentHi: 'अंग्रेज़ी भारत में संपर्क भाषा है। 4 मुख्य उद्देश्य: सुनना, बोलना, पढ़ना और लिखना। NCF 2005 बिना बोझ के शिक्षा पर बल देता है। BCF 2008 कक्षा शिक्षण को बिहार के स्थानीय परिवेश से जोड़ता है।'
          },
          {
            titleEn: 'Teaching Approaches: Behaviorist, Audio-Lingual, Communicative, Constructivist',
            titleHi: 'शिक्षण उपागम: व्यवहारात्मक, ऑडियो-लिंग्वल, संप्रेषणात्मक, निर्मितिवादी',
            contentEn: 'Grammar Translation (oldest, rule-centric), Audio-Lingual (drills/repetition), Structural Approach (sentence patterns), Communicative (real-life interaction), Constructivist (active knowledge creation). Curriculum (Latin \'currere\' = runway) vs Syllabus comparison.',
            contentHi: 'व्याकरण अनुवाद विधि, ऑडियो-लिंग्वल ड्रिल, संरचनात्मक उपागम, संप्रेषणात्मक उपागम एवं निर्मितिवादी उपागम। पाठ्यचर्या बनाम पाठ्यक्रम।'
          }
        ]
      },
      {
        unitNum: 2,
        titleEn: 'Unit 2: Strategies of Teaching Language Skills (Listening & Speaking)',
        titleHi: 'इकाई 2: भाषा कौशलों का शिक्षण (सुनना एवं बोलना)',
        topics: [
          {
            titleEn: 'Listening Activities & Speaking Strategies',
            titleHi: 'श्रवण गतिविधियाँ एवं संभाषण रणनीतियाँ',
            contentEn: 'Pre-listening, While-listening, and Post-listening activities. Syllables, Stress, Intonation (pitch variation), and Rhythm. Speaking through dialogues, poems, greetings, asking/answering questions. Assessment tools & Lesson planning.',
            contentHi: 'पूर्व-श्रवण, मध्य-श्रवण और उत्तर-श्रवण गतिविधियाँ। स्वराघात, अनुतान और लय। संवाद, कविता पाठ, रोल प्ले के माध्यम से बोलने का कौशल। पाठ योजना के घटक।'
          }
        ]
      },
      {
        unitNum: 3,
        titleEn: 'Unit 3: Teaching Reading and Writing Skills',
        titleHi: 'इकाई 3: पठन एवं लेखन कौशल का शिक्षण',
        topics: [
          {
            titleEn: 'Reading Types (Loud/Silent, Intensive/Extensive) & Skimming vs Scanning',
            titleHi: 'पठन के प्रकार (सस्वर/मौन, गहन/विस्तृत) एवं स्किमिंग/स्कैनिंग',
            contentEn: 'Loud reading improves pronunciation. Silent reading enhances speed and comprehension. Extensive reading (fluency & pleasure) vs Intensive reading (in-depth linguistic study). Skimming (quick glance for general gist) vs Scanning (locating specific keywords). Writing: Notice format, Advertisement, Invitation, Mind Maps, Drafting.',
            contentHi: 'सस्वर वाचन (उच्चारण), मौन वाचन (समझ)। विस्तृत पठन बनाम गहन पठन। स्किमिंग (सामान्य भाव) बनाम स्कैनिंग (विशिष्ट तथ्य)। लेखन: सूचना प्रारूप, विज्ञापन, निमंत्रण, माइंड मैप।'
          }
        ]
      },
      {
        unitNum: 4,
        titleEn: 'Unit 4: Teaching Vocabulary and Grammar in Context',
        titleHi: 'इकाई 4: संदर्भ में शब्दावली एवं व्याकरण शिक्षण',
        topics: [
          {
            titleEn: 'Vocabulary Strategies, Parts of Speech, Homophones & Synonyms',
            titleHi: 'शब्दावली रणनीतियाँ, शब्द भेद, समध्वनिक एवं पर्यायवाची',
            contentEn: 'Functional grammar teaching through context. Sentence types (Declarative, Imperative, Interrogative, Exclamative). 8 Parts of Speech (Nouns, Pronouns, Verbs, Adverbs, Adjectives, Prepositions, Conjunctions, Interjections). Synonyms, Antonyms, Homophones (Altar/Alter, Berth/Birth), Prefixes & Suffixes.',
            contentHi: 'संदर्भ में व्याकरण शिक्षण। वाक्य के प्रकार। 8 शब्द भेद (संज्ञा, सर्वनाम, क्रिया, विशेषण, अव्यय)। पर्यायवाची, विलोम, समध्वनिक शब्द (Homophones), उपसर्ग एवं प्रत्यय।'
          }
        ]
      }
    ]
  },
  {
    year: '2nd',
    subjectCode: 'S-06',
    subjectNameEn: 'Pedagogy of English (Primary Level) (S-06)',
    subjectNameHi: 'अंग्रेज़ी का शिक्षाशास्त्र (S-06)',
    language: 'hi',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-06][(hi)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-06][(hi)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Study Notes S-06 in Hindi',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-06 (अंग्रेज़ी का शिक्षाशास्त्र) हिंदी नोट्स',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: English Language Pedagogy Overview',
        titleHi: 'इकाई 1: अंग्रेज़ी भाषा शिक्षाशास्त्र अवलोकन',
        topics: [
          {
            titleEn: 'Second Language Teaching Methods',
            titleHi: 'द्वितीय भाषा शिक्षण विधियाँ',
            contentEn: 'Effective strategies for primary English teaching using mother tongue support.',
            contentHi: 'मातृभाषा के सहयोग से प्राथमिक स्तर पर प्रभावी अंग्रेज़ी शिक्षण रणनीतियाँ।'
          }
        ]
      }
    ]
  },

  /* ============================================================
     SUBJECT S-07: Pedagogy of Mathematics - 2 (Primary Level)
     (गणित का शिक्षाशास्त्र)
  ============================================================= */
  {
    year: '2nd',
    subjectCode: 'S-07',
    subjectNameEn: 'Pedagogy of Mathematics - 2 (Primary Level) (S-07)',
    subjectNameHi: 'गणित का शिक्षाशास्त्र (S-07)',
    language: 'en',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-07][(en)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-07][(en)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Complete Notes S-07 (Pedagogy of Mathematics in English)',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-07 (गणित का शिक्षाशास्त्र) संपूर्ण अंग्रेज़ी नोट्स',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Techniques and Resources for Teaching Mathematics',
        titleHi: 'इकाई 1: गणित शिक्षण की तकनीकें एवं संसाधन',
        topics: [
          {
            titleEn: 'Constructivism & A-B-C-P Sequence',
            titleHi: 'निर्मितिवाद एवं A-B-C-P अधिगम क्रम',
            contentEn: 'Mathematizing children\'s thought process per NCF 2005. Learning sequence A-B-C-P: 1. A - Experience (Concrete objects), 2. Bha - Language (Story/Words), 3. Chi - Picture (Diagrams), 4. Q - Symbol (Numbers). Open vs Closed questions. Math Puzzles (3x3 magic square). Resources: TLM, Math Lab, Math Club, Fair.',
            contentHi: 'NCF 2005 के अनुसार बच्चों की सोच का गणितीयकरण। A-B-C-P अधिगम क्रम: 1. अनुभव (ठोस वस्तुएँ), 2. भाषा (कहानी), 3. चित्र (आरेख), 4. प्रतीक (संख्याएँ)। खुले बनाम बंद प्रश्न। गणित पहेलियाँ एवं TLM।'
          }
        ]
      },
      {
        unitNum: 2,
        titleEn: 'Unit 2: Learning Planning and Assessment in Mathematics',
        titleHi: 'इकाई 2: गणित में शिक्षण योजना एवं मूल्यांकन',
        topics: [
          {
            titleEn: 'Math Learning Plans & Assessment Types (Formative, Summative, Diagnostic, CCE)',
            titleHi: 'गणित शिक्षण योजना एवं मूल्यांकन के प्रकार (रचनात्मक, संकलनात्मक, निदानात्मक, CCE)',
            contentEn: 'Unit planning and daily learning plans (Concrete -> Picture -> Symbol). Role of Assessment. Types: 1. Formative (Creative) Assessment (initial feedback), 2. Summative Assessment (final unit check), 3. Diagnostic Assessment (learning difficulties). CCE (academic & semi-academic). 7 Assessment techniques.',
            contentHi: 'इकाई योजना एवं दैनिक शिक्षण योजना। मूल्यांकन के प्रकार: 1. रचनात्मक (प्रारंभिक सुधार), 2. संकलनात्मक (अंतिम जाँच), 3. निदानात्मक (कठिनाइयों की पहचान)। CCE एवं 7 मूल्यांकन तकनीकें।'
          }
        ]
      },
      {
        unitNum: 3,
        titleEn: 'Unit 3: Geometrical Shapes and Patterns',
        titleHi: 'इकाई 3: ज्यामितीय आकृतियाँ एवं पैटर्न',
        topics: [
          {
            titleEn: 'Shapes, Lines, Angles, 2D/3D & Symmetry',
            titleHi: 'आकृतियाँ, रेखाएँ, कोण, 2D/3D एवं सममिति',
            contentEn: 'Open & Closed shapes, Regular vs Irregular shapes. Point, Line (infinite), Ray (one endpoint), Line segment (measurable distance). Line types: Parallel, Concurrent, Transversal, Perpendicular. Angles: Zero (0°), Acute (<90°), Right (90°), Obtuse (90°-180°), Straight (180°), Reflex (180°-360°), Complete (360°). 2D vs 3D shapes. Symmetry & Patterns.',
            contentHi: 'खुली व बंद आकृतियाँ, सम व विषम आकृतियाँ। बिंदु, रेखा, किरण, रेखाखंड। समानांतर, संगामी, लंबवत रेखाएँ। कोणों के प्रकार (न्यून, सम, अधिक, सरल, पुनर्युक्त, पूर्ण कोण)। 2D व 3D आकृतियाँ, सममिति एवं पैटर्न।'
          }
        ]
      },
      {
        unitNum: 4,
        titleEn: 'Unit 4: Fractions and Decimal Numbers',
        titleHi: 'इकाई 4: भिन्न एवं दशमलव संख्याएँ',
        topics: [
          {
            titleEn: 'Fraction Types & Decimals in Daily Life',
            titleHi: 'भिन्न के प्रकार एवं दैनिक जीवन में दशमलव',
            contentEn: 'Proper (Even), Improper (Odd), Mixed (Mixture), Like (Homogeneous), Unlike fractions. Mathematical operations on fractions. Decimal conversion (0.70 = 7/100, 6.5 = 65/10). Daily life applications in money (rupees/paisa) and weight measurements (25 kg, 1.5 kg).',
            contentHi: 'सम, विषम, मिश्रित, समान और असमान भिन्न। भिन्न संक्रियाएँ। दशमलव रूपांतरण। दैनिक जीवन में मुद्रा एवं माप-तौल में दशमलव का प्रयोग।'
          }
        ]
      }
    ]
  },
  {
    year: '2nd',
    subjectCode: 'S-07',
    subjectNameEn: 'Pedagogy of Mathematics - 2 (Primary Level) (S-07)',
    subjectNameHi: 'गणित का शिक्षाशास्त्र (S-07)',
    language: 'hi',
    optionNumber: 1,
    pdfFileName: 'BIHAR D.El.Ed[S-07][(hi)][1].pdf',
    pdfUrl: '/notes/BIHAR D.El.Ed[S-07][(hi)][1].pdf',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah)',
    descriptionEn: 'Bihar D.El.Ed 2nd Year Study Notes S-07 in Hindi',
    descriptionHi: 'बिहार D.El.Ed द्वितीय वर्ष विषय S-07 (गणित का शिक्षाशास्त्र) हिंदी नोट्स',
    units: [
      {
        unitNum: 1,
        titleEn: 'Unit 1: Mathematics Teaching Methods',
        titleHi: 'इकाई 1: गणित शिक्षण विधियाँ',
        topics: [
          {
            titleEn: 'Constructivist Math Teaching',
            titleHi: 'निर्मितिवादी गणित शिक्षण',
            contentEn: 'Activity-based math teaching strategies using concrete learning materials.',
            contentHi: 'ठोस अधिगम सामग्रियों के प्रयोग से गतिविधि आधारित गणित शिक्षण।'
          }
        ]
      }
    ]
  }
];

async function seedNotes() {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding notes...');

    await Note.deleteMany({});
    console.log('Existing notes cleared.');

    const created = await Note.insertMany(initialNotesData);
    console.log(`Successfully seeded ${created.length} notes documents into MongoDB!`);

    // Write to fallback json cache
    const cachePath = path.join(__dirname, '../data/notes_cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(initialNotesData, null, 2), 'utf-8');
    console.log(`Updated notes cache file at ${cachePath}`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding notes:', err);
    // If DB fails, still update fallback json cache
    const cachePath = path.join(__dirname, '../data/notes_cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(initialNotesData, null, 2), 'utf-8');
    console.log(`Updated notes cache file at ${cachePath} despite DB error.`);
    process.exit(1);
  }
}

seedNotes();
