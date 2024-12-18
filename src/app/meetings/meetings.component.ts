import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Imeeting from '../Models/IMeeting';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss'
})
export class MeetingsComponent implements OnInit {
  searchForm: FormGroup;
  meetingsForm: FormGroup;
  meetings: Imeeting[] = [];
  filteredMeetings: Imeeting[] = [];
  showNoMeetingsMessage: boolean = false;
  showForm: boolean = false;
  selectedAttendee: string = '';
  selectedEmail: string = '';

  constructor(private fb: FormBuilder, private globalService: GlobalService) {
    this.searchForm = this.fb.group({
      date: ['today'],
      keywords: [''],
    });

    this.meetingsForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required],
      attendees: this.fb.array([this.fb.control('', Validators.email)]),
    });
  }

  ngOnInit(): void {
    this.loadMeetings();
  }

  get attendees(): FormArray {
    return this.meetingsForm.get('attendees') as FormArray;
  }

  loadMeetings(): void {
    this.globalService.getMeetings().subscribe({
      next: (data: Imeeting[]) => {
        this.meetings = data;
        console.log('Meetings loaded:', this.meetings);
        this.filteredMeetings = [...this.meetings];
        this.showNoMeetingsMessage = this.filteredMeetings.length === 0;
      },
      error: (err) => {
        console.error('Error loading meetings:', err);
      },
    });
  }

  // getFormattedAttendees(meeting: Imeeting): string {
  //   if (meeting.attendees && meeting.attendees.length > 0) {
  //     const attendeeNames = meeting.attendees.map(attendee => this.users[attendee.userId] || 'Unknown User');
  //     return attendeeNames.join(', ');
  //   }
  //   return 'No attendees';
  // }

  // getFormattedAttendees(meeting: Imeeting, users: { [key: string]: string }): string {
  //   if (meeting.attendees && meeting.attendees.length > 0) {
  //     const attendeeNames = meeting.attendees.map(attendeeId => users[attendeeId] || 'Unknown User');
      
  //     return attendeeNames.join(', ');
  //   }
  //   return 'No attendees'; 
  // }

  // getFormattedAttendees(meeting: Imeeting): string {
  //   if (meeting.attendees && meeting.attendees.length > 0) {
  //     // Map the attendees array and join user ID and email
  //     return meeting.attendees
  //       .map(attendee => `ID: ${attendee.id}`)
  //       .join(', ');
  //   }
  //   return 'No attendees';
  // }

  getFormattedAttendees(meeting: Imeeting): string {
    return meeting.attendees && meeting.attendees.length > 0
      ? meeting.attendees.join(', ') // Assuming attendees is a list of emails
      : 'No attendees';
  }

  onSearch(): void {
    const { date, keywords } = this.searchForm.value;
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    this.filteredMeetings = this.meetings.filter((meeting) => {
      const matchesDate =
        date === 'today'
          ? meeting.date.split('T')[0] === today
          : date === 'past'
          ? new Date(meeting.date) < new Date()
          : date === 'upcoming'
          ? new Date(meeting.date) > new Date()
          : true;

      const matchesKeywords =
        keywords
          ? (meeting.name?.toLowerCase().includes(keywords.toLowerCase()) || 
             (meeting.description && meeting.description?.toLowerCase().includes(keywords.toLowerCase())))
          : true;

      return matchesDate && matchesKeywords;
    });

    this.showNoMeetingsMessage = this.filteredMeetings.length === 0;
  }

  addMeeting(): void {
    if (this.meetingsForm.invalid) {
      return;
    }

    const newMeeting = this.meetingsForm.value;
    const formattedNewMeeting: Imeeting = {
      ...newMeeting,
      startTime: newMeeting.startTime,  // Keep as string 'HH:mm'
      endTime: newMeeting.endTime,      // Keep as string 'HH:mm'
    };

    this.globalService.addMeeting(formattedNewMeeting).subscribe(
      (addedMeeting: Imeeting) => {
        this.meetings.push(addedMeeting);
        this.filteredMeetings = [...this.meetings];
        this.meetingsForm.reset();
        this.showForm = false;
      },
      (error) => {
        console.error('Error adding meeting:', error);
      }
    );
  }

  addAttendee(): void {
    this.attendees.push(this.fb.control('', Validators.email));
  }

  removeAttendee(index: number): void {
    this.attendees.removeAt(index);
  }

  showAddMeetingForm(): void {
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.meetingsForm.reset();
  }

  // Assuming `meeting.startTime` and `meeting.endTime` are in 'HH:mm' format (e.g., '09:00')

// formatTime(time: string): { hours: number, minutes: number } {
//   const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
//   return { hours, minutes };
// }

}