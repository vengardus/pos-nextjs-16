En esta ejecución, establece <CARPETA> = "warehouses".

Debo hacer una refactorización de la lógica de manejo de cache en las queries.
Actualmente el flujo es: tener la query (erróneamente en un server action) que es llamada por una función que envuelve la llamada en la función `cache` de React.

Quiero que hagas esta refactorización para la carpeta `src/actions/<CARPETA>`:

En esta carpeta existe:
- Un archivo `cache/<nombre>.cache.ts`
- Uno o varios archivos en `querys/*.action.ts` que siguen el formato `<recurso>.<descripcion>.action.ts`.

Lo que debe corregirse es:

1. Mover el archivo de cache a `src/lib/data/<CARPETA>`

   - Mover `src/actions/<CARPETA>/cache/<nombre>.cache.ts` a  
     `src/lib/data/<CARPETA>/<nombre>.cache.ts`
   - Dentro de ese archivo, al inicio agregar:
     ```ts
     "use cache"
     import 'server-only'
     ```
   - En ese archivo hay funciones con sufijo `OLD` y otras sin sufijo.  
     Debes:
     - Comentar las funciones **sin** el sufijo `OLD`.
     - Renombrar las funciones con sufijo `OLD` para que se llame igual que la original, pero **sin** el sufijo `OLD`.
     - Si las funciones tienen un "use cache", elimina esa linea.

2. Mover las queries a `src/lib/data/<CARPETA>`

   - Mover todos los archivos de `src/actions/<CARPETA>/querys/*` a  
     `src/lib/data/<CARPETA>/`
   - En cada archivo movido:
     - Eliminar la línea:
       ```ts
       "use server"
       ```
     - Agregar al inicio del archivo:
       ```ts
       import 'server-only'
       ```
     - Renombrar cada archivo quitándole el sufijo `.action` en el nombre.  
       Ejemplo:  
       `algo.get-all-by-company.action.ts` → `algo.get-all-by-company.ts`

3. Mover las mutations a la raíz de la carpeta de acciones

   - Mover todos los archivos de `src/actions/<CARPETA>/mutations/*` a:  
     `src/actions/<CARPETA>/`

4. Eliminar carpetas antiguas

   - Eliminar las carpetas:
     - `src/actions/<CARPETA>/cache`
     - `src/actions/<CARPETA>/querys`
     - `src/actions/<CARPETA>/mutations`

5. Corregir imports

   - En el archivo `*.cache.ts` correspondiente, actualizar la ruta del import de la query para que apunte ahora a `src/lib/data/<CARPETA>/...`
   - Corregir también todos los imports en los archivos donde se llama al archivo `*.cache.ts`, para que apunten a la nueva ubicación si es necesario.
   - Corregir también todos los imports en los archivos donde se llama a los archivos movidos de actions/<CARPETA>/mutations/ , para que apunten a la nueva ubicación si es necesario.

Toma como referencia cómo quedaron organizados y escritos los archivos en `src/lib/products` y aplícalo de forma consistente.

Los commits deben seguir la convención habitual (`feat:`, `refactor:`, `chore:`, etc.), pero la descripción del commit debe estar en español con la excepcion del nombre de la carpeta que si debes mantenerla tal cual se indicó en <CARPETA>.
