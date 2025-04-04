import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Store } from 'src/Role-and-Duty/store/entities/store.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  // ฟังก์ชันสร้าง หนังสือ
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const {
      ISBN,
      book_title,
      book_author,
      book_price,
      book_category,
      book_published,
      store,
      ...bookData
    } = createBookDto;
  
    try {
      const storeEntity = await this.storeRepository.findOne({
        where: { store_id: store },
      });
  
      if (!storeEntity) {
        throw new BadRequestException('Store not found');
      }
  
      // 🛠 ค้นหาหนังสือที่มี ISBN เดียวกันในร้านค้านี้
      const existingBooks = await this.bookRepository.find({
        where: { ISBN, store: { store_id: storeEntity.store_id } }, // เช็คเฉพาะร้านนี้
      });
  
      console.log(`🔍 Found ${existingBooks.length} books with ISBN ${ISBN} in store ${storeEntity.store_id}`);
  
      // ✅ ถ้ามีหนังสือที่มี ISBN นี้อยู่แล้ว ให้นับ book_volumn ต่อ
      const newBookVolumn = existingBooks.length > 0 ? Math.max(...existingBooks.map(b => b.book_volumn)) + 1 : 1;
  
      console.log(`📖 New book_volumn for ISBN ${ISBN}: ${newBookVolumn}`);
  
      const book = this.bookRepository.create({
        ...bookData,
        ISBN,
        book_title,
        book_author,
        book_price,
        book_category,
        book_published,
        store: storeEntity,
        store_name: storeEntity.store_name,
        book_volumn: newBookVolumn, // 🆕 กำหนดค่า book_volumn ตามจำนวนที่มีอยู่
        book_status: 'ยังไม่ขาย', // ค่าเริ่มต้น
        book_description: 'ไม่มีรายละเอียด', // ค่าเริ่มต้น
      });
  
      const savedBook = await this.bookRepository.save(book);
      return savedBook;
    } catch (error) {
      throw new BadRequestException(`Book creation failed: ${error.message}`);
    }
  }  

  // ฟังก์ชันค้นหา หนังสือ ทั้งหมด
  async findAll() {
    return await this.bookRepository.createQueryBuilder('book').getMany();
  }

  // ฟังก์ชันค้นหา หนังสือ ตาม id
  async findOne(id: number) {
    return await this.bookRepository
      .createQueryBuilder('book')
      .where('book.book_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข หนังสือ
  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({
      where: { book_id: id },
    });
    if (!book) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    const updatedbook = Object.assign(book, updateBookDto);
    return this.bookRepository.save(updatedbook);
  }

  // ฟังก์ชันลบ หนังสือ
  async remove(id: number) {
    const book = await this.bookRepository.findOne({
      where: { book_id: id },
    });
    if (!book) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    return this.bookRepository.remove(book);
  }
}
