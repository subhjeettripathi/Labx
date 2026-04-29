import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { DataService } from "../services/data.service";
import { DecryptService } from "../services/decrypt.service";
import { ExchangeDataService } from "../services/exchange-data.service";
import { AdultAgePopupComponent } from "../shared/dialogBoxes/adult-age-popup/adult-age-popup.component";
import { ChechPinParentalComponent } from "../shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component";
import { videoJs } from "../video-player/videojs";
declare var $: any;
require("videojs-overlay-buttons");
@Component({
  selector: "app-video-ls-player",
  templateUrl: "./video-ls-player.component.html",
  styleUrls: ["./video-ls-player.component.scss"],
})
export class VideoLsPlayerComponent implements OnInit, OnDestroy {
  @ViewChild("slickModal") slickModal: any;
  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
     if(window.scrollY != 0){
      console.log(window.scrollY);
      if (window.scrollY > 300 && !this.agehide && !this.hideicon && this.playicon) {
        this.bannerPlayer.pause();
        this.playing = true;
        localStorage.setItem('pausedvideo' , '0')
      } else if (!this.agehide && !this.hideicon && this.playicon && localStorage.getItem('pausedvideo') != "1") {
            this.bannerPlayer.play();
            this.playing = false;
      }
     }
  }

  bannerPlayer: any;
  ended: boolean = false;
  agehide: boolean = false;
  userId: any;
  playicon: boolean = true;
  token: any;
  user: any;
  hours_minutes: any;
  getalldata: any
  EpiData: any;
  arr: any = [];
  videosrc: any = [];
  mainelement: any;
  maxcounter: any;
  defaultImages: any = [];
  display_offset: number = 0;
  hideicon: boolean = true;
  isLoggedIn: any = localStorage.getItem("ott_isLoggedIn") || {};
  defaultposter: any = localStorage.getItem("jsonPlayer") || {};
  playing: boolean = false;
  muted: boolean = true;
  isSubscribed = false;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  constructor(
    private ed: ExchangeDataService,
    private dialog: MatDialog,
    private ds: DataService,
    private DEC_SER: DecryptService,
    private router: Router,
    private mat: MatDialog
  ) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
    this.ed.pauseDetailVideo.subscribe((value) => {
      if (value == true) {
        this.pause();
      } else if (value == false) {
        if(!this.agehide && this.playicon){
          // this.play();
        }
      
      }
    });
  }
  @Input() videourl: any;
  @Input() poster: any;
  @Input() ageGroup: any;
  @Input() alldata: any;
  successs: any;
  ngOnInit(): void {
    this.bannerPlayer = videoJs("video-ls", {
      html5: {
        vhs: {
          overrideNative: true,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
    });

    $(".moveToVideoJs").hide();
    $(".moveToVideoJs").appendTo($("#video-ls"));

    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    if (videoJs.getPlayers()[`video-ls`]) {
      delete videoJs.getPlayers()[`video-ls`];
    }
  }

  drmContent(id: any, kId: any, url: any) {
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    var authcode = localStorage.getItem('auth_token')
    var packages: any = localStorage.getItem("ott_subscriptionPlan");
    var packageId = JSON.parse(packages);

    const formData = new FormData();
    if (this.user && this.isSubsInfo != 1) {
      formData.append("content_id", id);
      formData.append("package_id", '');
      formData.append("user_id", this.user.id);
      formData.append("k_id", kId);
      formData.append("licence_duration", "300");
      formData.append("security_level", "3");
      formData.append("rental_duration", "300");
    } else if (this.user && this.isSubsInfo == 1) {
      formData.append("content_id", id);
      formData.append("package_id", '');
      formData.append("user_id", this.user.id);
      formData.append("k_id", kId);
      formData.append("licence_duration", "300");
      formData.append("security_level", "3");
      formData.append("rental_duration", "300");
    } else {
      formData.append("content_id", id);
      formData.append("package_id", "");
      formData.append("user_id", "");
      formData.append("k_id", kId);
      formData.append("licence_duration", "300");
      formData.append("security_level", "3");
      formData.append("rental_duration", "300");
    }
    
    this.ds.payloadData(formData).subscribe((res: any) => {
      if (res.code == 1) {
        this.token = res.result;
        var authcode = localStorage.getItem('auth_token')
        this.ds.tokendata("widevine",authcode,this.token).subscribe((res: any) => {
          if (res.code == 1) {
            this.token = res.result;
            console.log(this.token, "token");
          }
        });
      }
    });

    this.bannerPlayer = videoJs("video-ls");
      setTimeout(() => {
        this.bannerPlayer.src({
          src: url,
          type: 'application/dash+xml',
          'keySystemOptions': [
            {
              'name': 'com.widevine.alpha',
              'options': {
                'serverURL': 'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=C947D1&type=widevine&authorization=' + authcode + '&payload=' + this.token
              }
            },
          ]
        });
        setTimeout(() => {
          $(".vjs-overlay").hide();
          this.bannerPlayer.play();
          $(".vjs-overlay").hide();
        }, 3000);
        $(".vjs-overlay").hide();
      }, 1000);
  }

  ngAfterViewInit(): void {
    this.getalldata = this.alldata
    console.log(this.getalldata, "jhhjhjhjhjh");

    this.bannerPlayer = videoJs("video-ls", {
      html5: {
        vhs: {
          overrideNative: true,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
    });
    this.bannerPlayer.volume(0);
    this.defaultImages = JSON.parse(
      this.defaultposter
    ).Website[0].default_images.rectangle.path;

    if (this.alldata.is_group == 1) {
      this.maxcounter = this.alldata.groupInfo.child[0].total_episode;
      console.log(this.alldata.groupInfo.child);
    }

    this.bannerPlayer.seekButtons({
      forward: 10,
      back: 10,
    });

    this.bannerPlayer.on("pause", () => {
      this.playing = true;
      localStorage.setItem('pausedvideo' , '1')
    });

    this.bannerPlayer.on("play", () => {
      this.playing = false;
      $(".vjs-overlay").hide();

    });

    $(".vjs-mute-control").on("click", () => {
      if (this.muted == true) {
        this.muted = false;
      } else {
        this.muted = true;
      }
    });

    this.bannerPlayer.on("volumechange", () => {
      var vol = this.bannerPlayer.volume();
      if (vol == 0) {
        this.muted = true;
      } else {
        this.muted = false;
      }
    });

    this.bannerPlayer.on("ended", () => {
      console.log("sasad");
      
    if(this.alldata.is_group == 0) {
      if (this.alldata.access_type == "paid" && this.isSubscribed == false) {
        $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(20%)");
        this.bannerPlayer.exitFullscreen();
        $(this.bannerPlayer.posterImage.contentEl()).show();
        this.ended = true;
      }
    } else {
      if (this.alldata.access_type == "paid" && this.isSubscribed == false) {
        $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(20%)");
        this.bannerPlayer.exitFullscreen();
        $(this.bannerPlayer.posterImage.contentEl()).show();
        this.ended = true;
      }
    }
      
    });

    this.bannerPlayer.spriteThumbnails({
      interval: 5,
      url: this.alldata.sprite_url.web,
      width: 224,
      height: 127,
    });

    this.defaultImages = localStorage.getItem("defaultImages");

    if (this.alldata.is_group == 1) {
      if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
        console.log(this.alldata, "fgfgfgfg");
        this.userId = localStorage.getItem("taploginInfo");
        this.user = JSON.parse(this.userId);
        this.drmContent(this.alldata.id,this.alldata.k_id,this.alldata.url)
        setTimeout(() => {
          this.bannerPlayer.overlay({
            overlays: [
              {
                start: "playing",
                content: this.alldata.title,
                align: "center",
              },
            ],
          });
        }, 1000);
      }

      if(this.alldata.access_type=='free' || (this.alldata.access_type=='paid' && this.isSubscribed)){
        this.bannerPlayer.ready(() => {
          this.bannerPlayer = window.videoPlayer || {};
          this.bannerPlayer = videoJs("video-ls");
  
          console.log(this.bannerPlayer);
          console.log(this.alldata, "allldadtadtad");
  
          ((o: any) => {
            this.ds
              .getEpisodeData(
                this.display_offset,
                this.maxcounter,
                this.alldata.season_id
              )
              .pipe(
                map((res: any) => {
                  if (res.code == 1) {
                    this.DEC_SER.getDecryptedData(res?.result);
                    let decryptData = JSON.parse(this.DEC_SER.decryptData);
                    this.EpiData = decryptData.content;
                    console.log(this.EpiData, "epidode data");
                    if (decryptData.content) {
                      console.log(this.EpiData);
                      this.EpiData.forEach((element: any) => {
                        console.log(element.url, "kjkjkjkjkjkjkjkj");
                        console.log(element.duration, "duration");
                        this.EpiData.map((category: any) => {
                          category.sliderImg = "";
                          category.sliderIdentifier = "";
  
                          if (
                            category.is_group == 1 &&
                            category.groupInfo != null
                          ) {
                            category.layout_thumbs.forEach((thumb: any) => {
                              if (thumb != null) {
                                if (thumb.layout == "rectangle_16x9") {
                                  thumb?.image_size.filter((img: any) => {
  
                                    if (Number(img.width) == 360 || Number(img.width) == 854) {
  
                                      category.sliderImg = img.url;
                                      category.sliderIdentifier = img.identifier;
                                    } else if (category.sliderImg == "") {
                                      category.sliderImg =
                                        thumb?.image_size[0].url;
                                      category.sliderIdentifier =
                                        thumb?.image_size[0].identifier;
                                    }
                                  });
                                }
                              }
                            });
                          } else if (category.is_group == 0) {
                            category.layout_thumbs.forEach((thumb: any) => {
                              if (thumb.layout == "rectangle_16x9") {
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
                          }
                        });
  
                        this.mainelement = element.title;
                        console.log(this.mainelement, "title found");
  
                        this.videosrc.push({
                          sources: [
                            {
                              src: element.url,
                              title: this.mainelement,
                              id: element.id,
                              access: element.access_type,
                              drm: element.drm,
                              season: element.season_number,
                              episode: element.episode_number,
                              k_id: element.k_id
                            },
                          ],
                        });
                        this.arr.push(element.id);
                        console.log(this.arr);
  
                        console.log(this.videosrc);
                      });
                    }
                    var rate = 1; // playback rate
                    var options = {
                      autoplay: true,
                      controls: true,
                      preload: "metadata",
                      muted: true,
                      fluid: true,
                      inactivityTimeout: 0, // 0 indicates that the user will never be considered inactive.
                    };
                    this.bannerPlayer = videoJs("video-ls", options);
                    videoJs.log("Ready Player One");
                    this.bannerPlayer.playlist(this.videosrc);
                    console.log(this.videosrc);
                    console.log(this.alldata.id);
                    console.log(this.arr.indexOf(this.alldata.id));
  
                    this.hideicon = false;
                    this.bannerPlayer.playlist.currentItem(
                      this.arr.indexOf(this.alldata.id)
                    );
  
                    this.bannerPlayer.on("ended", () => {
                      console.log("episode");
                      
                      $(".moveToVideoJs").show();
                      setTimeout(() => {
                        $(".moveToVideoJs").hide();
                      }, 5000);
                      var nextbtn = this.bannerPlayer.playlist.next();
                      this.bannerPlayer.overlay({
                        overlays: [
                          {
                            start: "playing",
                            content: (`${nextbtn.sources[0].season} ${nextbtn.sources[0].episode} : ${nextbtn.sources[0].title}`),
                            align: "center",
                          },
                        ],
                      });
                      if (nextbtn.sources[0].access == "free") {
                        nextbtn;
                      } else if (this.isSubsInfo == 1) {
                        nextbtn;
                      } else {
                        this.mat.closeAll();
                        localStorage.setItem("woohoo", "1");
                        this.router.navigate(["/subscribe"]);
                      }
  
                      if (
                        nextbtn.sources[0].drm == 1 &&
                        nextbtn.sources[0].src.includes("mpd")
                      ) {
                        this.userId = localStorage.getItem("taploginInfo");
                        this.user = JSON.parse(this.userId);
                        this.drmContent(nextbtn.sources[0].id,nextbtn.sources[0].k_id,nextbtn.sources[0].src)
                      }
                    });
  
                    this.bannerPlayer.playlist.repeat(false); // Allow skipping back to first video in playlist.
                
                    this.bannerPlayer.on("beforeplaylistitem", () => {
                      rate = this.bannerPlayer.playbackRate();
                    });
  
                    this.bannerPlayer.on("playlistitem", () => {
                      this.bannerPlayer.playbackRate(rate);
                    });
  
                    //   For next and prev
                    var buttonComponent = videoJs.getComponent("Button");
  
                    var prevButton = videoJs.extend(buttonComponent, {
                      constructor: function () {
                        buttonComponent.apply(this, arguments);
                        this.addClass("vjs-icon-previous-item");
                        this.controlText("Previous");
                      },
                      handleClick: (e: any) => {
                        var prevbtn = this.bannerPlayer.playlist.previous();
                        this.bannerPlayer.overlay({
                          overlays: [
                            {
                              start: "playing",
                              content: (`${prevbtn.sources[0].season} ${prevbtn.sources[0].episode} : ${prevbtn.sources[0].title}`),
                              align: "center",
                            },
                          ],
                        });
  
                        $(".moveToVideoJs").show();
                        setTimeout(() => {
                          $(".moveToVideoJs").hide();
                        }, 5000);
                        if (prevbtn.sources[0].access == "free") {
                          prevbtn;
                        } else if (this.isSubsInfo == 1) {
                          prevbtn;
                        } else {
                          this.mat.closeAll();
                          localStorage.setItem("woohoo", "1");
                          this.router.navigate(["/subscribe"]);
                        }
  
                        if (
                          prevbtn.sources[0].drm == 1 &&
                          prevbtn.sources[0].src.includes("mpd")
                        ) {
                          this.userId = localStorage.getItem("taploginInfo");
                          this.user = JSON.parse(this.userId);
                          this.drmContent(prevbtn.sources[0].id,prevbtn.sources[0].k_id,prevbtn.sources[0].src)
                        }
                      },
                    });
  
                    var nextButton = videoJs.extend(buttonComponent, {
                      constructor: function () {
                        buttonComponent.apply(this, arguments);
                        this.addClass("vjs-icon-next-item");
                        this.controlText("Next");
                      },
                      handleClick: (e: any) => {
                        var nextbtn = this.bannerPlayer.playlist.next();
                        this.bannerPlayer.overlay({
                          overlays: [
                            {
                              start: "playing",
                              content: (`${nextbtn.sources[0].season} ${nextbtn.sources[0].episode} : ${nextbtn.sources[0].title}`),
                              align: "center",
                            },
                          ],
                        });
  
                        $(".moveToVideoJs").show();
                        setTimeout(() => {
                          $(".moveToVideoJs").hide();
                        }, 5000);
                        if (nextbtn.sources[0].access == "free") {
                          nextbtn;
                        } else if (this.isSubsInfo == 1) {
                          nextbtn;
                        } else {
                          this.mat.closeAll();
                          localStorage.setItem("woohoo", "1");
                          this.router.navigate(["/subscribe"]);
                        }
  
                        if (
                          nextbtn.sources[0].drm == 1 &&
                          nextbtn.sources[0].src.includes("mpd")
                        ) {
                          this.userId = localStorage.getItem("taploginInfo");
                          this.user = JSON.parse(this.userId);
                          this.drmContent(nextbtn.sources[0].id,nextbtn.sources[0].k_id,nextbtn.sources[0].src)
                        }
                      },
                    });
  
                    videoJs.registerComponent("prevButton", prevButton);
                    videoJs.registerComponent("nextButton", nextButton);
  
                    this.bannerPlayer
                      .getChild("controlBar")
                      .addChild("prevButton", {}, 0);
                    this.bannerPlayer
                      .getChild("controlBar")
                      .addChild("nextButton", {}, 2);
                  }
                })
              )
              .subscribe();
          })(this.bannerPlayer);
          console.log("Episode Page Hitting");
          this.bannerPlayer.notesButton({});
        });
      }
    
    }
  }

  getEpisode1(event: any, seasonCount: any) {
    this.EpiData = [];
    this.slickModal.unslick();
    this.ds
      .getEpisodeData(this.display_offset, seasonCount, event)
      .pipe(
        map((res: any) => {
          if (res.code == 1) {
            $(".episodeSelector").appendTo($("#video-player"));
            this.slickModal.initSlick(this.slideConfig);
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.EpiData = decryptData.content;
            this.EpiData.forEach((element: any) => {
              console.log(element.url, "kjkjkjkjkjkjkjkj");
              console.log(element.duration, "duration");
              this.EpiData.map((category: any) => {
                category.sliderImg = "";
                category.sliderIdentifier = "";

                if (category.is_group == 1 && category.groupInfo != null) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "rectangle_16x9") {
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
                    }
                  });
                } else if (category.is_group == 0) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == "rectangle_16x9") {
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
                }
              });
        
              this.mainelement = element.title;
              console.log(this.mainelement, "title found");

              this.videosrc.push({
                sources: [
                  {
                    src: element.url,
                    title: this.mainelement,
                    id: element.id,
                    access: element.access_type,
                    drm: element.drm,
                  },
                ],
              });
              this.arr.push(element.id);
              console.log(this.arr);

              console.log(this.videosrc);
            });
            console.log(this.EpiData, "epidode data");
          }
        })
      )
      .subscribe();
  }

  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path;
  }

  slideConfig = {
    slidesToShow: 6,
    dots: false,
    arrows: true,
    slidesToScroll: 1,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          dots: false,
          arrows: false,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          dots: false,
          arrows: false,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
        },
      },
    ],
  };

  slickInit(_e: any) { }

  breakpoint(_e: any) { }

  afterChange(_e: any) { }

  beforeChange(_e: any) { }

  drm() {
    $('.age').hide()
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    this.drmContent(this.alldata.id,this.alldata.k_id,this.videourl)
  }

  pause() {
    this.bannerPlayer = videoJs("video-ls");
    this.bannerPlayer.pause();
    this.bannerPlayer.on("pause", () => {
      this.playing = true;
    });
  }

  play() {
    this.bannerPlayer = videoJs("video-ls");
    this.bannerPlayer.play();
    this.bannerPlayer.on("play", () => {
      this.playing = false;
    });
  }

  crossEpisode() {
    $(".episodeSelector1").hide();
  }

  mute() {
    this.bannerPlayer.muted(true);
    if (this.bannerPlayer.muted()) {
      this.muted = true;
      this.bannerPlayer.volume(0);
    }
  }

  unmute() {
    this.bannerPlayer.muted(false);
    if (!this.bannerPlayer.muted()) {
      this.muted = false;
      this.bannerPlayer.volume(1);
    }
  }

  fullscreen() {
    let xc = window.innerWidth;
    if (xc < 992) {
      $(".vjs-notes-btn").on('touchstart', () => {
        this.bannerPlayer.pause()
        this.slickModal.unslick()
        $(".episodeSelector1").appendTo($('#video-ls'));
        this.slickModal.initSlick(this.slideConfig)
        $('.episodeSelector1').show()
      });
    }

    setTimeout(() => {
      $('.vjs-notes-btn').attr('title', 'Season-Selector');
      $('.vjs-icon-hd').attr('title', 'Settings');
    }, 1000);

    $(".vjs-notes-btn").click(() => {
      this.bannerPlayer.pause()
      this.slickModal.unslick()
      $(".episodeSelector1").appendTo($('#video-ls'));
      this.slickModal.initSlick(this.slideConfig)
      $('.episodeSelector1').show()

    });

    $(document).mouseup((e: any) => {
      if ($(e.target).closest(".episodeSelector1").length === 0) {
        $(".episodeSelector1").hide();
      }
    });

    if (this.alldata.is_live == 1) {
      $(".vjs-progress-control").addClass("hideprogress");
      $(".vjs-seek-button").addClass("hideprogress");
      $(".vjs-play-control").addClass("hideprogress");
      $(".vjs-time-control").addClass("hideprogress");
      $(".vjs-notes-btn").addClass("hideprogress");
      $(".vjs-icon-previous-item").addClass("hideprogress");
      $(".vjs-icon-next-item").addClass("hideprogress");
    }

    this.bannerPlayer.requestFullscreen();
    this.bannerPlayer.landscapeFullscreen();
    this.bannerPlayer.on("fullscreenchange", (e: any) => {
      $(".moveToVideoJs").show();
      setTimeout(() => {
        $(".moveToVideoJs").hide();
      }, 5000);

      if (this.bannerPlayer.isFullscreen() == true) {
        this.bannerPlayer.on("timeupdate", () => {
          if (this.bannerPlayer.userActive() == false) {
            $(".vjs-overlay").hide();
          } else {
            $(".vjs-overlay").show();
          }
        });
        this.bannerPlayer.addClass("video-js");
        this.bannerPlayer.controls(true);
      } else {
        $(".vjs-overlay").hide();
        this.bannerPlayer.on("timeupdate", () => {
          if (this.bannerPlayer.userActive() == true) {
            $(".vjs-overlay").hide();
          }
        });

        this.bannerPlayer.controls(false);
        this.bannerPlayer.removeClass("video-js");

        $(".moveToVideoJs").hide();
      }
    });
  }

  playEpisode(episodedata: any) {
    this.bannerPlayer.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${episodedata.season_number} ${episodedata.episode_number} : ${episodedata.title}`),
          align: "center",
        },
      ],
    });
    console.log(episodedata, "datatatatat");

    console.log(this.bannerPlayer.playlist(this.videosrc), "1");
    console.log(
      this.bannerPlayer.playlist.currentItem(this.arr.indexOf(episodedata.id)),
      "2"
    );
    console.log(this.bannerPlayer.playlist.currentItem(), "3");

    if (episodedata.access_type == "free") {
      this.bannerPlayer.playlist(this.videosrc);
      this.bannerPlayer.playlist.currentItem(this.arr.indexOf(episodedata.id));
      if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
        console.log(this.alldata, "fgfgfgfg");
        this.userId = localStorage.getItem("taploginInfo");
        this.user = JSON.parse(this.userId);
        this.drmContent(episodedata.id,episodedata.k_id,episodedata.url)
      }
    } else if (this.isSubsInfo == 1) {
      console.log(this.bannerPlayer.playlist()[0].sources[0].src, "hiiiii");
      this.bannerPlayer.playlist(this.videosrc);
      this.bannerPlayer.playlist.currentItem(this.arr.indexOf(episodedata.id));
      if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
        console.log(this.alldata, "fgfgfgfg");
        this.userId = localStorage.getItem("taploginInfo");
        this.user = JSON.parse(this.userId);
        this.drmContent(episodedata.id,episodedata.k_id,episodedata.url)
      }
    } else {
      this.mat.closeAll();
      this.router.navigate(["/subscribe"]);
    }
    $(".age").hide()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.bannerPlayer.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.alldata.title}`),
          align: "center",
        },
      ],
    });

    $(".vjs-overlay-center").hide();
    if (changes["alldata"]) {
      this.ended = false;
    }
    
  }

  ngOnDestroy(): void {
    $(".vjs-overlay").hide();
    if (this.bannerPlayer) {
      this.bannerPlayer.dispose();
      delete videoJs.getPlayers()[`video-ls`];
    }
  }
}