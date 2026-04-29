import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { videoJs } from "src/app/video-player/videojs";
import { CountryLockPopupComponent } from 'src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit, OnDestroy {
  player!: any;
  muted: boolean = true;
  played: boolean = true;
  currentTime: any;
  duration: any
  upgradePlan: any;
  selectedPlan: any;
  days: number = 0;
  hours: string = '00';
  minutes: string = '00';
  safeDescription: any;
  seconds: string = '00';
  isOttLoggedIn = false;
  hideicon: boolean = true;
  taploginInfo: any = localStorage.getItem('taploginInfo') || {};
  private intervalId: any;
  package_id: any
  highlightDes:any;
  testimonialDes:any;
  footerDes:any;
  // private targetDate: Date = new Date();
  targetDate: Date = new Date();
  constructor(
    private router: Router,
    private ed: ExchangeDataService,
    private dialog: MatDialog,
    private _ar: ActivatedRoute,
    private ds: DataService,
    private sanitizer: DomSanitizer
  ) {
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value
      }
    });
  }
  ngOnInit(): void {
    // window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    this._ar.queryParams.subscribe((params) => {
      this.package_id = params['id']
    });
    this.targetDate.setDate(this.targetDate.getDate() + 3); // 3 days ahead
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);

    this.getConfigData();
  }

  ngAfterViewChecked(): void {

    if (!this.player) {
      const isMobile = window.innerWidth <= 992;
      const element = document.getElementById('playerss') as HTMLVideoElement;

      if (element) {
        if (!this.upgradePlan?.promo_url) {
          if (this.upgradePlan?.plan_banner) {
            element.setAttribute("poster", this.upgradePlan?.plan_banner);
          }
          return;
        }

        setTimeout(() => {
          this.player = videoJs(element, {
            controls: false,
            autoplay: true,
            muted: true,
            loop: true,
            preload: 'auto',
            playsinline: true
          });

          this.player.src({
            src: this.upgradePlan.promo_url,
            type: 'application/x-mpegURL'
          });

          this.player.poster(this.upgradePlan?.plan_banner);
          this.player.play();
        }, 0);
      }
    }
  }


  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (this.player) {
      this.player.dispose();
    }

    this.selectedPlan = ''
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;
    if (distance < 0) {
      this.days = 0;
      this.hours = '00';
      this.minutes = '00';
      this.seconds = '00';
      clearInterval(this.intervalId);
      return;
    }

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = this.padZero(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    this.minutes = this.padZero(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    this.seconds = this.padZero(Math.floor((distance % (1000 * 60)) / 1000));
  }
  goToPayment(data: any) {
    this.ds.apipip().subscribe((res: any) => {
      const detail = res.countryCode;
      if (detail === 'IN') {
        if (data.package.price !== "") {
          if (this.isOttLoggedIn) {
            this.router.navigate(['/subscribe'], { queryParams: { promotion: data.package.id } });
          } else {
            const dialogRef = this.dialog.open(LoginModalDialogComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'logindialog',
              width: "390px",
              data: { name: "login" },
            });
            dialogRef.disableClose = true;
          }
        } else {
          if (this.dialog.openDialogs.length === 0) {
            const dialogRef = this.dialog.open(CountryLockPopupComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'adultAgePopup',
              width: "390px",
            });
          }
        }
      } else {
        if (data.package.ROW_price && data.package.ROW_price !== "") {
          if (this.isOttLoggedIn) {
            this.router.navigate(['/subscribe'], { queryParams: { promotion: data.package.id } });
          } else {
            const dialogRef = this.dialog.open(LoginModalDialogComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'logindialog',
              width: "390px",
              data: { name: "login" },
            });
            dialogRef.disableClose = true;
          }
        } else {
          if (this.dialog.openDialogs.length == 0) {

            const dialogRef = this.dialog.open(CountryLockPopupComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'adultAgePopup',
              width: "390px",

            });
          }

        }
      }
    });
  }
  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }
  startCountdown(): void {
    this.updateCountdown(); // initial call
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }
  getConfigData() {
    this.ds.faqData().subscribe((res: any) => {
      localStorage.setItem('faqData', JSON.stringify(res))
      this.upgradePlan = res.App[0].settings[0].upgrade_plan;
      console.log(this.upgradePlan);
      this.highlightDes = this.sanitizer.bypassSecurityTrustHtml(this.upgradePlan?.highlight_plan?.description)
      this.testimonialDes=this.sanitizer.bypassSecurityTrustHtml(this.upgradePlan?.testimonial?.description)
      this.footerDes = this.sanitizer.bypassSecurityTrustHtml(this.upgradePlan?.footer?.description)
      this.upgradePlan.basic_plan.plans =
        this.upgradePlan.basic_plan.plans.map((plan:any) => ({
          ...plan,
          safeDescription: this.sanitizer.bypassSecurityTrustHtml(plan.description)
        }));

      // this.selectedPlan = this.upgradePlan.plans.find(
      //   (plan: any) => plan.package.id === this.package_id
      // );

      if (this.upgradePlan?.promo_end_date) {
        this.targetDate = new Date(this.upgradePlan?.promo_end_date + 'T23:59:59'); // End of day
        this.startCountdown();
      }
      // if (!this.selectedPlan.promo_url || this.selectedPlan.promo_url == '') {
      //   this.hideicon = false
      // }
    });
  }


  mute() {
    this.player.muted(true);
    if (this.player.muted()) {
      this.muted = true;
      this.player.volume(0);
    }
  }

  unmute() {
    this.dialog.closeAll();
    this.player.muted(false);
    if (!this.player.muted()) {
      this.muted = false;
      this.player.volume(1);
    }
  }

  isPlaying = true;  // default state

  togglePlayPause() {
    if (this.isPlaying) {
      this.player.pause();
    } else {
      this.player.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  setDuration() {
    this.duration = this.player.duration();

  }

  updateTime() {
    this.currentTime = this.player.currentTime();
  }

  formatTime(time: number): string {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

}
