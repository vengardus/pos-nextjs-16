"use client";

import { useState, useTransition } from "react";

import { aiAgentAction } from "@/actions/ai/ai-agent.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AgentPageClient = () => {
  const [prompt, setPrompt] = useState("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      setResultMessage(null);
      setErrorMessage(null);

      const response = await aiAgentAction(prompt.trim());

      if (response.success) {
        setResultMessage(response.message ?? "Categoría creada correctamente.");
        setPrompt("");
      } else {
        setErrorMessage(
          response.message ?? "No se pudo procesar la solicitud en este momento."
        );
      }
    });
  };

  const handleReset = () => {
    setPrompt("");
    setResultMessage(null);
    setErrorMessage(null);
  };

  return (
    <section className="mx-auto flex h-full max-w-4xl flex-col gap-6 py-6 px-3">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Agente</h1>
        <p className="text-muted-foreground text-sm">
          Usa lenguaje natural en español para dar de alta categorías. Este flujo está
          preparado para ampliarse con otros recursos en el futuro.
        </p>
      </header>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Estado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {resultMessage ? (
            <p className="text-green-700 dark:text-green-400">{resultMessage}</p>
          ) : errorMessage ? (
            <p className="text-destructive">{errorMessage}</p>
          ) : (
            <p className="text-muted-foreground">
              Ingresa un mensaje como "agrega categoría Snacks" para que el agente la cree por ti.
            </p>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt del agente</Label>
          <Input
            id="prompt"
            placeholder="Ej. agrega categoría Snacks"
            value={prompt}
            disabled={isPending}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            El mensaje solo debe contener el nombre de la categoría en frases como: agrega, adiciona o crear.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
            Limpiar
          </Button>
          <Button type="submit" disabled={!prompt.trim() || isPending}>
            {isPending ? "Ejecutando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </section>
  );
};
