export const VOICE_CONFIG = {
  AUDIO_SAMPLE_RATE: 48000,
  AUDIO_CHANNELS: 1,
  AUDIO_FRAMES_PER_BUFFER: 960,
  OPUS_BITRATE: 128000,
  MAX_AUDIO_LEVEL: 32767,
  VAD_THRESHOLD: 0.3, // Voice Activity Detection
  AUDIO_TIMEOUT: 5000, // ms
}

export const ROOM_CONFIG = {
  MAX_CAPACITY: 100,
  MIN_CAPACITY: 2,
  DEFAULT_CAPACITY: 12,
  ROOM_INACTIVITY_TIMEOUT: 3600000, // 1 hour
  MESSAGE_HISTORY_LIMIT: 50,
}

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',

  // Room events
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATE: 'room:update',
  ROOM_LIST: 'room:list',
  ROOM_DELETE: 'room:delete',
  ROOM_LOCK: 'room:lock',

  // User/Member events
  USER_JOIN: 'user:join',
  USER_LEAVE: 'user:leave',
  USER_UPDATE: 'user:update',
  MEMBER_LIST: 'member:list',
  MEMBER_MUTE: 'member:mute',
  MEMBER_DEAFEN: 'member:deafen',
  MEMBER_KICK: 'member:kick',

  // Voice events
  VOICE_STATE: 'voice:state',
  VOICE_STREAM: 'voice:stream',
  VOICE_LEVEL: 'voice:level',
  VOICE_END: 'voice:end',

  // Chat events
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_DELETE: 'message:delete',
  EMOJI_REACTION: 'emoji:reaction',

  // WebRTC signaling
  OFFER: 'webrtc:offer',
  ANSWER: 'webrtc:answer',
  ICE_CANDIDATE: 'webrtc:ice-candidate',

  // Errors
  ERROR: 'error',
  WARNING: 'warning',
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
}
