"use client"

import { useState } from "react"
import {
  Shield,
  AlertTriangle,
  FileText,
  Building2,
  TrendingUp,
  Award,
  Clock,
  Package,
  FolderKanban,
  Target,
  Users,
  Percent,
  X,
  User,
} from "lucide-react"
import { KPICard } from "../kpi-card"
import { GaugeChart } from "../gauge-chart"
import { VendorTable } from "../vendor-table"
import {
  type VendorWithKPIs,
  vendors as allVendors,
  getAggregatePreAwardKPIs,
} from "@/lib/vendor-data"
import type { FilterState } from "../filter-panel"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"

interface PreAwardPageProps {
  filters: FilterState
  view: "overview" | "performance"
}

export function PreAwardPage({ filters, view }: PreAwardPageProps) {
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

  const aggregateKPIs = getAggregatePreAwardKPIs()

  // Get display KPIs based on selection
  const displayKPIs = selectedVendor
    ? {
        avgEcosystemScore: selectedVendor.preAward.ecosystemScore,
        avgHseScore: selectedVendor.preAward.hseScore,
        avgSustainabilityScore: selectedVendor.preAward.sustainabilityScore,
        avgGlobalRiskLevel: selectedVendor.preAward.globalRiskLevel,
        totalTraceFlags: selectedVendor.preAward.traceReport.status === 'flagged' ? 1 : 0,
        totalDbFlags: selectedVendor.preAward.dbScore.status === 'flagged' ? 1 : 0,
        avgResponseRate: selectedVendor.preAward.responseRate,
        avgTechnicalValidation: selectedVendor.preAward.technicalValidationRatio,
        avgPriceCompetitiveness: selectedVendor.preAward.priceCompetitiveness,
        totalSuccessfulAwards: selectedVendor.preAward.successfulAwards,
        avgAwardingRate: selectedVendor.preAward.awardingRate,
        totalProjectsOngoing: selectedVendor.preAward.projectsOngoing,
        totalPackagesOngoing: selectedVendor.preAward.packagesOngoing,
        dependanceJesa: selectedVendor.preAward.dependanceJesa,
        responsivenesseTechnique: selectedVendor.preAward.responsivenesseTechnique,
        responsivenessSignature: selectedVendor.preAward.responsivenessSignature,
        jesaScope: selectedVendor.preAward.jesaScope,
      }
    : {
        ...aggregateKPIs,
        dependanceJesa: Math.round(filteredVendors.reduce((sum, v) => sum + v.preAward.dependanceJesa, 0) / (filteredVendors.length || 1)),
        responsivenesseTechnique: Number((filteredVendors.reduce((sum, v) => sum + v.preAward.responsivenesseTechnique, 0) / (filteredVendors.length || 1)).toFixed(1)),
        responsivenessSignature: Number((filteredVendors.reduce((sum, v) => sum + v.preAward.responsivenessSignature, 0) / (filteredVendors.length || 1)).toFixed(1)),
        jesaScope: Math.round(filteredVendors.reduce((sum, v) => sum + v.preAward.jesaScope, 0) / (filteredVendors.length || 1)),
      }

  // Sample time series data for charts
  const caTimeData = selectedVendor
    ? selectedVendor.preAward.chiffreAffaire.map((value, index) => ({
        year: String(2022 + index),
        value,
      }))
    : [
        { year: "2022", value: 8.5 },
        { year: "2023", value: 10.2 },
        { year: "2024", value: 12.8 },
        { year: "2025", value: 15.4 },
        { year: "2026", value: 18.2 },
      ]

  const capacityData = selectedVendor
    ? [
        {
          name: selectedVendor.name.split(" ")[0],
          Production: selectedVendor.preAward.productionCapacity / 1000,
          "Open Capacity": selectedVendor.preAward.openCapacity / 1000,
        },
      ]
    : filteredVendors.slice(0, 8).map((v) => ({
        name: v.name.split(" ")[0],
        Production: v.preAward.productionCapacity / 1000,
        "Open Capacity": v.preAward.openCapacity / 1000,
      }))

  const SelectedVendorBanner = () => (
    selectedVendor && (
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
    )
  )

  if (view === "overview") {
    return (
      <div className="space-y-6">
        {/* Selected Vendor Banner */}
        <SelectedVendorBanner />

        {/* Gauge Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <GaugeChart
              value={displayKPIs.avgEcosystemScore}
              title="Ecosystem Score"
              size="md"
            />
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <GaugeChart
              value={displayKPIs.avgHseScore}
              title="HSE Score"
              size="md"
            />
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <GaugeChart
              value={displayKPIs.avgSustainabilityScore}
              title="Sustainability Score"
              size="md"
            />
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <GaugeChart
              value={100 - displayKPIs.avgGlobalRiskLevel}
              title="Global Risk Level (Inverse)"
              size="md"
            />
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPICard
            title="Trace Report Flags"
            value={displayKPIs.totalTraceFlags}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant={displayKPIs.totalTraceFlags === 0 ? "green" : "red"}
          />
          <KPICard
            title="D&B Flags"
            value={displayKPIs.totalDbFlags}
            icon={<FileText className="w-5 h-5" />}
            variant={displayKPIs.totalDbFlags === 0 ? "green" : "red"}
          />
          <KPICard
            title={selectedVendor ? "Dependance JESA" : "Avg Dependance JESA"}
            value={`${displayKPIs.dependanceJesa}%`}
            icon={<Building2 className="w-5 h-5" />}
            variant="blue"
          />
          <KPICard
            title="Projects Ongoing"
            value={displayKPIs.totalProjectsOngoing}
            icon={<FolderKanban className="w-5 h-5" />}
            variant="green"
          />
          <KPICard
            title="Packages Ongoing"
            value={displayKPIs.totalPackagesOngoing}
            icon={<Package className="w-5 h-5" />}
            variant="blue"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {selectedVendor ? `Chiffre d'Affaire Trend (M€) - ${selectedVendor.name}` : "Average Chiffre d'Affaire Trend (M€)"}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={caTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {selectedVendor ? `Production vs Open Capacity (K units) - ${selectedVendor.name}` : "Production vs Open Capacity (K units)"}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={capacityData} barGap={2} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" axisLine={{ stroke: '#e5e7eb' }} />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={{ stroke: '#e5e7eb' }} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}K units`, '']} 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Production" fill="#3b82f6" name="Production" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Open Capacity" fill="#10b981" name="Open Capacity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Vendor List - Pre-Award Overview</h3>
            <p className="text-sm text-muted-foreground">
              {filteredVendors.length} vendors found
              <span className="text-muted-foreground ml-2">- Click on a vendor to filter KPIs</span>
            </p>
          </div>
          <VendorTable
            vendors={filteredVendors}
            type="pre-award"
            selectedVendorId={selectedVendor?.id}
            onSelectVendor={setSelectedVendor}
          />
        </div>
      </div>
    )
  }

  // Performance View (Pre-Award 2)
  return (
    <div className="space-y-6">
      {/* Selected Vendor Banner */}
      <SelectedVendorBanner />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title={selectedVendor ? "Response Rate" : "Avg Response Rate"}
          value={`${displayKPIs.avgResponseRate}%`}
          icon={<Target className="w-5 h-5" />}
          variant="green"
        />
        <KPICard
          title="Tech Validation Ratio"
          value={`${displayKPIs.avgTechnicalValidation}%`}
          icon={<Shield className="w-5 h-5" />}
          variant="blue"
        />
        <KPICard
          title="Price Competitiveness"
          value={`${displayKPIs.avgPriceCompetitiveness}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="yellow"
        />
        <KPICard
          title="Successful Awards"
          value={displayKPIs.totalSuccessfulAwards}
          icon={<Award className="w-5 h-5" />}
          variant="green"
        />
        <KPICard
          title={selectedVendor ? "Awarding Rate" : "Avg Awarding Rate"}
          value={`${displayKPIs.avgAwardingRate}%`}
          icon={<Percent className="w-5 h-5" />}
          variant="blue"
        />
      </div>

      {/* Second Row KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Tech Responsiveness"
          value={`${displayKPIs.responsivenesseTechnique} days`}
          icon={<Clock className="w-5 h-5" />}
          variant="yellow"
        />
        <KPICard
          title="Contract Signature"
          value={`${displayKPIs.responsivenessSignature} days`}
          icon={<FileText className="w-5 h-5" />}
          variant="yellow"
        />
        <KPICard
          title="JESA Scope %"
          value={`${displayKPIs.jesaScope}%`}
          icon={<Building2 className="w-5 h-5" />}
          variant="blue"
        />
        <KPICard
          title={selectedVendor ? "Vendor" : "Total Vendors"}
          value={selectedVendor ? selectedVendor.name.split(" ")[0] : filteredVendors.length}
          icon={<Users className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {selectedVendor ? `Performance Metrics - ${selectedVendor.name}` : "Vendor Performance Comparison"}
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={selectedVendor
              ? [
                  {
                    name: selectedVendor.name.split(" ")[0],
                    responseRate: selectedVendor.preAward.responseRate,
                    techValidation: selectedVendor.preAward.technicalValidationRatio,
                    awardRate: selectedVendor.preAward.awardingRate,
                  },
                ]
              : filteredVendors.slice(0, 8).map((v) => ({
                  name: v.name.split(" ")[0],
                  responseRate: v.preAward.responseRate,
                  techValidation: v.preAward.technicalValidationRatio,
                  awardRate: v.preAward.awardingRate,
                }))}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
            <Tooltip />
            <Legend />
            <Bar dataKey="responseRate" fill="#3b82f6" name="Response Rate" radius={[0, 4, 4, 0]} />
            <Bar dataKey="techValidation" fill="#10b981" name="Tech Validation" radius={[0, 4, 4, 0]} />
            <Bar dataKey="awardRate" fill="#f59e0b" name="Award Rate" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vendor Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Vendor List - Pre-Award Performance</h3>
          <p className="text-sm text-muted-foreground">
            {filteredVendors.length} vendors found
            <span className="text-muted-foreground ml-2">- Click on a vendor to filter KPIs</span>
          </p>
        </div>
        <VendorTable
          vendors={filteredVendors}
          type="pre-award"
          selectedVendorId={selectedVendor?.id}
          onSelectVendor={setSelectedVendor}
        />
      </div>
    </div>
  )
}
