import { VOICE_CONFIG } from '../config/constants.ts'

export interface VoiceFrame {
  userId: string
  data: Buffer
  timestamp: number
  level: number // 0-1
}

export class VoiceService {
  private audioBuffer: Map<string, VoiceFrame[]> = new Map()

  captureAudioFrame(userId: string, audioData: Buffer): VoiceFrame {
    const level = this.calculateAudioLevel(audioData)
    const frame: VoiceFrame = {
      userId,
      data: audioData,
      timestamp: Date.now(),
      level,
    }

    if (!this.audioBuffer.has(userId)) {
      this.audioBuffer.set(userId, [])
    }

    const buffer = this.audioBuffer.get(userId)!
    buffer.push(frame)

    // Keep only last 10 frames
    if (buffer.length > 10) {
      buffer.shift()
    }

    return frame
  }

  calculateAudioLevel(audioData: Buffer): number {
    let sum = 0
    for (let i = 0; i < audioData.length; i += 2) {
      const sample = audioData.readInt16LE(i) / VOICE_CONFIG.MAX_AUDIO_LEVEL
      sum += Math.abs(sample)
    }
    const rms = Math.sqrt(sum / (audioData.length / 2))
    return Math.min(1, rms)
  }

  isVoiceActive(level: number): boolean {
    return level > VOICE_CONFIG.VAD_THRESHOLD
  }

  getAudioBuffer(userId: string): VoiceFrame[] {
    return this.audioBuffer.get(userId) || []
  }

  clearAudioBuffer(userId: string): void {
    this.audioBuffer.delete(userId)
  }
}

export const voiceService = new VoiceService()
