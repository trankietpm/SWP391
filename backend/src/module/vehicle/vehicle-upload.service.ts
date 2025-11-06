import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VehicleUploadService {
  private readonly uploadPath = path.join(process.cwd(), 'public/images/vehicles');

  getUploadPath(): string {
    return this.uploadPath;
  }

  ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  getFolderName(licensePlate: string): string {
    return licensePlate
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  getFolderPath(folderName: string): string {
    return path.join(this.uploadPath, folderName);
  }

  getImagePath(folderName: string, filename: string): string {
    return `images/vehicles/${folderName}/${filename}`;
  }

  decodeBase64Image(base64String: string): { buffer: Buffer; ext: string } {
    const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      throw new BadRequestException('Invalid base64 image format');
    }

    const ext = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    return { buffer, ext };
  }

  saveBase64Images(licensePlate: string, base64Images: string[]): string[] {
    if (!base64Images || base64Images.length === 0) {
      return [];
    }

    const folderName = this.getFolderName(licensePlate);
    const folderPath = this.getFolderPath(folderName);
    this.ensureDirectoryExists(folderPath);

    const imagePaths: string[] = [];

    base64Images.forEach((base64, index) => {
      try {
        const { buffer, ext } = this.decodeBase64Image(base64);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + index;
        const filename = `image-${uniqueSuffix}.${ext}`;
        const filePath = path.join(folderPath, filename);

        fs.writeFileSync(filePath, buffer);
        
        const imagePath = this.getImagePath(folderName, filename);
        imagePaths.push(imagePath);
      } catch (error) {
        throw new BadRequestException(`Error processing image ${index + 1}: ${error.message}`);
      }
    });

    return imagePaths;
  }

  deleteImage(imagePath: string): void {
    try {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      // Silently fail to prevent breaking the update flow
    }
  }

  deleteImages(imagePaths: string[]): void {
    if (!imagePaths || imagePaths.length === 0) {
      return;
    }
    
    imagePaths.forEach(imagePath => {
      this.deleteImage(imagePath);
    });
  }
}

