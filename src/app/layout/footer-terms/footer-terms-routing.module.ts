import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SiteMapComponent } from './site-map/site-map.component';
import { TermsComponent } from './terms/terms.component';
import { CorporateComponent } from '../corporate/corporate.component';
import { DevicesComponent } from '../devices/devices.component';
import { CareersComponent } from '../careers/careers.component';
import { InvestorRelationsComponent } from '../investor-relations/investor-relations.component';
import { GrievanceRedressalMechanismComponent } from '../grievance-redressal-mechanism/grievance-redressal-mechanism.component';
import { ALTBalajiBlogComponent } from '../altbalaji-blog/altbalaji-blog.component';

const routes: Routes = [
  {path:'termsofUse',component:TermsComponent ,data: {
    title: 'Terms of Use',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
  {path:'privacy-policy',component:PrivacyPolicyComponent,data: {
    title: 'Privacy-Policy',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
  {path:'site-map',component:SiteMapComponent,data: {
    title: 'Site-Map',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
  {path:'support',component:CorporateComponent,data: {
    title: 'Support',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
  {path:'devices',component:DevicesComponent,data: {
    title: 'Devices',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
  {path:'careers',component:CareersComponent,data: {
    title: 'Careers',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
  {path:'investor-relations',component:InvestorRelationsComponent,data: {
    title: 'Investor-Relations',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
  {path:'grievance-redressal-mechanism',component:GrievanceRedressalMechanismComponent,data: {
    title: 'Grievance-Redressal-Mechanism',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
  {path:'altt-blog',component:ALTBalajiBlogComponent,data: {
    title: 'Altt-blog',
    descrption: 'Description of Home Component',
    ogTitle: 'Description of Home Component for social media',
    ogDescrption: 'Description of Home Component for social media',
  }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FooterTermsRoutingModule { }
