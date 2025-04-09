"use client";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Home,
  Mountain,
  Settings,
  Users,
} from "lucide-react";
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
  SidebarTrigger,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "../ui/collapsible";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

type MenuItem = { id: string; label: string; logo: string };
const defaultItems: MenuItem[] = [
  { id: "google", label: "Google", logo: "/google.svg" },
  { id: "adobe", label: "Adobe", logo: "/adobe.svg" },
];
const sidebarMenu = [
  {
    name: "Home",
    icon: Home,
    path: "/dashboard/home",
  },
  {
    name: "Contacts",
    icon: Users,
    path: "/dashboard/contacts",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

const SortableSidebarMenuButton = ({ item }: { item: MenuItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
  };

  return (
    <SidebarMenuButton
      ref={setNodeRef}
      style={style}
      className="h-9 relative group/menu-button p-2.5 hover:text-foreground hover:cursor-pointer flex w-full gap-2"
      {...attributes}
      {...listeners}
    >
      <span className="text-sidebar pointer-event-none group-hover/menu-button:text-foreground absolute -left-0.5 opacity-60">
        <GripVertical size={10} />
      </span>
      <Image
        src={item.logo}
        width={16}
        height={16}
        alt={item.label}
        className="w-4 h-4 rounded-md"
      ></Image>
      <span>{item.label}</span>
    </SidebarMenuButton>
  );
};
export default function AppSidebar() {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [items, setItems] = useState<MenuItem[]>(defaultItems);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // api call to update order
    }
  };
  return (
    <Sidebar collapsible="icon" className="bg-background">
      <SidebarHeader className="flex-row items-center p-3">
        <div className="flex flex-row items-center justify-between h-10 w-full pl-1 -ml-1">
          <div className="flex items-center truncate space-x-2">
            <div className="flex justify-center items-center size-9">
              <div className="flex justify-center items-center size-7 rounded-md border">
                <Mountain size={16} />
              </div>
            </div>
            <span className="font-bold">Acme</span>
          </div>
          <SidebarTrigger className="rounded-full hover:border-accent-foreground hover:cursor-pointer size-9" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="p-3">
          <SidebarMenu>
            <SidebarMenuItem className="space-y-1">
              {sidebarMenu.map((item, index) => (
                <SidebarMenuButton
                  asChild
                  tooltip={item.name}
                  key={index}
                  className={`h-9 p-2.5 rounded-md hover:bg-accent hover:cursor-pointer text-sidebar-accent-foreground ${
                    currentPath == item.path ? "bg-accent" : ""
                  }`}
                >
                  <Link
                    href={item.path}
                    className={
                      currentPath == item.path
                        ? "text-foreground! font-semibold"
                        : ""
                    }
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="p-3">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="h-10 text-sidebar-accent-foreground px-2.5 items-center justify-between text-sm hover:bg-accent hover:cursor-pointer">
                Favorites
                {isOpen ? <ChevronDown /> : <ChevronRight />}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={items.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {items.map((item) => (
                        <SortableSidebarMenuButton key={item.id} item={item} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
