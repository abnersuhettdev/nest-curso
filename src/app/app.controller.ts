import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/teste')
  getTest(): string {
    return 'Rota de teste API';
  }

  @Post('/teste')
  CreateTest(): string {
    return 'ROTA POST FUNCIONANDO';
  }
}
