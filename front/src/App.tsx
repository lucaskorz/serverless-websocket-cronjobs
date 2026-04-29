import { Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useWebsockets } from "./hooks/useWebsockets";

export function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { isLoading, sendMessage } = useWebsockets({
    url: "wss://ufr1odqv53.execute-api.us-east-1.amazonaws.com/dev",
    onMessage: (message: string) => {
      setMessages((prevState) => prevState.concat(message));
    },
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const lastMessage = containerRef.current.lastChild as Element | null;
    lastMessage?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    sendMessage({
      action: "sendMessage",
      message,
    });

    setMessage("");
  }

  return (
    <div className="h-screen grid place-items-center bg-zinc-200 p-4">
      <div className="w-full max-w-xl space-y-10">
        {isLoading && (
          <div className="flex items-center gap-2 justify-center">
            <Loader2Icon className="animate-spin" />
            <span>Entrando no chat...</span>
          </div>
        )}

        {!isLoading && (
          <>
            <div
              className="bg-white h-96 overflow-y-auto rounded-lg shadow-md shadow-black/5 p-6 space-y-4"
              ref={containerRef}
            >
              {messages.map((message) => (
                <div
                  key={message + Math.random()}
                  className="bg-zinc-50 border rounded-md p-3"
                >
                  {message}
                </div>
              ))}
            </div>

            <form className="flex items-center gap-4" onSubmit={handleSubmit}>
              <Input
                className="bg-white"
                placeholder="Digite a sua mensagem..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <Button disabled={message === ""}>
                <SendIcon className="size-5" />
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
