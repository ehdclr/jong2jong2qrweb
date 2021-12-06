import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Login } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as forge from 'node-forge';
const pki = forge.pki;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit(): void {}


  onLoginSubmit() {
    const login: Login = {
      username: this.username,
      password: this.password
    };

    this.authService.authenticateUser(login).subscribe((data) =>{
      if (data.success) {
        this.authService.storeUserData(data.token, data.userNoPW);
        this.flashMessage.show('로그인 성공', {
          cssClass:'alert-success',
          timeout: 3000,
        });
        this.router.navigate(['dashboard']);
      } else {
        this.flashMessage.show(data.msg,{
          cssClass: 'alert-danger',
          timeout: 5000,
        });
        this.router.navigate(['login']);
      }
    });
  }


onLoginSigSubmit() {
  const privateKeyPem = localStorage.getItem('privateKey');
  const privateKey = pki.privateKeyFromPem(privateKeyPem);
  const certPem = localStorage.getItem('cert');
  const cert = pki.certificateFromPem(certPem);
  const username = cert.subject.getField('CN').value;
  const currentTime = new Date().getTime();

  if (!privateKeyPem) {
    // this.flashMessage.show('No certificate provided', {
    //   cssClass: 'alert-danger',
    //   timeout: 5000,
    // });
    Swal.fire({
      icon: 'warning',
      title: '로그인실패',
      text: '로그인에 실패하였습니다.',
  });

    this.router.navigate(['login']);
  } else{
    Swal.fire({
      icon: 'success',
      title: '로그인성공',
      text: '로그인에 성공하였습니다.',
  });
  }
  

  

  // Signature generation on username, currentTime
  let md = forge.md.sha1.create();
  md.update(username + currentTime, 'utf8');
  const signature = privateKey.sign(md);
  const signatureHex= forge.util.bytesToHex(signature);
  
  // Easy login request
  const request = {
    username: username,
    currentTime: currentTime,
    signatureHex: signatureHex,



};



this.authService.authenticateSigUser(request).subscribe((data) => {
  if (data.success) {
    this.authService.storeUserData(data.token, data.userNoPW);
    this.flashMessage.show(data.msg, {
      cssClass: 'alert-success',
      timeout: 5000,
    });
    this.router.navigate(['dashboard']);
  } else {
    this.flashMessage.show(data.msg, {
      cssClass: 'alert-danger',
      timeout: 5000,
    });
    this.router.navigate(['login']);
  }
});

}

onQRSigLoginSubmit(){

    this.router.navigate(['qrlogin']);
}

}