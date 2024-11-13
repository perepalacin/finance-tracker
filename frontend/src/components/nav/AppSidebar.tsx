import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { BANK_ACCOUNTS_EMOJI, EXPENSES_EMOJI, INCOMES_EMOJI, INVESTMENTS_EMOJI, TRANSFERS_EMOJI } from "@/helpers/Constants";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "../ui/button";
import { PanelLeft } from "lucide-react";

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
    {/* <SidebarHeader >
        <Link to="/" className='flex flex-row gap-2 items-center'>
            <span className='text-3xl'>
            {String.fromCodePoint(0x1F3E6)}            
            </span>
            {isSideBarOpen &&
            <p className='font-semibold text-1xl whitespace-nowrap'>Finance tracker</p>
            }
        </Link>
    </SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="w-full flex flex-row items-center">
                <Button variant="ghost" className="h-8 w-6" onClick={() => {setOpen(!open)}}>
                  <PanelLeft className="h-[0.8rem] w-[0.8rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <span className="sr-only">Toggle Sidebar</span>
                </Button>
                {open && <span className="text-nowrap font-semibold text-xl">Finance Tracker</span>}
              </div>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                    <span className="text-xl">
                        {item.emoji}
                    </span>
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
        <ThemeToggler />
      </SidebarFooter>
    </Sidebar>
  )
}
