import { Component, Inject, OnInit } from '@angular/core';
import { VideoJsOptions } from '../models/videojs-options';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '../dialogBoxes/alert-dialog/alert-dialog.component';
import { Location } from '@angular/common';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { videoJs } from 'src/app/video-player/videojs';
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
  test: any;
  testData: any;
  constructor(public dialogRef: MatDialogRef<VideojsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private location: Location, private ed: ExchangeDataService) { }

  ngOnInit(): void {
    this.test = this.data
  

    if (this.test.trailerUrlPlay == '1') {
      this.testData = this.test.trailerUrlPlay
    }

    // if(this.data.url.drm == 1) {
    //   this.data.url.url = 'mpd'
    // }

  
    setTimeout(() => {
      $(".close-btn-video").appendTo($("#video-player"));
    }, 1000);
  }



  // playerdata(){
  //   if(this.data.url.is_group = 0){

  //   }
  // }

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
    // overlays: [
    //   {
    //     // This overlay will appear when a video is playing and disappear when
    //     // the player is paused.
    //     start: "playing",

    //     content: this.data.url.title,
    //     align: "center",
    //   },
    // ],
    fill: true,
    height: "620",
    // plugins: {
    //   seekButtons: {
    //     forward: 10,
    //     back: 10
    //   }
    // },
    // plugins: {
    //   seekButtons: {
    //     forward: 10,
    //     back: 10
    //   }
    // },
    liveui: true,
    width: "1280",
    sources: [
      {
        src: this.data.url.url,
        // src: '',
      },
      // {
      // src: 'https://storage.googleapis.com/hubert-raymond-webpage/The_Hustler(1961)---H264.mp4',
     
      // },
    ],



    inactivityTimeout: 5000,
    userActions: {
      doubleClick: true, // to toggle full screen on double click
      hotkeys: function (event: any) {

        // `up arrow` key = forward 10 sec
        // if (event.which === 38) {
        //   this.volume(this.volume() + 0.2);
        // }

        // `up arrow` key = forward 10 sec
        // if (event.which === 40) {
        //   this.volume(this.volume() - 0.2);
        // }

        // `right arrow` key = forward 10 sec
        // if (event.which === 39) {
        //   this.currentTime(this.currentTime() + 10);
        // }

        // `left arrow` key = backward 10 sec
        // if (event.which === 37) {
        //   this.currentTime(this.currentTime() - 10);
        // }

        // `f` key = toggle full screen
        // if (event.which === 70) {
        //   if (!this.isFullscreen()) {
        //     this.enterFullWindow();
        //   } else {
        //     this.exitFullWindow();
        //   }
        // }

        // `m` key = toggle mute
        // if (event.which === 77) {
        //   if (this.muted()) {
        //     this.muted(false);
        //   } else {
        //     this.muted(true);
        //   }
        // }

        // ` `(space) key = play/pause
        // if (event.which === 32) {
        //   if (this.paused()) {
        //     this.play();
        //   } else {
        //     this.pause();
        //   }
        // }

      }
    }
  };

  close() {
    $('.vjs-overlay').hide()
    this.dialogRef.close();
    this.ed.pauseDetailVideo.next(false)
    localStorage.setItem('tarilerplay', '0')
    localStorage.removeItem('getOrder')
    // var oldPlayer = document.getElementById('video-player');
    // videojs(oldPlayer).dispose();
    // for (let key in videoJs.getPlayers()) {
   
    //   delete videoJs.getPlayers()[key];
    // }
    //  for (let key in videoJs.getPlayers()) {
   
    //   delete videoJs.getPlayers()[key];
    //   var playerold = videoJs(key)
    //   playerold.dispose() 
    // }
    // videoAnalytics.reportPlaybackEnded();
    // videoAnalytics.reportAdBreakEnded();
    // this.location.back()
    // for (let key in videoJs.getPlayers()) {
  
    //   delete videoJs.getPlayers()[key];
    // }


  }

}
