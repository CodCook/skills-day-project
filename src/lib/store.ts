export type Session = {
  id: string;
  title: string;
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

const globalForStore = global as unknown as {
  __store?: { sessions: Session[]; bookings: Booking[] };
};

export const store = globalForStore.__store || {
  sessions: [
    { id: "s1", title: "Web Development Workshop", time: "9:00 AM", location: "Room A101", capacity: 20, remainingSeats: 20 },
    { id: "s2", title: "AI & Machine Learning", time: "11:00 AM", location: "Room B203", capacity: 15, remainingSeats: 15 },
    { id: "s3", title: "Cybersecurity Essentials", time: "1:00 PM", location: "Lab C1", capacity: 10, remainingSeats: 10 },
    { id: "s4", title: "UI/UX Design Thinking", time: "2:30 PM", location: "Design Studio", capacity: 12, remainingSeats: 12 },
    { id: "s5", title: "Cloud Computing", time: "4:00 PM", location: "Room A101", capacity: 18, remainingSeats: 18 },
  ] as Session[],
  bookings: [] as Booking[],
};

if (process.env.NODE_ENV !== "production") {
  globalForStore.__store = store;
}
