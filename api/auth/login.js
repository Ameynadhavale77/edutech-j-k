import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Simple in-memory storage for demo (replace with your database)
const users = new Map();

// MongoDB User Schema (if using MongoDB)
let User = null;
if (process.env.MONGODB_URI) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true },
      firstName: String,
      lastName: String,
      profileImageUrl: String,
      isVerified: { type: Boolean, default: false },
    }, { timestamps: true });
    
    User = mongoose.models.User || mongoose.model('User', userSchema);
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory storage');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: '***' });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = null;

    if (User && mongoose.connection.readyState === 1) {
      // MongoDB flow
      user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookie
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`);

      res.json({ 
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          isVerified: user.isVerified
        }, 
        message: 'Login successful' 
      });
    } else {
      // Fallback in-memory storage
      user = users.get(email.toLowerCase());
      console.log('Found user in memory:', !!user);
      console.log('User keys in memory:', Array.from(users.keys()));
      
      if (!user) {
        // Create user on first login (in-memory storage doesn't persist)
        const hashedPassword = await bcrypt.hash(password, 12);
        user = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName: 'Dev',
          lastName: 'User',
          profileImageUrl: '',
          isVerified: false,
          createdAt: new Date(),
        };
        users.set(email.toLowerCase(), user);
        console.log('Created new user for login');
      }

      // Check password
      console.log('Comparing passwords...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isValidPassword);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookie
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`);

      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          isVerified: user.isVerified
        }, 
        message: 'Login successful' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}