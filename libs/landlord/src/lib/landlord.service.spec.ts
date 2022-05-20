import { Test, TestingModule } from '@nestjs/testing';
import { LandlordService } from './landlord.service';

describe('LandlordService', () => {
  let service: LandlordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandlordService],
    }).compile();

    service = module.get<LandlordService>(LandlordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
