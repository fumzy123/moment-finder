// Dependency Injection Container Utilities
import { createContainer } from 'awilix';



// Create the container and set the injectionMode to PROXY (which is also the default).
// Enable strict mode for extra correctness checks (highly recommended).
export const container = createContainer({
    injectionMode: 'PROXY',
    strict: true
});