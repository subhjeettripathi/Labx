import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild, } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogRef, MatDialogConfig, } from "@angular/material/dialog";
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
import { RegionalComponent } from 'src/app/shared/dialogBoxes/regional/regional.component';
import { ContactusModalDialogComponent } from "src/app/shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component";
import * as firebase from "firebase/app";
import { Title } from "@angular/platform-browser";
import { ParentalControlComponent } from "src/app/shared/dialogBoxes/parental-control/parental-control.component";
import { AnalyticsService } from "src/app/services/analytics.service";
import { TranslatePipe } from "src/app/services/pipes/translate.pipe";
import { TranslationService } from 'src/app/services/translation.service';
declare var $: any;
declare var google: any;
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  selected: any = localStorage.getItem('tongue') || {};
  logoChange: boolean = true;
  @HostListener("window:scroll", ["$event"])
  doSomething(event: any) {
    if (window.pageYOffset > 100) {
      this.logoChange = false
    } else {
      this.logoChange = true
    }
  }


  // mains = [

  //   { "code": "en", "language": "English" },
  //   { "code": "bg", "language": "Bulgarian" },
  //   { "code": "bn", "language": "Bengali" },
  //   { "code": "de", "language": "German" },
  //   { "code": "es", "language": "Spanish" },
  //   { "code": "ja", "language": "Japanese" },
  //   { "code": "or", "language": "Odia" },
  //   { "code": "pa", "language": "Punjabi" },
  //   { "code": "zh-CN", "language": "Chinese" },
  //   { "code": "te", "language": "Telugu" },
  //   { "code": "ta", "language": "Tamil" },
  //   { "code": "sr", "language": "Serbian" },
  //   { "code": "pt-BR", "language": "Brazilian" },
  //   { "code": "nl", "language": "Dutch" },
  //   { "code": "mr", "language": "Marathi" },
  //   { "code": "ml", "language": "Malayalam" },
  //   { "code": "kn", "language": "Kannada" },
  //   { "code": "hu", "language": "Hungarian" },
  //   { "code": "hi", "language": "Hindi" },
  //   { "code": "gu", "language": "Gujarati" },
  //   { "code": "fr", "language": "French" }


  // ];


  mains = [
    { "code": "bn", "language": "Bengali" },
    { "code": "pt-BR", "language": "Brazilian" },
    { "code": "bg", "language": "Bulgarian" },
    { "code": "zh-CN", "language": "Chinese" },
    { "code": "nl", "language": "Dutch" },
    { "code": "en", "language": "English" },
    { "code": "fr", "language": "French" },
    { "code": "de", "language": "German" },
    { "code": "gu", "language": "Gujarati" },
    { "code": "hi", "language": "Hindi" },
    { "code": "hu", "language": "Hungarian" },
    { "code": "ja", "language": "Japanese" },
    { "code": "kn", "language": "Kannada" },
    { "code": "ml", "language": "Malayalam" },
    { "code": "mr", "language": "Marathi" },
    { "code": "or", "language": "Odia" },
    { "code": "pa", "language": "Punjabi" },
    { "code": "sr", "language": "Serbian" },
    { "code": "es", "language": "Spanish" },
    { "code": "ta", "language": "Tamil" },
    { "code": "te", "language": "Telugu" }
  ];

  taploginInfo: any = localStorage.getItem("taploginInfo") || {};
  regional: any
  sendTosettingSubtitle: any;
  loggedIn = false
  // mains: any = [];
  regionals: any;
  subtitle: any;
  isMobileToggled = false;
  stacking: any
  isHambergerMenu = false;
  navbarItems: any[] = [];
  categoryId: any;
  defaultImages: any = []
  dd: any;
  nextdata: any = [];
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
  showButton: boolean = false
  visitorId: any;
  hamBanner: any;
  selectedItem: any = localStorage.getItem("active")
  wasClicked = false;
  UserData: any;
  isSubscriber = false;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isShowButton: any = localStorage.getItem("showButton") || {};
  @Input() isOttLoggedIn: boolean | undefined;
  @Input() isSubscribed: boolean | undefined;
  @Input() isParentalLocked1: boolean | undefined;
  @Output() isLoggedInforLayout = new EventEmitter<boolean>();
  @Output() logginginevent = new EventEmitter<boolean>();
  @Output() loadedData = new EventEmitter<boolean>();
  profileLogout: boolean | undefined;
  abc: any;
  ff: any;
  hideNav: boolean = false
  @ViewChild("signoutConfirmationModal")
  signoutConfirmationModal!: TemplateRef<any>;
  private signoutConfirmationDialogRef!: MatDialogRef<TemplateRef<any>>;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  baseJson: any = [];
  is_subscribe: any;
  constructor(
    private dataService: DataService,
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
    private translateService: TranslationService,
    public translate: TranslationService,
    private titleService: Title,
    private fcs: FunctionCallingService,
    private analyticsService: AnalyticsService,

  ) {

    this.getNavbarData();
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.loggedIn = value
      }
    });
    this.fc.logoutProfile.subscribe((value) => {
      if (value == true) {
        this.logout();
      }
    });
    this.eds.showButton.subscribe((value) => {
      if (value == true) {
        this.showButton = true
      } else {
        this.showButton = false
      }
    });
    this.fc.loginModal.subscribe((value) => {
      if (value == true) {
        this.openDialog();
      }
    });
    this.ed.active.subscribe((value) => {
      if (value != '') {
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

    // At this point master JSON is guaranteed loaded
    // this.dataService.getMenus().subscribe(res => {
    //   console.log('Menus: ', res);
    // });

    const savedLang = localStorage.getItem('tongue');
    if (savedLang) {
      this.selected = savedLang;
      this.translateService.setLanguage(savedLang);
    } else {
      this.selected = 'en';
      this.translateService.setLanguage('en');
    }

    if (Object.keys(this.taploginInfo).length) {
      this.loggedIn = true;
      // const taplogininfo: any = localStorage.getItem("taploginInfo");
      // const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      // this.ds.getSubtitle(USER_ACCOUNT.id).subscribe((res: any) => {

      //   this.dep_ser.getDecryptedData(res?.result);
      //   let decryptData = JSON.parse(this.dep_ser.decryptData);
      //   const sendTosett = decryptData;
      //   localStorage.setItem("app_lang", sendTosett.payload.app_language);
      //   const languageMap: { [key: string]: string } = {
      //     'as': 'Assamese',
      //     'bn': 'Bengali',
      //     'bg': 'Bulgarian',
      //     'zh-CN': 'Chinese (Simplified)',
      //     'en': 'English',
      //     'fr': 'French',
      //     'de': 'German',
      //     'gu': 'Gujarati',
      //     'he': 'Hebrew',
      //     'hi': 'Hindi',
      //     'ja': 'Japanese',
      //     'kn': 'Kannada',
      //     'ko': 'Korean',
      //     'ml': 'Malayalam',
      //     'mr': 'Marathi',
      //     'mn': 'Mongolian',
      //     'or': 'Odia',
      //     'pa': 'Punjabi',
      //     'ru': 'Russian',
      //     'es': 'Spanish',
      //     'ta': 'Tamil',
      //     'te': 'Telugu'
      //   };

      //   const reverseLanguageMap: { [key: string]: string } = Object.keys(languageMap).reduce((acc, key) => {
      //     acc[languageMap[key].toLowerCase()] = key;
      //     return acc;
      //   }, {} as { [key: string]: string });
      //   setTimeout(() => {

      //     const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      //     if (selectElement) {
      //       if (sendTosett.payload.app_language != '' || sendTosett.payload.app_language != null) {
      //         const appLanguage = sendTosett.payload.app_language.toLowerCase();
      //         const languageCode = reverseLanguageMap[appLanguage];
      //         selectElement.value = languageCode;
      //         selectElement.dispatchEvent(new Event('change'));
      //         setTimeout(() => {
      //           selectElement.value = languageCode;
      //           selectElement.dispatchEvent(new Event('change'));
      //         }, 1000);

      //       }
      //     }
      //   }, 2000);
      // });
    } else {
      this.loggedIn = false;
    }
    // setTimeout(() => {
    //   this.addLanguageChangeListener();
    // }, 3500);
    localStorage.setItem('googleLang', '1')
    this.getLanguages()
    if (localStorage.getItem('googleLang') == '1') {

      setTimeout(() => {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&key=AIzaSyC2Yaupd3NMeg-UoC9fX4z6hHFRIZa9LKs';
        script.async = true;
        document.head.appendChild(script);

      }, 500);


    }

    if (this.isShowButton == '1') {
      this.showButton = true
    }
    this.getHeaderConfig();
    this.getJsonPopup()
    // this.jsondata()
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
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe((r) => (this.visitorId = r));
    this.onWindowSizeCheck();

    this.homeservice.castUser.subscribe((user) => (this.user = user));
    // for mini audio player
    localStorage.setItem('miniplay', '0')
  }
  gotToHome() {

    this.selectedItem = "HOME"
    this.router.navigateByUrl("/");
    this.dialog.closeAll();

  }
  getLanguages() {
    // this.ds.getLanguages().subscribe((res: any) => {
    //   this.mains = res.result
    //   console.log(this.mains);

    // });
  }
  // changeLang(event: any) {
  //   console.log(event.target.value);
  //   localStorage.setItem('tongue', event.target.value)
  //   this.selected = localStorage.getItem('tongue')
  //   location.reload()
  // }

  changeLang(event: any) {
    const langCode = event.target.value;
    localStorage.setItem('tongue', langCode);
    this.selected = langCode;
    this.translateService.setLanguage(langCode);
    // location.reload(); // optional: to reload translations everywhere
  }


  getJsonPopup() {
    this.ds.popupJson().subscribe((res: any) => {
      this.baseJson = res.PopupList[0]
    })
  }
  ngAfterViewInit(): void {

  }
  feedback() {
    const dialogRef = this.dialog.open(ParentalControlComponent, {
      panelClass: 'contactfooter',
      width: "390px",
      disableClose: false,
    });
  }
  getNavbarData() {
    this.tokenService.getTokenInfo().subscribe((res: any) => {
      this.tokenService.saveToken(res.result);
      this.ds.getMenus().subscribe((res: any) => {
        this.navbarItems.push(res['result'].category[0])
        for (let i in this.navbarItems) {
          if (this.navbarItems[i].category == null || this.navbarItems[i].category == undefined) {
            this.navbarItems[i].category = this.navbarItems[i].title
            this.navbarItems[i].category_type = this.navbarItems[i].title
          }
        }

        this.ds.getCategoryList(res['result'].category[1].id).subscribe((res: any) => {
          this.dep_ser.getDecryptedData(res?.result);
          let getDecryptData = JSON.parse(this.dep_ser.decryptData);
          console.log(getDecryptData);

          for (let i in getDecryptData.cat) {
            this.navbarItems.push(getDecryptData.cat[i]);
          }
          this.dataNav = this.navbarItems;
          console.log(this.dataNav)
          this.loadedData.emit(true);
          localStorage.setItem("navbarData", JSON.stringify(this.dataNav));
        });
      })

    });
  }
  cfh() {
    this.logout();
  }
  getHeaderConfig() {
    this.ds.faqData().subscribe((res: any) => {
      localStorage.setItem("jsonPlayer", JSON.stringify(res));
      this.nextdata = res.Website[0].side_menu;
      this.defaultImages = res.Website[0].default_images;
      localStorage.setItem('defaultImages', JSON.stringify(this.defaultImages))
      this.navbar = res.Website[0].navbar;
      this.hamBanner = res.Website[0];
      this.stacking = res.Others.package_stacking.subscribed.days
    });
  }

  hideData() {
    this.isMobileToggled = !this.isMobileToggled;
  }
  getAllCatData(menu: any, link: any, name: any, category: any) {
    this.titleService.setTitle(category)
    $("body").css("overflow", "auto");
    const taploginInfo = localStorage.getItem("taploginInfo");
    const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';

    const eventParams = {
      item_id: menu,
      item_name: category
    };
    this.analyticsService.logEvent('navbar_interaction', eventParams);
    localStorage.setItem("active", category);
    var item = localStorage.getItem("active");
    this.selectedItem = item;

    if (name.toUpperCase() == 'HOME') {
      localStorage.setItem("refresh", "1");
      this.router.navigate(["/"]);
    }
    else {
      this.ds
        .getHomeData(this.display_offset, this.display_limit, menu)
        .subscribe((res: any) => {
          this.dep_ser.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.dep_ser.decryptData);
          this.homeData = decryptData;
          this.homeservice.sendDataToComponent(this.homeData);
          const isSubscribe = localStorage.getItem("is_subscriber")
          console.log(this.homeData);
          if (name == 'ebook') {
            this.router.navigateByUrl(["aol/ebook/"] + menu)
          } else if (name == 'webcast') {
            this.router.navigateByUrl('/category/webcast')
          }
          else if (name == 'radio') {
            this.router.navigateByUrl('/category/radio')
          }
          else if (name == 'event') {
            this.router.navigateByUrl('/category/zoom')
          } else {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(["/category/" + link]);
            });
          }

        });
    }

    // this.dialog.closeAll()

  }

  openStore() {
    this.ds.apipip().subscribe((res: any) => {
      console.log(res);
      if (res.countryName == "India") {
        window.open('https://www.artofliving.store', '_blank');
      } else {
        window.open('https://global.artofliving.store/', '_blank');
      }
    })
  }

  toggleNavbar() {

    if (this.isMobileToggled == true) {
      $("body").css("overflow", "auto");
    }
    this.eds.hideMemberAlert.next(true)
    this.isMobileToggled = !this.isMobileToggled;
    if (Object.keys(this.taploginInfo).length) {
      this.is_loginInfo = true;
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      console.log(USER_ACCOUNT)
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

    if (type == 'subscribe') {
      const eventParams = {
        item_name: 'subscribe',
      };
      this.analyticsService.logEvent('navbar_interaction', eventParams);
    }
    localStorage.setItem("active", type);
    var item = localStorage.getItem("active");
    this.selectedItem = item;

    if (type == "search") {

      this.router.navigate(["/search"]);
    }
    else if (type == "subscribe") {
      localStorage.removeItem("woohoo");
      if (localStorage.getItem("ott_isLoggedIn") != '1') {

        this.openLoginDialog();
        this.is_subscribe = 1
      } else {
        this.fcs.isRental.next(false)
        this.router.navigate(["/subscribe"]);
      }


    }
  }

  searchNavigate() {
    const eventParams = {
      item_name: 'search',
    };
    this.analyticsService.logEvent('navbar_interaction', eventParams);
    this.router.navigate(["/search"]);

  }
  navigate(items: any) {
    localStorage.setItem("active", "account");
    var item = localStorage.getItem("active");
    this.selectedItem = item;
    const eventParams = {
      item_clicked: items,
    };
    this.analyticsService.logEvent('menu_interaction', eventParams);
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
  profileClicked() {
    const eventParams = {};
    this.analyticsService.logEvent('profile_interaction', eventParams);
  }
  // open login dialog
  openDialog() {
    const eventParams = {
      item_name: 'login',
    };
    this.analyticsService.logEvent('navbar_interaction', eventParams);
    this.is_subscribe = 0;
    this.openLoginDialog();
  }
  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }
  closeMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
  }

  openLoginDialog(): void {
    let xc = window.innerWidth;

    if (xc < 576) {
      if (this.isMobileToggled == true) {
        $("body").css("overflow", "auto");
      } else {
        $("body").css("overflow", "hidden");
      }
      this.eds.hideMemberAlert.next(true)
      this.isMobileToggled = !this.isMobileToggled;
    }
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
        if (this.is_subscribe == 1) {
          this.router.navigate(["/subscribe"]);
          this.is_subscribe = 0
        }

      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      if (USER_ACCOUNT) {
        this.UserData = USER_ACCOUNT.first_name
          ? USER_ACCOUNT.first_name + " " + USER_ACCOUNT.last_name
          : USER_ACCOUNT.email
            ? USER_ACCOUNT.email
            : USER_ACCOUNT.contact_no;
      }

    });
    dialogRef.disableClose = true;
  }
  list() {
    if (this.isSubscribed) {
      this.router.navigate(["/mylist"]);
    } else {
      const dialogRef = this.dialog.open(ContactusModalDialogComponent, {
        panelClass: "premium",
        backdropClass: 'popupBackdropClass',
        width: "450px",
      });
    }
  }
  isLoggedInEvent(e: boolean) {
    console.log(e);

    this.is_loginInfo = e;
    this.isLoggedInforLayout.emit(e);
    console.log(e, "login status");
  }
  openEmailDialog(input: string): void {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: "390px",
      data: { email: input },
    });
  }
  openOttDialog(): void {
    const dialogRef = this.dialog.open(OtpDialogComponent, {
      width: "390px",
      data: { name: "login" },
    });
  }

  openNav(type: any) {

    $("body").css("overflow", "auto");
    switch (type) {

      case "subscribe":

        this.router.navigate(["/subscribe"]);
        window.scroll(0, 0);
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
        this.router.navigate(["/faqs"]);
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
        this.router.navigate(["/my-subscriptions"]);
        window.scroll(0, 0);
        break;
    }
    this.hideData();
  }

  openSignoutConfirmationDialog(): void {
    const eventParams = {};
    this.analyticsService.logEvent('logout_interaction', eventParams);
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
  close() {
    this.signoutConfirmationDialogRef.close();
  }
  openSignoutConfirmationDialog_mob(): void {
    const eventParams = {};
    this.analyticsService.logEvent('logout_interaction', eventParams);
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



  logout() {
    const taplogininfo: any = localStorage.getItem("taploginInfo") || {};
    const userSessions: any = localStorage.getItem('ipSaveData') || {};
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const USER_SESSION: any = JSON.parse(userSessions);
    const formData: any = new FormData();
    formData.append("user_id", USER_ACCOUNT.id);
    formData.append("type", 1);
    formData.append("device_unique_id", this.visitorId);

    this.ds.logout(formData).subscribe((res) => {
      if (res.code == 1) {
        this.dialog.closeAll();
        this.ed.alreadySubscriber.next(false)
        this.ed.isSubscribe.next(false);
        this.ed.isUserLoggedIn.next(false)
        this.ed.isUserLoggedInModal.next(false)
        this.ed.reload.next(false)
        this.isLoggedInforLayout.emit(false);
        const eventParams = {
          method: USER_ACCOUNT.login_type,
        };
        this.analyticsService.logEvent('logout', eventParams);
        localStorage.removeItem("ott_subtitle_setup");
        localStorage.removeItem("taploginInfo");
        localStorage.removeItem("ott_isLoggedIn");
        localStorage.removeItem("ott_consent");
        localStorage.removeItem("ott_subscriptionPlan");
        localStorage.removeItem("subscribeInfo");
        localStorage.removeItem("is_subscriber");
        localStorage.removeItem("deviceLimit");
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
        localStorage.removeItem("deleteAccount")
        localStorage.removeItem("deviceDetails")
        localStorage.removeItem("device_id")
        localStorage.removeItem("showButton")


        if (this.router && this.router.url === '/') {
          window.location.reload();
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/']);
        }

      }
    });

    // userSessionApi Start

    var inputDate = new Date();
    var formattedDate = this.formatDate(inputDate);

    const formData1: any = new FormData();
    formData1.append("customer_id", USER_ACCOUNT.id);
    formData1.append("type", "end");
    formData1.append("time", formattedDate);
    formData1.append("device_unique_id", this.visitorId);
    formData1.append("device_type", "web");
    formData1.append("content_type", "vod");
    formData1.append("customer_name", USER_ACCOUNT.first_name + '' + USER_ACCOUNT.last_name);
    formData1.append("country", USER_SESSION.countryName);
    formData1.append("country_code", USER_SESSION.countryCode);
    formData1.append("network_type", USER_SESSION.security.network);
    formData1.append("network_provider", USER_SESSION.connection.isp);
    formData1.append("platform", USER_SESSION.userAgent.platform);
    formData1.append("browser", USER_SESSION.userAgent.browser);
    formData1.append("screen_resolution", window.screen.availWidth + '*' + window.screen.availHeight);
    formData1.append("os_version", USER_SESSION.userAgent.operatingSystem);
    formData1.append("age_group", USER_ACCOUNT.age_group);
    formData1.append("gender", USER_ACCOUNT.gender);
    formData1.append("city", USER_SESSION.city);
    this.ds.userSession(formData1).subscribe((res: any) => {
      if (res.code == 1) {
        console.log(res);

      }

    });

    // userSessionApi End


  }

  // jsondata() {
  //   this.ds.faqData().subscribe((data: any) => {
  //     localStorage.setItem("jsonPlayer", JSON.stringify(data));
  //   })
  // }

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
    }, 3000);
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
    }, 3000);
  }

  regionalOpen() {

    const dialogRef = this.dialog.open(RegionalComponent, {
      panelClass: 'contactfooter',
      width: "390px",
      data: { title: this.sendTosettingSubtitle }
    });
    const sub = dialogRef.componentInstance.regionalSet.subscribe((title: any) => {
      this.regional = title
    });
  }
  addLanguageChangeListener(): void {

    const languageMap: { [key: string]: string } = {
      'as': 'Assamese',
      'bn': 'Bengali',
      'bg': 'Bulgarian',
      'zh-CN': 'Chinese (Simplified)',
      'en': 'English',
      'fr': 'French',
      'de': 'German',
      'gu': 'Gujarati',
      'he': 'Hebrew',
      'hi': 'Hindi',
      'ja': 'Japanese',
      'kn': 'Kannada',
      'ko': 'Korean',
      'ml': 'Malayalam',
      'mr': 'Marathi',
      'mn': 'Mongolian',
      'or': 'Odia',
      'pa': 'Punjabi',
      'ru': 'Russian',
      'es': 'Spanish',
      'ta': 'Tamil',
      'te': 'Telugu'
    };

    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.addEventListener('change', () => {
        const selectedLanguageCode = (selectElement as HTMLSelectElement).value;
        const selectedLanguageName = languageMap[selectedLanguageCode]?.toLowerCase() || selectedLanguageCode;

        console.log(selectedLanguageCode);
        var u_id: any = localStorage.getItem("taploginInfo");
        var ids = JSON.parse(u_id);
        this.ds.getSubtitle(ids.id).subscribe((res: any) => {
          this.dep_ser.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.dep_ser.decryptData);
          const sendTosett = decryptData;
          if (sendTosett.payload != null && sendTosett.payload.subtitle != null) {
            this.subtitle = sendTosett.payload.subtitle;
          } else {
            this.subtitle = "None";
          }
          if (sendTosett.payload != null && sendTosett.payload.language_key != null) {
            this.regionals = sendTosett.payload.language_key;
          } else {
            this.regionals = "None";
          }
          const payload: any = {
            quality_key: 0,
            notification_key: 0,
            download_key: 0,
            autoplay_key: 0,
            language_key: this.regionals,
            subtitle: this.subtitle,
            app_language: selectedLanguageName
          };
          var uid: any = localStorage.getItem("taploginInfo");
          var Uid = JSON.parse(uid);
          const formData = new FormData();
          formData.append("uid", Uid.id);
          formData.append("payload", JSON.stringify(payload));

          this.ds.subtitleSet(formData).subscribe((res: any) => {

          });
        });

      });
    }
  }
}

