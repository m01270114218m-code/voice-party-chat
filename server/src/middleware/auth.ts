import jwt from 'jsonwebtoken'

export interface JWTPayload {
  userId: string
  email: string
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'secret'
    return jwt.verify(token, secret) as JWTPayload
  } catch (error) {
    return null
  }
}

export const generateToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET || 'secret'
  const expiresIn = process.env.JWT_EXPIRY || '7d'
  return jwt.sign({ userId, email }, secret, { expiresIn })
}

export const socketAuthMiddleware = (socket: any, next: any) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Authentication error'))
  }

  const payload = verifyToken(token)
  if (!payload) {
    return next(new Error('Invalid token'))
  }

  socket.userId = payload.userId
  socket.email = payload.email
  next()
}
