"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ isOpen, onOpenChange, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = React.useState<"login" | "register">(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] overflow-hidden !duration-500 data-[state=closed]:!animate-none">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="modal-inner-content"
              initial={{ opacity: 0, y: 8, filter: "blur(10px)", scale: 0.96 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ 
                opacity: 0, 
                y: 12, 
                filter: "blur(15px)", 
                scale: 0.94,
                transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } 
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <DialogHeader className="mb-2">
                <DialogTitle className="text-center text-3xl">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={mode}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="inline-block w-full font-serif"
                    >
                      {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
                    </motion.span>
                  </AnimatePresence>
                </DialogTitle>
                <DialogDescription className="text-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={mode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="inline-block w-full"
                    >
                      {mode === "login"
                        ? "Entre para acessar seus pedidos e perfil."
                        : "Junte-se a nós para uma experiência exclusiva."}
                    </motion.span>
                  </AnimatePresence>
                </DialogDescription>
              </DialogHeader>

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {mode === "login" ? (
                      <LoginForm onSuccess={() => onOpenChange(false)} onSwitchToRegister={() => setMode("register")} />
                    ) : (
                      <RegisterForm onSuccess={() => onOpenChange(false)} onSwitchToLogin={() => setMode("login")} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
