export type ProjectDifficulty = "Simple" | "Intermediate" | "Advanced";
export type ProjectMode = "DIY" | "Guided" | "Kit-ready";

export type TekoraProject = {
  slug: string;
  title: string;
  field: string;
  area: string;
  difficulty: ProjectDifficulty;
  mode: ProjectMode[];
  summary: string;
  time: string;
  kitPrice?: number;
  skills: string[];
  components?: string[];
  phases: { title: string; description: string }[];
};

export const projectFields = [
  "Electrical Engineering",
  "Software Engineering",
  "Computer Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Carpentry & Woodwork",
  "Renewable Energy",
  "Electronics & IoT",
];

export const projects: TekoraProject[] = [
  {
    slug: "temperature-controlled-dc-fan",
    title: "Temperature Controlled DC Fan",
    field: "Electrical Engineering",
    area: "Control & Electronics",
    difficulty: "Simple",
    mode: ["DIY", "Guided", "Kit-ready"],
    summary: "Build a fan whose speed responds to temperature using an LM35, Arduino and MOSFET control.",
    time: "45–60 min",
    kitPrice: 180,
    skills: ["Arduino", "Sensors", "PWM", "MOSFET"],
    components: ["Arduino Nano", "LM35", "12V DC fan", "IRLZ44N", "LCD I2C", "Diode", "Resistors", "Jumper wires"],
    phases: [
      { title: "Understand", description: "Learn how the LM35 converts temperature to voltage and how PWM controls fan speed." },
      { title: "Plan", description: "Review the block diagram, pin map, component list and power arrangement." },
      { title: "Build", description: "Wire the sensor, MOSFET, fan and LCD around the Arduino controller." },
      { title: "Program", description: "Upload the control logic and map temperature ranges to fan speed." },
      { title: "Test", description: "Verify sensor readings, fan response and display output across temperature changes." },
      { title: "Document", description: "Capture results, explain the design choices and turn the build into project evidence." },
    ],
  },
  {
    slug: "smart-energy-meter",
    title: "Smart Energy Meter",
    field: "Electrical Engineering",
    area: "Power & IoT",
    difficulty: "Intermediate",
    mode: ["Guided", "Kit-ready"],
    summary: "Measure and visualize electrical energy use with sensing, embedded control and a simple dashboard.",
    time: "1–2 days",
    kitPrice: 520,
    skills: ["Energy", "ESP8266", "Sensors", "Dashboard"],
    components: ["ESP8266", "Current sensor", "Voltage sensing module", "LCD I2C", "Breadboard", "Power supply", "Jumper wires"],
    phases: [
      { title: "Define", description: "Set the measurements, safety boundaries and expected dashboard outputs." },
      { title: "Design", description: "Create the sensing, controller and data-flow block diagram." },
      { title: "Prototype", description: "Assemble the low-voltage prototype and validate sensor readings." },
      { title: "Connect", description: "Send readings to the local or cloud dashboard." },
      { title: "Analyze", description: "Calculate energy use and interpret trends from collected measurements." },
      { title: "Present", description: "Prepare project documentation, results and defense talking points." },
    ],
  },
  {
    slug: "iot-transformer-health-monitor",
    title: "IoT Transformer Health Monitor",
    field: "Electrical Engineering",
    area: "Power Systems",
    difficulty: "Advanced",
    mode: ["Guided", "Kit-ready"],
    summary: "Monitor transformer condition variables and expose status through an IoT dashboard and local display.",
    time: "3–5 days",
    kitPrice: 780,
    skills: ["Power", "IoT", "Monitoring", "Embedded systems"],
    components: ["Arduino", "ESP8266", "Ultrasonic sensor", "LCD I2C", "Buzzer", "LEDs", "Power supply", "Jumper wires"],
    phases: [
      { title: "Problem", description: "Understand transformer health variables and decide what the prototype will simulate or measure." },
      { title: "Architecture", description: "Design the sensing, controller, alert and dashboard flow." },
      { title: "Hardware", description: "Build the sensing and indication prototype safely at low voltage." },
      { title: "Firmware", description: "Implement thresholds, alerts, display pages and communication." },
      { title: "Dashboard", description: "Visualize condition, history and status for demonstration." },
      { title: "Defense", description: "Explain limitations, results, future improvements and engineering relevance." },
    ],
  },
  {
    slug: "campus-lecture-reminder",
    title: "Campus Lecture Reminder Platform",
    field: "Software Engineering",
    area: "Web Applications",
    difficulty: "Intermediate",
    mode: ["DIY", "Guided"],
    summary: "Build a simple timetable dashboard that reminds lecturers or students before scheduled classes.",
    time: "1–2 days",
    skills: ["Next.js", "TypeScript", "Local storage", "SMS API"],
    phases: [
      { title: "Scope", description: "Define users, timetable fields, reminder rules and prototype constraints." },
      { title: "Design", description: "Sketch the admin dashboard, timetable and reminder experience." },
      { title: "Build", description: "Create the Next.js UI and local persistence." },
      { title: "Integrate", description: "Connect an SMS provider or simulate outgoing reminders." },
      { title: "Test", description: "Verify scheduling, edits, reminders and responsive behavior." },
      { title: "Present", description: "Document the architecture and demo the complete workflow." },
    ],
  },
  {
    slug: "offline-student-pos",
    title: "Offline-first Student POS",
    field: "Software Engineering",
    area: "Mobile Applications",
    difficulty: "Advanced",
    mode: ["Guided"],
    summary: "Create a mobile point-of-sale app that keeps working offline and synchronizes when connectivity returns.",
    time: "1–2 weeks",
    skills: ["React Native", "Offline sync", "Local database", "APIs"],
    phases: [
      { title: "Model", description: "Define products, orders, payments and synchronization states." },
      { title: "UX", description: "Design a fast mobile flow for selling without reliable internet." },
      { title: "Offline", description: "Persist products and orders locally first." },
      { title: "Sync", description: "Add conflict-aware synchronization with the server." },
      { title: "Test", description: "Simulate poor connectivity, retries and duplicate protection." },
      { title: "Ship", description: "Document architecture decisions and prepare a demonstrable build." },
    ],
  },
  {
    slug: "wifi-controlled-mini-mower",
    title: "Wi‑Fi Controlled Mini Mower",
    field: "Mechanical Engineering",
    area: "Mechatronics",
    difficulty: "Intermediate",
    mode: ["DIY", "Guided", "Kit-ready"],
    summary: "Build a small mobile mower prototype using geared motors, an ESP8266 and a safe low-power cutting demonstrator.",
    time: "1–3 days",
    kitPrice: 690,
    skills: ["Mechanisms", "Motor control", "ESP8266", "Fabrication"],
    phases: [
      { title: "Mechanical layout", description: "Plan chassis, wheel placement, center of gravity and mower mechanism." },
      { title: "Drive", description: "Mount geared motors and verify forward, reverse and steering." },
      { title: "Control", description: "Wire the motor driver and Wi‑Fi controller." },
      { title: "Interface", description: "Create a simple phone-accessible control page." },
      { title: "Test", description: "Verify movement and the safe demonstrator mechanism separately." },
      { title: "Improve", description: "Document balance, power and mechanical improvements." },
    ],
  },
  {
    slug: "solar-phone-charging-locker",
    title: "Solar Phone Charging Locker",
    field: "Renewable Energy",
    area: "Solar & Product Design",
    difficulty: "Intermediate",
    mode: ["Guided", "Kit-ready"],
    summary: "Combine solar charging, protected phone compartments and simple timed access into one student prototype.",
    time: "3–5 days",
    kitPrice: 1250,
    skills: ["Solar", "Battery", "Buck converter", "Access control"],
    phases: [
      { title: "Energy budget", description: "Estimate charging demand and size the prototype power path." },
      { title: "Solar path", description: "Connect panel, charge controller, battery and regulated outputs." },
      { title: "Locker", description: "Build the enclosure and low-voltage lock-control prototype." },
      { title: "Control", description: "Add timed access and status indication." },
      { title: "Test", description: "Validate charging voltage, compartment control and runtime." },
      { title: "Document", description: "Summarize performance, safety and scale-up recommendations." },
    ],
  },
  {
    slug: "foldable-study-desk",
    title: "Foldable Student Study Desk",
    field: "Carpentry & Woodwork",
    area: "Furniture",
    difficulty: "Simple",
    mode: ["DIY", "Guided"],
    summary: "Design and build a compact foldable study desk with a clean cutting list and assembly sequence.",
    time: "4–6 hours",
    skills: ["Measurement", "Cutting", "Joinery", "Finishing"],
    phases: [
      { title: "Measure", description: "Choose useful dimensions and prepare a cutting list." },
      { title: "Plan joints", description: "Select simple joints, hinges and supports." },
      { title: "Cut", description: "Prepare the timber or board pieces accurately." },
      { title: "Assemble", description: "Join the frame, top and folding mechanism." },
      { title: "Finish", description: "Sand, inspect and finish the surfaces." },
      { title: "Review", description: "Check stability, portability and material efficiency." },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
