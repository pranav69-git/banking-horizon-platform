
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface FormInputFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  icon: LucideIcon;
  className?: string;
  [key: string]: any;
}

export function FormInputField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  className,
  ...props
}: FormInputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type={type}
                placeholder={placeholder}
                className={`pl-10 ${className}`}
                {...field}
                {...props}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
