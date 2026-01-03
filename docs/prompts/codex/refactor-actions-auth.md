
Quiero que hagas esta refactorización para la carpeta `src/actions/auth`:

Lo que debe corregirse es:

1. Mover los archivo src/actions/auth a  `src/lib/data/auth`

   - Mover todos los archivos de `src/actions/auth/*` a  
     `src/lib/data/auth/`
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

2. Eliminar carpetas antiguas

   - Eliminar las carpetas:
     - `src/actions/auth`

3. Corregir imports

   - Corregir también todos los imports en los archivos donde se llama a los archivos movidos de actions/auth/ , para que apunten a la nueva ubicación si es necesario.

Los commits deben seguir la convención habitual (`feat:`, `refactor:`, `chore:`, etc.), pero la descripción del commit debe estar en español con la excepcion del nombre auth.
