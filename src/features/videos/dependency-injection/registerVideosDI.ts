
import { asFunction, type AwilixContainer } from 'awilix';
import type { IVideoRepo } from '../ports/IVideoRepo';
import { GoogleCloudStorageVideoRepo } from '../infrastructure/GoogleCloudStorageVideoRepo';
import { dependencyKeys } from '../../../dependency-injection/dependencyKeys';
import { Storage } from '@google-cloud/storage';


export function registerVideosDI(container: AwilixContainer) {
    container.register({
        [dependencyKeys.videoRepo]: asFunction(():IVideoRepo => {
            const storage = new Storage({
                projectId: "moment-finder-gcp-project",
                keyFilename: import.meta.env.GOOGLE_APPLICATION_CREDENTIALS,
            });
            return new GoogleCloudStorageVideoRepo(storage, import.meta.env.GCS_BUCKET_NAME);
        }, {lifetime: 'SINGLETON'}),
    });
}