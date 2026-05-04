import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";

@Component({
  selector: "app-subtitle-setting",
  templateUrl: "./subtitle-setting.component.html",
  styleUrls: ["./subtitle-setting.component.scss"],
})
export class SubtitleSettingComponent implements OnInit {
  offShow = false;
  englishShow = false;
  hindiShow = false;
  regionals: any;
  subtitledata: any = [];
  selected: any;
  basesignin: any = []
  acc:any
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  @Output() subtitleSett = new EventEmitter<any>();
  
  constructor(
    public dialogRef: MatDialogRef<SubtitleSettingComponent>,
    private ds: DataService,
    @Inject(MAT_DIALOG_DATA) public subtitleFromSetting: any,
    private DEC_SER: DecryptService
  ) {}

  ngOnInit(): void {
    this.getConfig();
    this.getsubtit();
    // if(this.subtitleFromSetting.title != ''){
   
    //   if(this.subtitleFromSetting.title=='off'){
    //     this.offShow=true
    //     this.englishShow=false
    //     this.hindiShow=false
    //   }
    //   else if(this.subtitleFromSetting.title=="English"){
    //     this.offShow=false
    //     this.englishShow=true
    //     this.hindiShow=false
    //   }
    //   else if(this.subtitleFromSetting.title=="Hindi"){
    //     this.offShow=false
    //     this.englishShow=false
    //     this.hindiShow=true
    //   }
    // }
    // var sub: any = localStorage.getItem('subtitle')
    // if(sub=='off'){
    //   this.offShow=true
    //   this.englishShow=false
    //   this.hindiShow=false
    // }
    // else if(sub=="English"){
    //   this.offShow=false
    //   this.englishShow=true
    //   this.hindiShow=false
    // }
    // else if(sub=="Hindi"){
    //   this.offShow=false
    //   this.englishShow=false
    //   this.hindiShow=true
    // }
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
  subtitleSet(selecte: any) {
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);
    this.ds.getSubtitle(ids.id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      

      if (sendTosett.payload != null && sendTosett.payload.language_key != null) {
        this.regionals = sendTosett.payload.language_key;
      } else {
        this.regionals = "None";
      }
      const payload: any = {
        quality_key: 0,
        notification_key: 0,
        download_key: 0,
        autoplay_key: 0,
        language_key: this.regionals,
        subtitle: selecte,
      };
      var uid: any = localStorage.getItem("taploginInfo");
      var Uid = JSON.parse(uid);
      const formData = new FormData();
      formData.append("uid", Uid.id);
      formData.append("payload", JSON.stringify(payload));
  
      this.ds.subtitleSet(formData).subscribe((res: any) => {
        // localStorage.setItem("regional", payload.subtitle);
        if (res.code == 1) {
          this.getsubtit();
          // localStorage.setItem("subtitle",payload.subtitle)
  
          this.subtitleSett.emit(payload.subtitle);
          // if(payload.subtitle=="off"){
          // this.offShow=true
          // this.englishShow=false
          // this.hindiShow=false
          // }
          // else if(payload.subtitle=="English"){
          //   this.offShow=false
          //   this.englishShow=true
          //   this.hindiShow=false
          // }
          // else if(payload.subtitle=="Hindi"){
          //   this.offShow=false
          //   this.englishShow=false
          //   this.hindiShow=true
          // }
        }
      });
    });

    // })
  }
  getsubtit() {
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);
    this.ds.getSubtitle(ids.id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;

     if(sendTosett.payload == null){
      this.acc = "None"
     }else{
      this.acc = sendTosett.payload.subtitle;
     }
      
    });
  }
  getConfig() {
    // this.ds.faqData().subscribe((res: any) => {
    //   this.subtitledata = res.App[0].subtitle;
    
    // });
    this.subtitledata=this.popupJson.PopupList[0].subtitle.languages
    this.basesignin=this.popupJson.PopupList[0]
    
  }
}
