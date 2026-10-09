# Cinéfilo · Parcial 1

Interfaz Next.js para el backend BackArte7. Incluye CRUD de actores, creación de película con actor principal y premio, catálogo y detalle.

## Ejecutar

1. Inicia el backend del archivo entregado: desde `BackArte7`, ejecuta `docker-compose up` y espera a que responda `http://localhost:3000/api/v1/actors`.
2. En esta carpeta ejecuta `npm install` y `npm run dev`.
3. Abre `http://localhost:3001`.

La API se configura mediante `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:3000/api/v1`). El backend ya habilita CORS.

## Nota sobre el modelo del backend

BackArte7 exige que cada película tenga género, director y tráiler de YouTube. El formulario de creación también crea esas entidades de soporte; luego crea la película y, por separado, el actor y el premio, y realiza las dos asociaciones solicitadas. Los endpoints de listado/detalle de película no devuelven premios, así que la interfaz los obtiene mediante `/movies/:id/prizes`.

El routing de páginas usa el enrutador de Next.js (el parcial menciona React Router, pero a la vez solicita Next.js).
