import { CursoModel } from "./CursoModel";
import { UnidadeModel } from "./UnidadeModel";
import { UnidadePacoteModel } from "./UnidadePacoteModel";

export class UsuarioDetalheModel {
    id: number;
    nome: string;
    email: string;
    unidadeId: number;
    unidadePacoteId: number;
    cursoId: number;
    identidade: string;
    celular: string;
    sexo: string;
    img: string;
    ra: string;
    dataNascimento : string;
    codigo: string;
    
    curso: CursoModel;
    unidade: UnidadeModel;
    unidadePacote: UnidadePacoteModel;
}
