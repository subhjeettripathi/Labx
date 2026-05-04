import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {


 image:any
}
@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
datas:any=[]
defaultImages:any=[]
  constructor(public dialogRef: MatDialogRef<ProfileDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {    
    this.defaultImages=localStorage.getItem("defaultImages")
    this.datas.push(this.data)
//  console.log(this.datas,"aaaaaaaaaaaa");
   
    
  }
  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).vertical.path
  }
  close(){
    this.dialogRef.close();
  }
  
}
