# Biblioteca Solorzano

Aplicación del laboratorio 12 de Desarrollo de Aplicaciones Web Avanzado. Gestiona autores y libros con Next.js App Router, TypeScript, Prisma y PostgreSQL en Supabase.

## Funciones

- Autores: listar, crear, consultar por ID, editar y eliminar.
- Libros: listar, crear, consultar por ID, editar, eliminar y filtrar por género o autor.
- Búsqueda parcial sin distinguir mayúsculas por título y nombre del autor.
- Paginación, límite máximo de 50 resultados y ordenamiento por título, año o fecha de creación.
- Estadísticas del autor: cantidad de libros, primera y última publicación, promedio de páginas, géneros, libro más extenso y más breve.
- Dashboard, catálogo responsive y detalle del autor con formularios y estados de carga.

## Ejecutar localmente

Requiere Node.js 22 y acceso a una base PostgreSQL en Supabase.

1. Clonar el repositorio e instalar con `npm install`.
2. Copiar `.env.example` a `.env` y reemplazar `DATABASE_URL` con la URI del **Session pooler** de Supabase y la contraseña de la base de datos. Codificar los caracteres especiales de la contraseña para la URI.
3. Ejecutar `npx prisma db push` y `npx prisma generate`.
4. Ejecutar `npm run dev` y abrir http://localhost:3000.

`.env` es local y está excluido de Git. No publicar contraseñas ni cadenas de conexión reales.

## Rutas de la aplicación

- `/`: dashboard, estadísticas generales y gestión de autores.
- `/books`: búsqueda, filtros, paginación y gestión de libros.
- `/authors/[id]`: información, estadísticas y libros del autor.

## API

| Ruta | Métodos |
| --- | --- |
| `/api/authors` | GET, POST |
| `/api/authors/[id]` | GET, PUT, DELETE |
| `/api/authors/[id]/books` | GET |
| `/api/authors/[id]/stats` | GET |
| `/api/books` | GET, POST |
| `/api/books/[id]` | GET, PUT, DELETE |
| `/api/books/search` | GET |

La búsqueda acepta `search`, `genre`, `authorName`, `page`, `limit`, `sortBy` y `order`. Adicionalmente, `authorId` permite el filtro exacto del selector de autor.

Ejemplo: `/api/books/search?search=cien&genre=Novela&page=1&limit=10&sortBy=publishedYear&order=desc`.

Cuando el autor no tiene libros, las estadísticas devuelven total y promedio en cero, géneros vacíos y extremos en null. Los promedios de páginas omiten valores no registrados.

## Verificación

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

El código base mantiene la lógica de la guía. Los parámetros dinámicos se resuelven con `await params` para Next.js y los errores usan tipos compatibles con TypeScript y ESLint.

## Desplegar en Vercel

1. Importar este repositorio como proyecto Next.js.
2. Configurar `DATABASE_URL` en las variables del proyecto para producción y preview con la URI de Supabase y SSL.
3. Mantener `npm run build` como comando de compilación y desplegar. El cliente Prisma se genera automáticamente.
4. Comprobar la página principal y los endpoints en la URL de producción.

Las tablas deben existir previamente en Supabase. El despliegue no ejecuta `db push` ni elimina datos. En Windows, detener el servidor antes de regenerar Prisma si aparece EPERM por un archivo del motor en uso.

## Datos y relaciones

`Author` tiene un correo único y varios `Book`. El ISBN del libro es único cuando se proporciona. La eliminación de un autor elimina sus libros por Cascade; la interfaz pide confirmación antes de eliminar.

Este proyecto corresponde a una práctica académica. La API de la guía permite modificar datos sin autenticación y no debe utilizarse para información privada ni sensible.
