export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(username)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

export const validateRoomName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100
}

export const validateMessageContent = (content: string): boolean => {
  return content.length > 0 && content.length <= 500
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>/g, '')
}
