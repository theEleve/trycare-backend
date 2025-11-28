import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Patch, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  UsePipes,
  ValidationPipe 
} from '@nestjs/common';
import { HospitalQueueService } from './hospital-queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';

@Controller('queue')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class HospitalQueueController {
  constructor(private readonly queueService: HospitalQueueService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addToQueue(@Body() createQueueDto: CreateQueueDto) {
    const queue = await this.queueService.addToQueue(createQueueDto);
    return {
      success: true,
      message: 'Patient added to queue successfully',
      data: queue,
    };
  }

  @Get('doctor/:doctor_id')
  async getDoctorQueue(@Param('doctor_id') doctor_id: string) {
    const queue = await this.queueService.getDoctorQueue(doctor_id);
    return {
      success: true,
      message: 'Doctor queue retrieved successfully',
      data: queue,
      count: queue.length,
    };
  }

  @Get('hospital/:hospital_id')
  async getHospitalQueue(@Param('hospital_id') hospital_id: string) {
    const queue = await this.queueService.getHospitalQueue(hospital_id);
    return {
      success: true,
      message: 'Hospital queue retrieved successfully',
      data: queue,
      count: queue.length,
    };
  }

  @Get(':queue_id')
  async getQueueById(@Param('queue_id') queue_id: string) {
    const queue = await this.queueService.getQueueById(queue_id);
    return {
      success: true,
      message: 'Queue entry retrieved successfully',
      data: queue,
    };
  }

  @Delete(':queue_id')
  @HttpCode(HttpStatus.OK)
  async removeFromQueue(@Param('queue_id') queue_id: string) {
    const result = await this.queueService.removeFromQueue(queue_id);
    return {
      success: true,
      ...result,
    };
  }

  @Get('position/:patient_user_id/:doctor_id')
  async getPatientPosition(
    @Param('patient_user_id') patient_user_id: string,
    @Param('doctor_id') doctor_id: string,
  ) {
    const position = await this.queueService.getPatientPosition(
      patient_user_id,
      doctor_id,
    );
    return {
      success: true,
      message: 'Patient position retrieved successfully',
      data: position,
    };
  }

  @Patch(':queue_id/priority')
  async updatePriority(
    @Param('queue_id') queue_id: string,
    @Body() updatePriorityDto: UpdatePriorityDto,
  ) {
    const updated = await this.queueService.updatePriority(
      queue_id,
      updatePriorityDto,
    );
    return {
      success: true,
      message: 'Priority updated successfully',
      data: updated,
    };
  }

  @Delete('doctor/:doctor_id/clear')
  @HttpCode(HttpStatus.OK)
  async clearQueue(@Param('doctor_id') doctor_id: string) {
    const result = await this.queueService.clearQueue(doctor_id);
    return {
      success: true,
      ...result,
    };
  }
}
