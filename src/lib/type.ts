export class UpdateHospitalDto {
  readonly name?: string;
  readonly address?: string;
  readonly regNo: string;
}

export class UpdateDoctorDto {
  readonly name?: string;
  readonly specialization?: string;
  readonly doctorId: string;
  readonly hospitalId: string;
  readonly phone?: string;
  readonly email?: string;
}
