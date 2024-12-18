interface Meeting {
  id: number; 
  name: string;
  description: string;
  date: string; 
  startTime: string; 
  endTime: string; 
  emails: string;
  attendees?: UserAttendee[]; 
}

interface UserAttendee{
  meetingId:number;
  userId: string,
}

export type {UserAttendee}
export default Meeting;