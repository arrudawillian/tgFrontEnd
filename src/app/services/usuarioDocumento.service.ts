import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioDocumentoModel } from '../models/UsuarioDocumentoModel';

@Injectable({
  providedIn: 'root'
})
export class UsuarioDocumentoService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router : Router) { }

  deleteUsuarioDocumento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarioDocumento/${id}`);
  }
  
  getTotalDocumentosByStatus(statusId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuarioDocumento/totalDocumentos/${statusId}`);
  }

  getDocumentosByUnidade(documentoId: number, statusId: number, unidadeId: number): Observable<UsuarioDocumentoModel[]> {
    return this.http.get<UsuarioDocumentoModel[]>(`${this.apiUrl}/usuarioDocumento/documentosByUnidade/${documentoId}/${statusId}/${unidadeId}`);
  }
  
  getDocumentosByStatus(documentoId: number, statusId: number): Observable<UsuarioDocumentoModel[]> {
    return this.http.get<UsuarioDocumentoModel[]>(`${this.apiUrl}/usuarioDocumento/documentosByStatus/${documentoId}/${statusId}`);
  }

  putUsuarioDocumento(documento: UsuarioDocumentoModel): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarioDocumento/`, documento);
  }
}
