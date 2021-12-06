import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import jsQR, {QRCode} from 'jsqr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-qrlogin',
  templateUrl: './qrlogin.component.html',
  styleUrls: ['./qrlogin.component.scss']
})
export class QrloginComponent implements OnInit {
  canvasElement: HTMLCanvasElement;
  canvasContext: any;
  video: HTMLVideoElement;
  request: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService

  ) { }

  ngOnInit(): void {
    this.canvasElement= <HTMLCanvasElement>(
      document.getElementById('scan-canvas')
      );
      this.canvasContext= this.canvasElement.getContext('2d');
      this.video= <HTMLVideoElement>document.createElement('video');
      navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(async(stream: MediaStream) => {
        this.video.srcObject= stream;
        this.video.setAttribute('playsinline', 'true'); 
        // required to tell iOS safari we don't want fullscreen
        await this.video.play();
        requestAnimationFrame(this.tick.bind(this));
      });
  }


  drawLine(begin, end, color): void {  // QR이체크되면라인을그림
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(begin.x, begin.y);
    this.canvasContext.lineTo(end.x, end.y);
    this.canvasContext.lineWidth= 4;
    this.canvasContext.strokeStyle= color;
    this.canvasContext.stroke();
}

tick(): void {
  if (this.video.readyState=== this.video.HAVE_ENOUGH_DATA) {
    this.canvasElement.hidden= false;
    this.canvasElement.height= this.video.videoHeight;
    this.canvasElement.width= this.video.videoWidth;
    this.canvasContext.drawImage(
      this.video,0,0,
      this.canvasElement.width,
      this.canvasElement.height
      );
      const imageData: ImageData= this.canvasContext.getImageData(
        0,0,
        this.canvasElement.width,
        this.canvasElement.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {         // 코드가체크되면코드바운더리를그림
          this.drawLine(
            code.location.topLeftCorner,
            code.location.topRightCorner,
            '#FF3B58'
            );
          this.drawLine(
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            '#FF3B58'
            );
          this.drawLine(
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
            '#FF3B58'
            );
          this.drawLine(
            code.location.bottomLeftCorner,
            code.location.topLeftCorner,
            '#FF3B58'
            );
          // console.log(code.data);    // code.data를파싱하여로그인요청
          this.request= JSON.parse(code.data);   
          this.loginRequest(this.request);
        } else { }
      }
      requestAnimationFrame(this.tick.bind(this));
    }

    loginRequest(request) {
      this.authService.authenticateSigUser(request).subscribe((data) => {
        if (data.success) {this.authService.storeUserData(data.token, data.userNoPW);
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
}
