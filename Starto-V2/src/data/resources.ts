import { FileText, DollarSign, Building, Shield, Briefcase, Globe } from "lucide-react";

export type SchemeType = "Grant" | "Loan" | "Subsidy" | "Mentorship" | "Equity";
export type FundingStage = "Idea" | "MVP" | "Seed" | "Growth" | "Scale";
export type Sector = "AI" | "Fintech" | "AgriTech" | "HealthTech" | "EdTech" | "Retail" | "SaaS" | "Manufacturing" | "Any";

export interface Scheme {
    id: string;
    name: string;
    description: string;
    amount?: string;
    type: SchemeType;
    eligibility: string;
    link: string;
    provider: "Central" | "State" | "Private";
    state?: string;
    tags: string[];
    // New Fields for Detail View
    benefits: string[];
    documentsRequired: string[];
    applicationProcess: string[];
    lastUpdated: string;
}

export interface FundingProgram {
    id: string;
    name: string;
    description: string;
    type: "Incubator" | "Accelerator";
    location: string;
    focusArea: string[];
    link: string;
}

export interface FounderTool {
    id: string;
    title: string;
    description: string;
    category: "Finance" | "Legal" | "Pitching" | "Product";
    downloadUrl: string;
    isPremium?: boolean;
}

export const CENTRAL_SCHEMES: Scheme[] = [
    {
        id: "sis-1",
        name: "Startup India Seed Fund Scheme (SISFS)",
        description: "Financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.",
        amount: "Up to ₹20 Lakhs (Grant) / ₹50 Lakhs (Debt)",
        type: "Grant",
        eligibility: "DPIIT Recognized, Incorporated < 2 years ago, Business idea must have market potential.",
        link: "https://seedfund.startupindia.gov.in/",
        provider: "Central",
        tags: ["Seed", "Early Stage", "DPIIT", "Hardware", "Tech"],
        benefits: [
            "Up to ₹20 Lakhs as grant for validating Proof of Concept.",
            "Up to ₹50 Lakhs as debt/convertible debentures for commercialization.",
            " mentorship support from incubators."
        ],
        documentsRequired: [
            "Certificate of Incorporation",
            "DPIIT Recognition Certificate",
            "Pitch Deck / Project Proposal",
            "Team details and background"
        ],
        applicationProcess: [
            "Create an account on Startup India website.",
            "Apply for DPIIT Recognition.",
            "Login to Seed Fund Portal.",
            "Select up to 3 incubators to apply to.",
            "Submit application and track status."
        ],
        lastUpdated: "2024-12-01"
    },
    {
        id: "ffs-1",
        name: "Fund of Funds for Startups (FFS)",
        description: "Capital support to SEBI registered AIFs who invest in startups. Not direct funding to startups, but increases capital availability.",
        amount: "Varies via AIFs",
        type: "Equity",
        eligibility: "Startups must raise funds from AIFs registered under FFS.",
        link: "https://www.startupindia.gov.in/content/sih/en/government-schemes/fund-of-funds-for-startups.html",
        provider: "Central",
        tags: ["Growth", "Scaling", "VC Funding"],
        benefits: [
            "Increases availability of risk capital.",
            "Catalyzes private investment.",
            "Access to seasoned investors."
        ],
        documentsRequired: [
            "Standard due diligence documents required by VC/AIFs.",
            "Term Sheet",
            "Shaeholder Agreement"
        ],
        applicationProcess: [
            "Identify AIFs registered under FFS.",
            "Pitch to the AIF investment committee.",
            "Undergo due diligence.",
            "Receive funding if approved by the AIF."
        ],
        lastUpdated: "2024-11-15"
    },
    {
        id: "cgss-1",
        name: "Credit Guarantee Scheme for Startups (CGSS)",
        description: "Credit guarantees for loans extended by banks and NBFCs to eligible startups, making it easier to get collateral-free loans.",
        amount: "Up to ₹10 Crores",
        type: "Loan",
        eligibility: "DPIIT Recognized, No default history, Stable revenue stream preferred.",
        link: "https://www.startupindia.gov.in/",
        provider: "Central",
        tags: ["Dept Financing", "Collateral Free", "Working Capital"],
        benefits: [
            "Collateral-free loans.",
            "Umbrella cover for debt financing.",
            "Lower interest rates compared to unsecured loans."
        ],
        documentsRequired: [
            "Audited Financial Statements",
            "DPIIT Certificate",
            "Loan Application Form",
            "Business Plan"
        ],
        applicationProcess: [
            "Approach a member lending institution (Bank/NBFC).",
            "Submit loan application with CGSS request.",
            "Bank evaluates and applies for guarantee cover.",
            "Loan disbursed upon approval."
        ],
        lastUpdated: "2024-10-20"
    },
    {
        id: "mit-1",
        name: "MSME Innovative Scheme",
        description: "Support for ideas, incubation, design, and IPR for MSMEs and Startups.",
        amount: "Up to ₹15 Lakhs (Idea) / ₹1 Crore (Plant)",
        type: "Grant",
        eligibility: "Registered MSME or Startup with Udyam Registration.",
        link: "https://innovative.msme.gov.in/",
        provider: "Central",
        tags: ["MSME", "Innovation", "IPR"],
        benefits: [
            "Financial support for IP filing.",
            "Grant for prototype development.",
            "Access to design clinics."
        ],
        documentsRequired: [
            "Udyam Registration",
            "Project Report",
            "Details of IP/Design"
        ],
        applicationProcess: [
            "Register on MSME Innovative Portal.",
            "Submit proposal under relevant component.",
            "Evaluation by committee.",
            "Release of funds."
        ],
        lastUpdated: "2024-12-05"
    }
];

export const STATE_SCHEMES: Scheme[] = [
    {
        id: "ka-1",
        name: "Karnataka Startup Policy - Idea2PoC (Elebate)",
        description: "Grant-in-aid for early stage startups for Proof of Concept validation and product development.",
        amount: "Up to ₹50 Lakhs",
        type: "Grant",
        eligibility: "Registered in Karnataka, Entity < 10 years old, innovative idea.",
        link: "https://startup.karnataka.gov.in/",
        provider: "State",
        state: "Karnataka",
        tags: ["Idea", "MVP", "Tech", "KBN"],
        benefits: [
            "Grant up to ₹50 Lakhs.",
            "Incubation support.",
            "Mentorship from industry experts."
        ],
        documentsRequired: [
            "Karnataka Registration Proof",
            "Pitch Deck",
            "Project Budget",
            "Technical Proposal"
        ],
        applicationProcess: [
            "Wait for Call for Applications (usually annual).",
            "Submit application on Karnataka Startup Portal.",
            "Pitch to Jury.",
            "Selection and Disbursement."
        ],
        lastUpdated: "2024-09-01"
    },
    {
        id: "ts-1",
        name: "T-Idea / T-Seed (Telangana)",
        description: "Financial assistance for market entry, product testing, and scaling for Telangana-based startups.",
        amount: "Up to ₹10 Lakhs",
        type: "Grant",
        eligibility: "Registered in Telangana, DPIIT Recognition optional but preferred.",
        link: "https://startup.telangana.gov.in/",
        provider: "State",
        state: "Telangana",
        tags: ["Early Stage", "Market Entry"],
        benefits: [
            "Seed support for initial expenses.",
            "Access to T-Hub network.",
            "Marketing assistance."
        ],
        documentsRequired: [
            "TS Registration",
            "Proof of Office in Telangana",
            "Bank Statements"
        ],
        applicationProcess: [
            "Apply via T-Hub or State Portal.",
            "Screening by committee.",
            "Presentation.",
            "Approval."
        ],
        lastUpdated: "2024-08-15"
    },
    {
        id: "mh-1",
        name: "Maharashtra State Innovative Startup Policy",
        description: "Focuses on regulatory easing, IPR support, and quality testing reimbursements.",
        amount: "Varies (Reimbursement)",
        type: "Subsidy",
        eligibility: "DPIIT + Maharashtra Registered (MSINS).",
        link: "https://msins.in/",
        provider: "State",
        state: "Maharashtra",
        tags: ["IPR", "Reimbursement", "Testing"],
        benefits: [
            "100% Stamp Duty reimbursement.",
            "IPR filing cost reimbursement (up to ₹2L for domestic, ₹10L for intl).",
            "Quality testing assistance."
        ],
        documentsRequired: [
            "MSINS Registration Certificate",
            "Proof of expense (bills/invoices)",
            "DPIIT Certificate"
        ],
        applicationProcess: [
            "Register with MSINS.",
            "Incur expense.",
            "File for reimbursement with proofs.",
            "Verification and Payout."
        ],
        lastUpdated: "2024-11-01"
    }
];

export const FUNDING_PROGRAMS: FundingProgram[] = [
    {
        id: "thub",
        name: "T-Hub",
        description: "India's largest innovation ecosystem based in Hyderabad, providing mentorship and corporate connections.",
        type: "Incubator",
        location: "Hyderabad",
        focusArea: ["Tech", "Hardware", "Health"],
        link: "https://t-hub.co/"
    },
    {
        id: "nsrcel",
        name: "NSRCEL IIM Bangalore",
        description: "Incubator for profit and non-profit startups, offering deep mentoring.",
        type: "Incubator",
        location: "Bangalore",
        focusArea: ["Social Impact", "Women Entrepreneurs"],
        link: "https://nsrcel.org/"
    },
    {
        id: "yci",
        name: "Y Combinator",
        description: "World's most famous accelerator, active investor in Indian startups.",
        type: "Accelerator",
        location: "Global / Remote",
        focusArea: ["Tech", "SaaS", "Consumer"],
        link: "https://www.ycombinator.com/"
    },
    {
        id: "surge",
        name: "Sequoia Surge",
        description: "Rapid scale-up program for startups in India and SE Asia.",
        type: "Accelerator",
        location: "India / Singapore",
        focusArea: ["High Growth Tech"],
        link: "https://www.surgeahead.com/"
    }
];

export const FOUNDER_TOOLS: FounderTool[] = [
    {
        id: "pd-1",
        title: "Winning Pitch Deck Template",
        description: "Standard 12-slide investor deck structure.",
        category: "Pitching",
        downloadUrl: "#",
    },
    {
        id: "fm-1",
        title: "SaaS Financial Model",
        description: "Excel sheet with MRR, Churn, and CAC calculations.",
        category: "Finance",
        downloadUrl: "#",
    },
    {
        id: "ts-1",
        title: "Standard Term Sheet Guide",
        description: "Understand liquidation preference, anti-dilution, and vesting.",
        category: "Legal",
        downloadUrl: "#",
    },
    {
        id: "mk-1",
        title: "Market Sizing (TAM/SAM/SOM)",
        description: "Calculator to estimate your market potential.",
        category: "Product",
        downloadUrl: "#",
    }
];

export const COMPLIANCE_STEPS = [
    {
        title: "Company Incorporation",
        description: "Register as Pvt Ltd or LLP on MCA portal.",
        link: "https://www.mca.gov.in/",
        icon: Building
    },
    {
        title: "DPIIT Recognition",
        description: "Get 'Startup' status for tax benefits.",
        link: "https://www.startupindia.gov.in/",
        icon: FileText
    },
    {
        title: "GST Registration",
        description: "Mandatory if turnover > ₹20 Lakhs (₹40L for goods) or interstate trade.",
        link: "https://www.gst.gov.in/",
        icon: DollarSign
    }
];
