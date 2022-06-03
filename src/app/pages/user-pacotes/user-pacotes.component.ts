import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UnidadePacoteModel } from 'src/app/models/UnidadePacoteModel';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { AuthService } from 'src/app/services/auth.service';
import { UnidadeService } from 'src/app/services/unidade.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-user-pacotes',
  templateUrl: './user-pacotes.component.html',
  styleUrls: ['./user-pacotes.component.scss']
})
export class UserPacotesComponent implements OnInit {

  registerForm: FormGroup;
  idUsuario: any;
  usuario: UsuarioModel;
  unidadePacotes: UnidadePacoteModel[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService: UsuarioService,
    private unidadeService: UnidadeService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.authService.PrimeiroAcesso();
    this.Validation();
    this.idUsuario = localStorage.getItem('id');
    this.usuarioService.getUsuarioDetalhes(parseInt(this.idUsuario)).subscribe({
      next: (result) => this.usuario = result,
      complete: () => {
        this.unidadeService.getUnidadePacotes(this.usuario.unidadeId).subscribe({
          next: (result) => this.unidadePacotes = result,
        })
      }
    })
  }

  Validation(): void {
    this.registerForm = this.formBuilder.group({
      unidadePacoteId: ['', Validators.required],
    });
  }

  SalvarPacote() {
    if (this.registerForm.valid) {
      this.usuario.unidadePacoteId = this.registerForm.value.unidadePacoteId;
      this.usuarioService.putUsuario(this.usuario).subscribe({
        error: (e) => {
          this.toastr.error(`Falha ao tentar salvar: ${e.error}`, '',
            {
              timeOut: 2000,
              progressBar: true,
            })
        },
        complete: () => {
          this.toastr.success(`Dados atualizados com sucesso`, '',
            {
              timeOut: 2000,
              progressBar: true,
            })
          this.router.navigate(['/dashboard']);
        }
      })
    } else {
      this.toastr.warning('Selecione um pacote', '', {
        timeOut: 2000,
        progressBar: true,
      });
      this.registerForm.markAllAsTouched();
    }
  }
}
