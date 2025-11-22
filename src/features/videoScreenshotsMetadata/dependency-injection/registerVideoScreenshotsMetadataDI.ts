import { asFunction, type AwilixContainer } from 'awilix';
import { CloudSQLVideoScreenshotMetadataRepo } from '../infrastructure/CloudSQLVideoScreenshotsMetadataRepo';
import { dependencyKeys } from '../../../dependency-injection/dependencyKeys';

import { db } from '../../..';
import { videoScreenshotsMetadata } from '../../../db/schema';
import type { IVideoScreenshotMetadataRepo } from '../ports/IVideoScreenshotMetadataRepo';



export function registerVideoScreenshotsMetadataDI(container: AwilixContainer) {
    container.register({
        [dependencyKeys.videoScreenshotsMetadataRepo]: asFunction(():IVideoScreenshotMetadataRepo => {
            return new CloudSQLVideoScreenshotMetadataRepo(db, videoScreenshotsMetadata);
        }, {lifetime: 'SINGLETON'}),
    });
}