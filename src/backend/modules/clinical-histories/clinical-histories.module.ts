import { Module } from '@nestjs/common';
import { ClinicalHistoriesController } from './clinical-histories.controller';
import { ClinicalHistoriesService } from './clinical-histories.service';

@Module({
  controllers: [ClinicalHistoriesController],
  providers: [ClinicalHistoriesService],
})
export class ClinicalHistoriesModule {}
