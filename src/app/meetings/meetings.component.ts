import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Imeeting from '../Models/IMeeting';
import { GlobalService } from '../Services/global.service';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
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
      emails: this.fb.array([this.fb.control('', Validators.email)]),
    });
  }

  ngOnInit(): void {
    this.loadAttendees();
    this.loadMeetings();
    
    
  }

  get emails(): FormArray {
    return this.meetingsForm.get('emails') as FormArray;
  }

  excuseYourself(meeting: Imeeting): void {
    const id = {
      meetingId: meeting.id,
    }
    this.globalService.removeAttendee(id).subscribe(
      (response) => {
        console.log('You have been excused from the meeting:', meeting.name);
        this.meetings = this.meetings.filter(m => m.id !== meeting.id);   
        this.filteredMeetings = [...this.meetings];
      },
      (error) => {
        console.error('Error removing attendee:', error);
        alert('An error occurred while excusing yourself from the meeting.');
      }
    );
  }
 
  addMember(meeting: Imeeting): void {
    if (this.selectedEmail.trim() === '') {
      alert('Please select an email from the dropdown!');
      return;
    }
    const attendeeData = {
      email: this.selectedEmail,
      meetingId: meeting.id
    }
    this.globalService.addAttendee(attendeeData).subscribe(
      (response) => {
        console.log('Attendee added successfully:', response);
        this.selectedEmail = ''; 
        meeting.attendees = response.attendees;
        this.filteredMeetings = [...this.meetings];
      },
      (error) => {
        console.error('Error adding attendee:', error);
      }
    );
  }

  

  loadAttendees(): void {
    this.http.get<any[]>('https://localhost:7150/api/Attendee/users').subscribe({
      next: (users: any[]) => {
        this.UserData = users;
        console.log('user:',this.UserData);
        this.loadMeetings();
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
    const user = this.UserData.find(u => u.userId === userId); 
    return user ? user.email : 'Email not found'; 
  }

  getFormattedAttendees(userId:string): string {
      const user = this.UserData.find(u=> u.userId === userId) || 'Unknown User';
      return user ? user.email : 'Email not found';
  }

  onSearch(): void {
    const { date, keywords } = this.searchForm.value;
    const today = new Date().toISOString().split('T')[0]; 

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
      startTime: newMeeting.startTime,  
      endTime: newMeeting.endTime,
    };

    this.globalService.addMeeting(formattedNewMeeting).subscribe(
      (addedMeeting: Imeeting) => {
        this.meetings.push(addedMeeting);
        console.log(addedMeeting);
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
    this.emails.push(this.fb.control('', Validators.email));
  }

  removeAttendee(index: number): void {
    this.emails.removeAt(index);
  }

  showAddMeetingForm(): void {
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.meetingsForm.reset();
  }

}