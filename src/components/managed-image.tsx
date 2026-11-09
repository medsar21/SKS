import Image from "next/image";
import type { ComponentProps } from "react";
export function ManagedImage(props: ComponentProps<typeof Image>) {
  if (!props.src) return null;
  return <Image {...props} />;
}
