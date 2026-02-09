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
  view: "overview" | "performance" | "table"
}

export function PreAwardPage({ filters, view }: PreAwardPageProps) {
  const [selectedVendor, setSelectedVendor] = useState<VendorWithKPIs | null>(null)

  // Filter vendors
  const filteredVendors = allVendors.filter((v) => {
    if (filters.vendors.length && !filters.vendors.includes(v.name)) return false
    if (filters.categories.length && !filters.categories.includes(v.category)) return false
    if (filters.subCategories.length && !filters.subCategories.includes(v.subCategory)) return false
    if (filters.activities.length && !filters.activities.includes(v.activity)) return false
    if (filters.tierings.length && !filters.tierings.includes(v.tiering)) return false
    if (filters.regions.length && !filters.regions.includes(v.region)) return false
    return true
  })

  // Calculate aggregate KPIs from filtered vendors
  const calculateAggregateKPIs = (vendors: VendorWithKPIs[]) => {
    if (vendors.length === 0) {
      return {
        avgEcosystemScore: 0,
        avgHseScore: 0,
        avgSustainabilityScore: 0,
        avgGlobalRiskLevel: 0,
        totalTraceFlags: 0,
        totalDbFlags: 0,
        avgResponseRate: 0,
        avgTechnicalValidation: 0,
        avgPriceCompetitiveness: 0,
        totalSuccessfulAwards: 0,
        avgAwardingRate: 0,
        totalProjectsOngoing: 0,
        totalPackagesOngoing: 0,
        dependanceJesa: 0,
        responsivenesseTechnique: 0,
        responsivenessSignature: 0,
        jesaScope: 0,
      }
    }

    const sum = vendors.reduce((acc, v) => ({
      ecosystemScore: acc.ecosystemScore + v.preAward.ecosystemScore,
      hseScore: acc.hseScore + v.preAward.hseScore,
      sustainabilityScore: acc.sustainabilityScore + v.preAward.sustainabilityScore,
      globalRiskLevel: acc.globalRiskLevel + v.preAward.globalRiskLevel,
      traceFlags: acc.traceFlags + (v.preAward.traceReport.status === 'flagged' ? 1 : 0),
      dbFlags: acc.dbFlags + (v.preAward.dbScore.status === 'flagged' ? 1 : 0),
      responseRate: acc.responseRate + v.preAward.responseRate,
      technicalValidation: acc.technicalValidation + v.preAward.technicalValidationRatio,
      priceCompetitiveness: acc.priceCompetitiveness + v.preAward.priceCompetitiveness,
      successfulAwards: acc.successfulAwards + v.preAward.successfulAwards,
      awardingRate: acc.awardingRate + v.preAward.awardingRate,
      projectsOngoing: acc.projectsOngoing + v.preAward.projectsOngoing,
      packagesOngoing: acc.packagesOngoing + v.preAward.packagesOngoing,
      dependanceJesa: acc.dependanceJesa + v.preAward.dependanceJesa,
      responsivenesseTechnique: acc.responsivenesseTechnique + v.preAward.responsivenesseTechnique,
      responsivenessSignature: acc.responsivenessSignature + v.preAward.responsivenessSignature,
      jesaScope: acc.jesaScope + v.preAward.jesaScope,
    }), {
      ecosystemScore: 0,
      hseScore: 0,
      sustainabilityScore: 0,
      globalRiskLevel: 0,
      traceFlags: 0,
      dbFlags: 0,
      responseRate: 0,
      technicalValidation: 0,
      priceCompetitiveness: 0,
      successfulAwards: 0,
      awardingRate: 0,
      projectsOngoing: 0,
      packagesOngoing: 0,
      dependanceJesa: 0,
      responsivenesseTechnique: 0,
      responsivenessSignature: 0,
      jesaScope: 0,
    })

    const count = vendors.length

    return {
      avgEcosystemScore: Math.round(sum.ecosystemScore / count),
      avgHseScore: Math.round(sum.hseScore / count),
      avgSustainabilityScore: Math.round(sum.sustainabilityScore / count),
      avgGlobalRiskLevel: Math.round(sum.globalRiskLevel / count),
      totalTraceFlags: sum.traceFlags,
      totalDbFlags: sum.dbFlags,
      avgResponseRate: Math.round(sum.responseRate / count),
      avgTechnicalValidation: Math.round(sum.technicalValidation / count),
      avgPriceCompetitiveness: Math.round(sum.priceCompetitiveness / count),
      totalSuccessfulAwards: sum.successfulAwards,
      avgAwardingRate: Math.round(sum.awardingRate / count),
      totalProjectsOngoing: sum.projectsOngoing,
      totalPackagesOngoing: sum.packagesOngoing,
      dependanceJesa: Math.round(sum.dependanceJesa / count),
      responsivenesseTechnique: Number((sum.responsivenesseTechnique / count).toFixed(1)),
      responsivenessSignature: Number((sum.responsivenessSignature / count).toFixed(1)),
      jesaScope: Math.round(sum.jesaScope / count),
    }
  }

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
    : calculateAggregateKPIs(filteredVendors)

  // Sample time series data for charts - now includes dependance JESA
  const caTimeData = selectedVendor
    ? selectedVendor.preAward.chiffreAffaire.map((value, index) => ({
      year: String(2022 + index),
      ca: value,
      dependance: selectedVendor.preAward.dependanceJesa,
    }))
    : [
      { year: "2022", ca: 8.5, dependance: 29 },
      { year: "2023", ca: 10.2, dependance: 28 },
      { year: "2024", ca: 12.8, dependance: 27 },
      { year: "2025", ca: 15.4, dependance: 26 },
      { year: "2026", ca: 18.2, dependance: displayKPIs.dependanceJesa },
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
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Showing KPIs for</p>
            <p className="font-semibold text-sm text-foreground">{selectedVendor.name}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedVendor(null)}
          className="text-muted-foreground hover:text-foreground h-8"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
    )
  )

  // Table View
  if (view === "table") {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="flex-1 overflow-auto">
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

  if (view === "overview") {
    return (
      <div className="space-y-3">
        {/* Gauge Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
            <GaugeChart
              value={displayKPIs.avgEcosystemScore}
              title="Ecosystem Score"
              size="md"
            />
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
            <GaugeChart
              value={displayKPIs.avgHseScore}
              title="HSE Score"
              size="md"
            />
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
            <GaugeChart
              value={displayKPIs.avgSustainabilityScore}
              title="Sustainability Score"
              size="md"
            />
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
            <GaugeChart
              value={100 - displayKPIs.avgGlobalRiskLevel}
              title="Global Risk Level"
              size="md"
            />
          </div>
        </div>

        {/* KPI Cards Row - Now 4 cards instead of 5 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            title="Tech Responsiveness"
            value={`${displayKPIs.responsivenesseTechnique} days`}
            icon={<Clock className="w-5 h-5" />}
            variant="yellow"
          />
          <KPICard
            title="Contract Signature"
            value={`${displayKPIs.responsivenessSignature} days`}
            icon={<FileText className="w-5 h-5" />}
            variant="orange"
          />
        </div>

        {/* Charts Row - 50/50 split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Trend Chart with dual Y-axis - 1/2 */}
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 flex flex-col justify-center h-[300px]">
            <h3 className="text-xs font-semibold text-foreground mb-3">
              {selectedVendor ? `CA & Dependance JESA - ${selectedVendor.name}` : "Avg CA & Dependance JESA"}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caTimeData} margin={{ left: 0, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  stroke="#3b82f6"
                  width={30}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  stroke="#f59e0b"
                  width={30}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconSize={10} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="ca"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="CA (M€)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="dependance"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", r: 4 }}
                  name="Dep. JESA (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Production vs Capacity Chart - 1/2 */}
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 flex flex-col justify-center h-[300px]">
            <h3 className="text-xs font-semibold text-foreground mb-3">
              {selectedVendor ? `Production vs Open Capacity (K units) - ${selectedVendor.name}` : "Production vs Open Capacity (K units)"}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityData} barGap={4} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" axisLine={{ stroke: '#e5e7eb' }} />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" axisLine={{ stroke: '#e5e7eb' }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}K units`, '']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="Production" fill="#3b82f6" name="Production" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Open Capacity" fill="#10b981" name="Open Capacity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  // Performance View (Pre-Award 2) - Optimized layout with 3-2-3 KPIs
  return (
    <div className="h-[calc(100vh-180px)] flex flex-col gap-4">
      {/* Top Row - 3 KPIs */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title={selectedVendor ? "Response Rate" : "Avg Response Rate"}
          value={`${displayKPIs.avgResponseRate}%`}
          icon={<Target className="w-6 h-6" />}
          variant="green"
        />
        <KPICard
          title="Tech Validation Ratio"
          value={`${displayKPIs.avgTechnicalValidation}%`}
          icon={<Shield className="w-6 h-6" />}
          variant="blue"
        />
        <KPICard
          title="Price Competitiveness"
          value={`${displayKPIs.avgPriceCompetitiveness}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="yellow"
        />
      </div>

      {/* Middle Row - 2 KPIs */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard
          title="Successful Awards"
          value={displayKPIs.totalSuccessfulAwards}
          icon={<Award className="w-6 h-6" />}
          variant="green"
        />
        <KPICard
          title={selectedVendor ? "Awarding Rate" : "Avg Awarding Rate"}
          value={`${displayKPIs.avgAwardingRate}%`}
          icon={<Percent className="w-6 h-6" />}
          variant="blue"
        />
      </div>

      {/* Bottom Row - 3 KPIs */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Projects Ongoing"
          value={displayKPIs.totalProjectsOngoing}
          icon={<FolderKanban className="w-6 h-6" />}
          variant="green"
        />
        <KPICard
          title="Packages Ongoing"
          value={displayKPIs.totalPackagesOngoing}
          icon={<Package className="w-6 h-6" />}
          variant="blue"
        />
        <KPICard
          title="JESA Scope %"
          value={`${displayKPIs.jesaScope}%`}
          icon={<Building2 className="w-6 h-6" />}
          variant="blue"
        />
      </div>
    </div>
  )
}