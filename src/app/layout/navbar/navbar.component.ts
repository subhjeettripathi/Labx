import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from "@angular/material/dialog";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { EmailDialogComponent } from "src/app/shared/dialogBoxes/email-dialog/email-dialog.component";
import { OtpDialogComponent } from "src/app/shared/dialogBoxes/otp-dialog/otp-dialog.component";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { HomepageComponent } from "src/app/@core/homepage/homepage.component";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { MatMenuTrigger } from "@angular/material/menu";
import { TokenService } from "src/app/services/interceptor/token.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { CountryRestrictionComponent } from "src/app/shared/dialogBoxes/country-restriction/country-restriction.component";
import { ContactusModalDialogComponent } from "src/app/shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component";
declare var $: any;
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  logoChange: boolean = true;
  @HostListener("window:scroll", ["$event"])
  doSomething(event: any) {
    if (window.pageYOffset > 100) {
      this.logoChange = false;
    } else {
      this.logoChange = true;
    }
  }
  activeIndex = 0;
  taploginInfo: any = localStorage.getItem("taploginInfo") || {};
  isMobileToggled = false;
  isHambergerMenu = false;
  navbarItems: any[] = [];
  categoryId: any;
  defaultImages: any = [];
  dd: any;
  nextdata: any = [];
  ad_data: any = [];
  dataNav: any[] = [];
  rightMenu = [];
  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger: any;
  display_offset: number = 0;
  display_limit: number = 4;
  cat_id: any;
  homeData = [];
  user: any;
  menuOn?: any;
  check = true;
  signinEnable: any;
  signinIcon: any;
  signin_title: any;
  headerBuck: any;
  navbar: any = [];
  is_loginInfo = false;
  showSubscribe = true;
  visitorId: any = localStorage.getItem('device_id')
  hamBanner: any;
  app_version: any;
  selectedItem: any = localStorage.getItem("active") || "HOME";
  wasClicked = false;
  UserData: any;
  isSubscriber = false;
  USER_ACCOUNT_id: any;
  userStatus: any;
  session_gender: any;
  
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  @Input() isOttLoggedIn: boolean | undefined;
  @Input() isSubscribed: boolean | undefined;
  @Input() isParentalLocked1: boolean | undefined;
  @Output() isLoggedInforLayout = new EventEmitter<boolean>();
  @Output() logginginevent = new EventEmitter<boolean>();
  @Output() loadedData = new EventEmitter<boolean>();
  profileLogout: boolean | undefined;
  abc: any;
  ff: any;
  offersData: any;
  offers: any;
  hideNav: boolean = false;
  isHovered: boolean = false;
  @ViewChild("signoutConfirmationModal")
  signoutConfirmationModal!: TemplateRef<any>;
  private signoutConfirmationDialogRef!: MatDialogRef<TemplateRef<any>>;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  baseJson: any = [];
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private ds: DataService,
    private dep_ser: DecryptService,
    private ed: ExchangeDataService,
    private _ar: ActivatedRoute,
    private homeservice: HomeCategoryUtilsService,
    private eds: ExchangeDataService,
    private fc: FunctionCallingService,
    private _FPS: FingerPrintService,
    private tokenService: TokenService,
    private deviceService: DeviceDetectorService
  ) {
    this.getNavbarData();
    if (this.isOttLoggedIn) {
    }
    this.fc.logoutProfile.subscribe((value) => {
      if (value == true) {
        this.logout();
      }
    });
    this.fc.loginModal.subscribe((value) => {
      if (value == true) {
        this.openDialog();
      }
    });
    this.ed.active.subscribe((value) => {
      if (value != "") {
        this.selectedItem = value;
      }
    });
    this.ed.humburgerhide.subscribe((value) => {
      this.isMobileToggled = false;
    });
    this.ed.hideNav.subscribe((value) => {
      this.hideNav = value;
    });
  }

  @Input()
  homeComponent!: HomepageComponent;

  ngOnInit(): void {
    localStorage.removeItem('AdUrl')
    // this.jsondata()
    this.getHeaderConfig();
    this.getJsonPopup();
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => {
      this.visitorId = r;
      const deviceId = localStorage.getItem('device_id');
      if (!deviceId || deviceId === '' || deviceId === 'undefined' || deviceId === null) {
        localStorage.setItem('device_id', this.visitorId);
      }
      const device_Id = String(deviceId || 'unknown');
      window.posthog.reset(true);
      window.posthog.register({ device_id: deviceId });
    });

    if (localStorage.getItem("taploginInfo") != null) {
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
    }
    const userId = String(this.USER_ACCOUNT_id?.id || 'guest');
    window.posthog.reset(true);
    window.posthog.identify(userId);



    if (Object.keys(this.taploginInfo).length) {
      this.is_loginInfo = true;
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      this.UserData = USER_ACCOUNT.first_name
        ? USER_ACCOUNT.first_name + " " + USER_ACCOUNT.last_name
        : USER_ACCOUNT.email
          ? USER_ACCOUNT.email
          : USER_ACCOUNT.contact_no;
    } else {
      this.is_loginInfo = false;
    }
    this.onWindowSizeCheck();

    this.homeservice.castUser.subscribe((user) => (this.user = user));
    this.app_version = localStorage.getItem("appVersion");
    this.selectedItem = localStorage.getItem("active");
  }


  adUrl() {

    this.ds.getAdsApi().subscribe((res: any) => {

      if (res.code == 1) {
        this.dep_ser.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.dep_ser.decryptData);
        console.log(decryptData, "hjkjhghjkjgf")
        localStorage.setItem('AdUrl', JSON.stringify(decryptData))
      }
    })
  }

  onHover(state: boolean) {
    this.isHovered = state;
  }

  getJsonPopup() {
    this.ds.popupJson().subscribe((res: any) => {
      this.baseJson = res.PopupList[0];
      console.log(this.baseJson);
    });
  }
  ngAfterViewInit(): void { }
  getNavbarData() {
    this.tokenService.getTokenInfo().subscribe((res: any) => {
      this.tokenService.saveToken(res.result);
      this.ds.getCategoryList().subscribe((res: any) => {
        this.dep_ser.getDecryptedData(res?.result);
        let getDecryptData = JSON.parse(this.dep_ser.decryptData);
        this.navbarItems = getDecryptData.cat.vod;
        this.dataNav = this.navbarItems;
        console.log(this.dataNav);
        this.loadedData.emit(true);
        localStorage.setItem("navbarData", JSON.stringify(this.dataNav));
      });
    });

  }

  cfh() {
    this.logout();
  }
  getHeaderConfig() {
    this.ds.faqData().subscribe((res: any) => {
      localStorage.setItem("jsonPlayer", JSON.stringify(res));
      localStorage.setItem("faqData", JSON.stringify(res));
      if (res?.Player[0]?.google_ads?.is_allow == 1) {
        this.adUrl()
      }

      for (let i in res.Website[0].side_menu) {
        if (res.Website[0].side_menu[i].is_allow == 1) {
          this.nextdata.push(res.Website[0].side_menu[i]);
          console.log(this.nextdata);
        }
      }
      // this.nextdata = res.Website[0].side_menu;

      this.defaultImages = res.Website[0].default_images;

      localStorage.setItem("defaultImages", JSON.stringify(this.defaultImages));

      this.navbar = res.Website[0].navbar;
      this.offersData = res.App[0].menu;

      this.offers = this.offersData.find((x: any) => x.type == "offers");

      this.navbar.filter((data: any) => {
        if (data.type == "ads") {
          this.ad_data = data;
        }
      });

      this.hamBanner = res.Website[0];
    });
  }
  activate() {
    if (this.isSubscribed) {
      this.router.navigate(["activation"]);
    } else {
      this.ed.pauseDetailVideo.next(true);
      const dialogRef = this.dialog.open(ContactusModalDialogComponent, {
        panelClass: "premium",
        backdropClass: 'popupBackdropClass',
        width: "450px",
      });
    }

    this.isMobileToggled = !this.isMobileToggled;
    $("body").css("overflow", "auto");
  }
  hideData() {

    this.isMobileToggled = !this.isMobileToggled;
    $("body").css("overflow", "auto");

  }
  getAllCatData(menu: any, link: any, name: any, cat: any) {
    localStorage.removeItem("packcheking");
    localStorage.removeItem("newuser");
    localStorage.setItem("active", cat);
    var item = localStorage.getItem("active");
    this.selectedItem = item;
    // let currentUrl = this.router.url

    $("body").css("overflow", "auto");
    localStorage.setItem("active", cat);
    var item = localStorage.getItem("active");
    this.selectedItem = item;
    scroll(0, 0);
    if (cat.toUpperCase() == "HOME") {
      localStorage.setItem("refresh", "1");
      this.router.navigate(["/"]);
    } else {
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate(["/" + link]);
      });
    }
  }

  gotoClearOffers() {
    localStorage.removeItem("packcheking");
    localStorage.removeItem("newuser");
  }

  toggleNavbar() {
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('SIDE_MENU_ITEM_OPEN', {
        click: 'sidemenuicon'
      });
    }
    if (this.isMobileToggled == true) {
      $("body").css("overflow", "auto");
      if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
        window.firebaseAnalytics.logEvent('SIDE_MENU_ITEM_CLOSED', {
          click: 'sidemenuicon'
        });
      }
    } else {
      $("body").css("overflow", "hidden");
    }
    this.eds.hideMemberAlert.next(true);
    this.isMobileToggled = !this.isMobileToggled;
    if (Object.keys(this.taploginInfo).length) {
      this.is_loginInfo = true;
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);

      this.UserData = USER_ACCOUNT.first_name
        ? USER_ACCOUNT.first_name + " " + USER_ACCOUNT.last_name
        : USER_ACCOUNT.email
          ? USER_ACCOUNT.email
          : USER_ACCOUNT.contact_no;
    } else {
      this.is_loginInfo = false;
    }
  }
  onClickMove(type: any) {
    //  let currentUrl = this.router.url
    localStorage.removeItem("packcheking");
    localStorage.removeItem("newuser");
    localStorage.setItem("active", type);
    var item = localStorage.getItem("active");
    this.selectedItem = item;

    if (type == "search") {
      this.router.navigate(["/search"]);
      localStorage.removeItem("packcheking");
      localStorage.removeItem("newuser");
    } else if (type == "subscribe") {
      localStorage.removeItem("woohoo");
      this.router.navigate(["/subscribe"]);

      // this.router.navigate(["/subscribe"]);
      localStorage.removeItem("packcheking");
      localStorage.removeItem("newuser");
      this.gotoSubscribePage();
    } else if (type == "feels") {
     
     if(!this.isOttLoggedIn){
         const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "420px",
        data: { name: "login" },
      });
      }
      else{
      this.router.navigate(["/vives"]);

      }
    }
  }

  searchNavigate() {
    this.router.navigate(["/search"]);
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('MENU_SEARCH', {
        click: 'MENU_SEARCH'
      });
    }
    localStorage.removeItem("packcheking");
    localStorage.removeItem("newuser");
  }
  navigate(items: any) {
    window.scroll(0, 0);
    localStorage.setItem("active", "account");
    var item = localStorage.getItem("active");
    this.selectedItem = item;
  }
  @HostListener("window:resize")
  onWindowResize() {
    this.onWindowSizeCheck();
  }
  onWindowSizeCheck() {
    if (window.innerWidth > 962) {
      this.isMobileToggled = false;
      this.isHambergerMenu = false;
    } else {
      // this.isMobileToggled = true;
      this.isHambergerMenu = true;
    }
  }

  setActive(index: number) {
    this.activeIndex = index;
  }

  handleAccountClick(event: Event) {
    if (this.isOttLoggedIn) {
      this.router.navigate(["/account"]);
    } else {
      let xc = window.innerWidth;
      localStorage.setItem("videoPlay", "1");
      localStorage.setItem("videoCarousel", "1");

      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "420px",
        data: { name: "login" },
      });

      const sub = dialogRef.componentInstance.isLoggedIn.subscribe(
        (data: any) => {
          this.is_loginInfo = data;
          this.isLoggedInforLayout.emit(data);
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (localStorage.getItem("VideoAutoPlay") == "0") {
          this.ed.pauseDetailVideo.next(false);
        }
        localStorage.setItem("videoCarousel", "0");
        localStorage.setItem("videoPlay", "0");

        const taplogininfo: any = localStorage.getItem("taploginInfo");
        const USER_ACCOUNT: any = JSON.parse(taplogininfo);
        this.UserData = USER_ACCOUNT?.first_name
          ? USER_ACCOUNT?.first_name + " " + USER_ACCOUNT?.last_name
          : USER_ACCOUNT?.email
            ? USER_ACCOUNT?.email
            : USER_ACCOUNT?.contact_no;
      });
    }
  }
  handleWatchlistClick(event: Event) {
    if (this.isOttLoggedIn) {
      this.router.navigate(["/watchlist"]);
    } else {
      let xc = window.innerWidth;
      localStorage.setItem("videoPlay", "1");
      localStorage.setItem("videoCarousel", "1");

      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "420px",
        data: { name: "login" },
      });

      const sub = dialogRef.componentInstance.isLoggedIn.subscribe(
        (data: any) => {
          this.is_loginInfo = data;
          this.isLoggedInforLayout.emit(data);
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (localStorage.getItem("VideoAutoPlay") == "0") {
          this.ed.pauseDetailVideo.next(false);
        }
        localStorage.setItem("videoCarousel", "0");
        localStorage.setItem("videoPlay", "0");

        const taplogininfo: any = localStorage.getItem("taploginInfo");
        const USER_ACCOUNT: any = JSON.parse(taplogininfo);
        this.UserData = USER_ACCOUNT?.first_name
          ? USER_ACCOUNT?.first_name + " " + USER_ACCOUNT?.last_name
          : USER_ACCOUNT?.email
            ? USER_ACCOUNT?.email
            : USER_ACCOUNT?.contact_no;
      });
    }
  }

  // open login dialog
  openDialog() {
    // if (dialogtype === "signin") {
    this.openLoginDialog();
    // this.router.navigateByUrl("/");
    // }
  }
  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }
  closeMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
  }
  close() {
    this.signoutConfirmationDialogRef.close();
  }
  openLoginDialog(): void {
    let xc = window.innerWidth;
    localStorage.setItem("videoPlay", "1");
    localStorage.setItem("videoCarousel", "1");
    if (xc < 576) {
      if (this.isMobileToggled == true) {
        $("body").css("overflow", "auto");
      } else {
        $("body").css("overflow", "hidden");
      }
      this.eds.hideMemberAlert.next(true);
      this.isMobileToggled = !this.isMobileToggled;
    }

    this.ed.pauseDetailVideo.next(true);
    localStorage.setItem("videoCarousel", "1");
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "logindialog",
      width: "420px",
      data: { name: "login" },
    });

    const sub = dialogRef.componentInstance.isLoggedIn.subscribe(
      (data: any) => {
        this.is_loginInfo = data;
        this.isLoggedInforLayout.emit(data);
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem("VideoAutoPlay") == "0") {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
      localStorage.setItem("videoPlay", "0");

      const taplogininfo: any = localStorage.getItem("taploginInfo");
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      this.UserData = USER_ACCOUNT?.first_name
        ? USER_ACCOUNT?.first_name + " " + USER_ACCOUNT?.last_name
        : USER_ACCOUNT?.email
          ? USER_ACCOUNT?.email
          : USER_ACCOUNT?.contact_no;
    });
  }
  gotoOffers() {
    localStorage.removeItem("packcheking");
    localStorage.removeItem("newuser");
    this.router.navigate(["/offers"]);
    this.selectedItem = "offers";
    localStorage.setItem("active", "offers");
  }
  gotoOffersMobile() {
    localStorage.removeItem("packcheking");
    localStorage.removeItem("newuser");
    this.router.navigate(["/offers"]);
    this.selectedItem = "offers";
    $("body").css("overflow", "auto");
    localStorage.setItem("active", "offers");
    scroll(0, 0);
  }
  isLoggedInEvent(e: boolean) {
    this.is_loginInfo = e;
    this.isLoggedInforLayout.emit(e);
  }
  openEmailDialog(input: string): void {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: "390px",
      data: { email: input },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  openOttDialog(): void {
    const dialogRef = this.dialog.open(OtpDialogComponent, {
      width: "390px",
      data: { name: "login" },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openNav(type: any) {
    localStorage.removeItem("packcheking");
    localStorage.removeItem("newuser");
    $("body").css("overflow", "auto");
    switch (type) {
      case "subscribe":
        this.router.navigate(["/subscribe"]);
        window.scroll(0, 0);

        this.gotoSubscribePage();
        break;
      case "notification":
        this.router.navigate(["/notification"]);
        window.scroll(0, 0);
        break;
      case "settings":
        this.router.navigate(["/account"]);
        window.scroll(0, 0);
        break;
      case "faq":
        this.router.navigate(["/corporate"]);
        window.scroll(0, 0);
        break;
      case "about":
        this.router.navigate(["/about-us"]);
        window.scroll(0, 0);
        break;
      case "watchlist":
        this.router.navigate(["/watchlist"]);
        window.scroll(0, 0);
        break;
      case "subscriber":
        this.router.navigate(["/my-subscription"]);
        window.scroll(0, 0);
        break;
    }
    this.hideData();
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  openSignoutConfirmationDialog(): void {
    this.ed.pauseDetailVideo.next(true);
    localStorage.setItem("videoCarousel", "1");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = "dialog";
    dialogConfig.panelClass = "signoutConfirmation";
    dialogConfig.backdropClass = "popupBackdropClass";
    dialogConfig.width = "390px";
    this.signoutConfirmationDialogRef = this.dialog.open(
      this.signoutConfirmationModal,
      dialogConfig
    );
    this.router.events.subscribe(() => {
      this.signoutConfirmationDialogRef.close();
    });
  }
  signoutConfirmationclose() {
    this.signoutConfirmationDialogRef.close();
    if (localStorage.getItem("VideoAutoPlay") == "0") {
      this.ed.pauseDetailVideo.next(false);
    }
    localStorage.setItem("videoCarousel", "0");
  }

  formatDate(inputDate: any) {
    var date = new Date(inputDate);

    var day: any = date.getDate();
    var month: any = date.getMonth() + 1;
    var year: any = date.getFullYear();
    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var seconds: any = date.getSeconds();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var formattedDate =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    return formattedDate;
  }

  logout() {
    const taplogininfo: any = localStorage.getItem("taploginInfo") || {};
    const userSessions: any = localStorage.getItem("ipSaveData") || {};
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const USER_SESSION: any = JSON.parse(userSessions);
    const subscribe: any = localStorage.getItem("is_subscriber") || {};
    if (subscribe == 1) {
      this.userStatus = "Subscribed";
    } else {
      this.userStatus = "Registered";
    }

    if (USER_ACCOUNT.gender == "") {
      this.session_gender = "others";
    } else {
      this.session_gender = USER_ACCOUNT.gender;
    }

    const formData: any = new FormData();
    formData.append("user_id", USER_ACCOUNT.id);
    formData.append("type", 1);
    formData.append("device_unique_id", localStorage.getItem('device_id'));
    this.ds.logout(formData).subscribe((res) => {
      if (res.code == 1) {
        this.dialog.closeAll();
        this.ed.alreadySubscriber.next(false);
        this.ed.isSubscribe.next(false);
        this.ed.isUserLoggedIn.next(false);
        this.ed.isUserLoggedInModal.next(false);
        this.ed.reload.next(false);
        this.isLoggedInforLayout.emit(false);
        localStorage.removeItem("ott_subtitle_setup");
        localStorage.removeItem("taploginInfo");
        localStorage.removeItem("ott_isLoggedIn");
        localStorage.removeItem("ott_consent");
        localStorage.removeItem("ott_subscriptionPlan");
        localStorage.removeItem("subscribeInfo");
        localStorage.removeItem("is_subscriber");
        localStorage.removeItem("isParentalSet");
        localStorage.removeItem("parentalControl");
        localStorage.removeItem("otpForgotId");
        localStorage.removeItem("emailVerified");
        localStorage.removeItem("otpForgotId");
        localStorage.removeItem("emailSavedCaseMobile");
        localStorage.removeItem("profileUpdates");
        localStorage.removeItem("taploginInfo1");
        localStorage.removeItem("ottParental");
        localStorage.removeItem("toggle_status");
        localStorage.removeItem("deviceLimit");
        localStorage.removeItem("isParentalRestriction");
        localStorage.removeItem("isOverAge");
        localStorage.removeItem("subtitle");
        localStorage.removeItem("restrictionTitle");
        localStorage.removeItem("setCase2Parental");
        localStorage.removeItem("setCase2Parental");
        localStorage.removeItem("check_sms");
        localStorage.removeItem("check_email");
        localStorage.removeItem("check_push");
        localStorage.removeItem("check_whatsapp");
        localStorage.removeItem("regional");
        localStorage.removeItem("jsonPlayer");
        localStorage.removeItem("loginShow");
        localStorage.removeItem("deleteAccount");
        localStorage.removeItem("pkgData");
        // localStorage.removeItem("device_id");
        localStorage.removeItem("packcheking");
        localStorage.removeItem("cancelKey");
        const userId = String(this.USER_ACCOUNT_id?.id || 'guest');
        window.posthog.reset(true);
        window.posthog.identify(userId);
        console.log(userId, "kjsl")
        if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
          window.firebaseAnalytics.logEvent('LOGOUT', {
            userId: USER_ACCOUNT.id
          });
        }
        
        if (this.router && this.router.url === "/") {
          window.location.reload();
        } else {
          this.router.navigate(["/"]);

        }
      }
    });

    var inputDate = new Date();
    var formattedDate = this.formatDate(inputDate);

    const formData1: any = new FormData();
    formData1.append("customer_id", USER_ACCOUNT.id);
    formData1.append("type", "end");
    formData1.append("time", formattedDate);
    formData1.append("device_unique_id", this.visitorId);
    formData1.append("device_type", this.deviceService.deviceType);
    formData1.append("content_type", "vod");
    formData1.append(
      "customer_name",
      USER_ACCOUNT.first_name + "" + USER_ACCOUNT.last_name
    );
    formData1.append("country", USER_SESSION.countryName);
    formData1.append("country_code", USER_SESSION.countryCode);
    formData1.append("network_type", USER_SESSION.security.network);
    formData1.append("network_provider", USER_SESSION.connection.isp);
    formData1.append("platform", this.deviceService.deviceType);
    formData1.append("browser", this.deviceService.browser);
    formData1.append(
      "screen_resolution",
      window.screen.availWidth + "*" + window.screen.availHeight
    );
    formData1.append("os_version", USER_SESSION.userAgent.browserVersion);
    formData1.append("age_group", USER_ACCOUNT.age_group);
    formData1.append("gender", this.session_gender);
    formData1.append("city", "others");
    this.ds.userSession(formData1).subscribe((res: any) => {
      if (res.code == 1) {
      }
    });
  }

  openParentalControlDialog(): void {
    this.ed.openSettingAccount.next(true);
  }
  clickNotification() {
    this.router.navigate(["/notification"]);
  }
  buttonEnter(trigger: any) {
    setTimeout(() => {
      if (this.prevButtonTrigger && this.prevButtonTrigger != trigger) {
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        trigger.openMenu();
      } else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
        trigger.openMenu();
      } else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
      }
    });
  }

  buttonLeave(trigger: any) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
      }
      if (!this.isMatMenuOpen) {
        trigger.closeMenu();
      } else {
        this.enteredButton = false;
      }
    }, 3000000);
  }
  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave() {
    setTimeout(() => {
      this.menuTrigger.closeMenu();
    }, 1000000);
  }

  gotoSubscribePage() {
    if (localStorage.getItem("taploginInfo") === null) {
    } else {
      const taplogininfo: any = localStorage.getItem("taploginInfo") || {};
      this.USER_ACCOUNT_id = JSON.parse(taplogininfo) || {};
      var userage: any = new Date(this.USER_ACCOUNT_id.dob) || {};
      var currentage: any = new Date() || {};
      var newage: any = new Date(currentage) || {};
      var age: any = newage - userage || {};
    }
  }
}
