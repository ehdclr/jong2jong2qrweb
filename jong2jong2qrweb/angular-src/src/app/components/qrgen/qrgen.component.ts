import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthGuard } from 'src/app/guards/auth.guards';
import { AuthService } from 'src/app/services/auth.service';

import * as forge from 'node-forge';
const pki = forge.pki;

@Component({
  selector: 'app-qrgen',
  templateUrl: './qrgen.component.html',
  styleUrls: ['./qrgen.component.scss']
})
export class QrgenComponent implements OnInit {
  username: string;
  elementType ='text';
  value: string;
  ctime: string;
  qrLoginInfo: string;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router

  ) { }
  public modal: boolean = false;

  clickedModalClose() {
    this.modal = false;
  }

  clickedModal() {
    this.modal = true;
  
  }

  ngOnInit(): void {
    let userNoPW: any = localStorage.getItem('userNoPW');
    this.username =JSON.parse(userNoPW).username;

    const privateKeyPem= localStorage.getItem('privateKey');
    const privateKey= pki.privateKeyFromPem(privateKeyPem);
    const certPem= localStorage.getItem('cert');
    const cert = pki.certificateFromPem(certPem);
    const username = cert.subject.getField('CN').value;
    const currentTime= new Date().getTime();


    if (!privateKeyPem) {this.flashMessage.show('No certificate provided', {
      cssClass: 'alert-danger',
      timeout: 5000,
      
    });
    this.router.navigate(['login']);
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

  const loginRequest = JSON.stringify(request);
  this.value =loginRequest;

  }

  QRRegen(){

    let userNoPW: any = localStorage.getItem('userNoPW');
    this.username =JSON.parse(userNoPW).username;

    const privateKeyPem= localStorage.getItem('privateKey');
    const privateKey= pki.privateKeyFromPem(privateKeyPem);
    const certPem= localStorage.getItem('cert');
    const cert = pki.certificateFromPem(certPem);
    const username = cert.subject.getField('CN').value;
    const currentTime= new Date().getTime();


    if (!privateKeyPem) {this.flashMessage.show('No certificate provided', {
      cssClass: 'alert-danger',
      timeout: 5000,
      
    });
    this.router.navigate(['login']);
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

  const loginRequest = JSON.stringify(request);
  this.value =loginRequest;
    
      
    

} 


}