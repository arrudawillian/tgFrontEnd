import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioLoginModel } from 'src/app/models/UsuarioLoginModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.scss']
})
export class EsqueciSenhaComponent implements OnInit {

  esqueciSenhaForm: FormGroup;
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
    this.esqueciSenhaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(100)]],
    });
  }

  Enviar(): void {
    
  }


}
