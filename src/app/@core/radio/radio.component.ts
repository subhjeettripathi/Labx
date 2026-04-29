import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { AudioPlayerComponent } from 'src/app/shared/audio-player/audio-player.component';
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { Location } from "@angular/common";
import { Router } from '@angular/router';
@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit {
  isOttLoggedIn = false;
  data: any
  isSubscribed = false;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  taploginInfo: any = localStorage.getItem('taploginInfo') || {};
  constructor(private ds: DataService, private DEC_SER: DecryptService, private dialog: MatDialog, private ed: ExchangeDataService, private location: Location, private router: Router) {
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value
      }
    });
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
  }

  ngOnInit(): void {
    this.webcastData()
    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
  }

  webcastData() {
    this.ds.radio().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData.data[0]);
        this.data = decryptData.data[0]
        this.data.is_group = 0

        this.data.radio = "true";
        this.data.layout_thumbs.forEach((thumb: any) => {
          if (thumb != null) {
            if (thumb.layout == "square") {
              thumb?.image_size.filter((img: any) => {

                this.data.sliderImg = thumb?.image_size[0].url;
                this.data.sliderIdentifier =
                  thumb?.image_size[0].identifier;

              });
            }
          }
        });
      }
    })

  }

  openAudioPlayer(event: any) {
    console.log(this.data);

    if (this.isOttLoggedIn) {
      this.dialog.closeAll()
      if (this.data.access_type == "free") {
        if (this.dialog.openDialogs.length == 0) {
          const alertRef = this.dialog.open(AudioPlayerComponent, {
            panelClass: 'audio_player',
            maxWidth: '100vw',
            width: "100%",
            height: "100%",
            hasBackdrop: false,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            data: { data: this.data },
          });
        }
      } else {
        if (this.isSubscribed) {
          if (this.dialog.openDialogs.length == 0) {
            const alertRef = this.dialog.open(AudioPlayerComponent, {
              panelClass: 'audio_player',
              maxWidth: '100vw',
              width: "100%",
              height: "100%",
              hasBackdrop: false,
              backdropClass: 'cdk-overlay-transparent-backdrop',
              data: { data: this.data },
            });
          }
        }else{
          this.router.navigate(["/subscribe"]);
        }
      }

    }
    else {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: 'popupBackdropClass',
        panelClass: 'logindialog',
        width: "390px",
        data: { name: "login" },
      });
      dialogRef.disableClose = true;
    }

  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }
}

