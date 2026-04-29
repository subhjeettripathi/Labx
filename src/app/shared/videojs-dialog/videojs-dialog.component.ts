import { Component, Inject, OnInit } from '@angular/core';
import { VideoJsOptions } from '../models/videojs-options';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '../dialogBoxes/alert-dialog/alert-dialog.component';
import { Location } from '@angular/common';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { videoJs } from 'src/app/video-player/videojs';
declare var Conviva: any;
declare var videoAnalytics: any;
declare var videojs: any;
export interface DialogData {
  url: any
}
declare var $: any
@Component({
  selector: 'app-videojs-dialog',
  templateUrl: './videojs-dialog.component.html',
  styleUrls: ['./videojs-dialog.component.scss']
})
export class VideojsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VideojsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private location: Location, private ed: ExchangeDataService) { }

  ngOnInit(): void {
    console.log(this.data, "datacomming");
    setTimeout(() => {
      $(".close-btn").appendTo($("#video-player"));
    }, 1000);
  }

  videoJsOptions: VideoJsOptions = {
    withCredentials: true,
    controls: true,
    loadingSpinner: true,
    plugins: {
      seekButtons: {
        forward: 10,
        back: 10
      }
    },

    fill: true,
    height: "620",
    liveui: true,
    width: "1280",
    sources: [
      {
        src: this.data.url.url,
      },
    ],

    inactivityTimeout: 0,
    userActions: {
      doubleClick: true,
      hotkeys: function (event: any) {
        if (event.which === 38) {
          this.volume(this.volume() + 0.2);
        }

        if (event.which === 40) {
          this.volume(this.volume() - 0.2);
        }

        if (event.which === 39) {
          this.currentTime(this.currentTime() + 10);
        }

        if (event.which === 37) {
          this.currentTime(this.currentTime() - 10);
        }

        if (event.which === 77) {
          if (this.muted()) {
            this.muted(false);
          } else {
            this.muted(true);
          }
        }

        if (event.which === 32) {
          if (this.paused()) {
            this.play();
          } else {
            this.pause();
          }
        }

      }
    }
  };
  close() {
    $('.vjs-overlay').hide();
    this.dialogRef.close();
    this.ed.pauseDetailVideo.next(false);
    localStorage.setItem('tarilerplay', '0');
  }

}
