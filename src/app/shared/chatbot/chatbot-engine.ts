import { Bio, ExperienceItem, TechItem, EducationItem, CertificationItem } from '../../core/models';

export interface ChatContext {
  bio?: Bio;
  experience?: ExperienceItem[];
  tech?: TechItem;
  education?: EducationItem[];
  certifications?: CertificationItem[];
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  ts: number;
  cta?: { label: string; href: string; target?: string }[];
}

interface Intent {
  patterns: RegExp[];
  resolve: (ctx: ChatContext) => string | { text: string; cta?: ChatMessage['cta'] };
}

/**
 * Lightweight rule-based assistant. Matches user input against intents
 * and builds answers from the live portfolio data (no API calls).
 */
export class ChatbotEngine {

  private intents: Intent[] = [
    /* ===== Greetings ===== */
    {
      patterns: [/^(hi|hello|hey|yo|namaste|hola|hii+|hlo)\b/i, /good (morning|afternoon|evening)/i],
      resolve: () => "Hi there! 👋 I'm Sayan's AI assistant. Ask me about his experience, tech stack, projects, certifications, or how to get in touch."
    },
    {
      patterns: [/how are you|how's it going|sup\b/i],
      resolve: () => "Doing great, thanks! Ready to tell you about Sayan. What would you like to know?"
    },
    {
      patterns: [/thank(s| you)|thx|ty\b/i],
      resolve: () => "You're welcome! Anything else you'd like to know? 😊"
    },
    {
      patterns: [/^(bye|goodbye|see ya|cya|good night)\b/i],
      resolve: () => "Take care! Don't hesitate to reach out if you have more questions. 🚀"
    },

    /* ===== Identity ===== */
    {
      patterns: [/who (is|are) (he|sayan|you|him)|about (sayan|him|himself)|tell me about/i, /^bio$/i, /introduce/i],
      resolve: ctx => {
        if (!ctx.bio) return "Sayan is a Full Stack Developer with 6+ years of experience.";
        return ctx.bio.summary;
      }
    },
    {
      patterns: [/(your|his) name|who'?s this|what'?s (his|your) name/i],
      resolve: ctx => `${ctx.bio?.fullName?.replace(/Hi I'?m\s*/i, '') || 'Sayan Pramanick'} — ${ctx.bio?.title || 'Full Stack Developer'}.`
    },

    /* ===== Experience ===== */
    {
      patterns: [/years? of experience|how (long|many years)|experience/i],
      resolve: ctx => {
        const lines = (ctx.experience || []).map(e => `• ${e.role} at ${e.company} (${e.duration})`).join('\n');
        return `Sayan has 6+ years of professional experience:\n\n${lines}\n\nAsk me about any specific company for more detail.`;
      }
    },
    {
      patterns: [/deloitte|caterpillar|mercedes|momas|google.*mosaic|mosaic/i],
      resolve: ctx => {
        const e = ctx.experience?.find(x => /deloitte/i.test(x.company));
        if (!e) return "He's currently a Consultant at Deloitte (Feb 2024 – Present).";
        return `**${e.role} at ${e.company}** (${e.duration})\n\n` + e.highlights.map(h => `• ${h}`).join('\n');
      }
    },
    {
      patterns: [/ltimindtree|ltim|p\s*&?\s*g|p&g/i],
      resolve: ctx => {
        const e = ctx.experience?.find(x => /ltimindtree/i.test(x.company));
        if (!e) return "He worked as a Senior Software Engineer at LTIMindtree.";
        return `**${e.role} at ${e.company}** (${e.duration})\n\n` + e.highlights.map(h => `• ${h}`).join('\n');
      }
    },
    {
      patterns: [/trinity|motorola/i],
      resolve: ctx => {
        const e = ctx.experience?.find(x => /trinity/i.test(x.company));
        if (!e) return "He worked at Trinity Mobility on the Motorola CAD project.";
        return `**${e.role} at ${e.company}** (${e.duration})\n\n` + e.highlights.map(h => `• ${h}`).join('\n');
      }
    },
    {
      patterns: [/keabis|first job|started/i],
      resolve: ctx => {
        const e = ctx.experience?.find(x => /keabis/i.test(x.company));
        if (!e) return "He started his career at Keabis Tech.";
        return `**${e.role} at ${e.company}** (${e.duration})\n\n` + e.highlights.map(h => `• ${h}`).join('\n');
      }
    },
    {
      patterns: [/current(ly)? (work|company|role)|where.*work|present (job|role|company)/i],
      resolve: ctx => {
        const current = ctx.experience?.[0];
        if (!current) return "Currently at Deloitte as a Consultant.";
        return `Currently working as **${current.role} at ${current.company}** (${current.duration}).`;
      }
    },

    /* ===== Skills / Tech ===== */
    {
      patterns: [/skill|tech (stack|nology|nologies)|stack|technolog|languages?|frameworks?/i],
      resolve: ctx => {
        if (!ctx.tech) return "Strong in .NET 8, Angular, Azure, SQL, and microservices.";
        const cats = Object.entries(ctx.tech).map(
          ([k, v]) => `**${k}**: ${(v as string[]).join(', ')}`
        );
        return cats.join('\n\n');
      }
    },
    {
      patterns: [/\.net|dotnet|c#/i],
      resolve: ctx => {
        const list = ctx.tech?.Backend?.filter(t => /(\.net|c#|asp\.net|entity)/i.test(t)) || [];
        return `Sayan's .NET stack: ${list.join(', ') || 'C#, .NET 8, ASP.NET Core, EF Core'}. He's been building .NET applications professionally for 6+ years.`;
      }
    },
    {
      patterns: [/angular|frontend|ui|typescript/i],
      resolve: ctx => {
        const list = ctx.tech?.Frontend || [];
        return `Frontend toolkit: ${list.join(', ') || 'Angular, TypeScript, RxJS, NgRx'}.`;
      }
    },
    {
      patterns: [/azure|cloud|aws|gcp|kubernetes|docker|aks/i],
      resolve: ctx => {
        const list = ctx.tech?.Cloud || [];
        return `Cloud & DevOps: ${list.join(', ') || 'Azure, Docker, Kubernetes (AKS), Azure DevOps'}.`;
      }
    },
    {
      patterns: [/sql|database|db|cosmos|mongo/i],
      resolve: ctx => {
        const list = ctx.tech?.Database || [];
        return `Database experience: ${list.join(', ') || 'SQL Server, Azure SQL, Cosmos DB, MongoDB'}.`;
      }
    },

    /* ===== Education ===== */
    {
      patterns: [/education|study|college|university|school|degree|b\.?tech|graduate/i],
      resolve: ctx => {
        const lines = (ctx.education || []).map(e => `• ${e.degree} in ${e.stream} — ${e.institute} (${e.year})`).join('\n');
        return lines || 'B.Tech in Computer Science from Guru Nanak Institute of Technology, Kolkata (2018).';
      }
    },

    /* ===== Certifications ===== */
    {
      patterns: [/certif|certification|az-?900|ai-?900|aws|gcp|cloud (cert|practitioner)/i],
      resolve: ctx => {
        const items = (ctx.certifications || []).map(c => `• ${c.name} (${c.code}) — ${c.issuer}`);
        const text = items.length ? items.join('\n') : 'AZ-900, AI-900, GCP ACE, AWS CLF-C02.';
        return `Sayan holds the following certifications:\n\n${text}\n\nClick any badge in the Certifications section to verify.`;
      }
    },

    /* ===== Contact ===== */
    {
      patterns: [/contact|email|reach|hire|connect|linked\s*in|github/i],
      resolve: ctx => ({
        text: `📬 You can reach Sayan at:\n\n• Email: ${ctx.bio?.email || 'sayanpra07@gmail.com'}\n• Phone: ${ctx.bio?.phone || '+91-8617334125'}\n• Location: ${ctx.bio?.location || 'Ranaghat, West Bengal'}`,
        cta: [
          { label: '✉ Open Contact Form', href: '#contact' },
          { label: '🔗 LinkedIn', href: 'https://linkedin.com/in/sayanpramanick07', target: '_blank' },
        ]
      })
    },
    {
      patterns: [/phone|number|call|whatsapp/i],
      resolve: ctx => `You can call him at ${ctx.bio?.phone || '+91-8617334125'}.`
    },
    {
      patterns: [/where (is|do) (he|you) (live|located|from)|location|city|country/i],
      resolve: ctx => `Based in ${ctx.bio?.location || 'Ranaghat, West Bengal, India'} — open to relocation.`
    },
    {
      patterns: [/relocate|relocation|open to|available/i],
      resolve: () => "Yes, he's open to relocation and currently available for new opportunities. ✨"
    },

    /* ===== Resume ===== */
    {
      patterns: [/resume|cv|download/i],
      resolve: () => ({
        text: "Here's Sayan's latest resume — feel free to download and share it.",
        cta: [{ label: '📄 Download Resume (PDF)', href: '/resume/Resume_Sayan Pramanick.pdf', target: '_blank' }]
      })
    },

    /* ===== Projects ===== */
    {
      patterns: [/project|portfolio|build|made|created/i],
      resolve: () => "Highlight projects:\n\n• **Caterpillar Metaverse** at Deloitte — .NET 8 + Angular enterprise apps\n• **Mercedes MOMAS** — legacy ASP.NET MVC → .NET 8 modernization (30%+ faster APIs)\n• **Google Mosaic** — 20+ feature ships, 50+ defects resolved\n• **P&G Trade Promotion** at LTIMindtree — Python FastAPI + .NET integration\n• **Motorola CAD** at Trinity — Azure Service Bus + Data Factory pipelines"
    },

    /* ===== Capabilities ===== */
    {
      patterns: [/what can (you|i) (ask|do)|help|menu|options/i],
      resolve: () => "Here's what I can help with:\n\n💼 Experience & companies\n🛠 Tech stack & skills\n🎓 Education\n🏆 Certifications\n📬 Contact details\n📄 Resume download\n🚀 Projects\n\nJust ask in plain English!"
    },
  ];

  /** Public entry point */
  reply(input: string, ctx: ChatContext): { text: string; cta?: ChatMessage['cta'] } {
    const trimmed = (input || '').trim();
    if (!trimmed) {
      return { text: "Ask me anything about Sayan — his experience, skills, certifications, or how to contact him." };
    }

    for (const intent of this.intents) {
      if (intent.patterns.some(p => p.test(trimmed))) {
        const out = intent.resolve(ctx);
        return typeof out === 'string' ? { text: out } : out;
      }
    }

    return {
      text: "I'm not sure I caught that, but here are a few things you can ask me:\n\n• \"Tell me about Sayan\"\n• \"What's his tech stack?\"\n• \"Where does he work?\"\n• \"Show me his certifications\"\n• \"How do I contact him?\""
    };
  }

  /** Quick suggestion chips for the welcome screen */
  suggestions(): string[] {
    return [
      'Tell me about Sayan',
      'What technologies does he use?',
      'Show his experience',
      'Certifications?',
      'How to contact?',
    ];
  }
}
