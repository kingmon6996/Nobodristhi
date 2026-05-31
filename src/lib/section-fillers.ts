// Editorial filler stories so each newspaper section feels like a full page,
// even when user-submitted reports for that section are sparse.

export interface FillerStory {
  id: string;
  headline: string;
  dek: string;
  body: string;
  author: string;
  location: string;
  kind: "lead" | "column" | "brief" | "analysis" | "opinion";
  tag?: string;
}

type Section = "World" | "Politics" | "Business" | "Technology" | "Science" | "Culture" | "Opinion";

const make = (
  section: Section,
  items: Omit<FillerStory, "id">[],
): FillerStory[] => items.map((i, idx) => ({ ...i, id: `${section}-f-${idx}` }));

export const SECTION_FILLERS: Record<Section, FillerStory[]> = {
  World: make("World", [
    {
      kind: "lead",
      headline: "Coastal nations sign accord to map shifting maritime borders",
      dek: "A 14-country pact pledges shared bathymetric data as sea levels redraw exclusive economic zones.",
      body:
        "Representatives from fourteen coastal nations signed a non-binding accord on Wednesday committing to share high-resolution bathymetric data, a quiet acknowledgment that the maps governing fishing rights, undersea cables and oil concessions are no longer accurate. Negotiators framed the agreement as technical rather than political, but several delegations made clear that disputes over disappearing reefs and migrating shoals are already reaching arbitration. The accord stops short of redrawing any line; it instead establishes a joint cartographic commission that will publish updated charts every eighteen months.",
      author: "Helena Vargas",
      location: "Lisbon",
      tag: "Diplomacy",
    },
    {
      kind: "column",
      headline: "Andean farmers turn to ancient terraces as droughts return",
      dek: "Quechua cooperatives revive pre-Incan irrigation as reservoirs run dry.",
      body:
        "In the highlands above Cusco, farming cooperatives are rebuilding stone terraces that predate the Inca, channeling meltwater through canals their grandparents abandoned in the 1970s. Agronomists from three universities are documenting yields, which so far exceed those of nearby industrial plots.",
      author: "Miguel Quispe",
      location: "Cusco",
    },
    {
      kind: "column",
      headline: "Quiet diplomacy resumes between Riyadh and Tehran",
      dek: "Back-channel talks restart after a six-month freeze, mediators say.",
      body:
        "Officials briefed on the discussions describe a narrow agenda focused on Red Sea shipping safety and pilgrimage logistics, with no immediate plans to address proxy conflicts. A third-country mediator is hosting working groups every two weeks.",
      author: "Reuters Desk",
      location: "Muscat",
    },
    {
      kind: "brief",
      headline: "Polar research station extends winter crew",
      dek: "Supply ship delayed; eleven scientists to remain through August.",
      body: "",
      author: "AP",
      location: "Antarctica",
    },
    {
      kind: "brief",
      headline: "Volcanic ash grounds flights across southern Italy",
      dek: "Stromboli's overnight eruption forces a regional ground-stop.",
      body: "",
      author: "Wire",
      location: "Catania",
    },
    {
      kind: "brief",
      headline: "EU agrees on common asylum processing protocol",
      dek: "Bloc-wide standard to take effect January.",
      body: "",
      author: "Wire",
      location: "Brussels",
    },
    {
      kind: "analysis",
      headline: "Why mid-sized powers are quietly building their own satellites",
      dek: "Sovereignty, not science, is driving a new wave of orbital procurement.",
      body:
        "From Indonesia to Nigeria, governments that once relied on commercial imagery are now commissioning their own constellations. Analysts argue the shift is less about capability and more about ensuring uninterrupted access during geopolitical friction.",
      author: "Priya Raman",
      location: "Singapore",
    },
  ]),
  Politics: make("Politics", [
    {
      kind: "lead",
      headline: "Coalition talks stall as junior partner demands climate ministry",
      dek: "Three weeks after the vote, negotiations hinge on a single cabinet seat.",
      body:
        "Coalition negotiations entered a fourth week without resolution after the prospective junior partner declared the climate and energy portfolio non-negotiable. The larger party had offered transport and digital affairs in exchange, but smaller-party negotiators emerged from Tuesday's session arguing that without control of energy policy their participation would be 'decorative.' A caretaker government continues to handle routine business.",
      author: "Johanna Reuter",
      location: "The Hague",
      tag: "Government",
    },
    {
      kind: "column",
      headline: "Voter rolls audit clears state of widespread irregularities",
      dek: "An eighteen-month review finds error rates below 0.3 percent.",
      body:
        "Independent auditors completed an eighteen-month review of the state's voter registration database and found error rates of 0.27 percent, below the national average and well within statistical norms. The findings are expected to deflate, though not end, ongoing litigation.",
      author: "Marcus Hill",
      location: "Atlanta",
    },
    {
      kind: "column",
      headline: "Parliament fast-tracks bill on judicial appointments",
      dek: "Opposition walks out; constitutional court likely to be the final word.",
      body:
        "Lawmakers advanced contested judicial reform legislation through committee in a single afternoon, prompting an opposition walkout. Constitutional scholars expect the law to be challenged within days of enactment.",
      author: "Dimitri Sokolov",
      location: "Warsaw",
    },
    {
      kind: "brief",
      headline: "Mayor announces re-election bid",
      dek: "Approval rating sits at 54 percent.",
      body: "",
      author: "Local Desk",
      location: "Toronto",
    },
    {
      kind: "brief",
      headline: "Senate confirms ambassador to Mexico",
      dek: "Vote was 71 to 28 after limited debate.",
      body: "",
      author: "Wire",
      location: "Washington",
    },
    {
      kind: "opinion",
      headline: "The quiet erosion of legislative oversight",
      dek: "When committees stop meeting, accountability becomes ceremonial.",
      body:
        "Across democracies the visible drama is in the chamber, but the real work has always happened in committees. Their gradual decline — fewer hearings, shorter sessions, sparser attendance — is a structural shift more consequential than any single vote.",
      author: "Editorial Board",
      location: "",
    },
  ]),
  Business: make("Business", [
    {
      kind: "lead",
      headline: "Central bank holds rates, signals patience on next move",
      dek: "Policymakers cite easing services inflation but warn against premature cuts.",
      body:
        "The central bank's policy committee voted seven to two to keep the benchmark rate unchanged, citing continued moderation in services inflation alongside resilient labor markets. The accompanying statement struck a deliberately ambiguous tone, removing language about 'additional tightening' while declining to telegraph any cut. Markets initially rallied on the softer phrasing before retracing as traders parsed the chair's press conference, in which she stressed that the committee would 'rather move late than wrong.' Futures now price the first cut for the autumn meeting.",
      author: "Diana Whelan",
      location: "Frankfurt",
      tag: "Markets",
    },
    {
      kind: "column",
      headline: "Cocoa prices ease as West African harvest improves",
      dek: "Futures down 18 percent from spring peak; chocolatiers remain cautious.",
      body:
        "Improved rainfall and stricter swollen-shoot containment have lifted yield forecasts in Ghana and Côte d'Ivoire. Confectioners hedged through the autumn say they will not pass savings to consumers immediately.",
      author: "Kwame Acheampong",
      location: "Accra",
    },
    {
      kind: "column",
      headline: "Logistics giant restructures into three regional units",
      dek: "Move follows activist pressure and a 23 percent share-price slide.",
      body:
        "The board approved a split into Americas, EMEA and Asia-Pacific operating units, each with its own profit-and-loss accountability. Analysts see the restructuring as a precursor to a possible spin-off of the cross-border air freight arm.",
      author: "Yuki Mori",
      location: "Singapore",
    },
    {
      kind: "brief",
      headline: "Crude steadies above $78 ahead of OPEC+ call",
      dek: "Brent trades in narrow range as traders await guidance.",
      body: "",
      author: "Wire",
      location: "London",
    },
    {
      kind: "brief",
      headline: "Retail sales rise 0.4 percent month-over-month",
      dek: "Apparel and electronics led gains; auto sales flat.",
      body: "",
      author: "Wire",
      location: "Chicago",
    },
    {
      kind: "brief",
      headline: "IPO of cloud-security firm prices above range",
      dek: "Shares set to debut Thursday at $34.",
      body: "",
      author: "Wire",
      location: "New York",
    },
    {
      kind: "analysis",
      headline: "The slow unwinding of zero-interest-rate businesses",
      dek: "Companies built for cheap money are repricing — slowly, then all at once.",
      body:
        "More than two years after rates began rising, the second-order effects are arriving: refinancing walls, covenant breaches, and the quiet sale of subsidiaries that once defined a brand. The reckoning is uneven and rarely makes the front page, which is precisely what makes it consequential.",
      author: "Adetola Bankole",
      location: "London",
    },
  ]),
  Technology: make("Technology", [
    {
      kind: "lead",
      headline: "Open-source coalition releases shared safety evaluation suite",
      dek: "Eleven labs adopt a common benchmark for testing frontier model behavior.",
      body:
        "Eleven research institutions and three independent labs jointly released a shared suite of safety evaluations for frontier language models, ending more than a year of fragmented and frequently contradictory testing methodologies. The suite, hosted on a neutral non-profit repository, covers prompt injection, biological-risk uplift, autonomous task chaining and a small battery of cultural-bias probes. Critically, the consortium committed to publishing results for any signatory model within thirty days of release, a transparency provision that several commercial labs initially resisted. Industry observers note that the agreement leaves enforcement entirely voluntary.",
      author: "Lina Park",
      location: "San Francisco",
      tag: "AI",
    },
    {
      kind: "column",
      headline: "Browser makers converge on passkey defaults",
      dek: "Three of the top four browsers will prompt for passkeys ahead of passwords.",
      body:
        "The shift, scheduled for the next major release cycle, is expected to accelerate enterprise adoption. Security teams have spent the past year preparing fallback recovery flows for users who lose access to their primary device.",
      author: "Rohan Mehta",
      location: "Bengaluru",
    },
    {
      kind: "column",
      headline: "Chipmaker unveils energy-efficient inference accelerator",
      dek: "New silicon claims 3x perf-per-watt over last generation.",
      body:
        "Benchmarks shared at the company's developer conference suggest meaningful gains for transformer inference at the 8-bit precision tier. Independent testing is expected within the month.",
      author: "Sara Klein",
      location: "Munich",
    },
    {
      kind: "brief",
      headline: "Standards body finalizes Wi-Fi 7 certification",
      dek: "Consumer devices to ship with the seal by Q4.",
      body: "",
      author: "Wire",
      location: "Austin",
    },
    {
      kind: "brief",
      headline: "Cloud outage takes down regional payment processors",
      dek: "Service restored within 48 minutes; post-mortem pending.",
      body: "",
      author: "Wire",
      location: "Dublin",
    },
    {
      kind: "brief",
      headline: "Robotics startup raises $120M Series C",
      dek: "Funding to scale warehouse manipulation deployments.",
      body: "",
      author: "Wire",
      location: "Boston",
    },
    {
      kind: "analysis",
      headline: "The hidden costs of agentic software",
      dek: "Autonomy is impressive in demos, expensive in production.",
      body:
        "As companies move from chat-style assistants to systems that take multi-step actions on a user's behalf, the bill of materials shifts dramatically. Token costs are only the visible portion; the rest is verification, rollback infrastructure and human review queues.",
      author: "Naomi Chen",
      location: "Seattle",
    },
  ]),
  Science: make("Science", [
    {
      kind: "lead",
      headline: "Researchers detect rare neutrino burst from distant supernova",
      dek: "Detector array confirms the first multi-messenger event of the year.",
      body:
        "A coordinated network of underground neutrino observatories registered a coincident burst late Monday, traced minutes later to a Type II supernova in a galaxy roughly forty million light-years away. The detection, confirmed by gravitational-wave instruments and optical telescopes within hours, marks the first multi-messenger astronomy event of the calendar year and provides researchers with rare timing data on the collapse of massive stars. The event is expected to refine models of how heavy elements form during stellar death.",
      author: "Dr. Halima Osei",
      location: "Gran Sasso",
      tag: "Astrophysics",
    },
    {
      kind: "column",
      headline: "Trial of mRNA pancreatic-cancer vaccine extended",
      dek: "Phase II shows durable immune response in 73 percent of patients.",
      body:
        "Investigators announced an extension of enrollment after interim data showed measurable T-cell activity persisting beyond eighteen months. The trial is not yet powered for survival endpoints.",
      author: "Dr. Anya Volkov",
      location: "Boston",
    },
    {
      kind: "column",
      headline: "Coral spawning event recorded in unprecedented detail",
      dek: "Autonomous submersibles capture full reproductive cycle on Great Barrier Reef.",
      body:
        "Marine biologists released the first complete time-lapse of a mass spawning event captured entirely by autonomous instruments, eliminating diver-presence variables that have complicated past observations.",
      author: "Ellen Ngata",
      location: "Cairns",
    },
    {
      kind: "brief",
      headline: "New dwarf planet candidate found beyond Neptune",
      dek: "Orbit suggests trans-Neptunian origin.",
      body: "",
      author: "Wire",
      location: "Pasadena",
    },
    {
      kind: "brief",
      headline: "Lab synthesizes stable form of nitrogen-rich material",
      dek: "Potential applications in green propellants.",
      body: "",
      author: "Wire",
      location: "Zurich",
    },
    {
      kind: "brief",
      headline: "Citizen-science platform crosses 10M observations",
      dek: "Biodiversity records freely available to researchers.",
      body: "",
      author: "Wire",
      location: "Global",
    },
  ]),
  Culture: make("Culture", [
    {
      kind: "lead",
      headline: "A novelist returns after a decade — and the wait was worth it",
      dek: "The long-awaited third novel arrives with quiet confidence and a wider lens.",
      body:
        "Ten years after a debut that won every prize a debut can win, the novelist returns with a book that is, against expectation, both larger and quieter than its predecessor. The new work spans three generations of a single building's residents, moving through partition, reunification and the slow erosion of a shared neighborhood by capital. Reviewers who received early copies have noted the prose's restraint — the absence, deliberate and surgical, of the lyrical flourishes that defined the earlier work. What remains is a kind of moral attention that feels rare.",
      author: "Imogen Pearce",
      location: "London",
      tag: "Books",
    },
    {
      kind: "column",
      headline: "Independent cinema festival posts record attendance",
      dek: "Mid-sized European festival becomes unlikely Oscar bellwether.",
      body:
        "Programmers credit a deliberate move away from premiere-only policies, which has allowed audiences to discover films already gaining traction in smaller markets.",
      author: "Sébastien Rivière",
      location: "Locarno",
    },
    {
      kind: "column",
      headline: "Museum returns 14th-century manuscripts to country of origin",
      dek: "A six-year provenance review concludes amicably.",
      body:
        "The institution will retain digital facsimiles and continue to host visiting scholars under a collaborative research agreement that may serve as a template for similar cases.",
      author: "Amal Haddad",
      location: "Beirut",
    },
    {
      kind: "brief",
      headline: "Composer wins lifetime achievement award",
      dek: "Acceptance speech runs to a perfectly observed ninety seconds.",
      body: "",
      author: "Wire",
      location: "Vienna",
    },
    {
      kind: "brief",
      headline: "Dance company announces season-long residency",
      dek: "Free community classes included.",
      body: "",
      author: "Wire",
      location: "Mexico City",
    },
    {
      kind: "opinion",
      headline: "In praise of the second viewing",
      dek: "What we miss when we treat every film like a finite resource.",
      body:
        "Streaming taught us to consume; it has not taught us to return. The richest cultural experiences in any medium reveal themselves only on revisitation, and a culture that does not revisit becomes, eventually, a culture that does not remember.",
      author: "Editorial",
      location: "",
    },
  ]),
  Opinion: make("Opinion", [
    {
      kind: "lead",
      headline: "Editorial: The case for slower news",
      dek: "Speed has been the industry's organizing principle. It is also its central weakness.",
      body:
        "For two decades the digital news industry has organized itself around the proposition that being first is the same as being valuable. The proposition was always partial and is now openly false. The stories that move markets, change policy and outlast the cycle are almost never the ones that broke first; they are the ones that were understood best. Building newsrooms around speed has crowded out the workflows — long reporting trips, document review, source cultivation — that produce understanding. The cost is paid not by publishers but by readers, who increasingly cannot tell the difference between a notification and a fact. A serious correction does not require abandoning timeliness. It requires rebalancing the editorial calendar so that depth is funded, not merely tolerated.",
      author: "The Editorial Board",
      location: "",
      tag: "Editorial",
    },
    {
      kind: "column",
      headline: "Guest essay: What the protests in my city are really about",
      dek: "The slogans on the placards are not the story. The cost of rent is.",
      body:
        "I have watched three rounds of demonstrations in the last eighteen months. The grievances cited by organizers shift; the underlying arithmetic does not. When a one-bedroom apartment costs more than the median monthly wage, every other grievance acquires a sharper edge.",
      author: "Júlia Soares",
      location: "Lisbon",
    },
    {
      kind: "column",
      headline: "Why I changed my mind on a universal carbon tariff",
      dek: "The argument that persuaded me was not environmental.",
      body:
        "I spent years opposing border carbon adjustments as protectionism in green packaging. The case that eventually persuaded me was made not by climate economists but by trade lawyers, who pointed out that without one we are subsidizing the offshoring of emissions.",
      author: "Daniel Friedman",
      location: "Geneva",
    },
    {
      kind: "brief",
      headline: "Letters: readers respond to last week's coverage of housing",
      dek: "A selection of correspondence, edited for length.",
      body: "",
      author: "Letters Desk",
      location: "",
    },
    {
      kind: "brief",
      headline: "Cartoon of the day",
      dek: "By our resident illustrator.",
      body: "",
      author: "Illustration",
      location: "",
    },
  ]),
};
