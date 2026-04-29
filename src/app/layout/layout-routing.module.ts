import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivationSuccessComponent } from '../@core/activation-success/activation-success.component';
import { ActivationComponent } from '../activation/activation.component';
import { Page404Component } from '../page404/page404.component';
import { AuthGuard } from '../services/guard/auth.guard';
import { NotificationComponent } from '../shared/notification/notification.component';
import { LayoutComponent } from './layout.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PromotionComponent } from './promotion/promotion.component';
import { TeachersComponent } from '../shared/teachers/teachers.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: '', loadChildren: () => import('../@core/homepage/homepage.module').then(m => m.HomepageModule),data: {
         runGuardsAndResolvers: 'always',
      title: 'The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    { path: 'category/webcast', loadChildren: () => import('../@core/live-events/live-events.module').then(m => m.LiveEventsModule),data: {
      title: 'Webcast - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    {path:'category/zoom',loadChildren:()=>import('../../app/layout/zoom/zoom.module').then(m=>m.ZoomModule),data: {
      title: 'Zoom - The Art of Living App',
      descrption: 'Description of Home Component',
    } },

    { path: 'singer/:singersId', loadChildren: () => import('../@core/singers/singers.module').then(m => m.SingersModule),data: {
      title: 'Singers - The Art of Living App',
      descrption: 'Description of Home Component',
      ogTitle: 'The Art of Living App',
      ogDescrption: 'Description of Home Component for social media',
    } },
    { path: 'category/radio', loadChildren: () => import('../../app/@core/radio/radio.module').then(m => m.RadioModule),data: {
      title: 'Radio - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    { path: 'category/:name/:id', loadChildren: () => import('../@core/homepage/homepage.module').then(m => m.HomepageModule),data: {
         runGuardsAndResolvers: 'always',
      data: { title: null } ,
      title: 'The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    { path: 'aol/ebook/:id', loadChildren: () => import('../@core/movies/movies.module').then(m => m.MoviesModule),data: {
      title: 'Ebook - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    

    { path: 'aol/ebook/:map/:title/:c_id', loadChildren: () => import('../@core/news/news.module').then(m => m.NewsModule),data: {
      title: 'Ebook - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
   
     { path: 'contact-us', loadChildren: () => import('src/app/@core/shows/shows.module').then(m => m.ShowsModule),data: {
      title: 'contact us',
    } },
    { path: 'epubPage', loadChildren: () => import('../../app/@core/comedy/comedy.module').then(m => m.ComedyModule),data: {
      title: 'Ebook - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    { path: 'subscribe', loadChildren: () => import('../@core/subscribe/subscribe.module').then(m => m.SubscribeModule),data: {
      title: 'Subscribe - The Art of Living App',
      descrption: 'Description of Home Component',
    } },

    {path:'promotion',component:PromotionComponent},

    {path:'teachers',component:TeachersComponent,  data: {
      title: 'Teachers',
      descrption: 'Teachers App',
    }},

    { path: 'account', loadChildren: () => import('../@core/my-account/my-account.module').then(m => m.MyAccountModule),canActivate: [AuthGuard],data: {
      title: 'Account - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    { path: 'live', loadChildren: () => import('../../app/@core/webcast/webcast.module').then(m => m.WebcastModule),data: {
      title: 'Webcast - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    { path: 'event', loadChildren: () => import('../../app/@core/events/events.module').then(m => m.EventsModule),data: {
      title: 'Event - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
  

    { path: 'search', loadChildren: () => import('../../app/shared/search/search.module').then(m => m.SearchModule),data: {
      title: 'Search - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    { path: 'mylist', loadChildren: () => import('../../app/shared/my-list/my-list.module').then(m => m.MyListModule),canActivate: [AuthGuard],data: {
      title: 'MyList - The Art of Living App',
      descrption: 'Description of Home Component',
    } },
    { path: 'my-subscriptions', loadChildren: () => import('../../app/@core/my-account/my-subscription/my-subscription.module').then(m => m.MySubscriptionModule),canActivate: [AuthGuard],data: {
      title: 'My-subscriptions',
      descrption: 'Description of Home Component',
    } },
    { path: ':category/:title/:c_id', loadChildren: () => import('../../app/@core/show-detail/show-detail.module').then(m => m.ShowDetailModule),data: {
      descrption: 'Description of Home Component',
    } },
    { path: 'view/all/:title/:id', loadChildren: () => import('../../app/@core/all-data/all-data.module').then(m => m.AllDataModule),data: {
      title: 'View All ',
      descrption: 'Description of Home Component',
    } },
    {path:'continue', loadChildren: () => import('../../app/@core/continue-watching/continue-watching.module').then(m => m.ContinueWatchingModule),data: {
      title: 'Continue Watching',
      descrption: 'Description of Home Component',
    }},
    {path:'faqs', loadChildren: () => import('../../app/layout/faq/faq.module').then(m => m.FaqModule),data: {
      title: 'Faqs - The Art of Living App',
      descrption: 'Description of Home Component',
    }},
    {path:'all-episodes', loadChildren: () => import('../../app/@core/all-episodes/all-episodes.module').then(m => m.AllEpisodesModule),data: {
      title: 'All-Episodes',
      descrption: 'Description of Home Component',
    }},
    {path:'about-us', loadChildren: () => import('../../app/layout/about-us/about-us.module').then(m => m.AboutUsModule),data: {
      title: 'About Us - The Art of Living App',
      descrption: 'Description of Home Component',
    }},
    {path:'',loadChildren:()=>import('../../app/layout/footer-terms/footer-terms.module').then(m=>m.FooterTermsModule),},
    {path:'reset-password',component:ResetPasswordComponent},
    {path:'notification',component:NotificationComponent,canActivate: [AuthGuard],data: {
      title: 'Reset-Password',
      descrption: 'Description of Home Component',
    }},
    {path:'activation',component:ActivationComponent,  data: {
      title: 'TV Activation',
      descrption: 'Description of Home Component',
    }},
    {path:'activation-success',component:ActivationSuccessComponent,data: {
      title: 'Activation-Success',
      descrption: 'Description of Home Component',
    }},
    {path:"**",component: Page404Component,data: {
      title: 'Page404',
      descrption: 'Description of Home Component',
    }},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
  