import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import routes from './routes';
import accessRoutes from './access.routes';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mobileQuery: MediaQueryList;
  eventhosRoutes = routes;
  accessRoutesList = accessRoutes;

  title = environment.title;
  username: String;
  tablesPanelOpen = false;
  authPanelOpen = false;
  isAdminUser: boolean;

  private _mobileQueryListener: () => void;

  constructor(
    private loginService: LoginService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.isAdminUser = this.loginService.getRoles()?.indexOf('admin') !== -1;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.username = this.loginService.getUsername() || '';
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {}

  logOut() {
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([`${route}`]);
  }
}
