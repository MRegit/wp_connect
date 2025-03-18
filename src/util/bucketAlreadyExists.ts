
import { logger } from '..';
import config from '../config';

export async function bucketAlreadyExists(bucketName: string) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      resolve(true);
    } catch (error: any) {
      if (error.name === 'NoSuchBucket' || error.name === 'NotFound') {
        resolve(false);
      } else {
        logger.error(error);
        reject(error);
      }
    }
  });
}
