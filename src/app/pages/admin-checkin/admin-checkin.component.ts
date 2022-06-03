import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UsuarioDetalheModel } from 'src/app/models/UsuarioDetalheModel';
import { UsuarioModel } from 'src/app/models/UsuarioModel';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-checkin',
  templateUrl: './admin-checkin.component.html',
  styleUrls: ['./admin-checkin.component.scss']
})
export class AdminCheckinComponent implements OnInit {

  usuario: UsuarioDetalheModel;
  usuarioSelecionado: UsuarioModel;
  usuarios: UsuarioDetalheModel[];
  checkinForm: FormGroup;
  production = environment.production;
  imgURL = environment.imgURL;
  modalRef?: BsModalRef;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.Validation();

    this.BuscarUsuariosCheckin();
  }

  private BuscarUsuariosCheckin() {
    this.usuarioService.getUsuariosCheckin().subscribe({
      next: (r) => this.usuarios = r
    });
  }

  openModalCheckin(template: TemplateRef<any>, usuario: UsuarioModel) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    this.usuarioSelecionado = usuario;
    this.usuarioService.getUsuarioDetalhes(this.usuarioSelecionado.id).subscribe({
      next: (r) => this.usuario = r
    })
  }

  Validation(): void {
    this.checkinForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    });
  }

  Registrar() {
  }

  onInputChange(template: TemplateRef<any>) {
    if (this.checkinForm.valid) {
      this.usuarioSelecionado.codigo = this.checkinForm.value.codigo;
      this.usuarioService.putUsuario(this.usuarioSelecionado).subscribe({
        error: (e) => {this.toastr.error(`Erro ao atualizar usuário ${e.error}`)},
        complete: () => {
          this.BuscarUsuariosCheckin();
          this.usuarioSelecionado = null;
          this.usuario=null;
          this.checkinForm.get('codigo').setValue('');
          this.checkinForm.get('codigo').setErrors(null);
          this.checkinForm.updateValueAndValidity();
          this.toastr.success('Checkin realizado com sucesso')
          this.modalRef?.hide();
        }
      })
    } else {
      this.toastr.warning('Preencha o código corretamente', '', {
        timeOut: 2000,
        progressBar: true,
      });
      this.checkinForm.markAllAsTouched();
    }
  }
}
