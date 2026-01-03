haz cambios en todos los archivos *.cache.ts que se encuentran en la ruta lib/data/<carpeta>/
Los cambios a realizar por archuvio son:
1. comenta la linea "use cache"
2. comenta los imports a "next/cache"
3. agregar la linea: import {unstable_cache as cache } from "next/cache";
4. hay funciones con sufijo `OLD` y otras sin sufijo.  
     Debes:
     - Comentar las funciones **sin** el sufijo `OLD`.
     - Renombrar las funciones con sufijo `OLD` para que se llame igual que la original, pero **sin** el sufijo `OLD`.
     - Si las funciones tienen un "use cache", elimina esa linea.