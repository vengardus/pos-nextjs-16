"use client";

import { useState, useTransition } from "react";
import { aiAgentAction } from "@/server/modules/ai/next/actions/ai-agent.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/typography/page-header";

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
    <section className="p-6 h-full flex flex-col">
      <PageHeader title="Agente IA" breadcrumb="Inicio / AI / Agente" />

      <div className="mx-auto w-full max-w-4xl mt-8 flex flex-col gap-6">
        <p className="text-muted-foreground text-sm">
          Usa lenguaje natural en español para dar de alta categorías. Este flujo está
          preparado para ampliarse con otros recursos en el futuro.
        </p>

        <Card className="border-border/50 bg-background/80 backdrop-blur-sm shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Estado de la operación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {resultMessage ? (
              <p className="text-green-600 dark:text-green-400 font-medium">{resultMessage}</p>
            ) : errorMessage ? (
              <p className="text-destructive font-medium">{errorMessage}</p>
            ) : (
              <p className="text-muted-foreground">
                Ingresa un mensaje como "agrega categoría Snacks" para que el agente la cree por ti.
              </p>
            )}
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Instrucción para el agente</Label>
            <Input
              id="prompt"
              placeholder="Ej. agrega categoría Snacks"
              value={prompt}
              disabled={isPending}
              onChange={(event) => setPrompt(event.target.value)}
              className="h-12 border-border/50 focus-visible:ring-primary/50"
            />
            <p className="text-muted-foreground text-xs">
              El mensaje solo debe contener el nombre de la categoría en frases como: agrega, adiciona o crear.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
              Limpiar
            </Button>
            <Button type="submit" disabled={!prompt.trim() || isPending}>
              {isPending ? "Ejecutando..." : "Enviar comando"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
