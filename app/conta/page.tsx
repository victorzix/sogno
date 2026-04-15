import { getAddress } from "@/app/actions/address";
import { AddressForm } from "@/components/account/AddressForm";
import { ProfileForm } from "@/components/account/ProfileForm";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await getSession();
  if (!session?.user) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { address: true }
  });

  if (!user) redirect("/");

  const menu = [
    { name: "Perfil e Endereço", href: "/conta" },
    { name: "Meus Pedidos", href: "/pedidos" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
      <h1 className="font-serif text-4xl text-primary mb-16">Minha Conta</h1>
      
      <div className="flex flex-col md:flex-row gap-16">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-4">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="tracking-archival text-[11px] uppercase opacity-60 hover:opacity-100 transition-opacity py-2 border-b border-primary/10"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-grow space-y-16">
          <div className="w-full">
            <h2 className="font-serif text-2xl text-primary mb-8">Perfil</h2>
            <div className="p-8 md:p-10 rounded-2xl bg-surface-container-low/50 w-full max-w-2xl">
              <ProfileForm userId={user.id} defaultValues={{ name: user.name, email: user.email, cpf: user.cpf }} />
            </div>
          </div>

          <div className="w-full">
            <h2 className="font-serif text-2xl text-primary mb-8">Endereço de Entrega</h2>
            <div className="p-8 md:p-10 rounded-2xl bg-surface-container-low/50 w-full max-w-2xl">
              <AddressForm userId={user.id} defaultValues={user.address || undefined} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
