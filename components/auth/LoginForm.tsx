"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/lib/schemas/auth";
import { loginUser } from "@/app/actions/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import { useHookFormMask } from "use-mask-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const login = useAuthStore((state) => state.login);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const cleanIdentifier = values.identifier.replace(/\D/g, "");
    const identifier = values.identifier.includes("@") ? values.identifier : cleanIdentifier;

    const result = await loginUser({ ...values, identifier });

    if (result.success && result.user) {
      login(result.user);
      toast.success("Login realizado com sucesso!");
      onSuccess();
    } else {
      form.setError("identifier", { type: "manual", message: result.error || "Credenciais inválidas" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Email ou CPF</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com ou CPF (apenas números)" className="h-10 text-sm placeholder:text-[12px] placeholder:opacity-50 bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" className="h-10 text-sm placeholder:text-[12px] placeholder:opacity-50 bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-11 rounded-full bg-primary text-white hover:opacity-95 transition-all shadow-none mt-2 text-sm font-medium" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
        <p className="text-center text-[12px] text-on-surface/50 mt-4">
          Não tem uma conta?{" "}
          <button type="button" onClick={onSwitchToRegister} className="text-primary font-semibold hover:underline underline-offset-4">Cadastre-se</button>
        </p>
      </form>
    </Form>
  );
}
