import { Repository } from 'typeorm';

/**
 * Cria um mock de `Repository` do TypeORM com as principais operações
 * disponíveis, para uso nos testes unitários dos serviços.
 */
export const createRepositoryMock = <T = unknown>(): Repository<T> =>
  ({
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    softRemove: jest.fn(),
    restore: jest.fn(),
    count: jest.fn(),
    countBy: jest.fn(),
    exists: jest.fn(),
    existsBy: jest.fn(),
    clear: jest.fn(),
    preload: jest.fn(),
    merge: jest.fn(),
    query: jest.fn(),
    upsert: jest.fn(),
    insert: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
    getCount: jest.fn(),
  }) as unknown as Repository<T>;
