import { Test, TestingModule } from '@nestjs/testing';
import { MattressService } from './mattress.service';

describe('MattressService', () => {
  let service: MattressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MattressService],
    }).compile();

    service = module.get<MattressService>(MattressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
