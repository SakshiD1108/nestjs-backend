import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  NotFoundException, 
  InternalServerErrorException, 
  BadRequestException 
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { JwtStrategy } from '../auth/jwt.strategy';  // ✅ Use standard AuthGuard

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @UseGuards(JwtStrategy, RolesGuard)  // ✅ Proper authentication
  @Roles('admin') 
  async trigger(@Body() body: { source: string; metadata?: string }) {
    try {
      if (!body.source) {
        throw new BadRequestException('Source is required.');
      }

      const response = await this.ingestionService.triggerIngestion(body);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to trigger ingestion: ${error.message}`);
    }
  }

  @Get('status/:id')
  @UseGuards(JwtStrategy, RolesGuard)
  @Roles('admin') 
  async getStatus(@Param('id') ingestionId: string) {
    try {
      if (!ingestionId) {
        throw new BadRequestException('Ingestion ID is required.');
      }

      const result = await this.ingestionService.getIngestionStatus(ingestionId);
      
      if (result.status === 'Not Found') {
        throw new NotFoundException(`Ingestion with ID ${ingestionId} not found.`);
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Error retrieving ingestion status: ${error.message}`);
    }
  }
}
