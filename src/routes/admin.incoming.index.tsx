import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/admin/incoming/")({
  component: () => (
    <div className="h-full grid place-items-center px-8 py-20 text-center text-muted-foreground">
      <div>
        <Inbox className="h-10 w-10 mx-auto mb-4 opacity-40" />
        <div className="font-serif text-xl text-foreground mb-1">Select a report to review</div>
        <div className="text-sm">Choose from the queue on the left.</div>
      </div>
    </div>
  ),
});
