import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivationSuccessComponent } from '../@core/activation-success/activation-success.component';
import { ActivationComponent } from '../activation/activation.component';
import { Page404Component } from '../page404/page404.component';
import { AuthGuard } from '../services/guard/auth.guard';
import { ReelsAuthGuard } from '../services/guard/reels-auth-guard.guard';
import { NotificationComponent } from '../shared/notification/notification.component';
import { LayoutComponent } from './layout.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OffersComponent } from './offers/offers.component';
import { PayuCancelComponent } from '../@core/subscribe/payu-cancel/payu-cancel.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: '', loadChildren: () => import('../@core/homepage/homepage.module').then(m => m.HomepageModule), data: {
        title: 'Movies, Web Series & Originals Streaming Online | Vive Movies',
        descrption: 'Description of Home Component',
        ogTitle: 'The Art of Living App',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: ':name/:id', loadChildren: () => import('../@core/homepage/homepage.module').then(m => m.HomepageModule), data: {
        data: { title: null },
        title: 'Movies, Web Series & Originals Streaming Online | Vive Movies',
        descrption: 'Description of Home Component',
        ogTitle: 'The Art of Living App',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'subscribe', loadChildren: () => import('../@core/subscribe/subscribe.module').then(m => m.SubscribeModule), data: {
        title: 'Subscribe',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'account', loadChildren: () => import('../@core/my-account/my-account.module').then(m => m.MyAccountModule), canActivate: [AuthGuard], data: {
        title: 'Account',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'vives', loadChildren: () => import('../@core/review/review.module').then(m => m.ReviewModule), data: {
        title: 'vives',
      }
    },
    {
      path: 'reels',
      loadChildren: () =>
        import('../@core/review/review.module').then(m => m.ReviewModule),
      canActivate: [ReelsAuthGuard],
      data: {
        title: 'reels'
      }
    },
    {
      path: 'watchlist', loadChildren: () => import('../@core/my-account/my-account.module').then(m => m.MyAccountModule), canActivate: [AuthGuard], data: {
        title: 'Watchlist',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'search', loadChildren: () => import('../../app/shared/search/search.module').then(m => m.SearchModule), data: {
        title: 'Search',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'my-subscription', loadChildren: () => import('../@core/my-account/my-account.module').then(m => m.MyAccountModule), canActivate: [AuthGuard], data: {
        title: 'My-subscription',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: ':category/:title/:c_id', loadChildren: () => import('../../app/@core/show-detail/show-detail.module').then(m => m.ShowDetailModule), data: {
        title: 'Category',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'view/all/:title/:id', loadChildren: () => import('../../app/@core/all-data/all-data.module').then(m => m.AllDataModule), data: {
        title: 'View All ',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },

    {
      path: 'continue', loadChildren: () => import('../../app/@core/continue-watching/continue-watching.module').then(m => m.ContinueWatchingModule), data: {
        title: 'Continue Watching',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'faqs', loadChildren: () => import('../../app/layout/faq/faq.module').then(m => m.FaqModule), data: {
        title: 'Faqs',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'all-episodes', loadChildren: () => import('../../app/@core/all-episodes/all-episodes.module').then(m => m.AllEpisodesModule), data: {
        title: 'All-Episodes',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'all-star', loadChildren: () => import('../../app/@core/all-star/all-star.module').then(m => m.AllStarModule), data: {
        title: 'All-star',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'about-us', loadChildren: () => import('../../app/layout/about-us/about-us.module').then(m => m.AboutUsModule), data: {
        title: 'About US ',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    { path: '', loadChildren: () => import('../../app/layout/footer-terms/footer-terms.module').then(m => m.FooterTermsModule), },
    { path: 'reset-password', component: ResetPasswordComponent },
    {
      path: 'notification', component: NotificationComponent, canActivate: [AuthGuard], data: {
        title: 'Reset-Password',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    // {path:'activation',component:ActivationComponent,  data: {
    //   title: 'TV Activation ',
    //   descrption: 'Description of Home Component',
    //   ogTitle: 'Description of Home Component for social media',
    //   ogDescrption: 'Description of Home Component for social media',
    // }},
    {
      path: 'activation', loadChildren: () => import('../@core/my-account/my-account.module').then(m => m.MyAccountModule), canActivate: [AuthGuard], data: {
        title: 'TV Activation',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'activation-success', component: ActivationSuccessComponent, data: {
        title: 'Activation-Success',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
    {
      path: 'offers', component: OffersComponent, data: {
        title: 'offers',
        descrption: 'Description of Offers Component',
        ogTitle: 'Description of Offers Component for social media',
        ogDescrption: 'Description of Offers Component for social media',
      }
    },

    {
      path: 'delete-account', loadChildren: () => import('../@core/my-account/my-account.module').then(m => m.MyAccountModule), data: {
        title: 'delete',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },

    { path: 'cancel-payment', component: PayuCancelComponent },
    { path: '404', component: Page404Component },
    { path: '**', redirectTo: '404' },

    {
      path: "**", component: Page404Component, data: {
        title: 'Page404',
        descrption: 'Description of Home Component',
        ogTitle: 'Description of Home Component for social media',
        ogDescrption: 'Description of Home Component for social media',
      }
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
