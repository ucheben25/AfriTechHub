const DEFAULT_OPPORTUNITIES = [
  {
    id: "tef-entrepreneurship-2026",
    title: "Tony Elumelu Foundation Entrepreneurship Programme 2026",
    category: "Business Funding",
    company: "Tony Elumelu Foundation",
    location: "Lagos, Nigeria (Hybrid / Online)",
    country: "Nigeria",
    remote: "Hybrid",
    date: "2026-06-20",
    deadline: "2026-09-15",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Empowering African entrepreneurs with $5,000 non-refundable seed capital, business mentorship, and world-class training.",
    description: "The Tony Elumelu Foundation (TEF) is the leading philanthropy empowering a new generation of African entrepreneurs, driving poverty eradication, catalyzing job creation across all 54 African countries, and increasing women's economic empowerment. This annual flagship programme provides comprehensive support to scalable early-stage startups in Africa.",
    requirements: [
      "Must be a legal resident of any of the 54 African countries.",
      "Business must be operating in Africa.",
      "Business must be in the early stage (0 to 3 years old).",
      "Open to all sectors, including agriculture, tech, fashion, health, and manufacturing."
    ],
    benefits: [
      "USD $5,000 non-refundable seed capital.",
      "12 weeks of business management training.",
      "Access to a global network of mentors and alumni.",
      "Lifetime membership in the TEF Connect portal."
    ],
    skills: ["Business Planning", "Financial Modeling", "Pitching"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.tefconnect.net/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "google-startups-africa-2026",
    title: "Google for Startups Accelerator Africa (Class 9)",
    category: "Business Funding",
    company: "Google",
    location: "Nairobi, Kenya (Hybrid)",
    country: "Kenya",
    remote: "Hybrid",
    date: "2026-06-18",
    deadline: "2026-08-10",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 3-month virtual accelerator program for high-growth African startups, featuring equity-free support and mentoring from Google experts.",
    description: "Google for Startups Accelerator Africa accepts applications from tech startups across the African continent. The program is designed to bring the best of Google's programs, products, people, and technology to startups that are using AI or machine learning to build solutions for Africa's biggest challenges.",
    requirements: [
      "Must be a tech startup headquartered in Africa or building for the African market.",
      "Must have raised at least seed funding or show significant traction.",
      "Must be utilizing advanced technologies like AI/ML or cloud computing in their core product."
    ],
    benefits: [
      "Equity-free support and mentorship.",
      "Google product credits and cloud support.",
      "Strategic guidance on product design, scaling, and leadership.",
      "Access to Google's global network of experts and investors."
    ],
    skills: ["Scaling", "AI/ML Integration", "Product Strategy"],
    experienceLevel: "Graduate",
    applyUrl: "https://startup.google.com/accelerator/africa/",
    featured: true,
    trending: false,
    status: "published"
  },
  {
    id: "mcf-scholars-uct-2026",
    title: "Mastercard Foundation Scholars Program at University of Cape Town",
    category: "Scholarships",
    company: "Mastercard Foundation",
    location: "Cape Town, South Africa",
    country: "South Africa",
    remote: "Onsite",
    date: "2026-06-22",
    deadline: "2026-08-31",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Fully-funded scholarships for talented, economically disadvantaged African students to pursue undergraduate and postgraduate studies.",
    description: "The Mastercard Foundation Scholars Program at the University of Cape Town (UCT) provides full scholarships to academically talented young Africans who face significant financial barriers. The scholarship aims to develop next-generation leaders who are committed to giving back to their communities.",
    requirements: [
      "Must be a citizen of an African country.",
      "Must have applied and received admission to UCT for an eligible degree program.",
      "Must demonstrate financial need and a track record of community service/leadership.",
      "Must be under the age of 29 for undergraduate and 35 for postgraduate applications."
    ],
    benefits: [
      "Full coverage of tuition fees.",
      "Accommodation in UCT residence and living allowance.",
      "Medical aid cover and economy return flight tickets.",
      "Leadership training and career development support."
    ],
    skills: ["Academic Research", "Leadership", "Community Service"],
    experienceLevel: "Scholarship",
    applyUrl: "https://www.uct.ac.za/students/mastercard-foundation-scholars-program",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "mtn-graduate-dev-2026",
    title: "MTN Graduate Development Program 2026",
    category: "Jobs",
    company: "MTN Group",
    location: "Johannesburg, South Africa (Hybrid)",
    country: "South Africa",
    remote: "Hybrid",
    date: "2026-06-24",
    deadline: "2026-07-20",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Launch your career with Africa's largest telecommunications giant. Comprehensive rotation-based program in digital, fintech, and engineering.",
    description: "The MTN Graduate Development Program is designed to source, develop, and accelerate high-potential African graduates. Over 24 months, participants will gain hands-on experience, executive mentorship, and participate in critical projects driving connectivity across Africa.",
    requirements: [
      "Graduated with a Bachelor's or Master's degree in engineering, computer science, finance, marketing, or business analytics.",
      "Less than 2 years of work experience.",
      "Strong analytical and problem-solving skills."
    ],
    benefits: [
      "Competitive salary and health benefits.",
      "Fast-tracked career advancement paths.",
      "Global standard training certifications.",
      "Mentorship from senior business leaders."
    ],
    skills: ["Telecommunications", "Data Analysis", "Project Management"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.mtn.com/careers/",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "afdb-youth-ent-grant-2026",
    title: "Youth Entrepreneurship Investment Bank (YEIB) Grant",
    category: "Grants",
    company: "African Development Bank (AfDB)",
    location: "Abidjan, Côte d'Ivoire (Remote friendly)",
    country: "Côte d'Ivoire",
    remote: "Remote",
    date: "2026-06-15",
    deadline: "2026-09-30",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Financial grants and technical assistance targeted at young African tech founders creating sustainable jobs.",
    description: "The African Development Bank is launching the YEIB Grant to address youth unemployment in Africa. The initiative provides direct financial grants to hubs, incubators, and high-impact startups that create pathways to employment for African youth.",
    requirements: [
      "Startup or business must be registered and operating in an AfDB member country.",
      "Founder must be aged between 18 and 35.",
      "Business must demonstrate a measurable social impact, particularly in job creation."
    ],
    benefits: [
      "Grants ranging from $10,000 to $50,000.",
      "Capacity building and technical support.",
      "Linkages to venture capital firms and regional banks."
    ],
    skills: ["Financial Reporting", "Social Entrepreneurship", "Impact Assessment"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/jobs-youth-africa",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "andela-senior-fullstack-2026",
    title: "Senior Full-Stack Engineer (React & Node.js)",
    category: "Vacancies",
    company: "Andela",
    location: "Remote (Africa)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-25",
    deadline: "2026-07-31",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Andela is hiring senior full-stack developers to work remotely with global technology companies. Competitive USD compensation.",
    description: "Andela connects top African technical talent with leading global companies. As a Senior Full-Stack Engineer, you will join remote product teams, building scalable web applications and contributing to engineering best practices.",
    requirements: [
      "5+ years of professional experience in software engineering.",
      "Proficient in React, Node.js, and modern CSS/HTML standards.",
      "Experience with cloud infrastructure (AWS, GCP, or Azure).",
      "Strong communication skills and ability to work in overlapping time zones."
    ],
    benefits: [
      "Competitive remote compensation in USD.",
      "Flexible working hours and home office stipend.",
      "Access to continuous learning resources and certifications.",
      "Paid time off and health insurance allowance."
    ],
    skills: ["React", "Node.js", "AWS", "CSS"],
    experienceLevel: "Graduate",
    applyUrl: "https://andela.com/careers/",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "uneca-internship-2026",
    title: "United Nations ECA Internship - Economic and Social Policy",
    category: "Internships",
    company: "United Nations Economic Commission for Africa",
    location: "Addis Ababa, Ethiopia",
    country: "Ethiopia",
    remote: "Onsite",
    date: "2026-06-12",
    deadline: "2026-07-15",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 6-month internship at the UNECA headquarters for graduates interested in regional integration and macroeconomic policy.",
    description: "The UNECA internship offers practical experience in research, analysis, and implementation of regional development frameworks. Interns work directly alongside senior economists and policy analysts on projects focusing on the African Continental Free Trade Area (AfCFTA).",
    requirements: [
      "Enrolled in, or recently graduated from, a Master's or Ph.D. program in Economics, Social Sciences, or Public Policy.",
      "Excellent command of English or French.",
      "Proficiency in data analysis software (R, Stata, or Python) is a plus."
    ],
    benefits: [
      "Hands-on experience in a prestigious international organization.",
      "Unparalleled networking opportunities with African policy makers.",
      "Certificate of completion and potential career pathways in the UN system."
    ],
    skills: ["Macroeconomics", "Policy Analysis", "R", "Python"],
    experienceLevel: "Internship",
    applyUrl: "https://www.uneca.org/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "standard-bank-chairmans-2026",
    title: "Standard Bank Africa Chairman's Scholarship 2026",
    category: "Scholarships",
    company: "Standard Bank Group",
    location: "Oxford, Cambridge, and LSE (UK)",
    country: "United Kingdom",
    remote: "Onsite",
    date: "2026-06-10",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Prestigious fully-funded scholarship for African students to pursue postgraduate degrees at elite UK universities.",
    description: "Standard Bank Group, in partnership with Oxford, Cambridge, and the London School of Economics (LSE), offers the Africa Chairman's Scholarship. The scholarship aims to support exceptional African students who demonstrate leadership potential and a desire to contribute to Africa's growth.",
    requirements: [
      "Must be a citizen of a country where Standard Bank operates (e.g. South Africa, Nigeria, Kenya, Ghana).",
      "Must hold a first-class or upper second-class undergraduate degree.",
      "Must have an offer of admission from Oxford, Cambridge, or LSE."
    ],
    benefits: [
      "Full tuition fees paid directly to the university.",
      "Monthly stipend for living expenses in the UK.",
      "Return economy airfare.",
      "Access to executive leadership mentors from Standard Bank."
    ],
    skills: ["Finance", "Development Economics", "Leadership"],
    experienceLevel: "Scholarship",
    applyUrl: "https://www.standardbank.com/sbg/globals/careers/scholarships",
    featured: true,
    trending: false,
    status: "published"
  },
  {
    id: "safaricom-swe-internship-2026",
    title: "Software Engineering Intern (Android & iOS)",
    category: "Internships",
    company: "Safaricom PLC",
    location: "Nairobi, Kenya",
    country: "Kenya",
    remote: "Onsite",
    date: "2026-06-23",
    deadline: "2026-07-10",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 3-month intensive internship on the M-Pesa development team. Gain practical experience with high-scale fintech systems.",
    description: "Safaricom is looking for passionate tech students or recent graduates to join our mobile application team. As an intern, you will contribute to the core codebase of Safaricom's consumer applications, learning agile methodologies and DevOps practices.",
    requirements: [
      "Currently pursuing or recently completed a Bachelor's degree in Computer Science, Software Engineering, or IT.",
      "Basic understanding of Kotlin, Swift, or Flutter.",
      "A GitHub profile demonstrating personal mobile app projects."
    ],
    benefits: [
      "Monthly competitive internship stipend.",
      "Subsidized meals and transport allowances.",
      "Direct pathway to Safaricom's Junior Developer role.",
      "Friendly work culture and access to tech hubs."
    ],
    skills: ["Android", "iOS", "Kotlin", "Swift", "Flutter"],
    experienceLevel: "Internship",
    applyUrl: "https://www.safaricom.co.ke/careers",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "mpesa-product-manager-2026",
    title: "Product Manager - M-Pesa Merchant Ecosystem",
    category: "Vacancies",
    company: "M-Pesa Africa",
    location: "Nairobi, Kenya (Hybrid)",
    country: "Kenya",
    remote: "Hybrid",
    date: "2026-06-25",
    deadline: "2026-07-25",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Drive the roadmap for M-Pesa's merchant payment platforms across 7 African countries. Seeking experienced fintech PMs.",
    description: "M-Pesa Africa is a joint venture between Safaricom and Vodacom, established to accelerate fintech innovation across the continent. The Product Manager will lead cross-functional squads to scale the merchant app and payment APIs.",
    requirements: [
      "3+ years of product management experience, preferably in mobile money, fintech, or payment gateways.",
      "Strong analytical skills and experience writing product requirement documents (PRDs).",
      "Familiarity with API integrations and software architecture."
    ],
    benefits: [
      "Highly competitive salary, annual performance bonus.",
      "Comprehensive medical insurance and pension plan.",
      "International travel opportunities within Africa.",
      "Flexible hybrid working options."
    ],
    skills: ["Product Strategy", "API Integration", "Agile"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.mpesa.africa/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "ecowas-fellowship-2026",
    title: "ECOWAS Commission Research Fellowship on Regional Integration",
    category: "Grants",
    company: "ECOWAS Commission",
    location: "Abuja, Nigeria",
    country: "Nigeria",
    remote: "Onsite",
    date: "2026-06-08",
    deadline: "2026-08-20",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Research grants for young scholars from West Africa to study monetary union, border security, or trade facilitation.",
    description: "The ECOWAS Commission invites research proposals from West African academics. The fellowship supports policy-oriented research that addresses regional integration challenges in the West African sub-region.",
    requirements: [
      "Must be a national of an ECOWAS member state.",
      "Must hold a Master's degree or Ph.D. in Economics, International Relations, or Law.",
      "Must submit a 10-page research proposal aligned with ECOWAS priority themes."
    ],
    benefits: [
      "Research grant of USD $8,000.",
      "Access to ECOWAS archives and policy experts.",
      "Publication of findings in the ECOWAS Policy Review Journal."
    ],
    skills: ["Regional Integration", "Policy Drafting", "Research"],
    experienceLevel: "Fellowship",
    applyUrl: "https://www.ecowas.int/careers/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "afreximbank-internship-2026",
    title: "Afreximbank Graduate Internship Programme 2026",
    category: "Internships",
    company: "Afreximbank",
    location: "Cairo, Egypt",
    country: "Egypt",
    remote: "Onsite",
    date: "2026-06-19",
    deadline: "2026-07-18",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Kickstart your career in trade finance and development banking with a 1-year paid internship at Afreximbank.",
    description: "The African Export-Import Bank (Afreximbank) provides structured training to graduates across finance, risk management, legal, compliance, and corporate communications. The program focuses on promoting intra- and extra-African trade.",
    requirements: [
      "Recent graduate (within the last 2 years) of an undergraduate or postgraduate degree.",
      "Strong academic record in business, economics, finance, law, or related disciplines.",
      "Fluent in English. Knowledge of French, Arabic, or Portuguese is highly advantageous."
    ],
    benefits: [
      "Competitive monthly stipend and housing allowance in Cairo.",
      "Return air ticket to Cairo from the home country.",
      "Comprehensive medical cover.",
      "Intensive training and mentorship from trade finance professionals."
    ],
    skills: ["Trade Finance", "Risk Management", "Compliance"],
    experienceLevel: "Internship",
    applyUrl: "https://careers.afreximbank.com/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "dangote-fellowship-2026",
    title: "Dangote Fellowship for African Tech Innovators",
    category: "Grants",
    company: "Dangote Group",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    remote: "Onsite",
    date: "2026-06-14",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A grant program empowering startups solving supply chain and manufacturing inefficiencies in Africa.",
    description: "The Dangote Fellowship provides financial support and industrial scaling opportunities to African entrepreneurs. It targets hardware, software, and logistics startups capable of optimizing supply chain management, distribution, and raw material sourcing.",
    requirements: [
      "Registered startup operating in Africa.",
      "Must have a working prototype or MVP (Minimum Viable Product).",
      "Focused on manufacturing, logistics, clean energy, or agriculture."
    ],
    benefits: [
      "Equity-free grant of USD $25,000.",
      "Pilot testing opportunities within Dangote Group subsidiaries.",
      "Strategic business partnerships and distribution channels."
    ],
    skills: ["Supply Chain", "Logistics", "IoT", "Clean Energy"],
    experienceLevel: "Fellowship",
    applyUrl: "https://www.dangote.com/careers/",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "loreal-unesco-women-2026",
    title: "L'Oréal-UNESCO For Women in Science Young Talents Africa 2026",
    category: "Grants",
    company: "L'Oréal & UNESCO",
    location: "Sub-Saharan Africa (Remote research)",
    country: "Kenya",
    remote: "Remote",
    date: "2026-06-11",
    deadline: "2026-08-05",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Funding and support for Sub-Saharan African women PhD students and post-doctorates in scientific disciplines.",
    description: "The L'Oréal-UNESCO For Women in Science program identifies and supports talented young female scientists in Sub-Saharan Africa. The grant enables researchers to pursue work in biology, chemistry, engineering, physics, and computer science.",
    requirements: [
      "Must be a citizen of a Sub-Saharan African country.",
      "Must be currently enrolled in a PhD program or doing post-doctoral research in a university in Sub-Saharan Africa.",
      "Demonstrate outstanding academic research potential."
    ],
    benefits: [
      "Grant of €10,000 for PhD students.",
      "Grant of €15,000 for post-doctoral researchers.",
      "Leadership training and science communication coaching.",
      "Invitation to the awards ceremony in Nairobi."
    ],
    skills: ["Scientific Writing", "STEM Research", "Data Analysis"],
    experienceLevel: "Fellowship",
    applyUrl: "https://www.forwomeninscience.com/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "ms-adc-swe-2026",
    title: "Software Engineer - Microsoft ADC",
    category: "Jobs",
    company: "Microsoft",
    location: "Nairobi, Kenya (Hybrid)",
    country: "Kenya",
    remote: "Hybrid",
    date: "2026-06-25",
    deadline: "2026-07-28",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Build technologies that power Microsoft's global products. Microsoft Africa Development Center is hiring developers.",
    description: "Microsoft's Africa Development Center (ADC) is the engineering hub for Microsoft in Africa. Software Engineers work in collaborative teams to build products and services used by millions of customers worldwide, spanning identity, developer tools, and cloud services.",
    requirements: [
      "2+ years of professional software development experience.",
      "Proficient in C#, Java, C++, or TypeScript.",
      "Strong foundational knowledge in data structures and system design."
    ],
    benefits: [
      "Highly competitive salary with stock options (RSUs).",
      "Comprehensive family health insurance.",
      "Generous annual leave and wellness benefits.",
      "Global relocation support if applicable."
    ],
    skills: ["C#", "TypeScript", "System Design", "Cloud Systems"],
    experienceLevel: "Entry Level",
    applyUrl: "https://careers.microsoft.com/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "flutterwave-trainee-2026",
    title: "Flutterwave Graduate Trainee Programme 2026",
    category: "Internships",
    company: "Flutterwave",
    location: "Lagos, Nigeria (Hybrid)",
    country: "Nigeria",
    remote: "Hybrid",
    date: "2026-06-24",
    deadline: "2026-07-15",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Launch a career in Fintech. A 6-month rotation program across payments, engineering, product, compliance, and growth.",
    description: "Flutterwave is looking for ambitious, recently graduated individuals to join the fintech revolution in Africa. Trainees will receive hands-on training, tackle high-impact business tasks, and work closely with product teams.",
    requirements: [
      "Bachelor's degree in any discipline (technical or non-technical).",
      "Strong curiosity for digital payments, technology, and entrepreneurship.",
      "Excellent communication and collaboration skills."
    ],
    benefits: [
      "Paid training period with competitive compensation.",
      "Mentorship from key team members.",
      "High probability of transition into full-time roles upon completion.",
      "Lively tech workspace culture."
    ],
    skills: ["Fintech", "Growth Marketing", "Compliance", "SQL"],
    experienceLevel: "Internship",
    applyUrl: "https://www.flutterwave.com/careers",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "paystack-country-manager-2026",
    title: "Country Manager - Paystack Kenya",
    category: "Vacancies",
    company: "Paystack",
    location: "Nairobi, Kenya",
    country: "Kenya",
    remote: "Onsite",
    date: "2026-06-21",
    deadline: "2026-07-30",
    image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Paystack is looking for a leader to oversee business operations, regulator relations, and strategic growth in Kenya.",
    description: "Paystack, a Stripe company, enables businesses in Africa to accept payments. The Country Manager for Kenya will be responsible for leading expansion, managing compliance and licensing, and representing Paystack to partners and merchants.",
    requirements: [
      "6+ years of experience in leadership, fintech, corporate banking, or business expansion.",
      "Deep understanding of the East African payments landscape (e.g. M-Pesa ecosystem).",
      "Proven track record of managing relationships with financial regulators."
    ],
    benefits: [
      "Stripe-aligned compensation and equity packages.",
      "Top-tier medical, life, and dental insurance.",
      "Annual learning and development budget.",
      "Work equipment allowance (MacBook, monitor, etc.)."
    ],
    skills: ["Leadership", "Business Development", "Regulatory Relations"],
    experienceLevel: "Graduate",
    applyUrl: "https://paystack.com/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "au-youth-volunteer-2026",
    title: "African Union Youth Volunteer Corps (AUYVC) 2026",
    category: "Jobs",
    company: "African Union",
    location: "Addis Ababa, Ethiopia (with deployments)",
    country: "Ethiopia",
    remote: "Onsite",
    date: "2026-06-17",
    deadline: "2026-08-31",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Become an AU Youth Envoy. Deploy for 12 months in public institutions, NGOs, and AU organs across Africa.",
    description: "The AUYVC is the African Union's flagship youth development program. It recruits and deploys young professionals as volunteers to serve for a period of 12 months in various development projects, fostering regional solidarity and integration.",
    requirements: [
      "Citizen of an AU Member State.",
      "Aged between 19 and 35.",
      "Bachelor's degree or equivalent in a relevant field.",
      "Commitment to volunteer for a full year."
    ],
    benefits: [
      "Economy return airfare from home country to duty station.",
      "Monthly living allowance stipend.",
      "Comprehensive medical insurance cover.",
      "Deployment training and induction certificate."
    ],
    skills: ["Community Development", "Public Policy", "International Relations"],
    experienceLevel: "Fellowship",
    applyUrl: "https://au.int/en/youth-volunteer-corps",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "savannah-seed-fund-2026",
    title: "Savannah Valley Tech Seed Fund",
    category: "Business Funding",
    company: "Savannah Valley VC",
    location: "Kigali, Rwanda",
    country: "Rwanda",
    remote: "Onsite",
    date: "2026-06-16",
    deadline: "2026-09-01",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Equity investment from $50,000 to $150,000 for early-stage African tech startups solving financial inclusion challenges.",
    description: "Savannah Valley is an early-stage venture capital firm investing in innovative tech startups across Sub-Saharan Africa. The Tech Seed Fund supports pre-seed and seed-stage companies using digital tools to scale their business operations.",
    requirements: [
      "Registered business operating in East, West, or Southern Africa.",
      "Must have a launched product with initial customer validation.",
      "Addressing financial inclusion, digital retail, or logistics sectors."
    ],
    benefits: [
      "Financial investment up to $150,000.",
      "Regular board advisorship and scaling support.",
      "Co-investor matchmaking and network access."
    ],
    skills: ["Pitching", "Customer Validation", "Financial Planning"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.savannah.vc/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "bmw-sa-graduate-2026",
    title: "BMW Group South Africa Graduate Programme",
    category: "Internships",
    company: "BMW Group",
    location: "Pretoria, South Africa",
    country: "South Africa",
    remote: "Onsite",
    date: "2026-06-13",
    deadline: "2026-07-20",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 24-month developmental programme for graduates in engineering, IT, business management, and logistics.",
    description: "BMW Group South Africa offers a structured graduate development programme. Graduates are placed in engineering, IT, procurement, and logistics departments, working on live production systems at the Rosslyn manufacturing plant.",
    requirements: [
      "Bachelor's degree or higher in mechanical/industrial engineering, IT, data science, or supply chain management.",
      "A minimum average of 65% in university coursework.",
      "Strong communication and adaptability."
    ],
    benefits: [
      "Highly competitive salary.",
      "On-site medical center and canteen subsidy.",
      "Career growth coaching and professional development modules.",
      "Corporate discounts on vehicle leases."
    ],
    skills: ["Supply Chain", "IT Support", "Mechanical Engineering"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.bmwgroup.jobs/za",
    featured: false,
    trending: false,
    status: "published"
  },
  
  // ==========================================================================
  // NEW POPULATED OPPPORTUNITIES (50 ADDITIONAL)
  // ==========================================================================
  {
    id: "canonical-jr-frontend-2026",
    title: "Junior Frontend Engineer (React)",
    category: "Jobs",
    company: "Canonical",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-25",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Canonical is hiring a junior frontend engineer to build responsive and robust web dashboards for Ubuntu cloud services.",
    description: "As a Junior Frontend Engineer at Canonical, you will collaborate with UI/UX designers and backend developers to create beautiful interfaces. You will work on global products, implementing semantic components, writing test coverage, and optimizing application loading speed.",
    requirements: [
      "Strong foundational skills in HTML, CSS, JavaScript (ES6+).",
      "6+ months of experience building web applications using React.",
      "Basic understanding of Git, pull requests, and automated testing.",
      "Passion for open-source software and Linux/Ubuntu environments."
    ],
    benefits: [
      "Competitive global compensation with annual reviews.",
      "Work-from-home hardware budget and training materials.",
      "Health insurance benefits and flexible paid vacation time.",
      "Opportunities for international travel to developer summits."
    ],
    skills: ["React", "CSS Grid", "Git", "Webpack"],
    experienceLevel: "Entry Level",
    applyUrl: "https://canonical.com/careers",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "canonical-jr-backend-2026",
    title: "Junior Backend Developer (Python & Go)",
    category: "Jobs",
    company: "Canonical",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-24",
    deadline: "2026-09-01",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Join the Ubuntu server team to build highly-scalable RESTful APIs, automation microservices, and databases.",
    description: "Canonical is seeking a junior backend specialist to support the infrastructure services that back Ubuntu distributions. You will write clean, well-tested Python/Go code, implement database migrations, and configure deployment scripts.",
    requirements: [
      "Proficient in Python or Go development.",
      "Understanding of REST API design and relational database schemas (SQL).",
      "Familiarity with containerization tools like Docker or LXD.",
      "Analytical mindset and ability to debug asynchronous workflows."
    ],
    benefits: [
      "Equity shares option and annual salary increments.",
      "100% remote workspace with set learning hours weekly.",
      "Mentorship from veteran open-source core engineers.",
      "Comprehensive medical and parental leave policies."
    ],
    skills: ["Python", "Go", "SQL", "Docker"],
    experienceLevel: "Entry Level",
    applyUrl: "https://canonical.com/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "mozilla-qa-tester-2026",
    title: "Junior QA Tester (Firefox Core Services)",
    category: "Jobs",
    company: "Mozilla",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-23",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Conduct functional, manual, and regression testing across Firefox desktop and mobile releases to ensure security and privacy.",
    description: "Mozilla is looking for a detail-oriented Junior QA Tester to audit web applications and browser assemblies. You will write comprehensive bug reports, execute automated scripts, and collaborate with core developers to verify software patches.",
    requirements: [
      "Familiarity with bug tracking software (e.g. Bugzilla, Jira).",
      "Basic understanding of scripting languages like JavaScript or Python.",
      "Strong analytical skills to document exact steps to reproduce failures.",
      "Commitment to the open web and privacy rights."
    ],
    benefits: [
      "Stipend for co-working space or high-speed internet.",
      "Flexible schedule designed for work-life balance.",
      "Free access to online course libraries and tech certifications.",
      "Inclusive international team culture."
    ],
    skills: ["QA Testing", "Jira", "Javascript", "Bugzilla"],
    experienceLevel: "Entry Level",
    applyUrl: "https://www.mozilla.org/en-US/careers/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "github-tech-support-2026",
    title: "Technical Support Engineer",
    category: "Jobs",
    company: "GitHub",
    location: "Remote (Africa/Europe)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-25",
    deadline: "2026-08-20",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Assist developer clients globally with Git commits, repository permissions, Actions workflows, and CLI support.",
    description: "At GitHub, Support Engineers are critical to helping developer communities build code. You will troubleshoot repository permissions, build configurations, runner environments, and API errors, providing stellar text-based assistance.",
    requirements: [
      "Strong knowledge of Git, branching models, and command line tools.",
      "Understanding of continuous integration (CI/CD) pipelines.",
      "Excellent customer-facing communication and written English skills.",
      "Familiarity with authentication systems (SSH, OAuth, SAML)."
    ],
    benefits: [
      "Stripe-aligned package, remote office setups, wellness budget.",
      "Annual conference allowance and certification sponsorships.",
      "Volunteer days and donation matching programs.",
      "25 days of paid annual leave."
    ],
    skills: ["Git", "GitHub Actions", "SSH", "CI/CD"],
    experienceLevel: "Entry Level",
    applyUrl: "https://github.com/careers",
    featured: true,
    trending: false,
    status: "published"
  },
  {
    id: "salesforce-customer-success-2026",
    title: "Customer Success Specialist (Tech Infrastructure)",
    category: "Jobs",
    company: "Salesforce",
    location: "Remote (Africa)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-22",
    deadline: "2026-08-25",
    image: "https://images.unsplash.com/photo-1549923746-c502d488f3aa?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Guide customer engineering teams on deploying cloud CRM applications, integrating APIs, and managing user permission sets.",
    description: "Salesforce is recruiting technology success advocates. You will work closely with customer managers to configure software workflows, optimize database search performance, and handle deployment checkups.",
    requirements: [
      "University degree or equivalent practical technical experience.",
      "Familiarity with cloud models (SaaS, PaaS) and web service APIs.",
      "Outstanding presentation skills and empathetic client management.",
      "Salesforce Administrator certification is a major advantage."
    ],
    benefits: [
      "Comprehensive health, vision, dental plans.",
      "Free access to Salesforce Trailhead training and exam keys.",
      "Flexible PTO policy and wellness stipend.",
      "Corporate hardware package (Macbook Pro, monitor, chair)."
    ],
    skills: ["SaaS", "APIs", "Customer Success", "CRM"],
    experienceLevel: "Entry Level",
    applyUrl: "https://www.salesforce.com/company/careers/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "atlassian-tech-writer-2026",
    title: "Technical Content Writer (Jira API)",
    category: "Jobs",
    company: "Atlassian",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-21",
    deadline: "2026-09-10",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Author API documentations, developer quick-start guides, and deployment blogs for Atlassian cloud products.",
    description: "Atlassian is looking for a technical wordsmith to help scale developer education. You will review code changes, test REST API endpoints, and structure documentation that simplifies how companies extend Atlassian systems.",
    requirements: [
      "Excellent command of technical writing frameworks (Markdown, XML).",
      "Familiarity with at least one programming language (JavaScript, Python).",
      "Ability to read API responses and compile quick-start code snippets.",
      "Portfolio of published developer documentation or technical blogs."
    ],
    benefits: [
      "Work from anywhere policy with flexible time scheduling.",
      "Generous health, dental, pension matching schemes.",
      "Paid education leave to support personal code learning.",
      "Employee share purchase options."
    ],
    skills: ["Markdown", "Technical Writing", "REST APIs", "JavaScript"],
    experienceLevel: "Entry Level",
    applyUrl: "https://www.atlassian.com/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "paystack-uiux-designer-2026",
    title: "Junior Product Designer (UI/UX)",
    category: "Jobs",
    company: "Paystack",
    location: "Lagos, Nigeria (Hybrid)",
    country: "Nigeria",
    remote: "Hybrid",
    date: "2026-06-20",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Refine user flows, build high-fidelity Figma components, and participate in usability audits for merchant dashboards.",
    description: "As a Junior Product Designer at Paystack, you will join our design core to shape merchant portals and checkout interfaces. You will create prototypes, design layout grids, and collaborate with developers to ensure UI pixel perfection.",
    requirements: [
      "Strong portfolio showcasing product design flows and visual polish.",
      "Advanced proficiency in Figma (auto-layout, components, variants).",
      "Solid understanding of user-centered design and responsive constraints.",
      "Basic knowledge of HTML/CSS is a plus."
    ],
    benefits: [
      "Highly competitive salary with health and life insurance.",
      "Subsidized meals, gym memberships, and transit packages.",
      "Annual learning allowance to buy books, design courses, or attend events.",
      "Macbook setup and home workstation allowances."
    ],
    skills: ["Figma", "UI Design", "UX Research", "Wireframing"],
    experienceLevel: "Entry Level",
    applyUrl: "https://paystack.com/careers",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "google-data-analyst-2026",
    title: "Junior Data Analyst",
    category: "Jobs",
    company: "Google",
    location: "Nairobi, Kenya (Hybrid)",
    country: "Kenya",
    remote: "Hybrid",
    date: "2026-06-25",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Analyze user logs, write SQL queries, and compile data dashboards for Google Cloud market research in East Africa.",
    description: "Google is hiring a data analyst to discover consumer trends and map cloud market metrics in East Africa. You will write optimized queries, maintain spreadsheets, and present slides to product engineering boards.",
    requirements: [
      "Proficient in writing SQL scripts (joins, groups, aggregation).",
      "Experience with data visualization suites (Tableau, Looker, or PowerBI).",
      "Basic understanding of scripting with Python or R.",
      "B.Sc. in Mathematics, Statistics, Computer Science, or similar."
    ],
    benefits: [
      "Google-standard base salary with retirement benefits.",
      "Onsite gourmet meals, coffee shops, and recreation setups.",
      "Mentorship programs with Google research experts.",
      "Relocation package support."
    ],
    skills: ["SQL", "Looker", "Python", "Data Visualization"],
    experienceLevel: "Entry Level",
    applyUrl: "https://careers.google.com/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "aws-cloud-support-2026",
    title: "Cloud Support Associate (Linux & Networking)",
    category: "Jobs",
    company: "AWS",
    location: "Cape Town, South Africa (Hybrid)",
    country: "South Africa",
    remote: "Hybrid",
    date: "2026-06-19",
    deadline: "2026-08-20",
    image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Help customers deploy, configure, and debug AWS server infrastructure, load balancers, and EC2 nodes.",
    description: "Amazon Web Services is hiring Cloud Associates to support our regional customer base. You will troubleshoot network connectivity, analyze web server error logs, and configure security permissions on AWS modules.",
    requirements: [
      "Strong understanding of TCP/IP networking protocols and DNS configurations.",
      "Familiarity with Linux OS shell command scripting.",
      "Basic knowledge of AWS core services (EC2, S3, VPC).",
      "AWS Certified Cloud Practitioner is highly desirable."
    ],
    benefits: [
      "Competitive salary, pension matching, medical insurance.",
      "AWS Certification exam voucher credits.",
      "Modern office spaces with gaming consoles and tech libraries.",
      "Shift allowances and overtime bonus options."
    ],
    skills: ["AWS EC2", "Linux Commands", "Networking", "DNS"],
    experienceLevel: "Entry Level",
    applyUrl: "https://www.amazon.jobs/en/teams/aws",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "canonical-devops-intern-2026",
    title: "DevOps Engineer Intern",
    category: "Internships",
    company: "Canonical",
    location: "Remote (South Africa)",
    country: "South Africa",
    remote: "Remote",
    date: "2026-06-23",
    deadline: "2026-07-30",
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 6-month remote internship supporting Canonical core infrastructure pipelines, CI/CD integrations, and server configs.",
    description: "As a DevOps Intern, you will assist the systems engineering team with automating Ubuntu build releases. You will configure deployment scripts, construct GitHub actions, audit container instances, and monitor cloud logs.",
    requirements: [
      "Basic understanding of scripting (Bash or Python).",
      "Familiarity with Git pipelines and CI automation platforms.",
      "Knowledge of Docker container basics.",
      "Curiosity about infrastructure-as-code (Terraform or Ansible)."
    ],
    benefits: [
      "Monthly competitive internship salary.",
      "Remote work hardware support setup.",
      "Ubuntu training manuals and certification courses.",
      "Direct conversion paths to entry-level roles."
    ],
    skills: ["Docker", "Bash Scripting", "GitHub Actions", "Ubuntu"],
    experienceLevel: "Internship",
    applyUrl: "https://canonical.com/careers",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "google-swe-intern-germany-2026",
    title: "Software Engineering Intern 2026",
    category: "Internships",
    company: "Google",
    location: "Munich, Germany",
    country: "Germany",
    remote: "Onsite",
    date: "2026-06-25",
    deadline: "2026-07-31",
    image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 3-month summer internship working with Google engineers on core storage APIs, Android security, or Chrome subsystems.",
    description: "Google's Software Engineering Internships offer students a chance to work on engineering tasks that power Google services. You will design, build, test, and deploy software alongside veteran engineers.",
    requirements: [
      "Currently enrolled in a B.Sc., M.Sc., or Ph.D. program in Computer Science or related fields.",
      "Proficient in C++, Java, Python, or Go.",
      "Familiarity with algorithms, complexity theory, and software testing practices.",
      "Must return to university program after completion."
    ],
    benefits: [
      "Generous monthly salary and housing stipend.",
      "Visa sponsorship and return flights covered.",
      "Gourmet campus cafeterias and wellness centers.",
      "Return offer conversion pipelines."
    ],
    skills: ["Java", "C++", "Python", "Algorithms"],
    experienceLevel: "Internship",
    applyUrl: "https://careers.google.com/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "microsoft-swe-intern-kenya-2026",
    title: "Software Engineer Intern (Microsoft ADC)",
    category: "Internships",
    company: "Microsoft",
    location: "Nairobi, Kenya (Onsite)",
    country: "Kenya",
    remote: "Onsite",
    date: "2026-06-22",
    deadline: "2026-08-10",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Work on cloud applications and dev tools at Microsoft's Africa Development Center. Mentored by senior cloud engineers.",
    description: "Microsoft ADC in Nairobi is offering a 4-month software engineering internship. You will contribute to cloud applications, learn agile development patterns, and build mock features for product tests.",
    requirements: [
      "Enrolled in a Bachelor's in CS, IT, or Software Engineering.",
      "Basic coding experience in C#, TypeScript, or Java.",
      "Knowledge of relational database concepts.",
      "Strong communication and curiosity."
    ],
    benefits: [
      "Monthly competitive salary.",
      "Subsidized meals and transport allowance.",
      "Training resources and tech workshops.",
      "Direct consideration for graduate paths."
    ],
    skills: ["C#", "TypeScript", "SQL", "Cloud Computing"],
    experienceLevel: "Internship",
    applyUrl: "https://careers.microsoft.com/",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "github-swe-intern-usa-2026",
    title: "Software Engineer Intern",
    category: "Internships",
    company: "GitHub",
    location: "Remote (United States)",
    country: "United States",
    remote: "Remote",
    date: "2026-06-21",
    deadline: "2026-07-25",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 12-week virtual internship working on user experience components, security audit logs, or open-source package registries.",
    description: "As a GitHub Intern, you will join a remote squad to build and refine developer modules. You will review PRs, write testing fixtures, and present your project results at the end of the term.",
    requirements: [
      "Student or graduate of coding bootcamp/university.",
      "Basic proficiency in Ruby on Rails, Go, or JavaScript.",
      "Understanding of Git syntax.",
      "High attention to detail."
    ],
    benefits: [
      "Competitive hourly wage.",
      "Office equipment loan (MacBook Pro, peripherals).",
      "One-on-one executive mentoring.",
      "GitHub swag bag."
    ],
    skills: ["Ruby on Rails", "Go", "Git", "CSS"],
    experienceLevel: "Internship",
    applyUrl: "https://github.com/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "mozilla-swe-intern-2026",
    title: "Software Engineering Intern",
    category: "Internships",
    company: "Mozilla",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-18",
    deadline: "2026-07-20",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 3-month internship contributing to Firefox telemetry systems, Rust assemblies, or browser performance engines.",
    description: "Mozilla interns contribute directly to open source code. You will build and test systems that optimize browser rendering, securely collect telemetry data, and audit permissions.",
    requirements: [
      "Experience with Rust, C++, or JavaScript.",
      "Understanding of operating system fundamentals.",
      "Active participant in open source projects is a major plus.",
      "Enrolled in CS degree program."
    ],
    benefits: [
      "Competitive monthly pay.",
      "Work-from-home hardware budget.",
      "Mentorship from open-source repository maintainers.",
      "Invitation to Mozilla global virtual summits."
    ],
    skills: ["Rust", "C++", "Telemetry", "Open Source"],
    experienceLevel: "Internship",
    applyUrl: "https://www.mozilla.org/en-US/careers/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "lf-mentorship-2026",
    title: "Linux Foundation Mentorship Program",
    category: "Fellowships",
    company: "Linux Foundation",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-25",
    deadline: "2026-08-01",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A structured 3-month remote mentorship fellowship contributing to Kubernetes, Hyperledger, or Cloud Native projects.",
    description: "The LFX Mentorship Program helps developers gain open source development experience. You will work on real repository issues with help from designated experts, learning Git workflows and cloud architectures.",
    requirements: [
      "Strong coding foundation in Go, C, Rust, or Python.",
      "Commitment to write 20-30 hours of code weekly.",
      "Basic understanding of container systems.",
      "Open to university students and self-taught developers."
    ],
    benefits: [
      "Stipend matching local purchasing power index ($3,000 - $6,000).",
      "Direct guidance from core Linux repository owners.",
      "Global networking and potential employment pathways.",
      "Digital completion badge and credential certificates."
    ],
    skills: ["Go", "Kubernetes", "LFX", "Open Source"],
    experienceLevel: "Fellowship",
    applyUrl: "https://lfx.linuxfoundation.org/mentorship",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "redhat-kernel-intern-2026",
    title: "Linux Kernel Engineering Intern",
    category: "Internships",
    company: "Red Hat",
    location: "Boston, USA (Hybrid)",
    country: "United States",
    remote: "Hybrid",
    date: "2026-06-16",
    deadline: "2026-07-28",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 4-month internship focusing on kernel drivers, memory subsystem audits, and file system test automation.",
    description: "Red Hat is recruiting a kernel engineering intern. You will run tests on filesystem drivers, patch kernel leaks, and build benchmarking scripts for enterprise server builds.",
    requirements: [
      "Strong foundation in C programming.",
      "Knowledge of Linux system calls and processor architectures.",
      "Familiarity with kernel modules or driver build files.",
      "Pursuing a degree in Computer Engineering or CS."
    ],
    benefits: [
      "Highly competitive salary.",
      "Red Hat certification courses (RHCSA, RHCE).",
      "Friendly work spaces and mentoring programs.",
      "Access to open-source developer boards."
    ],
    skills: ["C Programming", "Kernel Modules", "Benchmarking", "Red Hat"],
    experienceLevel: "Internship",
    applyUrl: "https://www.redhat.com/en/jobs",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "salesforce-solution-intern-2026",
    title: "Solution Engineer Intern",
    category: "Internships",
    company: "Salesforce",
    location: "London, UK (Hybrid)",
    country: "United Kingdom",
    remote: "Hybrid",
    date: "2026-06-15",
    deadline: "2026-07-20",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Learn to build product proofs, consult clients on integrations, and design cloud flow custom layouts.",
    description: "Salesforce London is hosting a Solution Engineering Intern. You will support regional sales architects, configure app workflows for product trials, and draft technical guides.",
    requirements: [
      "Student in Business Computing, Software, or related field.",
      "Understanding of SaaS models and modern web APIs.",
      "Excellent verbal skills and problem-solving aptitude.",
      "English fluency."
    ],
    benefits: [
      "Competitive London internship wage.",
      "Subsidized commuter travel credits.",
      "Trailhead certifications and learning sessions.",
      "Health and wellness budget allowance."
    ],
    skills: ["SaaS", "Solution Design", "APIs", "Presentations"],
    experienceLevel: "Internship",
    applyUrl: "https://www.salesforce.com/company/careers/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "ibm-frontend-intern-2026",
    title: "Frontend Developer Intern",
    category: "Internships",
    company: "IBM",
    location: "Lagos, Nigeria (Hybrid)",
    country: "Nigeria",
    remote: "Hybrid",
    date: "2026-06-24",
    deadline: "2026-08-05",
    image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 6-month internship building web layouts using IBM Carbon design system, React, and REST API frameworks.",
    description: "IBM Nigeria is hosting a Frontend Intern. You will work on regional cloud service portals, write interface components, configure mock services, and ensure UI compliance with accessibility standards.",
    requirements: [
      "Basic coding experience in HTML, CSS, JavaScript.",
      "Familiarity with React components and state cycles.",
      "Understanding of REST API response mapping.",
      "Enrolled in or graduated from a university program."
    ],
    benefits: [
      "Monthly competitive internship stipend.",
      "Mentoring from IBM certified cloud designers.",
      "Free access to IBM Cloud training paths.",
      "Certificate of internship completion."
    ],
    skills: ["HTML", "CSS", "React", "Carbon Design"],
    experienceLevel: "Internship",
    applyUrl: "https://www.ibm.com/careers",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "sap-developer-intern-2026",
    title: "Software Developer Intern",
    category: "Internships",
    company: "SAP",
    location: "Johannesburg, South Africa",
    country: "South Africa",
    remote: "Onsite",
    date: "2026-06-23",
    deadline: "2026-07-31",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Learn to build ERP microservices, write unit tests in Java, and design database structures in SAP HANA.",
    description: "SAP Johannesburg seeks a developer intern to join our cloud platform engineering team. You will write clean Java code, run automation tests, and map relational tables.",
    requirements: [
      "Student in CS, IS, or Computer Engineering.",
      "Basic skills in Java or C#.",
      "Familiarity with SQL relational database models.",
      "Strong analytical mindset."
    ],
    benefits: [
      "Competitive monthly pay.",
      "Office transport shuttle subsidies.",
      "HANA cloud developer certifications.",
      "Direct considerations for global SAP graduate programs."
    ],
    skills: ["Java", "SQL", "HANA", "Unit Testing"],
    experienceLevel: "Internship",
    applyUrl: "https://www.sap.com/about/careers.html",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "oracle-database-intern-2026",
    title: "Database Engineer Intern",
    category: "Internships",
    company: "Oracle",
    location: "Cairo, Egypt",
    country: "Egypt",
    remote: "Onsite",
    date: "2026-06-22",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Assist DBAs with query tuning, backup verification scripts, and monitoring database cluster logs.",
    description: "Oracle Cairo is hiring a database intern. You will run query plans, write script logs in shell/SQL, and verify cloud database configurations.",
    requirements: [
      "Pursuing a university degree in Computer Engineering or related fields.",
      "Strong SQL foundation (indexes, triggers, procedures).",
      "Familiarity with Linux bash commands.",
      "Basic understanding of DB architecture."
    ],
    benefits: [
      "Monthly competitive stipend.",
      "Medical insurance cover.",
      "Oracle certification prep training.",
      "Mentorship from experienced DBAs."
    ],
    skills: ["SQL Tuning", "DBA Basics", "Bash", "Oracle DB"],
    experienceLevel: "Internship",
    applyUrl: "https://www.oracle.com/corporate/careers/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "nvidia-dl-intern-2026",
    title: "Deep Learning Software Intern",
    category: "Internships",
    company: "NVIDIA",
    location: "Santa Clara, USA",
    country: "United States",
    remote: "Onsite",
    date: "2026-06-25",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Build CUDA test scripts, clean telemetry data, and run image model validation pipelines.",
    description: "NVIDIA is looking for a deep learning intern. You will compile CUDA libraries, automate tensor performance logs, and review data sets.",
    requirements: [
      "Currently pursuing a MS or PhD in CS, EE, or related fields.",
      "Strong Python coding skills and PyTorch framework knowledge.",
      "Basic understanding of C++ programming.",
      "Familiarity with GPU threading structures."
    ],
    benefits: [
      "Top-tier industry internship salary.",
      "Housing stipend and roundtrip airfare.",
      "Onsite gym and medical services.",
      "Conversion paths to core developer teams."
    ],
    skills: ["PyTorch", "C++", "CUDA", "Python"],
    experienceLevel: "Internship",
    applyUrl: "https://www.nvidia.com/en-us/about-nvidia/careers/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "intel-hardware-intern-2026",
    title: "Hardware Engineering Intern (Silicon Validation)",
    category: "Internships",
    company: "Intel",
    location: "Munich, Germany (Hybrid)",
    country: "Germany",
    remote: "Hybrid",
    date: "2026-06-24",
    deadline: "2026-08-20",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Write script configurations to test processors, analyze oscilloscope outputs, and automate signal files.",
    description: "Intel Munich is recruiting a silicon validation intern. You will setup logic analyzers, run testing scripts, and log processor outputs.",
    requirements: [
      "Student in Electrical or Computer Engineering.",
      "Basic coding skills in Python or Verilog/VHDL.",
      "Understanding of processor board architectures.",
      "Strong analytical approach."
    ],
    benefits: [
      "Competitive monthly pay.",
      "Commuter travel allowance.",
      "Silicon lab certifications.",
      "Active team building initiatives."
    ],
    skills: ["Verilog", "Oscilloscope", "Python", "Silicon Validation"],
    experienceLevel: "Internship",
    applyUrl: "https://www.intel.com/content/www/us/en/jobs/locations/germany.html",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "cisco-network-intern-2026",
    title: "Network Engineer Intern",
    category: "Internships",
    company: "Cisco",
    location: "Nairobi, Kenya",
    country: "Kenya",
    remote: "Onsite",
    date: "2026-06-23",
    deadline: "2026-08-10",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Configure routers, configure switch interfaces, and monitor cloud network packets in Cisco's regional hub.",
    description: "Cisco Nairobi is hosting a network engineering intern. You will debug port setups, write script configurations, and monitor interface logs.",
    requirements: [
      "Pursuing a degree in Telecommunications, CS, or IT.",
      "CCNA level network knowledge (subnets, routing protocols).",
      "Familiarity with CLI environments.",
      "Excellent teamwork capabilities."
    ],
    benefits: [
      "Monthly competitive internship stipend.",
      "CCNP certification exam credits.",
      "Free access to Cisco NetAcad courses.",
      "Direct pathway to Cisco Graduate roles."
    ],
    skills: ["Cisco CLI", "Routing Protocols", "Subnetting", "CCNA"],
    experienceLevel: "Internship",
    applyUrl: "https://jobs.cisco.com/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "atlassian-pm-intern-2026",
    title: "Product Manager Intern",
    category: "Internships",
    company: "Atlassian",
    location: "Remote (Sydney)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-22",
    deadline: "2026-07-31",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Draft user feature specs, analyze feedback data logs, and manage engineering sprint workflows.",
    description: "Atlassian is looking for a product intern. You will run user research, write requirement docs, and collaborate with developers.",
    requirements: [
      "Enrolled in a business or computing university program.",
      "Strong analytical skills and research mindset.",
      "Familiarity with Jira project managers.",
      "Outstanding communication."
    ],
    benefits: [
      "Highly competitive salary.",
      "Home office setup hardware support.",
      "Direct project leadership opportunities.",
      "Active team social events."
    ],
    skills: ["Product Roadmap", "Jira", "User Research", "PRD Writing"],
    experienceLevel: "Internship",
    applyUrl: "https://www.atlassian.com/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "google-startups-acc-2026",
    title: "Google for Startups Accelerator Africa",
    category: "Business Funding",
    company: "Google for Startups",
    location: "Lagos, Nigeria (Hybrid)",
    country: "Nigeria",
    remote: "Hybrid",
    date: "2026-06-25",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Accelerator support featuring equity-free capital grants, cloud tools, and developer mentorship.",
    description: "Google for Startups Accelerator Africa accepts applications from technology startups. The program brings Google tools, products, and experts to help founders build.",
    requirements: [
      "Tech startup registered and operating in Africa.",
      "Possess a functional MVP with initial customer loops.",
      "Using advanced technologies (AI/ML) in core modules."
    ],
    benefits: [
      "Equity-free grant allocations.",
      "Google cloud product credits.",
      "Expert coding and design mentorship.",
      "Investor matchmaking."
    ],
    skills: ["AI/ML Scaling", "UX Audit", "VC Pitching", "Product Market Fit"],
    experienceLevel: "Graduate",
    applyUrl: "https://startup.google.com/accelerator/africa/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "aws-activate-2026",
    title: "AWS Activate Credits Program",
    category: "Grants",
    company: "Amazon Web Services",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-24",
    deadline: "Rolling",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Get up to $100,000 in AWS cloud credits, technical support guides, and startup business training.",
    description: "AWS Activate provides early-stage startups with tools to build cloud services. You will receive credit codes, access technical training libraries, and speak with cloud architects.",
    requirements: [
      "Early stage startup with an active web service codebase.",
      "Company must be less than 10 years old.",
      "Must have a valid startup business email."
    ],
    benefits: [
      "Up to USD $100,000 AWS cloud credits.",
      "AWS Business Support credits.",
      "One-on-one cloud architect consults.",
      "Free access to self-paced cloud courses."
    ],
    skills: ["AWS Setup", "Cloud Hosting", "System Security", "Serverless Architecture"],
    experienceLevel: "Graduate",
    applyUrl: "https://aws.amazon.com/activate/",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "ms-founders-hub-2026",
    title: "Microsoft Founders Hub Program",
    category: "Grants",
    company: "Microsoft",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-23",
    deadline: "Rolling",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Startups receive up to $150,000 in Azure credits, free OpenAI tokens, and technical software tools.",
    description: "Microsoft Founders Hub is open to all technology startups. The program gives access to Azure nodes, free GitHub enterprise slots, and direct developer advisory lines.",
    requirements: [
      "Early stage technology startup.",
      "Open to un-funded and pre-seed companies.",
      "Must have an active project prototype."
    ],
    benefits: [
      "Up to USD $150,000 Azure cloud credits.",
      "Free access to OpenAI API token credits.",
      "Free licenses of Visual Studio Enterprise.",
      "Technical mentorship sessions."
    ],
    skills: ["Azure Setup", "OpenAI API", "Visual Studio", "GitHub Enterprise"],
    experienceLevel: "Graduate",
    applyUrl: "https://foundershub.startups.microsoft.com/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "github-os-grants-2026",
    title: "GitHub Open Source Developer Grants",
    category: "Grants",
    company: "GitHub",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-22",
    deadline: "2026-09-15",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Non-dilutive funding starting at $10,000 for open source package maintainers and framework builders.",
    description: "GitHub Open Source Grants provide financial backing to developers maintaining key open source packages. You will write code updates, review issues, and coordinate builds.",
    requirements: [
      "Maintainer of an active open source library on GitHub.",
      "Library must have minimum stars/contributions benchmarks.",
      "Must submit a brief roadmap of codebase changes."
    ],
    benefits: [
      "Direct grants from USD $10,000 to $25,000.",
      "Direct support from GitHub core security teams.",
      "Feature opportunities at GitHub Universe.",
      "GitHub Enterprise account support."
    ],
    skills: ["Package Maintenance", "Open Source Security", "CI/CD Setup", "Git Architecture"],
    experienceLevel: "Graduate",
    applyUrl: "https://github.com/sponsors",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "tef-entrepreneurship-fund-2026",
    title: "Tony Elumelu Foundation Entrepreneurship Programme",
    category: "Business Funding",
    company: "Tony Elumelu Foundation",
    location: "Lagos, Nigeria (Hybrid)",
    country: "Nigeria",
    remote: "Hybrid",
    date: "2026-06-21",
    deadline: "2026-09-01",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Get $5,000 seed funding, business management courses, and access to a massive mentor network.",
    description: "The Tony Elumelu Foundation provides $5,000 non-refundable capital to early stage African businesses. You will attend business modules, write pitch documents, and present cases.",
    requirements: [
      "Must be a legal resident of any of the 54 African countries.",
      "Business must operate inside Africa.",
      "Startup must be between 0 and 3 years old."
    ],
    benefits: [
      "USD $5,000 non-refundable seed capital.",
      "12 weeks of structured business training.",
      "One-on-one business mentorship.",
      "Lifetime membership in TEF Connect portal."
    ],
    skills: ["Business Modeling", "Pitch Deck Design", "Financial Strategy", "Lobbying"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.tefconnect.net/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "orange-corners-accra-2026",
    title: "Orange Corners Incubation Programme",
    category: "Business Funding",
    company: "Orange Corners",
    location: "Accra, Ghana (Hybrid)",
    country: "Ghana",
    remote: "Hybrid",
    date: "2026-06-20",
    deadline: "2026-08-31",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 6-month support incubator with co-working access, expert workshops, and seed funding options up to €50,000.",
    description: "Orange Corners GH offers young founders incubation services. You will attend weekly sprints, prototype services, review design metrics, and pitch to angel groups.",
    requirements: [
      "Founder must be between 18 and 35 years old.",
      "Registered startup operating in Ghana.",
      "Must show proof of initial product transaction log."
    ],
    benefits: [
      "Free modern co-working desk access.",
      "Seed voucher allocations up to €50,000.",
      "Design and business scaling workshops.",
      "Direct matching to Dutch business partners."
    ],
    skills: ["Product Validation", "Agile Operations", "Cash Flow Management", "Presentation"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.orangecorners.com/ghana/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "mcf-resilience-fund-2026",
    title: "Mastercard Foundation Fund for Resilience",
    category: "Grants",
    company: "Mastercard Foundation",
    location: "Kigali, Rwanda (Hybrid)",
    country: "Rwanda",
    remote: "Hybrid",
    date: "2026-06-19",
    deadline: "2026-09-10",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Funding grants and technical guidance for youth-led ventures creating employment options in agriculture and tech.",
    description: "The Mastercard Foundation Resilience Fund backs youth enterprises. You will complete product reviews, scale operations, and create pathways to hire other youth.",
    requirements: [
      "Founded by youth aged 18 to 35.",
      "Active venture operating in East Africa.",
      "High capacity for job creation."
    ],
    benefits: [
      "Equity-free grant allocations up to $30,000.",
      "Business and scaling advisory boards.",
      "Strategic partnership network linkages.",
      "Exhibitions and summit invites."
    ],
    skills: ["Social Impact Audit", "Operational Scaling", "Financial Control", "Venture Building"],
    experienceLevel: "Graduate",
    applyUrl: "https://mastercardfdn.org/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "afdb-innovation-fund-2026",
    title: "AfDB Tech Innovation Grant",
    category: "Grants",
    company: "African Development Bank",
    location: "Abidjan, Côte d'Ivoire (Onsite)",
    country: "Côte d'Ivoire",
    remote: "Onsite",
    date: "2026-06-18",
    deadline: "2026-09-30",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Financial grants targeting digital platforms solving agriculture, energy, or healthcare infrastructure loops.",
    description: "AfDB is allocating grants to high impact digital platforms. You will deploy code hubs, run field validation scripts, and report metrics to board monitors.",
    requirements: [
      "Platform registered in an AfDB partner country.",
      "Functional MVP with documented user interaction.",
      "Addressing energy, agriculture, or health sectors."
    ],
    benefits: [
      "Grants ranging from $20,000 to $75,000.",
      "Regional market scaling integrations.",
      "Favorable debt options matching.",
      "B2B policy advisory support."
    ],
    skills: ["B2B Integrations", "Project Reporting", "Impact Metrics", "Risk Audit"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.afdb.org/en",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "ifc-startup-grant-2026",
    title: "IFC Tech Startup Development Grant",
    category: "Grants",
    company: "International Finance Corporation (IFC)",
    location: "Cairo, Egypt (Hybrid)",
    country: "Egypt",
    remote: "Hybrid",
    date: "2026-06-17",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Funding grants for tech platforms digitizing supply chains, retail networks, or local financial services.",
    description: "IFC is funding scaling tech ventures. You will write code integrations, map payment grids, compile user flows, and run security checks.",
    requirements: [
      "Registered startup operating in North or East Africa.",
      "Must have raised under USD $150,000 in funding.",
      "Addressing retail, logistics, or fintech."
    ],
    benefits: [
      "Grants up to USD $40,000.",
      "Advisory boards from World Bank tech experts.",
      "Introduction to global venture funds.",
      "Capacity build bootcamps."
    ],
    skills: ["Database Security", "API Integrations", "User Loop Analysis", "Logistics Tech"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.ifc.org/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "seedstars-acc-grant-2026",
    title: "Seedstars Acceleration Grant Program",
    category: "Business Funding",
    company: "Seedstars",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-16",
    deadline: "2026-08-25",
    image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 3-month remote accelerator program with $50,000 seed funding, growth marketing workshops, and investor days.",
    description: "Seedstars is accepting applications for its remote accelerator. You will test marketing models, configure landing scripts, map user flows, and pitch to venture groups.",
    requirements: [
      "Early stage digital startup.",
      "Open to global companies targeting emerging markets.",
      "Must show month-over-month traction details."
    ],
    benefits: [
      "USD $50,000 equity-free seed grant.",
      "12 weeks growth sprint training.",
      "One-on-one growth marketing mentor.",
      "Investor pitch day introduction."
    ],
    skills: ["Growth Marketing", "Landing Page Optimization", "Google Analytics", "User Funnel Setup"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.seedstars.com/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "undp-innovation-challenge-2026",
    title: "Innovation Challenge Fund for Startups",
    category: "Grants",
    company: "UNDP",
    location: "Dakar, Senegal (Hybrid)",
    country: "Senegal",
    remote: "Hybrid",
    date: "2026-06-15",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Grants up to $25,000 for digital tools combating regional climate anomalies or enhancing agriculture.",
    description: "UNDP Senegal is financing green tech innovations. You will deploy sensor scripts, model weather data grids, write mobile views, and present results.",
    requirements: [
      "Registered startup operating in West Africa.",
      "Addressing climate adaptation, clean energy, or smart farming.",
      "Willingness to participate in pilot tests."
    ],
    benefits: [
      "Direct grant funding of USD $25,000.",
      "Pilot testing site access and resources.",
      "Matchmaking to institutional investors.",
      "Mentorship from agritech specialists."
    ],
    skills: ["Weather API Integration", "Mobile Web Design", "Data Modeling", "IoT Prototyping"],
    experienceLevel: "Graduate",
    applyUrl: "https://www.undp.org/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "mlh-fellowship-swe-2026",
    title: "MLH Software Engineering Fellowship",
    category: "Fellowships",
    company: "Major League Hacking (MLH)",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-25",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 12-week virtual fellowship contributing to open-source libraries used by millions, mentored by senior developers.",
    description: "The MLH Fellowship is a remote internship alternative. You will contribute to core repos like React, Babel, or Python libraries, write test scripts, and build your Git portfolio.",
    requirements: [
      "Basic coding competence in JavaScript, Python, C++, or Ruby.",
      "Familiarity with Git syntax (push, pull, commit, branch).",
      "Commitment to participate 30 hours weekly.",
      "Open to applicants worldwide."
    ],
    benefits: [
      "Direct educational stipend up to USD $5,000 (based on location).",
      "Mentorship from professional corporate software engineers.",
      "Access to global developer hackathons and events.",
      "GitHub Enterprise features access."
    ],
    skills: ["Git", "GitHub PR Workflow", "Open Source", "Testing Frameworks"],
    experienceLevel: "Fellowship",
    applyUrl: "https://fellowship.mlh.io/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "google-gsoc-2026",
    title: "Google Summer of Code (GSoC) 2026",
    category: "Fellowships",
    company: "Google",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-24",
    deadline: "2026-07-31",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A virtual coding program introducing students and beginners to open source software development with stipends.",
    description: "GSoC connects developers with open-source organizations. You will write code modules, collaborate on repo forums, fix issues, and compile deployment guides.",
    requirements: [
      "Must be 18 years or older.",
      "Beginner or student developer in open source coding.",
      "Must submit a 5-page proposal detailing codebase modifications."
    ],
    benefits: [
      "Stipend matching local purchasing power index.",
      "Mentorship from open-source project owners.",
      "Developer certification credential from Google.",
      "Global open-source community recognition."
    ],
    skills: ["C++", "Python", "Rust", "Open Source Pitching"],
    experienceLevel: "Fellowship",
    applyUrl: "https://summerofcode.withgoogle.com/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "outreachy-fellowship-2026",
    title: "Outreachy Diversity Fellowship 2026",
    category: "Fellowships",
    company: "Outreachy",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-23",
    deadline: "2026-08-01",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 3-month remote paid fellowship promoting diversity in open source. Work on GNOME, Fedora, or Linux kernels.",
    description: "Outreachy provides internships to people subject to systemic bias. You will write software, documentation, or run design modules under corporate mentors.",
    requirements: [
      "Identify with a group underrepresented in tech.",
      "Must commit to 30 hours of work weekly.",
      "Basic coding or document writing foundation."
    ],
    benefits: [
      "Direct stipend of USD $7,000.",
      "Travel stipend of USD $500 for conference presentations.",
      "One-on-one project support.",
      "Networking in open source groups."
    ],
    skills: ["Kernel Patching", "Python Core", "Git Shell", "Collaboration"],
    experienceLevel: "Fellowship",
    applyUrl: "https://www.outreachy.org/",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "osc-fellowship-2026",
    title: "Open Source Collective Fellowship",
    category: "Fellowships",
    company: "Open Source Collective",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-22",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 4-month remote fellowship supporting developers who build open-source ecosystem tools.",
    description: "OSC is funding builders of developer tooling. You will write code enhancements, compile API guides, and configure packaging files.",
    requirements: [
      "Open source developer with active repositories.",
      "Familiarity with JS, Python, or Ruby package managers.",
      "Submit a proposal of ecosystem utility tools."
    ],
    benefits: [
      "USD $6,000 direct project stipend.",
      "Enterprise hosting credits from partners.",
      "Mentorship sessions on open source sustainability.",
      "Legal support guidelines."
    ],
    skills: ["Package Design", "NPM Publishing", "Markdown API", "CI Testing"],
    experienceLevel: "Fellowship",
    applyUrl: "https://www.oscollective.org/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "google-scholarship-emea-2026",
    title: "Google Scholarship Program (EMEA)",
    category: "Scholarships",
    company: "Google",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-25",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Academic scholarships to support university students pursuing computer science or software engineering degrees.",
    description: "Google is awarding scholarships to students in computer science. You will submit essays, academic logs, and letters of recommendation.",
    requirements: [
      "Enrolled in an undergraduate/postgraduate CS degree program.",
      "Studying in a university within Europe, Middle East, or Africa.",
      "Strong academic record."
    ],
    benefits: [
      "Direct educational grant of €7,000.",
      "Access to Google developer community networks.",
      "Fast-tracked applications for Google interns.",
      "Invites to Google tech retreats."
    ],
    skills: ["Academic Writing", "Complexity Theory", "Algorithms Study"],
    experienceLevel: "Scholarship",
    applyUrl: "https://buildyourfuture.withgoogle.com/scholarships/",
    featured: true,
    trending: true,
    status: "published"
  },
  {
    id: "mcf-scholars-uganda-2026",
    title: "Mastercard Foundation Scholars Program",
    category: "Scholarships",
    company: "Mastercard Foundation",
    location: "Kampala, Uganda (Onsite)",
    country: "Uganda",
    remote: "Onsite",
    date: "2026-06-24",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Fully funded academic scholarship at Makerere University for academically bright, economically disadvantaged youth.",
    description: "MCF Scholars Program at Makerere supports talended African students. You will complete degrees, join leadership seminars, and participate in community service.",
    requirements: [
      "Citizen of an African country.",
      "Academically qualified for admission to Makerere University.",
      "Demonstrate financial disadvantage and community service tracking."
    ],
    benefits: [
      "Full tuition fees coverage.",
      "Living stipend, housing, and transit allowance.",
      "Laptop computer, textbooks, and study supplies.",
      "Career planning advice."
    ],
    skills: ["Academic Writing", "Civic Leadership", "Research Methods"],
    experienceLevel: "Scholarship",
    applyUrl: "https://mcfsp.mak.ac.ug/",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "google-wtm-scholarship-2026",
    title: "Women Techmakers Scholarship",
    category: "Scholarships",
    company: "Google",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-23",
    deadline: "2026-09-01",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Supporting female students in computing, with direct grant funding and access to Google's tech retreat.",
    description: "Women Techmakers Scholarship supports diversity in engineering. You will present writeups, resume logs, and recommenders.",
    requirements: [
      "Identify as female.",
      "Pursuing a degree in CS, Computer Engineering, or related technical field.",
      "Enrolled in an accredited university."
    ],
    benefits: [
      "Direct cash scholarship of USD $5,000.",
      "Invitation to Google Tech Retreat in Munich.",
      "Mentorship from Google women engineers.",
      "WTM community access."
    ],
    skills: ["STEM Research", "Resume Design", "Community Building"],
    experienceLevel: "Scholarship",
    applyUrl: "https://www.womentechmakers.com/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "alx-swe-scholarship-2026",
    title: "ALX Software Engineering Scholarship 2026",
    category: "Scholarships",
    company: "ALX Africa",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-22",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    shortDescription: "A 12-month fully sponsored intensive software engineering certificate course, teaching C, Python, JavaScript, and DevOps.",
    description: "ALX offers sponsored tech training. You will complete peer coding sessions, submit shell scripts, build web database apps, and draft command files.",
    requirements: [
      "Aged between 18 and 34 years old.",
      "Access to a computer and stable internet connection.",
      "Commitment to study 25 hours weekly for 12 months.",
      "African citizen."
    ],
    benefits: [
      "100% tuition fees sponsored by partners ($3,000 value).",
      "Access to ALX local hubs and co-working resources.",
      "Direct links to global hiring networks.",
      "ALX alumni community membership."
    ],
    skills: ["C Programming", "Python Shell", "Git", "SQL DBs"],
    experienceLevel: "Scholarship",
    applyUrl: "https://www.alxafrica.com/",
    featured: false,
    trending: true,
    status: "published"
  },
  {
    id: "coursera-financial-aid-2026",
    title: "Coursera Professional Certificate Financial Aid",
    category: "Scholarships",
    company: "Coursera",
    location: "Remote (Global)",
    country: "Global",
    remote: "Remote",
    date: "2026-06-21",
    deadline: "Rolling",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Sponsored access to Google, IBM, and Meta professional certification modules. Learn coding, analytics, or UI/UX.",
    description: "Coursera is offering financial aid to support tech learning. You will write short essays explaining your goals and financial need.",
    requirements: [
      "Submit financial aid application inside the course page.",
      "Provide details of financial constraint.",
      "Commitment to study and complete course modules."
    ],
    benefits: [
      "100% course fee waiver.",
      "Free access to graded quizzes and coding labs.",
      "Shareable Professional Certificate upon completion.",
      "Resume credentials."
    ],
    skills: ["Self-Directed Study", "Analytical Thinking", "Skill Certification"],
    experienceLevel: "Scholarship",
    applyUrl: "https://www.coursera.org/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "paystack-jr-node-2026",
    title: "Junior Backend Developer (Node.js)",
    category: "Jobs",
    company: "Paystack",
    location: "Lagos, Nigeria (Hybrid)",
    country: "Nigeria",
    remote: "Hybrid",
    date: "2026-06-20",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Write payment API controllers, connect database tables, and configure webhooks in Node.js/Express.",
    description: "Paystack is hiring a junior backend developer. You will join our payment core squad to refactor controller routes, test network calls, and document endpoints.",
    requirements: [
      "Solid knowledge of JavaScript backend patterns (Node.js/Express).",
      "Understanding of REST API design and SQL databases (PostgreSQL).",
      "Familiarity with writing unit tests (Jest or Mocha).",
      "Familiarity with Git branching."
    ],
    benefits: [
      "Competitive base pay and health schemes.",
      "Subsidized transport and catering services.",
      "Annual workstation and study allowances.",
      "Great developer team dynamics."
    ],
    skills: ["Node.js", "Express", "PostgreSQL", "Jest"],
    experienceLevel: "Entry Level",
    applyUrl: "https://paystack.com/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "safaricom-jr-flutter-2026",
    title: "Junior Mobile Developer (Flutter)",
    category: "Jobs",
    company: "Safaricom",
    location: "Nairobi, Kenya",
    country: "Kenya",
    remote: "Onsite",
    date: "2026-06-19",
    deadline: "2026-07-31",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Build mobile interface widgets, manage state pools, and connect REST API services in Flutter/Dart.",
    description: "Safaricom is seeking a junior Flutter developer to support mobile payment modules. You will configure layouts, handle state pipelines, and verify package configurations.",
    requirements: [
      "Familiarity with Dart and Flutter mobile SDK.",
      "Understanding of state management frameworks (Provider, Riverpod, or Bloc).",
      "Basic experience connecting REST APIs.",
      "B.Sc. in CS or related tech field."
    ],
    benefits: [
      "Competitive monthly pay and pension setups.",
      "Medical cover and transport allowance.",
      "Onsite developer workspace labs.",
      "Fast track career path options."
    ],
    skills: ["Flutter", "Dart", "Riverpod", "Mobile APIs"],
    experienceLevel: "Entry Level",
    applyUrl: "https://www.safaricom.co.ke/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "flutterwave-jr-python-2026",
    title: "Junior Python Engineer (Automated Flows)",
    category: "Jobs",
    company: "Flutterwave",
    location: "Remote (Nigeria)",
    country: "Nigeria",
    remote: "Remote",
    date: "2026-06-25",
    deadline: "2026-08-15",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Construct Python automation scripts, parse payment logs, and monitor web service status alerts.",
    description: "Flutterwave is recruiting a junior Python automation developer. You will write log parsers, automate testing calls, and configure data hooks.",
    requirements: [
      "Proficient in Python coding basics.",
      "Basic understanding of scripting tools and JSON structures.",
      "Familiarity with Git tools.",
      "Fast learning capacity."
    ],
    benefits: [
      "Remote salary in USD.",
      "Home internet and hardware allowance.",
      "Fast learning curves under veteran managers.",
      "Friendly virtual team."
    ],
    skills: ["Python Scripting", "JSON Parsing", "Automated Scripting", "Git CLI"],
    experienceLevel: "Entry Level",
    applyUrl: "https://www.flutterwave.com/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "andela-jr-react-2026",
    title: "Junior React Developer",
    category: "Jobs",
    company: "Andela",
    location: "Remote (Rwanda)",
    country: "Rwanda",
    remote: "Remote",
    date: "2026-06-24",
    deadline: "2026-08-30",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Build responsive CSS views, design React page structures, and review web interface layouts.",
    description: "Andela is seeking a junior React specialist for client setups. You will write semantic markup, compile style utilities, and manage state cycles.",
    requirements: [
      "6+ months building React pages.",
      "Excellent CSS skills (Flexbox, CSS Grid).",
      "Familiarity with Git commits.",
      "Good team communication."
    ],
    benefits: [
      "Competitive remote salary.",
      "Co-working desk allowances.",
      "Access to continuous developer classes.",
      "Mentoring programs."
    ],
    skills: ["React Components", "CSS Grid", "Git Workflow", "Web Semantics"],
    experienceLevel: "Entry Level",
    applyUrl: "https://andela.com/careers/",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "standardbank-qa-intern-2026",
    title: "QA Automation Tester Intern",
    category: "Internships",
    company: "Standard Bank",
    location: "Johannesburg, South Africa (Hybrid)",
    country: "South Africa",
    remote: "Hybrid",
    date: "2026-06-23",
    deadline: "2026-07-25",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Configure automation test cases, script API calls, and compile test logs in Selenium or Cypress.",
    description: "Standard Bank SA seeks a QA automation intern. You will configure Cypress scripts, verify database changes, and log build anomalies.",
    requirements: [
      "Basic JavaScript or Python coding skills.",
      "Understanding of test types (smoke, regression, integration).",
      "Familiarity with web markup inspect tools.",
      "Degree or diploma in IT/CS."
    ],
    benefits: [
      "Competitive monthly pay.",
      "Transport ticket subsidies.",
      "QA training bootcamps access.",
      "Opportunities for graduate placements."
    ],
    skills: ["Cypress", "JavaScript", "Test Logging", "API Testing"],
    experienceLevel: "Internship",
    applyUrl: "https://www.standardbank.com/sbg/globals/careers",
    featured: false,
    trending: false,
    status: "published"
  },
  {
    id: "ms-adc-cloud-intern-2026",
    title: "Cloud Support Engineer Intern",
    category: "Internships",
    company: "Microsoft",
    location: "Nairobi, Kenya (Hybrid)",
    country: "Kenya",
    remote: "Hybrid",
    date: "2026-06-22",
    deadline: "2026-07-20",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
    shortDescription: "Help developers deploy, configure, and monitor cloud database systems on Microsoft Azure pipelines.",
    description: "Microsoft ADC seeks a cloud support intern. You will run connectivity diagnostics, compile alert script files, and configure Azure profiles.",
    requirements: [
      "Enrolled in CS, Engineering, or IT B.Sc.",
      "Familiarity with basic network commands and shell scripts.",
      "Basic understanding of Azure, AWS, or GCP model basics.",
      "Good team communication."
    ],
    benefits: [
      "Competitive monthly salary.",
      "Subsidized meals and travel vouchers.",
      "Azure certification vouchers.",
      "Mentorship sessions with Microsoft engineers."
    ],
    skills: ["Azure Basics", "Shell Scripts", "Networking Diagnostics", "Technical Support"],
    experienceLevel: "Internship",
    applyUrl: "https://careers.microsoft.com/",
    featured: false,
    trending: false,
    status: "published"
  }
];

const DEFAULT_CATEGORIES = [
  { name: "Jobs", icon: "briefcase", count: 18, description: "Full-time and part-time careers at leading companies" },
  { name: "Grants", icon: "gift", count: 10, description: "Non-dilutive financial awards for startups and academic research" },
  { name: "Scholarships", icon: "graduation-cap", count: 8, description: "Fully and partially funded academic scholarships globally" },
  { name: "Internships", icon: "user-clock", count: 20, description: "Graduate and undergraduate industrial training roles" },
  { name: "Business Funding", icon: "hand-holding-usd", count: 6, description: "Equity investments and accelerator seed funding" },
  { name: "Vacancies", icon: "clipboard-list", count: 3, description: "Contract roles, consultancy listings, and urgent job openings" },
  { name: "Fellowships", icon: "users", count: 5, description: "Structured development cohorts and open-source programs" }
];

const FAQS = [
  {
    question: "Do I need to sign up or register to use Afri Tech Hub?",
    answer: "No, Afri Tech Hub is an open-access platform. You do not need to create an account, register, or provide any personal details to browse, search, and apply for opportunities."
  },
  {
    question: "How do I apply for an opportunity?",
    answer: "Each opportunity post has a 'Read More' button that opens the details page. There you will find the application requirements, benefits, and a direct 'Apply Now' button that will take you to the official application portal of the provider."
  },
  {
    question: "Are the opportunities on this site verified?",
    answer: "Yes, our team curates and verifies each opportunity from official, reputable sources (e.g., multinational companies, top universities, global philanthropies, and government bodies) before listing them."
  },
  {
    question: "How can I post an opportunity on Afri Tech Hub?",
    answer: "Only authenticated administrators can create, edit, or delete opportunities via the Admin Dashboard. If you have an external vacancy you'd like to share, you can reach out to our team via the Contact Page, and we will verify and list it for you."
  },
  {
    question: "What is the Afri Tech Hub WhatsApp Community?",
    answer: "It is our instant notification network on WhatsApp where we share urgent deadlines, daily vacancies, and grant alerts directly to your phone. You can join it using the floating WhatsApp button at the bottom-right corner of the website."
  }
];

const CATEGORY_IMAGES = {
  "jobs": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  "grants": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  "scholarships": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
  "internships": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
  "business funding": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
  "vacancies": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  "fellowships": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80"
};

// Helper functions for data management
const DataStore = {
  // Get all opportunities (including drafts/archived for admin, filtered for public)
  getOpportunities(includeAdminAll = false) {
    let list = [];
    const local = localStorage.getItem('ath_opportunities');
    if (local) {
      try {
        list = JSON.parse(local);
      } catch (e) {
        console.error("Failed to parse local storage opportunities, resetting...", e);
        list = DEFAULT_OPPORTUNITIES;
        localStorage.setItem('ath_opportunities', JSON.stringify(list));
      }
    } else {
      list = DEFAULT_OPPORTUNITIES;
      localStorage.setItem('ath_opportunities', JSON.stringify(list));
    }
    
    if (includeAdminAll) {
      return list;
    } else {
      // Public only sees 'published' status
      return list.filter(opp => opp.status === 'published' || !opp.status);
    }
  },

  // Save new or update existing opportunity
  saveOpportunity(opp) {
    // Assign image fallback
    if (!opp.image || opp.image.trim() === '') {
      const catKey = opp.category.toLowerCase();
      opp.image = CATEGORY_IMAGES[catKey] || CATEGORY_IMAGES["jobs"];
    }

    const list = this.getOpportunities(true);
    const existingIndex = list.findIndex(o => o.id === opp.id);
    
    if (existingIndex > -1) {
      list[existingIndex] = opp; // Update
    } else {
      list.unshift(opp); // Insert new at top
    }

    localStorage.setItem('ath_opportunities', JSON.stringify(list));
    return list;
  },

  // Delete opportunity
  deleteOpportunity(oppId) {
    const list = this.getOpportunities(true);
    const filtered = list.filter(o => o.id !== oppId);
    localStorage.setItem('ath_opportunities', JSON.stringify(filtered));
    return filtered;
  },

  // Categories list management
  getCategories() {
    const local = localStorage.getItem('ath_categories');
    let cats = [];
    if (local) {
      try {
        cats = JSON.parse(local);
      } catch (e) {
        cats = DEFAULT_CATEGORIES;
      }
    } else {
      cats = DEFAULT_CATEGORIES;
      localStorage.setItem('ath_categories', JSON.stringify(cats));
    }

    // Dynamic counts based on ALL (admin) opportunities
    const allOpps = this.getOpportunities(true);
    return cats.map(cat => {
      const count = allOpps.filter(o => o.category.toLowerCase() === cat.name.toLowerCase() && o.status === 'published').length;
      return { ...cat, count };
    });
  },

  saveCategory(cat) {
    const local = localStorage.getItem('ath_categories');
    let cats = local ? JSON.parse(local) : DEFAULT_CATEGORIES;
    
    const existingIndex = cats.findIndex(c => c.name.toLowerCase() === cat.name.toLowerCase());
    if (existingIndex > -1) {
      cats[existingIndex] = cat;
    } else {
      cats.push(cat);
    }
    localStorage.setItem('ath_categories', JSON.stringify(cats));
    return cats;
  },

  deleteCategory(catName) {
    const local = localStorage.getItem('ath_categories');
    let cats = local ? JSON.parse(local) : DEFAULT_CATEGORIES;
    const filtered = cats.filter(c => c.name.toLowerCase() !== catName.toLowerCase());
    localStorage.setItem('ath_categories', JSON.stringify(filtered));
    return filtered;
  },

  // Newsletter Signups
  getSubscribers() {
    const local = localStorage.getItem('ath_subscribers');
    return local ? JSON.parse(local) : [];
  },

  addSubscriber(email) {
    const subs = this.getSubscribers();
    if (!subs.includes(email)) {
      subs.push(email);
      localStorage.setItem('ath_subscribers', JSON.stringify(subs));
      return true;
    }
    return false;
  },

  deleteSubscriber(email) {
    const subs = this.getSubscribers();
    const filtered = subs.filter(e => e !== email);
    localStorage.setItem('ath_subscribers', JSON.stringify(filtered));
    return filtered;
  },

  // Contact Support Messages
  getContactMessages() {
    const local = localStorage.getItem('ath_contact_messages');
    return local ? JSON.parse(local) : [];
  },

  addContactMessage(msg) {
    const msgs = this.getContactMessages();
    msg.id = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    msg.date = new Date().toISOString();
    msg.replied = false;
    msgs.unshift(msg);
    localStorage.setItem('ath_contact_messages', JSON.stringify(msgs));
    return msgs;
  },

  toggleReplyMessage(msgId) {
    const msgs = this.getContactMessages();
    const existing = msgs.find(m => m.id === msgId);
    if (existing) {
      existing.replied = !existing.replied;
      localStorage.setItem('ath_contact_messages', JSON.stringify(msgs));
    }
    return msgs;
  },

  deleteMessage(msgId) {
    const msgs = this.getContactMessages();
    const filtered = msgs.filter(m => m.id !== msgId);
    localStorage.setItem('ath_contact_messages', JSON.stringify(filtered));
    return filtered;
  },

  getFaqs() {
    return FAQS;
  }
};
