import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-parental-otp-enable',
  templateUrl: './parental-otp-enable.component.html',
  styleUrls: ['./parental-otp-enable.component.scss']
})
export class ParentalOtpEnableComponent implements OnInit {
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  msg: boolean | undefined;
  visitorId: any;
  clicked = true;
  timerHide = true;
  inputData:any
  showMessage:boolean=false
  constructor(public dialogRef: MatDialogRef<ParentalOtpEnableComponent>, private _SWAL: SwalMsgService, private _fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private DEC_SER: DecryptService, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService, private auth: AuthService, private ds: DataService, private ed: ExchangeDataService) { }

  // otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  @Output() case2Parental = new EventEmitter<any>()
  @Output() case2 = new EventEmitter<any>()
  basesignin: any = []
  userInfo: any = localStorage.getItem("taploginInfo") || {};
  display: any;
  playlistForm!: FormGroup
  getMainType: any
  // config = {
  //   allowNumbersOnly: true,
  //   length: 4,
  //   isPasswordInput: true,
  //   disableAutoFocus: false,
  //   timer: 1,
  //   placeholder: '',

  //   inputStyles: {
  //     'width': '56px',
  //     'color': 'white',
  //     'background-color': '#676767',
  //     'border': 'none',
  //     'outline': 'none'
  //   },
  //   inputClass: "dfg"
  // };
  ngOnInit(): void {
    this.playlistForm = this._fb.group({
      playlist: [''],
    });

    this.getMainType = this.data
    console.log(this.getMainType);

    console.log(this.data);
    if(this.data.getType == 'audio') {
      this.inputData = this.data.contenId.playlist_name
    }
    

  }
  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }
  close() {
    this.dialogRef.close();
  }
  createPlaylist() {
    if (this.playlistForm.valid) {
      const formData: any = new FormData();
      formData.append("user_id", JSON.parse(this.userInfo).id);
      formData.append("Playlist_name", this.playlistForm.value.playlist);
      formData.append("device", "web");
      this.ds.createPlaylist(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          const data: any = JSON.parse(this.DEC_SER.decryptData);
          this.dialogRef.close()
          console.log(data)
          this.addPlaylistContent(data.id)

        }else{
          this.showMessage=true
        }

      })
    }
  }

  editNamePlaylist () {
    const formData = new FormData();
    formData.append("Playlist_name", this.inputData);
    formData.append("playlist_id", this.data.contenId.id);
    formData.append("type", '1');
    formData.append("device", 'android');

    this.ds.deletePlaylist(formData).subscribe((res: any) => {
      if(res.code == 1) {
        
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData)
        this._SWAL.getSwalmsg('Renamed Successfully', 'success');
        this.dialogRef.close();
      }
 
    })
  }
  addPlaylistContent(listId: any) {
    const formData: any = new FormData();
    formData.append("playlist_id", listId);
    formData.append("content_id", this.data.contenId);
    formData.append("device", "web");
    formData.append("type", this.getMainType.getType);
    this.ds.addPlaylistContent(formData).subscribe((res: any) => {
      if (res.code == 1) {
         this._SWAL.getSwalmsg('Content added Successfully', 'success');
         this.dialogRef.close()
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData)
      } else {
        this._SWAL.getSwalmsg(res.result, 'error');
      }
    })
  }

}
