"use client"

import { useState } from "react"
import {
  Package,
  CheckCircle,
  Star,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  X,
  User,
} from "lucide-react"
import { KPICard } from "../kpi-card"
import { GaugeChart } from "../gauge-chart"
import { VendorTable } from "../vendor-table"
import {
  type VendorWithKPIs,
  vendors as allVendors,
  getAggregateMaterialKPIs,
} from "@/lib/vendor-data"
import type { FilterState } from "../filter-panel"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"

interface MaterialPageProps {
  filters: FilterState
}

const COLORS = ["#10b981", "#ef4444", "#f59e0b"]

export function MaterialPage({ filters }: MaterialPageProps) {
  const [selectedVendor, setSelectedVendor] = useState<VendorWithKPIs | null>(null)

  // Filter vendors
  const filteredVendors = allVendors.filter((v) => {
    if (filters.categories.length && !filters.categories.includes(v.category)) return false
    if (filters.subCategories.length && !filters.subCategories.includes(v.subCategory)) return false
    if (filters.activities.length && !filters.activities.includes(v.activity)) return false
    if (filters.tierings.length && !filters.tierings.includes(v.tiering)) return false
    if (filters.regions.length && !filters.regions.includes(v.region)) return false
    return true
  })

  const aggregateKPIs = getAggregateMaterialKPIs()

  // Get display KPIs based on selection
  const displayKPIs = selectedVendor
    ? {
        avgOtifScore: selectedVendor.materialManagement.otifScore,
        avgCompliancePercent: selectedVendor.materialManagement.compliancePercent,
        avgQualityScore: selectedVendor.materialManagement.qualityScore,
        avgNcrProcessFlow: selectedVendor.materialManagement.ncrProcessFlow,
        totalPlanned: selectedVendor.materialManagement.plannedVsActual.planned,
        totalActual: selectedVendor.materialManagement.plannedVsActual.actual,
        totalOsd: selectedVendor.materialManagement.osdData,
        totalConformity: selectedVendor.materialManagement.conformityData,
      }
    : aggregateKPIs

  // Planned vs Actual data
  const plannedVsActualData = selectedVendor
    ? [
        {
          name: selectedVendor.name.split(" ")[0],
          planned: selectedVendor.materialManagement.plannedVsActual.planned,
          actual: selectedVendor.materialManagement.plannedVsActual.actual,
        },
      ]
    : filteredVendors.slice(0, 6).map((v) => ({
        name: v.name.split(" ")[0],
        planned: v.materialManagement.plannedVsActual.planned,
        actual: v.materialManagement.plannedVsActual.actual,
      }))

  // OSD Table data
  const osdData = [
    { type: "Over", count: displayKPIs.totalOsd.over, icon: ArrowUp, color: "text-amber-600" },
    { type: "Short", count: displayKPIs.totalOsd.short, icon: ArrowDown, color: "text-red-600" },
    { type: "Damaged", count: displayKPIs.totalOsd.damaged, icon: Minus, color: "text-red-700" },
  ]

  // Conformity Pie data
  const conformityPieData = [
    { name: "Conformant", value: displayKPIs.totalConformity.conformant },
    { name: "Non-Conformant", value: displayKPIs.totalConformity.nonConformant },
    { name: "Pending", value: displayKPIs.totalConformity.pending },
  ]

  const deliveryVariance = Math.round(
    ((displayKPIs.totalActual - displayKPIs.totalPlanned) / displayKPIs.totalPlanned) * 100
  )

  return (
    <div className="space-y-6">
      {/* Selected Vendor Banner */}
      {selectedVendor && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Showing KPIs for</p>
              <p className="font-semibold text-foreground">{selectedVendor.name}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedVendor(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Selection
          </Button>
        </div>
      )}

      {/* OTIF Gauge and Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 flex items-center justify-center">
          <GaugeChart
            value={displayKPIs.avgOtifScore}
            title={selectedVendor ? `OTIF Score - ${selectedVendor.name.split(" ")[0]}` : "OTIF Score"}
            size="lg"
          />
        </div>
        
        <div className="space-y-4">
          <KPICard
            title="Compliance %"
            value={`${displayKPIs.avgCompliancePercent}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            variant="green"
          />
          <KPICard
            title="Quality Score"
            value={`${displayKPIs.avgQualityScore}%`}
            icon={<Star className="w-5 h-5" />}
            variant="blue"
          />
        </div>
        
        <div className="space-y-4">
          <KPICard
            title="NCR Process Flow"
            value={`${displayKPIs.avgNcrProcessFlow}%`}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="yellow"
          />
          <KPICard
            title={selectedVendor ? "Planned Units" : "Total Planned Units"}
            value={displayKPIs.totalPlanned.toLocaleString()}
            icon={<Package className="w-5 h-5" />}
            variant="default"
          />
        </div>
        
        <div className="space-y-4">
          <KPICard
            title={selectedVendor ? "Actual Units" : "Total Actual Units"}
            value={displayKPIs.totalActual.toLocaleString()}
            icon={<Package className="w-5 h-5" />}
            variant={deliveryVariance >= -5 ? "green" : "red"}
          />
          <KPICard
            title="Delivery Variance"
            value={`${deliveryVariance}%`}
            icon={deliveryVariance >= 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            variant={deliveryVariance >= -5 ? "green" : "red"}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Planned vs Actual Bar Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-sm border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            {selectedVendor 
              ? `Planned vs Actual Deliveries - ${selectedVendor.name}` 
              : "Planned vs Actual Deliveries by Vendor"}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={plannedVsActualData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar dataKey="planned" fill="#3b82f6" name="Planned" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#10b981" name="Actual" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conformity Pie Chart */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            {selectedVendor ? `Conformity - ${selectedVendor.name.split(" ")[0]}` : "Conformity Distribution"}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={conformityPieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {conformityPieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {conformityPieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OSD Table */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          OSD Summary (Over, Short, Damaged)
          {selectedVendor && <span className="text-primary ml-2">- {selectedVendor.name}</span>}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {osdData.map((item) => (
            <div
              key={item.type}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
            >
              <div className={`p-3 rounded-full bg-card ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{item.count}</p>
                <p className="text-sm text-muted-foreground">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Vendor List - Material Management</h3>
          <p className="text-sm text-muted-foreground">
            {filteredVendors.length} vendors found
            <span className="text-muted-foreground ml-2">- Click on a vendor to filter KPIs</span>
          </p>
        </div>
        <VendorTable
          vendors={filteredVendors}
          type="material"
          selectedVendorId={selectedVendor?.id}
          onSelectVendor={setSelectedVendor}
        />
      </div>
    </div>
  )
}
