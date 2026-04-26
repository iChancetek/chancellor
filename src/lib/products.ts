import { LayoutGrid, Users, Code2, Megaphone, Headphones, Bot, Building2 } from 'lucide-react';

export const PRODUCT_DATA: Record<string, any> = {
  work: {
    title: 'Work Management',
    subtitle: 'A centralized nervous system for all team operations.',
    description: 'ChancellorOS Work Management is the foundational layer of the intelligent workspace. It eliminates silos by providing a single, high-fidelity source of truth for every project, task, and milestone. By combining advanced visualization with neural automation, it allows leadership to see the big picture while enabling contributors to focus on deep work without administrative friction.',
    color: '#0073ea',
    icon: LayoutGrid,
    features: [
      'Visual Project Orchestration: Leverage multi-dimensional views including interactive Gantt charts, high-density Timelines, and dynamic Kanban boards to visualize project lifecycles from inception to delivery. Every view is real-time, ensuring that as one task moves, the entire project schedule adjusts intelligently.',
      'Neural Status Automation: Stop chasing updates. Our AI-driven engine monitors progress signals across the platform and automatically updates task statuses, triggers dependencies, and sends proactive reminders to stakeholders. It ensures that the momentum of your work is never stalled by manual data entry.',
      'Bespoke Workflow Architecture: Build the exact workflow your industry demands. From complex construction sequences to high-frequency content production, our drag-and-drop builder allows you to define custom logic, transition rules, and required data fields for every stage of your process.',
      'Intelligent Resource Allocation: Maintain peak efficiency with live workload balancing. Visualize team capacity in real-time to prevent burnout and identify bottlenecks before they impact your timeline. The system automatically suggests optimal task assignments based on current availability and past performance metrics.',
      'Interconnected Board Ecosystem: Connect related projects across different departments. Data changes in a marketing board can automatically trigger updates in a product roadmap or a sales pipeline, ensuring that the entire organization moves in perfect synchronization.',
      'Strategic Insight Dashboards: Transform raw data into executive-level intelligence. Build custom dashboards with real-time widgets for budget tracking, cycle time analysis, and team productivity, providing the clarity needed for rapid, data-driven decision making.',
      'Collaborative Document Canvas: Integrated docs that live alongside your projects. Real-time co-editing, version history, and the ability to embed live board widgets directly into your project briefs and meeting notes.',
      'Advanced Dependency Mapping: Complex "Finish-to-Start", "Start-to-Start", and "Finish-to-Finish" dependency logic with automated lag-time calculations and critical path visualization.',
      'Workload Heatmaps: High-level visual representation of team bandwidth across multiple workspaces, allowing for effortless resource re-balancing during peak cycles.',
      'Automated Data Collection: Custom forms that translate directly into board items, with intelligent field mapping and automated response triggers.'
    ],
    deepOptions: [
      'Custom Formula Engine: Create complex calculated columns using our Excel-like formula syntax for advanced data manipulation.',
      'Mirrored Column Sync: Real-time bi-directional data mirroring between boards with advanced permission inheritance.',
      'Conditional Formatting Logic: Apply visual rules to your data based on complex multi-criteria triggers.',
      'Automated Board Templates: Scripted board creation with pre-configured automations and dashboard widgets.',
      'Workload Capacity Mapping: Detailed sub-item level resource tracking for granular task management.',
      'Enterprise Search API: Programmatic access to the cross-board search engine for external integrations.',
      'RBAC Column Permissions: Granular control over who can view or edit specific data columns within a board.',
      'Bespoke Status Labels: Unlimited custom status options with color-coding and transition-lock security.',
      'Historical Data Snapshots: Daily backups of board states with point-in-time restoration capabilities.',
      'Pivot Table Engine: Advanced data aggregation and cross-tabulation for complex reporting within dashboards.'
    ]
  },
  erp: {
    title: 'ChancellorOS ERP',
    subtitle: 'Unified enterprise resource planning and fiscal intelligence.',
    description: 'The ChancellorOS ERP module is the ultimate platform for modern business governance. It integrates core financials, supply chain operations, and human capital management into a unified neural network. Designed for global scale, it provides real-time visibility into the movement of capital and resources, allowing for agile responses to market shifts and operational challenges.',
    color: '#00c875',
    icon: Building2,
    features: [
      'Precision Financial Governance: Manage your general ledger, accounts payable, and receivable with absolute accuracy. The system provides real-time expense tracking and automated bank reconciliation, ensuring your financial position is always transparent and audit-ready.',
      'Global Supply Chain Optimization: Gain total visibility over your inventory and logistics. Our dynamic system tracks raw materials to finished goods across multiple warehouses, utilizing AI to predict demand spikes and optimize reorder points to minimize carrying costs.',
      'Autonomous HCM & Payroll: Revolutionize your human capital management with integrated time-tracking, benefits administration, and automated payroll processing. The system handles complex tax calculations and compliance requirements across multiple jurisdictions automatically.',
      'Real-Time Compliance Engine: Stay ahead of regulatory requirements with automated reporting and internal controls. The engine continuously monitors transactions for anomalies and generates comprehensive audit trails for SOX, GDPR, and other global standards.',
      'Neural Cash Flow Forecasting: Utilize Chancellor AI to predict your future financial state. By analyzing historical trends and current market data, the system generates high-probability cash flow models that help you plan investments and manage liquidity with confidence.',
      'Strategic Procurement Portal: Streamline vendor relationships with an automated procurement workflow. From initial RFQ to final payment, the portal manages vendor evaluations, contract terms, and purchase orders, ensuring you always get the best value for your spend.',
      'Asset Lifecycle Management: Track tangible and intangible assets from acquisition to disposal. Automated depreciation scheduling, maintenance alerts, and valuation tracking integrated directly into the general ledger.',
      'Multicurrency Treasury Management: Real-time FX exposure monitoring with automated hedging suggestions and centralized liquidity management for global operations.',
      'Project-Level Profitability: Granular cost tracking that links every project hour and material expense to real-time P&L statements, allowing for precise margin analysis.',
      'Intercompany Reconciliation: Automated elimination entries and balance matching for multi-entity corporate structures, drastically reducing month-end closing cycles.'
    ],
    deepOptions: [
      'Multi-Entity Consolidation: Automated currency conversion and elimination entries for global corporate structures.',
      'LIFO/FIFO Inventory Valuation: Switch between accounting methods with historical recalculation capabilities.',
      'Automated Tax Nexus Tracking: Real-time monitoring of nexus thresholds across thousands of tax jurisdictions.',
      'Electronic Data Interchange (EDI): Native support for EDI 810/850/856 protocols for seamless partner communication.',
      'Project-Based Accounting: Deep integration between task execution and financial ledger for real-time profitability.',
      'Predictive Churn Ledger: AI-driven revenue risk assessment integrated directly into your financial forecasts.',
      'Revenue Recognition Engine: Support for ASC 606 / IFRS 15 standards with automated contract-based revenue scheduling.',
      'Bespoke Chart of Accounts: Flexible, multi-segment ledger structure that adapts to any organizational hierarchy.',
      'Automated Expense Auditing: AI-driven scanning of receipts and invoices with anomaly detection for policy compliance.',
      'Vendor Risk Assessment: Continuous monitoring of vendor financial health and compliance status via external data feeds.'
    ]
  },
  crm: {
    title: 'ChancellorOS CRM',
    subtitle: 'AI-native lead engagement and pipeline maximization.',
    description: 'ChancellorOS CRM redefines the relationship between technology and sales. It is a proactive growth engine that uses multimodal intelligence to identify opportunities, nurture leads, and provide sales professionals with a "superpower" for closing deals. It removes the guesswork from sales by providing deep behavioral insights and automated task orchestration.',
    color: '#ffcb00',
    icon: Users,
    features: [
      '360-Degree Client Intelligence: Go beyond basic contact info. Our CRM aggregates data from across the web, social media, and internal communications to provide a complete view of every prospect and client, including their pain points, interests, and decision-making history.',
      'Predictive Lead Scoring: Focus your energy where it matters. Our AI analyzes hundreds of data points—from email open rates to website visits—to score leads in real-time, highlighting the "hot" opportunities that are most likely to convert into revenue.',
      'Intelligent Outreach Automation: Never let a lead go cold. Create complex multi-channel sequences across email, LinkedIn, and SMS that adapt based on recipient behavior. If a prospect clicks a specific link, the sequence can automatically pivot to a more relevant conversation.',
      'Visual Pipeline Acceleration: Track every deal with a high-fidelity pipeline view. Identify stalled opportunities and get AI-driven recommendations on the "next best action" to move the deal toward closing, including relevant case studies or discount triggers.',
      'Multimodal Mobile CRM: Access your entire sales suite from the field. Use voice-to-text to record meeting notes that are instantly transcribed and analyzed for action items, and use the camera to scan business cards or documents directly into the system.',
      'Revenue Performance Analytics: Gain deep insight into your sales velocity and win rates. Our advanced reporting allows you to drill down into individual performance, territory health, and product-specific trends to identify growth levers and coaching opportunities.',
      'Email & Calendar Synchronization: Native integration with Gmail and Outlook. Automatically log emails to contacts, sync meetings, and view prospect history without leaving your inbox.',
      'Bespoke Sales Playbooks: Define standardized sales motions for different deal types. Provide reps with real-time guidance, talk tracks, and required documents at every stage of the funnel.',
      'Automated Task Orchestration: The CRM automatically creates tasks for follow-ups, contract renewals, and quarterly business reviews, ensuring no revenue opportunity falls through the cracks.',
      'Account-Based Marketing (ABM) Suite: Target high-value accounts with precision. Coordinate sales and marketing efforts with unified account scoring and personalized content triggers.'
    ],
    deepOptions: [
      'Dynamic Territory Routing: Automated lead assignment based on complex geographic and account-based logic.',
      'Email Sentiment Analysis: AI-driven tone detection for incoming prospect communications to guide agent responses.',
      'CPQ Integration: Integrated Configure, Price, Quote tools with automated discount approval workflows.',
      'Sales Sequence Branching: Highly complex "If-This-Then-That" logic for automated sales engagement.',
      'Customer Health Scorecard: Predictive risk modeling for existing accounts integrated into the CRM view.',
      'Zero-Touch Data Entry: Autonomous CRM updates from calendar invites, email threads, and phone transcripts.',
      'Duplicate Prevention Engine: Real-time scanning for matching contact and company records to maintain database hygiene.',
      'Sales Forecasting Models: Advanced probability-based revenue predictions with historical accuracy tracking.',
      'Custom Activity Mapping: Define unique engagement types (e.g., Demo, Trial, Onboarding) with specific metadata requirements.',
      'LinkedIn Sales Navigator Sync: Bi-directional data flow for prospect insights and InMail activity tracking.'
    ]
  },
  dev: {
    title: 'Dev & R&D',
    subtitle: 'Agile innovation and automated deployment orchestration.',
    description: 'The ChancellorOS Dev module is built to close the gap between code and commerce. It provides R&D teams with a high-performance environment for managing sprints, backlogs, and code quality while ensuring full alignment with product roadmaps and business objectives. It is the bridge between technical execution and strategic vision.',
    color: '#ff3d57',
    icon: Code2,
    features: [
      'High-Velocity Sprint Planning: Manage your agile lifecycle with precision. Our tools for backlog grooming, story pointing, and sprint capacity planning ensure that your team is always working on the highest-impact features with realistic timelines.',
      'Unified Release Orchestration: Manage the entire deployment pipeline within the Work OS. Track features from "In Progress" to "Production" with automated status updates triggered by Git commits and successful CI/CD builds.',
      'Deep Ecosystem Integration: Connect directly to your technical stack. Real-time bi-directional sync with GitHub, GitLab, and Bitbucket means that issue statuses, pull requests, and code reviews are always visible in your project boards.',
      'Agile Quality Metrics: Monitor the health of your development process with live Burndown, Velocity, and Cumulative Flow diagrams. Identify bottlenecks in your "Definition of Done" and optimize your cycle times with data-driven insights.',
      'AI-Powered Code Governance: Leverage Chancellor AI to monitor repository health. The system can flag high-risk code changes, identify duplicate efforts across teams, and suggest optimizations for technical debt management.',
      'Technical Roadmap Visualization: Align your architecture with your business goals. Build high-level roadmaps that connect individual technical tasks to major product milestones, providing stakeholders with a clear view of the R&D journey.',
      'Automated Sprint Retrospectives: Data-driven synthesis of sprint performance, identifying key patterns in developer velocity and common impediments.',
      'Security Vulnerability Mapping: Integrated security feed that links repository vulnerabilities directly to remediation tasks in your dev boards.',
      'Developer Experience (DevEx) Analytics: Monitor the friction in your dev process with metrics on PR cycle time, build success rates, and local environment setup efficiency.',
      'Cross-Team Dependency Board: A specialized view for managing complex technical dependencies between different engineering squads and microservices.'
    ],
    deepOptions: [
      'Semantic Code Search: Cross-repository AI search to find components, patterns, and logic across your entire codebase.',
      'Automated Documentation Sync: Keep your project documentation updated automatically based on code changes and PR descriptions.',
      'Feature Flag Coordination: Integrated management of feature toggles directly from your sprint boards.',
      'Incident Response Engine: Automated ticket creation and team paging triggered by production monitoring alerts.',
      'Technical Debt Ledger: Quantitative tracking of code complexity and its impact on development velocity.',
      'Sprint Anomaly Detection: AI-driven warnings for potential sprint failures based on real-time commit activity.',
      'Repo Health Scorecard: Predictive analysis of code quality and maintainability trends across all managed repositories.',
      'Automated Changelog Generation: Scripted creation of user-facing release notes based on completed work items and PR history.',
      'CI/CD Pipeline Visualization: Live monitoring of build and deployment statuses directly within the project board view.',
      'Resource-Aware Planning: Integrated tracking of technical compute costs and infrastructure requirements for R&D initiatives.'
    ]
  },
  marketing: {
    title: 'Marketing',
    subtitle: 'Creative campaign management and multi-channel impact.',
    description: 'ChancellorOS Marketing is a collaborative powerhouse for creative and growth teams. It centralizes campaign planning, asset management, and performance data into a single visual hub. By eliminating the friction between ideation and execution, it allows marketing teams to move faster and deliver consistent brand experiences across every touchpoint.',
    color: '#a25ddc',
    icon: Megaphone,
    features: [
      'Omnichannel Content Calendar: Plan and visualize your entire marketing strategy in one place. Manage social posts, blog content, email newsletters, and ad campaigns across a unified timeline that ensures consistent messaging and perfect timing.',
      'Real-Time ROI Performance: Connect your campaign boards directly to performance data. See real-time metrics for clicks, conversions, and spend alongside your creative tasks, allowing for rapid optimization of live campaigns.',
      'Creative Request Workflows: Standardize how work enters the marketing department. Custom request forms automatically route tasks to the right specialists with all the necessary assets and briefs, eliminating back-and-forth communication.',
      'Neural Asset Management: Organize your brand identity with an intelligent asset library. Use Chancellor AI to automatically tag images and videos with relevant keywords and ensure that only the latest, approved versions are used by the team.',
      'Collaborative Campaign Canvas: Brainstorm and ideate in real-time. Our integrated whiteboarding tools allow creative teams to sketch out campaign concepts, wireframe landing pages, and build mood boards that translate directly into actionable tasks.',
      'Executive Marketing Dashboards: Prove the impact of your marketing efforts. Build high-level reports for stakeholders that showcase brand awareness, lead generation, and customer acquisition costs across all active channels.',
      'Automated Social Publishing: Schedule and publish directly to LinkedIn, Instagram, and X from your content board with built-in approval loops.',
      'Dynamic Brand Guidelines: Centralized digital style guide that updates across all templates and assets automatically, ensuring 100% brand consistency.',
      'Event & Webinar Management: Specialized workflow for planning large-scale activations, including registration tracking, speaker coordination, and post-event nurture.',
      'AI-Powered Copy Optimization: Leverage Chancellor AI to generate and test headlines, ad copy, and email subject lines for maximum engagement.'
    ],
    deepOptions: [
      'Automated A/B Test Sync: Track experiment results directly on your creative boards with automated performance updates.',
      'Creative Version Control: Deep history and visual comparison tools for marketing assets and campaign copy.',
      'Dynamic Budget Pacing: Automated monitoring of ad spend versus project goals with AI alerts for over/under pacing.',
      'Influencer Relation Portal: Specialized workflow for managing external creative partners and brand ambassadors.',
      'Social Sentiment Heatmap: Visual representation of brand perception integrated directly into your campaign planners.',
      'Market Trend Extraction: AI-driven synthesis of industry news and competitor activity to guide creative strategy.',
      'Digital Asset Proofing: Integrated commenting and annotation directly on images and video files for rapid creative feedback.',
      'Campaign Attribution Models: Advanced tracking that links marketing touchpoints directly to CRM revenue outcomes.',
      'Bespoke Landing Page Builder: Drag-and-drop builder for high-converting campaign pages with automated data flow into boards.',
      'Marketing Velocity Analytics: Track the speed of creative production and campaign rollout to optimize internal resources.'
    ]
  },
  support: {
    title: 'Support',
    subtitle: 'Intelligent customer success and automated resolution.',
    description: 'ChancellorOS Support transforms traditional help desks into proactive customer success centers. By utilizing multimodal AI to triage tickets, suggest solutions, and monitor sentiment, it allows your support team to provide high-touch service at scale. It ensures that every customer interaction is data-informed and resolution-focused.',
    color: '#579bfc',
    icon: Headphones,
    features: [
      'Intelligent Ticket Triage: Automatically categorize and prioritize incoming requests based on content, sentiment, and customer value. Chancellor AI ensures that critical issues reach the right specialist instantly, significantly reducing response times.',
      'Proactive Knowledge Ecosystem: Build a self-sustaining knowledge base. As agents resolve tickets, the system suggests new articles or updates, creating an intelligent self-service portal that allows customers to find answers without opening a ticket.',
      'Neural Sentiment Monitoring: Understand the "voice of the customer" in real-time. Our AI analyzes the tone and language of every interaction, flagging potential escalations before they happen and providing agents with the context needed to de-escalate effectively.',
      'Automated Resolution Pathing: Speed up common requests with intelligent macros and automated workflows. For standard queries like password resets or billing updates, the system can guide customers through the resolution process autonomously.',
      'Omnichannel Support Hub: Manage interactions across email, live chat, phone, and social media from a single, unified interface. Agents never have to switch windows to provide a consistent, personalized experience for every customer.',
      'CSAT & Loyalty Analytics: Measure the health of your customer base with automated CSAT and NPS surveys. Deep analytics help you identify recurring issues, track agent performance, and discover opportunities for product improvement.',
      'Agent Assistance Copilot: Real-time AI suggestions for ticket responses, relevant documentation, and past similar resolutions to empower support staff.',
      'Proactive Churn Alerts: AI-driven identification of accounts with declining support engagement or increasing negative sentiment.',
      'Unified Customer Profile: A holistic view of the customer’s entire journey, including their ERP billing status and CRM sales history, directly in the support view.',
      'Service Level Agreement (SLA) Tracker: Real-time monitoring of response and resolution targets with automated escalation paths for high-priority accounts.'
    ],
    deepOptions: [
      'Auto-Triage Neural Network: Proprietary NLP models trained on your specific support history for ultra-accurate routing.',
      'SLA Escalation Prediction: AI warnings for tickets at risk of breaching SLAs before the breach occurs.',
      'Agent Burnout Detection: Real-time monitoring of agent workload and sentiment to optimize team well-being.',
      'Multilingual AI Translation: Real-time translation for support tickets allowing agents to support global users instantly.',
      'Customer Value Weighting: Priority routing based on account tier and historical lifetime value metrics.',
      'Support-to-Dev Loop: Automated bug ticket creation in the Dev module directly from customer support interactions.',
      'Recursive Solution Engine: AI that identifies patterns in closed tickets to suggest structural product improvements to leadership.',
      'External Knowledge Sync: Bi-directional synchronization with external documentation platforms like Zendesk or Confluence.',
      'Custom Support Widgets: Embed support performance data directly into enterprise dashboards for organization-wide transparency.',
      'Ticket Volume Forecasting: AI-driven predictions of future support load to guide staffing and resource decisions.'
    ]
  },
  ai: {
    title: 'Chancellor AI',
    subtitle: 'The multimodal intelligence layer of the modern enterprise.',
    description: 'Chancellor AI is the neural backbone of the entire Work OS. It is a multimodal powerhouse that sees, hears, and speaks to your data. It doesn’t just wait for commands; it actively observes your workflows to identify inefficiencies, predict risks, and provide the deep reasoning needed to solve complex business problems.',
    color: '#6161FF',
    icon: Bot,
    features: [
      'Predictive Workflow Intelligence: Go beyond reporting to forecasting. Our AI models analyze millions of data points across your organization to predict project delays, budget overruns, and resource gaps weeks before they manifest.',
      'Multimodal Data Extraction: Transform unstructured data into actionable items. Upload a photo of a whiteboard, a PDF contract, or a voice recording, and Chancellor AI will instantly extract tasks, deadlines, and key terms into your project boards.',
      'Natural language board querying: Talk to your workspace. Use simple conversational language to ask complex questions like "Which projects are at risk because of current engineering bottlenecks?" and receive instant, visualized answers.',
      'Autonomous Process Optimization: Eliminate waste automatically. The AI observes your repetitive manual tasks and suggests (or builds) automations to handle them, allowing your team to focus entirely on high-value creative work.',
      'Cognitive Document Synthesis: Summarize thousands of pages of documentation in seconds. Whether it’s legal contracts, technical manuals, or project specs, the AI provides concise, accurate summaries and answers specific questions about the content.',
      'Enterprise Governance & Ethics: Deploy AI with confidence. Chancellor AI includes built-in safeguards for data privacy, bias mitigation, and human-in-the-loop approvals, ensuring that every AI action is transparent, explainable, and secure.',
      'Generative Action Agents: Deploy specialized agents that can perform multi-step organizational tasks, from scheduling meetings to generating complex financial reports.',
      'Neural Workspace Discovery: AI that proactively surfaces relevant boards, documents, and contacts based on your current project focus and historical activity.',
      'Real-Time Multilingual Translation: Instant translation of all workspace content, enabling seamless collaboration for global, distributed teams.',
      'Executive Strategy Synthesis: High-level AI summaries of organizational health, market position, and operational risks tailored for C-suite decision-makers.'
    ],
    deepOptions: [
      'Custom Model Fine-Tuning: Train the Chancellor AI on your specific organizational terminology and document styles.',
      'Cross-Module Reasoner: AI capability to correlate data between ERP, CRM, and Dev modules for holistic insights.',
      'Voice Command API: Full programmatic control of the workspace via advanced voice intent recognition.',
      'Autonomous Agent Swarms: Deploy multiple specialized AI agents to solve complex, multi-step organizational tasks.',
      'Vector Data persistence: High-performance vector storage for long-term organizational memory and retrieval.',
      'Governance Approval Logic: Granular human-in-the-loop controls for AI-driven budget and resource decisions.',
      'Private Cloud AI Deployment: Options for hosting the Chancellor AI core within your own secure private cloud infrastructure.',
      'Advanced Anomaly Detection: Continuous monitoring of organizational data patterns for security threats or operational failures.',
      'Bespoke AI Skill Library: Build and deploy custom AI "skills" that extend the core capabilities of your autonomous agents.',
      'Neural Data lineage: Transparent tracking of how the AI arrived at specific conclusions or data extractions for auditability.'
    ]
  }
};
