import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppCookieService } from '../../services/app-cookie.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private appCookieService: AppCookieService,
    private router: Router
  ) {

  }
  doLogout(): void {
    this.appCookieService.deleteAccessToken();
    this.router.navigate(['/login']);
  }
}
