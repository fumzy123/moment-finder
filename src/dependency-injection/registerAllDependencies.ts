
// Import Dependency Injection Container
import { container } from './container';

// Adapters to Register
import { registerVideosDI } from '../features/videos/dependency-injection/registerVideosDI';



export async function registerAllDependencies() {
    // Register the Video Repository Adapter
    registerVideosDI(container);

    console.log("Dependencies registered in the DI Container.");

    // If there were any async registrations, we would await them here.
    return;
}