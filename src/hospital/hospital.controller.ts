import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { UpdateHospitalDto } from 'src/lib/type';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  // CREATE A NEW HOSPITAL
  // endpoint: /hospital/create
  @Post('create')
  async create(@Body() body: { name: string; address: string; regNo: string }) {
    return this.hospitalService.createHospital(body);
  }

  // GET ALL HOSPITALS
  // endpoint: /hospital
  @Get()
  async findAll() {
    return this.hospitalService.getAllHospitals();
  }

  // GET A SPECIFIC HOSPITAL BY ID
  // endpoint: /hospital/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.hospitalService.getHospitalById(id);
  }

  // UPDATE A HOSPITAL'S INFORMATION
  // endpoint: /hospital/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateHospitalDto) {
    return this.hospitalService.updateHospital(id, body);
  }

  // DELETE A HOSPITAL
  // endpoint: /hospital/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hospitalService.removeHospital(id);
  }
}
