import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadeModel } from '../models/UnidadeModel';
import { UnidadePacoteModel } from '../models/UnidadePacoteModel';

@Injectable({
  providedIn: 'root'
})
export class UnidadeService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router : Router) { }

  getUnidade(id: number): Observable<UnidadeModel> {
    return this.http.get<UnidadeModel>(`${this.apiUrl}/unidade/${id}`);
  }

  getAllUnidade(): Observable<UnidadeModel[]> {
    return this.http.get<UnidadeModel[]>(`${this.apiUrl}/unidade`);
  }

  getUnidadePacotes(id: number): Observable<UnidadePacoteModel[]> {
    return this.http.get<UnidadePacoteModel[]>(`${this.apiUrl}/unidade/unidadePacotes/${id}`);
  }

  postUnidade(unidade: UnidadeModel) {
    return this.http.post(`${this.apiUrl}/unidade`, unidade);
  }

  deleteUnidade(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/unidade/${id}`);
  }
}
