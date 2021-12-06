import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { ValidateService } from './services/validate.service';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { HttpClientModule} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './guards/auth.guards';
import { ListComponent } from './components/list/list.component';
import { CertComponent } from './components/cert/cert.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { QrgenComponent } from './components/qrgen/qrgen.component';
import { QrloginComponent } from './components/qrlogin/qrlogin.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { MapComponent } from './components/map/map.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    ListComponent,
    CertComponent,
    QrgenComponent,
    QrloginComponent,
    ProfileEditComponent,
    MapComponent,
    
    

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FlashMessagesModule,
    HttpClientModule,
    NgxQRCodeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('authToken');
        },
      },
    }),
    
  ],
  providers: [ValidateService, FlashMessagesService, AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
