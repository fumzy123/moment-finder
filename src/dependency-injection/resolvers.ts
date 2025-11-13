import { container } from "./container";
import { dependencyKeys } from "./dependencyKeys";




export const resolvers = {
    videoRepoResolver: () => {
        return container.resolve(dependencyKeys.videoRepo);
    }
}