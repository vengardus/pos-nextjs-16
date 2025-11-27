# Instrucciones para Codex

## Convenciones de Git: commits y PRs

### Mensajes de commit
- Usa **Conventional Commits** para todos los commits.
- El `subject` del commit (línea de título) debe estar **siempre en español**.
- Formato: `<type>(<scope>): <mensaje>`
  - `<type>` ∈ {feat, fix, chore, docs, refactor, test}
  - `<scope>` es opcional.
- No uses mayúscula inicial en el mensaje salvo nombres propios.
- No agregues punto final al `subject`.

#### Ejemplos

- feat(api): agregar endpoint para crear usuarios
- fix(ui): corregir desbordamiento en tabla de reportes
- chore(ci): actualizar flujo de despliegue en staging

### Pull Requests
- Incluye resumen breve en español.
- Enumera cambios principales en viñetas.
- Menciona breaking changes si las hay.