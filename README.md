# Sargam

### Local development

- Install dependencies: `npm install`
- Start dev server with hot reload: `npm run dev`
- Build TypeScript: `npm run build`
- Run unit tests: `npm run test`

### Sample request

```bash
curl "http://localhost:3000/api/search?q=raga&type=song&limit=5"
```

### Notes

- Services currently use an in-memory repository; swap in real DB/API logic inside `src/plugins/services.ts`.
- Validation errors follow the Zod/fastify-type-provider-zod issue format consumed by the global error handler.
