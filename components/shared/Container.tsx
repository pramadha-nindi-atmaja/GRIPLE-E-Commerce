import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 md:px-margin-edge",
        "max-w-(--container-container-max)",
        className,
      )}
      {...props}
    />
  );
}

