import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { HomeComponent } from './page/home/home.component';
import { StoreComponent } from './page/store/store.component';
import { AboutusComponent } from './page/aboutus/aboutus.component';
import { LoginComponent } from './page/login/login.component';
import { TableComponent } from './common/table/table.component';
import { SymbolPipe } from './pipe/symbol.pipe';
import { MoreInfoComponent } from './page/more-info/more-info.component';
import { BuyNowComponent } from './page/buy-now/buy-now.component';
import { AdminComponent } from './page/admin/admin.component';
import { ProfileComponent } from './page/profile/profile.component';
import { GameManagerComponent } from './page/admin/game-manager/game-manager.component';
import { UserEditorComponent } from './page/admin/user-editor/user-editor.component';
import { EditUserComponent } from './page/edit-user/edit-user.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { UserOfferComponent } from './page/user-offer/user-offer.component';
import { UserWishlistComponent } from './page/user-wishlist/user-wishlist.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    StoreComponent,
    AboutusComponent,
    LoginComponent,
    TableComponent,
    SymbolPipe,
    MoreInfoComponent,
    BuyNowComponent,
    AdminComponent,
    ProfileComponent,
    GameManagerComponent,
    UserEditorComponent,
    EditUserComponent,
    UserOfferComponent,
    UserWishlistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
