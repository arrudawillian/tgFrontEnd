import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UsuarioDocumentoModel } from 'src/app/models/UsuarioDocumentoModel';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioDocumentoService } from 'src/app/services/usuarioDocumento.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.scss']
})
export class UserDocumentsComponent implements OnInit {

  registerForm: FormGroup;
  idUsuario: any;
  nomeUsuario: any;
  documento: UsuarioDocumentoModel;
  documentos: UsuarioDocumentoModel[];
  file: File;
  modalRef?: BsModalRef;
  path: string;
  documentoId: number;
  valueWidth = false;
  temAtestado: boolean = false;

  imgURL = environment.imgURL;
  production = environment.production;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private usuarioDocumentoService: UsuarioDocumentoService
  ) { }

  ngOnInit() {
    this.authService.PrimeiroAcesso();
    this.Validation();
    this.idUsuario = localStorage.getItem('id');
    this.nomeUsuario = localStorage.getItem('nome');
    this.BuscarDocumentos();
  }

  Validation(): void {
    this.registerForm = this.formBuilder.group({
      titulo: ['', Validators.required],
    });
  }

  SalvarPacote(tipoDocumento: number) {
    this.documento = Object.assign({}, this.registerForm.value);
    let formato: string = this.file[0].type.split('/')
    if (!formato[0].includes('image')) {
      this.toastr.error('Formato inválido')
      return;
    }
    let nome = this.RemoveAcento(this.nomeUsuario).split(' ');
    this.documento.titulo = nome[0] + nome.pop() + formatDate(Date.now(), 'ddMMyyyyhhmmss', 'en-US') + '.' + formato[1];
    this.documento.usuarioId = this.idUsuario;
    this.documento.documentoId = tipoDocumento;
    this.documento.statusId = 1;
    this.uploadImagem();
  }

  uploadImagem() {
    if (this.production) {
      this.documento.path = 'files/' + this.documento.titulo;
      this.usuarioService.postUploadProd(this.file, this.documento.titulo).subscribe({
        error: (e) => this.toastr.error("Erro ao fazer o upload da imagem :("),
        complete: () => {
          this.usuarioService.postUsuarioDocumento(this.documento).subscribe({
            error: (e) => this.toastr.error("Erro ao fazer o upload da imagem :("),
            complete: () => {
              this.toastr.success('Imagem enviada com sucesso!')
              this.BuscarDocumentos();
            }
          })
        }
      });

    } else {
      this.usuarioService.postUpload(this.file, this.documento.titulo).subscribe({
        error: (e) => this.toastr.error("Erro ao fazer o upload da imagem :("),
        complete: () => {
          this.usuarioService.postUsuarioDocumento(this.documento).subscribe({
            error: (e) => this.toastr.error("Erro ao fazer o upload da imagem :("),
            complete: () => {
              this.toastr.success('Imagem enviada com sucesso!')
              this.BuscarDocumentos();
            }
          })
        }
      });
    }
  }

  onFileChange(event, tipoDocumento: number) {
    if (tipoDocumento == 1 && this.temAtestado == true) {
      this.toastr.error('Você já enviou o atestado de matrícula!')
    } else {
      if (event.target.files && event.target.files.length) {
        this.file = event.target.files;
        this.SalvarPacote(tipoDocumento)
      }
    }
  }

  BuscarDocumentos() {
    this.usuarioService.getUsuarioDocumentos(this.idUsuario).subscribe({
      next: (result) => this.documentos = result,
      complete: () => {
        for (let index = 0; index < this.documentos.length; index++) {
          if (this.documentos[index].documentoId == 1) {
            this.temAtestado = true;
            break;
          }
        }
      }
    })
  }

  openModalView(template: TemplateRef<any>, path: string) {
    this.path = path;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalExcluir(template: TemplateRef<any>, documentoId: number) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.documentoId = documentoId;
  }

  confirm(): void {
    this.modalRef?.hide();
    this.usuarioDocumentoService.deleteUsuarioDocumento(this.documentoId).subscribe({
      error: (e) => this.toastr.error(`Erro ao excluir: ${e}`),
      complete: () => {
        this.documentoId = null;
        this.BuscarDocumentos()
      }
    });
  }

  decline(): void {
    this.modalRef?.hide();
    this.documentoId = null
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
