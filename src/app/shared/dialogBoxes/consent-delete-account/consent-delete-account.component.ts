import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../loader.service';
import { ClearWatchingConsentComponent } from '../clear-watching-consent/clear-watching-consent.component';

@Component({
  selector: 'app-consent-delete-account',
  templateUrl: './consent-delete-account.component.html',
  styleUrls: ['./consent-delete-account.component.scss']
})
export class ConsentDeleteAccountComponent implements OnInit {
@Output() sendValueToDelete=new EventEmitter<any>()
abc:any
  constructor(public dialogRef: MatDialogRef<ClearWatchingConsentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private loaderService: LoaderService,) { }
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  ngOnInit(): void {
    
    if(this.data.message == 'fal'){
      this.abc=true
    }
    this.basesignin = this.popupJson.PopupList[0]
  }
  
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
  clearWatch() {
   
    this.loaderService.hide()
     this.sendValueToDelete.emit(true)
     this.dialogRef.close()
  }
}
