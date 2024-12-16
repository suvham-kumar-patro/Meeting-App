interface Attendee {
    userId: string;
    email: string;
  }
  
  interface Time {
    hours: number;
    minutes: number;
  }
  
  interface Meeting {
    _id?: string;
    name: string;
    description: string;
    date: string; 
    startTime: {
        hours: number;
        minutes: number;
      };
      endTime: {
        hours: number;
        minutes: number;
      };
    attendees: Attendee[];
}
  
  export type { Attendee, Time };
  export default Meeting;