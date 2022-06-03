import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioRegistroModel } from 'src/app/models/UsuarioRegistroModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  usuarioRegistroModel: UsuarioRegistroModel;

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public toastr: ToastrService) { }

  ngOnInit() {
    if (this.authService.loggedIn())
    this.authService.isAdmin() === true ? this.router.navigate(['/icons']) : this.router.navigate(['/dashboard'])
    this.Validation();
  }

  Validation(): void {
    this.registerForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(100)]],
      senhas: this.formBuilder.group(
        {
          senha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
          confirmaSenha: ['', Validators.required]
        }, { validator: this.CompararSenhas })
    });
  }

  CompararSenhas(fb: FormGroup): void {
    const confirmaSenhaCtrl = fb.get('confirmaSenha');
    if (confirmaSenhaCtrl.errors == null || 'mismatch' in confirmaSenhaCtrl.errors) {
      if (fb.get('senha').value !== confirmaSenhaCtrl.value) {
        confirmaSenhaCtrl.setErrors({ mismatch: true });
      } else {
        confirmaSenhaCtrl.setErrors(null);
      }
    }
  }

  RegistrarUsuario(): void {
    if (this.registerForm.valid) {
      this.usuarioRegistroModel = Object.assign(
        { senha: this.registerForm.get('senhas.senha').value },
        { confirmaSenha: this.registerForm.get('senhas.confirmaSenha').value },
        this.registerForm.value);
      this.authService.registrar(this.usuarioRegistroModel).subscribe({
        next: () => {
          this.toastr.success(`Salvo com sucesso`, '',
            {
              timeOut: 2000,
              progressBar: true,
            })
        },
        error: (e) => {
          this.toastr.error(`Falha ao tentar salvar: ${e.error}`, '',
            {
              timeOut: 2000,
              progressBar: true,
            })
        },
        complete: () => this.router.navigate(['/login'])
      })
    }
  }
}
