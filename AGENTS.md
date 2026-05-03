# Reglas de Agente: Codex - POS Next.js 16

## Precedencia y uso
- Este archivo define el flujo operativo inmediato para trabajar en el repositorio.
- `docs/REGLAS_PROYECTO.md` define la arquitectura, los estándares técnicos y las reglas extendidas.
- Si hay solapamiento, este archivo manda sobre el orden de ejecución y `docs/REGLAS_PROYECTO.md` manda sobre el estándar técnico.
- Para cualquier implementación o revisión, consulta ambos documentos antes de editar.

## Objetivo permanente
- Mantener un código alineado a Clean Architecture, limpio, reutilizable, escalable y consistente con los patrones vigentes del proyecto.
- Antes de crear una estructura, helper, wrapper, patrón o abstracción nueva, busca primero una referencia activa y reutilizable en el repositorio.

## Honestidad técnica
- No valides propuestas por inercia ni contradigas por reflejo.
- Si detectas riesgos, supuestos débiles, regresiones potenciales, sobreingeniería o una alternativa claramente mejor, dilo con claridad y fundamento.
- La prioridad es mejorar la decisión técnica del usuario, aunque eso implique cuestionar la idea inicial.
- Si la propuesta del usuario es sólida, confírmala sin forzar objeciones artificiales.

## Estilo de respuesta
- Responde de forma precisa, corta y técnica por defecto.
- Amplía la respuesta solo cuando sea necesario para evitar ambigüedad, riesgo o error.
- Evita repeticiones de contexto ya confirmado.
- En cierres, revisiones y estados intermedios, prioriza la síntesis.

## Flujo de trabajo y Cierre de Tareas
- Toda tarea nueva debe seguir este protocolo:
  1. **Verificación de estado**: Ejecutar `git status`. Si hay archivos sin commitear, ramas sucias o commits pendientes, detener la operación.
  2. **Creación de rama**: Crear una nueva rama local a partir de `origin/codex/dev` con el formato `codex/[nombre-descriptivo-tarea]` y realizar un `git push -u origin [nombre-rama]` inmediatamente para sincronizarla con el remoto.
  3. **Desarrollo**: Realizar commits atómicos según sea necesario (sin push).
  4. **Validación Técnica**: 
     - Para cambios de código: ejecutar obligatoriamente `bunx tsc --noEmit` después de cada subtarea o cambio de código finalizado y pruebas funcionales.
     - Para cambios de documentación/configuración: verificar cambios manualmente.
  5. **Cierre de tarea**:
     - Ejecutar commit final (`git commit -a`).
     - Realizar `git push` al remoto (solo al cerrar).
     - Permanecer en la rama activa. No realizar cambios de rama ni borrados automáticos.
- No trabajar directamente sobre `codex/dev`.
- No iniciar una nueva tarea mientras la actual siga en curso.
- No mezclar cambios de tareas distintas en la misma rama salvo autorización explícita.

## Reglas operativas críticas
- Reutiliza primero componentes de `@/components/common/` y, si no existe una opción adecuada, usa `@/components/ui/`.
- No crees archivos sueltos en `src/utils/`, `src/lib/` o `src/hooks/`; usa subcarpetas descriptivas.
- Prioriza Server Components y Server Actions sobre lógica de cliente cuando el caso lo permita.

## Cambios de alto impacto
- Toda modificación en código compartido, reusable o consumido por múltiples módulos debe tratarse como cambio de alto impacto.
- Antes de editar piezas compartidas, revisa primero sus usos activos y evalúa si cambia contrato, comportamiento o expectativas de otros consumidores.
- Si el cambio puede alterar comportamiento observable o contratos reutilizados, requiere confirmación previa del usuario antes de editar.
- Si el cambio es backward-compatible y no altera consumidores existentes, puedes proceder con validación técnica proporcional al impacto.
