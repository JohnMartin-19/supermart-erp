import { useState } from 'react';
import { cn } from './ui/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './ui/sidebar';
import {
  LayoutDashboard,
  Calculator,
  Package,
  FileText,
  Users,
  Settings,
  Zap,
  Receipt,
  Moon,
  Sun,
  ShoppingCart,
  BookOpen,
  UsersIcon,
  Truck,
  Building2,
  Banknote,
} from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
  },
]

const supermarketMenuItems = [
  {
    id: 'pos',
    title: 'Point of Sale',
    icon: ShoppingCart,
  },
  {
    id: 'products',
    title: 'Product Catalog',
    icon: BookOpen,
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: UsersIcon,
  },
  {
    id: 'suppliers',
    title: 'Suppliers',
    icon: Truck,
  },
  {
    id: 'locations',
    title: 'Multi-Location',
    icon: Building2,
  },
  {
    id: 'cash',
    title: 'Cash Management',
    icon: Banknote,
  },
];

const quickActionsItems = [
  {
    id: 'quick-invoice',
    title: 'Quick Invoice',
    icon: Zap,
  },
  {
    id: 'quick-billing',
    title: 'Quick Billing',
    icon: Receipt,
  },
];

const coreModulesItems = [
  {
    id: 'accounting',
    title: 'Accounting',
    icon: Calculator,
  },
  {
    id: 'inventory',
    title: 'Inventory',
    icon: Package,
  },
  {
    id: 'tax',
    title: 'VAT Compliance',
    icon: FileText,
  },
  {
    id: 'payroll',
    title: 'Payroll',
    icon: Users,
  },
];

const systemItems = [
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
  },
];

export function Layout({ children, activeModule, onModuleChange }: LayoutProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar variant="inset" className="w-64 shrink-0">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SuperMart ERP</span>
                <span className="truncate text-xs">Kenyan Supermarket Chain</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => onModuleChange(item.id)}
                        className={cn(
                          activeModule === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
                        )}
                      >
                        <a href="#" className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Supermarket Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {supermarketMenuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => onModuleChange(item.id)}
                        className={cn(
                          activeModule === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
                        )}
                      >
                        <a href="#" className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {quickActionsItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => onModuleChange(item.id)}
                        className={cn(
                          activeModule === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
                        )}
                      >
                        <a href="#" className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Core Modules</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {coreModulesItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => onModuleChange(item.id)}
                        className={cn(
                          activeModule === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
                        )}
                      >
                        <a href="#" className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {systemItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => onModuleChange(item.id)}
                        className={cn(
                          activeModule === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
                        )}
                      >
                        <a href="#" className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="w-full gap-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-hidden pl-64">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger />
              <div className="flex-1" />
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}