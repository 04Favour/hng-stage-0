import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NameDto } from './classify.dto';

@Injectable()
export class AppService {
  async classify(query: NameDto) {
    const { name } = query;
    if (!name || name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    if (typeof name !== 'string') {
      throw new UnprocessableEntityException('Name must be a string');
    }

    const url = `https://api.genderize.io/?name=${encodeURIComponent(name.trim())}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new BadGatewayException('The external service is currently unreachable');
      }

      const data = await response.json();
      const { gender, probability, count } = data;

      if (gender === null || count === 0) {
        throw new BadRequestException('No prediction available for the provided name');
      }

      const sample_size: number = count;
      const is_confident: boolean = probability >= 0.7 && sample_size >= 100;

      return {
        status: 'success',
        data: {
          name: data.name,
          gender,
          probability,
          sample_size,
          is_confident,
          processed_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Genderize API error:', error);
      throw new BadGatewayException('Unable to process your request');
    }
  }
}