import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { BANK_ACCOUNTS_EMOJI, EXPENSES_EMOJI, INCOMES_EMOJI, INVESTMENTS_EMOJI, TRANSFERS_EMOJI } from "@/helpers/Constants";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "../ui/button";
import { PanelLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// Menu items.
export const navItems = [
  {
    title: "Dashboard",
    url: "/",
    emoji: String.fromCodePoint(0x1F4CA),
  },
  {
    title: "Bank Accounts",
    url: "/accounts",
    emoji: BANK_ACCOUNTS_EMOJI
  },
  {
    title: "Transfers",
    url: "/transfers",
    emoji: TRANSFERS_EMOJI
  },
  {
    title: "Investments",
    url: "/investments",
    emoji: INVESTMENTS_EMOJI
  },
  {
    title: "Incomes",
    url: "/incomes",
    emoji: INCOMES_EMOJI
  },
  {
    title: "Expenses",
    url: "/expenses",
    emoji: EXPENSES_EMOJI
  }
]

export function AppSidebar() {
    const {open, setOpen} = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="w-full flex flex-row items-center">
                <Button variant="ghost" className="h-8 w-6" onClick={() => {setOpen(!open)}}>
                  <PanelLeft className="h-[0.8rem] w-[0.8rem] rotate-0 scale-100 transition-all" />
                <span className="sr-only">Toggle Sidebar</span>
                </Button>
                {open && <span className="text-nowrap font-semibold text-xl">Finance Tracker</span>}
              </div>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                          <span className="text-xl">
                              {item.emoji}
                          </span>
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="px-2 py-1 rounded-md mb-2">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggler />
      </SidebarFooter>
    </Sidebar>
  )
}
