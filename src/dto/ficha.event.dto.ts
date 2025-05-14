import { IsNumber, IsString } from 'class-validator';

export class FichaEventDto {
  @IsNumber()
  id: number;

  @IsString()
  modelo: string;

  @IsString()
  tipocd: string;

  @IsString()
  valorcd: string;

  @IsString()
  andamento: string;

  @IsString()
  dt_agenda: string;

  @IsString()
  formapgto: string;

  @IsString()
  hr_agenda: string;

  @IsString()
  validacao: string;

  @IsString()
  dt_aprovacao: string;

  @IsString()
  dt_revogacao: string;

  @IsString()
  hr_aprovacao: string;
}
