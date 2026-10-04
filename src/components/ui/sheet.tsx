import type { ComponentProps } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  side = "right",
  title,
  ...props
}: ComponentProps<typeof Dialog.Content> & { side?: "right" | "left" | "bottom"; title?: string }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        className={cn(
          "fixed z-50 border-border bg-bg-elevated p-5 shadow-none",
          side === "right" && "inset-y-0 right-0 h-full w-[min(100%,22rem)] border-l data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
          side === "left" && "inset-y-0 left-0 h-full w-[min(100%,18rem)] border-r",
          side === "bottom" && "inset-x-0 bottom-0 rounded-t-xl border-t",
          className,
        )}
        {...props}
      >
        <Dialog.Title className={title ? "font-display text-lg text-fg" : "sr-only"}>
          {title ?? "Panel"}
        </Dialog.Title>
        <Dialog.Close className="absolute top-4 right-4 rounded-sm p-1 text-muted hover:text-fg">
          <X className="size-4" />
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
