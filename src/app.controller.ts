import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  path: 'cats',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Version('2')
  getHello2(): string {
    return this.appService.getHello2();
  }
}
