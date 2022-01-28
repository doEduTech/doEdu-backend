import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { MulterField, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import { diskStorage } from 'multer';

interface LocalFilesInterceptorOptions {
  uploadFields: MulterField[];
  fileToSaveLocally?: string;
  path?: string;
}

function LocalFilesInterceptor(options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    public fileInterceptor: NestInterceptor;

    constructor() {
      const filesDestination = process.env.UPLOADED_FILES_DESTINATION;

      const destination = `${filesDestination}${options.path}`;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination
        })
      };

      this.fileInterceptor = new (FileFieldsInterceptor(options.uploadFields, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFilesInterceptor;
