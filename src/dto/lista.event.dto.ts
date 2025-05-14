import { IsArray, IsNumber, IsString } from 'class-validator';
import { FichaEventDto } from './ficha.event.dto';

export class ListaEventDto {
  @IsNumber()
  id: number;

  @IsString()
  cpf: string;

  @IsString()
  nome: string;

  @IsNumber()
  total: number;

  @IsArray()
  fichas: Array<FichaEventDto>;
}
