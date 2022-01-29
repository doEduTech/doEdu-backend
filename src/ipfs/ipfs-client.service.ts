import { Injectable } from '@nestjs/common';

import { create } from 'ipfs-http-client';

@Injectable()
export class IPFSClientService {
  private client = create({
    protocol: 'http',
    port: 5001
  });

  public async upload(file: Express.Multer.File): Promise<string> {
    const fileToAdd = { path: file.filename, content: file.buffer };
    try {
      const addedFile = await this.client.add(fileToAdd);
      return addedFile.path;
    } catch (err) {
      console.log('err', err);
    }
  }
}
