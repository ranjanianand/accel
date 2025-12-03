import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'migration-accelerator-secret-key-2024'

// Hardcoded credentials with bcrypt hashed passwords
// Password for 'admin@aixvenus.com' is 'Aixv@2024!Secure'
// Password for 'demo@aixvenus.com' is 'Demo@2024!Pass'
const USERS = [
  {
    id: '1',
    username: 'admin@aixvenus.com',
    name: 'Admin User',
    email: 'admin@aixvenus.com',
    // Password: Aixv@2024!Secure
    passwordHash: '$2b$10$55xHaW3aEAz7POehxx/GfuaoWmkWchrFGOLVbOypyR7.C6Jd8HyYa',
  },
  {
    id: '2',
    username: 'demo@aixvenus.com',
    name: 'Demo User',
    email: 'demo@aixvenus.com',
    // Password: Demo@2024!Pass
    passwordHash: '$2b$10$yAmcR1UD/ce/6YL62/0heuhvawtdI6f8ILjgLX7s4Crmvn6OI1ENi',
  },
]

export interface User {
  id: string
  username: string
  name: string
  email: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

/**
 * Verify username and password against hardcoded credentials
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    // Find user by username
    const user = USERS.find((u) => u.username === username)

    if (!user) {
      return {
        success: false,
        error: 'Invalid username or password',
      }
    }

    // Verify password using bcrypt
    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid username or password',
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: '7d', // Token expires in 7 days
      }
    )

    // Return user without password hash
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
      token,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Authentication failed',
    }
  }
}

/**
 * Verify JWT token and return user data
 */
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Get current user from cookies (server-side)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return null
    }

    return verifyToken(token.value)
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Set authentication cookie (server-side)
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

/**
 * Clear authentication cookie (server-side)
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

/**
 * Hash password with bcrypt (utility for generating hashes)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}
