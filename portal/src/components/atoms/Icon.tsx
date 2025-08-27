import React from "react";
import { icons } from "lucide-react";
import type { LucideProps } from "lucide-react";

export interface IconProps extends LucideProps {
  name: keyof typeof icons;
}

const Icon: React.FC<IconProps> = ({
  name,
  color,
  size,
  className,
  ...props
}) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found.`);
    return null;
  }

  return (
    <LucideIcon color={color} size={size} className={className} {...props} />
  );
};

export default Icon;
