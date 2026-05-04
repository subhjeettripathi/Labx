import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
 
@Component({
  selector: 'app-delete-account-popup',
  templateUrl: './delete-account-popup.component.html',
  styleUrls: ['./delete-account-popup.component.scss']
})
export class DeleteAccountPopupComponent implements OnInit {
  showOnlyEmail=true;
  hideWhenOnlyReason=true
  constructor(public dialogRef: MatDialogRef<DeleteAccountPopupComponent>, @Inject(MAT_DIALOG_DATA) public data:any,public ds:DataService) { }
  showWhenOnlyReason=true
  linkAccount=false
  ah:any
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('allJsonPopupData') || '{}');
  ngOnInit(): void {
    this.getConfigData()
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
 
 
 
  getConfigData() {
    
    this.ds.popupJson().subscribe((res: any) => {
      this.basesignin = res.PopupList[0]
      console.log(this.basesignin,"helloe");
    })
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.basesignin = dataPopup.PopupList[0]
  
    // this.ds.popupJson().subscribe((res: any) => {
    //   this.basesignin=res.PopupList[0]
  
 
    // })
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
  
}
 
 