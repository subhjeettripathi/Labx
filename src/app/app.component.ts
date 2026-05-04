import { Component, OnInit } from "@angular/core";
import { SeoService } from "./services/seo.service";
import { NetworkConnectionService } from "./services/network-connection.service";
import { FingerPrintService } from "./services/finger-print.service";
import { LogoutPopupComponent } from "./shared/dialogBoxes/logout-popup/logout-popup.component";
import { MatDialog } from "@angular/material/dialog";

declare var require: any;
declare const posthog: any;
declare var firebase: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  imageUrl: string = "assets/arrows_icons/VectorClose.svg";
  title = "altbalaji_web";
  connected: boolean = true;
  USER_ACCOUNT_id: any;
  constructor(
    private meta: SeoService,
    private networkConnectionService: NetworkConnectionService,
    private dialog: MatDialog,
  ) {
    this.meta.updateTitle();
  }
  ngOnInit(): void {
    this.networkConnectionService.connected$.subscribe((connected) => {
      this.connected = connected;
    });

    window.addEventListener('message', (event) => {
      //  console.log("Message received", event);
      if (event.data?.type === 'FORCE_LOGOUT') {
        const dialogRef = this.dialog.open(LogoutPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          disableClose:false
        })
      }
    });
    // setTimeout(() => {
    //   console.log(firebase , 'firebase');

    //   firebase.firestore.collection('events').doc('status').valueChanges().subscribe(data => {
    //     console.log('🔥 Backend triggered Firebase write:', data);
    //     if (data?.status === 'completed') {
    //       // Take action in UI
    //     }
    //   });
    // }, 2000);

    // this.getDeviceId();
  }
  // getDeviceId() {
  //   setTimeout(() => {
  //     const deviceId = posthog.get_distinct_id();
  //     console.log('Device ID:', deviceId);

  //   }, 1000);
  // }



  closeBanner() {
    this.connected = true;
  }
}
