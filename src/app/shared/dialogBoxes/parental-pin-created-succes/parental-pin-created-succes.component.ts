import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-parental-pin-created-succes',
  templateUrl: './parental-pin-created-succes.component.html',
  styleUrls: ['./parental-pin-created-succes.component.scss']
})
export class ParentalPinCreatedSuccesComponent implements OnInit {
  basesignin:any=[]
  constructor(public dialogRef: MatDialogRef<ParentalPinCreatedSuccesComponent>,private router:Router) { }
  loginId = JSON.parse(localStorage.getItem('popupJson') || '{}');
  ngOnInit(): void {
    this.basesignin=this.loginId.PopupList[0]
   
    
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
  submit(){
    // this.router.navigate([""]);
     this.router.navigateByUrl("/")
    this.dialogRef.close()
  }
}
