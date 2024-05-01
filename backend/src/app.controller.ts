import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('event-listener')
  eventListener(@Body() body: any): void {
    console.log(body);
    return;
  }
}
