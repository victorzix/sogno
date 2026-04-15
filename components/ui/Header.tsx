"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const navigation = [
  { name: "Catálogo", href: "/catalogo" },
  { name: "Eventos", href: "/eventos" },
  { name: "Nossa História", href: "/historia" },
  { name: "Contato", href: "/contato" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/70 glass">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Left: System Name */}
        <div className="flex flex-1">
          <Link 
            href="/" 
            className="font-serif text-xl md:text-2xl text-primary font-medium tracking-tight"
          >
            Sogni di Carta
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex flex-[2] justify-center items-center gap-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-on-surface/60 hover:text-primary transition-colors tracking-archival"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right: Actions & Mobile Menu Toggle */}
        <div className="flex flex-1 items-center justify-end gap-6 text-primary">
          <Link href="/carrinho" className="p-2 transition-transform hover:scale-110">
            <ShoppingBag className="size-6" strokeWidth={1.5} />
            <span className="sr-only">Carrinho</span>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 transition-transform hover:scale-105 outline-none">
                  <User className="size-6" strokeWidth={1.5} />
                  <span className="hidden lg:inline text-sm font-medium">{user?.name.split(' ')[0]}</span>
                  <ChevronDown className="size-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/conta">Perfil e Endereço</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pedidos">Meus Pedidos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 transition-transform hover:scale-110"
            >
              <User className="size-6" strokeWidth={1.5} />
              <span className="sr-only">Entrar</span>
            </button>
          )}
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden vellum-overlay absolute top-20 left-0 w-full p-8 border-t border-primary/5 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-8 items-center text-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xl font-serif text-on-surface hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Button 
                variant="primary" 
                className="w-full mt-4"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
              >
                Entrar / Cadastrar
              </Button>
            )}
          </nav>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen} 
      />
    </header>
  );
}
