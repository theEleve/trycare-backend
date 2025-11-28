import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from 'src/lib/type';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // CREATE A NEW DOCTOR
  // endpoint: /doctor/create
  @Post('create')
  create(@Body() body) {
    return this.doctorService.create(body);
  }

  // GET SPECIFIC DOCTOR UNDER A SPECIFIC HOSPITAL
  // endpoint: /doctor/:hospitalId/:doctorId
  @Get('/:hospitalId/:doctorId')
  findOne(
    @Param('hospitalId') hospitalId: string,
    @Param('doctorId') doctorId: string,
  ) {
    return this.doctorService.findOneByHospital(hospitalId, doctorId);
  }

  // GET ALL DOCTORS UNDER A HOSPITAL
  // endpoint: /doctor/:hospitalId
  @Get('/:hospitalId')
  findByHospital(@Param('hospitalId') hospitalId: string) {
    return this.doctorService.findByHospital(hospitalId);
  }

  // UPDATE A DOCTOR'S INFO
  // endpoint: /doctor/:hospitalId/:doctorId
  @Put('/:hospitalId/:doctorId')
  updateDoctor(
    @Param('hospitalId') hospitalId: string,
    @Param('doctorId') doctorId: string,
    @Body() body: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctor(hospitalId, doctorId, body);
  }

  // DELETE A DOCTOR FROM A HOSPITAL
  // endpoint: /doctor/:hospitalId/:doctorId
  @Delete('/:hospitalId/:doctorId')
  removeDoctor(
    @Param('hospitalId') hospitalId: string,
    @Param('doctorId') doctorId: string,
  ) {
    return this.doctorService.removeDoctor(hospitalId, doctorId);
  }
}
