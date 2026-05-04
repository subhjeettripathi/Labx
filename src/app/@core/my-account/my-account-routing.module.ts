import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './my-account.component';
import { PaymentOptionComponent } from './payment-option/payment-option.component';
import { ProfileComponent } from './profile/profile.component';

// const routes: Routes = [
//   { path: '', component: MyAccountComponent },
//   {path: 'profile', component: ProfileComponent}
// ];

const routes: Routes = [
  
  {
    path: '', component: MyAccountComponent,
    children: [
      //  { path: '', redirectTo:'profile', pathMatch:'full' },
      {path: 'profile', component: ProfileComponent},
      {path: 'paymentOption', component: PaymentOptionComponent},
      {path: 'purchase', component: PaymentOptionComponent},
      {path: 'setting', component: PaymentOptionComponent},
      {path: 'deleteAccount', component: PaymentOptionComponent},
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }
