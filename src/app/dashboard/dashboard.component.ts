import { Component, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import routes from './routes';
import accessRoutes from './access.routes';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/services/login.service';
import { Router } from '@angular/router';
import { HostListener } from "@angular/core";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  mobileQuery: MediaQueryList;
  eventhosRoutes = routes;
  accessRoutesList = accessRoutes;

  title = environment.title;
  username: string;
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

  logOut() {
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([`${route}`]);
  }

  ngAfterViewInit() {
    var dashboardContainer = document.getElementsByClassName("dashboard-container")[0];
    var scaleState = 0.8;
    //https://stackoverflow.com/questions/10464038/imitate-browser-zoom-with-javascript
    dashboardContainer.setAttribute("style",
      `transform: scale(${scaleState}); 
      transform-origin: top left; 
      width: ${100 * (1 / scaleState)}%; 
      height: ${100 * (1 / scaleState)}%`);
  }  
}
