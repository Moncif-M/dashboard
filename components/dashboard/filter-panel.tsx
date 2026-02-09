"use client"

import React from "react"

import { useState } from "react"
import { X, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories, subCategories, activities, tierings, regions, vendorNames } from "@/lib/vendor-data"
import { cn } from "@/lib/utils"

export interface FilterState {
  categories: string[]
  subCategories: string[]
  activities: string[]
  tierings: string[]
  regions: string[]
  vendors: string[]
}

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

interface FilterSelectProps {
  label: string
  icon?: React.ReactNode
  options: string[]
  value: string
  onChange: (value: string) => void
}

function FilterSelect({ label, icon, options, value, onChange }: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [open, setOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    if (value === "all") {
      onFilterChange({ ...filters, [key]: [] })
    } else {
      onFilterChange({ ...filters, [key]: [value] })
    }
  }

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      subCategories: [],
      activities: [],
      tierings: [],
      regions: [],
      vendors: [],
    })
  }

  const activeFilterCount =
    filters.categories.length +
    filters.subCategories.length +
    filters.activities.length +
    filters.tierings.length +
    filters.regions.length +
    filters.vendors.length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "gap-2 border-primary text-primary hover:bg-primary/5",
            activeFilterCount > 0 && "bg-primary/5"
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Filters</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-4">
          <FilterSelect
            label="Vendor"
            options={vendorNames}
            value={filters.vendors[0] || "all"}
            onChange={(value) => updateFilter("vendors", value)}
          />
          <FilterSelect
            label="Category"
            options={categories}
            value={filters.categories[0] || "all"}
            onChange={(value) => updateFilter("categories", value)}
          />
          <FilterSelect
            label="Sub-Category"
            options={subCategories}
            value={filters.subCategories[0] || "all"}
            onChange={(value) => updateFilter("subCategories", value)}
          />
          <FilterSelect
            label="Activity"
            options={activities}
            value={filters.activities[0] || "all"}
            onChange={(value) => updateFilter("activities", value)}
          />
          <FilterSelect
            label="Tiering"
            options={tierings}
            value={filters.tierings[0] || "all"}
            onChange={(value) => updateFilter("tierings", value)}
          />
          <FilterSelect
            label="Region"
            options={regions}
            value={filters.regions[0] || "all"}
            onChange={(value) => updateFilter("regions", value)}
          />
        </div>

        <div className="flex justify-center pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="px-8 border-primary text-primary hover:bg-primary/5 rounded-full bg-transparent"
          >
            Clear Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}