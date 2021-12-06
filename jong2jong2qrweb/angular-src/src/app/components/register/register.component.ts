import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name: string;
  username: string;
  email: string;
  password1: string;
  password2:string;

  constructor(private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router : Router,
    ) { }

  ngOnInit(): void {  }

  

  onRegisterSubmit(): any{

    //패스워드 일치 여부 검증 
    if(this.password1 !== this.password2){
      this.flashMessage.show("패스워드가 일치하지 않습니다. 다시 입력하세요.", {cssClass:'alret-danger', timeout: 3000,});

      return false;
    }

    //이메일 주소 유효성 검증
    if(!this.validateService.validateEmail(this.email)){
      this.flashMessage.show("유효한 이메일 주소를 입력하세요..", {cssClass:'alret-danger', timeout: 3000,});
      return false;

    }

    

    if (this.password1.length < 8 || this.password1.length > 20) {
      this.flashMessage.show('비밀번호를 8자리 ~ 20자리 이내로 입력해주세요.', {
        cssClass: 'alert-danger',
        timeout: 3000,
      });
      console.log("비밀번호를 8자리 ~ 20자리 이내로 입력해주세요.")
      return false;
    } else if (this.password1.search(/\s/) != -1) {
      this.flashMessage.show('비밀번호는 공백 없이 입력해주세요.', {
        cssClass: 'alert-danger',
        timeout: 3000,
      });
      console.log("비밀번호를 8자리 ~ 20자리 이내로 입력해주세요.")
      return false;
    }


    



    //사용자 입력정보로 JSON 객체 생성 
    const user ={
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password1,

    };

    

    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show("모든 필드들을 입력하세요", {cssClass:'alret-danger', timeout: 3000,});
      
      return false;
    }
    
    this.authService.registerUser(user).subscribe((data) => {
      if(data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 3000,
        });

        this.router.navigate(['/login']);
      } else{

        this.flashMessage.show(data.msg,{
          cssClass: 'alert-dnager',
          timeout:3000,
        });
        this.router.navigate(['/register']);
      }

    });


    
  }

}
