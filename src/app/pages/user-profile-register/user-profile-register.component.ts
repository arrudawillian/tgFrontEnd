import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CursoModel } from 'src/app/models/CursoModel';
import { UnidadeModel } from 'src/app/models/UnidadeModel';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { CursoService } from 'src/app/services/curso.service';
import { UnidadeService } from 'src/app/services/unidade.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile-register',
  templateUrl: './user-profile-register.component.html',
  styleUrls: ['./user-profile-register.component.scss']
})
export class UserProfileRegisterComponent implements OnInit {

  usuario: UsuarioModel;
  aluno: boolean = false;
  registerForm: FormGroup;
  unidades: UnidadeModel[];
  cursos: CursoModel[];
  file: File;
  production = environment.production;
  imgURL = environment.imgURL;
  nomeImg: string;
  unidadeId: number;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private unidadeService: UnidadeService,
    private toastr: ToastrService,
    private cursoService: CursoService,
    private commonService: CommonService) { }


  ngOnInit() {
    this.PrimeiroAcesso();
    this.Validation();
    this.BuscarUsuario();
    this.GetUnidades();
  }

  private GetUnidades() {
    this.unidadeService.getAllUnidade().subscribe({
      next: (result) => this.unidades = result,
      error: (e) => this.toastr.error(`Falha ao buscar as unidades`, '',
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

  BuscarUsuario() {
    this.usuarioService.getUsuario(parseInt(localStorage.getItem('id'))).subscribe({
      next: (result) => this.usuario = result
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
      this.usuarioService.putRegistroUsuario(this.usuario).subscribe({
        error: (e) => {
          this.toastr.error(`Falha ao tentar salvar: ${e.error}`, '',
            {
              timeOut: 2000,
              progressBar: true,
            })
        },
        complete: () => {
          localStorage.setItem('primeiroAcesso', 'false');
          this.commonService.sendUpdate({ primeiroAcesso: false });
          this.router.navigate(['/dashboard']);
        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  PrimeiroAcesso() {
    if (localStorage.getItem('primeiroAcesso') === 'false') {
      this.router.navigate(['/dashboard']);
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      this.SalvarPacote();
    }
  }

  onSelectChange(){
    this.unidadeId = this.registerForm.value.unidadeId
    this.GetCursos(this.unidadeId);
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
