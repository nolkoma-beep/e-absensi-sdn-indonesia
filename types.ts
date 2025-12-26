
export enum AttendanceType {
  DATANG = 'DATANG',
  PULANG = 'PULANG',
  IJIN = 'IJIN',
  SAKIT = 'SAKIT'
}

export interface User {
  id: string;
  username: string;
  name: string;
  nip: string;
  jabatan: string;
  photo: string;
}

export interface AttendanceLocation {
  latitude: number;
  longitude: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userNip: string;
  type: AttendanceType;
  timestamp: Date;
  note?: string;
  location?: AttendanceLocation;
  photoData?: string;
}

export interface AppState {
  user: User | null;
  history: AttendanceRecord[];
}
