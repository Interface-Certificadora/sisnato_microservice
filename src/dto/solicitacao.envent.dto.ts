import { IsArray, IsNumber, IsString } from 'class-validator';
import { ListaEventDto } from './lista.event.dto';

export class SolicitacaoEventDto {
  @IsNumber()
  id: number;

  @IsString()
  nome: string;

  @IsNumber()
  total: number;

  @IsString()
  valor: string;

  @IsString()
  cidade: string;

  @IsArray()
  solicitacoes: Array<ListaEventDto>;
}
