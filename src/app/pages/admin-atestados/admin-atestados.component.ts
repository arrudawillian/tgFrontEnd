import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UsuarioDocumentoModel } from 'src/app/models/UsuarioDocumentoModel';
import { UsuarioDocumentoService } from 'src/app/services/usuarioDocumento.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-atestados',
  templateUrl: './admin-atestados.component.html',
  styleUrls: ['./admin-atestados.component.scss']
})
export class AdminAtestadosComponent implements OnInit {

  idUsuario: any;
  nomeUsuario: any;
  documento: UsuarioDocumentoModel;
  documentos: UsuarioDocumentoModel[];
  file: File;
  modalRef?: BsModalRef;
  modalRefView?: BsModalRef;
  path: string;
  documentoId: number;
  valueWidth = false;
  temAtestado: boolean = false;

  imgURL = environment.imgURL;
  production = environment.production;

  constructor(
    private toastr: ToastrService,
    private modalService: BsModalService,
    private usuarioDocumentoService: UsuarioDocumentoService
  ) { }

  ngOnInit() {
    this.BuscarDocumentos();
  }

  BuscarDocumentos() {
    this.usuarioDocumentoService.getDocumentosByStatus(1,1).subscribe({
      next: (result) => this.documentos = result
      })
  }

  openModalView(template: TemplateRef<any>, path: string, documento: UsuarioDocumentoModel) {
    this.path = path;
    this.documento = documento;
    this.modalRefView = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(aprovar:boolean): void {
    this.modalRef?.hide();
    
    this.documento.statusId = aprovar == true ? 3 : 2;

    this.usuarioDocumentoService.putUsuarioDocumento(this.documento).subscribe({
      error:(e) => this.toastr.error('Erro ao aprovar o documento'),
      complete:()=> {
        this.BuscarDocumentos();
        this.modalRefView?.hide();
      }
    })
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
