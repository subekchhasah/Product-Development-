const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Admin Model
const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Category Model (Inquiry categories)
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Inquiry Model
const Inquiry = sequelize.define('Inquiry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobDetails: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General Inquiry'
  },
  trackingReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'New' // New, Processed, In Progress, Closed
  }
});

// Feedback Model (Testimonials)
const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Event Model
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING, // e.g. "June 24, 2026" or DATE
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  registrationInfo: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Article Model
const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Setting Model for dynamic key-value storage
const Setting = sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = {
  Admin,
  Inquiry,
  Category,
  Feedback,
  Event,
  Article,
  Setting
};

