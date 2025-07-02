"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

type VMStatus = "Running" | "Idling" | "Terminated" | "Starting" | "Stopping"

interface VM {
  id: string
  name: string
  region: string
  status: VMStatus
  cpu: number
  memory: number
  storage: number
  ipAddress: string
}

interface RegionData {
  name: string
  country: string
  vmCount: number
  coordinates: { x: number; y: number }
  status: VMStatus[]
  vms: VM[]
}

interface WorldMapProps {
  vms: VM[]
}

export default function WorldMap({ vms }: WorldMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  // Group VMs by region with proper mapping
  const regionData: RegionData[] = [
    {
      name: "US East (N. Virginia)",
      country: "USA",
      coordinates: { x: 200, y: 150 },
      vmCount: 0,
      status: [],
      vms: [],
    },
    {
      name: "US West (Oregon)",
      country: "USA",
      coordinates: { x: 120, y: 130 },
      vmCount: 0,
      status: [],
      vms: [],
    },
    {
      name: "EU West (Ireland)",
      country: "Ireland",
      coordinates: { x: 420, y: 120 },
      vmCount: 0,
      status: [],
      vms: [],
    },
    {
      name: "EU Central (Frankfurt)",
      country: "Germany",
      coordinates: { x: 460, y: 130 },
      vmCount: 0,
      status: [],
      vms: [],
    },
    {
      name: "Asia Pacific (Tokyo)",
      country: "Japan",
      coordinates: { x: 720, y: 140 },
      vmCount: 0,
      status: [],
      vms: [],
    },
  ].map((region) => {
    const regionVMs = vms.filter((vm) => vm.region === region.name)
    return {
      ...region,
      vmCount: regionVMs.length,
      status: regionVMs.map((vm) => vm.status),
      vms: regionVMs,
    }
  })

  // Consistent status colors that work in both light and dark mode
  const getStatusColor = (status: VMStatus) => {
    switch (status) {
      case "Running":
        return "#22c55e" // Green-500
      case "Idling":
        return "#eab308" // Yellow-500
      case "Terminated":
        return "#ef4444" // Red-500
      case "Starting":
        return "#3b82f6" // Blue-500
      case "Stopping":
        return "#f97316" // Orange-500
      default:
        return "#6b7280" // Gray-500
    }
  }

  const getRegionColor = (region: RegionData) => {
    if (region.vmCount === 0) return "#6b7280"
    const hasRunning = region.status.includes("Running")
    const hasTerminated = region.status.includes("Terminated")
    if (hasRunning && !hasTerminated) return "#22c55e" // Green
    if (hasTerminated && !hasRunning) return "#ef4444" // Red
    return "#eab308" // Yellow for mixed
  }

  const getMarkerColor = (region: RegionData) => {
    if (region.vmCount === 0) return "#6b7280"
    const runningCount = region.status.filter((s) => s === "Running").length
    const totalCount = region.vmCount
    if (runningCount === totalCount) return "#22c55e" // All running
    if (runningCount === 0) return "#ef4444" // None running
    return "#eab308" // Mixed
  }

  const getStatusBadgeColor = (status: VMStatus) => {
    switch (status) {
      case "Running":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20"
      case "Idling":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
      case "Terminated":
        return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/20"
      case "Starting":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/20"
      case "Stopping":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/20"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 dark:hover:bg-gray-900/20"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Global VM Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full rounded-lg overflow-hidden bg-card border-border">
            <svg viewBox="0 0 800 400" className="w-full h-[400px]">
              <rect width="800" height="400" fill="hsl(var(--muted))" />

              {/* Simplified world continents */}
              <g>
                {/* North America */}
                <path
                  d="M50 100 L200 80 L250 120 L280 160 L260 200 L200 220 L150 200 L100 180 L60 140 Z"
                  fill={
                    regionData.some((r) => r.country === "USA" && r.vmCount > 0)
                      ? getRegionColor(regionData.find((r) => r.country === "USA")!)
                      : "#6b7280"
                  }
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  opacity={regionData.some((r) => r.country === "USA" && r.vmCount > 0) ? 0.6 : 0.3}
                />

                {/* Europe */}
                <path
                  d="M380 90 L480 85 L520 110 L510 140 L480 150 L420 145 L390 125 Z"
                  fill={
                    regionData.some((r) => (r.country === "Ireland" || r.country === "Germany") && r.vmCount > 0)
                      ? "#22c55e"
                      : "#6b7280"
                  }
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  opacity={
                    regionData.some((r) => (r.country === "Ireland" || r.country === "Germany") && r.vmCount > 0)
                      ? 0.6
                      : 0.3
                  }
                />

                {/* Asia */}
                <path
                  d="M520 80 L750 70 L780 100 L770 140 L750 170 L700 180 L650 170 L600 160 L550 150 L530 120 Z"
                  fill={
                    regionData.some((r) => r.country === "Japan" && r.vmCount > 0)
                      ? getRegionColor(regionData.find((r) => r.country === "Japan")!)
                      : "#6b7280"
                  }
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  opacity={regionData.some((r) => r.country === "Japan" && r.vmCount > 0) ? 0.6 : 0.3}
                />

                {/* Other continents */}
                <path
                  d="M200 250 L280 240 L300 280 L290 320 L270 350 L240 360 L210 340 L190 300 Z"
                  fill="#6b7280"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <path
                  d="M420 180 L520 170 L540 210 L530 250 L510 280 L480 290 L450 280 L430 250 L420 210 Z"
                  fill="#6b7280"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <path
                  d="M650 280 L720 275 L740 290 L730 310 L700 315 L670 310 L655 295 Z"
                  fill="#6b7280"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity="0.3"
                />
              </g>

              {/* VM Region Markers */}
              {regionData
                .filter((region) => region.vmCount > 0)
                .map((region, index) => (
                  <g key={index}>
                    <circle
                      cx={region.coordinates.x}
                      cy={region.coordinates.y}
                      r="12"
                      fill={getMarkerColor(region)}
                      opacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      cx={region.coordinates.x}
                      cy={region.coordinates.y}
                      r="6"
                      fill={getMarkerColor(region)}
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200 hover:r-8"
                      onMouseEnter={() => setHoveredRegion(region.name)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    />

                    {hoveredRegion === region.name && (
                      <g>
                        <rect
                          x={region.coordinates.x - 80}
                          y={region.coordinates.y - 45}
                          width="160"
                          height="35"
                          fill="hsl(var(--popover))"
                          stroke="hsl(var(--border))"
                          strokeWidth="1"
                          rx="6"
                          className="drop-shadow-lg"
                        />
                        <text
                          x={region.coordinates.x}
                          y={region.coordinates.y - 28}
                          textAnchor="middle"
                          fill="hsl(var(--popover-foreground))"
                          fontSize="12"
                          fontWeight="600"
                        >
                          {region.name}
                        </text>
                        <text
                          x={region.coordinates.x}
                          y={region.coordinates.y - 15}
                          textAnchor="middle"
                          fill="hsl(var(--muted-foreground))"
                          fontSize="10"
                        >
                          {region.vmCount} VM{region.vmCount !== 1 ? "s" : ""} •{" "}
                          {region.status.filter((s) => s === "Running").length} Running
                        </text>
                      </g>
                    )}
                  </g>
                ))}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Region Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {regionData
          .filter((region) => region.vmCount > 0)
          .map((region, index) => (
            <Card key={index} className="transition-all duration-200 hover:shadow-md border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{region.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {region.vmCount} VM{region.vmCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{region.country}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-background"
                    style={{ backgroundColor: getMarkerColor(region) }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {region.status.filter((s) => s === "Running").length} Running
                  </span>
                </div>
                {/* Show individual VM statuses */}
                <div className="flex flex-wrap gap-1">
                  {region.vms.map((vm) => (
                    <Badge key={vm.id} variant="secondary" className={`text-xs ${getStatusBadgeColor(vm.status)}`}>
                      {vm.name}: {vm.status}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
