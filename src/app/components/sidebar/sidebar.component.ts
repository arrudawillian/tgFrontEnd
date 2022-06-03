import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  role: number;
  
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '', role: 1 },
  { path: '/user-profile', title: 'Perfil', icon: 'ni-single-02 text-yellow', class: '', role: 1 },
  { path: '/user-documents', title: 'Documentos', icon: 'ni-folder-17 text-info', class: '', role: 1 },
  { path: '/user-pacote', title: 'Pacotes', icon: 'ni-badge text-red', class: '', role: 1 },
  { path: '/dashboard-admin', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '', role: 3 },
  { path: '/admin-atestados', title: 'Atestados', icon: 'ni-paper-diploma text-yellow', class: '', role: 3 },
  { path: '/admin-pagamentos', title: 'Pagamentos', icon: 'ni-money-coins text-green', class: '', role: 3 },
  { path: '/admin-consulta', title: 'Consulta', icon: 'ni-single-02 text-pink', class: '', role: 3 },
  { path: '/admin-checkin', title: 'Checkin', icon: 'ni-check-bold text-red', class: '', role: 3 },
  { path: '/admin-curso', title: 'Cursos', icon: 'ni-planet text-blue', class: '', role: 3 },
  { path: '/admin-unidade', title: 'Unidades', icon: 'ni-bullet-list-67 text-red', class: '', role: 3 },
  { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '', role: 4 },
  { path: '/register', title: 'Registro', icon: 'ni-circle-08 text-pink', class: '', role: 4 },
  { path: '/user-profile-register', title: '', icon: 'ni-single-02 text-yellow', class: '', role: 4 },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  messageReceived: any;
  private subscriptionName: Subscription; //important to create a subscription
  usuario: UsuarioModel;
  production = environment.production;
  imgURL = environment.imgURL;

  public menuItems: any[];
  public isCollapsed = true;
  public role: string;
  public primeiroAcesso: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private usuarioService: UsuarioService) {
    // subscribe to sender component messages
    this.subscriptionName = this.commonService.getUpdate().subscribe
      (message => { //message contains the data sent from service
        this.messageReceived = message;
        if (this.messageReceived.primeiroAcesso == false) {
          this.primeiroAcesso = false;
        }
      });
  }

  ngOnDestroy() { // It's a good practice to unsubscribe to ensure no memory leaks
    this.subscriptionName.unsubscribe();
  }

  ngOnInit() {
    this.role = this.authService.getRole();
    this.primeiroAcesso = this.authService.IsPrimeiroAcesso();
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
    this.usuarioService.getUsuario(parseInt(localStorage.getItem('id'))).subscribe({
      next:(result) => this.usuario = result
    })
  }

  logout(){
    this.authService.logout();
  }
}
