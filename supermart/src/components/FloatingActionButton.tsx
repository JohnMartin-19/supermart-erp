import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Plus, FileText, Receipt, Zap } from 'lucide-react';
import { cn } from './ui/utils';

interface FloatingActionButtonProps {
  onQuickInvoice: () => void;
  onQuickBilling: () => void;
}

export function FloatingActionButton({ onQuickInvoice, onQuickBilling }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      id: 'invoice',
      label: 'Quick Invoice',
      icon: FileText,
      action: () => {
        onQuickInvoice();
        setIsOpen(false);
      },
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      id: 'billing',
      label: 'Quick Bill',
      icon: Receipt,
      action: () => {
        onQuickBilling();
        setIsOpen(false);
      },
      color: 'bg-green-600 hover:bg-green-700 text-white',
    },
  ];

  return (
    <>
      {/* Desktop FAB */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col gap-2">
        {isOpen && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                onClick={action.action}
                size="lg"
                className={cn(
                  'h-12 w-12 rounded-full shadow-lg transition-all duration-200 hover:scale-105',
                  action.color
                )}
              >
                <action.icon className="h-5 w-5" />
                <span className="sr-only">{action.label}</span>
              </Button>
            ))}
          </div>
        )}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200',
            isOpen ? 'rotate-45' : 'hover:scale-105'
          )}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Quick Actions</span>
        </Button>
      </div>

      {/* Mobile Sheet */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
            >
              <Zap className="h-6 w-6" />
              <span className="sr-only">Quick Actions</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader className="text-left">
              <SheetTitle>Quick Actions</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-4 mt-6 mb-4">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  onClick={action.action}
                  size="lg"
                  className={cn(
                    'h-16 flex-col gap-2 transition-all duration-200',
                    action.color
                  )}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}