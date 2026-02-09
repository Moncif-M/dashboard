"use client"

import React from "react"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type VendorWithKPIs,
  getPerformanceLevel,
  getInversePerformanceLevel,
  kpiThresholds,
} from "@/lib/vendor-data"
import { PerformanceCell, StatusBadge } from "./status-badge"

type SortDirection = "asc" | "desc" | null
type SortField = string | null

interface VendorTableProps {
  vendors: VendorWithKPIs[]
  type: "pre-award" | "post-award" | "material"
  selectedVendorId?: string | null
  onSelectVendor?: (vendor: VendorWithKPIs | null) => void
}

export function VendorTable({ vendors, type, selectedVendorId, onSelectVendor }: VendorTableProps) {
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleRowClick = (vendor: VendorWithKPIs) => {
    onSelectVendor?.(selectedVendorId === vendor.id ? null : vendor)
  }

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th
      className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <span className="flex flex-col">
          <ChevronUp
            className={cn(
              "w-3 h-3 -mb-1",
              sortField === field && sortDirection === "asc" ? "text-primary" : "text-muted-foreground/40"
            )}
          />
          <ChevronDown
            className={cn(
              "w-3 h-3",
              sortField === field && sortDirection === "desc" ? "text-primary" : "text-muted-foreground/40"
            )}
          />
        </span>
      </div>
    </th>
  )

  const sortedVendors = [...vendors].sort((a, b) => {
    if (!sortField || !sortDirection) return 0
    
    const getNestedValue = (obj: VendorWithKPIs, path: string): number | string => {
      const parts = path.split(".")
      let result: unknown = obj
      for (const part of parts) {
        result = (result as Record<string, unknown>)[part]
      }
      return result as number | string
    }

    const aVal = getNestedValue(a, sortField)
    const bVal = getNestedValue(b, sortField)

    if (typeof aVal === "string") {
      return sortDirection === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal)
    }
    return sortDirection === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  })

  const getRowClassName = (vendorId: string) => cn(
    "hover:bg-muted/20 transition-colors cursor-pointer",
    selectedVendorId === vendorId && "bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/30"
  )

  if (type === "pre-award") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <SortHeader field="name">Vendor</SortHeader>
              <SortHeader field="tiering">Tier</SortHeader>
              <SortHeader field="region">Region</SortHeader>
              <SortHeader field="preAward.ecosystemScore">Ecosystem</SortHeader>
              <SortHeader field="preAward.hseScore">HSE</SortHeader>
              <SortHeader field="preAward.sustainabilityScore">Sustainability</SortHeader>
              <SortHeader field="preAward.globalRiskLevel">Risk Level</SortHeader>
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Trace</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{"D&B"}</th>
              <SortHeader field="preAward.responseRate">Response Rate</SortHeader>
              <SortHeader field="preAward.technicalValidationRatio">Tech Validation</SortHeader>
              <SortHeader field="preAward.priceCompetitiveness">Price Comp.</SortHeader>
              <SortHeader field="preAward.awardingRate">Award Rate</SortHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedVendors.map((vendor) => (
              <tr 
                key={vendor.id} 
                className={getRowClassName(vendor.id)}
                onClick={() => handleRowClick(vendor)}
              >
                <td className="px-3 py-3">
                  <div>
                    <p className="font-medium text-foreground">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">{vendor.category}</p>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-muted font-medium">{vendor.tiering}</span>
                </td>
                <td className="px-3 py-3 text-sm text-muted-foreground">{vendor.region}</td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.preAward.ecosystemScore}
                    level={getPerformanceLevel(vendor.preAward.ecosystemScore, kpiThresholds.ecosystemScore)}
                    suffix="%"
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.preAward.hseScore}
                    level={getPerformanceLevel(vendor.preAward.hseScore, kpiThresholds.hseScore)}
                    suffix="%"
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.preAward.sustainabilityScore}
                    level={getPerformanceLevel(vendor.preAward.sustainabilityScore, kpiThresholds.sustainabilityScore)}
                    suffix="%"
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.preAward.globalRiskLevel}
                    level={getInversePerformanceLevel(vendor.preAward.globalRiskLevel, kpiThresholds.globalRiskLevel)}
                    suffix="%"
                  />
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={vendor.preAward.traceReport.status} size="sm" />
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={vendor.preAward.dbScore.status} size="sm" />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.preAward.responseRate}
                    level={getPerformanceLevel(vendor.preAward.responseRate, kpiThresholds.responseRate)}
                    suffix="%"
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.preAward.technicalValidationRatio}
                    level={getPerformanceLevel(vendor.preAward.technicalValidationRatio, kpiThresholds.technicalValidationRatio)}
                    suffix="%"
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.preAward.priceCompetitiveness}
                    level={getPerformanceLevel(vendor.preAward.priceCompetitiveness, kpiThresholds.priceCompetitiveness)}
                    suffix="%"
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.preAward.awardingRate}
                    level={getPerformanceLevel(vendor.preAward.awardingRate, kpiThresholds.awardingRate)}
                    suffix="%"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (type === "post-award") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <SortHeader field="name">Vendor</SortHeader>
              <SortHeader field="tiering">Tier</SortHeader>
              <SortHeader field="postAward.changeRequestsCount">Change Req.</SortHeader>
              <SortHeader field="postAward.claimsCount">Claims</SortHeader>
              <SortHeader field="postAward.ncrQorCount">NCR/QOR</SortHeader>
              <SortHeader field="postAward.ncrClosureTime">NCR Closure (days)</SortHeader>
              <SortHeader field="postAward.averageScoreClosed">Avg Score</SortHeader>
              <SortHeader field="postAward.avenantCount">Avenants</SortHeader>
              <SortHeader field="postAward.avenantPercentage">Avenant %</SortHeader>
              <SortHeader field="postAward.contractsCount">Contracts</SortHeader>
              <SortHeader field="postAward.reactivityLetters">Letter Response (days)</SortHeader>
              <SortHeader field="postAward.guaranteeRenewalTime">Guarantee Renewal</SortHeader>
              <SortHeader field="postAward.concessionRequests">Concessions</SortHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedVendors.map((vendor) => (
              <tr 
                key={vendor.id} 
                className={getRowClassName(vendor.id)}
                onClick={() => handleRowClick(vendor)}
              >
                <td className="px-3 py-3">
                  <div>
                    <p className="font-medium text-foreground">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">{vendor.category}</p>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-muted font-medium">{vendor.tiering}</span>
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.postAward.changeRequestsCount}
                    level={getInversePerformanceLevel(vendor.postAward.changeRequestsCount, kpiThresholds.changeRequestsCount)}
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.postAward.claimsCount}
                    level={getInversePerformanceLevel(vendor.postAward.claimsCount, kpiThresholds.claimsCount)}
                  />
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm font-medium">{vendor.postAward.ncrQorCount}</span>
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.postAward.ncrClosureTime}
                    level={getInversePerformanceLevel(vendor.postAward.ncrClosureTime, kpiThresholds.ncrClosureTime)}
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.postAward.averageScoreClosed}
                    level={getPerformanceLevel(vendor.postAward.averageScoreClosed, kpiThresholds.averageScoreClosed)}
                  />
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm font-medium">{vendor.postAward.avenantCount}</span>
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.postAward.avenantPercentage}
                    level={getInversePerformanceLevel(vendor.postAward.avenantPercentage, kpiThresholds.avenantPercentage)}
                    suffix="%"
                  />
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm font-medium">{vendor.postAward.contractsCount}</span>
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.postAward.reactivityLetters}
                    level={getInversePerformanceLevel(vendor.postAward.reactivityLetters, kpiThresholds.reactivityLetters)}
                  />
                </td>
                <td className="px-3 py-3">
                  <PerformanceCell
                    value={vendor.postAward.guaranteeRenewalTime}
                    level={getInversePerformanceLevel(vendor.postAward.guaranteeRenewalTime, kpiThresholds.guaranteeRenewalTime)}
                  />
                </td>
                <td className="px-3 py-3">
                  <span className="text-sm font-medium">{vendor.postAward.concessionRequests}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Material Management table
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            <SortHeader field="name">Vendor</SortHeader>
            <SortHeader field="tiering">Tier</SortHeader>
            <SortHeader field="materialManagement.otifScore">OTIF Score</SortHeader>
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Planned</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Actual</th>
            <SortHeader field="materialManagement.compliancePercent">Compliance %</SortHeader>
            <SortHeader field="materialManagement.qualityScore">Quality Score</SortHeader>
            <SortHeader field="materialManagement.ncrProcessFlow">NCR Process</SortHeader>
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Over</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Short</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Damaged</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedVendors.map((vendor) => (
            <tr 
              key={vendor.id} 
              className={getRowClassName(vendor.id)}
              onClick={() => handleRowClick(vendor)}
            >
              <td className="px-3 py-3">
                <div>
                  <p className="font-medium text-foreground">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">{vendor.category}</p>
                </div>
              </td>
              <td className="px-3 py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-muted font-medium">{vendor.tiering}</span>
              </td>
              <td className="px-3 py-3">
                <PerformanceCell
                  value={vendor.materialManagement.otifScore}
                  level={getPerformanceLevel(vendor.materialManagement.otifScore, kpiThresholds.otifScore)}
                  suffix="%"
                />
              </td>
              <td className="px-3 py-3">
                <span className="text-sm font-medium">{vendor.materialManagement.plannedVsActual.planned.toLocaleString()}</span>
              </td>
              <td className="px-3 py-3">
                <span className="text-sm font-medium">{vendor.materialManagement.plannedVsActual.actual.toLocaleString()}</span>
              </td>
              <td className="px-3 py-3">
                <PerformanceCell
                  value={vendor.materialManagement.compliancePercent}
                  level={getPerformanceLevel(vendor.materialManagement.compliancePercent, kpiThresholds.compliancePercent)}
                  suffix="%"
                />
              </td>
              <td className="px-3 py-3">
                <PerformanceCell
                  value={vendor.materialManagement.qualityScore}
                  level={getPerformanceLevel(vendor.materialManagement.qualityScore, kpiThresholds.qualityScore)}
                  suffix="%"
                />
              </td>
              <td className="px-3 py-3">
                <PerformanceCell
                  value={vendor.materialManagement.ncrProcessFlow}
                  level={getPerformanceLevel(vendor.materialManagement.ncrProcessFlow, kpiThresholds.ncrProcessFlow)}
                  suffix="%"
                />
              </td>
              <td className="px-3 py-3">
                <span className="text-sm font-medium text-amber-600">{vendor.materialManagement.osdData.over}</span>
              </td>
              <td className="px-3 py-3">
                <span className="text-sm font-medium text-red-600">{vendor.materialManagement.osdData.short}</span>
              </td>
              <td className="px-3 py-3">
                <span className="text-sm font-medium text-red-600">{vendor.materialManagement.osdData.damaged}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
