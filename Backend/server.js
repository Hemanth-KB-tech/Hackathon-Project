const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to JSON file
const USERS_FILE = path.join(__dirname, 'caresync_users.json');

// Ensure JSON file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  console.log('📁 Created caresync_users.json file');
}

// Helper functions to read/write JSON file
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('✅ Users saved to caresync_users.json');
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
};

// SIGNUP ENDPOINT - Saves to JSON file
app.post('/api/signup', (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    console.log('📝 Signup attempt:', { username, email, role });

    // Read existing users from JSON file
    const users = readUsersFromFile();

    // Check if user already exists
    const userExists = users.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
    
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username already exists' 
      });
    }

    const emailExists = users.find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (emailExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password, // In production, hash this!
      role: role,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Add to users array
    users.push(newUser);

    // SAVE TO JSON FILE
    const writeSuccess = writeUsersToFile(users);
    
    if (!writeSuccess) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save user data' 
      });
    }

    console.log('✅ New user saved to JSON file:', newUser.username);

    res.status(201).json({
      success: true,
      message: 'User created and saved to JSON file',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// LOGIN ENDPOINT
// In server.js - enhanced login endpoint
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('🔐 Login attempt:', { username, password });

    const users = readUsersFromFile();
    console.log('📋 Available users:', users.map(u => u.username));

    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      console.log('❌ Login failed: Invalid credentials');
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    writeUsersToFile(users);

    console.log('✅ Login successful:', username);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// GET ALL USERS ENDPOINT (for verification)
app.get('/api/users', (req, res) => {
  try {
    const users = readUsersFromFile();
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    usersFile: USERS_FILE
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 User data will be saved to: ${USERS_FILE}`);
});
