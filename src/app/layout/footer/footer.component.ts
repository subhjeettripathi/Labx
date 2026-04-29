import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { ContactusModalDialogComponent } from "src/app/shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
// import { hom} from "./footer";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
 
  isOpen: boolean = false;
  footer_version: any;
  footer_version_show: any;
  footer_logo_show: any;
  footer_description_show: any;
  altblog: any;
  constructor(
    public dialog: MatDialog,
    public ds: DataService,
    private router: Router
  ) {}
  footerMenu: any = [];
  company: any = [];
  customer: any = [];
  connect: any = [];
  top_altbalaji_shows: any = [];
  latest_altbalaji_originals: any = [];
  footer_logo = "";
  footerDescription: any;
  footerDownload: any = [];
  footerShare: any = [];
  footer_term: any = [];
  loggedIn:any;
  subscriber:any;
  ngOnInit(): void {
    this.getFooterConfig();
 

  }
  goToTop() {
    window.scrollTo(0, 0);
  }
  getFooterConfig() {
    var res:any=localStorage.getItem('faqData')
    res=JSON.parse(res)
    // this.ds.faqData().subscribe((res: any) => {
      // console.log(res);
      // console.log(res.Website[0].footer_menu.company)
      this.footerMenu = res.Website[0].footer_menu;
      // console.log(this.footerMenu);
      
      this.altblog = this.footerMenu.company[4].link
      // for company:-
      this.company = this.footerMenu.company;
      //customer:-
      this.customer = this.footerMenu.customer;
      //connect:-
      this.connect = this.footerMenu.connect;
      // top balaji shows:-
      this.top_altbalaji_shows = this.footerMenu.top_altbalaji_shows;
      //latest_altbalaji_originals:-
      this.latest_altbalaji_originals =
        this.footerMenu.latest_altbalaji_originals;
      //footer_logo:-
      this.footer_logo = this.footerMenu.footer_logo[0].logo;
      
      this.footer_logo_show = this.footerMenu.footer_logo[0].is_allow;
      this.footerDescription = this.footerMenu.footer_logo[1].description;
      this.footer_description_show = this.footerMenu.footer_logo[1].is_allow;
      this.footerDownload = this.footerMenu.footer_download;
      
      // this.footerShare = this.footerMenu.footer_share;
      for(let i in this.footerMenu.footer_share){
        if(this.footerMenu.footer_share[i].is_allow==1){
          this.footerShare.push(this.footerMenu.footer_share[i])
        }
      }
      
      // footer term:-
      this.footer_term = this.footerMenu.footer_term;
      this.footer_version = this.footerMenu.footer_version.version;

    // });
  }
  toggleExpansion() {
    this.isOpen = !this.isOpen;
  }
  openDialog(type: any) {
    switch (type) {
      case "contact_us":
        this.router.navigate(["/contact-us"])
        break;
      case "careers":
        this.router.navigate(["/careers"])
        break
    }
  }
  openPage(type: any) {
    switch (type) {
      case "faq":
        this.router.navigate(["/faqs"]);
        break;
      case "devices":
        this.router.navigate(["/devices"]);
        break;
      case "customer_mechanism":
        this.router.navigate(["/grievance-redressal-mechanism"]);
        break;
    }
  }
  openAboutUs(type: any) {
    switch (type) {
      case "about_us":
        this.router.navigate(["/about-us"]);
        break;
      case "corporate":
        this.router.navigate(["/corporate"]);
        break;
      case "company_investor":
        this.router.navigate(["/investor-relations"]);
        break;
      case "blog":
        window.open(this.altblog)
        break;
    }
  }
  openTerms(type: any) {
    switch (type) {
      case "term_of_use":
        this.router.navigate(["/termsofUse"]);
        break;
      case "privacy_policy":
        this.router.navigate(["/privacy-policy"]);
        break;
      case "site_map":
        this.router.navigate(["/site-map"]);
        break;
      case "corporate":
        this.router.navigate(["/corporate"]);
        break;
    }
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(ContactusModalDialogComponent, {
      panelClass: "contactfooter",
      backdropClass:'popupBackdropClass',
      width: "450px",     
      data: { name: "login" },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  gotoLogin(event:any){
    this.loggedIn = localStorage.getItem("ott_isLoggedIn");
    if (this.loggedIn == "1") {
      if(event==1){
      
        this.router.navigateByUrl('/account')
         window.scroll(0,0)
      }else if(event==2){
        window.scroll(0,0)
        this.router.navigateByUrl('/watchlist')
      }
    
    } else {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        panelClass: "logindialog",
        backdropClass: "popupBackdropClass",
        width: "390px",
        data: { name: "login" },
      });
      dialogRef.afterClosed().subscribe((result) => {
        document.body.style.overflow='auto'
      });
      dialogRef.disableClose = true;
    }
  }
  gotoPremium(){
    this.subscriber=localStorage.getItem('is_subscriber')
    if(this.subscriber==1){
     this.router.navigateByUrl('/premium/5042')
    }else{
      this.router.navigateByUrl('/subscribe')
    }
  }

  gotoHome(){
    this.router.navigateByUrl('/');
    
  }



}
