import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-readmore-dialog',
  templateUrl: './readmore-dialog.component.html',
  styleUrls: ['./readmore-dialog.component.scss']
})
export class ReadmoreDialogComponent implements OnInit {
  reedmore:any;
  constructor(public dialogRef: MatDialogRef<ReadmoreDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,) {
   
   
  }
  ngOnInit(): void {
   this.reedmore=this.data.name
  }

  close(){
    this.dialogRef.close();  
  }
}
