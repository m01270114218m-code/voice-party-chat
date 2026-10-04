export type Room = { id: string; name: string; topic: string; live: boolean; members: number; color: string };
export type Participant = { id: string; name: string; color: string };
export type ChatMessage = { id: string; user: string; text: string; mine?: boolean };

export const featuredRooms: Room[] = [
  { id: 'room-1', name: 'Gaming Lounge', topic: 'PUBG Squad', live: true, members: 12, color: '#7c3aed' },
  { id: 'room-2', name: 'Late Night Chat', topic: 'Open Mic', live: true, members: 8, color: '#ec4899' },
];

export const participantList: Participant[] = [
  { id: 'p1', name: 'Max', color: '#7c3aed' },
  { id: 'p2', name: 'Sara', color: '#ec4899' },
  { id: 'p3', name: 'Omar', color: '#06b6d4' },
  { id: 'p4', name: 'Lina', color: '#22c55e' },
];

export const messages: ChatMessage[] = [
  { id: 'm1', user: 'Max', text: 'جاهزين؟' },
  { id: 'm2', user: 'Sara', text: 'أيوه، يلا!' },
  { id: 'm3', user: 'Omar', text: 'دخلت الغرفة.', mine: true },
];
