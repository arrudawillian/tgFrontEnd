import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioDetalheModel } from '../models/UsuarioDetalheModel';
import { UsuarioDocumentoModel } from '../models/UsuarioDocumentoModel';
import { UsuarioModel } from '../models/UsuarioModel';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  getUsuario(id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.apiUrl}/usuario/${id}`);
  }

  getUsuarios(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrl}/usuario`);
  }

  getUsuarioDetalhes(id: number): Observable<UsuarioDetalheModel> {
    return this.http.get<UsuarioDetalheModel>(`${this.apiUrl}/usuario/detalhes/${id}`);
  }

  getUsuariosDetalhes(): Observable<UsuarioDetalheModel[]> {
    return this.http.get<UsuarioDetalheModel[]>(`${this.apiUrl}/usuario/detalhes`);
  }

  getUsuariosCheckin(): Observable<UsuarioDetalheModel[]> {
    return this.http.get<UsuarioDetalheModel[]>(`${this.apiUrl}/usuario/checkin`);
  }

  putRegistroUsuario(usuario: UsuarioModel) {
    return this.http.put(`${this.apiUrl}/usuario/registro/${usuario.id}`, usuario);
  }

  putUsuario(usuario: UsuarioModel) {
    return this.http.put(`${this.apiUrl}/usuario/${usuario.id}`, usuario);
  }

  getUsuarioPagamentos(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarioDocumento/pagamentos/${id}`);
  }

  getUsuarioPossuiAtestado(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarioDocumento/atestado/${id}`);
  }

  getFaltaPagar(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pagamento/faltaPagar/${id}`);
  }

  postUpload(file: File, nome: string) {
    const fileToUpload = <File>file[0];
    const formData = new FormData();

    formData.append('file', fileToUpload, nome)

    return this.http.post(`${this.apiUrl}/usuarioDocumento/upload`, formData );
  }

  getUsuarioDocumentos(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarioDocumento/${id}`);
  }

  postUploadProd(file: File, nome: string) {
    const fileToUpload = <File>file[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, nome)
    
    return this.http.post(`https://woalink.com.br/upload`, formData, {responseType: 'text'});
  }

  postUsuarioDocumento(usuarioDocumento: UsuarioDocumentoModel) {
    return this.http.post(`${this.apiUrl}/usuarioDocumento`, usuarioDocumento);
  }

  getTotalInscritos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuario/inscricoes`);
  }

  getTotalPacotes(): Observable<any> {
    return this.http.get<number>(`${this.apiUrl}/usuario/pacotes`);
  }
  
  getDetalhesByCodigo(codigo:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/detalhesByCodigo/${codigo}`)
  }


}
