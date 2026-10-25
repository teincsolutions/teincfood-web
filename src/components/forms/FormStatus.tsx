import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormStatusProps = {
  status: "loading" | "success" | "error";
  title: string;
  children?: ReactNode;
  className?: string;
};

const statusStyles = {
  loading: "border-navy/15 bg-navy/5 text-navy",
  success: "border-green-200 bg-green-50 text-green-700",
  error: "border-red-200 bg-red-50 text-red-700",
};

export function FormStatus({
  status,
  title,
  children,
  className,
}: FormStatusProps) {
  const Icon =
    status === "loading"
      ? LoaderCircle
      : status === "success"
        ? CircleCheck
        : CircleAlert;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        statusStyles[status],
        className,
      )}
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "mt-0.5 size-5 shrink-0",
            status === "loading" && "animate-spin",
          )}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="font-semibold">{title}</p>
          {children && <div className="mt-1 text-sm">{children}</div>}
        </div>
      </div>
    </div>
  );
}
