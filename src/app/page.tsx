import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import "./premium-home.css";
import "./home-platform.css";
import "./premium-accessibility.css";

const capabilities = [
  ["01", "Academic Tutor", "Understand difficult topics, work through examples and get help when class notes are not enough.", "Ask Tekora"],
  ["02", "Project Work", "Discover projects by programme and specialization, then understand every step of what you are building.", "Explore projects"],
  ["03", "Research & Thesis", "Get structured support for topics, methodology, references, analysis, writing and defense preparation.", "Research better"],
  ["04", "Practicals", "Turn theory into hands-on mini projects, simulations and lab-style activities you can actually complete.", "Start building"],
  ["05", "Learning", "Go deeper with structured lessons and courses when you need a complete learning path.", "Explore learning"],
  ["06", "Opportunities", "Connect your learning and practical work to workshops, internships, mentors and industry challenges.", "Find opportunities"],
];

const programmes = [
  ["EE", "Electrical Engineering", "Power · Control · Electronics · Renewable Energy · MATLAB"],
  ["CE", "Computer Engineering", "Embedded Systems · IoT · Digital Systems · Networks"],
  ["SE", "Software Engineering", "Web · Mobile · Backend · Cloud · AI"],
  ["ME", "Mechanical Engineering", "Design · Manufacturing · Thermodynamics · Automation"],
  ["CS", "Computer Science", "Programming · Algorithms · Databases · AI & Data"],
  ["BE", "Built Environment", "Construction · Quantity Surveying · Architecture · Infrastructure"],
];

const projectExamples = [
  ["POWER", "IoT Transformer Health Monitor", "Monitor transformer condition, oil level and electrical parameters with embedded hardware."],
  ["ENERGY", "Smart Energy Meter", "Measure, analyze and visualize electrical energy usage with a practical prototype."],
  ["CONTROL", "Automatic Phase Selector", "Detect source conditions and automatically select the healthiest electrical phase."],
  ["RENEWABLE", "Solar PV Performance Monitor", "Track solar generation and study system performance using real engineering metrics."],
  ["ELECTRONICS", "Cable Fault Locator", "Detect and communicate cable fault points with a practical sensing system."],
  ["SOFTWARE", "Campus Lecture Reminder", "Build a simple university timetable and SMS reminder platform."],
];

const researchTools = [
  "Topic discovery & refinement",
  "Proposal and chapter structure",
  "IEEE reference guidance",
  "Methodology planning",
  "MATLAB / Simulink support",
  "Data analysis & interpretation",
  "Figures, diagrams & presentation",
  "Defense preparation",
];

const institutionTools = [
  ["Programme spaces", "Organize learning resources, subjects, labs and project areas around real programmes."],
  ["Practical delivery", "Support workshops, mini-projects, laboratory preparation and hands-on learning."],
  ["Student progress", "Give students one place to connect study, practical work, research and career development."],
];

const footerGroups = [
  ["Students", ["My Programme", "Tekora AI", "Projects", "Practicals", "Research", "Learn"]],
  ["Build", ["Project Library", "Mini Projects", "MATLAB", "Simulations", "Build Kits", "Workshops"]],
  ["Connect", ["Community", "Mentors", "Opportunities", "Universities", "For Industry", "Portfolio"]],
  ["Tekora", ["About", "Creators", "Developer Platform", "Help Center", "Privacy", "Terms"]],
];

export default function HomePage() {
  return (
    <main className="tkHome">
      <SiteHeader />

      <section className="tkHero">
        <div className="tkHeroInner">
          <div className="tkHeroCopy">
            <span className="tkEyebrow">BUILT FOR TERTIARY EDUCATION</span>
            <h1>Your university journey, <span>powered by Tekora.</span></h1>
            <p>
              Learn difficult subjects, understand MATLAB, find project ideas, work through your thesis, build practical systems, meet people in your field and move toward real opportunities—all in one place.
            </p>
            <div className="tkHeroActions">
              <Link href="/sign-up" className="premiumPrimaryCta">Start free →</Link>
              <Link href="#explore" className="premiumSecondaryCta">Explore Tekora</Link>
            </div>
            <div className="tkHeroTrust">
              <span>Academic support</span><span>Project guidance</span><span>Research help</span><span>Practical skills</span>
            </div>
          </div>

          <div className="tkHeroWorkspace" aria-label="Tekora student workspace preview">
            <div className="tkWorkspaceTop">
              <span className="tkWorkspaceLogo">T</span>
              <div><strong>Electrical Engineering</strong><small>Level 400 · Student workspace</small></div>
              <span className="tkWorkspaceStatus">Active</span>
            </div>
            <div className="tkWorkspaceQuestion">
              <small>WHAT DO YOU NEED HELP WITH?</small>
              <strong>Ask Tekora about your studies.</strong>
              <div><span>Explain circuit analysis...</span><button>Ask →</button></div>
            </div>
            <div className="tkWorkspaceGrid">
              <article><span>AI</span><div><strong>Academic Tutor</strong><small>Explain, solve, learn</small></div></article>
              <article><span>PJ</span><div><strong>Project Work</strong><small>Find & build projects</small></div></article>
              <article><span>R</span><div><strong>Research</strong><small>Thesis support</small></div></article>
              <article><span>LAB</span><div><strong>Practicals</strong><small>Build real skills</small></div></article>
            </div>
            <div className="tkWorkspaceProgramme">
              <div><small>MY PROGRAMME</small><strong>Power Systems · MATLAB · Control · Electronics</strong></div>
              <Link href="/dashboard">Open dashboard →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="tkProofBar">
        <span>Learn your subjects</span><i>•</i><span>Build your project</span><i>•</i><span>Research better</span><i>•</i><span>Practice with real systems</span><i>•</i><span>Prepare for work</span>
      </section>

      <section id="explore" className="tkSection tkCapabilitySection">
        <div className="tkSectionHead">
          <div><span className="tkEyebrow">ONE PLATFORM FOR THE WHOLE JOURNEY</span><h2>More than courses. More than notes.</h2></div>
          <p>Tekora follows the real problems students face throughout tertiary education—not just what happens inside one online course.</p>
        </div>
        <div className="tkCapabilityGrid">
          {capabilities.map(([number,title,copy,action]) => (
            <article key={title}>
              <span className="tkNumber">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <Link href={title === "Learning" ? "/learn" : "/sign-up"}>{action} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="tkProgrammeSection">
        <div className="tkProgrammeInner">
          <div className="tkSectionHead compact">
            <div><span className="tkEyebrow">PERSONALIZED AROUND YOUR PROGRAMME</span><h2>Tekora should understand what you study.</h2></div>
            <p>Choose your institution, programme and level. Tekora can then organize the subjects, projects, practicals and research support that actually matter to you.</p>
          </div>
          <div className="tkProgrammeGrid">
            {programmes.map(([code,title,copy]) => (
              <article key={title}><span>{code}</span><div><h3>{title}</h3><p>{copy}</p></div><b>→</b></article>
            ))}
          </div>
          <div className="tkProgrammeNote">More programmes can be added university by university as Tekora grows.</div>
        </div>
      </section>

      <section className="tkSection tkTutorSection">
        <div className="tkTutorCopy">
          <span className="tkEyebrow">TEKORA AI · YOUR ACADEMIC COMPANION</span>
          <h2>Ask what your lecturer didn’t have time to explain.</h2>
          <p>Tekora AI should work inside the student’s academic context. It can explain concepts, help debug MATLAB, break down calculations, guide project decisions and support research without becoming a shortcut around understanding.</p>
          <div className="tkPromptChips"><span>Explain nodal analysis</span><span>Why is my MATLAB code failing?</span><span>Help structure my methodology</span><span>How does a transformer relay work?</span></div>
          <Link href="/sign-up" className="premiumPrimaryCta">Meet Tekora AI →</Link>
        </div>
        <div className="tkTutorPanel">
          <div className="tkTutorHeader"><span>T</span><div><strong>Tekora AI</strong><small>Academic & practical assistant</small></div></div>
          <div className="tkTutorMessage student">Can you explain why current leads voltage in a capacitor?</div>
          <div className="tkTutorMessage ai"><small>TEKORA</small><p>Think of the capacitor as reacting immediately to a change in voltage. Current flows while the capacitor is charging or discharging, so the current waveform reaches its peak earlier than the voltage waveform.</p><div className="tkTutorActions"><span>Show phasor view</span><span>Give me an example</span></div></div>
          <div className="tkTutorInput"><span>Ask a follow-up...</span><button>↑</button></div>
        </div>
      </section>

      <section className="tkProjectsSection">
        <div className="tkSection tkProjectsInner">
          <div className="tkSectionHead">
            <div><span className="tkEyebrow">PROJECT WORK, ORGANIZED PROPERLY</span><h2>Find projects by field. Understand what you are building.</h2></div>
            <p>Not just a list of titles. Each project can connect the idea, objectives, system design, components, implementation, code, testing, report guidance and defense preparation.</p>
          </div>
          <div className="tkProjectGrid">
            {projectExamples.map(([tag,title,copy],index) => (
              <article key={title}>
                <div className={`tkProjectVisual projectVisual${index + 1}`}><span>{tag}</span><strong>{title.split(" ").slice(0,2).map(word => word[0]).join("")}</strong></div>
                <div className="tkProjectBody"><small>{tag} PROJECT</small><h3>{title}</h3><p>{copy}</p><div><Link href="/sign-up">View project →</Link><span>Guide · BOM · Build</span></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tkSection tkPracticalSplit">
        <div className="tkPracticalMain">
          <span className="tkEyebrow">MINI PROJECTS & PRACTICALS</span>
          <h2>Build something small this week.</h2>
          <p>Tekora practicals turn classroom concepts into compact systems students can build, simulate, test and understand.</p>
          <div className="tkMiniProjectList">
            <article><span className="tkMiniIcon">DC</span><div><strong>Temperature Controlled DC Fan</strong><small>45–60 min · Beginner · Arduino</small></div><Link href="/sign-up">Build →</Link></article>
            <article><span className="tkMiniIcon">IoT</span><div><strong>ESP8266 Room Monitor</strong><small>1–2 hours · Intermediate · IoT</small></div><Link href="/sign-up">Build →</Link></article>
            <article><span className="tkMiniIcon">PV</span><div><strong>Solar Battery Monitor</strong><small>1–2 hours · Intermediate · Energy</small></div><Link href="/sign-up">Build →</Link></article>
          </div>
        </div>
        <aside className="tkKitCard">
          <span className="tkEyebrow">BUILD KITS</span>
          <h3>Need the components too?</h3>
          <p>Students should be able to move from a Tekora project directly to the parts they need—without hunting component by component.</p>
          <div className="tkKitParts"><span>Arduino / ESP</span><span>Sensors</span><span>Resistors</span><span>Relays</span><span>Jumpers</span><span>Breadboard</span></div>
          <Link href="/sign-up" className="premiumPrimaryCta">Explore build kits →</Link>
        </aside>
      </section>

      <section className="tkResearchSection">
        <div className="tkSection tkResearchInner">
          <div className="tkResearchCopy"><span className="tkEyebrow">RESEARCH & FINAL-YEAR PROJECT SUPPORT</span><h2>From research question to defense day.</h2><p>Tekora can guide students through the research process while keeping the student responsible for understanding, decisions and original academic work.</p><Link href="/sign-up" className="premiumPrimaryCta">Start a research workspace →</Link></div>
          <div className="tkResearchGrid">{researchTools.map((tool,index)=><div key={tool}><span>{String(index+1).padStart(2,"0")}</span><strong>{tool}</strong></div>)}</div>
        </div>
      </section>

      <section id="universities" className="tkSection tkUniversitySection">
        <div className="tkUniversityCard">
          <div className="tkUniversityCopy"><span className="tkEyebrow">FOR UNIVERSITIES & DEPARTMENTS</span><h2>Give students a practical layer around the curriculum.</h2><p>Tekora can become the place where a university’s programmes, subjects, projects, practicals, workshops and student development come together without replacing the institution’s existing systems.</p><div className="tkUniversityActions"><Link href="/sign-up" className="premiumPrimaryCta">Partner with Tekora →</Link><Link href="#" className="premiumSecondaryCta">See university use cases</Link></div></div>
          <div className="tkUniversityTools">{institutionTools.map(([title,copy],index)=><article key={title}><span>{index+1}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        </div>
      </section>

      <section id="community" className="tkSection tkConnectSection">
        <div className="tkSectionHead"><div><span className="tkEyebrow">DON’T STUDY IN ISOLATION</span><h2>Connect learning to people and opportunity.</h2></div><p>Your programme can become the bridge to peers, project teammates, mentors, workshops, internships and future employers.</p></div>
        <div className="tkConnectGrid">
          <article><span>PEOPLE</span><h3>Find students on your path.</h3><p>Meet people in the same programme, specialization or project area and build study or project teams.</p><Link href="/sign-up">Join the community →</Link></article>
          <article><span>MENTORS</span><h3>Learn from people doing the work.</h3><p>Connect with engineers, professionals, lecturers and experienced creators for guidance.</p><Link href="/sign-up">Meet mentors →</Link></article>
          <article><span>OPPORTUNITIES</span><h3>Turn capability into a next step.</h3><p>Discover internships, industrial attachments, workshops, challenges and graduate opportunities.</p><Link href="/sign-up">Explore opportunities →</Link></article>
        </div>
      </section>

      <section className="tkFinalCta">
        <div><span className="tkEyebrow">ONE PLACE FOR THE JOURNEY</span><h2>Learn. Build. Research. Prove. Work.</h2><p>Tekora is being built around what tertiary students actually need—from the lecture room to the project bench, thesis defense and first job.</p></div>
        <Link href="/sign-up" className="premiumPrimaryCta">Create your Tekora profile →</Link>
      </section>

      <footer className="tkFooter">
        <div className="tkFooterTop">
          <div className="tkFooterBrand"><Link href="/" className="premiumBrand"><span className="premiumBrandIcon">T</span><span>Tekora</span></Link><p>The practical academic companion for tertiary education.</p><strong>Learn. Build. Research. Prove. Work.</strong></div>
          {footerGroups.map(([title,items]) => <div className="tkFooterGroup" key={title as string}><strong>{title}</strong>{(items as string[]).map(item => <Link href="#" key={item}>{item}</Link>)}</div>)}
        </div>
        <div className="tkFooterBottom"><span>© {new Date().getFullYear()} Tekora.</span><span>Built for students who want to understand, build and move forward.</span></div>
      </footer>
    </main>
  );
}
