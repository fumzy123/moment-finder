# Type Pattern Quick Reference

A quick reference guide for maintaining type independence across layers.

## Naming Conventions

| Layer | Pattern | Example |
|-------|---------|---------|
| **Domain/Entity** | `{EntityName}` | `Video`, `VideoScreenshot` |
| **Application** | `{UseCase}Result`, `{UseCase}Args` | `GetUploadedVideosResult`, `GetVideoArgs` |
| **API** | `{Resource}DTO`, `{Action}{Resource}Response` | `UploadedVideoDTO`, `GetUploadedVideosResponse` |
| **Data Fetching** | Uses View Models from Presentation | `VideoScreenshotVM[]` |
| **Presentation** | `{Feature}VM`, `{Component}Props` | `VideoScreenshotVM`, `VideoAnnotationCanvasProps` |

## File Locations

```
src/
├── features/
│   └── {feature}/
│       ├── entities/          # Domain entities
│       ├── application/       # Use case results (not exported)
│       └── ports/            # Port interfaces
│
├── pages/
│   └── api/
│       └── {resource}/
│           ├── dtos/         # DTOs and Response types
│           └── mappers.ts     # Application → DTO mappers
│
├── hooks/
│   └── {resource}/
│       └── {hook}.ts         # DTO → VM mappers inline
│
└── presentation/
    └── types/
        └── {feature}.ts      # View Models and component props
```

## Import Rules

### ✅ Allowed Imports

- **Application Layer** → Domain entities
- **API Layer** → Application layer (for mapping)
- **Data Fetching Layer** → API DTOs (for fetching) + Presentation VMs (for return)
- **Presentation Layer** → Only Presentation types

### ❌ Forbidden Imports

- **Presentation Layer** → API DTOs ❌
- **Presentation Layer** → Application types ❌
- **Presentation Layer** → Domain entities ❌
- **Data Fetching Layer** → Application types ❌

## Mapper Function Pattern

### API Layer Mappers
```typescript
// src/pages/api/videos/mappers.ts
export function mapGetUploadedVideosResultToDTO(
  result: GetUploadedVideosResult
): UploadedVideoDTO {
  return {
    id: result.id,
    name: result.name,
    // ... map all fields
  };
}
```

### Data Fetching Layer Mappers
```typescript
// src/hooks/video/useVideoScreenshots.ts
function mapVideoScreenshotDTOToVM(dto: VideoScreenshotDTO): VideoScreenshotVM {
  return {
    id: dto.id,
    url: dto.url,
    // ... map all fields
  };
}
```

## Checklist for New Features

When adding a new feature:

- [ ] Define domain entity (if needed)
- [ ] Create application layer use case with `{UseCase}Result` type
- [ ] Create API DTO and Response types
- [ ] Create mapper: Application Result → DTO
- [ ] Create View Model in Presentation layer
- [ ] Create hook with mapper: DTO → View Model
- [ ] Use View Model in Presentation components
- [ ] Verify no cross-layer imports

## Common Patterns

### Adding a New API Endpoint

1. **Application Layer**: Create use case with `{UseCase}Result`
2. **API Layer**: 
   - Create `{Resource}DTO` in `dtos/`
   - Create `{Action}{Resource}Response` in `dtos/`
   - Add mapper in `mappers.ts`
   - Use mapper in API route
3. **Data Fetching Layer**: 
   - Create hook
   - Add DTO → VM mapper
   - Return View Model
4. **Presentation Layer**: 
   - Create View Model schema
   - Use in components

### Modifying an Existing Type

1. **Domain Entity**: Change entity → Update all dependent layers
2. **Application Result**: Change result → Update API mapper
3. **API DTO**: Change DTO → Update Data Fetching mapper
4. **View Model**: Change VM → Update Presentation components only

## Examples

See:
- `docs/TYPE_ARCHITECTURE.md` - Full architecture documentation
- `docs/TYPE_INDEPENDENCE_IMPLEMENTATION.md` - Implementation details

