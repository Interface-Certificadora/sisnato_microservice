import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @EventPattern('processar_relatorio')
  handleEvent(@Payload() data: any) {
    this.appService.processarEvent(data);
  }
}
