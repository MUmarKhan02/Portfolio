// All site copy lives here. **double asterisks** render as bold.
// To add a project, add an object to the right group below; nothing else needs touching.

export const site = {
  name: 'Muhammad Umar Khan',
  shortName: 'Umar Khan',
  location: 'Windsor, ON',
  availability: 'Open to Canada, USA, Remote',
  year: 2026,
};

export const urls = {
  github: 'https://github.com/MUmarKhan02',
  linkedin: 'https://www.linkedin.com/in/m-umarkhan/',
  resumeAI: '/static/pdfs/Resume_AI_ML_Umar.pdf',
  resumeSWE: '/static/pdfs/Resume_SWE_Umar.pdf',
};

// Email is assembled in the browser on click so the address never sits in the page markup.
export const emailParts = { user: 'm.umark2002', domain: 'gmail.com' };

export const heroWords = ['AI', 'ML', 'Software', 'Backend'];

export const hero = {
  ariaLabel: 'AI, ML, software and backend engineer',
  intro:
    'I build software that uses AI well, from RAG pipelines and model experiments to the APIs and deployments that bring them to real users.',
  second:
    'With an MS in Computer Science from Wayne State University, I enjoy working across the stack and digging into difficult problems. I’ll chase a bug for hours if that’s what it takes to make something work.',
  sweNote: 'Applying for software engineering roles?',
};

export const navLinks = [
  { id: 'ai-ml', label: 'AI/ML' },
  { id: 'swe', label: 'SWE' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const src = (href) => ({ label: 'Source code', href, external: true });
const demo = (href) => ({ label: 'Demo video', href, external: true });
const live = (href) => ({ label: 'Live demo', href, external: true });
const report = (href) => ({ label: 'Final report', href, external: false });

export const aiml = {
  title: 'AI/ML Projects',
  lede: 'Research in transfer learning, clustering, and forecasting, plus local LLM systems and RAG pipelines.',
  groups: [
    {
      title: 'Research and coursework',
      note: 'Honours, group, and course projects',
      projects: [
        {
          title: 'K-Means Market Basket Analysis',
          where: 'K-Means + Apriori pipeline ~10x faster than Apriori alone (7 hours to 45 minutes)',
          desc: 'Two-person honours research project on speeding up association rule mining with a **K-Means pre-filter** that clusters items on revenue and co-purchased revenue and drops the lowest-value cluster before Apriori runs. Built **Apriori from scratch in Java** (candidate generation, pruning, support counting) as the supporting algorithm that mines rules from the filtered data. Benchmarked the K-Means-filtered pipeline against Apriori on the full dataset and a published clustering method on 130K+ records, with comparable top-100 rule value.',
          chips: ['Java', 'K-Means', 'Apriori'],
          links: [
            src('https://github.com/MUmarKhan02/Market-Basket-Analysis-Machine-Learning'),
            report('/static/pdfs/Market_Basket_Analysis_Report.pdf'),
          ],
        },
        {
          title: 'Transfer Learning & Domain Generalization',
          where: 'Freezing half the backbone cost under 1 point (CIFAR-10) and cut training ~29%',
          desc: 'Group project (three people) on how layer freezing affects transfer learning. Ran **90 controlled fine-tuning experiments**: ResNet-50 and EfficientNet-B3 across CIFAR-10, CIFAR-100, and brain tumor MRI, 3 data sizes, and 5 freeze depths. Built the PyTorch pipeline and layer-freezing logic, and reached **95.9% on brain tumor MRI**.',
          chips: ['Python', 'PyTorch', 'ResNet-50', 'EfficientNet-B3'],
          links: [
            src('https://github.com/MUmarKhan02/transfer-learning-image-classification-root'),
            report('/static/pdfs/Transfer_Learning_Report.pdf'),
          ],
        },
        {
          title: 'Stock Market Analysis and Prediction',
          where: 'LSTM vs SVM on S&P 500: ~57% next-day accuracy, near the up-day baseline',
          desc: 'Compared **LSTM and SVM** models for S&P 500 closing-price regression and up/down classification on the CNNPred dataset. Engineered lag, return, moving-average, and volatility features, tuned the LSTM with grid search and the SVM across linear, polynomial, and RBF kernels, and evaluated with RMSE, MAE, R², accuracy, precision, recall, and confusion matrices.',
          note: 'Note: the final report lists 99.1% SVM accuracy. That run used same-day features, so it isn’t a true forecast. With that leak removed, next-day accuracy is about 56%.',
          chips: ['Python', 'TensorFlow/Keras', 'scikit-learn', 'LSTM', 'SVM', 'WEKA'],
          links: [
            src('https://github.com/MUmarKhan02/Stock-Market-Analysis-Prediction'),
            report('/static/pdfs/Stock_Market_Analysis_Prediction_Report.pdf'),
          ],
        },
      ],
    },
    {
      title: 'Applied AI',
      note: 'LLM systems and pipelines',
      projects: [
        {
          title: 'MindForge AI Suite (StudyAI + ResearchAI)',
          where: 'Fully local document analysis and research: 6 file formats, zero API cost',
          desc: 'Architected a **fully local LLM platform** using LLaMA 3.2 via Ollama, analyzing PDF, DOCX, PPT/PPTX, TXT, and Markdown documents with zero API cost. Engineered a **RAG pipeline** with TF-IDF retrieval over overlapping 400-word chunks, sending only the most relevant passages to the model to cut prompt context across multi-document research sessions. Parallelized summarization across **4 workers** (ThreadPoolExecutor) with real-time SSE streaming, plus integrated web retrieval and automated APA citation generation.',
          chips: ['Python', 'Flask', 'Ollama', 'LLaMA 3.2', 'RAG', 'TF-IDF', 'HTML'],
          links: [
            demo('https://www.youtube.com/watch?v=TWpiLtolqIg'),
            src('https://github.com/MUmarKhan02/MindForge'),
          ],
        },
      ],
    },
  ],
};

export const swe = {
  title: 'SWE Projects',
  lede: 'Full-stack applications and backend systems, plus small developer and job-search tools.',
  apps: {
    title: 'Full-stack applications',
    note: 'Built end to end, from API to frontend',
    projects: [
      {
        title: 'AutoOps AI',
        where: '3 file types, up to 20MB, 2 languages, 1 pipeline.',
        desc: 'Built a **polyglot AI document processing platform** with an ASP.NET Core REST API and a Python Gemini 2.5 Flash microservice, using EF Core and PostgreSQL. Designed a Redis/Celery pipeline processing PDFs, DOCX, and TXT through **4 asynchronous stages**, with real-time SSE progress and AI-generated summaries streamed to React.',
        chips: ['ASP.NET Core', 'React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
        links: [live('https://auto-ops-ai-mu.vercel.app/'), src('https://github.com/MUmarKhan02/AutoOps-AI')],
      },
      {
        title: 'Khan\'s Blog Platform',
        where: '4 AWS services. 2 CI/CD pipelines. 10+ REST endpoints',
        desc: 'Deployed a full-stack blog platform on **AWS** (Elastic Beanstalk, RDS PostgreSQL, S3, CloudFront), with API traffic routed through CloudFront for unified HTTPS. Built **JWT authentication with role-based access** (admins manage categories and tags, authors edit their own posts) across 10+ REST endpoints, plus a React frontend with search, filtering, and TipTap rich text editing sanitized with DOMPurify. Automated deployments with **2 GitHub Actions pipelines**, saving 15 minutes per release.',
        note: 'Note: the backend is paused for now, so the live site loads but its data features are offline.',
        chips: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'AWS', 'GitHub Actions'],
        links: [live('https://d3djg0s7uij4hb.cloudfront.net/'), src('https://github.com/MUmarKhan02/Blog-Platform')],
      },
      {
        title: 'AdaptIQ',
        where: 'AI resume tailoring with a built-in ATS scorer and 50% fewer API calls',
        desc: 'Full-stack **resume tailoring tool** built with React, FastAPI, and Gemini. A **single-pass LLM pipeline** extracts keywords and tailors the resume, then a **5-metric ATS scorer** with synonym-aware matching (REST API = RESTful, SQL = SQL Server) shows what’s covered and what’s still a skills gap. Also generates matching cover letters.',
        note: 'Runs locally. The demo video walks through the full flow.',
        chips: ['React', 'Python', 'FastAPI', 'JavaScript', 'Gemini API'],
        links: [demo('https://www.youtube.com/watch?v=3hyYeb9sAKI'), src('https://github.com/MUmarKhan02/AdaptIQ')],
      },
    ],
  },
  tools: {
    title: 'Tools and extensions',
    note: 'Small projects people can use',
    rows: [
      {
        title: 'Gmail Job Monitor',
        text: 'Local-only CLI that scans 5,000+ emails across 2 Gmail accounts and sorts job activity into 6 categories, using a 3-tier classifier (sender-domain overrides, subject signals, weighted keywords) that handles mixed-use domains like LinkedIn and Indeed. Includes a live inbox watcher.',
        meta: ['Python', 'SQLite', 'Gmail API', 'OAuth2', 'Typer', 'Rich'],
        links: [src('https://github.com/MUmarKhan02/Gmail-Job-Monitor')],
      },
      {
        title: 'SwiftFill',
        text: 'Chrome extension that fills out job applications in one click on Workday, Greenhouse, Lever, Ashby, and more, including signup and login forms. Matches fields with a large selector library, falls back to label text and DOM traversal on non-standard forms, and reports what it filled and skipped.',
        meta: ['JavaScript', 'Manifest V3', 'Chrome Storage API'],
        links: [src('https://github.com/MUmarKhan02/SwiftFill')],
      },
      {
        title: 'JobVanisher',
        text: 'Chrome extension that hides jobs you\'ve applied to or dismissed on Indeed, Glassdoor, ZipRecruiter, and other boards that can’t hide them natively. Applied and Dismiss buttons on every listing, counters that double as reveal toggles, and a MutationObserver that keeps up with infinite scroll.',
        meta: ['JavaScript', 'Manifest V3', 'chrome.storage.local', 'MutationObserver'],
        links: [src('https://github.com/MUmarKhan02/JobVanisher')],
      },
      {
        title: 'Deadcode (C#)',
        text: 'C# CLI that scans a file or project folder for dead code and flags or removes it across 9 detection passes. Auto-fixes are backed up, riskier findings are left as advisory, and a dry-run mode works in CI.',
        meta: ['C#', '.NET 10', 'no dependencies'],
        links: [src('https://github.com/MUmarKhan02/DeadCodeRemoval-C-')],
      },
    ],
  },
};

export const experience = {
  title: 'Experience',
  jobs: [
    {
      title: 'Research Assistant',
      org: 'University of Windsor, Windsor, ON, Canada',
      when: 'Apr 2023 – Nov 2024',
      where: 'Hands-on research in CNNs and GNNs for superpixel-based image classification',
      bullets: [
        'Built an **image segmentation prototype** in Python (NumPy, SciPy, scikit-learn) that partitions images into regions using centroid-based assignment and **K-Means color clustering** with Euclidean distance matrices, plus visualizations of regions and centroids.',
        'Studied and presented a published **CNN+GNN superpixel classification paper** (SLIC radius graphs, GAT, hybrid loss) and reviewed the authors’ open-source implementation.',
        'Implemented a **Keras CNN on MNIST** and a **2-layer GCN in PyTorch Geometric on Cora (~81% test accuracy)**, with t-SNE embedding visualizations; documented both in technical presentations.',
      ],
    },
    {
      title: 'Teaching Assistant',
      org: 'University of Windsor, Windsor, ON, Canada',
      when: 'Sep 2022 – Apr 2024',
      where: 'Lab leadership and student support across core CS courses.',
      bullets: [
        'Assisted **100+ students** through code reviews and debugging sessions across Data Structures, OOP, and Database Management Systems.',
        'Led weekly lab sessions for **30+ students** on Java, data structures, and algorithms, while grading **25+ weekly assignments and exams**.',
      ],
      courses: ['OOP with Java', 'Data Structures and Algorithms', 'Database Management Systems'],
    },
  ],
};

export const education = {
  title: 'Education',
  items: [
    {
      title: 'MS in Computer Science',
      org: 'Wayne State University, Detroit, MI, USA',
      when: 'Jan 2025 – Aug 2026',
      graduated: true,
      gpa: '3.93 / 4.0',
    },
    {
      title: 'BS Honours Computer Science with Software Engineering Specialization',
      org: 'University of Windsor, Windsor, ON, Canada',
      when: 'Sep 2020 – Apr 2024',
      graduated: true,
    },
  ],
};

// Order matters: it is the on-screen chip order, and the small-screen CSS reorders by position.
export const skills = {
  title: 'Skills',
  cards: [
    { cls: 'sk-ai', title: 'AI and ML', items: ['Deep Learning (CNN, GCN)', 'Image Segmentation', 'Computer Vision', 'Clustering (K-Means)', 'Feature Engineering', 'RAG', 'Prompt Engineering', 'Model Evaluation', 'TF-IDF'] },
    { cls: 'sk-plat', title: 'AI platforms', items: ['Ollama', 'Vertex AI (in progress)', 'LLaMA 3.2', 'Gemini API'] },
    { cls: 'sk-lib', title: 'ML libraries', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib'] },
    { cls: 'sk-lang', title: 'Languages', items: ['Python', 'Java', 'JavaScript/TypeScript', 'C#', 'SQL'] },
    { cls: 'sk-fw', title: 'Frameworks', items: ['FastAPI', 'Flask', 'Spring Boot', 'Spring Security', 'ASP.NET Core', 'Node.js', 'React', 'Tailwind CSS'] },
    { cls: 'sk-db', title: 'Databases', items: ['PostgreSQL', 'SQLite', 'Redis'] },
    { cls: 'sk-cloud', title: 'Cloud and DevOps', items: ['Docker', 'Git', 'AWS (Elastic Beanstalk, CloudFront, RDS, S3)', 'GitHub Actions', 'CI/CD'] },
    { cls: 'sk-tools', title: 'Tools and practices', items: ['REST APIs', 'JWT Authentication', 'JUnit', 'Celery'] },
  ],
};

export const contact = {
  title: 'Let’s Talk',
  statement: 'I’m always open to new opportunities.',
  lede: 'Pull up a chair, grab a coffee, and tell me what you’re building.',
};
