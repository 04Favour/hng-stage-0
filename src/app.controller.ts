import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { NameDto } from './classify.dto';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/classify')
  clasify(@Query() name: NameDto) {
    return this.appService.classify(name);
  }
}
