import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-consulta',
  templateUrl: './admin-consulta.component.html',
  styleUrls: ['./admin-consulta.component.scss']
})
export class AdminConsultaComponent implements OnInit {

  modalRef?: BsModalRef;
  codigo: any;

  imgURL = environment.imgURL;
  production = environment.production;
  consultaForm: FormGroup;
  usuario: any;

  constructor(
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.Validation();
    document.getElementById("input-codigo").focus();
  }

  Validation(): void {
    this.consultaForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  hideModal() {
    this.modalRef?.hide()
    document.getElementById("input-codigo").focus();
  }

  onInputChange(template: TemplateRef<any>) {
    if (this.consultaForm.valid) {
      this.codigo = this.consultaForm.value.codigo;
      this.usuarioService.getDetalhesByCodigo(this.codigo).subscribe({
        next: (r) => this.usuario = r,
        error: (e) => this.toastr.error('Erro ao pesquisar participante'),
        complete: () => {
          this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
          this.consultaForm.get('codigo').setValue('');
          this.consultaForm.get('codigo').setErrors(null);
          document.getElementById("input-codigo").focus();
        }
      })
    } else {
      this.toastr.warning('Preencha o código corretamente', '', {
        timeOut: 2000,
        progressBar: true,
      });
      this.consultaForm.markAllAsTouched();
    }
  }

}
