import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, className, variant = "default" }) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700",
    primary: "bg-gradient-to-r from-primary/10 to-primary/20 text-primary",
    secondary: "bg-gradient-to-r from-secondary/10 to-secondary/20 text-secondary",
    accent: "bg-gradient-to-r from-accent/10 to-accent/20 text-accent",
    success: "bg-gradient-to-r from-success/10 to-success/20 text-success"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;