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

      const departments = this.bookRepository.create({
        ...bookData,
        ISBN,
        book_title,
        book_author,
        book_price,
        book_category,
        book_published,
        store: storeEntity,
        store_name: storeEntity.store_name,
      });

      const savedBook = await this.bookRepository.save(departments);
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
