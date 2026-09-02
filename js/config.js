/**
 * DRAKEN'26 — Centralized Configuration
 * All changeable data lives here for easy updates.
 */

const CONFIG = {

    /* ── Backend Endpoint ─────────────────────────────── */
    // Deployed Google Apps Script Web App URL
    API_URL: 'https://script.google.com/macros/s/AKfycbxjElr2hAN0iIGpnsG-a5ZSQuWtGoqlGtnpD6FpO6NJQ5w2HSvCAdURoV6RPDKXCPUN/exec',

    /* ── Registration Closing & Countdown Dates ───────── */
    REGISTRATION_CLOSE_DATE: '2026-09-18T23:59:59+05:30',
    COUNTDOWN_DATE: '2026-09-26T09:00:00+05:30',

    /* ── Institution ──────────────────────────────────── */
    COLLEGE: {
        name: 'ANJALAI AMMAL MAHALINGAM ENGINEERING COLLEGE',
        shortName: 'AAMEC',
        code: '8204',
        affiliation: 'Affiliated to Anna University, Chennai | A NAAC Accredited Institution',
        dept: 'Department of Electronics & Communication Engineering',
        location: 'Kovilvenni, Tiruvarur District, Tamil Nadu — 614403, India',
        logoPath: 'assets/images/aamec_logo.webp'
    },

    /* ── Official Contact ─────────────────────────────── */
    EMAIL: 'drakenece26@gmail.com',
    PHONE: '811-001-3816',

    /* ── Map ──────────────────────────────────────────── */
    MAP_EMBED_URL: 'https://maps.google.com/maps?q=Anjalai+Ammal+Mahalingam+Engineering+College+Kovilvenni&t=&z=15&ie=UTF8&iwloc=&output=embed',
    MAP_DIRECTIONS_URL: 'https://maps.google.com/?q=Anjalai+Ammal+Mahalingam+Engineering+College+Kovilvenni',

    /* ── Intro Sound ──────────────────────────────────── */
    INTRO_SOUND_PATH: 'assets/audio/intro.mp3',

    /* ── Registration Capacity (UNLIMITED) ───────────── */
    CAPACITY: {
        unlimited: true
    },

    /* ── Events ───────────────────────────────────────── */
    EVENTS: {
        technical: [
            {
                id: 'unveil',
                index: '01',
                name: 'UNVEIL',
                tagline: 'Beyond the Known',
                type: 'Paper Presentation',
                category: 'Technical',
                teamSize: '2 Members',
                duration: '6 Minutes Presentation + 2 Minutes Q&A',
                description: 'UNVEIL challenges participants to reveal and present research ideas, technical concepts, and innovations that go beyond conventional, well-known solutions – uncovering fresh perspectives on engineering and emerging technologies.',
                rules: [
                    'Paper must relate to engineering, technology, or emerging innovations.',
                    'Maximum 20 slides permitted.',
                    'Content must be original and free from plagiarism.',
                    'Teams must strictly adhere to the allotted time.',
                    'Judges\' decision will be final.'
                ],
                judgingCriteria: [
                    'Technical Depth',
                    'Originality / Novelty',
                    'Clarity of Explanation',
                    'Presentation Skills',
                    'Response to Judges\' Questions'
                ]
            },
            {
                id: 'fuse',
                index: '02',
                name: 'FUSE',
                tagline: 'Where Ideas Collide',
                type: 'Ideathon',
                category: 'Technical',
                teamSize: '2 Members',
                duration: 'Pitching Round',
                description: 'FUSE is where diverse ideas collide and merge to spark innovative, out-of-the-box solutions for real-world problems – encouraging participants to combine creativity, logic, and teamwork into one workable concept.',
                rules: [
                    'Teams must propose original, practical, and feasible ideas.',
                    'Each team gets a fixed time to pitch their final idea.',
                    'Use of pre-built/copied solutions is not allowed.',
                    'Judges\' decision will be final.'
                ],
                judgingCriteria: [
                    'Innovation & Creativity',
                    'Feasibility',
                    'Problem-Solution Fit',
                    'Technical Approach',
                    'Pitch & Presentation'
                ]
            },
            {
                id: 'manifest',
                index: '03',
                name: 'MANIFEST',
                tagline: 'Where Vision Becomes Real',
                type: 'Project Expo',
                category: 'Technical',
                teamSize: '2 Members',
                duration: '6 Minutes Demonstration + 2 Minutes Q&A',
                description: 'MANIFEST gives participants a platform to turn their vision into reality – showcasing working hardware/software projects and prototypes and explaining how the idea was manifested into a functional solution.',
                rules: [
                    'Participants must bring their own project models/prototypes.',
                    'Project must be developed by the presenting team.',
                    'Live demonstration is mandatory wherever applicable.',
                    'Organizers are not responsible for damage to project materials.',
                    'Judges\' decision will be final.'
                ],
                judgingCriteria: [
                    'Innovation',
                    'Technical Implementation',
                    'Practical Application',
                    'Demonstration Quality',
                    'Presentation Skills'
                ]
            }
        ],
        nonTechnical: [
            {
                id: 'cinora',
                index: '04',
                name: 'CINORA',
                tagline: 'Lights, Camera, Imagination',
                type: 'Short Film Challenge',
                category: 'Non-Technical',
                teamSize: '2 Members (Registered)',
                duration: 'Video Duration: 3–4 Minutes',
                format: 'Theme Reveal → Shooting & Editing → Screening & Judging',
                description: 'CINORA turns participants into filmmakers for a day. Teams are given a theme/prompt on the spot and must write, shoot, and edit a short film within a strict, fast time limit – testing storytelling, creativity, direction, and quick execution under pressure.',
                rules: [
                    'Short films directed and produced by participating team only.',
                    'Video duration must be 3–4 minutes.',
                    'Voice and audio must be clear throughout.',
                    'Content must be original and appropriate.',
                    'AI tools may be used for editing assistance.',
                    'Offensive or inappropriate content is strictly prohibited.',
                    'Judges\' decision will be final and binding.'
                ],
                judgingCriteria: [
                    'Storytelling & Creativity',
                    'Direction & Shot Quality',
                    'Editing within Time Limit',
                    'Theme Relevance',
                    'Overall Impact'
                ]
            },
            {
                id: 'gameverse',
                index: '05',
                name: 'GAME VERSE',
                tagline: 'Play Learn Conquer',
                type: 'Rapid Mini-Games Challenge',
                category: 'Non-Technical',
                teamSize: '2 Members',
                duration: 'Station Time Limits',
                format: 'Multiple Mini-Game Stations → Points Record → Ranking',
                description: 'GAME VERSE is a fast-paced series of quick mini-games, each played against the clock. Teams move from one station to the next, testing speed, reflexes, logic, and teamwork.',
                rules: [
                    'Both team members must participate in every mini-game.',
                    'Each mini-game must be completed within its time limit.',
                    'Station instructions will be explained before each round.',
                    'Any unfair practice leads to disqualification.',
                    'Judges\'/coordinators\' decision will be final.'
                ],
                judgingCriteria: [
                    'Speed',
                    'Accuracy',
                    'Teamwork & Coordination',
                    'Problem-Solving Under Pressure',
                    'Overall Score'
                ]
            },
            {
                id: 'aamec-got-talent',
                index: '06',
                name: 'AAMEC GOT TALENT',
                tagline: 'Talent Hunt',
                type: 'Entertainment Challenge',
                category: 'Non-Technical',
                teamSize: '2 Members',
                duration: '3 Unique Rounds',
                format: 'Round 1: The Traitor → Round 2: The Taskmaster → Round 3: The Game Changer',
                description: 'AAMEC GOT TALENT – Talent Hunt is an exciting three-round entertainment challenge designed to test participants\' strategy, creativity, adaptability, teamwork, and presence of mind.',
                quotes: [
                    'Be ready to question, create, adapt, and survive the unexpected.',
                    'The rules may be simple. The twists won\'t be.'
                ],
                rounds: [
                    {
                        name: 'Round 1 – The Traitor',
                        desc: 'A strategy and deduction-based round where participants must observe, communicate, and identify hidden elements while trying to protect their team.'
                    },
                    {
                        name: 'Round 2 – The Taskmaster',
                        desc: 'A creativity-based challenge featuring unusual and entertaining tasks where participants must think differently and complete challenges in their own way.'
                    },
                    {
                        name: 'Round 3 – The Game Changer',
                        desc: 'A fast-paced final round where participants must adapt to unexpected twists and changing conditions while keeping their performance under control.'
                    }
                ],
                rules: [
                    'Be ready to question, create, adapt, and survive the unexpected.',
                    'The rules may be simple. The twists won\'t be.',
                    'Both team members must participate actively in every round.',
                    'Decisions of the judges and game masters are final and binding.'
                ],
                judgingCriteria: [
                    'Strategy & Adaptability',
                    'Creativity Under Pressure',
                    'Teamwork & Presence of Mind',
                    'Execution of Tasks',
                    'Overall Impact'
                ]
            }
        ]
    },

    /* ── General Rules ────────────────────────────────── */
    RULES: [
        'Registration is mandatory for all participants.',
        'Each team can participate according to event-specific team size and event rules.',
        'Team size and event-specific rules must be strictly followed.',
        'Participants should report 15–30 minutes before their scheduled event.',
        'Latecomers may not be permitted.',
        'Judges\' and event coordinators\' decisions are final and binding.',
        'Malpractice, plagiarism, or misconduct may result in immediate disqualification.',
        'Certificates will be provided only to registered participants.',
        'The organizing committee may change the schedule, rules, or venue if necessary.',
        'Participants must maintain discipline and decorum throughout the event.'
    ],

    /* ── FAQ ──────────────────────────────────────────── */
    FAQ: [
        {
            question: 'When is DRAKEN\'26?',
            answer: 'DRAKEN\'26 will be held on 26th September 2026 at Anjalai Ammal Mahalingam Engineering College, Kovilvenni.'
        },
        {
            question: 'When does registration close?',
            answer: 'Online registration closes on 18th September 2026.'
        },
        {
            question: 'Is registration free?',
            answer: 'Yes, registration for DRAKEN\'26 is completely free. There is no registration fee required.'
        },
        {
            question: 'How many members can be in a team?',
            answer: 'Each team consists of 2 members per team for all technical and non-technical events.'
        },
        {
            question: 'Can a team participate in both technical and non-technical events?',
            answer: 'Yes. Each team can register for one Technical event and one Non-Technical event.'
        },
        {
            question: 'Will registration confirmation guarantee participation?',
            answer: 'No. Registration confirmation does NOT guarantee final participation. All registrations are reviewed by the organizing committee, and only shortlisted participants will be permitted to participate.'
        },
        {
            question: 'How does shortlisting work?',
            answer: 'The organizing committee reviews all registered teams after registration closes on 18th September 2026. Shortlisted teams will receive a separate shortlisted confirmation email.'
        },
        {
            question: 'What are the food arrangements?',
            answer: 'Food arrangements are available for inter-college participants. Other participants are requested to make their own arrangements.'
        },
        {
            question: 'Where is the symposium conducted?',
            answer: 'The symposium takes place at Department of Electronics and Communication Engineering, Anjalai Ammal Mahalingam Engineering College (AAMEC), Kovilvenni, Tiruvarur District, Tamil Nadu.'
        },
        {
            question: 'Who can I contact for official information?',
            answer: 'You can contact the organizing committee at 811-001-3816 or email drakenece26@gmail.com.'
        }
    ],

    /* ── Contacts ─────────────────────────────────────── */
    CONTACTS: {
        officialPhone: '811-001-3816',
        officialPhoneLink: 'tel:+918110013816',
        officialEmail: 'drakenece26@gmail.com',
        officialEmailLink: 'mailto:drakenece26@gmail.com',
        principal: { title: 'Principal', name: 'Dr. K. Velumurugan' },
        hod: { title: 'Head of Department (ECE)', name: 'Dr. R. Rajaganapathi' },
        facultyCoordinators: [
            { name: 'Dr. V. Rajakani, AP/ECE' },
            { name: 'Dr. G. Murugesan, ASP/ECE' }
        ],
        studentCoordinators: [
            { name: 'R.S. Aswin Saranraj' },
            { name: 'S. Sajith Ahamed' },
            { name: 'I. Divya' },
            { name: 'A. Roopa' }
        ]
    }
};

window.CONFIG = CONFIG;
