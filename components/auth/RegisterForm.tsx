"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerSchema } from "@/lib/schemas/auth";
import { registerUser } from "@/app/actions/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useHookFormMask } from "use-mask-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", cpf: "", password: "" },
  });

  const registerWithMask = useHookFormMask(form.register);

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const cleanCpf = values.cpf.replace(/\D/g, "");
    const result = await registerUser({ ...values, cpf: cleanCpf }) as any;

    if (result.success && result.user) {
      login(result.user);
      toast.success("Conta criada com sucesso!");
      onSuccess();
      router.push("/");
    } else {
      if (result.field) {
        form.setError(result.field as any, { type: "manual", message: result.error });
      } else {
        toast.error(result.error || "Erro ao criar conta");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 pt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" className="h-10 text-sm placeholder:text-[12px] placeholder:opacity-50 bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" className="h-10 text-sm placeholder:text-[12px] placeholder:opacity-50 bg-surface-container-low border-none focus-visible:ring-primary/10" {...field} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="tracking-archival text-[10px] uppercase text-primary/60 font-medium ml-1">CPF</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" className="h-10 text-sm placeholder:text-[12px] placeholder:opacity-50 bg-surface-container-low border-none focus-visible:ring-primary/10" {...registerWithMask("cpf", "999.999.999-99")} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>
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
          {form.formState.isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
        <p className="text-center text-[12px] text-on-surface/50 mt-4">
          Já tem uma conta?{" "}
          <button type="button" onClick={onSwitchToLogin} className="text-primary font-semibold hover:underline underline-offset-4">Entre aqui</button>
        </p>
      </form>
    </Form>
  );
}
