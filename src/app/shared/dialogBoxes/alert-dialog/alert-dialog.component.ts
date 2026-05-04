import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
  encapsulation:ViewEncapsulation.Emulated
})
export class AlertDialogComponent implements OnInit {

  constructor(    public dialogRef: MatDialogRef<AlertDialogComponent>,) { }

  ngOnInit(): void {
  }
  close(){

    this.dialogRef.close();
  }
}
