import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-account-popup',
  templateUrl: './delete-account-popup.component.html',
  styleUrls: ['./delete-account-popup.component.scss']
})
export class DeleteAccountPopupComponent implements OnInit {
  showOnlyEmail=true;
  hideWhenOnlyReason=true
  constructor(public dialogRef: MatDialogRef<DeleteAccountPopupComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }
  showWhenOnlyReason=true
  linkAccount=false
  ah:any
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  ngOnInit(): void {
    this.basesignin=this.popupJson.PopupList[0]
    if(this.data.val == false){
    this.showWhenOnlyReason=false
    }
    if(this.data.val == "hideEmail"){
      this.hideWhenOnlyReason=false
      this.showWhenOnlyReason=true
      this.linkAccount=false
      }
      if(this.data.val == "selectedOption"){
        this.hideWhenOnlyReason=true
        this.showWhenOnlyReason=false
        this.linkAccount=false
        }
    
      if(this.data.val == "phonecase"){
        this.linkAccount=false
        this.showWhenOnlyReason=true
        this.hideWhenOnlyReason=false
        }
        if(this.data.val == "phoneCaseShowLinkOnly"){
          this.linkAccount=true
          this.showWhenOnlyReason=false
          this.hideWhenOnlyReason=false
          }
        if(this.data.val == 'linkAdd'){
           this.linkAccount=true
          this.showWhenOnlyReason=true
          this.hideWhenOnlyReason=false
        }
        if(this.data.val == 'twolinkAdd'){
          this.linkAccount=true
          this.showWhenOnlyReason=false
          this.hideWhenOnlyReason=false
        }
    // else if(this.data.vals==true){
    //   this.showOnlyEmail=true
    // }
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
  
}
