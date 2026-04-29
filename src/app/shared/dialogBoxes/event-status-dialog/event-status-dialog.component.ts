import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-status-dialog',
  templateUrl: './event-status-dialog.component.html',
  styleUrls: ['./event-status-dialog.component.scss']
})
export class EventStatusDialogComponent implements OnInit {
  datetime: any
  isLive: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EventStatusDialogComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }


}
