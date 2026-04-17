'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { createTestProduct } from '@/app/actions/test-seed';
import { toast } from 'sonner';

export function SeedButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button 
      variant="secondary" 
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await createTestProduct();
          toast.success('Produto de teste criado!');
        });
      }}
    >
      {isPending ? 'Gerando...' : 'Gerar Produto de Teste'}
    </Button>
  );
}
