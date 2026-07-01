const { Inquiry, Setting, Event, Article, Feedback } = require('../models');


// Standard local response database for AI-Solutions
// Standard local response database for AI-Solutions
const getLocalBotResponse = (message = '') => {
  const query = message.toLowerCase().trim();

  // 1. Small talk - How are you / status check
  if (query.includes('how are you') || query.includes('how is it going') || query.includes('how do you do') || query.includes('how\'s it going') || query.includes('are you ok')) {
    return "I'm doing fantastic, thank you! Active and fully primed to assist you with database audits, UI prototypes, or custom workflow designs. How are you doing today?";
  }

  // 2. Small talk - Thank you
  if (query.includes('thank you') || query.includes('thanks') || query.includes('appreciate') || query.includes('grateful')) {
    return "You're very welcome! I'm always glad to help. Let me know if you have any other questions about AI-Solutions or computer systems engineering!";
  }

  // 3. Small talk - Location / Location details
  if (query.includes('location') || query.includes('located') || query.includes('where are you') || query.includes('address')) {
    return "AI-Solutions is based in Sunderland, United Kingdom. We deploy enterprise digital workplace applications and remote agent services globally.";
  }

  // 4. Custom queries for developer Subekchha Sah
  if (query.includes('subekchha') || query.includes('creator') || query.includes('owner') || query.includes('made') || query.includes('sah') || query.includes('developer')) {
    return "Subekchha Sah is the Lead Systems Engineer and Developer of AI-Solutions. She designed and built this entire computer engineering platform, integrating Next.js, Express, and PostgreSQL/SQLite with interactive AI widgets and high-contrast admin dashboard interfaces.";
  }

  // 5. Tech stack
  if (query.includes('stack') || query.includes('tech') || query.includes('language') || query.includes('framework')) {
    return "Our technical architecture is built on Next.js 14 (App Router) for the frontend, Node.js + Express.js for the backend API, and Sequelize ORM managing PostgreSQL with local SQLite automatic fallbacks.";
  }

  // 6. Database
  if (query.includes('database') || query.includes('postgres') || query.includes('sqlite') || query.includes('db')) {
    return "We utilize PostgreSQL for production environments and an automated SQLite fallback database. The system automatically shifts database writes to SQLite if the PostgreSQL connection is interrupted, ensuring 100% uptime.";
  }

  // 7. Greeting
  if (query.match(/\b(hi|hello|hey|greetings|howdy|good morning|good afternoon|good evening)\b/)) {
    return "Hello! I am your AI-Solutions virtual assistant. How can I help you explore our AI solutions, prototyping services, or corporate insights today?";
  }

  // Company Information / About
  if (query.includes('about') || query.includes('who are you') || query.includes('company') || query.includes('mission') || query.includes('vision') || query.includes('expansion')) {
    return "AI-Solutions is a premium Computer Systems Engineering firm. Our mission is to redefine the digital employee experience (DEX) and drive enterprise productivity using cutting-edge AI. We are currently expanding globally to serve enterprise partners across North America, Europe, and Asia.";
  }

  // AI Virtual Assistant
  if (query.includes('assistant') || query.includes('chatbot') || query.includes('chat widget') || query.includes('agent')) {
    return "Our 'AI Virtual Assistant' is a conversational AI agent designed for customer support and internal workflows. It integrates with your databases, learns from company documentation, and responds instantly to inquiries (similar to me!). Would you like to request a demo via our Contact form?";
  }

  // AI-Powered Prototyping
  if (query.includes('prototype') || query.includes('prototyping') || query.includes('figma') || query.includes('mvp') || query.includes('mockup')) {
    return "Our 'AI-Powered Prototyping' service accelerates software design by converting UI wireframes and Figma designs into fully working React/Next.js code. It reduces front-end design-to-code cycles by up to 70%.";
  }

  // Business Automation
  if (query.includes('automation') || query.includes('workflow') || query.includes('rpa') || query.includes('optimize') || query.includes('efficiency')) {
    return "Through 'Business Automation', we build intelligent agents and bots to automate repetitive enterprise tasks. We handle document parsing, automated reporting, scheduling, and database syncing to lower operational costs.";
  }

  // Digital Workplace
  if (query.includes('workplace') || query.includes('dex') || query.includes('employee') || query.includes('internal')) {
    return "Our 'Digital Workplace Solutions' focus on upgrading the internal employee experience. We build intelligent search tools, interactive onboarding pipelines, and automated portals that make sharing and accessing information instant.";
  }

  // Projects / Portfolio
  if (query.includes('project') || query.includes('portfolio') || query.includes('case study') || query.includes('success story') || query.includes('work')) {
    return "We have successfully delivered projects across diverse industries. Notable ones include: 1) 'SmartLogistics AI' (24/7 automated routing), 2) 'FinSecure Prototyping' (a secure fintech mobile mockup), and 3) 'RetailFlow AI' (automated retail inventory tracking).";
  }

  // Articles / Insights
  if (query.includes('article') || query.includes('blog') || query.includes('insight') || query.includes('news')) {
    return "We regularly publish insights on our Articles page! Check out our recent trending articles: 'The Future of AI Assistants in DEX', 'Transforming Figma to Code with AI', and 'Enterprise Automation Trends in 2026'.";
  }

  // Events / Promotions
  if (query.includes('event') || query.includes('webinar') || query.includes('promotion') || query.includes('hackathon') || query.includes('register')) {
    return "We hold regular events! Our next highlight is the 'Next-Gen Enterprise Automation Webinar' on June 24, 2026. Registration is open on the Events section of our website.";
  }

  // Contact / Inquiry
  if (query.includes('contact') || query.includes('hire') || query.includes('quote') || query.includes('price') || query.includes('sales') || query.includes('email') || query.includes('phone') || query.includes('form')) {
    return "You can get in touch with us by completing the interactive 'Contact Us' form at the bottom of the page. Once you submit, our system will automatically categorize your inquiry, issue a tracking reference, and a representative will follow up within 24 hours!";
  }

  // Admin / Dashboard
  if (query.includes('admin') || query.includes('dashboard') || query.includes('login') || query.includes('signup')) {
    return "Admins can log in or sign up via the Admin portal using the navigation menu. The secure dashboard displays real-time inquiry metrics, service demand trends, and detailed inquiry management options.";
  }

  // Generative fallbacks for arbitrary topics!
  // Find interesting words in the message (excluding small stop words)
  const stopWords = new Set(['what', 'is', 'a', 'the', 'an', 'about', 'how', 'to', 'do', 'you', 'your', 'i', 'can', 'explain', 'tell', 'me', 'please', 'we', 'are', 'in', 'on', 'at', 'for', 'of', 'with', 'any', 'some', 'why']);
  const words = query.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w && !stopWords.has(w));
  
  if (words.length > 0) {
    const topic = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return `That is a great question about ${topic}! While I am currently operating in offline mode without a live Gemini API key, AI-Solutions can help build custom computer systems and automation layers around ${topic}. For specialized integrations, please submit an inquiry on our Contact Us form!`;
  }

  // Standard fallback
  return "That is an interesting question! AI-Solutions specializes in Virtual Assistants, Fast UI Prototyping, and Business Automation. To discuss how we can tailor these systems to your organization's computer systems engineering needs, please submit an inquiry via our 'Contact Us' form, and we'll get right back to you.";
};

// Main Chat Route Handler
exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Check if the user is querying a tracking reference
    const refRegex = /(AI-\d{8}-\d{4}|AI-MOCK-\d+)/i;
    const match = message.match(refRegex);
    if (match) {
      const trackingReference = match[0].toUpperCase();
      try {
        const inquiry = await Inquiry.findOne({ where: { trackingReference } });
        if (inquiry) {
          const formattedDate = new Date(inquiry.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          const reply = `I found inquiry reference ${trackingReference} in our database:\n` +
            `- **Client Name**: ${inquiry.fullName}\n` +
            `- **Company**: ${inquiry.companyName}\n` +
            `- **Service Category**: ${inquiry.category}\n` +
            `- **Submitted On**: ${formattedDate}\n` +
            `- **Current Status**: **${inquiry.status}**\n\n` +
            (inquiry.status === 'New' 
              ? 'Our systems team has successfully categorized this request, and a representative will follow up with you within 24 hours.'
              : inquiry.status === 'In Progress' 
              ? 'An engineer is currently reviewing the specifications and drafting a design mockup.'
              : inquiry.status === 'Processed'
              ? 'Your inquiry has been processed. Please check your inbox for our follow-up email/proposal.'
              : 'This inquiry is marked as resolved/closed.');
          return res.status(200).json({ reply });
        } else {
          // If a tracking reference was specified but not found in backend DB
          if (trackingReference.startsWith('AI-MOCK-')) {
            const reply = `I detected inquiry reference **${trackingReference}**, which appears to be a local mock tracking reference. Since I am in offline sandbox fallback mode, I can confirm this mock reference was simulated successfully, but it is not stored in the database. Please try submitting a new inquiry to generate a live database entry!`;
            return res.status(200).json({ reply });
          }
          const reply = `I detected inquiry reference **${trackingReference}**, but I could not find it in our active database records. Please double-check the reference format (AI-YYYYMMDD-XXXX) and try again.`;
          return res.status(200).json({ reply });
        }
      } catch (dbErr) {
        console.error('Failed to query inquiry by tracking reference:', dbErr);
      }
    }

    // Attempt Gemini or OpenAI if API keys exist
    let openaiKey = req.headers['x-openai-key'] || process.env.OPENAI_API_KEY;
    let geminiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;

    try {
      if (!geminiKey) {
        const geminiSetting = await Setting.findOne({ where: { key: 'GEMINI_API_KEY' } });
        if (geminiSetting && geminiSetting.value) {
          geminiKey = geminiSetting.value;
        }
      }
      if (!openaiKey) {
        const openaiSetting = await Setting.findOne({ where: { key: 'OPENAI_API_KEY' } });
        if (openaiSetting && openaiSetting.value) {
          openaiKey = openaiSetting.value;
        }
      }
    } catch (settingErr) {
      console.warn('Could not read API keys from Settings table:', settingErr.message);
    }

    // Build dynamic context prompt using database records (Events, Articles, Feedback)
    let dbContext = '';
    try {
      const events = await Event.findAll({ limit: 4 });
      const articles = await Article.findAll({ limit: 4 });
      const feedback = await Feedback.findAll({ limit: 4 });

      dbContext = `\nHere are some actual details from our company database that you can refer to:\n\n` +
        `### Current Events:\n` +
        (events.length > 0 
          ? events.map(e => `- **${e.title}** scheduled on **${e.date}**: ${e.description} (Registration info: ${e.registrationInfo})`).join('\n')
          : `- No scheduled events at the moment.`) +
        `\n\n### Featured Articles:\n` +
        (articles.length > 0
          ? articles.map(a => `- **"${a.title}"** by ${a.author} (Category: ${a.category}): ${a.description}`).join('\n')
          : `- No articles published yet.`) +
        `\n\n### Client Testimonials:\n` +
        (feedback.length > 0
          ? feedback.map(f => `- **${f.name}** from **${f.company}** (Rated: ${f.rating}/5): "${f.comment}"`).join('\n')
          : `- No testimonials available yet.`);
    } catch (contextErr) {
      console.warn('Failed to construct dynamic db context:', contextErr.message);
    }

    const systemPrompt = `You are a premium AI Virtual Assistant representing "AI-Solutions", a premier Computer Systems Engineering firm specializing in:
- AI Virtual Assistants (conversational AI, database-integrated chatbots)
- AI-Powered Prototyping (Figma UI design layout conversion to React/Next.js code, saving 70% time)
- Business Automation (RPA processes, automated reporting, database syncing)
- Digital Workplace Solutions (employee experience, search tools, internal portals)

Creator/Owner Info: Subekchha Sah is the Lead Systems Engineer and Developer who built this entire Next.js, Express, and PostgreSQL/SQLite platform.

We are based in Sunderland, UK, deploying enterprise digital workplace tools and remote agents globally.

${dbContext}

Answer the following customer query professionally, concisely, with premium helpfulness, and in the context of our services.
If the customer asks about events, articles, or testimonials, refer to the actual data provided above.
If the query requires pricing, customized quotes, or software development, guide them to click "📝 Submit Inquiry" or complete the Contact Us form at the bottom of the page.
Respond using clean, readable Markdown format (bullet points, bold text, headers where appropriate).

Customer question: "${message}"
Assistant:`;

    if (geminiKey) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContent(systemPrompt);
        const reply = result.response.text();
        return res.status(200).json({ reply });
      } catch (geminiErr) {
        console.error('Gemini API call failed, falling back to OpenAI or local engine:', geminiErr.message);
      }
    }

    // OpenAI API (alternative)
    if (openaiKey) {
      try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey: openaiKey });
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI virtual assistant representing the company AI-Solutions, a computer systems engineering company specializing in virtual assistants, UI prototyping, and business automation. Be helpful and professional.'
            },
            { role: 'user', content: systemPrompt }
          ]
        });
        const reply = response.choices[0].message.content;
        return res.status(200).json({ reply });
      } catch (openaiErr) {
        console.error('OpenAI API call failed, falling back to local engine:', openaiErr.message);
      }
    }

    // Default: local high-quality mock agent
    const localReply = getLocalBotResponse(message);
    res.status(200).json({ reply: localReply });

  } catch (error) {
    console.error('Chat handle error:', error);
    res.status(500).json({ error: 'Server error handling chat' });
  }
};
