import { AfterViewInit, Component, OnInit } from "@angular/core";
import { map } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { videoJs } from "src/app/video-player/videojs";
import { Location } from "@angular/common";
import { SubtitleSettingComponent } from "src/app/shared/dialogBoxes/subtitle-setting/subtitle-setting.component";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ChatService } from "src/app/services/chat.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { VideojsDialogComponent } from "src/app/shared/videojs-dialog/videojs-dialog.component";
import { ParentalOtpCreateComponent } from "src/app/shared/dialogBoxes/parental-otp-create/parental-otp-create.component";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { IosDecrycptionService } from "src/app/services/ios-decrycption.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { FingerPrintService } from "src/app/services/finger-print.service";
import * as firebase from "firebase/app";
import { AnalyticsService } from "src/app/services/analytics.service";
declare var $: any;
@Component({
  selector: "app-webcast",
  templateUrl: "./webcast.component.html",
  styleUrls: ["./webcast.component.scss"],
})
export class WebcastComponent implements OnInit, AfterViewInit {
  ended: boolean = false
  started: boolean = false
  display_offset: any = 0
  cat_id: any;
  data: any;
  blockedMsg: any;
  handle: any;
  player: any;
  userId: any;
  user: any;
  videoJsData: any
  poster: any
  watermark: any
  chatMessage: any = []
  randomInter: any
  noEvent: boolean = false
  rentalData: any;
  playDurationLive: any;
  showChat: boolean = false
  showCountry = true;
  getBrowserName: any
  toggleTimer: boolean = false;
  countdown: any
  countDownDate: any;
  playDyrationTimer: any
  stateDefault: any
  m3u8Main: any
  recordingData: any = []
  constructor(private ds: DataService, private analyticsService: AnalyticsService, private router: Router, private ed: ExchangeDataService, private auth: AuthService, private http: HttpClient, private chat: ChatService, private _fb: FormBuilder, private DEC_SER: DecryptService, private location: Location, public dialog: MatDialog, private fcs: FunctionCallingService, private DEC_SCR_IOS: IosDecrycptionService, private _ar: ActivatedRoute, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService,) {
    this.chat.socketConnection()
    this.chat.getSocketMessages().subscribe((data: any) => {
      const taplogininfo: any = localStorage.getItem('taploginInfo');
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      this.scroolToBottom()
      console.log(data)
      if (data == `groupchat_webcast_${this.data.id}`) {
      }
    });
    const a = localStorage.getItem('taploginInfo')
    const register = localStorage.getItem('is_subscriber')
    if (a != null) {
      // this.leadSquare()
      this.showChat = true
    }
  }
  id: any
  endDate: Date = new Date();
  remainingTime: any;
  eventEndDate: Date = new Date();
  nowDate: any;
  loginForm!: FormGroup;
  navMain: any;
  navNew: any;
  liveStatusData: any
  currentTime: any;
  category: any;
  taploginInfo: any = localStorage.getItem('taploginInfo') || {};
  config = {
    slidesToShow: 4,
    dots: false,
    arrows: true,
    slidesToScroll: 2,
    autoplay: false,
    infinite: false,
  };
  ngOnInit(): void {
    this.jsondata()
    this.getRandomValue()
    setTimeout(() => {
      this.dialog.closeAll();
    }, 200);
    this.navMain = localStorage.getItem("navbarData");
    this.navNew = JSON.parse(this.navMain);
    this.getBrowserName = this.detectBrowserName()
    this.navNew.forEach((data: any) => {
      if (data.category_type == 'webcast') {
        this.cat_id = data.id
        this.getRecordingData()

      }
    })
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    this._ar.queryParams.subscribe(params => {
      this.id = params['id']
    })
    this._ar.queryParams.subscribe(params => {
      this.category = params['cat']

    })
    console.log(typeof this.taploginInfo)
    this.webcastData();
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);




    this.loginForm = this._fb.group({
      chatInput: [null]
    });

  }

  ngAfterViewInit() {
    this.scroolToBottom();
  }

  scroolToBottom() {
    setTimeout(() => {
      let chatContainer: any = document.getElementById('chatContainer');
      chatContainer.scrollTop = chatContainer?.scrollHeight;
    }, 500);
  }

  PlayVideo(data: any) {
    if (this.player) {
      this.player.pause()
    }
    this.router.navigate(["/" + data.permalink]);
  }


  getRandomValue() {
    this.ds.faqData().subscribe((data: any) => {
      this.watermark = data?.Player[0]?.watermarking[0]
      console.log(this.watermark);
      if (this.watermark.is_allow == 1 && this.watermark.type == "UserId") {
        $(document).ready(() => {
          var player = videoJs('player');
          var $watermarkDiv = $('#watermarkDiv');
          var appendWatermarkToPlayer = function () {
            var $playerElement = $(player.el());
            $watermarkDiv.appendTo($playerElement);
            $watermarkDiv.show();
          };

          var getPlayerDimensions = function () {
            var playerElement = player.el();
            var playerRect = playerElement.getBoundingClientRect();
            return {
              width: playerRect.width,
              height: playerRect.height
            };
          };

          var updateWatermarkPosition = () => {
            var playerDimensions = getPlayerDimensions();
            var divWidth = $watermarkDiv.outerWidth();
            var divHeight = $watermarkDiv.outerHeight();

            var randomTop = Math.random() * (playerDimensions.height - divHeight);
            var randomLeft = Math.random() * (playerDimensions.width - divWidth);

            $watermarkDiv.css({
              'top': randomTop + 'px',
              'left': randomLeft + 'px',
              'position': 'absolute',
              'z-index': 9999,
              'color': this.watermark.color,
              'opacity': this.watermark.opacity,
              'font-size': this.watermark.font
            });
          };

          player.ready(function () {
            appendWatermarkToPlayer();
            updateWatermarkPosition();
            setInterval(updateWatermarkPosition, 10000);
          });

          player.on('fullscreenchange', function () {
            updateWatermarkPosition();
          });

          $(window).on('resize', function () {
            updateWatermarkPosition();
          });
        });
        // this.randomInter = setInterval(() => {
        //   var randomX = Math.floor(Math.random() * (window.innerWidth - 100));
        //   var randomY = Math.floor(Math.random() * (window.innerHeight - 100));
        //   var div: any = document.getElementById('watermark');
        //   div.style.left = randomX + 'px';
        //   div.style.top = randomY + 'px';
        //   div.style.display = 'block';
        //   div.style.color = this.watermark.color;
        //   div.style.opacity = this.watermark.opacity;
        //   div.style.fontSize = this.watermark.font;
        //   setTimeout(function () {
        //     div.style.display = 'none';
        //   }, 20000);
        // }, 25000)
      }
    });


  }

  jsondata() {
    // this.ds.faqData().subscribe((data: any) => {
    //   this.watermark = data?.Player[0]?.watermarking[0]
    //   console.log(this.watermark);
    //   if (this.watermark.is_allow == 1 && this.watermark.type == "UserId") {
    //     this.randomInter = setInterval(() => {
    //       var randomX = Math.floor(Math.random() * (window.innerWidth - 100));
    //       var randomY = Math.floor(Math.random() * (window.innerHeight - 100));
    //       var div: any = document.getElementById('watermark');
    //       div.style.left = randomX + 'px';
    //       div.style.top = randomY + 'px';
    //       div.style.display = 'block';
    //       div.style.color = this.watermark.color;
    //       div.style.opacity = this.watermark.opacity;
    //       div.style.fontSize = this.watermark.font;
    //       setTimeout(function () {
    //         div.style.display = 'none';
    //       }, 20000);
    //     }, 25000)
    //   }
    // });
  }

  webcastData() {
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    this.ds
      .webcast(detail.countryCode)
      .pipe(
        map((res: any) => {
          if (res.code == 1) {
            this.noEvent = false;
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            if (this.id != undefined) {
              this.data = decryptData.content[this.id];
            } else {
              const index = decryptData.content.findIndex((content: any) => content.id === this.category);
              this.data = decryptData.content[index];
            }
            // const register = localStorage.getItem('is_subscriber')
            // if (this.data.acces_type == 'paid' && register == '0') {
            //   this.router.navigate(["/subscribe"]);
            // }

            this.ds.timeZoneApiWebcast(detail.countryCode, this.data.id).subscribe((res: any) => {
              console.log(this.data);
              this.DEC_SER.getDecryptedData(res?.result);
              let liveStatusData = JSON.parse(this.DEC_SER.decryptData);
              console.log(liveStatusData);

              this.currentTime = liveStatusData.current_time

              this.poster = this.data?.layout_thumbs[0]?.image_size[0]?.url
              this.endDate = new Date(this.data.publish_date);
              this.eventEndDate = new Date(this.data.publish_end_date);
              setTimeout(() => {
                this.player = videoJs("player");

                const eventParams = {
                  event_id: liveStatusData.content_id,
                  event_name: this.data.title,
                  start_time: liveStatusData.current_time
                };
                this.analyticsService.logEvent('live_webcast_start', eventParams);
                this.countDownDate = new Date(this.endDate).getTime();
                this.nowDate = new Date(this.currentTime);
                this.countdown = liveStatusData.time_interval
                console.log(this.countdown);

                const interval = setInterval(() => {
                  if (this.countdown > 0) {
                    this.countdown--; // Decrease by 1 second
                  } else {
                    console.log('yess');
                    $('.timer').show()
                    $('.content').hide()
                    $('.slide-view').hide()
                    this.noEvent = false;
                    this.started = false
                    this.remainingTime = "Event has been ended"
                    if (this.player) {
                      this.player.load()
                      this.player.poster(this.data.layout_thumbs[0].image_size[0].url)
                    }
                    clearInterval(interval); // Stop the timer when it reaches 0
                  }

                  // console.log(this.countdown);
                }, 1000); // Execute every 1000 milliseconds (1 second)



                // 
                // const y = setInterval(() => {
                //   this.nowDate = new Date(this.currentTime)
                //   if (this.countdown < 0) {
                //     console.log('yess');
                //     $('.timer').show()
                //     $('.content').hide()
                //     $('.slide-view').hide()
                //     this.noEvent = false;
                //     this.started = false
                //     this.remainingTime = "Event has been ended"
                //     if (this.player) {
                //       this.player.load()
                //       this.player.poster(this.data.layout_thumbs[0].image_size[0].url)
                //     }

                //     clearInterval(y);

                //   }
                // }, 1000);
                if (this.countdown > 0) {
                  console.log('hello');

                  $('.slide-view').show()
                  const x = setInterval(() => {
                    this.started = true
                    this.ended = false
                    if (this.countdown > 0) {
                      this.started = false
                      this.ended = false
                      this.noEvent = true;
                      setTimeout(() => {
                        console.log(`webcast_${this.data.id}`)
                        this.scroolToBottom()
                        this.getMessage(`webcast_${this.data.id}`)
                      }, 500);
                      $('.timer').hide()
                      $('.content').show()

                      clearInterval(x);
                      if (this.data.webcast_youtube === 1) {
                        // Replace the player div with the iframe content
                        const playerDiv = document.getElementById('player');
                        if (playerDiv) {
                          playerDiv.innerHTML = this.data.youtube_iframe;
                        }
                      } else {
                        this.player.src({
                          src: this.data.event_value.meeting_url,
                        });
                      }
                      // this.player.src({
                      //   src: 'https://altbalaji-new.multitvsolution.com/multitv/output/1061_649142c972e49/hls/master_xiklXUYyhCAXAeFn.m3u8',
                      // });
                      $(".vjs-play-control").css("position", "relative");
                      $(".vjs-play-control").css({ "top": "-3px", "left": "3px" });
                      $('.vjs-icon-placeholder').addClass('custom-color-class');
                      $('.video-js .vjs-control-bar ').css({
                        'background-color': '#d2691ec4',
                      })

                      if ($(window).width() < 768) {
                        $('.video-js .vjs-time-control.vjs-current-time').css('top', '-10%');
                        $(".vjs-play-control").css({ "top": "-6px", "left": "3px" });
                        $('.video-js .vjs-progress-control').css({
                          'padding-left': '5px',
                          'padding-right': '5px',
                          'bottom': '35px'
                        })
                        $('.video-js .vjs-control-bar ').css({
                          'padding-left': '5px',
                          'padding-right': '5px',
                          'padding-top': '15px',
                          'padding-bottom': '0px'
                        })
                        $('.video-js .vjs-time-control').css({ 'right': '4%', 'top': '-10%' });
                      } else {
                        $('.video-js .vjs-time-control').css('right', '5%');
                        $('.video-js .vjs-progress-control').css({
                          'padding-left': '20px',
                          'padding-right': '20px',
                          'bottom': '55px'
                        })
                        $('.video-js .vjs-control-bar ').css({
                          'padding-left': '20px',
                          'padding-right': '20px'
                        })
                        $('.video-js .vjs-time-control.vjs-current-time').css('left', '2.5%');
                      }

                      if (this.data.webcast_youtube !== 1) {
                        this.player.play();
                      }

                      this.getUserWatchTime()

                      this.player.on("play", () => {
                        this.toggleTimer = true;
                      });

                      this.player.on("pause", () => {
                        this.toggleTimer = false;
                        const eventParams = {
                          event_id: this.data.id,
                          event_name: this.data.title,
                          duration_watched: this.playDurationLive,
                        };
                        this.analyticsService.logEvent('live_webcast_pause', eventParams);
                      })
                    }
                  }, 1000);

                }
              }, 500);
            })
          } else {
            $('.timer').show()
            this.remainingTime = "No upcoming live events"
          }
        })
      )
      .subscribe();
  }

  videoJsPopup() {
    this.dialog.closeAll()
    this.getm3u8Url(this.videoJsData.id)
    setTimeout(() => {
      this.videoJsData.url = this.m3u8Main
    }, 600);
    setTimeout(() => {
      if (this.dialog.openDialogs.length == 0) {
        const alertRef = this.dialog.open(VideojsDialogComponent, {
          maxWidth: "100vw",
          panelClass: "videojsplayer",
          maxHeight: "100vh",
          height: "calc(100% - 100px)",
          width: "100%",
          data: { url: this.videoJsData },
        });
        alertRef.afterClosed().subscribe(result => {
          this.player.play()
        });
      };
    }, 1000);
    localStorage.setItem('miniplay', '0')
  }
  playRental() {
    const dialogRef = this.dialog.open(ParentalOtpCreateComponent, {
      panelClass: 'rentalPop',
      width: "800px",
      data: { rent: this.rentalData }
    });

  }
  getm3u8Url(id: any) {
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

            this.m3u8Main = decryptData.url;
          }
        })
      } else {
        this.ds.getMainUrl(id, "").subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

            this.m3u8Main = decryptData.url;
          }
        })
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.m3u8Main = decryptData.url;


          }
        })
      } else {
        this.ds.getMainUrl(id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.m3u8Main = decryptData.url;


          }
        })
      }
    }

  }





  getRecordingData() {
    this.ds
      .getHomeData(this.display_offset, 4, this.cat_id)
      .pipe(
        map((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.recordingData = decryptData["dashboard"]["home_category"];
            console.log(this.recordingData);

            this.recordingData[0]?.cat_cntn.map((category: any) => {

              category.totalSlides = 6;
              category.sliderImg = "";
              category.sliderIdentifier = "";
              if (category.is_group == 0) {
                category.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == this.recordingData[0]?.multiple_layout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (Number(img.width) == 360 || Number(img.width) == 854) {
                        category.sliderImg = img.url;
                        category.sliderIdentifier = img.identifier;
                      } else if (category.sliderImg == "") {
                        category.sliderImg = thumb?.image_size[0].url;
                        category.sliderIdentifier =
                          thumb?.image_size[0].identifier;
                      }
                    });
                  }
                });
              } else {
                if (category?.groupInfo?.global_thumb.length != 0) {
                  category.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == this.recordingData[0].multiple_layout.layout) {

                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 360 ||
                            Number(img.width) == 854
                          ) {
                            category.sliderImg = img.url;
                            category.sliderIdentifier = img.identifier;
                          } else if (category.sliderImg == "") {
                            category.sliderImg = thumb?.image_size[0].url;
                            category.sliderIdentifier =
                              thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                } else if (category.groupInfo.thumbs != null) {
                  category.groupInfo.thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == this.recordingData[0].multiple_layout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 360 ||
                            Number(img.width) == 854
                          ) {
                            category.sliderImg = img.url;
                            category.sliderIdentifier = img.identifier;
                          } else if (category.sliderImg == "") {
                            category.sliderImg = thumb?.image_size[0].url;
                            category.sliderIdentifier =
                              thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                }

              }

            });
          }
        })
      )
      .subscribe();
  }
  openChat() {
    const dialogRef = this.dialog.open(SubtitleSettingComponent, {
      panelClass: 'contactfooter',
      width: "50%",

    });
  }
  leadSquare() {
    let dateObj = new Date();
    let month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // Add leading zero if needed
    let day = ('0' + dateObj.getUTCDate()).slice(-2); // Add leading zero if needed
    let year = dateObj.getUTCFullYear();

    const newdate = year + "-" + month + "-" + day;
    const date = new Date();

    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);

    const time = date.toLocaleTimeString([], {
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const requestData = [
      {
        'Attribute': 'EmailAddress',
        'Value': USER_ACCOUNT.email
      },
      {
        'Attribute': 'mx_App_Last_Login_Date_Time',
        'Value': newdate + ' ' + time
      },
      {
        'Attribute': 'mx_App_User_Source',
        'Value': 'Web'
      }
    ];
    this.ds.leadSquare(requestData).subscribe((res: any) => {

    })
  }

  analytics() {

    this.ds.apipip().subscribe((res: any) => {
      const userInfo: any = localStorage.getItem("taploginInfo");
      const eventParams = {
        event_id: this.data.id,
        event_name: this.data.title,
        duration_watched: this.playDurationLive,
      };
      this.analyticsService.logEvent('live_webcast_end', eventParams);
      let analytics: any = {
        c_id: this.data.id,
        dod: "",
        dd: "",
        type: 1,
        content_title: this.data.title,
        total_duration: 0,
        pd: this.playDurationLive,
        cat_id: '',
        age_group: "other",
        gender: "Male",
        network_provider: "Airtel",
        customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
        content_type: 'webcast',
        impression: 1
      };
      analytics.dod = `{ "os_version": "6.0", "app_version": "26.04.024", "network_type": "wifi", "network_provider": "" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo).id);
      formData.append("country", res?.countryName);
      formData.append("country_code", res?.countryCode);
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });
    })


  }

  formatDate(inputDate: any) {
    var date = new Date(inputDate);

    var day: any = date.getDate();
    var month: any = date.getMonth() + 1;
    var year: any = date.getFullYear();
    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var seconds: any = date.getSeconds();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    return formattedDate;
  }

  sessionLogEnd() {
    this.ds.apipip().subscribe((res: any) => {
      console.log(res);
      if (res.countryName == "India") {
        if (res.regionName == "National Capital Territory of Delhi") {
          res.regionName = "Delhi"
        }
        this.stateDefault = res.regionName


        this.showCountry = true
      } else {
        this.stateDefault = res.countryName
        this.showCountry = false
      }
      this.fcs.fgh.next(res)
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);

      const deviceId = localStorage.getItem('device_id')
      // userSessionApi Start
      var inputDate = new Date();
      var formattedDate = this.formatDate(inputDate);

      const formData: any = new FormData();
      formData.append("customer_id", USER_ACCOUNT.id);
      formData.append("type", "end");
      formData.append("time", formattedDate);
      formData.append("device_unique_id", deviceId);
      formData.append("device_type", "web");
      formData.append("content_type", "webcast");
      formData.append("customer_name", USER_ACCOUNT.first_name + '' + USER_ACCOUNT.last_name);
      formData.append("country", res.countryName);
      formData.append("country_code", res.countryCode);
      formData.append("network_type", res.security.network);
      formData.append("network_provider", res.connection.isp);
      formData.append("platform", res.userAgent.platform);
      formData.append("browser", res.userAgent.browser);
      formData.append("screen_resolution", window.screen.availWidth + '*' + window.screen.availHeight);
      formData.append("os_version", res.userAgent.operatingSystem);
      formData.append("age_group", USER_ACCOUNT.age_group);
      formData.append("gender", USER_ACCOUNT.gender);
      formData.append("city", res.city);
      this.ds.userSession(formData).subscribe((res: any) => {
        if (res.code == 1) {
          console.log(res);

        }
      });

      // userSessionApi End
    })
  }



  getUserWatchTime() {
    let seconds = 0;
    if (!this.playDyrationTimer) {
      this.playDyrationTimer = setInterval(() => {
        if (this.toggleTimer) {
          this.playDurationLive = seconds++;
          // console.log(this.playDurationLive);
        }
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.analytics();
      clearInterval(this.playDyrationTimer);
      this.playDyrationTimer = 0;
      this.player.dispose();
      clearInterval(this.randomInter);
      this.sessionLogEnd()
    }

  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/'])
    }
  }
  submitChat() {
    if (this.loginForm.value.chatInput != null) {
      const taplogininfo: any = localStorage.getItem('taploginInfo');
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      const formData: any = new FormData();
      console.log(this.loginForm.value.chatInput, "chat")
      if (USER_ACCOUNT.full_name != '') {
        formData.append("user_name", USER_ACCOUNT.full_name);
      } else {
        formData.append("user_name", 'user');
      }

      // formData.append("uid",USER_ACCOUNT.id );
      // formData.append("message", this.loginForm.value.chatInput);
      formData.append("room_name", `webcast_${this.data.id}`);
      formData.append("contact_no", USER_ACCOUNT.contact_no);
      formData.append("email", USER_ACCOUNT.email);
      formData.append("user_id", USER_ACCOUNT.id);
      formData.append("chat_data", this.loginForm.value.chatInput);


      this.ds.sendChatMessage(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.blockedMsg = ''
          this.loginForm.reset(this.loginForm.value.chatInput);
          // this.chat.sendMessage(formData).subscribe((res:any)=>{
          this.getMessage(`webcast_${this.data.id}`)

          // this.chat.sendMessage(formData).subscribe(res=>{
          //   return this.http.get(`https://belive.multitvsolution.com:8030/bigboyget?token=aol_chat&msg=${USER_ACCOUNT.id}`).subscribe();     
          // this.chattingMessages.push({
          //   sender_id: this.userData.uid,
          //   sender_name: this.userType,
          //   msg: message,
          //   created: new Date(),
          //   receiver_name: (this.userType === 'buyer')?'seller':'buyer',
          //   // time: currentDate.getHours() + ':' + currentDate.getMinutes()
          // }); 
          // })

          setTimeout(() => {
            let chatContainer: any = document.getElementById('chatContainer');
            chatContainer.scrollTop = chatContainer?.scrollHeight;
          }, 200);

        } else if (res.code == 2) {
          this.blockedMsg = 'You are Blocked by admin'
        }

      })

    }




  }
  // fun(){
  //   const taplogininfo: any = localStorage.getItem('taploginInfo');
  //   const USER_ACCOUNT: any = JSON.parse(taplogininfo);
  //   return this.http.get(`https://belive.multitvsolution.com:8030/bigboyget?token=aol_chat&msg=${USER_ACCOUNT.id}`).subscribe();  
  // }
  getMessage(room_name: any) {
    // "start": "", "end": "", "userid": "", "roomname": room_name, "offset": "0", "limit": "0", "status": "active", "order": "asc","userstatus":"active"
    // {"order":"asc","start":"","end":"","offset": "0", "limit": "0","status":"active","userstatus":"active","search_tag":room_name}
    const requestData =
      JSON.stringify({ "order": "asc", "start": "", "end": "", "offset": "0", "limit": "0", "status": "active", "userstatus": "active", "roomname": room_name, "search_tag": "" })

    this.ds.getChatMessage(requestData).subscribe((res: any) => {

      console.log(res)
      this.chatMessage = res.result
    })
  }
  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
}
