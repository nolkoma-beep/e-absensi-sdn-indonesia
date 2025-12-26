
import { User, AttendanceType, AttendanceRecord } from './types';

export const MOCK_USER: User = {
  id: '1',
  username: 'guru_hebat',
  name: 'Budi Santoso, S.Pd.',
  nip: '19850101 201012 1 001',
  jabatan: 'Guru Kelas IV-A',
  photo: 'https://picsum.photos/seed/teacher1/200/200'
};

export const INITIAL_HISTORY: AttendanceRecord[] = [
  {
    id: 'h1',
    userId: '1',
    userName: 'Budi Santoso, S.Pd.',
    // Added missing userNip property to satisfy AttendanceRecord interface
    userNip: '19850101 201012 1 001',
    type: AttendanceType.DATANG,
    timestamp: new Date(Date.now() - 3600000 * 4),
  },
  {
    id: 'h2',
    userId: '2',
    userName: 'Siti Aminah, M.Pd.',
    // Added missing userNip property to satisfy AttendanceRecord interface
    userNip: '19800000 000000 0 000',
    type: AttendanceType.DATANG,
    timestamp: new Date(Date.now() - 3600000 * 3.5),
  },
  {
    id: 'h3',
    userId: '3',
    userName: 'Andi Pratama, S.Si.',
    // Added missing userNip property to satisfy AttendanceRecord interface
    userNip: '19810000 000000 0 000',
    type: AttendanceType.IJIN,
    timestamp: new Date(Date.now() - 3600000 * 2),
    note: 'Urusan Keluarga'
  }
];
