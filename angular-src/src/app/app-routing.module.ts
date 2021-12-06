import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertComponent } from './components/cert/cert.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/list/list.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QrgenComponent } from './components/qrgen/qrgen.component';
import { QrloginComponent } from './components/qrlogin/qrlogin.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guards';

const routes: Routes = [
  { path: '',component: HomeComponent},
  { path: 'navbar',component: NavbarComponent},
  { path: 'login',component: LoginComponent},
  { path: 'register',component: RegisterComponent},
  { path: 'dashboard',component: DashboardComponent, canActivate : [AuthGuard]} ,
  { path: 'profile',component: ProfileComponent, canActivate : [AuthGuard] },
  { path: 'list',component: ListComponent, canActivate : [AuthGuard] },
  { path: 'cert',component: CertComponent, canActivate : [AuthGuard] },
  { path: 'qrgen',component: QrgenComponent, canActivate : [AuthGuard] },
  { path: 'qrlogin',component: QrloginComponent },
  { path: 'profile-edit',component: ProfileComponent, canActivate : [AuthGuard] },
  { path: 'map',component: MapComponent, canActivate : [AuthGuard] },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
