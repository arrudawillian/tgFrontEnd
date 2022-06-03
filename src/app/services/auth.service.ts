import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioLoginModel } from '../models/UsuarioLoginModel';
import { UsuarioRegistroModel } from '../models/UsuarioRegistroModel';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private usuarioService: UsuarioService) { }

  registrar(model: UsuarioRegistroModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, model);
  }

  login(model: UsuarioLoginModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, model).pipe(
      map((response: any) => {
        const USER = response;
        if (USER) {
          localStorage.setItem('token', USER.token);
          localStorage.setItem('nome', USER.usuario.nome);
          localStorage.setItem('id', USER.usuario.id);
          localStorage.setItem('primeiroAcesso', USER.usuario.unidadeId === null ? 'true' : 'false');
        }
      })
    )
  }

  loggedIn() {
    if (localStorage.getItem('token') != null) {
      return true;
    }
    return false;
    //verificar futuramente se o token é válido
  }

  getRole() {
    return localStorage.getItem('token');
    //ajustar futuramente para voltar a role
  }

  isAdmin() {
    if (parseInt(this.getRole()) === 3) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('id');
    localStorage.removeItem('primeiroAcesso');
    this.router.navigate(['/login'])
  }

  getName() {
    return localStorage.getItem('nome');
  }

  PrimeiroAcesso(): void {
    if (localStorage.getItem('primeiroAcesso') === 'true') {
      this.router.navigate(['/user-profile-register'])
    }
  }

  IsPrimeiroAcesso(): boolean {
    if (localStorage.getItem('primeiroAcesso') === 'true') {
      return true
    } else {
      return false
    }
  }
}

