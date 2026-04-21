export type UserRole = "admin" | "student" | "guest";

export interface UserProfile {
  name: string;
  role: UserRole;
  department?: string;
}

export interface Event {
  id: bigint;
  title: string;
  description: string;
  date: bigint; // Unix timestamp in nanoseconds
  location: string;
  capacity: bigint;
  registeredCount: bigint;
  waitlistedCount: bigint;
  category: string;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  organizer: string;
}

export interface Registration {
  id: bigint;
  eventId: bigint;
  userId: string;
  status: "registered" | "waitlisted" | "cancelled";
  registeredAt: bigint;
  eventTitle?: string;
  eventDate?: bigint;
  eventLocation?: string;
}

export interface Feedback {
  id: bigint;
  eventId: bigint;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  submittedAt: bigint;
  eventTitle?: string;
}

export interface Analytics {
  totalEvents: bigint;
  totalRegistrations: bigint;
  averageAttendance: number;
  upcomingEvents: bigint;
  registrationsByCategory: Array<{ category: string; count: bigint }>;
  registrationsByMonth: Array<{ month: string; count: bigint }>;
  topEvents: Array<{ eventId: bigint; title: string; registrations: bigint }>;
  departmentParticipation: Array<{ department: string; count: bigint }>;
}

// Raw backend types (may differ from display types)
export interface RawEvent {
  id: bigint;
  title: string;
  description: string;
  date: bigint;
  location: string;
  capacity: bigint;
  registeredCount: bigint;
  waitlistedCount: bigint;
  category: string;
  status: string;
  organizer: string;
}

export interface RawRegistration {
  id: bigint;
  eventId: bigint;
  userId: string;
  status: string;
  registeredAt: bigint;
}

export interface RawFeedback {
  id: bigint;
  eventId: bigint;
  userId: string;
  userName: string;
  rating: bigint;
  comment: string;
  submittedAt: bigint;
}
