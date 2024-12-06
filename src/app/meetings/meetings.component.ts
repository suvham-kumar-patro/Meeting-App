import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss'
})
export class MeetingsComponent implements OnInit {
  searchForm: FormGroup;
  meetingsForm: FormGroup;
  meetings: any[] = [];
  filteredMeetings: any[] = [];
  showNoMeetingsMessage: boolean = false;
  showForm: boolean = false;
  selectedAttendee: string = '';

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      date: ['today'],
      keywords: ['']
    });

    this.meetingsForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required], // Added description form control
      attendees: this.fb.array([this.fb.control('', Validators.email)])
    });
  }

  ngOnInit(): void {
    this.loadMeetings();
  }

  get attendees(): FormArray {
    return this.meetingsForm.get('attendees') as FormArray;
  }

  loadMeetings(): void {
    this.meetings = [
      {
        id: 1,
        date: '12 September 2020',
        startTime: '06:00',
        endTime: '07:00',
        title: 'Project Kickoff',
        description: 'Kickoff meeting to discuss project goals',
        attendees: ['mark@example.com', 'jane@example.com']
      },
      {
        id: 2,
        date: '12 September 2020',
        startTime: '08:00',
        endTime: '09:30',
        title: 'AWS Architecture',
        description: 'Meeting about cloud architecture',
        attendees: ['john@example.com', 'jane@example.com']
      }
    ];
    this.filteredMeetings = [...this.meetings];
  }

  onSearch(): void {
    const { date, keywords } = this.searchForm.value;
    this.filteredMeetings = this.meetings.filter(meeting => {
      const matchesDate = date === 'today' ? meeting.date === '12 September 2020' : true;
      const matchesKeywords = meeting.title.toLowerCase().includes(keywords.toLowerCase());
      return matchesDate && matchesKeywords;
    });
    this.showNoMeetingsMessage = this.filteredMeetings.length === 0;
  }

  selectAttendee(event: Event, meeting: any): void {
    this.selectedAttendee = (event.target as HTMLSelectElement).value;
  }

  addMember(meeting: any): void {
    if (this.selectedAttendee) {
      meeting.attendees.push(this.selectedAttendee);
    }
  }

  excuseYourself(meeting: any): void {
    const index = meeting.attendees.indexOf(this.selectedAttendee);
    if (index !== -1) {
      meeting.attendees.splice(index, 1);
    }
  }

  showAddMeetingForm(): void {
    this.showForm = true;
  }

  addMeeting(): void {
    if (this.meetingsForm.invalid) {
      return;
    }
    const newMeeting = this.meetingsForm.value;
    newMeeting.id = this.meetings.length + 1;
    this.meetings.push(newMeeting);
    this.filteredMeetings = [...this.meetings];
    this.meetingsForm.reset();
    this.addAttendee();
    this.showForm = false;
    console.log('New meeting added:', newMeeting);
  }

  removeMeeting(meeting: any): void {
    const index = this.meetings.indexOf(meeting);
    if (index !== -1) {
      this.meetings.splice(index, 1);
    }
  }

  addAttendee(): void {
    this.attendees.push(this.fb.control('', Validators.email));
  }

  removeAttendee(index: number): void {
    if (this.attendees.length > 1) {
      this.attendees.removeAt(index);
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.meetingsForm.reset();
  }
}
