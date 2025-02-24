import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './student.controller';
import { StudentsService } from './student.service';

describe('StudentController', () => {
  let controller: StudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [StudentsService],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
