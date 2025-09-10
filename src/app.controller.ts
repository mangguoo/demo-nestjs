import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  path: 'cats',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get()
  @Version('2')
  async getHello2() {
    return await this.appService.getHello2();
  }

  @Get('send-email')
  async sendEmail() {
    return await this.appService.sendEmail();
  }
}
