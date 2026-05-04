import { AfterViewInit, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { Meta } from '@angular/platform-browser';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import Swal from 'sweetalert2';
import { DeleteAccountPopupComponent } from 'src/app/shared/dialogBoxes/delete-account-popup/delete-account-popup.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
//import * as amplitude from '@amplitude/analytics-browser';
import { Router } from '@angular/router';
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  activeSection: string = 'account';
  innerTab: string = 'profile';
  activeTab: string = 'home'; // Default tab
  data: any = null; // Store data for the current tab
  isOpenSetting = false
  update_Mail: any;
  val: any;
  panelOpenState: boolean = false
  sendTosettingSubtitle: any;
  sendToSetting: any;
  accoutSection: any;
  showMsg: boolean = false;
  rot: any
  isOttLoggedIn: boolean = false
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isSubscribed: boolean = false;
  user_id: any;
  basesignin: any;
  login_first: any;
  ipSaveData: any
  @ViewChild("signoutConfirmationModal")
  signoutConfirmationModal!: TemplateRef<any>;
  private signoutConfirmationDialogRef!: MatDialogRef<TemplateRef<any>>;                
  baseJson: any = [];
  constructor(private location: Location, private ed: ExchangeDataService, private metaService: Meta, private ds: DataService, private DEC_SER: DecryptService, private SWAL: SwalMsgService, private dialog: MatDialog, private router: Router,    private fc: FunctionCallingService,) {
    this.ed.openSettingAccount.pipe(first()).subscribe(value => {
      if (value == true) {
        this.innerTab = 'settings';
        this.isOpenSetting = value;
      }
      this.ed.openSettingAccount.next(false);
    });
    // this.addTag();
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value;

      }
    });
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }
  ngOnInit(): void {
    window.scroll(0, 0)
    this.login_first = localStorage.getItem('taploginInfo')
    this.ds.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
        console.log(ipSaveData)
        this.getConfigData();

      }
      // localStorage.setItem("ipSaveData", JSON.stringify(res));
    });
    // this.rot = this.router.navigate(['/delete-account'])
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }






    const currentRoute = this.router.url;

    if (currentRoute.includes('/delete-account')) {
      this.innerTab = 'management'; // Select "Account Management" tab
    }
    if (currentRoute.includes('/watchlist')) {
      this.activeSection = 'list'; // Select "Account Management" tab
    }

    if (currentRoute.includes('/my-subscription')) {
      this.activeSection = 'plans'; // Select "Account Management" tab
    }

    if (currentRoute.includes('/activation')) {
      this.activeSection = 'tv'; // Select "Account Management" tab
    }
    this.loadTabData(this.activeTab); // Load initial data




  }






  onTabChange(tab: string): void {
    this.activeTab = tab;
    this.loadTabData(tab); // Fetch data for the selected tab
  }


  loadTabData(tab: string): void {
    // Mock data fetch based on tab
    switch (tab) {
      case 'home':
        this.data = { message: 'Profile Data Loaded' };
        break;
      case 'blog':
        this.data = { message: 'Account Management Data Loaded' };
        break;
      case 'setting':
        this.data = { message: 'Settings Data Loaded' };
        break;
      case 'myPlans':
        this.data = { message: 'myPlans Data Loaded' };
        break;
      case 'myList':
        this.data = { message: 'myList Data Loaded' };
        break;
      case 'activateTV':
        this.data = { message: 'activateTV Data Loaded' };
        break;
      case 'code':
        this.data = { message: 'Code Data Loaded' };
        break;
      case 'about':
        this.data = { message: 'About Data Loaded' };
        break;
      default:
        this.data = null;
    }
    console.log(this.data); // Debugging data loading
  }


  // getConfigData1() {
  //   this.ds.faqData().subscribe((res: any) => {

  //     this.baseSignin = res.Form[0].signin;
  //     this.baseSignup = res.Form[0].signup;

  //   });
  // }

  openSection(section: string) {
    this.activeSection = section;
    this.innerTab = 'profile'; // reset inner tab when switching main section
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


  getConfigData() {
    this.ds.popupJson().subscribe((res: any) => {
      this.basesignin = res.PopupList[0]
      console.log(this.basesignin, "hjklkjh");
    })
    const popup1: any = localStorage.getItem("popUpForm");
    const dataPopup1: any = JSON.parse(popup1);
    this.baseJson = dataPopup1;
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.basesignin = dataPopup.PopupList[0]
    setTimeout(() => {

      if (localStorage.getItem('taploginInfo')) {
        var data: any = localStorage.getItem('taploginInfo') || {}
        var data_read = JSON.parse(data)
        this.user_id = data_read.id
      } else {

        this.openLoginDialog()
      }
    }, 500);
    // this.ds.popupJson().subscribe((res: any) => {
    //   this.basesignin=res.PopupList[0]


    // })
  }
  // addTag() {
  //   this.metaService.updateTag({ property: 'og:title', content: 'YOUR_TITLE' });
  //   this.metaService.updateTag({ property: 'og:image', content: 'YOUR_IMAGE' });
  //   this.metaService.updateTag({ property: 'og:description', content: 'YOUR_URL' })
  // }

  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }


    })

    Toast.fire({
      icon: icon,
      title: msg
    })
  }

  back() {
    this.location.back();
  }

  deleteCustom() {
    this.showMsg = true
  }

  userInfo: any;
  userDetails: any;
  delete(data: any) {
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);

    if (USER_ACCOUNT.is_mail_verify == 0) {
      const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
        backdropClass: 'popupBackdropClass',
        panelClass: 'adultAgePopup',
        width: "390px",
        data: { val: false }
      })
    } else {
      if (USER_ACCOUNT.email == "") {
        const formData = new FormData();
        formData.append('subject', 'test');
        formData.append('message', 'test')
        formData.append('email', USER_ACCOUNT.contact_no)
        formData.append('uid', USER_ACCOUNT.id);
        this.ds.delete_account(formData).subscribe(res => {
          if (res.code == 1) {
            this.getSwalmsg(res.result, 'success');
          } else {
            this.getSwalmsg(res.result, 'error');
          }
        });
        this.showMsg = true
      } else {
        const formData = new FormData();
        formData.append('subject', 'test');
        formData.append('message', 'test')
        formData.append('email', USER_ACCOUNT.email)
        formData.append('uid', USER_ACCOUNT.id);
        this.ds.delete_account(formData).subscribe(res => {
          if (res.code == 1) {
            this.getSwalmsg(res.result, 'success');
          } else {
            this.getSwalmsg(res.result, 'error');
          }
        });
      }
    }

    



    // if (USER_ACCOUNT.email == "") {
    //   const formData = new FormData();
    //   formData.append('subject', 'test');
    //   formData.append('message', 'test')
    //   formData.append('email', USER_ACCOUNT.contact_no)
    //   formData.append('uid', USER_ACCOUNT.id);
    //   this.ds.DeleteUserAcc(formData).subscribe(res => {
    //     if (res.code == 1) {
    //       this.getSwalmsg(res.result, 'success');
    //     } else {
    //       this.getSwalmsg(res.result, 'error');
    //     }
    //   });
    //   this.showMsg = true
    // } else {
    //   const formData = new FormData();
    //   formData.append('subject', 'test');
    //   formData.append('message', 'test')
    //   formData.append('email', USER_ACCOUNT.mail)
    //   formData.append('uid', USER_ACCOUNT.id);
    //   this.ds.DeleteUserAcc(formData).subscribe(res => {
    //     if (res.code == 1) {
    //       this.getSwalmsg(res.result, 'success');
    //     } else {
    //       this.getSwalmsg(res.result, 'error');
    //     }
    //   });
    // }
  }

  logout() {
    this.fc.logoutProfile.next(true);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'logindialog',
      width: "390px",
      data: { name: "login" },
    });
    const sub = dialogRef.componentInstance.isLoggedIn.subscribe((data: any) => {

      // this.is_loginInfo = data;
      // this.isLoggedInforLayout.emit(data);
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  navigate(items: any) {
    window.scroll(0, 0);
    localStorage.setItem("active", "account");
    var item = localStorage.getItem("active");
    // this.selectedItem = item;
  }

  close() {
    this.signoutConfirmationDialogRef.close();
  }


}
