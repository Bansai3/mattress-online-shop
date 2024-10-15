import { Test, TestingModule } from '@nestjs/testing';
import { MattressController } from './mattress.controller';

describe('MattressController', () => {
  let controller: MattressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MattressController],
    }).compile();

    controller = module.get<MattressController>(MattressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
