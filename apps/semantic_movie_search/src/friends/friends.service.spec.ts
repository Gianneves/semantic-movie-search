import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FriendsService } from './friends.service';
import { Friends } from './entities/friends.entity';
import { Users } from '../users/entities/users.entity';
import { NOTIFICATION_CLIENT } from '../constants';
import { createRepositoryMock } from '../test/mocks';

describe('FriendsService', () => {
  let service: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        {
          provide: NOTIFICATION_CLIENT,
          useValue: {
            emit: () => ({
              subscribe: () => undefined,
            }),
          },
        },
        {
          provide: getRepositoryToken(Friends),
          useValue: createRepositoryMock(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: createRepositoryMock(),
        },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
