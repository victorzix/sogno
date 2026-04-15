"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addressSchema } from "@/lib/schemas/address";
import { upsertAddress } from "@/app/actions/address";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface AddressFormProps {
  userId: string;
  defaultValues?: z.infer<typeof addressSchema>;
}

export function AddressForm({ userId, defaultValues }: AddressFormProps) {
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    const result = await upsertAddress(userId, values);
    if (result.success) {
      toast.success("Endereço salvo com sucesso!");
    } else {
      toast.error(result.error || "Erro ao salvar endereço");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">CEP</FormLabel>
                <FormControl>
                  <Input placeholder="00000-000" className="h-10 text-sm bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">UF</FormLabel>
                <FormControl>
                  <Input placeholder="SP" className="h-10 text-sm bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Logradouro</FormLabel>
              <FormControl>
                <Input placeholder="Rua..." className="h-10 text-sm bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Número</FormLabel>
                <FormControl>
                  <Input placeholder="123" className="h-10 text-sm bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Apto..." className="h-10 text-sm bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" className="h-10 text-sm bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" className="h-10 text-sm bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
        </div>
        <Button type="submit" className="w-full h-11 rounded-full bg-primary text-white hover:opacity-95 transition-all shadow-none mt-4 text-sm font-medium" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar Endereço"}
        </Button>
      </form>
    </Form>
  );
}
