import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './page/aboutus/aboutus.component';
import { AdminComponent } from './page/admin/admin.component';
import { BuyNowComponent } from './page/buy-now/buy-now.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { MoreInfoComponent } from './page/more-info/more-info.component';
import { StoreComponent } from './page/store/store.component';
import { GameManagerComponent } from './page/admin/game-manager/game-manager.component';
import { UserEditorComponent } from './page/admin/user-editor/user-editor.component';
import { EditUserComponent } from './page/edit-user/edit-user.component';
import { AuthGuardService } from './guard/auth.guard';
import { RoleGuard } from './guard/role-guard';
import { UserOfferComponent } from './page/user-offer/user-offer.component';
import { UserWishlistComponent } from './page/user-wishlist/user-wishlist.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'takeoffer',
    component: UserOfferComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'wishlist',
    component: UserWishlistComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'aboutus',
    component: AboutusComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'store',
    component: StoreComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'more-info/:id',
    component: MoreInfoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'store/buy-now/:id',
    component: BuyNowComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService, RoleGuard],
  },
  {
    path: 'admin/gamemanager',
    component: GameManagerComponent,
    canActivate: [AuthGuardService, RoleGuard, RoleGuard],
  },
  {
    path: 'admin/user-editor',
    component: UserEditorComponent,
    canActivate: [AuthGuardService, RoleGuard, RoleGuard],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
