"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { profileSchema } from "@/lib/schemas/profile";
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ProfileFormProps {
  userId: string;
  defaultValues: { name: string; email: string; cpf: string };
}

export function ProfileForm({ userId, defaultValues }: ProfileFormProps) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues.name,
      email: defaultValues.email,
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const result = await updateProfile(userId, values);
    if (result.success) {
      toast.success("Perfil atualizado!");
    } else {
      if (result.field) form.setError(result.field as any, { message: result.error });
      else toast.error(result.error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Nome</FormLabel>
                <FormControl><Input className="h-10 text-sm bg-surface-container-low border-none" {...field} /></FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Email</FormLabel>
                <FormControl><Input className="h-10 text-sm bg-surface-container-low border-none" {...field} /></FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>
        <FormItem className="space-y-1.5">
          <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">CPF (Imutável)</FormLabel>
          <Input disabled value={defaultValues.cpf} className="h-10 text-sm bg-surface-container-low/30 border-none cursor-not-allowed opacity-60" />
        </FormItem>
        <Button type="submit" className="w-full h-11 rounded-full bg-primary text-white hover:opacity-95 transition-all shadow-none mt-4 text-sm font-medium" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Atualizar Perfil"}
        </Button>
      </form>
    </Form>
  );
}
