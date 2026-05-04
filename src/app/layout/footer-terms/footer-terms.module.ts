import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterTermsRoutingModule } from './footer-terms-routing.module';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SiteMapComponent } from './site-map/site-map.component';
import { CorporateComponent } from '../corporate/corporate.component';
import { DevicesComponent } from '../devices/devices.component';
import { CareersComponent } from '../careers/careers.component';
import { InvestorRelationsComponent } from '../investor-relations/investor-relations.component';
import { GrievanceRedressalMechanismComponent } from '../grievance-redressal-mechanism/grievance-redressal-mechanism.component';
import { ALTBalajiBlogComponent } from '../altbalaji-blog/altbalaji-blog.component';


@NgModule({
  declarations: [
    TermsComponent,
    PrivacyPolicyComponent,
    SiteMapComponent,
    CorporateComponent,
    DevicesComponent,
    CareersComponent,
    InvestorRelationsComponent,
    GrievanceRedressalMechanismComponent,
    ALTBalajiBlogComponent
  ],
  imports: [
    CommonModule,
    FooterTermsRoutingModule
  ]
})
export class FooterTermsModule { }
