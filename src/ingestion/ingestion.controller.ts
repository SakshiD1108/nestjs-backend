import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
   @UseGuards(JwtStrategy, RolesGuard)  // ✅ Correct authentication guard
  @Roles('admin') 
  async trigger(@Body() body: { source: string; metadata?: string }) {
    return this.ingestionService.triggerIngestion(body);
  }

  @Get('status/:id')
  @UseGuards(JwtStrategy, RolesGuard)
  @Roles('admin') 
  async getStatus(@Param('id') ingestionId: string) {
    return this.ingestionService.getIngestionStatus(ingestionId);
  }
}
