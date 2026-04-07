export type Session = {
  id: string;
  title: string;
  mentor: string;
  time: string;
  location: string;
  capacity: number;
  remainingSeats: number;
};

export type Booking = {
  id: string;
  bookingRef: string;
  sessionId: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  createdAt: string;
};

const defaultSessions: Session[] = [
  { id: "s1", title: "AI for Engineers", mentor: "Dr. Ahmed", time: "9:00 AM", location: "Lab A1", capacity: 20, remainingSeats: 20 },
  { id: "s2", title: "Public Speaking 101", mentor: "Prof. Sarah", time: "11:00 AM", location: "Room B2", capacity: 15, remainingSeats: 15 },
  { id: "s3", title: "Cybersecurity Fundamentals", mentor: "Eng. Tariq", time: "1:00 PM", location: "Security Lab", capacity: 10, remainingSeats: 10 },
  { id: "s4", title: "Product Design & Prototyping", mentor: "Dr. Fatima", time: "2:30 PM", location: "Studio C", capacity: 12, remainingSeats: 12 },
  { id: "s5", title: "Cloud Architecture on AWS", mentor: "Eng. Khalid", time: "4:00 PM", location: "Lab D4", capacity: 18, remainingSeats: 18 },
];

const globalForStore = global as unknown as {
  __store?: { 
    sessions: Session[]; 
    bookings: Booking[];
    addSession: (s: Omit<Session, 'id' | 'remainingSeats'>) => Session;
  };
};

export const store = globalForStore.__store || {
  sessions: [...defaultSessions],
  bookings: [] as Booking[],
  addSession: function(data: Omit<Session, 'id' | 'remainingSeats'>) {
    const newSession: Session = {
      ...data,
      id: `s${Date.now()}`,
      remainingSeats: data.capacity,
    };
    this.sessions.push(newSession);
    return newSession;
  }
};

if (process.env.NODE_ENV !== "production") {
  globalForStore.__store = store;
}
