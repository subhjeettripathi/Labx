import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FunctionCallingService } from 'src/app/services/function-calling.service';

@Component({
  selector: 'app-acoount-deletion-succesfull-popup',
  templateUrl: './acoount-deletion-succesfull-popup.component.html',
  styleUrls: ['./acoount-deletion-succesfull-popup.component.scss']
})
export class AcoountDeletionSuccesfullPopupComponent implements OnInit {

  constructor(private fc: FunctionCallingService,public dialogRef: MatDialogRef<AcoountDeletionSuccesfullPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) { }
  mess: any = "Your Request for account deletion is submitted successfully"
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  basesignin: any = []
  showDeletion=true
  alreadyDeletion=true
  ngOnInit(): void {
    
      this.basesignin = this.popupJson.PopupList[0];
    
      
      if(this.data.message=='true'){
        this.showDeletion=false
      }else if(this.data.message=='false'){
       this.alreadyDeletion=false
      }
  }
  close() {
    this.dialogRef.close();
  }

  close1() {
    this.fc.logoutProfile.next(true);
    this.dialogRef.close();
  }
}
