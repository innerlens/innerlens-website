
TRUNCATE TABLE question_options CASCADE;
TRUNCATE TABLE questions CASCADE;
TRUNCATE TABLE personalities CASCADE;
TRUNCATE TABLE dichotomies CASCADE;
TRUNCATE TABLE traits CASCADE;

WITH trait_data AS (
  SELECT * FROM (VALUES
    ('E', 'Extraversion', 'Extraversion describes how you interact with the world and where you draw your energy from. As an Extravert, you gain energy from engaging with the external world of people, activities, and things. You prefer to think out loud, learn through discussion, and have a wide social network. You likely enjoy group activities, are quick to share thoughts, and may become drained when spending too much time alone. Extraverts tend to speak first and reflect later, take initiative in social situations, and prefer collaborative environments. Your outgoing nature makes you approachable and often puts others at ease, though you may sometimes need to practice active listening and giving others space to contribute.'),
    ('I', 'Introversion', 'Introversion describes how you interact with the world and where you draw your energy from. As an Introvert, you gain energy from your rich inner world of ideas, emotions, and impressions. You prefer deep one-on-one conversations over large gatherings and need time alone to recharge after social interaction. You likely think before speaking, observe before participating, and maintain a smaller circle of close friends. Introverts typically process information internally before sharing conclusions, prefer focused work environments with minimal interruptions, and enjoy activities that allow for reflection and depth. Your thoughtful nature brings valuable perspective to groups, though you may sometimes need to push yourself to speak up and share your insights more readily.'),
    ('S', 'Sensing', 'Sensing describes how you take in information from the world around you. As a Sensing type, you primarily trust information that is concrete, practical, and verifiable through your five senses. You have a natural attention to detail and remember specific facts rather than general impressions. You value practical application over theory and prefer step-by-step instructions to conceptual explanations. Sensing types excel at working with tangible realities, noticing changes in environments, and drawing on past experience to solve current problems. You appreciate traditions, proven methods, and realistic approaches. Your grounded perspective helps groups stay practical and focused on facts, though you may sometimes need to stretch yourself to consider future possibilities and abstract concepts.'),
    ('N', 'Intuition', 'Intuition describes how you take in information from the world around you. As an Intuitive type, you naturally focus on patterns, connections, and possibilities that go beyond sensory data. You are drawn to the theoretical, novel, and abstract, often asking "what if" and imagining future potential. You readily see relationships between concepts and may remember the general impression of events rather than specific details. Intuitive types tend to follow hunches, trust insights that arise seemingly from nowhere, and enjoy discovering new approaches to problems. You communicate in metaphors and analogies, sometimes skipping steps in explanations. Your innovative perspective brings valuable creativity to groups, though you may sometimes need to ground your ideas in practical reality and attend to important details.'),
    ('T', 'Thinking', 'Thinking describes how you make decisions and form judgments. As a Thinking type, you base decisions primarily on objective principles and logical analysis of cause and effect. You value clarity, consistency, competence, and fairness defined as equal treatment for all. You can easily detach from a situation to analyze it impartially and tend to be straightforward in your communication. Thinking types naturally notice flaws in reasoning, question assumptions, and may engage in healthy debate to reach the best solution. You make decisions by establishing clear criteria and applying them systematically. Your logical approach brings valuable objectivity to groups, though you may sometimes need to consider the human impact of decisions and express appropriate appreciation and support for others.'),
    ('F', 'Feeling', 'Feeling describes how you make decisions and form judgments. As a Feeling type, you base decisions primarily on personal values and how actions will affect the people involved. You value harmony, connection, empathy, and fairness defined as recognizing individual circumstances. You naturally consider the needs and perspectives of others when making choices. Feeling types excel at understanding emotional nuances, building consensus, and providing encouragement. You make decisions by weighing what matters most to the people involved, including yourself. Your compassionate approach brings valuable humanity to groups, fostering cooperation and goodwill, though you may sometimes need to develop comfort with necessary criticism and make tough decisions despite emotional impact.'),
    ('J', 'Judging', 'Judging describes how you approach structure and organization in your outer life. As a Judging type, you prefer planned, orderly environments and find satisfaction in completing tasks and reaching closure. You like to make decisions promptly, create and follow schedules, and establish clear expectations. Judging types tend to work steadily toward goals, meet deadlines in advance, and prefer to know whats happening next. You enjoy the sense of accomplishment that comes from finishing projects and checking items off your list. Your organized approach brings valuable structure to groups, ensuring progress toward goals, though you may sometimes need to develop flexibility when plans change and patience with open-ended processes that require extended exploration before decisions can be made.'),
    ('P', 'Perceiving', 'Perceiving describes how you approach structure and organization in your outer life. As a Perceiving type, you prefer flexibility, spontaneity, and keeping options open as long as possible. You adapt easily to changing circumstances and may see schedules as guidelines rather than commitments. Perceiving types tend to work in bursts of energy, often doing their best work close to deadlines when enthusiasm naturally peaks. You enjoy starting new projects, exploring possibilities, and responding to the moment. You prefer to gather more information rather than reach premature closure. Your adaptable approach brings valuable openness to groups, ensuring all options are considered, though you may sometimes need to develop more structure around important commitments and recognize when additional information has diminishing returns compared to making a decision.')
  ) AS t(code, name, description)
)
INSERT INTO traits (code, name, description)
SELECT code, name, description FROM trait_data;

WITH dichotomy_data AS (
  SELECT * FROM (VALUES
    (1, 'E', 'I'),
    (2, 'S', 'N'),
    (3, 'T', 'F'),
    (4, 'J', 'P')
  ) AS d(index, left_code, right_code)
)
INSERT INTO dichotomies (index, left_trait_id, right_trait_id)
SELECT 
  d.index,
  (SELECT id FROM traits WHERE code = d.left_code),
  (SELECT id FROM traits WHERE code = d.right_code)
FROM dichotomy_data d;

WITH personality_data AS (
  SELECT * FROM (VALUES
    ('ENFJ', 'The Giver', 'As an ENFJ (The Giver), you possess exceptional people skills and natural leadership abilities. Your empathetic nature allows you to understand others deeply, often sensing their needs before they express them. You find fulfillment in helping others grow and reach their potential. Highly organized and future-oriented, you excel at creating harmony in groups while maintaining clear direction. Your communication style is warm yet persuasive, making you effective at inspiring collective action. You thrive in environments where you can make meaningful connections and contribute to the greater good. While sometimes prone to taking on too much responsibility for others'' happiness, your genuine concern and charismatic presence make you a valued friend, leader, and community member.'),
    
    ('ENTJ', 'The Executive', 'As an ENTJ (The Executive), you are a natural-born leader with exceptional strategic thinking abilities. Your decisive and confident approach to challenges makes you effective at implementing large-scale plans and driving organizations forward. You value knowledge, competence, and clarity, often setting high standards for yourself and others. Your analytical mind quickly identifies inefficiencies and creates systems to address them. Direct and honest in communication, you prioritize truth over tact when necessary. You thrive in competitive environments where you can exercise your leadership skills and drive toward clear objectives. While sometimes perceived as intimidating due to your forceful nature, your ability to envision and execute ambitious goals makes you an invaluable asset in any leadership position.'),
    
    ('ENFP', 'The Inspirer', 'As an ENFP (The Inspirer), you are characterized by your contagious enthusiasm and creative spirit. Your imagination knows no bounds, constantly generating innovative ideas and possibilities. You connect deeply with people through your genuine interest in their lives and experiences. Adaptable and spontaneous, you prefer flexibility over rigid structures, allowing you to respond creatively to new situations. You''re driven by a strong sense of values and seek meaning in your pursuits. Your communication style is expressive and persuasive, often using stories and metaphors to convey complex ideas. You thrive in environments that allow for creative freedom and meaningful human connection. While sometimes struggling with follow-through on details, your ability to inspire others and see potential where others don''t makes you a catalyst for positive change.'),
    
    ('ENTP', 'The Visionary', 'As an ENTP (The Visionary), you possess a quick-witted intellect and an insatiable curiosity about the world. You excel at identifying patterns and connections others miss, allowing you to generate innovative solutions to complex problems. You enjoy intellectual sparring and approaching issues from unconventional angles. Adaptable and resourceful, you thrive in dynamic environments where you can continuously explore new ideas. You value knowledge and competence, often pursuing diverse interests and areas of expertise. Your communication style is engaging and thought-provoking, challenging others to think differently. You excel in roles that require creative problem-solving and strategic innovation. While sometimes leaving projects unfinished when they no longer intellectually stimulate you, your ability to envision possibilities and challenge established thinking makes you an invaluable agent of change.'),
    
    ('ESFJ', 'The Caregiver', 'As an ESFJ (The Caregiver), you have a remarkable ability to create harmonious environments and maintain strong social connections. Your practical approach to helping others is grounded in a deep sense of responsibility and commitment to traditional values. You excel at organizing people and resources to meet tangible needs in your community. Detail-oriented and reliable, you follow through on commitments and maintain clear structures. Your emotional intelligence allows you to read rooms accurately and respond appropriately to social dynamics. You thrive in environments with clear expectations and appreciate recognition for your contributions. While sometimes taking criticism personally, your genuine concern for others'' wellbeing and your practical approach to care make you a cornerstone of support for friends, family, and communities.'),
    
    ('ESFP', 'The Performer', 'As an ESFP (The Performer), you embrace life with unmatched enthusiasm and a love for spontaneity. Your vibrant energy draws others to you, making you the heart of social gatherings. You experience the world through your senses, fully immersing yourself in the present moment and finding joy in simple pleasures. Adaptable and pragmatic, you excel at responding to immediate needs and creating fun, engaging experiences. Your natural warmth and generosity make others feel instantly comfortable in your presence. You communicate expressively, often using humor and storytelling to connect. You thrive in dynamic environments where you can interact with diverse people and respond to changing situations. While sometimes avoiding long-term planning in favor of immediate experiences, your ability to bring joy and create memorable moments makes you a cherished friend and invaluable team member.'),
    
    ('ESTJ', 'The Guardian', 'As an ESTJ (The Guardian), you embody reliability and practical leadership. Your methodical approach to organization creates stability in both professional and personal spheres. You value tradition, clear structures, and established systems, preferring tried-and-true methods over untested innovations. Your decision-making is logical and efficient, focusing on objective facts rather than subjective feelings. Responsible and dutiful, you follow through on commitments and expect others to do the same. Your communication style is direct and straightforward, valuing clarity over diplomacy. You excel in environments with clear hierarchies and defined expectations. While sometimes perceived as rigid in your adherence to rules, your dependability and organizational skills make you an essential stabilizing force in any team or family unit.'),
    
    ('ESTP', 'The Doer', 'As an ESTP (The Doer), you possess remarkable tactical intelligence and thrive in fast-paced, high-pressure situations. Your keen observational skills allow you to notice details others miss, making you exceptionally responsive to your environment. Pragmatic and results-oriented, you focus on immediate impact rather than theoretical possibilities. You have a natural ability to persuade others and negotiate effectively, often using charm and humor to navigate social situations. Risk-tolerant and action-oriented, you''re willing to seize opportunities when others hesitate. Your communication style is direct and energetic, cutting through complexity to get to the point. You excel in roles requiring quick thinking and immediate action. While sometimes impatient with abstract discussions or long-term planning, your ability to handle crises and produce tangible results makes you invaluable in any dynamic environment.'),
    
    ('INFJ', 'The Protector', 'As an INFJ (The Protector), you possess a rare combination of deep empathy and strategic thinking. Your rich inner world is guided by strong personal values and a vision for improving humanity. Insightful and perceptive, you often understand others'' motivations better than they understand themselves. You seek meaning and purpose in all you do, rarely satisfied with surface-level connections or endeavors. Despite your reserved nature, you form profound bonds with select individuals who share your values. Your communication style is thoughtful and nuanced, often expressing complex ideas through metaphor and symbolism. You excel in roles that allow you to help others grow while maintaining your independence. While sometimes feeling misunderstood due to your complexity, your unique ability to combine compassion with vision makes you a powerful force for positive change.'),
    
    ('INFP', 'The Idealist', 'As an INFP (The Idealist), you navigate life guided by a strong internal moral compass and deep empathy for others. Your rich imagination allows you to envision possibilities for a better world that others might miss. Authentic to your core, you refuse to compromise your values for convenience or conformity. You process experiences deeply, finding meaning and connection in everyday moments. While quiet in large groups, you form profound bonds with those who share your values. Your communication style is nuanced and expressive, often through writing or creative pursuits. You excel in roles that align with your values and allow creative autonomy. While sometimes struggling with practical details or criticism of your deeply held beliefs, your unwavering commitment to authenticity and compassionate understanding makes you a gentle but powerful advocate for positive change.'),
    
    ('INTJ', 'The Scientist', 'As an INTJ (The Scientist), you possess exceptional strategic thinking abilities and a drive for continuous improvement. Your analytical mind naturally identifies patterns and creates systems to solve complex problems. Independent and determined, you pursue your visions with remarkable focus and perseverance. You value knowledge and competence highly, both in yourself and others. Your thinking is future-oriented, always considering long-term implications rather than immediate gratification. Your communication style is precise and logical, valuing substance over social niceties. You excel in roles requiring strategic planning and intellectual challenge. While sometimes perceived as aloof due to your private nature, your commitment to excellence and ability to implement transformative ideas makes you an invaluable innovator and thought leader.'),
    
    ('INTP', 'The Thinker', 'As an INTP (The Thinker), you possess a brilliant analytical mind that constantly seeks to understand how things work at the most fundamental level. Your intellectual curiosity drives you to explore complex theoretical frameworks and develop innovative solutions. Independent and original in your thinking, you''re unafraid to challenge established ideas when they don''t hold up to logical scrutiny. You value precision in language and thought, often crafting careful arguments that account for multiple perspectives. Your approach to problems is creative yet systematic, identifying logical inconsistencies others miss. You excel in roles requiring deep analysis and theoretical innovation. While sometimes struggling with practical implementation or emotional expression, your ability to see beyond conventional thinking and develop elegant conceptual frameworks makes you an invaluable contributor to intellectual advancement.'),
    
    ('ISFJ', 'The Nurturer', 'As an ISFJ (The Nurturer), you possess an extraordinary capacity for detailed care and practical support of others. Your remarkable memory for personal details allows you to provide thoughtful gestures that make others feel truly seen and valued. Loyal and dependable, you create stability through consistent actions rather than grand promises. You approach responsibilities with quiet diligence, often taking on more than your share without seeking recognition. Traditions and history hold special meaning for you, as you value the continuity they provide. Your approach to helping others is practical and specific, focusing on tangible needs rather than abstract solutions. You excel in roles requiring attention to detail and patient care. While sometimes struggling to express your own needs, your reliable presence and thoughtful support make you an irreplaceable foundation for your family, friends, and community.'),
    
    ('ISFP', 'The Artist', 'As an ISFP (The Artist), you are a true artist of life, crafting beauty and meaning in everything you do. Your creative spirit is matched only by your deep sensitivity to the world around you. You have an uncanny ability to live fully in the present moment, savoring life''s experiences through your finely tuned senses. Your spontaneous nature leads you to embrace life''s adventures with open arms. You''re not one for rigid plans or structures; instead, you prefer to go with the flow, adapting to situations as they arise. This flexibility allows you to make the most of every opportunity that comes your way. Your strong personal values guide your decisions, and you seek authenticity in all your interactions. Though quiet about your accomplishments, your gentle creativity and genuine kindness leave a lasting impression on those fortunate enough to know you.'),
    
    ('ISTJ', 'The Duty Fulfiller', 'As an ISTJ (The Duty Fulfiller), you embody reliability and practical wisdom in everything you do. Your methodical approach to responsibilities creates stability that others depend upon. Incredibly detail-oriented, you notice and remember specific information that others overlook. You value tradition and established systems, appreciating the wisdom accumulated through experience. Your decision-making is logical and thorough, carefully considering relevant facts before proceeding. Honest and direct, you prefer clarity over diplomacy and follow through on your commitments without exception. You excel in roles requiring accuracy, consistency, and integrity. While sometimes perceived as inflexible due to your preference for established procedures, your dependability and practical intelligence make you an essential foundation for any organization or family. Your quiet competence often becomes apparent only when you''re absent, revealing how much others rely on your consistent presence.'),
    
    ('ISTP', 'The Mechanic', 'As an ISTP (The Mechanic), you possess exceptional hands-on problem-solving abilities and a natural understanding of how systems work. Your keen observational skills allow you to notice details others miss, giving you an edge in troubleshooting complex problems. Independent and pragmatic, you prefer direct experience over theoretical learning, often mastering skills through experimentation. You value efficiency and practical results, cutting through unnecessary complications to find the most direct solution. Your cool composure under pressure makes you invaluable in crisis situations, where your quick thinking and tactical intelligence shine. You communicate concisely, saying only what needs to be said. You excel in roles requiring technical expertise and immediate problem-solving. While sometimes perceived as detached due to your reserved nature, your practical intelligence and ability to remain calm and effective under pressure make you an essential problem-solver in any setting.')
  ) AS p(code, name, description)
)
INSERT INTO personalities (code, name, description)
SELECT code, name, description FROM personality_data;

WITH question_data AS (
  SELECT * FROM (VALUES
    (1, 'In a social gathering, do you feel more energized by interacting with a large group of people or by having one-on-one conversations?', 1),
    (2, 'How do you typically recharge after a busy day?', 1),
    (3, 'When facing a challenge, do you prefer brainstorming ideas with others or working through it independently?', 1),
    (4, 'In your free time, do you find yourself seeking out social events and gatherings or enjoying quieter activities at home?', 1),
    (5, 'How do you feel about small talk?', 1),
    (6, 'When making decisions, do you rely more on your own instincts and feelings or seek input from others?', 1),
    (7, 'How do you handle new and unfamiliar situations?', 1),
    (8, 'In a work or team setting, do you prefer open office spaces and collaboration or individual workspaces?', 1),
    (9, 'How do you typically respond to being the focal point in a group setting?', 1),
    (10, 'When planning a weekend, do you lean towards social plans with friends or quiet time for yourself?', 1),
    (11, 'When meeting new people, are you more likely to initiate conversations and introductions or wait for others to approach you?', 1),

    (12, 'When faced with a problem, do you prefer to rely on concrete facts and details or explore possibilities and potential meanings?', 2),
    (13, 'How do you approach new information or learning?', 2),
    (14, 'In a conversation, are you more focused on the present and current details or on future possibilities and patterns?', 2),
    (15, 'When planning a trip, do you prefer to have a detailed itinerary and clear schedule or leave room for spontaneous experiences and changes?', 2),
    (16, 'How do you make decisions?', 2),
    (17, 'When working on a project, do you tend to focus on the specific tasks at hand or the overall vision and goals?', 2),
    (18, 'In a group discussion, do you prefer to stick to the facts and details or contribute ideas and theories?', 2),
    (19, 'How do you handle unexpected changes or disruptions to your plans?', 2),
    (20, 'When recalling a past event, do you focus more on the specific details and occurrences or the overall impressions and meanings?', 2),
    (21, 'When reading a book or watching a movie, do you pay close attention to the plot and events or look for deeper meanings and symbolism?', 2),
    (22, 'How do you prefer to receive information?', 2),
    (23, 'When faced with a decision, do you rely more on your past experiences and proven methods or seek out innovative and creative solutions?', 2),
    (24, 'In a brainstorming session, do you tend to come up with practical, actionable ideas or imaginative, out-of-the-box concepts?', 2),
    (25, 'How do you approach problem-solving?', 2),

    (26, 'When making decisions, do you prioritize logical analysis and objective criteria or consider the impact on people and relationships?', 3),
    (27, 'How do you handle criticism or feedback?', 3),
    (28, 'When faced with a problem, do you rely more on your head and reason or your heart and empathy?', 3),
    (29, 'How do you prioritize tasks and responsibilities?', 3),
    (30, 'In a group decision-making process, do you tend to advocate for the most logical and rational choice or the one that aligns with personal values and harmony?', 3),
    (31, 'When giving feedback, do you focus on providing objective analysis or consider the individual''s feelings and emotional response?', 3),
    (32, 'How do you express your opinions in a debate or discussion?', 3),
    (33, 'When solving a problem, do you prioritize efficiency and effectiveness, even if it means being blunt, or do you consider the feelings of those involved?', 3),
    (34, 'In a work environment, do you value objective performance metrics and results or prioritize a positive and supportive team culture?', 3),
    (35, 'How do you approach conflict resolution?', 3),
    (36, 'When planning an event or project, do you prioritize the logical steps and timeline or consider the emotional atmosphere and team dynamics?', 3),
    (37, 'How do you cope with stress or pressure?', 3),
    (38, 'When making decisions, what holds more weight for you?', 3),
    (39, 'When providing feedback, do you prioritize offering constructive criticism and improvement suggestions or highlighting positive aspects and encouraging the individual?', 3),

    (40, 'How do you feel about making plans and sticking to a schedule?', 4),
    (41, 'When starting a project, do you prefer to have a detailed plan in place or do you like to explore possibilities and figure it out as you go?', 4),
    (42, 'How do you approach deadlines?', 4),
    (43, 'In a work setting, do you prefer a clear and organized workspace or are you comfortable with a more flexible and adaptable environment?', 4),
    (44, 'When packing for a trip, do you plan and make a checklist in advance or pack on the fly, throwing in what feels right at the moment?', 4),
    (45, 'What do you do when your plans suddenly change?', 4),
    (46, 'When faced with a new opportunity, do you prefer to consider the advantages and disadvantages prior to making a decision or go with the flow and see where it takes you?', 4),
    (47, 'How do you approach work tasks?', 4),
    (48, 'When organizing your day, do you prefer to have a structured schedule or keep things open and flexible?', 4),
    (49, 'How do you feel about routine and predictability?', 4),
    (50, 'In a decision-making process, do you like to reach a conclusion and move on or prefer to keep options open and gather more information?', 4)
  ) AS q(number, prompt, dichotomy_id)
)
INSERT INTO questions (number, prompt, dichotomy_id)
SELECT number, prompt, dichotomy_id FROM question_data
ORDER BY number;

WITH question_option_data AS (
  SELECT * FROM (VALUES
    -- E/I Questions (trait_code: E/I)
    ('Large group interactions', 1, 'E'), ('One-on-one conversations', 1, 'I'), 
    ('Spending time with friends or engaging in social activities', 2, 'E'), ('Having some alone time to relax and unwind', 2, 'I'), 
    ('Brainstorming with others', 3, 'E'), ('Working through it independently', 3, 'I'), 
    ('Social events and gatherings', 4, 'E'), ('Quieter activities at home', 4, 'I'), 
    ('Enjoy it and find it easy to engage in', 5, 'E'), ('Find it somewhat awkward or draining', 5, 'I'), 
    ('Seek others input', 6, 'E'), ('Rely on own instincts and feelings', 6, 'I'), 
    ('Embrace them with enthusiasm', 7, 'E'), ('Approach them with caution', 7, 'I'), 
    ('Open office spaces and collaboration', 8, 'E'), ('Individual workspaces', 8, 'I'), 
    ('Embrace it and feel at ease', 9, 'E'), ('Prefer to avoid being the center of attention', 9, 'I'), 
    ('Social plans with friends', 10, 'E'), ('Quiet time for yourself', 10, 'I'), 
    ('Initiate conversations and introductions', 11, 'E'), ('Wait for others to approach you', 11, 'I'), 
    
    -- S/N Questions (trait_code: S/N)
    ('Rely on concrete facts and details', 12, 'S'), ('Explore possibilities and potential meanings', 12, 'N'), 
    ('Prefer practical, hands-on experiences', 13, 'S'), ('Enjoy exploring theories and concepts', 13, 'N'), 
    ('Present and current details', 14, 'S'), ('Future possibilities and patterns', 14, 'N'), 
    ('Detailed itinerary and clear schedule', 15, 'S'), ('SLeave room for spontaneous experiences and changes', 15, 'N'), 
    ('Based on practical considerations and real-world implications', 16, 'S'), ('Consider potential outcomes and future possibilities', 16, 'N'), 
    ('Specific tasks at hand', 17, 'S'), ('Overall vision and goals', 17, 'N'), 
    ('Stick to facts and details', 18, 'S'), ('Contribute ideas and theories', 18, 'N'), 
    ('Prefer stability and may find changes challenging', 19, 'S'), ('Adapt well to changes and enjoy the flexibility', 19, 'N'), 
    ('Specific details and occurrences', 20, 'S'), ('Overall impressions and meanings', 20, 'N'), 
    ('Plot and events', 21, 'S'), ('Deeper meanings and symbolism', 21, 'N'), 
    ('Clear and straightforward explanations', 22, 'S'), ('Rich with possibilities and potential connections', 22, 'N'), 
    ('Past experiences and proven methods', 23, 'S'), (' Innovative and creative solutions', 23, 'N'), 
    ('Practical, actionable ideas', 24, 'S'), ('Imaginative, out-of-the-box concepts', 24, 'N'), 
    ('Step-by-step and methodical approach', 25, 'S'), ('Approaching with creativity and openness', 25, 'N'), 
    
    -- T/F Questions (trait_code: T/F) 
    ('Logical analysis and objective criteria', 26, 'T'), ('Consider the impact on people and relationships', 26, 'F'), 
    ('Focus on the facts and seek constructive solutions', 27, 'T'), ('Consider the emotional aspects and how it affects relationships', 27, 'F'), 
    ('Head and reason', 28, 'T'), ('Heart and empathy', 28, 'F'), 
    ('Based on logical importance and efficiency ', 29, 'T'), ('Considering the values and impact on people', 29, 'F'), 
    ('Logical and rational choice', 30, 'T'), ('Aligns with personal values and harmony', 30, 'F'), 
    ('Objective analysis', 31, 'T'), ('Consider the individuals feelings and emotional response', 31, 'F'), 
    ('Emphasize facts, evidence, and logical reasoning ', 32, 'T'), ('Consider personal values, emotions, and the impact on people', 32, 'F'), 
    ('Prioritize efficiency and effectiveness', 33, 'T'), ('Consider the feelings of those involved', 33, 'F'), 
    ('Objective performance metrics and results', 34, 'T'), ('Positive and supportive team culture', 34, 'F'), 
    ('Focus on finding logical solutions and compromises', 35, 'T'), ('Consider the emotional needs and harmony of individuals involved', 35, 'F'), 
    ('Logical steps and timeline', 36, 'T'), ('Emotional atmosphere and team dynamics', 36, 'F'), 
    ('Analyze the situation logically and strategize a plan', 37, 'T'), ('Seek emotional support and consider the impact on relationships', 37, 'F'), 
    ('Objective data and analysis', 38, 'T'), ('VPersonal values and the impact on people', 38, 'F'), 
    ('Constructive criticism and improvement suggestions', 39, 'T'), ('Highlighting positive aspects and encouraging the individual', 39, 'F'), 
    
    -- J/P Questions (trait_code: J/P)
    ('Enjoy making plans and prefer a structured schedule', 40, 'J'), ('Prefer flexibility and spontaneity, dislike strict schedules', 40, 'P'), 
    ('Prefer to have a detailed plan', 41, 'J'), ('Like to explore possibilities and figure it out as you go', 41, 'P'), 
    ('Work diligently to meet deadlines well in advance', 42, 'J'), ('Tend to work better under pressure and close to the deadline', 42, 'P'), 
    ('Prefer a clear and organized workspace', 43, 'J'), ('Comfortable with a more flexible and adaptable environment', 43, 'P'), 
    ('Plan and make a checklist in advance', 44, 'J'), ('Pack on the fly, throwing in what feels right', 44, 'P'), 
    ('Dislike unexpected changes and prefer to stick to the original plan', 45, 'J'), ('Adapt well to unexpected changes and enjoy the flexibility', 45, 'P'), 
    ('Consider the advantages and disadvantages prior to deciding', 46, 'J'), ('Go with the flow and see where it takes you', 46, 'P'), 
    ('Like to have a set plan and follow it step by step', 47, 'J'), ('Enjoy being flexible and adapting as the situation evolves', 47, 'P'), 
    ('To-do list with specific tasks and deadlines', 48, 'J'), ('Keep it open-ended and see where the day takes you', 48, 'P'), 
    ('Prefer routine and find comfort in predictability', 49, 'J'), ('Dislike routine and enjoy spontaneity', 49, 'P'), 
    ('Like to reach a conclusion and move on', 50, 'J'), ('Prefer to keep options open and gather more information', 50, 'P')
  ) AS qo(statement, question_number, trait_code)
)
INSERT INTO question_options (statement, question_id, trait_id)
SELECT 
  qo.statement,
  q.id AS question_id,
  t.id AS trait_id
FROM question_option_data qo
JOIN questions q ON q.number = qo.question_number
JOIN traits t ON t.code = qo.trait_code;