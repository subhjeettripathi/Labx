import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";

@Component({
  selector: "app-regional",
  templateUrl: "./regional.component.html",
  styleUrls: ["./regional.component.scss"],
})
export class RegionalComponent implements OnInit {
  data: any;
  mains:any=[]
  offShow = false;
  englishShow = false;
  hindiShow = false;
  subtitle: any;
  selected:any;
  baseJson: any = []
  usertype:any
  @Output() regionalSet = new EventEmitter<any>();
  constructor(
    private ds: DataService,
    public dialogRef: MatDialogRef<RegionalComponent>,
    private _dd: DataService,
    private DEC_SER: DecryptService
  ) { }

  ngOnInit(): void {
    this.getConfig();
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);
    this.ds.getSubtitle(ids.id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;

      if(sendTosett.payload ==null){
        this.selected = 'None'
      }else{
      if (sendTosett.payload != null && sendTosett.payload.language_key != null) {
        this.selected = sendTosett.payload.language_key;
      }
    }
    });
  }

  getConfig() {
    // this._dd.faqData().subscribe((res: any) => {
    //   this.data = res.language;
    
    this.ds.popupJson().subscribe((res: any) => {
      this.data = res.PopupList[0].language.languages
     

      this.baseJson = res.PopupList[0]
     
      for (let i in this.data) {
        if (this.data[i].name == "None") {
          this.data[i].is_allow = 1;
          this.data[i].page_title = "None";
  
        }
        if(this.data[i].is_allow==1){
          this.mains.push(this.data[i])
        
          
        }
      }
    })
  
    // });
  }
  subtitleSet(selecte: any) {
    this.selected = selecte;
    // this.ds.getSubtitle(ids.id).subscribe((res: any) => {
    //   this.DEC_SER.getDecryptedData(res?.result);
    //   let decryptData = JSON.parse(this.DEC_SER.decryptData);
    //   const sendTosett = decryptData;
    //   if (sendTosett.payload != null && sendTosett.payload.language_key != null) {
    //     this.selected = sendTosett.payload.language_key;
    //   } 
    // });
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);
    this.ds.getSubtitle(ids.id).subscribe((res: any) => {
      this.dialogRef.close();
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
    
      if (sendTosett.payload != null && sendTosett.payload.subtitle != null) {
        this.subtitle = sendTosett.payload.subtitle;
       
      } else {
        this.subtitle = "None";
      }
      const payload: any = {
        quality_key: 0,
        notification_key: 0,
        download_key: 0,
        autoplay_key: 0,
        language_key: selecte,
        subtitle: this.subtitle,
      };
      var uid: any = localStorage.getItem("taploginInfo");
      var Uid = JSON.parse(uid);
      const formData = new FormData();
      formData.append("uid", Uid.id);
      formData.append("payload", JSON.stringify(payload));

      this.ds.subtitleSet(formData).subscribe((res: any) => {
        if (res.code == 1) {
        
            const is_subscriber: any = localStorage.getItem("is_subscriber")
            if (is_subscriber == '0') {
              this.usertype = "Registered";
            } else {
              this.usertype = "Subscribed";
            }
           
          if (payload.language_key == "None") {
            localStorage.removeItem("regional");
          
    
          } else {
  
            localStorage.setItem("regional", payload.language_key);
          }

          this.regionalSet.emit(payload.language_key);

        }
      });
    });
   
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
}
