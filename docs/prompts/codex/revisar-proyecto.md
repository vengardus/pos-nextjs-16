## Prompt para analizar el repositorio con Codex

Actúa como un desarrollador senior *full-stack* y arquitecto de software especializado en **Next.js**, **React** y **TypeScript**.  
Ya tienes acceso completo al código de mi repositorio actual en este workspace. El proyecto se llama `pos-nextjs-16` y es un sistema de punto de venta.  

Quiero que **analices el repositorio completo** (ignorando `node_modules`, `.next`, `dist`, etc.) y me entregues un informe en español con los siguientes puntos, en formato **Markdown**:

1. **Resumen funcional del sistema**  
   - Explica en pocas frases qué hace la aplicación y qué problema resuelve.  
   - Menciona los tipos de usuarios y los flujos principales que identifiques (ventas, inventario, almacenes, usuarios, etc.).

2. **Arquitectura y organización del proyecto**  
   - Describe cómo está organizado el código (carpetas y módulos importantes: `app/` o `pages/`, `src/`, `lib/`, `modules/`, etc.).  
   - Explica qué arquitectura o patrones parece estar usando (por ejemplo: arquitectura en capas: UI / aplicación / dominio / infraestructura, o arquitectura basada en features/módulos).  
   - Indica cómo se divide frontend y backend en Next.js (app router, server components, server actions, API routes, etc.).  
   - Señala dónde vive la lógica de negocio y dónde el acceso a datos (ORM, servicios, repositorios, etc.).

3. **Piezas clave del sistema**  
   - Lista los componentes de UI principales y qué rol cumplen.  
   - Hooks, contextos y providers importantes, con una breve descripción de para qué sirven.  
   - Server actions, endpoints o rutas API más relevantes y qué hace cada una a grandes rasgos.  
   - Modelos/entidades de dominio clave (productos, ventas, usuarios, almacenes, etc.) y sus relaciones más importantes.

4. **Flujo de datos en un caso de uso típico**  
   - Elige un caso de uso representativo (por ejemplo, registrar una venta o mover stock entre almacenes).  
   - Explica paso a paso cómo fluye la información: desde la acción del usuario en la UI, pasando por componentes/hooks, hasta server actions/API y la base de datos.  
   - Usa un diagrama de texto sencillo (por ejemplo con flechas) para ilustrarlo.

5. **Dependencias externas**  
   - Revisa `package.json` y enumera las librerías principales (Next, ORM, UI kit, auth, validación, etc.).  
   - Explica para qué se usa cada una a nivel general.

6. **Fortalezas y debilidades de la arquitectura**  
   - Qué aspectos ves bien diseñados (separación de responsabilidades, tipado, reutilización, etc.).  
   - Qué partes podrían volverse difíciles de mantener (acoplamientos, duplicación, nombres confusos, archivos muy grandes, etc.).  
   - No inventes nada: si algo no se ve claramente en el código, indícalo como suposición o como “no se aprecia”.

7. **Mejoras y siguientes pasos recomendados**  
   - Propuestas concretas de refactor (por ejemplo: extraer hooks, dividir componentes, mover lógica de negocio fuera de la UI, mejorar la capa de datos, etc.).  
   - Posibles mejoras en la estructura de carpetas y nombres de archivos/módulos.  
   - Sugerencias de dónde empezar a añadir tests (unitarios, integración o e2e) y qué partes serían prioritarias.

8. **Documento de arquitectura breve para el README**  
   - Genera una sección lista para copiar/pegar en `README.md` con:  
     - Descripción corta del sistema.  
     - Diagrama textual de módulos/capas.  
     - Lista de casos de uso principales.  
     - Nota rápida de cómo se podría desplegar (dev y prod) según lo que veas en el código o en las configs.

Si necesitas hacer suposiciones porque algo no está claro en el código, dilo explícitamente.  
No te limites a enumerar archivos: dame un análisis sintético y entendible como si se lo explicaras a un desarrollador nuevo que se incorpora al proyecto.
