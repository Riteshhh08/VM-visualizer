"use client"

import type React from "react"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, Globe, MoreHorizontal, Play, Square, Trash2 } from "lucide-react"
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

const initialVMs: VM[] = [
  {
    id: "vm-001",
    name: "web-server-prod",
    region: "US East (N. Virginia)",
    status: "Running",
    cpu: 75,
    memory: 68,
    storage: 45,
    ipAddress: "54.123.45.67",
  },
  {
    id: "vm-002",
    name: "database-primary",
    region: "EU West (Ireland)",
    status: "Running",
    cpu: 45,
    memory: 82,
    storage: 67,
    ipAddress: "34.245.78.90",
  },
  {
    id: "vm-003",
    name: "api-gateway",
    region: "Asia Pacific (Tokyo)",
    status: "Idling",
    cpu: 12,
    memory: 25,
    storage: 23,
    ipAddress: "13.114.56.78",
  },
  {
    id: "vm-004",
    name: "backup-server",
    region: "US West (Oregon)",
    status: "Terminated",
    cpu: 0,
    memory: 0,
    storage: 89,
    ipAddress: "52.89.123.45",
  },
  {
    id: "vm-005",
    name: "dev-environment",
    region: "EU Central (Frankfurt)",
    status: "Starting",
    cpu: 35,
    memory: 40,
    storage: 15,
    ipAddress: "18.195.67.89",
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="outline" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function Component() {
  const [vms, setVMs] = useState<VM[]>(initialVMs)

  const getStatusColor = (status: VMStatus) => {
    switch (status) {
      case "Running":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Idling":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Terminated":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Starting":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Stopping":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const updateVMStatus = (vmId: string, newStatus: VMStatus) => {
    setVMs(vms.map((vm) => (vm.id === vmId ? { ...vm, status: newStatus } : vm)))
  }

  const getResourceColor = (usage: number) => {
    if (usage >= 80) return "bg-red-500"
    if (usage >= 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  const runningVMs = vms.filter((vm) => vm.status === "Running").length
  const totalVMs = vms.length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">VM Visualizer</h1>
            <p className="text-muted-foreground">Monitor and manage your virtual machines across different regions</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VMs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVMs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{runningVMs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Virtual Machines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resource Usage</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vms.map((vm) => (
                  <TableRow key={vm.id}>
                    <TableCell className="font-medium">{vm.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {vm.region}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(vm.status)}>
                        {vm.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 min-w-[200px]">
                        <div className="flex items-center justify-between text-sm">
                          <span>CPU</span>
                          <span>{vm.cpu}%</span>
                        </div>
                        <Progress
                          value={vm.cpu}
                          className="h-2"
                          style={
                            {
                              "--progress-background": getResourceColor(vm.cpu),
                            } as React.CSSProperties
                          }
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span>Memory</span>
                          <span>{vm.memory}%</span>
                        </div>
                        <Progress
                          value={vm.memory}
                          className="h-2"
                          style={
                            {
                              "--progress-background": getResourceColor(vm.memory),
                            } as React.CSSProperties
                          }
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span>Storage</span>
                          <span>{vm.storage}%</span>
                        </div>
                        <Progress
                          value={vm.storage}
                          className="h-2"
                          style={
                            {
                              "--progress-background": getResourceColor(vm.storage),
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{vm.ipAddress}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Change Status
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => updateVMStatus(vm.id, "Running")}
                              disabled={vm.status === "Running"}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Start
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateVMStatus(vm.id, "Idling")}
                              disabled={vm.status === "Idling"}
                            >
                              <Square className="mr-2 h-4 w-4" />
                              Idle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateVMStatus(vm.id, "Stopping")}
                              disabled={vm.status === "Terminated" || vm.status === "Stopping"}
                            >
                              <Square className="mr-2 h-4 w-4" />
                              Stop
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateVMStatus(vm.id, "Terminated")}
                              disabled={vm.status === "Terminated"}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Terminate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View Logs</DropdownMenuItem>
                            <DropdownMenuItem>Connect SSH</DropdownMenuItem>
                            <DropdownMenuItem>Clone VM</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
