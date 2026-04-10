import { BadGatewayException, BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { NameDto } from './classify.dto';

@Injectable()
export class AppService {
  async getHello(name: NameDto) {
    if(!name.name) throw new BadRequestException('Please provide name');
    const url = `https://api.genderize.io/?name=${name.name}`
    try {
      const response = await fetch(url)
      if(!response.ok) throw new BadGatewayException('The external service is currently unreachable');
      const data = await response.json();
      const {count, name, gender, probability} = data
      if(gender === null || count === 0) throw new BadRequestException('No prediction available for the provided name');
      const sample_size = count;
      let is_confident: boolean;
      is_confident = false;
      const condition = probability >= 0.7 && sample_size >=100
      if (condition === true) is_confident = true;
      return {
          status: "success",
          data: {
            name,
            gender,
            probability,
            sample_size,
            is_confident,
            processed_at: new Date().toISOString()
          }
        }
    } catch(error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Error processing API:", error);
      throw new BadGatewayException(`Unable to continue with your request`)
    }
  }
}
