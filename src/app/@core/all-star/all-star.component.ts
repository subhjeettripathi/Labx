import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';

@Component({
  selector: 'app-all-star',
  templateUrl: './all-star.component.html',
  styleUrls: ['./all-star.component.scss']
})

export class AllStarComponent implements OnInit {
  castData: any
  contentId: any
  visitorId: any;
  isSubscribed = false
  isSubsInfo: any = localStorage.getItem('is_subscriber') || {};
  defaultImages: any = []
  windowSize: number = 0;
  constructor(
    private auth: AuthService,
    private _FPS: FingerPrintService,
    // private location: Location,
    private _ar: ActivatedRoute,
    // private dialog: MatDialog,
    private _dd: DataService,
    // private _hc: HomeCategoryUtilsService,
    private DEC_SER: DecryptService,
    // private router: Router,
    private ed: ExchangeDataService,
    private fcs: FunctionCallingService,
    private deviceService: DeviceDetectorService,

    // private meta: Meta, 
    // private title: Title,
    // private _location: Location,
    // private DEC_SCR_IOS: IosDecrycptionService,
    // private renderer: Renderer2,
    // private swal:SwalMsgService
  ) {
    this.ed.isSubscribe.subscribe(value => {
      this.isSubscribed = value;
    });

  }

  ngOnInit(): void {
    this.defaultImages = localStorage.getItem("defaultImages")
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true
    } else {
      this.isSubscribed = false
    }
    // this.navbarAd = localStorage.getItem('faqData')
    // this.navvar = JSON.parse(this.navbarAd)
    this.windowSize = window.innerWidth;
    this._FPS.getFingerPrintDeviceId();
    this._ar.queryParamMap.subscribe((params: any) => {
      window.scroll(0, 0);
      this.contentId = params.get("id");
      this._dd.getCastData(this.contentId).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.castData = decryptData;

          console.log(this.castData, "castDta")
        }
      })

    })

  }



}
