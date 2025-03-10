import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from './entities/library.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
  ) { }

  // ฟังก์ชันสร้าง งบประมาณ
  async create(createLibraryDto: CreateLibraryDto): Promise<Library> {
    const { budget_amount, ...libraryData } = createLibraryDto;
    try {
      const createdAt = new Date();
      const currentYear = createdAt.getFullYear() + 543;
      const currentMonth = createdAt.getMonth() + 1;

      const budget_year = currentMonth >= 10 ? currentYear + 1 : currentYear;

      const existingLibrary = await this.libraryRepository.findOne({
        where: { budget_year },
      });

      if (existingLibrary) {
        throw new BadRequestException(
          `Library for year ${budget_year} already exists`,
        );
      }

      const library = this.libraryRepository.create({
        ...libraryData,
        budget_amount,
        budget_year,
      });
      const savedLibrary = await this.libraryRepository.save(library);
      return savedLibrary;
    } catch (error) {
      throw new BadRequestException(
        `Library creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา งบประมาณ ทั้งหมด
  async findAll(): Promise<Library[]> {
    return await this.libraryRepository.createQueryBuilder('library').getMany();
  }

  // ฟังก์ชันค้นหา งบประมาณ ตาม id
  async findOne(libraryId: number): Promise<Library> {
    return await this.libraryRepository
      .createQueryBuilder('library')
      .where('library.library_id = :libraryId', { libraryId })
      .getOne();
  }

  // ฟังก์ชันค้นหา งบประมาณ ตามปี
  async findByYear(budgetYear: number): Promise<Library> {
    return await this.libraryRepository
      .createQueryBuilder('library')
      .where('library.budget_year = :budgetYear', { budgetYear })
      .getOne();
  }

  // ฟังก์ชันแก้ไข งบประมาณ
  async update(
    libraryId: number,
    updateLibraryDto: UpdateLibraryDto,
  ): Promise<Library> {
    try {
      const library = await this.libraryRepository.findOne({
        where: { library_id: libraryId },
      });
      if (!library) {
        throw new NotFoundException(`Library with ID ${libraryId} not found`);
      }
      const updatedLibrary = Object.assign(library, updateLibraryDto);
      return this.libraryRepository.save(updatedLibrary);
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Library: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันลบ งบประมาณ
  async remove(libraryId: number): Promise<Library> {
    try {
      const library = await this.libraryRepository.findOne({
        where: { library_id: libraryId },
      });
      if (!library) {
        throw new NotFoundException(`Library with ID ${libraryId} not found.`);
      }
      const deletedLibrary = Object.assign(library, UpdateLibraryDto);
      return this.libraryRepository.remove(deletedLibrary);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete Library: ${error.message}`,
      );
    }
  }
}
