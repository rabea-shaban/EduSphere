# EduSphere Backend - System Architecture & Design Documentation

## 1. Executive Summary

EduSphere is built as a highly scalable, domain-driven **MVC Monolith** utilizing Node.js, Express.js, TypeScript, and MongoDB Atlas. It supports real-time multi-tenant educational workflows, role-based dashboards, Stripe checkout integrations, Socket.io real-time chat, and AI-assisted learning tools.

---

## 2. Architectural Principles

- **MVC Domain Isolation**: All domain modules reside inside `src/modules/<moduleName>` containing interface, model, validation, controller, and routes. Services and repository layers are omitted for a flat, maintainable architecture.
- **Provider Abstraction**: High-risk third-party integrations (OpenAI LLMs, Stripe billing, Cloudinary media storage) use abstract interface contracts so backends can be swapped or mocked seamlessly.
- **Fail-Safe Caching**: Caching utilizes a unified manager with fallback to in-memory maps when Redis is unavailable.
- **Multi-Role Security**: Fine-grained access control enforces authorization across `SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, and `PARENT` roles.

---

## 3. High-Level Subsystem Breakdown

```
                  +-----------------------------------+
                  |   Nginx Reverse Proxy / Port 80   |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |   Node.js / Express App Cluster   |
                  +-----------------+-----------------+
                                    |
         +--------------------------+--------------------------+
         |                          |                          |
         v                          v                          v
+------------------+       +------------------+       +------------------+
| MongoDB Atlas    |       | Redis Cache      |       | Socket.io        |
| Persistent Store |       | In-Memory Cache  |       | Real-Time Engine |
+------------------+       +------------------+       +------------------+
```

---

## 4. Key Middleware Pipeline

1. **Helmet & Security Headers**: Sets HTTP security headers (HSTS, CSP, XSS protection).
2. **CORS & Compression**: Handles cross-origin requests and Gzip response payload compression.
3. **Rate Limiting**: Restricts requests per IP to mitigate Denial of Service (DoS) attacks.
4. **JWT Authentication (`protect`)**: Validates Bearer tokens and attaches the verified User document to `req.user`.
5. **Role Restriction (`restrictTo`)**: Ensures the authenticated user's role satisfies endpoint permissions.
6. **Joi Validation (`validationMiddleware`)**: Sanitizes and validates request bodies, queries, and parameters.
