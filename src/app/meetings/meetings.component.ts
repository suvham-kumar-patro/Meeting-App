import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
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
  UserData: any[] =[]

  constructor(private fb: FormBuilder, private globalService: GlobalService, private http: HttpClient) {
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
    this.loadAttendees();
  }

  get attendees(): FormArray {
    return this.meetingsForm.get('attendees') as FormArray;
  }

  excuseYourself(meeting: Imeeting): void {
    console.log(`Excused from meeting: ${meeting.name}`);
   
    this.filteredMeetings = [...this.meetings];
  }
 
  addMember(meeting: Imeeting): void {
    if (this.selectedEmail.trim() === '') {
      alert('Please select an email from the dropdown!');
      return;
    }
    this.selectedEmail = '';
    this.filteredMeetings = [...this.meetings];
  }  

  loadAttendees(): void {
    this.http.get<any[]>('https://localhost:7150/api/Attendee/users').subscribe({
      next: (users: any[]) => {
        console.log('atte',users);
        this.UserData = users;
        console.log('user:',this.UserData);
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
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

  getAttendeeEmail(userId: string): string {
    const user = this.UserData.find(u => u.userId === userId); // Find the user by userId
    return user ? user.email : 'Email not found'; // Return the email or a default message
  }

  getFormattedAttendees(userId:string): string {
      const user = this.UserData.find(u=> u.userId === userId || 'Unknown User');
      return user ? user.email : 'Email not found';
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

}