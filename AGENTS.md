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

## Flujo de trabajo
- Toda tarea nueva debe iniciarse en una rama nueva creada desde `codex/dev`.
- No se debe trabajar directamente sobre `codex/dev`.
- No inicies una nueva tarea mientras la actual siga en curso.
- No mezcles cambios de tareas distintas en la misma rama salvo autorización explícita.

## Git y ramas
- Usa mensajes de commit con el formato `<type>(<scope>): <mensaje>`.
- El mensaje debe escribirse en español, en modo imperativo, sin mayúscula inicial y sin punto final.
- Tipos permitidos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
- Los pull requests deben incluir un resumen breve en español, los cambios principales y, si aplica, *Breaking Changes*.

## Criterios de cierre y validación mínima
- No se considera una tarea cerrada si no fue validada técnicamente.
- Antes de cerrar, verificar que los cambios compilan (`bun run build`) y no rompen el flujo esperado (tests).
- Ejecutar commit final (`git commit -a`) y `git push`.
- Tras el push, el agente debe permanecer en la rama activa. No realizar cambios de rama ni borrados automáticos.
- Verificar la rama actual antes de considerar la tarea terminada.
- Revisa `git status` antes de dar por concluida la tarea.

## Reglas operativas críticas
- Reutiliza primero componentes de `@/components/common/` y, si no existe una opción adecuada, usa `@/components/ui/`.
- No crees archivos sueltos en `src/utils/`, `src/lib/` o `src/hooks/`; usa subcarpetas descriptivas.
- Prioriza Server Components y Server Actions sobre lógica de cliente cuando el caso lo permita.

## Cambios de alto impacto
- Toda modificación en código compartido, reusable o consumido por múltiples módulos debe tratarse como cambio de alto impacto.
- Antes de editar piezas compartidas, revisa primero sus usos activos y evalúa si cambia contrato, comportamiento o expectativas de otros consumidores.
- Si el cambio puede alterar comportamiento observable o contratos reutilizados, requiere confirmación previa del usuario antes de editar.
- Si el cambio es backward-compatible y no altera consumidores existentes, puedes proceder con validación técnica proporcional al impacto.
