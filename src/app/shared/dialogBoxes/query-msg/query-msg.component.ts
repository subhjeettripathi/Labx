import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-query-msg',
  templateUrl: './query-msg.component.html',
  styleUrls: ['./query-msg.component.scss']
})
export class QueryMsgComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<QueryMsgComponent>) { }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
    
  }

}
