import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CursoModel } from '../models/CursoModel';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router : Router) { }

  getCurso(id: number): Observable<CursoModel> {
    return this.http.get<CursoModel>(`${this.apiUrl}/curso/${id}`);
  }

  getAllCurso(): Observable<CursoModel[]> {
    return this.http.get<CursoModel[]>(`${this.apiUrl}/curso`);
  }

  getAllCursoByUnidade(unidadeId: number): Observable<CursoModel[]> {
    return this.http.get<CursoModel[]>(`${this.apiUrl}/curso/unidade/${unidadeId}`);
  }

  postCurso(curso: CursoModel) {
    return this.http.post(`${this.apiUrl}/curso`, curso);
  }

  deleteCurso(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/curso/${id}`);
  }
}
