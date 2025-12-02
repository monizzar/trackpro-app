"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ClipboardCheck, LogOut, ExternalLink, User, Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function ProductionSidebar() {
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/production/dashboard" },
        { icon: Package, label: "Manajemen Batch", href: "/production/batch" },
        { icon: ClipboardCheck, label: "Kontrol Kualitas", href: "/production/quality" },
    ]

    return (
        <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-r dark:text-white">
            {/* Brand */}
            <div className="flex h-16 items-center gap-2 border-b px-6">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600" />
                <div>
                    <div className="font-semibold text-foreground">TrackPro</div>
                    <div className="text-xs text-muted-foreground">Production System</div>
                </div>
            </div>

            {/* Role Badge */}
            <div className="px-4 py-3 border-b">
                <Badge variant="secondary" className="w-full justify-center gap-2 py-2">
                    <Package className="h-3.5 w-3.5" />
                    Kepala Produksi
                </Badge>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* External Links */}
            <div className="border-t p-4 space-y-2">
                <Link
                    href="https://github.com"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ExternalLink className="h-4 w-4" />
                    Repository
                </Link>
                <Link
                    href="/docs"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ExternalLink className="h-4 w-4" />
                    Documentation
                </Link>
            </div>

            {/* Theme Toggle */}
            <div className="border-t px-4 py-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                    <ThemeToggle />
                </div>
            </div>

            {/* User Menu */}
            <div className="border-t p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                                KP
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">Kepala Produksi</p>
                            <p className="text-xs text-muted-foreground truncate w-full">production@trackpro.com</p>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
