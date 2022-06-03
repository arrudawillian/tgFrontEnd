import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  public nome: string;
  usuario: UsuarioModel;
  production = environment.production;
  imgURL = environment.imgURL;

  constructor(
    location: Location,
    private authService: AuthService,
    private usuarioService: UsuarioService
    ) {
    this.location = location;
  }

  ngOnInit() {
    this.nome = this.authService.getName();
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.usuarioService.getUsuario(parseInt(localStorage.getItem('id'))).subscribe({
      next:(result) => this.usuario = result
    })
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  logout(){
    this.authService.logout();
  }

}
