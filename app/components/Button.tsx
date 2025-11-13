import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

type Props = (
  | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
) & { variant?: "primary" | "outline" };

const base = "inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold transition";
const styles = {
  primary: "bg-[#2E7D32] text-white hover:opacity-90",
  outline: "border border-gray-300 hover:bg-gray-50",
};

export default function Button({ variant = "primary", href, className = "", ...rest }: Props) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) return <Link href={href} className={cls} {...(rest as any)} />;
  return <button className={cls} {...(rest as any)} />;
}
