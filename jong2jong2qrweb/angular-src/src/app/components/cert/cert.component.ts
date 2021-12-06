import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cert',
  templateUrl: './cert.component.html',
  styleUrls: ['./cert.component.scss']
})
export class CertComponent implements OnInit {
  country: string;
  state: string;
  locality: string;
  organization: string;
  orgUnit: string;
  common: string;
  keySize: number = 1024;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit(): void {
    const userNoPW: any = localStorage.getItem('userNoPW');
    this.common = JSON.parse(userNoPW).username;
  }

  onCertRequest() {
    const request = {
      country: this.country,
      state: this.state,
      locality: this.locality,
      organization: this.organization,
      orgUnit: this.orgUnit,
      common: this.common,
    };
    
    
   this.authService.certRequest(request, this.keySize).subscribe((data) => {
      if (data.success) {
        this.authService.storeCert(data.cert, data.caCert);
        this.flashMessage.show('Your certificate was issued.', {
          cssClass: 'alert-success',
          timeout: 3000,
        });
        
        this.router.navigate(['dashboard']);
      } else {
        this.flashMessage.show('Certificate issuing fails', {
          cssClass: 'alert-danger',
          timeout: 3000,
        });
        
        this.router.navigate(['cert']);
      }
    });
  }

}



