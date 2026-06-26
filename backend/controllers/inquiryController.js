const { Inquiry } = require('../models');
const { Op } = require('sequelize');

// Automatic categorization logic
const autoCategorize = (details = '', jobTitle = '') => {
  const text = `${details} ${jobTitle}`.toLowerCase();
  
  if (
    text.includes('chat') ||
    text.includes('bot') ||
    text.includes('virtual assistant') ||
    text.includes('assistant') ||
    text.includes('agent') ||
    text.includes('conversational')
  ) {
    return 'AI Virtual Assistant Request';
  }
  
  if (
    text.includes('prototype') ||
    text.includes('mvp') ||
    text.includes('figma') ||
    text.includes('wireframe') ||
    text.includes('mockup') ||
    text.includes('design') ||
    text.includes('ux') ||
    text.includes('ui')
  ) {
    return 'Prototyping Request';
  }
  
  if (
    text.includes('software') ||
    text.includes('development') ||
    text.includes('app') ||
    text.includes('website') ||
    text.includes('database') ||
    text.includes('backend') ||
    text.includes('frontend') ||
    text.includes('programming') ||
    text.includes('code') ||
    text.includes('system')
  ) {
    return 'Software Assistance';
  }
  
  return 'General Inquiry';
};

// Create a new inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { fullName, email, phone, companyName, country, jobTitle, jobDetails } = req.body;

    if (!fullName || !email || !phone || !companyName || !country || !jobTitle || !jobDetails) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Auto categorize
    const category = autoCategorize(jobDetails, jobTitle);

    // Create unique tracking reference (AI-YYYYMMDD-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingReference = `AI-${dateStr}-${randomSuffix}`;

    // Create Inquiry in database
    const inquiry = await Inquiry.create({
      fullName,
      email,
      phone,
      companyName,
      country,
      jobTitle,
      jobDetails,
      category,
      trackingReference,
      status: 'New'
    });

    // Mock Email Confirmation
    console.log(`\n==========================================`);
    console.log(`[EMAIL CONFIRMATION SIMULATOR] Sent to: ${email}`);
    console.log(`Subject: Inquiry Received - Reference: ${trackingReference}`);
    console.log(`Dear ${fullName},`);
    console.log(`Thank you for reaching out to AI-Solutions.`);
    console.log(`We have received your inquiry regarding "${jobTitle}".`);
    console.log(`Our team is reviewing it and has categorized your request as: ${category}.`);
    console.log(`You can track your inquiry using reference: ${trackingReference}`);
    console.log(`Best regards,`);
    console.log(`AI-Solutions Team`);
    console.log(`==========================================\n`);

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      trackingReference,
      category,
      inquiry
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Server error while submitting inquiry' });
  }
};

// Get all inquiries (with search, filter, and pagination) for Admin
exports.getInquiries = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    const whereClause = {};

    // Filter by category
    if (category && category !== 'All') {
      whereClause.category = category;
    }

    // Filter by status
    if (status && status !== 'All') {
      whereClause.status = status;
    }

    // Search query
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { companyName: { [Op.like]: `%${search}%` } },
        { trackingReference: { [Op.like]: `%${search}%` } },
        { jobTitle: { [Op.like]: `%${search}%` } }
      ];
    }

    const inquiries = await Inquiry.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ inquiries });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Server error fetching inquiries' });
  }
};

// Get single inquiry details
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.status(200).json({ inquiry });
  } catch (error) {
    console.error('Get inquiry details error:', error);
    res.status(500).json({ error: 'Server error fetching inquiry details' });
  }
};

// Update inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      message: 'Status updated successfully',
      inquiry
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Server error updating status' });
  }
};

// Get Dashboard Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const allInquiries = await Inquiry.findAll();

    // 1. Total inquiries count
    const total = allInquiries.length;

    // 2. New inquiries count
    const newCount = allInquiries.filter(i => i.status === 'New').length;

    // 3. Current month inquiries count
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyInquiries = allInquiries.filter(i => {
      const date = new Date(i.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    // 4. Inquiry Trends (Last 6 Months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendsMap = {};
    
    // Seed last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      trendsMap[label] = 0;
    }

    allInquiries.forEach(i => {
      const date = new Date(i.createdAt);
      const label = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      if (trendsMap[label] !== undefined) {
        trendsMap[label]++;
      }
    });

    const trends = Object.keys(trendsMap).map(key => ({
      month: key,
      count: trendsMap[key]
    }));

    // 5. Service Demand Analysis (Categorized count)
    const demandMap = {
      'AI Virtual Assistant Request': 0,
      'Prototyping Request': 0,
      'Software Assistance': 0,
      'General Inquiry': 0
    };

    allInquiries.forEach(i => {
      if (demandMap[i.category] !== undefined) {
        demandMap[i.category]++;
      } else {
        demandMap['General Inquiry']++;
      }
    });

    const demand = Object.keys(demandMap).map(key => ({
      name: key,
      value: demandMap[key]
    }));

    res.status(200).json({
      summary: {
        total,
        new: newCount,
        monthly: monthlyInquiries,
        completionRate: total > 0 ? Math.round(((total - newCount) / total) * 100) : 100
      },
      trends,
      demand
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Server error loading analytics' });
  }
};

// Update full inquiry details
exports.updateInquiry = async (req, res) => {
  try {
    const { fullName, email, phone, companyName, country, jobTitle, jobDetails, category } = req.body;
    
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (fullName !== undefined) inquiry.fullName = fullName;
    if (email !== undefined) inquiry.email = email;
    if (phone !== undefined) inquiry.phone = phone;
    if (companyName !== undefined) inquiry.companyName = companyName;
    if (country !== undefined) inquiry.country = country;
    if (jobTitle !== undefined) inquiry.jobTitle = jobTitle;
    if (jobDetails !== undefined) inquiry.jobDetails = jobDetails;
    if (category !== undefined) inquiry.category = category;

    await inquiry.save();

    res.status(200).json({
      message: 'Inquiry updated successfully',
      inquiry
    });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ error: 'Server error updating inquiry' });
  }
};

// Delete an inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    await inquiry.destroy();

    res.status(200).json({
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Server error deleting inquiry' });
  }
};

// Public inquiry tracking by reference
exports.trackInquiry = async (req, res) => {
  try {
    const { reference } = req.params;
    const inquiry = await Inquiry.findOne({ where: { trackingReference: reference } });
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry reference not found' });
    }
    res.status(200).json({
      fullName: inquiry.fullName,
      companyName: inquiry.companyName,
      category: inquiry.category,
      status: inquiry.status,
      createdAt: inquiry.createdAt
    });
  } catch (error) {
    console.error('Track inquiry error:', error);
    res.status(500).json({ error: 'Server error tracking inquiry' });
  }
};


