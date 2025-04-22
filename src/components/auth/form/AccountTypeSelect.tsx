
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountTypeSelectProps {
  control: any;
}

export function AccountTypeSelect({ control }: AccountTypeSelectProps) {
  return (
    <FormField
      control={control}
      name="accountType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="current">Current Account</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
