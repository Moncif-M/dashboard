"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  FileCheck,
  Award,
  Package,
  ChevronRight,
  Calendar,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FilterPanel, type FilterState } from "./filter-panel"
import { PreAwardPage } from "./pages/pre-award-page"
import { PostAwardPage } from "./pages/post-award-page"
import { MaterialPage } from "./pages/material-page"
import { Button } from "@/components/ui/button"

type PageType = "pre-award" | "post-award" | "material"
type SubView = "overview" | "performance"

const navigation = [
  {
    id: "pre-award" as PageType,
    label: "Pre-Award",
    icon: FileCheck,
    subViews: [
      { id: "overview" as SubView, label: "Overview" },
      { id: "performance" as SubView, label: "Performance" },
    ],
  },
  {
    id: "post-award" as PageType,
    label: "Post-Award",
    icon: Award,
    subViews: [],
  },
  {
    id: "material" as PageType,
    label: "Material Management",
    icon: Package,
    subViews: [],
  },
]

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState<PageType>("pre-award")
  const [subView, setSubView] = useState<SubView>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    subCategories: [],
    activities: [],
    tierings: [],
    regions: [],
  })

  const currentNav = navigation.find((n) => n.id === currentPage)
  const today = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16",
          "hidden lg:block"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Vendor KPIs</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            <ChevronRight
              className={cn("w-4 h-4 transition-transform", !sidebarOpen && "rotate-180")}
            />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  setCurrentPage(item.id)
                  if (item.subViews.length > 0) {
                    setSubView(item.subViews[0].id)
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  currentPage === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>

              {/* Sub-views */}
              {sidebarOpen && currentPage === item.id && item.subViews.length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subViews.map((sv) => (
                    <button
                      key={sv.id}
                      onClick={() => setSubView(sv.id)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                        subView === sv.id
                          ? "bg-primary/20 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {sv.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <aside
          className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Vendor KPIs</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    setCurrentPage(item.id)
                    if (item.subViews.length > 0) {
                      setSubView(item.subViews[0].id)
                    }
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    currentPage === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>

                {currentPage === item.id && item.subViews.length > 0 && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subViews.map((sv) => (
                      <button
                        key={sv.id}
                        onClick={() => {
                          setSubView(sv.id)
                          setMobileMenuOpen(false)
                        }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                          subView === sv.id
                            ? "bg-primary/20 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {sv.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Vendor Dashboard / <span className="text-primary">{currentNav?.label}</span>
                  {currentPage === "pre-award" && (
                    <span className="text-muted-foreground">
                      {" "}
                      / {subView === "overview" ? "Overview" : "Performance"}
                    </span>
                  )}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Last Refresh: {today}</span>
              </div>
              <FilterPanel filters={filters} onFilterChange={setFilters} />
            </div>
          </div>

          {/* Sub Navigation Tabs for Pre-Award */}
          {currentPage === "pre-award" && currentNav?.subViews.length > 0 && (
            <div className="flex items-center gap-1 px-4 lg:px-6 pb-2">
              {currentNav.subViews.map((sv) => (
                <button
                  key={sv.id}
                  onClick={() => setSubView(sv.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    subView === sv.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {sv.label}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {currentPage === "pre-award" && <PreAwardPage filters={filters} view={subView} />}
          {currentPage === "post-award" && <PostAwardPage filters={filters} />}
          {currentPage === "material" && <MaterialPage filters={filters} />}
        </div>
      </main>
    </div>
  )
}
