import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-exist',
  templateUrl: './user-exist.component.html',
  styleUrls: ['./user-exist.component.scss']
})
export class UserExistComponent implements OnInit {
  value: any;

  constructor(public dialogRef: MatDialogRef<UserExistComponent>, @Inject(MAT_DIALOG_DATA) public message:any) { }

  ngOnInit(): void {
    // this.value=this.message.msg
    this.value="Already linked with other account"
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
}
