"use client"

import { useState } from "react"
import {
  FileWarning,
  AlertCircle,
  ClipboardList,
  Clock,
  Star,
  FileStack,
  Percent,
  FileCheck,
  Mail,
  Shield,
  GitPullRequest,
  X,
  User,
} from "lucide-react"
import { KPICard } from "../kpi-card"
import { GaugeChart } from "../gauge-chart"
import { VendorTable } from "../vendor-table"
import {
  type VendorWithKPIs,
  vendors as allVendors,
  getAggregatePostAwardKPIs,
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
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"

interface PostAwardPageProps {
  filters: FilterState
}

const DISCIPLINE_COLORS = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
}

function getScoreColor(score: number) {
  if (score >= 85) return DISCIPLINE_COLORS.green
  if (score >= 70) return DISCIPLINE_COLORS.yellow
  return DISCIPLINE_COLORS.red
}

export function PostAwardPage({ filters }: PostAwardPageProps) {
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

  const aggregateKPIs = getAggregatePostAwardKPIs()

  // Get KPIs - either from selected vendor or aggregate
  const displayKPIs = selectedVendor
    ? {
        totalChangeRequests: selectedVendor.postAward.changeRequestsCount,
        totalChangeRequestsMontant: selectedVendor.postAward.changeRequestsMontant,
        totalClaims: selectedVendor.postAward.claimsCount,
        totalNcrQor: selectedVendor.postAward.ncrQorCount,
        avgNcrClosureTime: selectedVendor.postAward.ncrClosureTime,
        avgScoreClosed: selectedVendor.postAward.averageScoreClosed,
        totalAvenants: selectedVendor.postAward.avenantCount,
        avgAvenantPercentage: selectedVendor.postAward.avenantPercentage,
        totalContracts: selectedVendor.postAward.contractsCount,
        avgReactivityLetters: selectedVendor.postAward.reactivityLetters,
        avgGuaranteeRenewalTime: selectedVendor.postAward.guaranteeRenewalTime,
        totalConcessionRequests: selectedVendor.postAward.concessionRequests,
        avgDisciplineScores: selectedVendor.postAward.disciplineScores,
      }
    : aggregateKPIs

  // Time series data for changes/claims
  const changeClaimsTimeData = selectedVendor
    ? [
        { month: "Jan", changes: Math.round(selectedVendor.postAward.changeRequestsCount * 0.12), claims: Math.round(selectedVendor.postAward.claimsCount * 0.1) },
        { month: "Feb", changes: Math.round(selectedVendor.postAward.changeRequestsCount * 0.15), claims: Math.round(selectedVendor.postAward.claimsCount * 0.15) },
        { month: "Mar", changes: Math.round(selectedVendor.postAward.changeRequestsCount * 0.1), claims: Math.round(selectedVendor.postAward.claimsCount * 0.1) },
        { month: "Apr", changes: Math.round(selectedVendor.postAward.changeRequestsCount * 0.2), claims: Math.round(selectedVendor.postAward.claimsCount * 0.25) },
        { month: "May", changes: Math.round(selectedVendor.postAward.changeRequestsCount * 0.18), claims: Math.round(selectedVendor.postAward.claimsCount * 0.2) },
        { month: "Jun", changes: Math.round(selectedVendor.postAward.changeRequestsCount * 0.25), claims: Math.round(selectedVendor.postAward.claimsCount * 0.2) },
      ]
    : [
        { month: "Jan", changes: 12, claims: 4 },
        { month: "Feb", changes: 15, claims: 6 },
        { month: "Mar", changes: 10, claims: 3 },
        { month: "Apr", changes: 18, claims: 8 },
        { month: "May", changes: 14, claims: 5 },
        { month: "Jun", changes: 20, claims: 7 },
      ]

  // Discipline scores bar chart data
  const disciplineBarData = [
    { discipline: "Project Control", score: displayKPIs.avgDisciplineScores.projectControl },
    { discipline: "Engineering", score: displayKPIs.avgDisciplineScores.engineering },
    { discipline: "Contract", score: displayKPIs.avgDisciplineScores.contract },
    { discipline: "C&C", score: displayKPIs.avgDisciplineScores.cAndC },
    { discipline: "PMQC", score: displayKPIs.avgDisciplineScores.pmqc },
    { discipline: "Construction", score: displayKPIs.avgDisciplineScores.construction },
    { discipline: "Material", score: displayKPIs.avgDisciplineScores.material },
  ]

  // Avenants time series data
  const avenantsTimeData = selectedVendor
    ? [
        { quarter: "Q1", count: selectedVendor.postAward.avenantCountQ1, percentage: selectedVendor.postAward.avenantPercentageQ1 },
        { quarter: "Q2", count: selectedVendor.postAward.avenantCountQ2, percentage: selectedVendor.postAward.avenantPercentageQ2 },
        { quarter: "Q3", count: selectedVendor.postAward.avenantCountQ3, percentage: selectedVendor.postAward.avenantPercentageQ3 },
        { quarter: "Q4", count: selectedVendor.postAward.avenantCountQ4, percentage: selectedVendor.postAward.avenantPercentageQ4 },
      ]
    : [
        { quarter: "Q1", count: 10, percentage: 12 },
        { quarter: "Q2", count: 15, percentage: 18 },
        { quarter: "Q3", count: 12, percentage: 14 },
        { quarter: "Q4", count: 18, percentage: 20 },
      ]

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

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Total Change Requests"
          value={displayKPIs.totalChangeRequests}
          icon={<FileWarning className="w-5 h-5" />}
          variant="yellow"
        />
        <KPICard
          title="Change Requests Value"
          value={`${(displayKPIs.totalChangeRequestsMontant / 1000).toFixed(0)}K€`}
          icon={<FileStack className="w-5 h-5" />}
          variant="orange"
        />
        <KPICard
          title="Total Claims"
          value={displayKPIs.totalClaims}
          icon={<AlertCircle className="w-5 h-5" />}
          variant="red"
        />
        <KPICard
          title="NCR/QOR Count"
          value={displayKPIs.totalNcrQor}
          icon={<ClipboardList className="w-5 h-5" />}
          variant="yellow"
        />
        <KPICard
          title="Avg NCR Closure"
          value={`${displayKPIs.avgNcrClosureTime} days`}
          icon={<Clock className="w-5 h-5" />}
          variant="blue"
        />
        <KPICard
          title="Avg Score Closed"
          value={displayKPIs.avgScoreClosed}
          icon={<Star className="w-5 h-5" />}
          variant="green"
        />
      </div>

      {/* Second Row KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Avenants"
          value={displayKPIs.totalAvenants}
          icon={<FileStack className="w-5 h-5" />}
          variant="yellow"
        />
        <KPICard
          title="Total Contracts"
          value={displayKPIs.totalContracts}
          icon={<FileCheck className="w-5 h-5" />}
          variant="green"
        />
        <KPICard
          title="Letter Response"
          value={`${displayKPIs.avgReactivityLetters} days`}
          icon={<Mail className="w-5 h-5" />}
          variant="blue"
        />
        <KPICard
          title="Guarantee Renewal"
          value={`${displayKPIs.avgGuaranteeRenewalTime} days`}
          icon={<Shield className="w-5 h-5" />}
          variant="yellow"
        />
        <KPICard
          title="Concession Requests"
          value={displayKPIs.totalConcessionRequests}
          icon={<GitPullRequest className="w-5 h-5" />}
          variant="orange"
        />
      </div>

      {/* Avenants Gauge */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 max-w-xs">
        <GaugeChart
          value={displayKPIs.avgAvenantPercentage}
          maxValue={50}
          title={selectedVendor ? `Avenant % vs Initial - ${selectedVendor.name}` : "Avg Avenant % vs Initial Contract"}
          size="md"
          suffix="%"
        />
        <p className="text-xs text-center text-muted-foreground mt-2">Target: {"<"}15%</p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Change Requests & Claims Over Time */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Change Requests & Claims Over Time
            {selectedVendor && <span className="text-primary ml-2">({selectedVendor.name})</span>}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={changeClaimsTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="changes"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Change Requests"
                dot={{ fill: "#f59e0b", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="claims"
                stroke="#ef4444"
                strokeWidth={2}
                name="Claims"
                dot={{ fill: "#ef4444", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Discipline Scores Bar Chart */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Scores by Discipline
            {selectedVendor && <span className="text-primary ml-2">({selectedVendor.name})</span>}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={disciplineBarData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="discipline" tick={{ fontSize: 10 }} stroke="#9ca3af" width={90} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, "Score"]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey="score" 
                radius={[0, 4, 4, 0]}
                name="Score"
              >
                {disciplineBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">{"≥"}85% (Good)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">70-84% (Average)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">{"<"}70% (Poor)</span>
            </div>
          </div>
        </div>
      </div>

      

      {/* Vendor Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Vendor List - Post-Award Performance</h3>
          <p className="text-sm text-muted-foreground">
            {filteredVendors.length} vendors found
            {selectedVendor && (
              <span className="text-primary ml-2">- Click on a vendor to filter KPIs</span>
            )}
            {!selectedVendor && (
              <span className="text-muted-foreground ml-2">- Click on a vendor to filter KPIs</span>
            )}
          </p>
        </div>
        <VendorTable
          vendors={filteredVendors}
          type="post-award"
          selectedVendorId={selectedVendor?.id}
          onSelectVendor={setSelectedVendor}
        />
      </div>
    </div>
  )
}
