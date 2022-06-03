import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  usuario: any;
  atestado: any;
  faltaPagar: any = 1;
  porcentagem: number = 0;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService) {

  }

  ngOnInit() {
    this.authService.PrimeiroAcesso();

    this.usuarioService.getUsuarioDetalhes(parseInt(localStorage.getItem('id'))).subscribe({
      next: (result) => this.usuario = result,
      complete: () => {
        this.usuarioService.getUsuarioPossuiAtestado(this.usuario.id).subscribe({
          next: (result) => this.atestado = result,
          complete: () => {
            if (this.usuario.unidadePacoteId) {
              this.usuarioService.getFaltaPagar(this.usuario.id).subscribe({
                next: (result) => this.faltaPagar = result,
              })
            }
          }
        })
      }
    })
  }
}
