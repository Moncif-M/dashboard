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
  Users,
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
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"

interface PostAwardPageProps {
  filters: FilterState
  view: "overview" | "table"
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

export function PostAwardPage({ filters, view }: PostAwardPageProps) {
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
        totalChangeRequests: 0,
        totalChangeRequestsMontant: 0,
        totalClaims: 0,
        totalNcrQor: 0,
        totalNcr: 0,
        totalQor: 0,
        avgNcrClosureTime: 0,
        avgScoreClosed: 0,
        totalAvenants: 0,
        avgAvenantPercentage: 0,
        totalContracts: 0,
        totalContractants: 0,
        avgReactivityLetters: 0,
        avgGuaranteeRenewalTime: 0,
        totalConcessionRequests: 0,
        avgDisciplineScores: {
          projectControl: 0,
          engineering: 0,
          contract: 0,
          cAndC: 0,
          pmqc: 0,
          construction: 0,
          material: 0,
        },
      }
    }

    const sum = vendors.reduce((acc, v) => ({
      changeRequests: acc.changeRequests + v.postAward.changeRequestsCount,
      changeRequestsMontant: acc.changeRequestsMontant + v.postAward.changeRequestsMontant,
      claims: acc.claims + v.postAward.claimsCount,
      ncrQor: acc.ncrQor + v.postAward.ncrQorCount,
      ncr: acc.ncr + v.postAward.ncrCount,
      qor: acc.qor + v.postAward.qorCount,
      ncrClosureTime: acc.ncrClosureTime + v.postAward.ncrClosureTime,
      scoreClosed: acc.scoreClosed + v.postAward.averageScoreClosed,
      avenants: acc.avenants + v.postAward.avenantCount,
      avenantPercentage: acc.avenantPercentage + v.postAward.avenantPercentage,
      contracts: acc.contracts + v.postAward.contractsCount,
      contractants: acc.contractants + v.postAward.contractantsCount,
      reactivityLetters: acc.reactivityLetters + v.postAward.reactivityLetters,
      guaranteeRenewalTime: acc.guaranteeRenewalTime + v.postAward.guaranteeRenewalTime,
      concessionRequests: acc.concessionRequests + v.postAward.concessionRequests,
      disciplineScores: {
        projectControl: acc.disciplineScores.projectControl + v.postAward.disciplineScores.projectControl,
        engineering: acc.disciplineScores.engineering + v.postAward.disciplineScores.engineering,
        contract: acc.disciplineScores.contract + v.postAward.disciplineScores.contract,
        cAndC: acc.disciplineScores.cAndC + v.postAward.disciplineScores.cAndC,
        pmqc: acc.disciplineScores.pmqc + v.postAward.disciplineScores.pmqc,
        construction: acc.disciplineScores.construction + v.postAward.disciplineScores.construction,
        material: acc.disciplineScores.material + v.postAward.disciplineScores.material,
      },
    }), {
      changeRequests: 0,
      changeRequestsMontant: 0,
      claims: 0,
      ncrQor: 0,
      ncr: 0,
      qor: 0,
      ncrClosureTime: 0,
      scoreClosed: 0,
      avenants: 0,
      avenantPercentage: 0,
      contracts: 0,
      contractants: 0,
      reactivityLetters: 0,
      guaranteeRenewalTime: 0,
      concessionRequests: 0,
      disciplineScores: {
        projectControl: 0,
        engineering: 0,
        contract: 0,
        cAndC: 0,
        pmqc: 0,
        construction: 0,
        material: 0,
      },
    })

    const count = vendors.length

    return {
      totalChangeRequests: sum.changeRequests,
      totalChangeRequestsMontant: sum.changeRequestsMontant,
      totalClaims: sum.claims,
      totalNcrQor: sum.ncrQor,
      totalNcr: sum.ncr,
      totalQor: sum.qor,
      avgNcrClosureTime: Math.round(sum.ncrClosureTime / count),
      avgScoreClosed: Math.round(sum.scoreClosed / count),
      totalAvenants: sum.avenants,
      avgAvenantPercentage: Math.round(sum.avenantPercentage / count),
      totalContracts: sum.contracts,
      totalContractants: sum.contractants,
      avgReactivityLetters: Math.round(sum.reactivityLetters / count),
      avgGuaranteeRenewalTime: Math.round(sum.guaranteeRenewalTime / count),
      totalConcessionRequests: sum.concessionRequests,
      avgDisciplineScores: {
        projectControl: Math.round(sum.disciplineScores.projectControl / count),
        engineering: Math.round(sum.disciplineScores.engineering / count),
        contract: Math.round(sum.disciplineScores.contract / count),
        cAndC: Math.round(sum.disciplineScores.cAndC / count),
        pmqc: Math.round(sum.disciplineScores.pmqc / count),
        construction: Math.round(sum.disciplineScores.construction / count),
        material: Math.round(sum.disciplineScores.material / count),
      },
    }
  }

  // Get KPIs - either from selected vendor or aggregate from filtered vendors
  const displayKPIs = selectedVendor
    ? {
      totalChangeRequests: selectedVendor.postAward.changeRequestsCount,
      totalChangeRequestsMontant: selectedVendor.postAward.changeRequestsMontant,
      totalClaims: selectedVendor.postAward.claimsCount,
      totalNcrQor: selectedVendor.postAward.ncrQorCount,
      totalNcr: selectedVendor.postAward.ncrCount,
      totalQor: selectedVendor.postAward.qorCount,
      avgNcrClosureTime: selectedVendor.postAward.ncrClosureTime,
      avgScoreClosed: selectedVendor.postAward.averageScoreClosed,
      totalAvenants: selectedVendor.postAward.avenantCount,
      avgAvenantPercentage: selectedVendor.postAward.avenantPercentage,
      totalContracts: selectedVendor.postAward.contractsCount,
      totalContractants: selectedVendor.postAward.contractantsCount,
      avgReactivityLetters: selectedVendor.postAward.reactivityLetters,
      avgGuaranteeRenewalTime: selectedVendor.postAward.guaranteeRenewalTime,
      totalConcessionRequests: selectedVendor.postAward.concessionRequests,
      avgDisciplineScores: selectedVendor.postAward.disciplineScores,
    }
    : calculateAggregateKPIs(filteredVendors)

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

  // Table View
  if (view === "table") {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="flex-1 overflow-auto">
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

  // Overview View
  return (
    <div className="h-[calc(100vh-180px)] flex flex-col gap-3">
      {/* Top KPI Cards - Fixed height */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
          title="NCR Count"
          value={displayKPIs.totalNcr}
          icon={<ClipboardList className="w-5 h-5" />}
          variant="yellow"
        />
        <KPICard
          title="QOR Count"
          value={displayKPIs.totalQor}
          icon={<ClipboardList className="w-5 h-5" />}
          variant="orange"
        />
        <KPICard
          title="Avg NCR Closure"
          value={`${displayKPIs.avgNcrClosureTime} days`}
          icon={<Clock className="w-5 h-5" />}
          variant="blue"
        />
      </div>

      {/* Second Row - Gauge and KPIs - Fixed height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Avenants Gauge */}
        <div className="bg-card rounded-xl p-3 shadow-sm border border-border/50 flex flex-col justify-center h-[160px]">
          <GaugeChart
            value={displayKPIs.avgAvenantPercentage}
            maxValue={50}
            title={selectedVendor ? `Avenant % vs Initial - ${selectedVendor.name}` : "Avg Avenant % vs Initial Contract"}
            size="sm"
            suffix="%"
          />
          <p className="text-xs text-center text-muted-foreground mt-2">Target: {"<"}15%</p>
        </div>

        {/* KPI Cards on the right - More compact grid */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
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
            title="Nb Contractants"
            value={displayKPIs.totalContractants}
            icon={<Users className="w-5 h-5" />}
            variant="blue"
          />
          <KPICard
            title="Letter Response"
            value={`${displayKPIs.avgReactivityLetters} days`}
            icon={<Mail className="w-5 h-5" />}
            variant="orange"
          />
          <KPICard
            title="Concession Requests"
            value={displayKPIs.totalConcessionRequests}
            icon={<GitPullRequest className="w-5 h-5" />}
            variant="orange"
          />
          <KPICard
            title="Guarantee Renewal"
            value={`${displayKPIs.avgGuaranteeRenewalTime} days`}
            icon={<Shield className="w-5 h-5" />}
            variant="yellow"
          />
        </div>
      </div>

      {/* Discipline Scores and Avg Score Closed Row - Fixed height */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-[280px]">
        {/* Discipline Scores - 3/4 */}
        <div className="lg:col-span-3 bg-card rounded-xl p-3 shadow-sm border border-border/50 flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex-shrink-0">
            Scores by Discipline
            {selectedVendor && <span className="text-primary ml-2">({selectedVendor.name})</span>}
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disciplineBarData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis type="category" dataKey="discipline" tick={{ fontSize: 10 }} stroke="#9ca3af" width={120} />
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
          </div>
        </div>

        {/* Avg Score Closed - 1/4 */}
        <div className="bg-card rounded-xl p-3 shadow-sm border border-border/50 flex flex-col justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <Star className="w-7 h-7 text-green-500" />
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Avg Score Closed
            </p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {displayKPIs.avgScoreClosed}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedVendor ? selectedVendor.name : 'All Vendors'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}