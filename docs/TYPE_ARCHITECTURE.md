# Type Architecture Pattern

This document outlines the type independence pattern used across layers in this codebase.

## Core Principle

**Each layer defines its own types and should NOT import types from other layers.** This ensures:
- Layers remain decoupled and can evolve independently
- Changes in one layer don't cascade to others
- Clear boundaries between concerns
- Better testability and maintainability

## Layer Structure

### 1. Domain/Entity Layer (`src/features/*/entities/`)
- **Purpose**: Core business entities that represent domain concepts
- **Naming**: `{EntityName}` (e.g., `Video`, `VideoScreenshot`)
- **Characteristics**: 
  - Pure domain models
  - No UI or API concerns
  - Used by Ports and Infrastructure layers
- **Example**: `Video`, `VideoScreenshot`

### 2. Application Layer (`src/features/*/application/`)
- **Purpose**: Use case-specific types that combine domain entities with use case logic
- **Naming Pattern**: `{UseCase}Result` or `{UseCase}Output` for return types, `{UseCase}Args` for input types
- **Characteristics**:
  - May combine multiple domain entities
  - Adds computed/derived fields (e.g., `url` from `bucketPath`)
  - Types are defined within the use case file
  - NOT exported for use by other layers
- **Example**: 
  - `GetUploadedVideosResult` (return type)
  - `GetVideoResult` (return type)
  - `SaveVideoScreenshotArgs` (input type)

### 3. API Layer (`src/pages/api/*/dtos/`)
- **Purpose**: Data Transfer Objects for HTTP API contracts
- **Naming Pattern**: 
  - `{Resource}DTO` for individual resources
  - `{Action}{Resource}Response` for API responses
- **Characteristics**:
  - Defines the HTTP API contract
  - Maps from Application layer results to API format
  - Uses Zod schemas for validation
  - Only used by API routes and data fetching layer (via mappers)
- **Example**: 
  - `UploadedVideoDTO`
  - `GetUploadedVideosResponse`
  - `VideoScreenshotDTO`

### 4. Data Fetching Layer (`src/hooks/*/`)
- **Purpose**: React Query hooks that fetch data from API endpoints
- **Naming Pattern**: Uses View Models from Presentation layer
- **Characteristics**:
  - Fetches DTOs from API
  - Maps DTOs to View Models using mapper functions
  - Returns View Models to Presentation layer
  - Contains mapper functions: `map{Resource}DTOToVM`
- **Example**: `useVideoScreenshots` returns `VideoScreenshotVM[]`

### 5. Presentation Layer (`src/presentation/types/`)
- **Purpose**: View Models and component prop types for UI
- **Naming Pattern**: `{Feature}VM` for View Models, `{Component}Props` for component props
- **Characteristics**:
  - Optimized for UI rendering
  - Independent of API structure
  - Uses Zod schemas for runtime validation
  - Only used by Presentation layer components
- **Example**: 
  - `VideoScreenshotVM`
  - `VideoAnnotationCanvasProps`

## Type Flow

```
Domain Entity → Application Result → API DTO → View Model → Component Props
     ↓              ↓                  ↓           ↓            ↓
   Video    GetUploadedVideosResult  UploadedVideoDTO  VideoVM  VideoCardProps
```

## Mapping Strategy

### API Layer → Data Fetching Layer
- API routes receive Application layer results
- API routes map to DTOs before serialization
- DTOs are what get sent over HTTP

### Data Fetching Layer → Presentation Layer
- Hooks fetch DTOs from API
- Hooks use mapper functions to convert DTOs to View Models
- Hooks return View Models to components

### Mapper Functions
- Located in `src/hooks/*/mappers.ts` or inline in hooks
- Function naming: `map{Resource}DTOToVM`
- Pure functions, no side effects
- Handle null/undefined gracefully

## Example Implementation

### Application Layer
```typescript
// src/features/videos/application/getUploadedVideos.ts
interface GetUploadedVideosResult {
  id: string;
  name: string;
  url: string;
  // ... other fields
}

export async function getUploadedVideos(): Promise<GetUploadedVideosResult[]> {
  // implementation
}
```

### API Layer
```typescript
// src/pages/api/videos/dtos/UploadedVideoDTO.ts
export const UploadedVideoDTO = z.object({
  id: z.string().uuid(),
  name: z.string(),
  url: z.string(),
  // ...
});
```

### Data Fetching Layer
```typescript
// src/hooks/video/useVideoScreenshots.ts
import type { VideoScreenshotVM } from "../../presentation/types/video";

function mapVideoScreenshotDTOToVM(dto: VideoScreenshotDTO): VideoScreenshotVM {
  return {
    id: dto.id,
    url: dto.url,
    // ... map fields
  };
}

export function useVideoScreenshots(videoId: string) {
  return useQuery<VideoScreenshotVM[]>({
    queryFn: async () => {
      const res = await fetch(`/api/videos/${videoId}/screenshots`);
      const json: GetAllVideoScreenshotsResponse = await res.json();
      return json.data.map(mapVideoScreenshotDTOToVM);
    },
  });
}
```

### Presentation Layer
```typescript
// src/presentation/types/video.ts
export const VideoScreenshotVMSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  // ... UI-optimized fields
});
export type VideoScreenshotVM = z.infer<typeof VideoScreenshotVMSchema>;
```

## Rules

1. ✅ **DO**: Define types within each layer
2. ✅ **DO**: Use mapper functions to convert between layers
3. ✅ **DO**: Keep View Models UI-focused
4. ✅ **DO**: Keep DTOs API-contract focused
5. ❌ **DON'T**: Import types from API layer into Presentation layer
6. ❌ **DON'T**: Import Application layer types into Presentation layer
7. ❌ **DON'T**: Import Domain entities into Presentation layer
8. ❌ **DON'T**: Share types between layers without mapping

## Benefits

- **Independence**: Layers can change without affecting others
- **Clarity**: Clear boundaries and responsibilities
- **Testability**: Each layer can be tested in isolation
- **Flexibility**: Easy to swap implementations (e.g., different API formats)
- **Type Safety**: Full TypeScript support with proper boundaries

