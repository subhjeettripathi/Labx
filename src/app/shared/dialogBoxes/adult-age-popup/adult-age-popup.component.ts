import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import { LoginModalDialogComponent } from '../login-modal-dialog/login-modal-dialog.component';
import { ParentalOtpCreateComponent } from '../parental-otp-create/parental-otp-create.component';
import { ParentalOtpEnableComponent } from '../parental-otp-enable/parental-otp-enable.component';


@Component({
  selector: 'app-adult-age-popup',
  templateUrl: './adult-age-popup.component.html',
  styleUrls: ['./adult-age-popup.component.scss']
})

export class AdultAgePopupComponent implements OnInit {
  val: boolean | undefined;

  @Output() sen = new EventEmitter<any>()
  visitorId: any;
  deviceId: any;
  popupAlertData: any
  playlistShow: any = [];
  contentType:any;
  defaultImages: any = localStorage.getItem("defaultImages")
  userInfo: any = localStorage.getItem("taploginInfo") || {};
  constructor(public dialogRef: MatDialogRef<AdultAgePopupComponent>, private _SWAL: SwalMsgService, private DEC_SER: DecryptService, private ds: DataService, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private _FPS: FingerPrintService) {

  }
  baseLine: any = []
  
  ngOnInit(): void {
    this.contentType=this.data;
    console.log(this.contentType);
    
    // this.getConfigData()
    this._FPS.getFingerPrintDeviceId();
    this.getPlaylistData()
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
    this.deviceId = this.visitorId;
    this.popupAlertData = localStorage.getItem('popUpForm')
    this.baseLine = JSON.parse(this.popupAlertData)
  }
  // getConfigData() {
  //   this.ds.popupJson().subscribe((res: any) => {
  //    this.baseLine=res.PopupList[0]
  //   })
  // }
  close() {
    this.dialogRef.close();
  }
  yesOver18() {
    localStorage.setItem("isOverAge", "1")
    this.sen.emit(true)
    this.dialogRef.close()
  }
  openSigninPopup() {
    this.dialogRef.close()
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'logindialog',
      width: "390px",
      data: { name: "login" },
    });
    dialogRef.disableClose = true;
  }



  openCreatePlaylist() {
    this.dialogRef.close();
    this.dialog.open(ParentalOtpEnableComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "createPlaylistpop",
      width: "390px",
      data: { contenId: this.data.content_Id , getType : this.contentType.getType},
    });

  }

  addPlaylistContent(listId: any) {
    const formData: any = new FormData();
    formData.append("playlist_id", listId);
    formData.append("content_id", this.data.content_Id);
    formData.append("device", "web");
    formData.append("type", this.contentType.getType);

    this.ds.addPlaylistContent(formData).subscribe((res: any) => {
      if (res.code == 1) {
        this._SWAL.getSwalmsg('Content added Successfully', 'success');
        this.dialogRef.close()
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData)  
      } else {
        this._SWAL.getSwalmsg(res?.result, 'error');
      }
    })
  }
  getPlaylistData() {
    this.ds.getPlaylistNameUser(JSON.parse(this.userInfo).id).subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.playlistShow = decryptData.content

        // this.ds.getPlaylist().subscribe((res:any)=>{

        // })
        console.log(decryptData, "aaaa")
        // this.playlistShow.map((res: any) => {
        //   console.log(res.thumbs)
        //   res.sliderImg = "";
        //   if (res.thumbs != null) {
        //     res.thumbs.forEach((ress: any) => {
        //       if (ress.layout == "square") {
        //         ress.image_size.filter((img: any) => {
        //           if (Number(img.width == 640)) {
        //             res.sliderImg = img.url
        //           }
        //         })
        //       }
        //     })
        //   }

        // })
      }

    })
  }
  onImgError(event: any, type: any) {


    console.log(type, "type");

    if (type == "circle") {
      event.target.src = JSON.parse(this.defaultImages).square.path;
    } else if (type == "rectangle_16x9") {
      event.target.src = JSON.parse(this.defaultImages).rectangle.path;
    } else if (type == "vertical_9x16") {
      event.target.src = JSON.parse(this.defaultImages).vertical.path;
    }
  }

}
