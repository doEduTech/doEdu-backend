import { Injectable } from '@nestjs/common';

import { create } from 'ipfs-http-client';
// const ipfsClient = require('ipfs-http-client');

@Injectable()
export class IPFSClientService {
  // private client = ipfsClient('http://localhost:5001');
  private client = create({
    protocol: 'http',
    // host: 'ipfs',
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

  public get(cid: string): AsyncIterable<Uint8Array> {
    const content = this.client.cat(cid);
    console.log('config', content);
    return this.client.get(cid);
  }
}
