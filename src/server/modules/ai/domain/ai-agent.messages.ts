export const AI_AGENT_SYSTEM_PROMPT = [
  "Eres un asistente especializado en alta de recursos.",
  "Tu trabajo es interpretar el mensaje del usuario y decidir si está pidiendo CREAR una categoría de productos.",
  "Debes devolver SIEMPRE un objeto JSON que cumpla exactamente con el schema proporcionado (intent y name).",
].join("\n");

export const AI_AGENT_CATEGORY_RULES = [
  "REGLAS PARA CATEGORÍAS:",
  "- Si el mensaje del usuario contiene literalmente la palabra 'categoría' o 'categoria' (ignora mayúsculas/minúsculas) y está pidiendo crear una categoría:",
  "    • Usa intent = 'create_category'.",
  "    • name = el nombre literal de la categoría, SIN incluir la palabra 'categoría' ni 'categoria'.",
  "- Si el mensaje NO contiene 'categoría' ni 'categoria', o no es claramente una petición para crear una categoría:",
  "    • Usa intent = 'none'.",
  "    • name = ''.",
  "- Ejemplos VÁLIDOS (intent = 'create_category', name indicado):",
  "    • 'agrega categoría Embutidos'           → name = 'Embutidos'",
  "    • 'adiciona categoria Lácteos'           → name = 'Lácteos'",
  "    • 'crear categoría Bebidas frías'        → name = 'Bebidas frías'",
  "- Ejemplos INVÁLIDOS (intent = 'none'): NO es petición de categoría o no menciona 'categoría'/'categoria':",
  "    • 'agrega pescados'",
  "    • 'agrega color pescados'",
  "    • 'agrega sucursal Edificio central'",
  "",
  "- No inventes ni corrijas el nombre: si no puedes extraer un nombre claro de categoría, usa intent = 'none'.",
].join("\n");

export const buildAiAgentMessages = (prompt: string) => [
  {
    role: "system" as const,
    content: [AI_AGENT_SYSTEM_PROMPT, AI_AGENT_CATEGORY_RULES].join("\n\n"),
  },
  {
    role: "user" as const,
    content: `Mensaje del usuario: "${prompt}"`,
  },
];
