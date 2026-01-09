"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "m@example.com",
    url: "/",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "EOTC IR",
      logo: GalleryVerticalEnd,
     
    },
    /* {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    }, */
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      /* items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ], */
    },
   
    {
      title: "Incidents",
      url: "/admin/incident",
      icon: BookOpen,
      items: [
        /* {
          title: "All Incidents",
           url: "/admin/incident",
        }, */
       /*  {
          title: "manage Incident",
          url: "#",
        }, */
        
        
      ],
    },
    {
      title: "Users",
      url: "/admin/user",
      icon: Settings2,
      items: [
        /* {
          title: "List of Users",
          url: "/admin/user",
        },
        {
          title: "manage Users",
          url: "#",
        }, */
       
      ],
    },
     
  ],
  title: [
    /* {
      name: "Title ",
      url: "#",
      icon: Frame,
    }, */
   /*  {
      name: "Edit",
      url: "#",
      icon: PieChart,
    }, */
    /* {
      name: "Delete",
      url: "#",
      icon: Map,
    }, */
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
       <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects title={data.title} />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
