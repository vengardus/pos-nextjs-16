"use client";

import { useState } from "react";

import { aiChatAction } from "@/actions/ai/ai-chat.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";

export const ChatPageClient = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const resp: ResponseAction = await aiChatAction(message);

      if (resp.success) {
        setResponse(resp.data?.text ?? "");
      } else {
        setError(resp.message ?? "No se pudo obtener respuesta del modelo.");
      }
    } catch (error) {
      console.error(error);
      setError("No se pudo procesar la solicitud.");
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    setMessage("");
    setError(null);
    setIsPending(false);
  };

  return (
    <section className="mx-auto flex h-full max-w-4xl flex-col gap-6 py-6 px-3">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Chat IA</h1>
        <p className="text-muted-foreground text-sm">
          Envía un mensaje para recibir una respuesta del modelo Groq.
        </p>
      </header>

      <Card className="flex-1 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Respuesta del modelo</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[200px] whitespace-pre-wrap text-sm">
          {response ? (
            <p>{response}</p>
          ) : (
            <p className="text-muted-foreground">Aún no hay respuestas.</p>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSend} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Mensaje
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Escribe tu consulta aquí"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!message.trim() || isPending}>
            {isPending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </section>
  );
};
