import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { Users } from '../users/entities/users.entity';
import { Movie } from '../movie/entities/movie.entity';
import { createRepositoryMock } from '../test/mocks';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useValue: createRepositoryMock(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: createRepositoryMock(),
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: createRepositoryMock(),
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
