import { Injectable } from '@nestjs/common';

import { create } from 'ipfs-http-client';

@Injectable()
export class IPFSClientService {
  private client = create({
    url: '/ip4/127.0.0.1/tcp/5001'
  });

  public async upload(file: Express.Multer.File): Promise<string> {
    const fileToAdd = { path: file.filename, content: file.buffer };
    try {
      const addedFile = await this.client.add(fileToAdd, { pin: true });
      return addedFile.path;
    } catch (err) {
      console.log('err', err);
    }
  }

  public async unpinFile(cid: string): Promise<void> {
    await this.client.pin.rm(cid);
  }
}
