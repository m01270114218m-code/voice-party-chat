import { PrismaClient, Room, RoomMember, User } from '@prisma/client'
import { ROOM_CONFIG } from '../config/constants.ts'
import { sanitizeInput, validateRoomName } from '../utils/validators.ts'

const prisma = new PrismaClient()

export interface CreateRoomInput {
  name: string
  description?: string
  topic?: string
  category?: string
  ownerId: string
  capacity?: number
  isPrivate?: boolean
}

export interface RoomDTO {
  id: string
  name: string
  topic: string
  category: string
  memberCount: number
  capacity: number
  isLive: boolean
  owner: { id: string; username: string; avatar: string }
}

export class RoomService {
  async createRoom(input: CreateRoomInput): Promise<Room> {
    if (!validateRoomName(input.name)) {
      throw new Error('Invalid room name')
    }

    const room = await prisma.room.create({
      data: {
        name: sanitizeInput(input.name),
        description: input.description ? sanitizeInput(input.description) : null,
        topic: input.topic ? sanitizeInput(input.topic) : null,
        category: input.category || 'general',
        ownerid: input.ownerId,
        capacity: input.capacity || ROOM_CONFIG.DEFAULT_CAPACITY,
        isPrivate: input.isPrivate || false,
      },
    })

    return room
  }

  async joinRoom(roomId: string, userId: string): Promise<RoomMember> {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { members: true },
    })

    if (!room) throw new Error('Room not found')
    if (room.members.length >= room.capacity) throw new Error('Room is full')

    const existing = await prisma.roomMember.findUnique({
      where: { userId_roomId: { userId, roomId } },
    })

    if (existing) return existing

    const member = await prisma.roomMember.create({
      data: {
        userId,
        roomId,
        role: 'listener',
      },
    })

    return member
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    await prisma.roomMember.deleteMany({
      where: { userId, roomId },
    })
  }

  async getRoomMembers(roomId: string) {
    return await prisma.roomMember.findMany({
      where: { roomId },
      include: { user: { select: { id: true, username: true, avatar: true } } },
    })
  }

  async getRoomList(): Promise<RoomDTO[]> {
    const rooms = await prisma.room.findMany({
      include: {
        members: true,
        owner: { select: { id: true, username: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      topic: room.topic || '',
      category: room.category,
      memberCount: room.members.length,
      capacity: room.capacity,
      isLive: room.members.length > 0,
      owner: room.owner,
    }))
  }

  async muteUser(roomId: string, userId: string, muted: boolean): Promise<void> {
    await prisma.roomMember.update({
      where: { userId_roomId: { userId, roomId } },
      data: { muted },
    })
  }

  async kickUser(roomId: string, userId: string): Promise<void> {
    await prisma.roomMember.deleteMany({
      where: { userId, roomId },
    })
  }
}

export const roomService = new RoomService()
