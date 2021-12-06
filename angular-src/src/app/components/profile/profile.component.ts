import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  msg: string;
  

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile =>{
  
      this.name = profile.user.name;
      this.username = profile.user.username;
      this.email = profile.user.email;
      this.msg = "JWT authentication OK!";

    }, 
    (err) => {
      console.log(err);
      this.msg = 'JWT authentication Failed!';
      return false;
    }
    );
  }

}
