import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Login, User, UserNoPW, CertReq } from '../models/User';

import * as forge from 'node-forge';
const pki =forge.pki;

const httpOptions ={
  headers: new HttpHeaders({
    contentType : 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken:  any;
  user: User;
  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    ) { }

    prepEndpoint(ep){
      //1.로컬서버에서 개발시
      // return 'http://localhost:3000/' + ep;
      //2. 클라우드 서버에서 운영시 
      return ep;

    }

  registerUser(user: User): Observable<any> {
    const registerUrl = 'http://localhost:3000/users/register';
    // const registerUrl = this.prepEndpoint('users/register');
    return this.http.post(registerUrl, user, httpOptions);
  }
  
  authenticateUser(login: Login): Observable<any> {
    const loginUrl = 'http://localhost:3000/users/authenticate';
    // const loginUrl = this.prepEndpoint('users/authenticate');
    return this.http.post<any>(loginUrl, login ,httpOptions);
    }

  authenticateSigUser(request): Observable<any> {
    // const loginUrl= this.prepEndpoint('users/authenticateSig');
    const loginUrl = 'http://localhost:3000/users/authenticateSig';
    return this.http.post(loginUrl, request, httpOptions);
  }


  storeUserData(token: any, userNoPW: UserNoPW){
    localStorage.setItem('authToken', token);
    localStorage.setItem('userNoPW', JSON.stringify(userNoPW));
  }

  storeUserInput(input : string,){
    localStorage.setItem('input',input);
  }

  removeUserInput(){
    localStorage.removeItem('input');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userNoPW');
    //localStorage.clear();
  }

  getProfile(): Observable<any> {
    let authToken: any = localStorage.getItem('authToken');
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+authToken,
      }),
    };
      // const profileUrl = 'http://localhost:3000/users/profile';
      const profileUrl = this.prepEndpoint('users/profile');
      return this.http.get<any>(profileUrl, httpOptions1);

  }

  getList(): Observable<any> {
    let authToken: any = localStorage.getItem('authToken');
    const httpOptions1 = {
      headers: new HttpHeaders({
        contentType: 'application/json',
        authorization: 'Bearer '+authToken,
      }),
    };
     
      const listUrl = this.prepEndpoint('users/list');
      // const listUrl = 'http://localhost:3000/users/list';
      return this.http.get<any>(listUrl, httpOptions1);

  }


  loggedIn() : boolean{
    let authToken: any = localStorage.getItem('authToken');
    return !this.jwtHelper.isTokenExpired(authToken); // expired됐을 때 yes 면 만료가 된 것이니 앞에 ! 붙여줘야 함 
  }

// Issuing certificate
  certRequest(request, keySize): Observable<any> {
  // Key generation
    let keyPair= pki.rsa.generateKeyPair(keySize);
    let publicKey= keyPair.publicKey;
    let privateKey= keyPair.privateKey;
    let publicKeyPem= pki.publicKeyToPem(publicKey);
    let privateKeyPem= pki.privateKeyToPem(privateKey);  // Storing private key
    localStorage.setItem('privateKey', privateKeyPem);  // Certificate request. UTF-8 encoding.
    const req: CertReq= {
      country: forge.util.encodeUtf8(request.country),
      state: forge.util.encodeUtf8(request.state),
      locality: forge.util.encodeUtf8(request.locality),
      organization: forge.util.encodeUtf8(request.organization),
      orgUnit: forge.util.encodeUtf8(request.orgUnit),
      common: request.common, // common = username should be English
      publicKey: publicKeyPem,
  };
  const certUrl= this.prepEndpoint('users/cert');
  // const certUrl = 'http://localhost:3000/users/cert';
  
  return this.http.post(certUrl, req, httpOptions);
}


//Store certificate
storeCert(cert, caCert){
  localStorage.setItem('cert', cert);
  localStorage.setItem('caCert', caCert);
}


editUser(user: User): Observable<any> {
  // const registerUrl = "http://localhost:3000/users/edit";
  const registerUrl = this.prepEndpoint('users/edit');
  return this.http.post<any>(registerUrl, user, httpOptions);
}


}





