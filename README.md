# JMR.PH

Sitio web y sistema de entrega fotográfica de JMRuiz Fotografía.

## Incluye

- Portada pública, servicios y consulta directa por WhatsApp.
- Acceso privado para el fotógrafo.
- Administración de eventos y estados de publicación.
- Carga múltiple de fotografías originales a Vercel Blob privado.
- Galerías de clientes protegidas con código y PIN.
- Descarga controlada de fotografías y QR por evento.

## Desarrollo local

1. Copiar `.env.example` como `.env.local` y completar las variables.
2. Instalar dependencias con `npm install`.
3. Ejecutar `npm run dev`.
4. Abrir `/panel/configurar` para crear el primer administrador.

Las tablas se crean automáticamente con el prefijo `jmr_`. Nunca se deben subir credenciales ni archivos `.env` al repositorio.
