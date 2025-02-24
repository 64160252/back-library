// import { Store } from 'src/all-role/store/entities/store.entity';
// import { Teacher } from 'src/all-role/teacher/entities/teacher.entity';
// import { Department } from 'src/department/entities/department.entity';
// import { Faculty } from 'src/faculty/entities/faculty.entity';
// import { Role } from 'src/role/entities/role.entity';
// import { User } from 'src/user/entities/users.entity';
// import {
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('offerForms')
// export class OfferForm {
//   @PrimaryGeneratedColumn()
//   offer_form_id: number;

//   @Column({ default: null, nullable: true })
//   user_fullname: string;

//   @Column({ default: null, nullable: true })
//   user_name: string;

//   @Column({ default: null, nullable: true })
//   user_email: string;

//   @Column({ default: null, nullable: true })
//   user_tel: string;

//   // @ManyToOne(() => Role, (role) => role.OfferForms, {
//   //   eager: true,
//   //   nullable: true,
//   // }) // เพิ่ม eager loading
//   // @JoinColumn({ name: 'role_id' })
//   // role: Role;

//   @ManyToOne(() => Faculty, (faculty) => faculty.OfferForms, {
//     eager: true,
//     nullable: true,
//   })
//   @JoinColumn({ name: 'faculty_id' })
//   faculty: Faculty;

//   @ManyToOne(() => Department, (department) => department.OfferForms, {
//     eager: true,
//   })
//   @JoinColumn({ name: 'department_id' })
//   department: Department;

//   @ManyToOne(() => Store, (store) => store.OfferForms, {
//     eager: true,
//     nullable: true,
//   })
//   @JoinColumn({ name: 'store_id' })
//   store: Store; // ชื่อร้านค้า

//   @Column()
//   book_title: string; // ชื่อเรื่อง

//   @Column()
//   book_author: string; // ชื่อผู้แต่ง

//   @Column()
//   published_year: number; // ปีพิมพ์

//   @Column()
//   ISBN: string; // ISBN

//   @Column()
//   book_subject: string; // รายวิชา

//   @Column()
//   book_price: number; // ราคาสุทธิ

//   @Column()
//   book_quantity: number; // จำนวนเล่ม

//   @Column({ nullable: true })
//   book_category: string;

//   @Column()
//   coupon_used: string;

//   @Column({ default: 'กำลังดำเนินการ' })
//   form_status: string;

//   @Column('simple-array', { nullable: true })
//   book_imgs: string[];

//   @ManyToOne(() => Teacher, (teacher) => teacher.OfferForms, { eager: true }) // เพิ่ม eager loading
//   teacher: Teacher;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   @DeleteDateColumn()
//   deletedAt: Date;
// }
