import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CursoModel } from 'src/app/models/CursoModel';
import { UnidadeModel } from 'src/app/models/UnidadeModel';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { AuthService } from 'src/app/services/auth.service';
import { CursoService } from 'src/app/services/curso.service';
import { UnidadeService } from 'src/app/services/unidade.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  usuario: UsuarioModel;
  registerForm: FormGroup;
  aluno: boolean = true;
  unidades: UnidadeModel[];
  cursos: CursoModel[];
  production = environment.production;
  imgURL = environment.imgURL;
  file: File;
  nomeImg: string;
  unidadeId: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private unidadeService: UnidadeService,
    private toastr: ToastrService,
    private cursoService: CursoService) { }

  ngOnInit() {
    this.authService.PrimeiroAcesso();
    this.Validation();
    this.BuscarUsuario();
    this.GetUnidades();

  }

  BuscarUsuario() {
    this.usuarioService.getUsuario(parseInt(localStorage.getItem('id'))).subscribe({
      next: (result) => this.usuario = result,
      complete: () => {
        this.registerForm.patchValue(this.usuario);
        if (this.usuario.cursoId == null) {
          this.aluno = false;
        }
        this.GetCursos(this.usuario.unidadeId);
      }
    })
  }

  Validation(): void {
    this.registerForm = this.formBuilder.group({
      sexo: ['', Validators.required],
      identidade: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      celular: ['', [Validators.required, Validators.minLength(11)]],
      unidadeId: ['', Validators.required],
      ra: ['',],
      cursoId: ['',]
    });
  }
  private GetUnidades() {
    this.unidadeService.getAllUnidade().subscribe({
      next: (result) => this.unidades = result,
      error: (e) => this.toastr.error(`Falha ao buscar unidades`, '',
        {
          timeOut: 2000,
          progressBar: true,
        }),
    });
  }

  GetCursos(unidadeId: number) {
    this.cursoService.getAllCursoByUnidade(unidadeId).subscribe({
      next: (result) => this.cursos = result,
      error: (e) => this.toastr.error(`Falha ao buscar os cursos`, '',
        {
          timeOut: 2000,
          progressBar: true,
        }),
    });
  }

  SwitchAluno() {
    this.aluno = !this.aluno;
    let campos: string[] = ['ra', 'cursoId']
    if (this.aluno) {
      campos.forEach(element => {
        this.registerForm.get(element).setValidators(Validators.required)
        this.registerForm.get(element).setErrors(Validators.required);
        this.registerForm.get(element).markAsUntouched();
      });
      this.registerForm.updateValueAndValidity();
    } else {
      campos.forEach(element => {
        this.registerForm.get(element).setValue('');
        this.registerForm.get(element).setErrors(null);
        this.registerForm.get(element).clearValidators();
      });
      this.registerForm.updateValueAndValidity();
    }
  }

  Registrar() {
    if (this.registerForm.valid) {
      Object.assign(this.usuario, this.registerForm.value)
      if (!this.aluno) {
        this.usuario.ra = null;
        this.usuario.cursoId = null;
      }
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
          this.router.navigate(['/user-profile-register']);
        }
      })
    } else {
      this.toastr.warning('Preencha todos os campos', '', {
        timeOut: 2000,
        progressBar: true,
      });
      this.registerForm.markAllAsTouched();
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      this.SalvarPacote();
    }
  }

  onSelectChange() {
    this.unidadeId = this.registerForm.value.unidadeId
    this.registerForm.get('cursoId').setValue('');
    this.GetCursos(this.unidadeId);
    this.registerForm.get('cursoId').setValidators(Validators.required)
    this.registerForm.get('cursoId').setErrors(Validators.required);
    this.registerForm.get('cursoId').markAsUntouched();
  }

  SalvarPacote() {
    let formato: string = this.file[0].type.split('/')
    if (!formato[0].includes('image')) {
      this.toastr.error('Formato inválido')
      return;
    }
    let nome = this.RemoveAcento(this.usuario.nome).split(' ');
    this.nomeImg = nome[0] + nome.pop() + formatDate(Date.now(), 'ddMMyyyyhhmmss', 'en-US') + '.' + formato[1];
    this.uploadImagem();
  }

  uploadImagem() {
    if (this.production) {
      this.nomeImg = 'files/' + this.nomeImg;
      this.usuarioService.postUploadProd(this.file, this.nomeImg).subscribe({
        error: (e) => this.toastr.error("Erro ao fazer o upload da imagem :("),
        complete: () => {
          let newUsuario = Object.assign({}, this.usuario);
          newUsuario.img = this.nomeImg;
          this.usuarioService.putUsuario(newUsuario).subscribe({
            error: (e) => this.toastr.error("Erro ao fazer o upload da imagem :("),
            complete: () => {
              this.BuscarUsuario();
            }
          })
        }
      });
    } else {
      this.usuarioService.postUpload(this.file, this.nomeImg).subscribe({
        error: (e) => this.toastr.error("Erro ao fazer o upload da imagem :("),
        complete: () => {
          let newUsuario = Object.assign({}, this.usuario);
          newUsuario.img = this.nomeImg;
          this.usuarioService.putUsuario(newUsuario).subscribe({
            error: (e) => this.toastr.error("Erro ao fazer o upload da imagem :("),
            complete: () => {
              this.BuscarUsuario();
            }
          })
        }
      });
    }
  }

  RemoveAcento(text: string) {
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text;
  }
}
