const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { sequelize, checkConnection } = require('./config/db');
const { Admin, Category, Feedback, Event, Article, Inquiry, Setting } = require('./models');

// Controllers
const authController = require('./controllers/authController');
const inquiryController = require('./controllers/inquiryController');
const chatController = require('./controllers/chatController');

// Middleware
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());

// --- Database Seeding Function ---
const seedDatabase = async () => {
  try {
    // 1. Seed Categories
    const categoriesCount = await Category.count();
    if (categoriesCount === 0) {
      await Category.bulkCreate([
        { name: 'Software Assistance', description: 'Assistance for software engineering, design, and integration queries.' },
        { name: 'AI Virtual Assistant Request', description: 'Inquiries regarding building custom conversational chatbot models.' },
        { name: 'Prototyping Request', description: 'Fast Figma design to react code and MVP software creation.' },
        { name: 'General Inquiry', description: 'Standard inquiries about AI-Solutions, partnerships, and careers.' }
      ]);
      console.log('Database seeded with standard inquiry Categories.');
    }

    // 2. Seed Admin User
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const defaultUser = process.env.ADMIN_DEFAULT_USER || 'admin';
      const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPass, salt);
      
      await Admin.create({
        username: defaultUser,
        password: hashedPassword
      });
      console.log(`Database seeded with default Admin: Username [${defaultUser}], Password [${defaultPass}].`);
    }

    // 3. Seed Feedback (Testimonials)
    const feedbackCount = await Feedback.count();
    if (feedbackCount === 0) {
      await Feedback.bulkCreate([
        {
          name: 'Sarah Jenkins',
          company: 'NextGen Retail Inc.',
          rating: 5,
          comment: 'AI-Solutions completely automated our inventory tracking. Their AI Virtual Assistant answers 85% of our front-line inquiries instantly! Highly recommend their systems.'
        },
        {
          name: 'Marcus Chen',
          company: 'FinSecure Tech',
          rating: 5,
          comment: 'The AI-Powered Prototyping service is a game changer. We turned our Figma screens into a fully functional demo code in just 4 days. Incredible developer velocity.'
        },
        {
          name: 'Elena Rostova',
          company: 'DEX Logistics',
          rating: 4,
          comment: 'Our employee experience scores skyrocketed after deploying the Digital Workplace Solutions designed by AI-Solutions. Workflow automations saved us hundreds of hours.'
        },
        {
          name: 'David Kojo',
          company: 'Global Health Network',
          rating: 5,
          comment: 'Outstanding support and premium engineering. The automated inquiry routing works flawlessly, sending custom software queries to the correct engineering branches immediately.'
        }
      ]);
      console.log('Database seeded with customer testimonials.');
    }

    // 4. Seed Events
    const eventsCount = await Event.count();
    if (eventsCount === 0) {
      await Event.bulkCreate([
        {
          title: 'Next-Gen Enterprise Automation Webinar',
          description: 'Explore how RPA (Robotic Process Automation) and LLMs are transforming modern back-office systems. Live coding demonstration of our virtual agents.',
          date: 'June 24, 2026',
          imageUrl: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=600&auto=format&fit=crop',
          registrationInfo: 'RSVP via the register button below. Registered attendees will receive a private Google Meet access link.'
        },
        {
          title: 'Figma-To-Code Innovation Workshop',
          description: 'A hands-on technical workshop showcasing how computer engineering teams are using AI to bypass manual UI coding. Designed for CTOs and Lead Developers.',
          date: 'July 15, 2026',
          imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
          registrationInfo: 'Limited seating. Please register before July 10th to secure a virtual developer sandbox environment.'
        },
        {
          title: 'Global AI Systems Summit 2026',
          description: 'AI-Solutions hosts our annual engineering conference, highlighting advancements in AI-DEX integration, semantic search, and secure multi-agent systems.',
          date: 'September 12, 2026',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
          registrationInfo: 'Early bird registration open. Keynote speaker announcements coming soon.'
        }
      ]);
      console.log('Database seeded with company events.');
    }

    // 5. Seed Articles
    const articlesCount = await Article.count();
    if (articlesCount === 0) {
      await Article.bulkCreate([
        {
          title: 'The Future of AI Assistants in DEX',
          description: 'How modern chatbots and internal digital employee assistants are boosting workplace satisfaction scores.',
          content: 'Digital Employee Experience (DEX) is rapidly becoming the focal point of computer system engineering teams. As applications proliferate, employees spend hours navigating disconnected interfaces. AI virtual assistants serve as a single natural language entry point, retrieving databases, initiating automations, and answering HR queries instantly. Research indicates that systems with deep assistant integrations see a 40% reduction in employee context switching...',
          author: 'Dr. Arthur Vance',
          category: 'Technology',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
          publishedAt: 'June 01, 2026'
        },
        {
          title: 'Transforming Figma to Code with AI',
          description: 'Behind the scenes of AI-powered prototyping pipelines that convert vector designs into production-ready React components.',
          content: 'The handoff from UI/UX design to developer execution has historically been a major bottleneck. By utilizing computer vision, layout detection libraries, and modern code LLMs, AI-Solutions Prototyping pipeline translates wireframes directly into optimized, CSS-styled frontend components. This shift empowers product teams to test live prototypes with actual database bindings in a fraction of the time, reshaping how software engineering sprints are structured...',
          author: 'Claire Sterling',
          category: 'Engineering',
          imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
          publishedAt: 'May 18, 2026'
        },
        {
          title: 'Enterprise Automation Trends in 2026',
          description: 'A study on security, scalability, and performance in multi-agent business automation pipelines.',
          content: 'Modern corporate automation has progressed beyond basic IF-THEN macros. Today, autonomous multi-agent pipelines interact with legacy REST endpoints, sanitize input logs, and apply semantic analysis to raw invoices. However, security remains the primary gatekeeper. Implementing strict JWT validations, utilizing sandboxed script runners, and mapping structured DB logs ensures that automating workflows does not introduce vulnerability to the enterprise system ecosystem...',
          author: 'Robert Sterling',
          category: 'Business',
          imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
          publishedAt: 'April 28, 2026'
        }
      ]);
      console.log('Database seeded with tech articles.');
    }

    // 6. Seed initial test inquiry if empty
    const inquiryCount = await Inquiry.count();
    if (inquiryCount === 0) {
      await Inquiry.create({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1 (555) 019-2834',
        companyName: 'ACME Corp',
        country: 'United States',
        jobTitle: 'Developer',
        jobDetails: 'Looking for a custom AI Virtual Assistant chatbot to integrate with our customer portal.',
        category: 'AI Virtual Assistant Request',
        trackingReference: 'AI-20260610-1001',
        status: 'New'
      });
      console.log('Database seeded with a test inquiry.');
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};

// --- REST Routes ---

// Admin Authentication Routes
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, authController.getMe);

// Public Form Submission
app.post('/api/inquiries', inquiryController.createInquiry);
app.get('/api/inquiries/track/:reference', inquiryController.trackInquiry);


// Protected Admin Inquiry Management Routes
app.get('/api/inquiries', authMiddleware, inquiryController.getInquiries);
app.get('/api/inquiries/:id', authMiddleware, inquiryController.getInquiryById);
app.put('/api/inquiries/:id/status', authMiddleware, inquiryController.updateInquiryStatus);
app.put('/api/inquiries/:id', authMiddleware, inquiryController.updateInquiry);
app.delete('/api/inquiries/:id', authMiddleware, inquiryController.deleteInquiry);

// Protected Dashboard Analytics
app.get('/api/analytics', authMiddleware, inquiryController.getAnalytics);

// Protected Settings Management Routes
app.get('/api/settings', authMiddleware, async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', authMiddleware, async (req, res) => {
  try {
    const { GEMINI_API_KEY, OPENAI_API_KEY } = req.body;
    
    if (GEMINI_API_KEY !== undefined) {
      await Setting.upsert({ key: 'GEMINI_API_KEY', value: GEMINI_API_KEY });
    }
    if (OPENAI_API_KEY !== undefined) {
      await Setting.upsert({ key: 'OPENAI_API_KEY', value: OPENAI_API_KEY });
    }
    
    res.json({ message: 'Settings saved successfully' });
  } catch (err) {
    console.error('Failed to save settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Chatbot endpoint (Publicly Accessible)
app.post('/api/chat', chatController.handleChat);

// Dynamic Content Feeds (from Database)
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['createdAt', 'DESC']] });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.findAll({ order: [['createdAt', 'DESC']] });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend API is running. Use the frontend at http://localhost:3000');
});

// App Startup & Database Sync
const startServer = async () => {
  try {
    console.log('Starting server initialization...');
    
    await checkConnection();
    console.log('Database connection established.');
    
    // Sync DB (force: false preserves data; alters structures dynamically)
    console.log('Syncing database schemas...');
    await sequelize.sync({ force: false, logging: false });
    console.log('Database schemas synced successfully.');
    
    // Seed initial information
    console.log('Seeding database...');
    await seedDatabase();
    console.log('Database seeding completed.');

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to sync database / launch server:', error);
    process.exit(1);
  }
};

console.log('Calling startServer...');
startServer();
