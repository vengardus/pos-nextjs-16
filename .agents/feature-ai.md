# TAREA: Agregar funcionalidad de IA con el AI SDK de Vercel

> Importante: respeta siempre las reglas definidas en `AGENTS.md` (nombres, estructura de carpetas, reutilización de código, etc.).

## Detalle de las tareas a realizar (se irán haciendo **paso a paso**)

### PASO 1

1. **Agregar opción "IA" en el navbar**
   - Añade una nueva opción en el navbar llamada **"IA"**.
   - Debe respetar el comportamiento actual del navbar, incluyendo el modo responsive.
   - Dentro de "IA" habrá **2 subopciones**:
     - **Chat**
     - **Agente** (solo crear la entrada en el menú por ahora, sin funcionalidad extra).
   - Usa el mismo patrón de componentes, estilos y responsive que ya utiliza el navbar actual.

2. **Pantalla de Chat**
   - La opción **Chat** debe llevar a una nueva feature/ruta, por ejemplo:  
     `app/(feature)/ai/chat/page.tsx`, siguiendo la convención actual del proyecto para features/rutas (ajustar al patrón existente).
   - Esta pantalla debe permitir:
     - Ingresar un texto (mensaje del usuario).
     - Enviar la consulta a un LLM usando el **AI SDK de Vercel**.
     - Mostrar la respuesta del modelo en la parte superior de la pantalla.
   - Layout sugerido:
     - **Parte superior:** área donde se muestra la respuesta del modelo (un panel o contenedor de texto).
     - **Parte inferior:** 
       - campo de entrada para el mensaje,
       - botón de **Enviar**,
       - botón de **Cancelar** (por ejemplo, para limpiar el input o resetear el estado).
   - Usa Tailwind y/o componentes de shadcn/ui según el estilo ya existente en el proyecto.

3. **Modelo de IA (Groq)**
   - Configura el AI SDK de Vercel para usar **Groq** como proveedor.
   - Utiliza el modelo:  
     `groq("llama-3.1-8b-instant")`.
   - La configuración debe integrarse siguiendo el patrón actual de configuración de servicios externos en el proyecto.

4. **Lógica en `lib/groq`**
   - Crea (o amplía, si ya existe) un módulo en:  
     `lib/groq/`
   - Dentro de este módulo, implementa una función responsable de llamar al modelo de Groq usando el AI SDK de Vercel.
   - Esta función debe:
     - Encapsular la llamada al LLM.
     - Usar la interfaz **`ResponseAction`** ya definida en el proyecto.
     - Devolver una promesa de tipo:  
       `Promise<ResponseAction>`.
   - Implementa la función usando código moderno y óptimo:
     - `async/await`,
     - funciones flecha cuando tenga sentido,
     - optional chaining, destructuring, etc., siempre respetando el estilo actual del proyecto.

5. **Server Action (siguiendo ejemplo existente)**
   - Implementa una **server action** que:
     - Llame internamente a la función de `lib/groq`.
     - Devuelva también una `Promise<ResponseAction>`.
   - Esta server action debe:
     - Seguir **como plantilla** un server action ya existente en el proyecto:
       - misma estructura de imports,
       - misma forma de tipar parámetros y retorno,
       - mismo manejo de errores,
       - mismo patrón de export (por ejemplo `export async function actionName(...) { ... }` o el que se use).
   - Ubica la server action siguiendo la convención ya usada (por ejemplo, en el propio archivo de la página o en un módulo de acciones dedicado).

6. **Conexión desde el componente de Chat**
   - El componente de la pantalla de Chat debe:
     - Tomar el texto ingresado por el usuario desde el input.
     - Llamar a la **server action** para ejecutar la consulta al modelo.
     - Mostrar la respuesta (tipo `ResponseAction`) en el área de respuesta.
   - Reutiliza patrones de manejo de estado ya existentes (por ejemplo Zustand, si aplica en esta pantalla, o estado local de React si es el patrón habitual para formularios simples).

7. **Endpoint de API (POST en `app/api/...`)**
   - Adicionalmente, crea un endpoint de API con método **POST** en:  
     `app/api/ai/chat/route.ts` (o ruta equivalente, respetando el patrón actual de las APIs del proyecto).
   - Este endpoint debe:
     - Recibir el texto de entrada desde el body de la request.
     - Llamar a la función de `lib/groq` (no directamente a la server action).
     - Devolver la respuesta en el mismo formato `ResponseAction`.
   - El endpoint debe seguir el estilo actual del proyecto:
     - manejo de errores,
     - tipos de respuesta (por ejemplo `NextResponse`),
     - autenticación/autorización si aplica.

