import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, interval, map, of, tap } from 'rxjs';
import { DecryptService } from "src/app/services/decrypt.service";
import { DataService } from 'src/app/services/data.service';
import { LoginModalDialogComponent } from '../dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { AdultAgePopupComponent } from '../dialogBoxes/adult-age-popup/adult-age-popup.component';
import { ChechPinParentalComponent } from '../dialogBoxes/chech-pin-parental/chech-pin-parental.component';
import { ParentalResetPasswordPopopComponent } from '../dialogBoxes/parental-reset-password-popop/parental-reset-password-popop.component';
import { SocialParentalCreateComponent } from '../dialogBoxes/social-parental-create/social-parental-create.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { videoJs } from 'src/app/video-player/videojs';
import { IosDecrycptionService } from 'src/app/services/ios-decrycption.service';
import * as firebase from "firebase/app";
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { Router } from '@angular/router';

declare var DeviceUUID: any
declare var Clappr: any;
declare var $: any
export interface DialogData {
    data: any;
    behaviour: any;
}
@Component({
    selector: 'app-audio-player',
    templateUrl: './audio-player.component.html',
    styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Space':
                if (this.player.isPlaying()) {
                    this.player.pause();
                    $('.pauseBtn').hide()
                    $('.playBtn').show()
                } else {
                    this.player.play()
                    $('.pauseBtn').show()
                    $('.playBtn').hide()
                }
                break;
        }
    }
    player: any
    AudioData: any = []
    totalViews: any
    totalLikes: any
    playlistbtn: boolean = false
    speedClick: boolean = false
    playBtnShow: any
    audioVisible: boolean = false;
    pauseBtnShow: any
    volumeValue: number = 100;
    seekValue: number = 0;
    maxValue: number = 100;
    getImage: any
    currentTimeGet: SafeHtml | undefined
    currentIndex: any
    playlist: any = [];
    isOttLoggedIn = false;
    display_offset: number = 0;
    audioDuration: any
    defaultImages: any = localStorage.getItem("defaultImages")
    taploginInfo: any = localStorage.getItem('taploginInfo') || {};
    placeholder_Img: any
    EpiData: any = [];
    mainTitle: any;
    mainDuartion: any;
    audioSrc: any = [];
    shuffleDatas: any = [];
    itemget: any
    currentValue: any
    playlistData: any
    currentOffset: number = 0
    totalCountAlbum: any
    previousOffset: any
    playlistCategory1: any;
    player1: any
    imageSlider: any;
    nowPlay: boolean = false;
    sliderImage: any
    getBrowserName: any
    playlistNmae: string | undefined
    getPlayDuration: number = 0
    isOtt = true
    private progressSubscription?: Subscription;
    isRepeatEnabled: boolean = false;
    isShuffleEnable: boolean = false;
    DialogData: DialogData = {
        behaviour: {
            likes: "0",
            is_disliked: "0",
            favorite: "0",
            is_playback_allowed: "0",
            abused: "0",
            is_subscriber: "0",
            notification: "0",
            modified_date: "0",
        },
        data: undefined
    };
    menu: any;
    totalCountLikes: any;
    userId: any
    user: any;
    isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
    id: any;
    kId: any;
    mpdUrl: any;
    accessType: any;
    $: any;
    likeInProgress: boolean = false;
    currentTime: any;
    duration: any
    constructor(public dialogRef: MatDialogRef<AudioPlayerComponent>, private analyticsService: AnalyticsService, @Inject(MAT_DIALOG_DATA) public data: DialogData, private _dd: DataService, private dialog: MatDialog, private ed: ExchangeDataService, private DEC_SER: DecryptService, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService, private renderer: Renderer2, private elementRef: ElementRef, private DES_CER_IOS: IosDecrycptionService, private sanitizer: DomSanitizer, private _SWAL: SwalMsgService, private router: Router) {
        this.ed.isUserLoggedIn.subscribe((value) => {
            if (value == true) {
                this.isOttLoggedIn = value
            }
        });
    }
    ngAfterViewInit(): void {
        if (this.player1) {
            setTimeout(() => {
                this.nowPlay = true;
            }, 3000);

            this.player1.on("play", () => {
                $('.pauseBtn').show();
                $('.playBtn').hide();
            });
        } else {

            setTimeout(() => {
                this.nowPlay = true;
            }, 3000);

            this.player.on(Clappr.Events.PLAYER_PLAY, () => {
                $('.pauseBtn').show();
                $('.playBtn').hide();
            });
        }



        document.addEventListener("visibilitychange", () => {

            // console.log('YESSSSSSSSSSSSSSSSSS');

        })
        navigator.mediaSession.setActionHandler("play", () => {
            // console.log('hi');

            this.player.play();
            $(".pauseBtn").show();
            $(".playBtn").hide();
        });

        navigator.mediaSession.setActionHandler("pause", () => {
            this.player.pause();
            // console.log('hello');
            $(".pauseBtn").hide();
            $(".playBtn").show();

        });
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.getBottomDiv()
        }, 2000);
        var playlistCategory: any = this.data
        this.playlistCategory1 = playlistCategory.dataPlaylist;
        this.playlistData = this.data.data
        console.log(this.data);

        this.playlistNmae = this.data['playlistNmae']
        this.player1 = videoJs("video-player");
        if (Object.keys(this.taploginInfo).length) {
            this.isOttLoggedIn = true;
        } else {
            this.isOttLoggedIn = false;
        }
        this.AudioData = this.data.data
        if (this.AudioData.categories == 'Radio') {
            this.AudioData.radio = 'true'
        }
        setTimeout(() => {
            this.getContentUserBehaviour()
        }, 500);
        this.getBrowserName = this.detectBrowserName()
        this.userId = localStorage.getItem("taploginInfo");
        this.user = JSON.parse(this.userId);
        this.getLikesData(this.AudioData.id)
        const taploginInfo = localStorage.getItem("taploginInfo");
        const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';


        const eventParams = {
            item_name: this.AudioData.title,
            item_type: this.AudioData.content_type,
            item_id: this.AudioData.id
        };
        this.analyticsService.logEvent('audio_start', eventParams);

        if (this.getBrowserName == 'safari') {
            if (this.playlistCategory1 == 'playlistData') {
                this._dd.getMainUrl(this.playlistData[0].id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DES_CER_IOS.getDecryptedDataIos(res?.result);
                        let decryptData = JSON.parse(this.DES_CER_IOS.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type
                    }
                })
            } else {
                this._dd.getMainUrl(this.AudioData.id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DES_CER_IOS.getDecryptedDataIos(res?.result);
                        let decryptData = JSON.parse(this.DES_CER_IOS.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type
                        this.getPlayDuration = decryptData.played_duration
                    }
                })
            }
        } else {
            if (this.playlistCategory1 == 'playlistData') {
                this._dd.getMainUrl(this.playlistData[0].id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type
                        console.log(this.mpdUrl, 'mpd');
                    }
                })
            }
            else {
                this._dd.getMainUrl(this.AudioData.id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);
                        console.log(decryptData);
                        
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type
                        this.getPlayDuration = decryptData.played_duration;
                    }
                })
            }
        }

        this.player = new Clappr.Player({
            source: this.mpdUrl,
            parentId: "#player",
            autoPlay: true,
            hideMediaControl: false,
            width: '100%',
            height: '100vh',
            plugins: [Clappr.HLSPlugin],
            loop: false,
        });

        if (this.playlistCategory1 == 'playlistData') {
            this.getEpisode(20).subscribe(() => {
                this.itemget = 0;
                if (this.itemget >= this.audioSrc.length) {
                    this.itemget = 0;
                }

                if (this.getBrowserName == 'safari') {
                    setTimeout(() => {
                        if (this.mpdUrl) {
                            if (this.mpdUrl.includes("mpd")) {

                                this.mainDuartion = this.playlistData[0].duration
                                this.mainTitle = this.playlistData[0].title
                                // this.drmContent(this.id, this.kId, this.mpdUrl, this.accessType)
                                this.player.load(this.mpdUrl);

                                this.player.play()
                                setTimeout(() => {
                                    Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                                        element.style.color = "#FFFFFF";
                                    })
                                    Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                                }, 500);
                            } else {
                                this.mainTitle = this.playlistData[0].title
                                this.mainDuartion = this.playlistData[0].duration
                                this.imageSlider = this.playlistData[0].sliderImg
                                this.getContentUserBehaviour();
                                this.player.load(this.mpdUrl);

                                this.player.play()
                                setTimeout(() => {
                                    Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                                        element.style.color = "#FFFFFF";
                                    })
                                    Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                                }, 500);
                            }
                        }

                    }, 1500);
                } else {
                    setTimeout(() => {
                        if (this.mpdUrl) {
                            if (this.mpdUrl.includes("mpd")) {

                                this.mainDuartion = this.playlistData[0].duration
                                this.mainTitle = this.playlistData[0].title
                                this.drmContent(this.id, this.kId, this.mpdUrl, this.accessType)
                                setTimeout(() => {
                                    Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                                        element.style.color = "#FFFFFF";
                                    })
                                    Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                                }, 500);
                            } else {
                                this.mainTitle = this.playlistData[0].title
                                this.mainDuartion = this.playlistData[0].duration
                                this.imageSlider = this.playlistData[0].sliderImg
                                this.getContentUserBehaviour();

                                setTimeout(() => {
                                    Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                                        element.style.color = "#FFFFFF";
                                    })
                                    Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                                }, 500);
                            }
                        }

                    }, 1500);
                }

                if (this.player1) {
                    this.player1.on('ended', () => {
                        const eventParams = {
                            item_name: this.audioSrc[this.itemget].sources[0].title,
                            item_id: this.audioSrc[this.itemget].sources[0].id,
                        };
                        this.analyticsService.logEvent('audio_complete', eventParams);
                        console.log('1');

                        console.log(this.audioSrc);
                        console.log(this.itemget);


                        this.next()
                    })
                } else {
                    this.player.on(Clappr.Events.PLAYER_ENDED, () => {
                        console.log('1');
                        this.pause()
                        if (this.audioSrc.length != this.itemget + 1) {
                            const eventParams = {
                                item_name: this.audioSrc[this.itemget].sources[0].title,
                                item_id: this.audioSrc[this.itemget].sources[0].id,
                            };
                            this.analyticsService.logEvent('audio_complete', eventParams);
                            if (this.getBrowserName == 'safari') {
                                this.next()
                            } else {
                                this.next()
                            }
                            // this.itemget++
                        }
                        this.player.load(this.audioSrc[this.itemget].sources[0].url);
                        this.player.play();
                        this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration;
                        this.mainTitle = this.audioSrc[this.itemget].sources[0].title;
                        this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;
                        Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                            element.style.color = "#FFFFFF";
                        })
                        Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                    });
                }
            });
        } else if (this.AudioData.is_group == 1) {
            this.getEpisode(20).subscribe(() => {
                this.itemget = 0;
                if (this.itemget >= this.audioSrc.length) {
                    this.itemget = 0;
                }

                setTimeout(() => {
                    if (this.mpdUrl.includes("mpd")) {
                        if (this.AudioData.indexing) {
                            if (this.AudioData.indexing != 0) {
                                this.itemget = this.AudioData.indexing - 1
                            } else {
                                this.itemget = 0;
                            }

                        } else {
                            this.itemget = 0;
                        }

                        this.mainTitle = this.AudioData.title
                        setTimeout(() => {
                            this.imageSlider = this.audioSrc[0].sources[0].sliderImg
                        }, 1500);

                        this.drmContent(this.id, this.kId, this.mpdUrl, this.accessType)
                        setTimeout(() => {
                            this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration;
                            Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                                element.style.color = "#FFFFFF";
                            })
                            Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                        }, 2000);
                    }
                    else {
                        setTimeout(() => {
                            this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;
                            this.mainTitle = this.AudioData.title;
                            this.player.load(this.mpdUrl);

                            this.player.play()
                            this.player.seek(Number(this.getPlayDuration));
                            setTimeout(() => {
                                console.log(this.audioSrc);
                                console.log(this.AudioData);
                                if (this.AudioData.indexing) {
                                    this.itemget = this.AudioData.indexing - 1
                                } else {
                                    this.itemget = 0
                                }

                                this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration;
                                Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                                    element.style.color = "#FFFFFF";
                                })
                                Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                            }, 1000);
                        }, 300);
                    }
                }, 1000);

                this.player1.on('ended', () => {
                    const eventParams = {
                        item_name: this.audioSrc[this.itemget].sources[0].title,
                        item_id: this.audioSrc[this.itemget].sources[0].id,
                    };
                    this.analyticsService.logEvent('audio_complete', eventParams);
                    this.next()
                })

                setTimeout(() => {
                    Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                        element.style.color = "#FFFFFF";
                    })

                    this.getContentUserBehaviour();
                }, 500);
            });
        }
        else if (this.AudioData.is_group == 0) {
            setTimeout(() => {
                if (this.mpdUrl.includes("mpd")) {
                    this.mainTitle = this.AudioData.title
                    this.detailData(this.AudioData.id)
                    setTimeout(() => {
                        this.imageSlider = this.AudioData.sliderImg
                        this.mainDuartion = this.AudioData.duration
                    }, 300);

                    this.drmContent(this.id, this.kId, this.mpdUrl, this.accessType)
                } else {
                    this.mainDuartion = this.AudioData.duration
                    this.mainTitle = this.AudioData.title
                    this.player.load(this.mpdUrl);
                    this.player.play()
                    this.player.seek(Number(this.getPlayDuration));
                    this.detailData(this.AudioData.id)
                }
            }, 1000);
        } else {
            this.mainTitle = this.AudioData.title
            this.mainDuartion = this.AudioData.duration
            this.imageSlider = this.AudioData.sliderImg
        }

        this.player.play()
        this.player.seek(Number(this.getPlayDuration));
        this.player.setVolume(this.volumeValue);

        this.player.on(Clappr.Events.PLAYER_ENDED, () => {
            this.pause()
            if (this.audioSrc.length != this.itemget + 1) {
                const eventParams = {
                    item_name: this.audioSrc[this.itemget].sources[0].title,
                    item_id: this.audioSrc[this.itemget].sources[0].id,
                };
                this.analyticsService.logEvent('audio_complete', eventParams);
                if (this.getBrowserName == 'safari') {
                    this.next()
                } else {
                    this.next()
                }
            }

            console.log(this.itemget);


            // if(this.audioSrc.length == )
            console.log(this.audioSrc);
            console.log(this.itemget);

            console.log(this.audioSrc[this.itemget].sources[0].url);

            // this.player.load(this.audioSrc[this.itemget].sources[0].url);
            // this.player.play();
            // this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration;
            // this.mainTitle = this.audioSrc[this.itemget].sources[0].title;
            // this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;
            // Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
            //     element.style.color = "#FFFFFF";
            // })
            // Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
        });
        this.progressSubscription = interval(100).subscribe(() => {
            this.updateSeekBar();

        });

        if (localStorage.getItem('miniplay') == '1') {
            this.getMiniScreenPlayer()
        }
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
    contentImage() {
        if (this.AudioData.is_group == 1) {
            this.AudioData.groupInfo.global_thumb.forEach((thumb: any) => {
                if (thumb.layout == 'square') {
                    thumb.image_size.filter((res: any) => {
                        if (
                            Number(res.width) == 640 ||
                            Number(res.width) == 854 || Number(res.width) == 480
                        ) {
                            this.imageSlider = res.url
                        }
                    })
                }

            })
        }
    }

    toggleRepeat(): void {
        $("video").removeAttr("loop", "false")
        this.isRepeatEnabled = false;
        $("#repeat").show();
        $("#repeatEnd").hide();
        $("#repeat_mob").show();
        $("#repeatEnd_mob").hide();
    }

    toggleShuffle(): void {
        this.isShuffleEnable = !this.isShuffleEnable;
        $("#shuffle").show();
        $("#shuffleEnd").hide();
        $("#shuffle_mob").show();
        $("#shuffleEnd_mob").hide();
    }


    onImgError(event: any, type: any) {


        if (type == "circle") {
            event.target.src = JSON.parse(this.defaultImages).square.path;
        } else if (type == "rectangle_16x9") {
            event.target.src = JSON.parse(this.defaultImages).rectangle.path;
        } else if (type == "vertical_9x16") {
            event.target.src = JSON.parse(this.defaultImages).vertical.path;
        }
    }
    detailData(content_id: any) {
        this._dd
            .getDescriptionData(content_id).subscribe((res: any) => {
                this.DEC_SER.getDecryptedData(res?.result);
                let decryptData = JSON.parse(this.DEC_SER.decryptData);
                if (decryptData.content.layout_thumbs != null) {
                    decryptData.content.layout_thumbs.forEach((thumb: any) => {
                        thumb?.image_size.filter((img: any) => {
                            if (Number(img.width) == 640) {
                                this.sliderImage = img.url;
                            } else if (this.sliderImage == "") {
                                this.sliderImage = thumb?.image_size[0].url;
                            }
                        })
                    });
                }

            })
    }
    onScrollingFinished() {
    }
    prev() {
        console.log(this.itemget);

        if (this.itemget != 0) {
            this.itemget--
            this.audioSrc[this.itemget].sources[0].id
        }

        if (this.audioSrc[this.itemget].sources[0]['access_type'] == 'free' || (this.audioSrc[this.itemget].sources[0]['access_type'] == 'paid' && this.isSubsInfo == 1)) {
            this.nowPlay = false;
            setTimeout(() => {
                this.nowPlay = true;
            }, 3000);
            this.getContentUserBehaviour();

            if (this.getBrowserName == 'safari') {
                this._dd.getMainUrl(this.audioSrc[this.itemget].sources[0].id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DES_CER_IOS.getDecryptedDataIos(res?.result);
                        let decryptData = JSON.parse(this.DES_CER_IOS.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type

                        this.player1.pause()
                        this.player.load(this.mpdUrl);
                        this.player.play();
                        this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration;
                        this.mainTitle = this.audioSrc[this.itemget].sources[0].title;
                        this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;
                        $('.pauseBtn').show()
                        $('.playBtn').hide()

                        Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                            element.style.color = "#FFFFFF";
                        })
                        Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                    }
                })
            } else {
                this._dd.getMainUrl(this.audioSrc[this.itemget].sources[0].id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type

                        if (this.mpdUrl.includes("mpd")) {

                            this.player.pause()
                            this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration
                            this.mainTitle = this.audioSrc[this.itemget].sources[0].title
                            this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration
                            this.drmContent(this.id, this.kId, this.mpdUrl, this.accessType)
                        }
                        else {

                            this.player1.pause()
                            this.player.load(this.mpdUrl);
                            this.player.play();
                            this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration;
                            this.mainTitle = this.audioSrc[this.itemget].sources[0].title;
                            this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;

                        }
                        $('.pauseBtn').show()
                        $('.playBtn').hide()

                        Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                            element.style.color = "#FFFFFF";
                        })
                        Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                    }
                })
            }

        } else {
            this.dialogRef.close()
            this.ed.closeAudioGetCallList.next(true)
            $('html').css('position', 'unset');
            $('html').css('overflow-y', 'scroll');
            this.router.navigate(["/subscribe"]);

        }


    }

    next() {
        console.log(this.audioSrc.length);
        console.log(this.itemget);


        if (this.audioSrc.length != this.itemget + 1) {
            this.itemget++
            this.audioSrc[this.itemget].sources[0].id
            this.audioSrc[this.itemget].sources[0].k_id
            this.audioSrc[this.itemget].sources[0].url
        }

        console.log(this.audioSrc.length);
        console.log(this.itemget);


        if (this.audioSrc.length == this.itemget - 1) {
            this.itemget = 0
        }


        if (this.audioSrc[this.itemget].sources[0]['access_type'] == 'free' || (this.audioSrc[this.itemget].sources[0]['access_type'] == 'paid' && this.isSubsInfo == 1)) {
            this.nowPlay = false;
            setTimeout(() => {
                this.nowPlay = true;
            }, 3000);

            if (this.getBrowserName == 'safari') {
                this._dd.getMainUrl(this.audioSrc[this.itemget].sources[0].id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DES_CER_IOS.getDecryptedDataIos(res?.result);
                        let decryptData = JSON.parse(this.DES_CER_IOS.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type
                        this.getContentUserBehaviour();
                        this.player1.pause()
                        this.player.load(this.mpdUrl);
                        this.player.play();
                        this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration;
                        this.mainTitle = this.audioSrc[this.itemget].sources[0].title;

                        this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;

                        $('.pauseBtn').show()
                        $('.playBtn').hide()

                        Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                            element.style.color = "#FFFFFF";
                        })
                        Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                    }
                })

            } else {
                this._dd.getMainUrl(this.audioSrc[this.itemget].sources[0].id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type

                        setTimeout(() => {
                            if (this.mpdUrl.includes("mpd")) {
                                this.player.pause()
                                this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration
                                this.mainTitle = this.audioSrc[this.itemget].sources[0].title
                                this.drmContent(this.id, this.kId, this.mpdUrl, this.accessType)
                            }
                            else {
                                this.getContentUserBehaviour();
                                this.player1.pause()
                                this.player.load(this.mpdUrl);
                                this.player.play();
                                this.mainDuartion = this.audioSrc[this.itemget].sources[0].duration;
                                this.mainTitle = this.audioSrc[this.itemget].sources[0].title;

                                this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;

                                Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                                    element.style.color = "#FFFFFF";
                                })
                                Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";

                            }
                        }, 1000);


                        this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;

                        Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                            element.style.color = "#FFFFFF";
                        })
                        Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";

                        $('.pauseBtn').show()
                        $('.playBtn').hide()

                        Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                            element.style.color = "#FFFFFF";
                        })
                        Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                    }
                })
            }
        } else {
            this.dialogRef.close()
            this.ed.closeAudioGetCallList.next(true)
            $('html').css('position', 'unset');
            $('html').css('overflow-y', 'scroll');
            this.router.navigate(["/subscribe"]);
        }



    }

    convertTimeToMinutes(timeString: any): string {
        const hours = Number(timeString.slice(0, 2));
        const minutes = Number(timeString.slice(3, 5));
        const seconds = Number(timeString.slice(6, 8));
        let totalMinutes = (hours * 60) + minutes;
        if (seconds >= 30) {
            totalMinutes += 1;
        }
        const formattedMinutes = totalMinutes < 10 ? `0${totalMinutes}` : `${totalMinutes}`;
        return formattedMinutes;
    }

    loop() {
        $("video").attr("loop", "true");
        const eventParams = {
            item_name: this.AudioData.title,
            item_id: this.AudioData.id,
            id_loop: true
        };
        this.analyticsService.logEvent('audio_loop', eventParams);
        if (this.player) {
            this.player.on(Clappr.Events.PLAYER_ENDED, () => {
                console.log('1');
                console.log(this.isRepeatEnabled);

                if (this.isRepeatEnabled) {
                    this.player.seek(0);
                    this.player.play();
                }
                Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                    element.style.color = "#FFFFFF";
                })
                Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
            });
        } else if (this.player1) {

            if (this.isRepeatEnabled) {
                this.player1.on('ended', () => {
                    console.log('1');
                    this.player1.currentTime(0)
                    setTimeout(() => {
                        this.player1.play()
                    }, 1000);
                })
            }

        }
        $("#repeatEnd").show();
        $("#repeat").hide();
        $("#repeat_mob").hide();
        $("#repeatEnd_mob").show();
    }

    loadSong(videoUrlPass: any, title: any, duartion: any, index: any, image: any, id: any, k_id: any, access_type: any) {


        if (access_type == 'free' || (access_type == 'paid' && this.isSubsInfo == 1)) {
            this.nowPlay = false;
            setTimeout(() => {
                this.nowPlay = true;
            }, 3000);
            if (this.getBrowserName == 'safari') {
                this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DES_CER_IOS.getDecryptedDataIos(res?.result);
                        let decryptData = JSON.parse(this.DES_CER_IOS.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type
                        this.player.load(this.mpdUrl);
                        this.player1.pause()
                        this.player.play();
                        this.mainTitle = title;
                        this.mainDuartion = duartion;
                        if (this.AudioData.is_group == 1) {
                            this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;
                            this.itemget = index;
                        } else {
                            this.imageSlider =
                                this.itemget = index;
                            this.imageSlider = image;
                        }
                        Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                            element.style.color = "#FFFFFF";
                        })
                        Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                        this.getContentUserBehaviour();
                    }
                })
            }
            else {
                this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {
                    if (res.code == 1) {
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);
                        this.id = decryptData.id
                        this.kId = decryptData.k_id
                        this.mpdUrl = decryptData.url
                        this.accessType = decryptData.price_type

                        if (this.mpdUrl.includes("mpd")) {
                            this.mainDuartion = duartion
                            this.mainTitle = title
                            this.drmContent(this.id, this.kId, this.mpdUrl, this.accessType)
                            this.player.pause()
                            this.itemget = index
                        }
                        else {
                            // this.player.load(videoUrlPass);
                            this.player.load(this.mpdUrl);
                            this.player1.pause()
                            this.player.play();
                            this.mainTitle = title;
                            this.mainDuartion = duartion;
                            if (this.AudioData.is_group == 1) {
                                this.imageSlider = this.audioSrc[this.itemget].sources[0].sliderImg;
                                this.itemget = index;
                            } else {
                                this.imageSlider =
                                    this.itemget = index;
                                this.imageSlider = image;
                            }
                        }

                        Array.from(document.getElementsByClassName('maintitleplayer')).forEach((element: any) => {
                            element.style.color = "#FFFFFF";
                        })
                        Array.from(document.getElementsByClassName('maintitleplayer'))[`${this.itemget}`].style.color = "rgb(255, 135, 49)";
                        this.getContentUserBehaviour();
                    }
                })
            }

            if (this.mpdUrl.includes("mpd")) {
                $('.pauseBtn').show()
                $('.playBtn').hide()
            }
            else {
                $('.pauseBtn').show()
                $('.playBtn').hide()
            }
        } else {
            this.dialogRef.close()
            this.ed.closeAudioGetCallList.next(true)
            $('html').css('position', 'unset');
            $('html').css('overflow-y', 'scroll');
            this.router.navigate(["/subscribe"]);
        }
    }

    getfullscreenPlayer() {
        $('#speedLevelMobile').hide()
        $(window).on('resize', function () {
            var newVh = window.innerHeight * 0.01;
            $('html').css('--vh', newVh + 'px');
        });
        $('html').css('position', 'fixed');
        $('html').css('overflow', 'hidden');
        $('#exitfullscreen_mob').hide();
        $('#fullscreenOpen_mob').show();
        $('#exitfullscreen').hide();
        $('#fullscreenOpen').show();
        $('.single-player').css('display', 'flex')
        $('.audioPlayer').css({
            'height': '100%',
            "position": "fixed",
            "bottom": "",
            "width": "100%",
            'background': "url(/assets/img/AOL_white.svg), linear-gradient(0deg, #100E22, #100E22))",
            'opacity': '1',
            'border-top': 'none',
            'background-repeat': 'no-repeat',
            'background-position': 'center'
        })

        $('.playlist-art').show()
        $('.audio_player .mat-dialog-container').css('width', '100%');
        $(".audio_player").parent().css("height", "100%");
        $('.close-btn').css('display', 'block')
        $('.close-btn-2').css('display', 'block')
        $('.close-btn-2').css('right', '2%')
        $('.close-btn-2').css('top', '4%')
        $('.close-btn-2-mob').css('unset')
        $('.close-btn-2-mob').css('position', 'unset')
        $('.close-btn-2-mob').css('right', 'unset')
        $('.close-btn-mob').css('display', 'block')
        $('.three-dots-mobile').css('display', 'block')
        localStorage.setItem('miniplay', '0')
    }

    getMiniScreenPlayer() {
        this.audioVisible = true;
        $('#speedLevelMobile').hide()
        $('html').css('position', 'unset');
        $('html').css('overflow-y', 'scroll');
        $('#fullscreenOpen_mob').hide();
        $('#exitfullscreen_mob').show()
        $('#fullscreenOpen').hide();
        $('#exitfullscreen').show()
        $('.single-player').css('display', 'none')
        $('.audioPlayer').css({
            'height': '20vh',
            "position": "fixed",
            "bottom": "0",
            "width": "100%",
            'background': "linear-gradient(0deg, rgba(16, 14, 34, 0.9), rgba(16, 14, 34, 0.9))"
        })

        setTimeout(() => {
            $('.playlist-art').hide();
            $('.single-player').hide();
        }, 1);

        $('.audio_player .mat-dialog-container').css('width', '0');
        $('.audio_player').parent().css('height', '0');
        $('.close-btn').css('display', 'none')
        $('.close-btn-mob').css('display', 'none')
        $('.three-dots-mobile').css('display', 'none')
        $('.close-btn-2').css('display', 'block')
        $('.close-btn-2').css('right', '8px')
        $('.close-btn-2').css('top', '80vh')
        $('.close-btn-2-mob').css('position', 'fixed')
        $('.close-btn-2-mob').css('right', '-2px')
        $('.song_title_1').css('display', 'flex')
        let xc = window.innerWidth;
        if (xc <= 360) {
            // For screens 360px wide or less
            $('.close-btn-2-mob').css('bottom', '16.5%');
        } else if (xc < 380) {
            // For screens between 361px and 379px wide
            $('.close-btn-2-mob').css('bottom', '18%');
        } else {
            // For screens wider than 380px
            $('.close-btn-2-mob').css('bottom', '15%');
        }

        localStorage.setItem('miniplay', '1')
    }

    updateSeekBar() {
        if (this.AudioData.radio == 'true') {
            $("#seek").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) 100%, #fff 100%, white 100%)`)
            this.seekValue = 100
        } else {
            setTimeout(() => {

                if (this.AudioData.is_group == 0) {
                    if (this.mpdUrl.includes("mpd")) {
                        var getTimeCurrent = Math.floor(this.player1.currentTime());
                        const timeString = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19);
                        this.currentTimeGet = this.sanitizer.bypassSecurityTrustHtml(timeString);
                        // this.currentTimeGet = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19)
                        const currentTime = this.player1.currentTime();
                        const duration = this.player1.duration();
                        if (duration > 0) {
                            this.seekValue = (currentTime / duration) * 100;
                            $("#seek").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${this.seekValue}%, #fff ${this.seekValue}%, white 100%)`)
                        }
                    }
                    else {
                        var getTimeCurrent = Math.floor(this.player.getCurrentTime());
                        const timeString = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19);
                        this.currentTimeGet = this.sanitizer.bypassSecurityTrustHtml(timeString);
                        // this.currentTimeGet = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19)
                        const currentTime = this.player.getCurrentTime();
                        const duration = this.player.getDuration();
                        if (duration > 0) {
                            this.seekValue = (currentTime / duration) * 100;
                            $("#seek").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${this.seekValue}%, #fff ${this.seekValue}%, white 100%)`)
                        }
                    }
                }
                else {
                    setTimeout(() => {
                        if (this.mpdUrl.includes("mpd")) {
                            setTimeout(() => {
                                var getTimeCurrent = Math.floor(this.player1.currentTime());
                                // this.currentTimeGet = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19)
                                const timeString = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19);
                                this.currentTimeGet = this.sanitizer.bypassSecurityTrustHtml(timeString);

                                const currentTime = this.player1.currentTime();
                                const duration = this.player1.duration();
                                if (duration > 0) {
                                    this.seekValue = (currentTime / duration) * 100;
                                    $("#seek").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${this.seekValue}%, #fff ${this.seekValue}%, white 100%)`)

                                }
                            }, 1000);



                        }
                        else {
                            var getTimeCurrent = Math.floor(this.player.getCurrentTime());
                            // this.currentTimeGet = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19)
                            const timeString = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19);
                            this.currentTimeGet = this.sanitizer.bypassSecurityTrustHtml(timeString);
                            const currentTime = this.player.getCurrentTime();
                            const duration = this.player.getDuration();
                            if (duration > 0) {
                                this.seekValue = (currentTime / duration) * 100;
                                $("#seek").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${this.seekValue}%, #fff ${this.seekValue}%, white 100%)`)
                            }
                        }
                    }, 1000);

                }

            }, 1000);
        }
    }

    pause() {
        if (this.nowPlay == true) {

            const eventParams = {
                item_name: this.AudioData.title,
                item_type: this.AudioData.content_type,
                item_id: this.AudioData.id,
                action: 'pause'
            };
            this.analyticsService.logEvent('audio_play_pause', eventParams);
            if (this.mpdUrl.includes("mpd")) {
                this.player1.pause()
                $('.pauseBtn').hide()
                $('.playBtn').show()
            } else {
                this.player.pause()
                $('.pauseBtn').hide()
                $('.playBtn').show()
            }
        }

    }

    play() {
        const eventParams = {
            item_name: this.AudioData.title,
            item_type: this.AudioData.content_type,
            item_id: this.AudioData.id,
            action: 'play'
        };
        this.analyticsService.logEvent('audio_play_pause', eventParams);
        if (this.mpdUrl.includes("mpd")) {
            this.player1.play()
            $('.pauseBtn').show()
            $('.playBtn').hide()
        }
        else {
            this.player.play()
            $('.pauseBtn').show()
            $('.playBtn').hide()
        }


    }

    mute() {
        if (this.mpdUrl.includes("mpd")) {
            this.volumeValue = 0
            this.player1.volume(0);
            $('.volumeIcon').hide()
            $('.unmuteIcon').show()
            $("#volume-slider").css('background', `linear-gradient(to right, #FFFFFF 0%, #FFFFFF ${this.volumeValue}%, #fff ${this.volumeValue}%, white 100%)`)

        } else {
            this.volumeValue = 0
            this.player.setVolume(0);
            $("#volume-slider").css('background', `linear-gradient(to right, #FFFFFF 0%, #FFFFFF ${this.volumeValue}%, #fff ${this.volumeValue}%, white 100%)`)
            $('.volumeIcon').hide()
            $('.unmuteIcon').show()
        }
    }

    unmute() {
        if (this.mpdUrl.includes("mpd")) {
            this.volumeValue = 100
            this.player1.volume(this.volumeValue);
            $("#volume-slider").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${this.volumeValue}%, #fff ${this.volumeValue}%, white 100%)`)
            $('.volumeIcon').show()
            $('.unmuteIcon').hide()
        } else {
            this.volumeValue = 100
            this.player.setVolume(this.volumeValue);
            $("#volume-slider").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${this.volumeValue}%, #fff ${this.volumeValue}%, white 100%)`)
            $('.volumeIcon').show()
            $('.unmuteIcon').hide()
        }
    }

    adjustVolume(event: any) {


        let valueVol = event.target.value / 100;
        let mainVol = valueVol.toFixed(1);

        if (valueVol > 0) {
            if (this.mpdUrl.includes("mpd")) {
                if (this.mpdUrl.includes("mpd")) {
                    this.player1.volume(valueVol);
                    $("#volume-slider").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${valueVol}%, #fff ${valueVol}%, white 100%)`)
                    $('.volumeIcon').show()
                    $('.unmuteIcon').hide()
                } else {

                    this.player.setVolume(this.volumeValue);
                    $("#volume-slider").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${valueVol}%, #fff ${valueVol}%, white 100%)`)
                    $('.volumeIcon').show()
                    $('.unmuteIcon').hide()
                }
                $('.volumeIcon').show()
                $('.unmuteIcon').hide()
            } else {
                this.player.setVolume(this.volumeValue);
                $("#volume-slider").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${this.volumeValue}%, #fff ${this.volumeValue}%, white 100%)`)
                $('.volumeIcon').show()
                $('.unmuteIcon').hide()
            }
        } else {
            this.mute()
        }
        this.player1.volume(mainVol);
        $("#volume-slider").css('background', `linear-gradient(to right, rgb(255, 135, 49,1) 0%, rgb(255, 135, 49,1) ${this.volumeValue}%, #fff ${this.volumeValue}%, white 100%)`)


    }


    seekToTime(event: any) {
        if (this.mpdUrl.includes("mpd")) {
            const seekPositionPercent = event.target.value;
            const seekTime = (seekPositionPercent / this.maxValue) * this.player1.duration();
            this.player1.currentTime(seekTime);
            // this.player1.play()
        }
        else {
            if (this.AudioData.radio != 'true') {
                const seekPositionPercent = event.target.value;
                const seekTime = (seekPositionPercent / this.maxValue) * this.player.getDuration();
                this.player.seek(seekTime);
                // this.player.play()
            }
        }

    }

    close() {
        this.dialogRef.close();
        localStorage.setItem('miniplay', '0')
        this.ed.closeAudioGetCallList.next(true)
        $('html').css('position', 'unset');
        $('html').css('overflow-y', 'scroll');
    }

    playlistButton() {
        $('.speedIcon').hide()
        if (this.playlistbtn == true) {
            this.playlistbtn = false
        } else {
            this.playlistbtn = true
        }
        this.addOutsideClickListener();
    }


    add(add: any, id: any, cat_id: any) {
        if (id.is_favourite == 1 && this.isOttLoggedIn) {
            id.is_favourite = 0;
        } else if (this.isOttLoggedIn) {
            id.is_favourite = 1;
        }

        const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
        if (userIsLoggedIn == "1") {
            const userInfo: any = localStorage.getItem("taploginInfo") || {};
            if (Object.keys(userInfo).length) {
                const formData = new FormData();
                formData.append("user_id", JSON.parse(userInfo).id);
                formData.append("content_id", id.id);
                formData.append("favourite", id.is_favourite);
                this._dd.addRemoveToWatchList(formData).subscribe((res) => { });
            }
        } else if (!userIsLoggedIn) {
            const dialogRef = this.dialog.open(LoginModalDialogComponent, {
                backdropClass: "popupBackdropClass",
                panelClass: "logindialog",
                width: "390px",
                data: { name: "login" },
            });
            dialogRef.disableClose = true;
        }
    }
    drmContent(id: any, kId: any, url: any, accessType: any) {
        this.userId = localStorage.getItem("taploginInfo");
        this.user = JSON.parse(this.userId);
        var authcode = localStorage.getItem("auth_token");
        var packages: any = localStorage.getItem("ott_subscriptionPlan");
        var packageId = JSON.parse(packages);
        var uuid = new DeviceUUID().get();
        var encryptedUserId = btoa((uuid));

        if (accessType == "paid") {
            if (this.user && this.isSubsInfo != 1) {
                var dataOfContent: any = {
                    content_id: id,
                    k_id: kId,
                    licence_duration: "36000",
                    package_id: "",
                    download: "0",
                    content_type: "1",
                    rental_duration: "36000",
                    security_level: "3",
                    user_id: String(this.user.id),
                };
                var gettoken = btoa(JSON.stringify(dataOfContent));
            } else if (this.user && this.isSubsInfo == 1) {
                var dataOfContent: any = {
                    content_id: id,
                    k_id: kId,
                    licence_duration: "36000",
                    package_id: packageId.packages_list[0].package_id,
                    download: "0",
                    content_type: "1",
                    rental_duration: "36000",
                    security_level: "3",
                    user_id: String(this.user.id),
                };
                var gettoken = btoa(JSON.stringify(dataOfContent));
            } else {
                var dataOfContent: any = {
                    content_id: id,
                    k_id: kId,
                    licence_duration: "36000",
                    package_id: "",
                    download: "0",
                    content_type: "1",
                    rental_duration: "36000",
                    security_level: "3",
                    user_id: "",
                };
                var gettoken = btoa(JSON.stringify(dataOfContent));
            }
        } else {

            if (this.user && this.isSubsInfo != 1) {
                var dataOfContent: any = {
                    content_id: id,
                    k_id: kId,
                    licence_duration: "36000",
                    package_id: "",
                    download: "0",
                    content_type: "0",
                    rental_duration: "36000",
                    security_level: "3",
                    user_id: String(this.user.id),
                };
                var gettoken = btoa(JSON.stringify(dataOfContent));
            } else if (this.user && this.isSubsInfo == 1) {
                var dataOfContent: any = {
                    content_id: id,
                    k_id: kId,
                    licence_duration: "36000",
                    package_id: packageId.packages_list[0].package_id,
                    download: "0",
                    content_type: "0",
                    rental_duration: "36000",
                    security_level: "3",
                    user_id: String(this.user.id),
                };
                var gettoken = btoa(JSON.stringify(dataOfContent));
            } else {
                var dataOfContent: any = {
                    content_id: id,
                    k_id: kId,
                    licence_duration: "36000",
                    package_id: "",
                    download: "0",
                    content_type: "0",
                    rental_duration: "36000",
                    security_level: "3",
                    user_id: "",
                };
                var gettoken = btoa(JSON.stringify(dataOfContent));
            }
        }

        this.player1.src({
            'src': url,
            'type': 'application/dash+xml',
            'keySystemOptions': [
                {
                    'name': 'com.widevine.alpha',
                    'options': {
                        'serverURL': "https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=63CF74&user_id=" + encryptedUserId + "&type=widevine&authorization=" + authcode + "&payload=" + gettoken,
                    }
                },
                {
                    'name': 'com.microsoft.playready',
                    'options': {
                        'serverURL': "https://playready.ezdrm.com/cency/preauth.aspx?pX=6F180A&user_id=" + encryptedUserId + "&type=playready&authorization=" +
                            authcode +
                            "&payload=" +
                            gettoken,
                    }
                }
            ],
        });

        setTimeout(() => {
            this.player1.play(Number(this.getPlayDuration));
            this.updateSeekBar()
            var getTimeCurrent = Math.floor(this.player1.currentTime());
            // this.currentTimeGet = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19)
            const timeString = new Date(getTimeCurrent * 1000).toISOString().substring(14, 19);
            this.currentTimeGet = this.sanitizer.bypassSecurityTrustHtml(timeString);
        }, 1500);

    }

    changePlaybackRate(value: any, event: any) {
        console.log(this.AudioData);
        console.log(this.mainTitle);

        const eventParams = {
            item_name: this.mainTitle,
            item_type: 'audio',
            item_id: this.id,
            audio_speed: value
        };
        this.analyticsService.logEvent('audio_speed_change', eventParams);
        $("ul li.activeModespeed").removeClass("activeModespeed");
        event.target.classList.value = 'activeModespeed'
        if (this.player1.cache_.src != "") {
            this.player1.playbackRate(value);
        } else {
            this.player.core.activePlayback.el.playbackRate = value;
        }
        $('#speedLevel').hide()
        $('#speedLevelMobile').hide();
    }

    speedVisible() {
        $('#speedLevel').toggle()
        $("#speedLevelMobile").toggle()
        this.addOutsideClickListener2();
        $('.playListClick').hide();
        console.log(this.audioVisible);
        if (this.audioVisible) {
            setTimeout(() => {
                $('#speedLevelMobile').hide();
            }, 5000);
        }
        setTimeout(() => {
            $('#speedLevel').hide();
            $('#speedLevelMobile').hide();
        }, 5000);
    }

    addRemoveToWatchlist(watcher: any, slide: any) {
        // if (watcher == 1) {
        //     firebase.analytics().logEvent('ADD_TO_FAVOURITES', {
        //         'itemName': slide.title,
        //         'itemType': slide.content_type,
        //         'itemId': slide.id
        //     })
        // } else {
        //     firebase.analytics().logEvent('REMOVE_TO_FAVOURITES', {
        //         'itemName': slide.title,
        //         'itemType': slide.content_type,
        //         'itemId': slide.id
        //     })
        // }
        const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
        if (userIsLoggedIn == "1") {
            const userInfo: any = localStorage.getItem("taploginInfo") || {};
            if (Object.keys(userInfo).length) {
                const formData = new FormData();
                formData.append("user_id", JSON.parse(userInfo).id);
                if (slide.is_group == 0) {
                    formData.append("content_id", slide.id);
                } else {
                    formData.append("season_id", slide.season_id);
                }
                formData.append("favourite", watcher);
                this._dd.addRemoveToWatchList(formData).subscribe((res) => {
                    if (res.code == 1) {
                        if (watcher == 1) {
                            this.DialogData.behaviour.favorite = 1
                            const eventParams = {
                                item_name: slide.title,
                                item_type: slide.content_type,
                                item_id: slide.id,
                            };
                            this.analyticsService.logEvent('add_to_favorites', eventParams);
                            this._SWAL.getSwalmsg('Added successfully', 'success');
                        } else {
                            this.DialogData.behaviour.favorite = 0
                            this._SWAL.getSwalmsg('Removed successfully', 'success');
                        }

                    }
                });
            }
        } else if (!userIsLoggedIn) {
            const dialogRef = this.dialog.open(LoginModalDialogComponent, {
                backdropClass: "popupBackdropClass",
                panelClass: "logindialog",
                width: "390px",
                data: { name: "login" },
            });
            dialogRef.disableClose = true;
        }
    }

    getEpisode(offset: any): Observable<void> {
        this.audioSrc = [];
        if (this.playlistCategory1 === 'playlistData') {
            return of(this.playlistData).pipe(
                tap((data: any[]) => {
                    this.EpiData = data
                    this.playlistData.forEach((element: any) => {

                        if (element.is_group == 0) {
                            if (element.layout_thumbs.length == 0) {
                                this.getImage = "";
                            } else {
                                this.getImage = element.layout_thumbs[0].image_size[0].url
                            }
                        } else {
                            if (element.groupInfo.length == 0) {
                                this.getImage = "";
                            } else {
                                this.getImage = element?.groupInfo?.global_thumb[0]?.image_size[0].url
                            }
                        }

                        this.audioSrc.push({
                            sources: [
                                {
                                    title: element.title,
                                    duration: element.duration,
                                    url: element.url,
                                    id: element.id,
                                    img: this.getImage,
                                    access_type: element.access_type
                                },
                            ],
                        });
                    });
                    setTimeout(() => {
                        this.player.load(this.mpdUrl);
                        this.player.play()
                    }, 1000);
                }),
                map(() => void 0)
            );

        } else {
            return this._dd
                .getAlbumData(this.AudioData.season_id, offset, this.currentOffset)
                .pipe(
                    tap((res: any) => {
                        if (res.code !== 1) return;
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);
                        this.totalCountAlbum = decryptData.totalCount
                        this.currentOffset = 20
                        this.EpiData = decryptData.data.content;
                        console.log(this.EpiData, 'epidata');

                        this.EpiData.map((element: any) => {
                            if (element.is_group == 1) {
                                element.groupInfo.global_thumb.forEach((res: any) => {
                                    if (res.layout == 'square') {
                                        res.image_size.filter((ele: any) => {
                                            if (
                                                Number(ele.width) == 640 ||
                                                Number(ele.width) == 720 || Number(ele.width) == 480
                                            ) {
                                                this.getImage = ele.url
                                            }
                                        })
                                    }
                                })
                            } else {
                                element.layout_thumbs.forEach((thumb: any) => {
                                    if (thumb.layout == 'square') {
                                        thumb?.image_size.filter((img: any) => {
                                            if (Number(img.width) == 854) {
                                                this.getImage = img.url
                                            }
                                        })
                                    }
                                })
                            }

                            this.audioSrc.push({
                                sources: [
                                    {
                                        title: element.title,
                                        duration: element.duration,
                                        url: element.url,
                                        id: element.id,
                                        sliderImg: this.getImage,
                                        k_id: element.k_id,
                                        access_type: element.access_type
                                    },
                                ],
                            });

                        });

                        console.log(this.EpiData);

                    }),
                    map(() => void 0)
                );
        }
    }


    // getEpisode(offset: any) {
    //     if (this.playlistCategory1 == 'playlistData') {
    //         this.EpiData = this.playlistData
    //         this.playlistData.forEach((element: any) => {

    //             if (element.is_group == 0) {
    //                 if (element.layout_thumbs.length == 0) {
    //                     this.getImage = "";
    //                 } else {
    //                     this.getImage = element.layout_thumbs[0].image_size[0].url
    //                 }
    //             } else {
    //                 if (element.groupInfo.length == 0) {
    //                     this.getImage = "";
    //                 } else {
    //                     this.getImage = element?.groupInfo?.global_thumb[0]?.image_size[0].url
    //                 }
    //             }

    //             this.audioSrc.push({
    //                 sources: [
    //                     {
    //                         title: element.title,
    //                         duration: element.duration,
    //                         url: element.url,
    //                         id: element.id,
    //                         img: this.getImage,
    //                         access_type: element.access_type
    //                     },
    //                 ],
    //             });
    //         });
    //         setTimeout(() => {
    //             this.player.load(this.mpdUrl);
    //             this.player.play()
    //         }, 1000);


    //     } else {
    //         this.EpiData = [];
    //         this._dd.getAlbumData(this.AudioData.season_id, offset, this.currentOffset).subscribe((res: any) => {
    //             if (res.code == 1) {
    //                 this.DEC_SER.getDecryptedData(res?.result);
    //                 let decryptData = JSON.parse(this.DEC_SER.decryptData);
    //                 this.totalCountAlbum = decryptData.totalCount
    //                 this.currentOffset = 20
    //                 this.EpiData = decryptData.data.content;
    //                 console.log(this.EpiData, 'epidata');

    //                 this.EpiData.map((element: any) => {
    //                     if (element.is_group == 1) {
    //                         element.groupInfo.global_thumb.forEach((res: any) => {
    //                             if (res.layout == 'square') {
    //                                 res.image_size.filter((ele: any) => {
    //                                     if (
    //                                         Number(ele.width) == 640 ||
    //                                         Number(ele.width) == 720 || Number(ele.width) == 480
    //                                     ) {
    //                                         this.getImage = ele.url
    //                                     }
    //                                 })
    //                             }
    //                         })
    //                     } else {
    //                         element.layout_thumbs.forEach((thumb: any) => {
    //                             if (thumb.layout == 'square') {
    //                                 thumb?.image_size.filter((img: any) => {
    //                                     if (Number(img.width) == 854) {
    //                                         this.getImage = img.url
    //                                     }
    //                                 })
    //                             }
    //                         })
    //                     }

    //                     this.audioSrc.push({
    //                         sources: [
    //                             {
    //                                 title: element.title,
    //                                 duration: element.duration,
    //                                 url: element.url,
    //                                 id: element.id,
    //                                 sliderImg: this.getImage,
    //                                 k_id: element.k_id,
    //                                 access_type: element.access_type
    //                             },
    //                         ],
    //                     });

    //                 });
    //             }
    //         })
    //     }

    //     this.itemget = 0;
    //     if (this.itemget >= this.audioSrc.length) this.itemget = 0;

    // }


    shuffleData = (array: string[]) => {
        return array.sort(() => Math.random() - 0.5);
    }

    getBottomDiv() {
        let scrollableDiv = document.getElementById('playlistEnd');
        if (scrollableDiv) {
            let isLoading = false;

            scrollableDiv.addEventListener('scroll', () => {
                if (!isLoading && scrollableDiv && scrollableDiv.scrollHeight && this.totalCountAlbum > this.currentOffset) {
                    const distanceFromBottom = scrollableDiv.scrollHeight - scrollableDiv.scrollTop - scrollableDiv.clientHeight;
                    const buffer = 200;

                    if (distanceFromBottom <= buffer) {
                        isLoading = true;

                        this._dd.getAlbumData(this.AudioData.season_id, 20, this.currentOffset).subscribe((res: any) => {
                            if (res.code == 1) {
                                this.DEC_SER.getDecryptedData(res?.result);
                                let decryptData = JSON.parse(this.DEC_SER.decryptData);

                                this.previousOffset = this.currentOffset;
                                this.currentOffset = decryptData.offset;

                                let mainEpiData = decryptData.data.content;


                                mainEpiData.map((element: any) => {
                                    this.EpiData.push(element);
                                    if (element.is_group == 1) {
                                        element.groupInfo.global_thumb.forEach((res: any) => {
                                            if (res.layout == 'square') {
                                                res.image_size.filter((ele: any) => {
                                                    if (
                                                        Number(ele.width) == 640 ||
                                                        Number(ele.width) == 720 || Number(ele.width) == 480
                                                    ) {
                                                        this.getImage = ele.url;
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        element.layout_thumbs.forEach((thumb: any) => {
                                            if (thumb.layout == 'square') {
                                                thumb?.image_size.filter((img: any) => {
                                                    if (Number(img.width) == 854) {
                                                        this.getImage = img.url;
                                                    }
                                                });
                                            }
                                        });
                                    }

                                    this.audioSrc.push({
                                        sources: [
                                            {
                                                title: element.title,
                                                duration: element.duration,
                                                url: element.url,
                                                id: element.id,
                                                sliderImg: this.getImage,
                                                k_id: element.k_id,
                                                access_type: element.access_type
                                            },
                                        ],
                                    });

                                });
                            }
                            isLoading = false;
                        });
                    }
                }
            });

        }
    }

    shuffle() {
        $("#shuffleEnd").show();
        $("#shuffle").hide();
        $("#shuffle_mob").hide();
        $("#shuffleEnd_mob").show();
        let mainData = this.EpiData.splice(this.itemget, 1);

        const shuffledArray = this.shuffleData(this.EpiData);
        shuffledArray.unshift(mainData[0]);
        this.EpiData = [];
        this.EpiData = shuffledArray;
        this.audioSrc = [];
        this.itemget = 0;
        this.EpiData.forEach((element: any) => {
            this.audioSrc.push({
                sources: [
                    {
                        title: element.title,
                        duration: element.duration,
                        url: element.url,
                        id: element.id,
                        sliderImg: this.getImage,
                        k_id: element.k_id,
                        access_type: element.access_type
                    },
                ],
            });

        });

    }

    getContentUserBehaviour() {
        const userInfo: any = localStorage.getItem("taploginInfo");
        if (userInfo) {
            const USER_ACCOUNT: any = JSON.parse(userInfo);

            if (Object.keys(userInfo).length) {
                // this._dd.getHomeFavorites(USER_ACCOUNT.id).subscribe((res: any) => {
                //     if (res.code == 1) {
                //         this.DEC_SER.getDecryptedData(res?.result);
                //         let decryptData = JSON.parse(this.DEC_SER.decryptData);
                //         if (decryptData.watchlist.content_ids.includes(this.AudioData.id)) {


                //             this.DialogData.behaviour.favorite = 1
                //         } else {
                //             this.DialogData.behaviour.favorite = 0
                //         }
                //     }
                // });
            }
        }

    }


    openPlaylist() {
        this.dialog.open(AdultAgePopupComponent, {
            backdropClass: "popupBackdropClass",
            panelClass: "Playlistpop",
            width: "390px",
        });
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const divElement = document.querySelector(`.mob-slector`) as HTMLElement;

        if (divElement && !divElement.contains(clickedElement)) {
            this.currentValue = null
        }

        const divElementCheck = document.querySelector(`.three_dots`) as HTMLElement;

        if (divElementCheck && !divElementCheck.contains(clickedElement)) {
            this.currentValue = null
        }
    }

    openAddPlaylist(id: any) {
        // this.currentValue = id
        // if (id == this.currentValue) {
        //     $(`.options${id}`).toggle();
        // }

        if (this.currentValue === id) {
            setTimeout(() => {
                this.currentValue = null;
            }, 30);

        } else {
            setTimeout(() => {
                this.currentValue = id;
            }, 20);

        }

        console.log(this.currentValue);
        console.log(id);



        // this.addOutsideClickListener1();
    }

    addPlaylistContent(contentId: any, type: any) {
        this.dialog.open(AdultAgePopupComponent, {
            backdropClass: "popupBackdropClass",
            panelClass: "Playlistpop",
            width: "390px",
            data: { content_Id: contentId, getType: type },
        });
    }

    removePlaylist(contentId: any, index: any) {
        const formData = new FormData();
        formData.append("playlist_id", this.data['playlist_Id']);
        formData.append("content_id", contentId);
        formData.append("type", '1');
        formData.append("device", 'web');

        this._dd.editPlaylistContent(formData).subscribe((res: any) => {
            if (res.code == 1) {
                this.playlistData.filter((res: any) => {
                    if (res.id == contentId) {
                        this.playlistData.splice(index, 1)
                    }
                })
            }
        })

    }

    renamePlaylist() {
        this.dialog.open(ChechPinParentalComponent, {
            backdropClass: "popupBackdropClass",
            panelClass: "RenamePlaylist",
            width: "390px",
        });
    }

    deletePlaylist() {
        this.dialog.open(ParentalResetPasswordPopopComponent, {
            panelClass: "DeletePlaylist",
            width: "390px",
        })
    }

    sharePlaylist() {
        this.dialog.open(SocialParentalCreateComponent, {
            panelClass: "SharePlaylist",
            width: "390px",
        })
    }

    analytics() {
        this._dd.apipip().subscribe((res: any) => {
            let getId;
            let getTitle;
            if (this.mpdUrl.includes("mpd")) {
                this.currentTime = this.player1.currentTime();
                this.duration = this.player1.duration();
            } else {
                this.currentTime = this.player.getCurrentTime();
                this.duration = this.player.getDuration();
            }
            const taploginInfo = localStorage.getItem("taploginInfo");
            const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';

            const eventParams = {
                item_id: this.AudioData.id,
                duration_played: this.currentTime
            };
            this.analyticsService.logEvent('audio_stop', eventParams);
            const userInfo: any = localStorage.getItem("taploginInfo");
            if(this.AudioData.is_group == 1) {
               getId = this.audioSrc[this.itemget].sources[0].id
               getTitle = this.audioSrc[this.itemget].sources[0].title
            } else {
               getId = this.AudioData.id
               getTitle = this.AudioData.title
            }
            let analytics: any = {
                c_id: getId || "",
                dod: "",
                dd: "",
                type: 3,
                content_title: getTitle,
                total_duration: this.duration,
                pd: Math.floor(this.currentTime),
                age_group: "other",
                gender: "Male",
                network_provider: "Airtel",
                customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
                content_type: this.AudioData.content_type,
                impression: 0
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
            if (this.AudioData.is_group == 1) {
                formData.append("s_id", this.AudioData.season_id);
            }

            console.log('jiji');

            this._dd.analyticsSubmit(formData).subscribe((res: any) => {
                if (res.code == 1) {
                    console.log(res);

                    // this.ed.playDetailVideo.next(true);
                }
            });
        })
    }


    addOutsideClickListener() {
        var windowBody = window
        var popover = document.getElementById('playListClick') as HTMLDivElement;
        windowBody?.addEventListener('click', (event: any) => {
            if (event.target.className == 'dot-img') {

            } else if (event.target.className == 'dot-btn') {

            } else {

                this.playlistbtn = false
            }
        })
    }


    addOutsideClickListener2() {
        var windowBody = window
        var popover = document.getElementById('speedLevel') as HTMLDivElement;
        windowBody?.addEventListener('click', (event: any) => {
            if (event.target.className == 'speedIcon') {
            } else if (event.target.className == 'speedclick') {

            } else {
                $('#speedLevel').hide()
            }
        })
    }

    addOutsideClickListener1() {

        var mouse_is_inside = false;

        $(document).ready(function () {
            $('#getplayList').click(() => {
                $('.optionsAddPlaylist').show()
                mouse_is_inside = true;
            }, function () {
                mouse_is_inside = false;
            });

            $("body").mouseup(() => {
                $('.optionsAddPlaylist').hide()
                if (!mouse_is_inside) $('.form_wrapper').hide();
            });
        });
    }

    addLikes(watchers: any, content_id: any) {

        const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
        if (userIsLoggedIn == "1") {
            const userInfo: any = localStorage.getItem("taploginInfo") || {};
            const eventParams = {
                item_name: content_id.title,
                item_type: content_id.content_type,
                item_id: content_id.id,
                page_name: 'audio',
                series_id: content_id.series_id,
                season_id: content_id.season_id,
                item_value: content_id.acces_type,
            };
            this.analyticsService.logEvent('like_item', eventParams);
            if (Object.keys(userInfo).length && !this.likeInProgress) {
                this.likeInProgress = true;

                const formData = new FormData();
                formData.append("user_id", JSON.parse(userInfo).id);
                formData.append("like", watchers.toString());
                formData.append("content_id", content_id.id);

                this._dd.likeVeiwsCountPost(formData).subscribe((res) => {
                    if (res.code == 1) {
                        if (watchers == 1) {
                            this.totalLikes += 1;
                            this.DialogData.behaviour.likes = 1
                        } else {
                            this.totalLikes -= 1;
                            this.DialogData.behaviour.likes = 0
                        }
                    }
                    this.likeInProgress = false;
                }, (error) => {
                    this.likeInProgress = false;
                });
            }

            // const userInfo: any = localStorage.getItem("taploginInfo") || {};
            // if (Object.keys(userInfo).length) {
            //     const formData = new FormData();
            //     formData.append("user_id", JSON.parse(userInfo).id);

            //     formData.append("like", watchers);

            //     formData.append("content_id", content_id);
            //     this._dd.likeVeiwsCountPost(formData).subscribe((res) => {
            //         if (res.code == 1) {
            //             if (watchers == 1) {
            //                 this.totalLikes = this.totalLikes + 1
            //                 this.DialogData.behaviour.likes = 1
            //             } else {
            //                 this.totalLikes = this.totalLikes - 1
            //                 this.DialogData.behaviour.likes = 0
            //             }
            //         }
            //     });
            // }
        } else if (!userIsLoggedIn) {
            const dialogRef = this.dialog.open(LoginModalDialogComponent, {
                backdropClass: "popupBackdropClass",
                panelClass: "logindialog",
                width: "390px",
                data: { name: "login" },
            });
            dialogRef.disableClose = true;
        }
    }


    getLikesData(id: any) {
        this._dd.getUserData(id).subscribe((res: any) => {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.totalCountLikes = decryptData
            if (this.AudioData.is_group == 0) {
                this.totalLikes = decryptData.Content_Data.total_likes
                this.totalViews = decryptData.Content_Data.total_views
                if (decryptData.Content_Data.is_liked == 1) {
                    this.DialogData.behaviour.likes = 1
                } else {
                    this.DialogData.behaviour.likes = 0
                }
                if (decryptData.Content_Data.is_favorite == 1) {
                    this.DialogData.behaviour.favorite = 1
                } else {
                    this.DialogData.behaviour.favorite = 0
                }
            } else {
                this.totalLikes = decryptData.Season_Data.total_likes
                this.totalViews = decryptData.Season_Data.total_views
                if (decryptData.Season_Data.is_liked == 1) {
                    this.DialogData.behaviour.likes = 1
                } else {
                    this.DialogData.behaviour.likes = 0
                }
                if (decryptData.Season_Data.is_favorite == 1) {
                    this.DialogData.behaviour.favorite = 1
                } else {
                    this.DialogData.behaviour.favorite = 0
                }
            }
        })
    }
    sharing(type: string, url: any) {
        const eventParams = {
            item_name: url.title,
            item_type: url.content_type,
            item_id: url.id,
        };
        this.analyticsService.logEvent('share', eventParams);
        const newLocal = "width=600,height=300";
        const share_url = 'url';
        if (type === "fb") {
            let link = `https://www.facebook.com/sharer/sharer.php?&u=${share_url}`
            window.open(link, "Facebook", newLocal);
        } else if (type === "tweet") {
            let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=Altt%0A${'url'}`;
            window.open(urls, "TwitterWindow", newLocal);
        } else if (type === "copy") {
            navigator.clipboard.writeText(`${share_url}`);
        }
    }
    leadSquare() {
        let dateObj = new Date();
        let month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2);
        let day = ('0' + dateObj.getUTCDate()).slice(-2);
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
        this._dd.leadSquare(requestData).subscribe((res: any) => {

        })
    }
    ngOnDestroy() {
        if (this.progressSubscription) {
            this.progressSubscription.unsubscribe();
        }
        if (this.AudioData.radio != "true" && this.isOttLoggedIn) {
            this.analytics();
        }



        // firebase.analytics().logEvent('AUDIO_ACTION', {
        //     'itemName': this.AudioData.title,
        //     'itemType': this.AudioData.content_type,
        //     'itemId': this.AudioData.id,
        //     'action': 'end'
        // })
        setTimeout(() => {
            this.player1.dispose()
            this.player.destroy()
            this.player1 = null;
            this.player = null;
        }, 1000);


    }

}
