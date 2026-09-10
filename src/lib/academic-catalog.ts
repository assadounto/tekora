export type AcademicTopic = {
  title: string;
  summary: string;
};

export type AcademicSubject = {
  slug: string;
  code: string;
  name: string;
  area: string;
  level: string;
  semester: string;
  description: string;
  tools: string[];
  topics: AcademicTopic[];
};

export type ProgrammeCatalog = {
  key: string;
  name: string;
  description: string;
  areas: string[];
  subjects: AcademicSubject[];
};

const electrical: ProgrammeCatalog = {
  key: "electrical-engineering",
  name: "Electrical Engineering",
  description: "Study power, control, machines, electronics, protection, renewable energy, simulation and practical engineering systems.",
  areas: ["Power", "Control", "Electronics", "Renewable Energy", "Protection", "Embedded Systems"],
  subjects: [
    {
      slug: "circuit-analysis",
      code: "EE 201",
      name: "Circuit Analysis",
      area: "Electronics",
      level: "Level 200",
      semester: "Semester 1",
      description: "Build a strong foundation in DC and AC circuit analysis and learn how to reason through networks step by step.",
      tools: ["Tekora Tutor", "Worked examples", "Circuit diagrams", "Practice questions"],
      topics: [
        { title: "Ohm's Law & Power", summary: "Voltage, current, resistance, power and energy relationships." },
        { title: "Kirchhoff's Laws", summary: "KCL, KVL and systematic analysis of multi-loop circuits." },
        { title: "Nodal Analysis", summary: "Solve circuits using node voltages and reference nodes." },
        { title: "Mesh Analysis", summary: "Use loop currents to solve planar electrical networks." },
        { title: "Network Theorems", summary: "Thevenin, Norton, superposition and maximum power transfer." },
        { title: "AC Fundamentals", summary: "Phasors, impedance, reactance and sinusoidal steady-state analysis." },
      ],
    },
    {
      slug: "electronics",
      code: "EE 224",
      name: "Electronics",
      area: "Electronics",
      level: "Level 200",
      semester: "Semester 2",
      description: "Understand semiconductor devices and build useful analogue and switching circuits.",
      tools: ["Tekora Tutor", "Circuit simulation", "Mini projects", "Component guides"],
      topics: [
        { title: "Diodes", summary: "Rectifiers, clipping, clamping and practical diode circuits." },
        { title: "BJT Transistors", summary: "Biasing, switching and amplifier fundamentals." },
        { title: "MOSFETs", summary: "MOSFET operation, switching and motor/load control." },
        { title: "Operational Amplifiers", summary: "Ideal op-amp rules and common amplifier configurations." },
        { title: "Power Electronics Basics", summary: "Switching devices, converters and controlled power flow." },
      ],
    },
    {
      slug: "electrical-machines",
      code: "EE 311",
      name: "Electrical Machines",
      area: "Power",
      level: "Level 300",
      semester: "Semester 1",
      description: "Learn how transformers, DC machines, induction motors and synchronous machines work and are applied.",
      tools: ["Tekora Tutor", "Machine calculations", "MATLAB", "Practical guides"],
      topics: [
        { title: "Transformers", summary: "Equivalent circuits, regulation, efficiency and testing." },
        { title: "DC Machines", summary: "Construction, EMF, torque, generators and motors." },
        { title: "Induction Motors", summary: "Rotating fields, slip, torque and performance." },
        { title: "Synchronous Machines", summary: "Alternators, motors, excitation and power-angle concepts." },
      ],
    },
    {
      slug: "power-systems",
      code: "EE 321",
      name: "Power Systems",
      area: "Power",
      level: "Level 300",
      semester: "Semester 2",
      description: "Understand generation, transmission, distribution, per-unit analysis, faults and power-flow concepts.",
      tools: ["Tekora Tutor", "MATLAB", "Single-line diagrams", "Project ideas"],
      topics: [
        { title: "Power System Structure", summary: "Generation, transmission, substations and distribution." },
        { title: "Per-Unit System", summary: "Normalize power-system quantities for easier network calculations." },
        { title: "Transmission Lines", summary: "Line parameters, performance and voltage regulation." },
        { title: "Load Flow", summary: "Power-flow concepts and numerical analysis of networks." },
        { title: "Fault Analysis", summary: "Symmetrical and unsymmetrical faults and short-circuit levels." },
      ],
    },
    {
      slug: "control-systems",
      code: "EE 332",
      name: "Control Systems",
      area: "Control",
      level: "Level 300",
      semester: "Semester 2",
      description: "Model dynamic systems, study feedback and design stable controllers using analytical and simulation tools.",
      tools: ["Tekora Tutor", "MATLAB", "Simulink", "Control projects"],
      topics: [
        { title: "System Modelling", summary: "Differential equations, transfer functions and block diagrams." },
        { title: "Time Response", summary: "First- and second-order transient response characteristics." },
        { title: "Stability", summary: "Routh-Hurwitz, poles and stability interpretation." },
        { title: "Root Locus", summary: "Visualize how closed-loop poles change with gain." },
        { title: "PID Control", summary: "Understand and tune proportional, integral and derivative action." },
      ],
    },
    {
      slug: "matlab-simulink",
      code: "EE 350",
      name: "MATLAB & Simulink",
      area: "Control",
      level: "Level 300",
      semester: "Semester 2",
      description: "Use MATLAB and Simulink to calculate, model, simulate and visualize engineering systems.",
      tools: ["MATLAB help", "Simulink help", "Debugging", "Runnable examples"],
      topics: [
        { title: "MATLAB Fundamentals", summary: "Variables, arrays, scripts, functions and plotting." },
        { title: "Engineering Computation", summary: "Solve equations, process data and automate calculations." },
        { title: "Simulink Fundamentals", summary: "Build block-based dynamic system models." },
        { title: "Electrical Simulations", summary: "Model relays, meters, controllers and power-system ideas." },
        { title: "Results & Visualization", summary: "Plot, interpret and present simulation outputs clearly." },
      ],
    },
    {
      slug: "renewable-energy",
      code: "EE 411",
      name: "Renewable Energy",
      area: "Renewable Energy",
      level: "Level 400",
      semester: "Semester 1",
      description: "Study solar PV, wind, storage, resource assessment, sizing and grid integration.",
      tools: ["Tekora Tutor", "HOMER guidance", "MATLAB", "Solar projects"],
      topics: [
        { title: "Solar PV Fundamentals", summary: "Solar resource, modules, arrays and I-V characteristics." },
        { title: "PV System Sizing", summary: "Load assessment, panel, inverter, battery and controller sizing." },
        { title: "Energy Storage", summary: "Battery technologies, capacity, SOC and lifecycle considerations." },
        { title: "Grid Integration", summary: "Interconnection, power quality and distributed generation." },
        { title: "Techno-Economic Analysis", summary: "Compare system performance, cost and project viability." },
      ],
    },
    {
      slug: "power-system-protection",
      code: "EE 421",
      name: "Power System Protection",
      area: "Protection",
      level: "Level 400",
      semester: "Semester 1",
      description: "Learn protection principles, relays, instrument transformers, coordination and fault isolation.",
      tools: ["Tekora Tutor", "Protection calculations", "Relay projects", "MATLAB"],
      topics: [
        { title: "Protection Principles", summary: "Selectivity, speed, sensitivity, reliability and zones." },
        { title: "Instrument Transformers", summary: "CTs and VTs for measurement and protection." },
        { title: "Overcurrent Protection", summary: "Relay characteristics, settings and coordination." },
        { title: "Transformer Protection", summary: "Differential, Buchholz and overcurrent schemes." },
        { title: "Transmission Protection", summary: "Distance and line protection concepts." },
      ],
    },
    {
      slug: "iot-embedded-systems",
      code: "EE 438",
      name: "IoT & Embedded Systems",
      area: "Embedded Systems",
      level: "Level 400",
      semester: "Semester 2",
      description: "Connect sensors, microcontrollers, networks and dashboards to create intelligent engineering prototypes.",
      tools: ["Arduino", "ESP8266/ESP32", "Dashboards", "Build kits"],
      topics: [
        { title: "Microcontroller Fundamentals", summary: "GPIO, ADC, PWM, timing and embedded logic." },
        { title: "Sensors & Actuators", summary: "Read physical quantities and control real devices." },
        { title: "Connectivity", summary: "Wi-Fi, HTTP, MQTT and device-to-cloud communication." },
        { title: "IoT Dashboards", summary: "Display measurements, status, history and controls." },
        { title: "Prototype Design", summary: "Turn an engineering problem into a working connected system." },
      ],
    },
    {
      slug: "research-project-work",
      code: "EE 499",
      name: "Research & Project Work",
      area: "Project Work",
      level: "Level 400",
      semester: "Full year",
      description: "Develop a defensible engineering project from problem definition through implementation, analysis, documentation and defense.",
      tools: ["Topic development", "IEEE references", "Methodology", "Defense prep"],
      topics: [
        { title: "Problem Definition", summary: "Turn a broad idea into a clear engineering problem and scope." },
        { title: "Literature Review", summary: "Find, organize and critically compare relevant prior work." },
        { title: "Methodology", summary: "Choose a method, architecture, experiment or simulation plan." },
        { title: "Implementation", summary: "Build, test and document hardware/software systematically." },
        { title: "Results & Defense", summary: "Interpret findings, write conclusions and prepare for questions." },
      ],
    },
  ],
};

const software: ProgrammeCatalog = {
  key: "software-engineering",
  name: "Software Engineering",
  description: "Study programming, systems, databases, software design, web/mobile development, cloud, AI and project delivery.",
  areas: ["Programming", "Web", "Mobile", "Data", "Cloud", "AI"],
  subjects: [
    {
      slug: "programming-fundamentals",
      code: "SE 201",
      name: "Programming Fundamentals",
      area: "Programming",
      level: "Level 200",
      semester: "Semester 1",
      description: "Build problem-solving skills with variables, control flow, functions, data structures and debugging.",
      tools: ["Tekora Tutor", "Code examples", "Debugging", "Practice tasks"],
      topics: [
        { title: "Variables & Types", summary: "Represent and transform data correctly." },
        { title: "Control Flow", summary: "Conditionals, loops and program decisions." },
        { title: "Functions", summary: "Break programs into reusable units." },
        { title: "Data Structures", summary: "Lists, maps, sets and structured data." },
        { title: "Debugging", summary: "Read errors, isolate faults and fix code systematically." },
      ],
    },
    {
      slug: "databases",
      code: "SE 302",
      name: "Databases",
      area: "Data",
      level: "Level 300",
      semester: "Semester 1",
      description: "Design relational databases, write SQL and build reliable data-backed applications.",
      tools: ["SQL help", "Schema design", "PostgreSQL", "Project ideas"],
      topics: [
        { title: "Relational Modelling", summary: "Entities, relationships, keys and normalization." },
        { title: "SQL", summary: "Query, join, aggregate and modify relational data." },
        { title: "Transactions", summary: "Consistency, isolation and reliable updates." },
        { title: "Indexes", summary: "Improve query performance with the right indexes." },
      ],
    },
    {
      slug: "web-development",
      code: "SE 318",
      name: "Web Development",
      area: "Web",
      level: "Level 300",
      semester: "Semester 2",
      description: "Build modern full-stack web applications and understand browser, server, API and deployment fundamentals.",
      tools: ["Next.js", "APIs", "Authentication", "Deployment"],
      topics: [
        { title: "Frontend Fundamentals", summary: "HTML, CSS, JavaScript and component-based UI." },
        { title: "Backend & APIs", summary: "Server logic, validation, persistence and API design." },
        { title: "Authentication", summary: "Identity, sessions and access control." },
        { title: "Deployment", summary: "Move applications from local development to production." },
      ],
    },
    {
      slug: "mobile-development",
      code: "SE 408",
      name: "Mobile Development",
      area: "Mobile",
      level: "Level 400",
      semester: "Semester 1",
      description: "Design and build mobile applications with navigation, APIs, local data, notifications and device capabilities.",
      tools: ["React Native", "Expo", "APIs", "Offline-first"],
      topics: [
        { title: "Mobile UI", summary: "Responsive layouts, navigation and native interaction patterns." },
        { title: "Data & APIs", summary: "Fetch, cache and synchronize remote data." },
        { title: "Device Features", summary: "Camera, storage, notifications and permissions." },
        { title: "Offline-first", summary: "Keep critical app flows working with weak connectivity." },
      ],
    },
    {
      slug: "cloud-computing",
      code: "SE 416",
      name: "Cloud Computing",
      area: "Cloud",
      level: "Level 400",
      semester: "Semester 1",
      description: "Understand cloud infrastructure, deployment, storage, scaling and production reliability.",
      tools: ["Cloud concepts", "Docker", "Deployment", "Architecture"],
      topics: [
        { title: "Cloud Fundamentals", summary: "Compute, storage, networking and managed services." },
        { title: "Containers", summary: "Package applications consistently with Docker." },
        { title: "Scaling", summary: "Design services that handle growth and failure." },
        { title: "Observability", summary: "Logs, metrics and production troubleshooting." },
      ],
    },
    {
      slug: "ai-data",
      code: "SE 430",
      name: "AI & Data",
      area: "AI",
      level: "Level 400",
      semester: "Semester 2",
      description: "Learn practical data analysis and modern AI concepts with responsible real-world applications.",
      tools: ["Python", "Data analysis", "AI concepts", "Projects"],
      topics: [
        { title: "Data Preparation", summary: "Clean, transform and understand datasets." },
        { title: "Machine Learning Basics", summary: "Features, models, training and evaluation." },
        { title: "Modern AI Systems", summary: "Understand language models, retrieval and AI applications." },
        { title: "Responsible AI", summary: "Evaluate limitations, safety, privacy and bias." },
      ],
    },
  ],
};

const general: ProgrammeCatalog = {
  key: "general-tertiary",
  name: "Tertiary Studies",
  description: "A flexible academic workspace for learning, research, practical work and project development.",
  areas: ["Core", "Research", "Projects", "Data", "Industry"],
  subjects: [
    {
      slug: "research-methods",
      code: "GEN 401",
      name: "Research Methods",
      area: "Research",
      level: "Tertiary",
      semester: "Any semester",
      description: "Plan credible academic research and understand how evidence supports conclusions.",
      tools: ["Research assistant", "References", "Methodology", "Data analysis"],
      topics: [
        { title: "Research Problems", summary: "Define a focused and meaningful problem." },
        { title: "Literature Review", summary: "Find and synthesize prior work." },
        { title: "Methodology", summary: "Choose methods that answer the research question." },
        { title: "Results", summary: "Analyze and interpret evidence clearly." },
      ],
    },
    {
      slug: "project-work",
      code: "GEN 499",
      name: "Project Work",
      area: "Projects",
      level: "Final year",
      semester: "Full year",
      description: "Move from an idea to a well-understood, implemented and defensible project.",
      tools: ["Project ideas", "Planning", "Implementation", "Defense prep"],
      topics: [
        { title: "Idea Selection", summary: "Choose a feasible project with a clear purpose." },
        { title: "Planning", summary: "Scope resources, milestones and risks." },
        { title: "Implementation", summary: "Build and test systematically." },
        { title: "Documentation", summary: "Explain decisions, results and limitations." },
      ],
    },
    {
      slug: "data-analysis",
      code: "GEN 320",
      name: "Data Analysis",
      area: "Data",
      level: "Tertiary",
      semester: "Any semester",
      description: "Turn raw data into understandable evidence, visualizations and conclusions.",
      tools: ["Spreadsheets", "MATLAB", "Python", "Visualization"],
      topics: [
        { title: "Data Cleaning", summary: "Prepare data for reliable analysis." },
        { title: "Descriptive Statistics", summary: "Summarize distributions and relationships." },
        { title: "Visualization", summary: "Communicate patterns clearly with charts and tables." },
        { title: "Interpretation", summary: "Connect numerical results back to the research question." },
      ],
    },
  ],
};

export function getProgrammeCatalog(programmeName?: string | null): ProgrammeCatalog {
  const value = programmeName?.toLowerCase() ?? "";
  if (value.includes("electrical") || value.includes("electronic")) return electrical;
  if (value.includes("software") || value.includes("computer") || value.includes("information")) return software;
  return general;
}

export function findSubject(programmeName: string | null | undefined, subjectSlug: string) {
  return getProgrammeCatalog(programmeName).subjects.find((subject) => subject.slug === subjectSlug);
}
