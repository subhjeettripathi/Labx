import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayuCancelComponent } from './payu-cancel/payu-cancel.component';
import { PayuFailureComponent } from './payu-failure/payu-failure.component';
import { PayuSuccessComponent } from './payu-success/payu-success.component';
import { SubscribeComponent } from './subscribe.component';

const routes: Routes = [
  {path:'', component:SubscribeComponent},
  {path:'payment-process',component:PayuSuccessComponent},
  {path:'payu-failure',component:PayuFailureComponent},
  {path:'cancel-payment',component:PayuCancelComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscribeRoutingModule { }
