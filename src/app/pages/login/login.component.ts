import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioLoginModel } from 'src/app/models/UsuarioLoginModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  usuarioLoginModel: UsuarioLoginModel;

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    if (this.authService.loggedIn())
      this.authService.isAdmin() === true ? this.router.navigate(['/dashboard-admin']) : this.router.navigate(['/dashboard'])
    this.Validation();
  }

  Validation(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(100)]],
      senha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });
  }

  Login(): void {
    if (this.loginForm.valid) {
      this.usuarioLoginModel = Object.assign(this.loginForm.value);
      this.authService.login(this.usuarioLoginModel).subscribe({
        next: () => this.toastr.success('Login realizado com sucesso', '',
          {
            timeOut: 1000,
            progressBar: true,
          }),
        error: (e) => this.toastr.error(`Falha ao tentar Logar: ${e.error.title == 'Unauthorized' ? 'Email ou senha inválido' : e.error.title}`, '',
          {
            timeOut: 2000,
            progressBar: true,
          }),
        complete: () => {
          if (parseInt(this.authService.getRole()) === 3) {
            this.router.navigate(['/dashboard-admin'])
          } else {
            this.router.navigate(['/dashboard'])
          }
        }
      });
    }
  }


}
