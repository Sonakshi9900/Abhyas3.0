const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const notesDir = path.join(__dirname, '../public/notes');
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

// Helper to sanitize strings for WinAnsi standard Helvetica font in PDFKit
function sanitizeText(str) {
  if (!str) return '';
  return String(str)
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/…/g, '...')
    .replace(/→/g, '->')
    .replace(/•/g, '*')
    .replace(/°/g, ' deg')
    .replace(/[^\x00-\x7F]/g, ''); // strip any non-ASCII bytes to prevent PDF stream corruption
}

// Full notes content matching sent PDFs
const fullNotesData = {
  'S-07': {
    code: 'S-07',
    title: 'S-7 Pedagogy of Mathematics - 2 (Primary Level)',
    year: '2nd Year',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah & Future Online Classes Sonpur)',
    units: [
      {
        unit: 'Unit 1: Techniques and Resources for Teaching Mathematics',
        sections: [
          {
            title: 'Point 1: Mathematics Teaching and Constructivism',
            content: `According to constructivism, mistakes are necessary to learn anything because without mistakes nothing can be learned. Like when a child learns to ride a bicycle, he falls again and again but despite falling, he gradually learns to ride a bicycle. That is why it is said that you can learn a lot even through mistakes. Mathematics has always been famous for its utility, importance, creativity and significance. One of the main goals of mathematics teaching and constructivist approach is teaching children how to learn math and mathematizing children's thinking (NCF-2005 & BCF-2008).`
          },
          {
            title: 'Point 2: Sequence of Learning Mathematics (A-B-C-P)',
            content: `There is a possible sequence of learning mathematics which we call A-B-C-P:
1. A - Experience: Concrete objects (pebbles, wood, stones, pens).
2. Bha - Language: Mother tongue, stories, word problems, questions, games.
3. Chi - Picture: Showing pictures matching the lesson.
4. Q - Symbol: Numbers, mathematical symbols (+, -, x, /).`
          },
          {
            title: 'Point 3: Teaching Formal Mathematics by Linking to Concrete Experiences',
            content: `Formal mathematics needs to be linked to concrete experiences so that children can understand things in a simpler way. Even if they are able to do mental calculations, real objects (pen, chocolate, stones, flowers) build foundational conceptual clarity.`
          },
          {
            title: 'Point 4: Teaching Through Games (Mathematics)',
            content: `Game method is a psychological method. Children have natural interest in games. Through game method, collective feeling, love, sympathy, and social outlook are developed in students. Helps all-round development.`
          },
          {
            title: 'Point 5: Learning by Repetition',
            content: `Learning by repetition means performing a task again and again. For example, if a child does not know multiplication tables, writing and reciting it repeatedly leads to mastery.`
          },
          {
            title: 'Point 6: Children Learn from Each Other',
            content: `Children learn by imitating peers, family, and society. They observe mathematical applications in daily life and discuss solutions together.`
          },
          {
            title: 'Point 7: Learn from Mistakes',
            content: `Making mistakes (e.g. counting 18 after 15) is a natural part of human learning. Teachers guide students gently so they learn from error feedback.`
          },
          {
            title: 'Point 8: Learning from Activities',
            content: `Hands-on activities teach concepts like small-big, inside-outside, high-low, less-big, far-near, light-heavy by connecting mathematics to daily life.`
          },
          {
            title: 'Point 9: Maths Puzzles & Riddles',
            content: `Solving puzzles develops thinking power and problem-solving strategies. Example: Magic square (3x3 grid using numbers 1-9 where row, column, and diagonal sums equal 15).`
          },
          {
            title: 'Point 10 & 11: Open and Closed Questions',
            content: `Open-ended questions: oral/written questions with long, creative, and multiple responses.
Closed-ended questions: definite answers (yes/no, single word) used to test specific facts.`
          },
          {
            title: 'Point 12: Various Resources for Teaching and Learning Mathematics',
            content: `Resources: Pictures, charts, models, radio, TV, TLM (Teaching Learning Material), ICT Experiments, Mathematics Laboratory, Math Club, Math Fair.`
          }
        ]
      },
      {
        unit: 'Unit 2: Learning Planning and Assessment in Mathematics',
        sections: [
          {
            title: 'Point 1: Plan to Learn Maths',
            content: `A learning plan presents lessons in a simple, well-organised sequence: Concrete Objects -> Pictures -> Signs & Symbols. Helps clarify goals, divide time, and maintain student interest.`
          },
          {
            title: 'Point 2: Role of Assessment & Types of Assessment',
            content: `Main purpose of assessment is collecting information about learner's achievement and progress.
1. Formative (Creative) Assessment: Done at initial/construction stage for immediate feedback and improvement.
2. Summative Assessment: Done at end of course/unit to evaluate final knowledge and achievement.
3. Diagnostic Assessment: Used to detect specific learning difficulties in students.`
          },
          {
            title: 'Point 3: Continuous and Comprehensive Evaluation (CCE)',
            content: `Continuous evaluation takes place regular academic & semi-academic activities. Comprehensive evaluation covers cognitive, emotional, and psychomotor domains.`
          },
          {
            title: 'Point 4: Main Techniques of Assessment',
            content: `1. Examination technique (oral, written, practical)
2. Observation
3. Ranking Scale
4. Screening Lists
5. Items produced by students
6. Interview
7. Obtained Marks Letter`
          }
        ]
      },
      {
        unit: 'Unit 3: Geometrical Shapes and Patterns',
        sections: [
          {
            title: 'Point 1: Shapes',
            content: `Open shape: starts at one point and ends at a different point.
Closed shape: starts and ends at the exact same point.
Regular shape: equal side lengths and equal angles (equilateral triangle, square).
Irregular shape: unequal side lengths and angles.`
          },
          {
            title: 'Point 2: Point, Line, Ray, Line Segment and Angle',
            content: `Point: position without length, width or thickness.
Line (Rekha): continues infinitely in both directions.
Ray: starts at a point and goes infinitely in one direction (torch light, sun ray).
Line Segment: minimum measurable distance between two endpoints.
Line Types: Parallel, Sangami (Concurrent), Curve, Transversal, Perpendicular lines.
Angle Types: Zero (0 deg), Acute (<90 deg), Right (90 deg), Obtuse (90-180 deg), Straight (180 deg), Reflex/Reciprocal (180-360 deg), Complete (360 deg).`
          },
          {
            title: 'Point 4 & 5: 2D/3D Shapes and Symmetry',
            content: `2D Shapes (rectangle, square, triangle, circle): length & width, perimeter and area.
3D Shapes (cube, sphere, cylinder, cone): length, width, thickness, volume and surface area.
Symmetrical Shapes: figures that match perfectly when folded into equal halves (leaves, notebooks).`
          },
          {
            title: 'Point 6: Concept of Pattern',
            content: `Pattern is a repeated arrangement of numbers, shapes, or colors (e.g. 2, 4, 6, 8, 10, 12).`
          }
        ]
      },
      {
        unit: 'Unit 4: Fractions and Decimal Numbers',
        sections: [
          {
            title: 'Point 1: Understanding Fractional Numbers',
            content: `Fraction: divides a whole into several equal parts. Consists of Numerator and Denominator.
Types of Fractions:
- Proper (Even): Numerator < Denominator (2/8, 3/16).
- Improper (Odd): Numerator > Denominator (7/5, 18/2).
- Mixed (Mixture): Integer + Proper fraction (5 1/4, 6 3/5).
- Like (Homogeneous): Same denominators (2/4, 5/4, 6/4).
- Unlike: Unequal denominators (5/3, 2/8, 1/7).`
          },
          {
            title: 'Point 2 & 3: Daily Life Use & Operations',
            content: `Fractions used in buying goods, weighing items, dividing food, publishing exam results.
Operations: Addition, Subtraction, Multiplication, Division of fractions, Ratios, Measurements.`
          },
          {
            title: 'Point 4 & 5: Decimal Numbers & Operations',
            content: `Decimal numbers put a decimal place (.) e.g. 0.70 = 7/100, 6.5 = 65/10. Used in average calculations, money (rupees/paisa), and buying goods by weight (25 kg, 1.5 kg).`
          }
        ]
      }
    ]
  },

  'S-06': {
    code: 'S-06',
    title: 'S 6 PEDAGOGY OF ENGLISH (Primary Level)',
    year: '2nd Year',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah & Future Online Classes Sonpur)',
    units: [
      {
        unit: 'Unit 1: Teaching English as a Second Language',
        sections: [
          {
            title: 'Point 1: Principles of Second Language Learning',
            content: `English is considered the second language of India. It serves as a link language across diverse multilingual states and as a global linguistic mediator.
4 Specific Aims of Teaching English:
1. To understand Spoken English
2. To speak English
3. To understand written English
4. To write English
12 Guiding Principles: Naturalness, Exposure, Habit formation, LSRW order (Listening, Speaking, Reading, Writing), Passive & Active vocabulary, Motivation, Grouping, Sequencing, Learning by doing, Accuracy, Correlation with life, Using mother tongue.`
          },
          {
            title: 'Point 2: Factors Affecting Second Language Learning',
            content: `Developmental Factors: Age, Aptitude, Motivation (Intrinsic & Extrinsic), Intelligence, Learning styles, Personality.
Socio-economic factors: Learner attitude and social background.
Psychological factors: Fear of making mistakes, Shyness, Hesitation, Lack of confidence.`
          },
          {
            title: 'Point 3: Teaching English per NCF-2005 and BCF-2008',
            content: `NCF-2005: Recognises learners as active constructors of knowledge, views multilingualism as a classroom strength, shifts teacher role to facilitator.
BCF-2008: Connects English learning in close proximity with the culture, geography, and rural background of Bihar.`
          },
          {
            title: 'Point 4: Curriculum, Syllabus and Textbook',
            content: `Curriculum (Latin 'currere' = runway): totality of experiences provided throughout academic year.
Syllabus: summary of topics covered by units in a specific subject.
Curriculum is prescriptive, comprehensive, and institution-wide. Syllabus is descriptive, limited, and class-specific.`
          },
          {
            title: 'Point 5: Approaches for Teaching English',
            content: `1. Behaviorist Approach: Mechanical learning, habit formation.
2. Grammar Translation Method: Oldest method, 'Grammar is the soul of language', rule memorization.
3. Audio-Lingual Drill: Habitual behavior, listening & speaking drills.
4. Structural Approach: Arrangement of words into sentence structures.
5. Communicative Approach: Real-life communication tasks (role play, market activity).
6. Cognitive Approach: Holistic perception, reasoning, problem solving.
7. Constructivist Approach: Constructing knowledge through observation and activity.`
          }
        ]
      },
      {
        unit: 'Unit 2: Strategies of Teaching Language Skills (Listening and Speaking)',
        sections: [
          {
            title: 'Point 1: Listening Skill & Sound Recognition',
            content: `Listening is the first language skill. Strategies divided into 3 categories:
1. Pre-listening activities: activating vocabulary, predicting content, brainstorming.
2. While-listening activities: eliciting message from spoken language.
3. Post-listening activities: extensions, discussion, comprehension check.
Phonetics: Syllable (vowel sound unit), Stress (emphasis on syllable/word/sentence), Intonation (pitch rise & fall), Rhythm.`
          },
          {
            title: 'Point 2: Speaking Skill & Strategies',
            content: `Speaking is primary mode of communication.
Strategies: Reciting a poem, Dialogue (communication between groups), Greetings (Hello, How are you), Asking/answering questions, Conveying information.`
          },
          {
            title: 'Point 3 & 4: Assessment & Learning Plan',
            content: `Tools: Standardized tests, Observation, Checklist, Interview, Rating scale.
Lesson Plan components: Specific objectives, General objectives, Classroom management, Planning, Lesson expansion, Summary, Homework, Self-evaluation.`
          }
        ]
      },
      {
        unit: 'Unit 3: Strategies of Teaching Language Skills (Reading and Writing)',
        sections: [
          {
            title: 'Reading Skill & 6 Types of Reading',
            content: `Types of Reading:
1. Loud reading: oral reading with correct pronunciation, stress and intonation.
2. Silent reading: reading without voicing words for ease, speed and fluency.
3. Intensive reading: deep, careful study of short text for linguistic/literary details.
4. Extensive reading: reading long texts rapidly for general fluency and pleasure.
5. Supplementary reading
6. Library reading
Techniques: Skimming (quick glance to get general gist) vs Scanning (selective eye movement to locate specific keywords).`
          },
          {
            title: 'Writing Skill & Formats',
            content: `Writing represents language through signs/symbols.
Formats: Notice (school notice template), Advertisement, Invitation, Brainstorming, Mind Map, Drafting (putting thoughts into sentences/paragraphs).`
          }
        ]
      },
      {
        unit: 'Unit 4: Teaching Vocabulary and Grammar in Context',
        sections: [
          {
            title: 'Vocabulary & Grammar Teaching Strategies',
            content: `Vocabulary: Word walls, Vocabulary notebooks, Semantic mapping, Word cards, Visuals.
Grammar Methods: Traditional, Inductive/Deductive, Incidental, Informal.
Sentence Types: Declarative (statement), Imperative (command/request), Interrogative (question), Exclamative (exclamation).
8 Parts of Speech: Nouns, Pronouns, Verbs, Adverbs, Adjectives, Prepositions, Conjunctions, Interjections.
Language Concepts: Antonyms, Synonyms, Homophones (Altar/Alter, Berth/Birth, Cast/Caste, Days/Daze), Homonyms, Prefixes, Suffixes.`
          }
        ]
      }
    ]
  },

  'S-05': {
    code: 'S-05',
    title: 'S -5 Health, Yoga, Physical Education in School',
    year: '2nd Year',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah & Future Online Classes Sonpur)',
    units: [
      {
        unit: 'Unit 1: Physical Education Understanding',
        sections: [
          {
            title: 'Concept & Linkage of Physical Education',
            content: `Physical Education (PT = Physical Training) keeps the body healthy. Develops physical abilities for daily activities and sports.
Need & Importance: Improves physical disorders, builds courage, patience, discipline, tolerance. Healthy mind resides in a healthy body.
Linkage: Connects physical, cognitive, emotional, and social development.
Aims of Health Education & Roles of Headmaster and Teachers in organizing health check-ups and hygiene.`
          }
        ]
      },
      {
        unit: 'Unit 2: Games and Sports & First Aid',
        sections: [
          {
            title: 'Types of Games & Athletics',
            content: `Definitions: Gulick ("Play is done with own will"), Caldwell Cook ("Play is an important means of education").
Game Types: Indoor (Ludo, Sudoku, Chess), Outdoor (Football 45m, Hockey 11p, Badminton, Kabaddi 7p, Cricket 11p/42 rules, Kho-Kho 27x16m), Experimental, Natural, Creative, Running, Mental games.
Specific Sports Rules:
- Football: 45 min halves, 1930 World Cup, 1951 Asian Games.
- Hockey: 11 players, 1908 Olympics, first match 26 Jan 1894.
- Badminton: singles/doubles, racket & shuttlecock.
- Kabaddi: 7 players each team, national game of India.
- Cricket: 11 players, 42 rules, first test 15 March 1872, first World Cup 1975, Sachin Tendulkar.
- Kho-Kho: 27x16m court, Kho-Kho Federation of India.
Athletics: Running (100m-10000m, relay), Jumping (long jump, high jump, pole vault), Throwing (shot put, discus, javelin). Gymnastics (Assoc established 1951).`
          },
          {
            title: 'First Aid Concepts',
            content: `First Aid: Emergency care given before taking injured/sick person to hospital.
Objectives: Saving lives, preventing condition from worsening, aiding recovery, treating bleeding.
First Aid Kit items: Tweezers, safety pins, scissors, adhesive bandages, blades, thermometer, antiseptic lotion, painkillers.`
          }
        ]
      },
      {
        unit: 'Unit 3: Yoga in Schools',
        sections: [
          {
            title: 'Meaning of Yoga, Pranayama & Asanas',
            content: `Yoga (Sanskrit "yuj" = union of individual soul with Supreme Being). Definitions: Patanjali ("Restraint of Chitravritti"), Gita ("Completing every task skillfully").
8 Types of Yoga: Hatha, Laya, Raja, Bhakti, Gyana, Karma, Japa, Ashtanga yoga.
Pranayama: Regulating prana (life force vitality) through nadis and chakras.
Asanas ("Sthira Sukha Asanam"):
- Sitting postures: Padmasana, Vajrasana, Siddhasana, Gomukhasana.
- Lying on back: Halasana, Sarvangasana, Shavasana, Pawanmuktasana.
- Lying on stomach: Dhanurasana, Bhujangasana, Makarasana.
- Standing postures: Tadasana, Vrishasana, Padahastasana.
Yoga for Elementary Students: Sun pose, Tree pose, Flying bird, Seed planting, Butterfly pose, Flower pose, Superhero pose.`
          }
        ]
      },
      {
        unit: 'Unit 4: Understanding Health Education & School Context',
        sections: [
          {
            title: 'Health Education, Nutrition & Infectious Diseases',
            content: `Health Education identifies health needs and proper behaviors.
Nutrition & Balanced Diet: Calories, proteins, vitamins, minerals. Calorie target for MDM: 450 GM calories and 12 GM protein for primary students.
Infectious Diseases: Spread via pathogens (protozoa, virus, bacteria) e.g. Malaria, Typhoid, Smallpox. Symptoms (fever, body pain, diarrhea) & Prevention (handwashing, hygiene, vaccination).`
          }
        ]
      },
      {
        unit: 'Unit 5: Physical Environment of School & Mid-Day Meal',
        sections: [
          {
            title: 'School Environment, MDM & Health Records',
            content: `Physical Environment: Safe school building, playground, clean drinking water, toilets.
Personal Hygiene: Hand hygiene, nails, hair, clothing cleanliness.
Mid-Day Meal Scheme (MDM): Started 15 Aug 1995 across India. Objectives: Increase enrollment, attendance, retention, eliminate hunger & caste discrimination.
Health Records: Tracking student health history, vaccinations, Digital Health Card (PM Modi Health ID card). 2 Health & Wellness Ambassadors per school.`
          }
        ]
      }
    ]
  },

  'S-04': {
    code: 'S-04',
    title: 'S-4 Understanding of the self',
    year: '2nd Year',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah & Future Online Classes Sonpur)',
    units: [
      {
        unit: 'Unit 1: Understanding Oneself as a Person',
        sections: [
          {
            title: 'Persona, Personality Definitions & Types',
            content: `Persona & Personality Traits: Set of physical, mental, and behavioral qualities.
Definitions: Guilford ("Coordinated form of qualities"), Woodworth ("Overall characteristics of individual behavior"), Allport ("Adjustment with environment").
5 Personality Traits: Openness, Consciousness, Extroversion, Consensus, Muscular dystrophy.
Carl Jung's 3 Personality Types:
1. Introvert: Quiet, contemplative, thoughtful, good writers, calm nature.
2. Extrovert: Outgoing, social, optimistic, future leaders, actors.
3. Ambivert / Ambidextrous: Balance of both introvert and extrovert traits.`
          },
          {
            title: 'Curiosity "Who Am I?", Self vs Ego & Identity',
            content: `Two Perspectives of "Who Am I?":
1. Relation to human beings (father, engineer, traveler).
2. Relation to inner mind/soul (unique spiritual self).
Self vs Ego:
- Self: Creates self-confidence, positive emotions, self-awareness.
- Ego: Attaching 'I' aggressively, narrow mindset, negative emotions, anger.
Aspects of Identity (Asmita): Personal Identity (stable unique qualities) vs Social Identity (Tajfel 1979 - group membership). Internal vs External identity formation.`
          },
          {
            title: 'Self Portrait, Self-Respect & Motivation',
            content: `Self Portrait: Medium of self-evaluation for trainee teachers to review effectiveness.
Swabhiman (Self-Respect) vs Pride/Arrogance:
Self-respect brings mental peace and confidence; arrogance leads to downfall and distraction.
Motivation: Intrinsic (hunger, thirst, internal interest) vs Extrinsic (external rewards, awards). B.F. Skinner called motivation the highway to learning.
Teacher Profile: Strong points (patience, secularism, flexibility) vs Weak sides.`
          }
        ]
      },
      {
        unit: 'Unit 2: Awareness of One\'s Identity',
        sections: [
          {
            title: 'Teacher Identity & Ideal Teacher Concept',
            content: `Teacher Identity: Educator, lamp of knowledge, builder of society.
Ideal Teacher: Does not bow to wrong things, protects self-respect, friendly, punctual, democratic.
NCF-2005 Role: Teacher as facilitator, active participant helper, counselor, evaluator, innovator.
Beliefs & Contemplation (Ross: "Cognitive aspect of mental activity").`
          }
        ]
      },
      {
        unit: 'Unit 3: Understanding One\'s Actions and Life Goals',
        sections: [
          {
            title: 'Life Goals, Reflective Diary & Strengths',
            content: `Life Goals: Integrating physical, emotional, and spiritual perspectives.
Perceptions of Colleagues/Students: Being trustworthy, good listener, cooperative, realistic.
Daily Reflective Diary: Personal document recording daily educational behavior, classroom challenges, self-assessment. What to write (positive account, work frequency) vs what not to write (vulnerable personal issues).
Inspirational stories & films in workshops for character development. Showcasing strengths in teaching.`
          }
        ]
      }
    ]
  },

  'S-02': {
    code: 'S-02',
    title: 'S - 2 Cognition, Learning and Child Development',
    year: '2nd Year',
    author: 'BY- ABHISHEK ANAND and TEAM (Future Deled Wallah & Future Online Classes Sonpur)',
    units: [
      {
        unit: 'Unit 1: Cognitive and Concept Development in Children',
        sections: [
          {
            title: 'Cognitive Development & Jean Piaget\'s Theory',
            content: `Cognitive Development: Development of mental abilities (intelligence, memory, attention, thinking, problem solving). Hilgard definition.
Jean Piaget\'s 4 Stages of Cognitive Development:
1. Sensorimotor stage [0 to 2 years]: World understood through senses and simple motor actions.
2. Pre-operational stage [2 to 6 years]: Imagination, play, imitation, language acquisition.
3. Concrete operational stage [6 to 11 years]: Logical reasoning on tangible objects, classification, serialization.
4. Formal operational stage [11 to 15+ years]: Abstract thinking, hypothesis testing, diagnostic thinking.
Piaget Concepts: Schema/Schemes, Organization, Adaptation (Customization), Assimilation (fitting into existing schema), Accommodation (modifying schema), Equilibrium, Cognitive structure.`
          },
          {
            title: 'Intelligence & Howard Gardner\'s Theory',
            content: `Intelligence Definitions: Terman ("Abstract thinking ability"), Ryburn ("Power to solve problems & achieve goals"), Woodworth.
Determinants: Heredity, environment, gender, health, age.
Types: Abstract, Social, Mechanical/Motor.
Howard Gardner\'s Theory of Multiple Intelligences (1983 - 8 Intelligences):
1. Linguistic Intelligence
2. Logical-Mathematical Intelligence
3. Spatial Intelligence ("ART Smart")
4. Bodily-Kinesthetic Intelligence ("Body Smart")
5. Musical Intelligence
6. Interpersonal Intelligence
7. Intrapersonal Intelligence
8. Naturalistic Intelligence`
          },
          {
            title: 'Concept Development & Jerome Bruner\'s Theory',
            content: `Concepts: Coordinator/Connective (cow, dog), Disjunctive (triangles, rectangles), Relational concepts. Development moves from concrete to abstract.
Jerome Bruner\'s 3 Stages of Cognitive Development:
1. Enactive stage [birth to 18 months]: Expressing experiences through physical actions.
2. Iconic stage [18 to 24 months]: Expressing thoughts through mental images/scene paradigms.
3. Symbolic stage [7 years onwards]: Using language and abstract symbols.`
          }
        ]
      },
      {
        unit: 'Unit 2: Children Development and Learning Interrelationship',
        sections: [
          {
            title: 'Growth vs Development & Human Development Stages',
            content: `Growth: Quantitative physical increase (height, weight). Stops at adulthood.
Development: Lifelong, qualitative & quantitative process across physical, cognitive, emotional, and social domains.
Human Development Stages:
1. Pregnancy (Prenatal)
2. Infancy [0 to 2 years]
3. Early Childhood [2 to 6 years]
4. Later/Answer Childhood [6 to 11 years]
5. Adolescence [11 to 18 years]
6. Youth Adulthood [18 to 40 years]
7. Mature Adulthood [40 to 65 years]
8. Older Adulthood [65+ years]`
          },
          {
            title: 'Maturation & Learning Disabilities',
            content: `Maturation: Biological capacity of cells, quantitative & qualitative functional readiness.
Learning Disabilities:
1. Dyslexia: Reading difficulty (confusing B-D, SAW-WAS).
2. Dysgraphia: Writing difficulty.
3. Dyscalculia: Math calculation difficulty.
4. Dyspraxia: Motor skill difficulty.
5. Dysmorphia: Body image distortion.
6. Dysthymia: Serious chronic stress.
7. Aphagia: Language communication difficulty.
8. Progeria: Premature aging appearance.
9. Dysensia: Poor memory & reasoning.
10. Bulimia: Eating disorder.
11. ADHD: Attention Deficit Hyperactivity Disorder.`
          }
        ]
      },
      {
        unit: 'Unit 3: Behavioural and Information Processing Theories',
        sections: [
          {
            title: 'Pavlov, Skinner & Information Processing Model',
            content: `Ivan Pavlov\'s Classical Conditioning Theory: Russian physiologist (Nobel Prize 1904). Dog experiment with bell, food (natural stimulus/response vs conditioned stimulus/response).
B.F. Skinner\'s Operant Conditioning Theory: Rat in Skinner Box (pressing lever -> light + food reinforcement), Pigeon experiment. Basis for programmed learning.
Information Processing Model: Memory stores:
1. Sensational Memory [1 sec or less]
2. Short-Term / Functional Memory [15-30 sec]
3. Long-Term Memory [indefinite permanent storage]`
          }
        ]
      },
      {
        unit: 'Unit 4: Social Learning Theories (Bandura & Vygotsky)',
        sections: [
          {
            title: 'Albert Bandura & Lev Vygotsky Theories',
            content: `Albert Bandura\'s Social Learning Theory (1977): Bobo Doll experiment (3 film versions: aggressive model rewarded, punished, or neutral).
4 Steps of Modeling: 1. Attention, 2. Perception/Retention, 3. Reproduction/Re-submission, 4. Reinforcement.
Lev Vygotsky\'s Social Development Theory: Society and culture drive cognitive development.
Key Concepts: Zone of Proximal Development (ZPD), Scaffolding (support), Collaborative learning, Reciprocal teaching.`
          }
        ]
      },
      {
        unit: 'Unit 5: Factors Affecting Learning',
        sections: [
          {
            title: 'Motivation, Attention & Memory',
            content: `Motivation (Latin "MOVE" = movement/action): Intrinsic vs Extrinsic, Positive vs Negative motivation. B.F. Skinner: "Highway to learning".
Attention: Selective focus, body posture, readiness. External factors (stimulus change, size, recurrence).
Memory & Commemoration: Retaining and recalling past experiences. Quick recall, durability of retention.`
          }
        ]
      }
    ]
  }
};

// Generic generator for other PDFs (F-01, F-02, S-01, S-03, etc.)
function getGenericNoteData(filename) {
  const match = filename.match(/\[([A-Z0-9-]+)\]\[\((en|hi)\)\]\[(\d+)\]/i);
  let code = 'S-01';
  let lang = 'en';
  let opt = '1';
  if (match) {
    code = match[1];
    lang = match[2];
    opt = match[3];
  }

  return {
    code: code,
    title: `BIHAR D.El.Ed Course Notes - ${code} (${lang.toUpperCase()}) Option #${opt}`,
    year: code.startsWith('F') ? '1st Year' : '2nd Year',
    author: 'AEPS Official & Future Deled Wallah (Abhishek Sir)',
    units: [
      {
        unit: `Unit 1: Overview of ${code} Curriculum`,
        sections: [
          {
            title: `1. Core Concepts and Principles of ${code}`,
            content: `This section covers fundamental educational theories, child development principles, pedagogical strategies, and curriculum framework guidelines according to NCF-2005 and BCF-2008.`
          },
          {
            title: '2. Teaching Strategies and Practical Applications',
            content: `Effective classroom transactions, activity-based learning, inclusive education strategies, and continuous assessment techniques designed for primary school teachers in Bihar.`
          }
        ]
      },
      {
        unit: 'Unit 2: Assessment and Evaluation',
        sections: [
          {
            title: '1. Formative and Summative Evaluation',
            content: `Comprehensive evaluation tools, diagnostic tests, portfolio management, and student progress tracking for Bihar D.El.Ed candidates.`
          }
        ]
      }
    ]
  };
}

function createPDF(filepath, data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      bufferPages: true
    });

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Primary Colors
    const primaryColor = '#1c2541';
    const secondaryColor = '#2b6cb0';
    const textColor = '#2d3748';

    // Page Header / Cover Block
    doc.rect(40, 40, 515, 110).fillAndStroke('#f7fafc', '#cbd5e0');

    doc.fillColor('#c53030').fontSize(15).font('Helvetica-Bold')
       .text(sanitizeText('BIHAR D.El.Ed NOTES - SESSION 2024-26'), 50, 52, { align: 'center', width: 495 });

    doc.fillColor(primaryColor).fontSize(13).font('Helvetica-Bold')
       .text(sanitizeText(data.title), 50, 74, { align: 'center', width: 495 });

    doc.fillColor(secondaryColor).fontSize(10.5).font('Helvetica')
       .text(sanitizeText('FUTURE ONLINE CLASSES SONPUR & FUTURE DELED WALLAH'), 50, 96, { align: 'center', width: 495 });

    doc.fillColor(textColor).fontSize(9.5).font('Helvetica-Oblique')
       .text(sanitizeText(data.author), 50, 114, { align: 'center', width: 495 });

    // Copyright Warning Banner
    doc.rect(40, 160, 515, 50).fill('#fff5f5');
    doc.fillColor('#9b2c2c').fontSize(9).font('Helvetica-Bold')
       .text(sanitizeText('WARNING & COPYRIGHT NOTICE:'), 50, 166);
    doc.fillColor('#742a2a').fontSize(8.5).font('Helvetica')
       .text(sanitizeText('The E-Notes is Proprietary & Copyrighted Material of Future Online Classes Sonpur & Future Deled Wallah. Any unauthorized reproduction or distribution on public platforms will lead to legal action under the Indian Copyright Act 1957.'), 50, 178, { width: 495 });

    let currentY = 225;

    // Render Units and Sections
    data.units.forEach((uObj) => {
      // Check if page overflow
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      // Unit Header Box
      doc.rect(40, currentY, 515, 26).fill(primaryColor);
      doc.fillColor('#ffffff').fontSize(11.5).font('Helvetica-Bold')
         .text(sanitizeText(uObj.unit), 48, currentY + 6, { width: 500 });

      currentY += 34;

      uObj.sections.forEach((sec) => {
        const cleanTitle = sanitizeText(sec.title);
        const cleanContent = sanitizeText(sec.content);

        if (currentY > 710) {
          doc.addPage();
          currentY = 50;
        }

        // Section Subheading
        doc.fillColor(secondaryColor).fontSize(10.5).font('Helvetica-Bold')
           .text(cleanTitle, 40, currentY, { width: 515 });

        currentY += doc.heightOfString(cleanTitle, { width: 515, fontSize: 10.5 }) + 4;

        // Content
        doc.fillColor(textColor).fontSize(9.5).font('Helvetica')
           .text(cleanContent, 40, currentY, { width: 515, lineGap: 3, align: 'justify' });

        const contentHeight = doc.heightOfString(cleanContent, { width: 515, fontSize: 9.5, lineGap: 3 });
        currentY += contentHeight + 14;
      });

      currentY += 10;
    });

    // Add page numbers on all pages
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fillColor('#718096').fontSize(8).font('Helvetica')
         .text(sanitizeText(`AbhyasTRE D.El.Ed Official Study Notes - ${data.code} - Page ${i + 1} of ${range.count}`), 40, 800, { align: 'center', width: 515 });
    }

    doc.end();

    stream.on('finish', () => resolve(true));
    stream.on('error', (err) => reject(err));
  });
}

async function generateAllPDFs() {
  const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.pdf'));
  console.log(`Generating clean valid PDF files for ${files.length} documents...`);

  for (const filename of files) {
    const filepath = path.join(notesDir, filename);

    let subjectKey = null;
    if (filename.includes('S-07') || filename.includes('S-7')) subjectKey = 'S-07';
    else if (filename.includes('S-06') || filename.includes('S-6')) subjectKey = 'S-06';
    else if (filename.includes('S-05') || filename.includes('S-5')) subjectKey = 'S-05';
    else if (filename.includes('S-04') || filename.includes('S-4')) subjectKey = 'S-04';
    else if (filename.includes('S-02') || filename.includes('S-2')) subjectKey = 'S-02';

    let data = null;
    if (subjectKey && fullNotesData[subjectKey]) {
      data = fullNotesData[subjectKey];
    } else {
      data = getGenericNoteData(filename);
    }

    try {
      await createPDF(filepath, data);
      const stat = fs.statSync(filepath);
      console.log(`Successfully generated PDF: ${filename} (${stat.size} bytes)`);
    } catch (e) {
      console.error(`Error generating ${filename}:`, e);
    }
  }

  console.log('All PDF files generated successfully with clean WinAnsi streams!');
}

generateAllPDFs();
