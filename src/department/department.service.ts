import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // สร้าง Department ใหม่
  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }

  // ดึงข้อมูลทั้งหมดของ Department และ Students
  async findAll() {
    return await this.departmentRepository
      .createQueryBuilder('department') // ใช้ 'department' เป็นชื่อหลัก
      .leftJoinAndSelect('department.students', 'student') // เชื่อมโยง department กับ students
      .leftJoinAndSelect('student.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'department.department_id', // เลือกฟิลด์ department_id
        'department.department_name', // เลือกฟิลด์ department_name
        'student.student_id', // เลือกฟิลด์ student_id
        'user.user_id', // เลือกฟิลด์ user_id
        'user.user_name', // เลือกฟิลด์ user_name
        'user.user_email', // เลือกฟิลด์ user_email
        'user.user_tel', // เลือกฟิลด์ user_tel
      ]) // เลือกเฉพาะฟิลด์ที่ต้องการ
      .getMany();
  }

  // ดึงข้อมูล Department ตาม ID พร้อมรายชื่อ Students ที่อยู่ใน Department นั้น
  async findOne(id: number) {
    return await this.departmentRepository
      .createQueryBuilder('department') // ใช้ 'department' เป็นชื่อหลัก
      .leftJoinAndSelect('department.students', 'student') // เชื่อมโยง department กับ students
      .leftJoinAndSelect('student.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'department.department_id', // เลือกฟิลด์ department_id
        'department.department_name', // เลือกฟิลด์ department_name
        'student.student_id', // เลือกฟิลด์ student_id
        'user.user_id', // เลือกฟิลด์ user_id
        'user.user_name', // เลือกฟิลด์ user_name
        'user.user_email', // เลือกฟิลด์ user_email
        'user.user_tel', // เลือกฟิลด์ user_tel
      ]) // เลือกเฉพาะฟิลด์ที่ต้องการ
      .where('department.department_id = :id', { id }) // กำหนดเงื่อนไขค้นหาตาม department_id
      .getOne();
  }

  // อัปเดตข้อมูล Department
  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    // ตรวจสอบว่า Department ที่ต้องการอัปเดตมีอยู่หรือไม่
    const department = await this.findOne(id);
    Object.assign(department, updateDepartmentDto); // รวมค่าจาก DTO ที่ส่งเข้ามา
    return this.departmentRepository.save(department); // บันทึกข้อมูลที่อัปเดต
  }

  // ลบข้อมูล Department
  async remove(id: number) {
    // ตรวจสอบว่า Department ที่ต้องการลบมีอยู่หรือไม่
    const department = await this.findOne(id);
    return this.departmentRepository.remove(department); // ลบข้อมูลออกจากฐานข้อมูล
  }
}
