"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronDown,
  Globe,
  MoreHorizontal,
  Play,
  Square,
  Trash2,
  RefreshCw,
  AlertCircle,
  Database,
  Eye,
  FileText,
  Terminal,
  Copy,
} from "lucide-react"
import { useState } from "react"
import Navigation from "./components/navigation"
import WorldMap from "./components/world-map"
import { VMDetailsDrawer } from "./components/vm-details-drawer"
import { VMLogsDrawer } from "./components/vm-logs-drawer"
import { VMSSHDrawer } from "./components/vm-ssh-drawer"
import { VMCloneDrawer } from "./components/vm-clone-drawer"
import { useVMs } from "./hooks/use-vms"

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
  createdAt?: string
  updatedAt?: string
}

export default function Component() {
  const { vms, loading, error, usingFallback, updateVMStatus, fetchVMs, createVM, deleteVM } = useVMs()
  const [currentView, setCurrentView] = useState<"table" | "map">("table")
  const [updatingVMs, setUpdatingVMs] = useState<Set<string>>(new Set())

  // Drawer states
  const [selectedVM, setSelectedVM] = useState<VM | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [logsOpen, setLogsOpen] = useState(false)
  const [sshOpen, setSSHOpen] = useState(false)
  const [cloneOpen, setCloneOpen] = useState(false)

  const getStatusColor = (status: VMStatus) => {
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

  const handleUpdateVMStatus = async (vmId: string, newStatus: VMStatus) => {
    setUpdatingVMs((prev) => new Set(prev).add(vmId))
    try {
      await updateVMStatus(vmId, newStatus)
    } finally {
      setUpdatingVMs((prev) => {
        const newSet = new Set(prev)
        newSet.delete(vmId)
        return newSet
      })
    }
  }

  const getResourceColor = (usage: number) => {
    if (usage >= 80) return "hsl(var(--destructive))"
    if (usage >= 60) return "hsl(var(--chart-3))"
    return "hsl(var(--chart-1))"
  }

  const openDrawer = (vm: VM, type: "details" | "logs" | "ssh" | "clone") => {
    setSelectedVM(vm)
    switch (type) {
      case "details":
        setDetailsOpen(true)
        break
      case "logs":
        setLogsOpen(true)
        break
      case "ssh":
        setSSHOpen(true)
        break
      case "clone":
        setCloneOpen(true)
        break
    }
  }

  const runningVMs = vms.filter((vm) => vm.status === "Running").length
  const totalVMs = vms.length

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading VMs...</span>
        </div>
      </div>
    )
  }

  const renderTableView = () => (
    <>
      {/* Show fallback warning */}
      {usingFallback && (
        <Alert className="mb-6">
          <Database className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Using demo data. Database connection failed: {error}</span>
            <Button variant="outline" size="sm" onClick={fetchVMs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Show error without fallback */}
      {error && !usingFallback && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchVMs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VMs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVMs}</div>
            {usingFallback && <p className="text-xs text-muted-foreground mt-1">Demo data</p>}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{runningVMs}</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(vms.map((vm) => vm.region)).size}</div>
          </CardContent>
        </Card>
      </div>

      {/* VMs Table */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Virtual Machines</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchVMs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="border-border">Name</TableHead>
                <TableHead className="border-border">Region</TableHead>
                <TableHead className="border-border">Status</TableHead>
                <TableHead className="border-border">Resource Usage</TableHead>
                <TableHead className="border-border">IP Address</TableHead>
                <TableHead className="text-right border-border">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vms.map((vm) => (
                <TableRow key={vm.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium border-border">{vm.name}</TableCell>
                  <TableCell className="border-border">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{vm.region}</span>
                    </div>
                  </TableCell>
                  <TableCell className="border-border">
                    <Badge variant="secondary" className={getStatusColor(vm.status)}>
                      {vm.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-border">
                    <div className="space-y-3 min-w-[200px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">CPU</span>
                          <span className="font-medium">{vm.cpu}%</span>
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
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Memory</span>
                          <span className="font-medium">{vm.memory}%</span>
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
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Storage</span>
                          <span className="font-medium">{vm.storage}%</span>
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
                    </div>
                  </TableCell>
                  <TableCell className="border-border">
                    <code className="text-sm bg-muted/50 px-2 py-1 rounded">{vm.ipAddress}</code>
                  </TableCell>
                  <TableCell className="text-right border-border">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" disabled={updatingVMs.has(vm.id)}>
                            {updatingVMs.has(vm.id) ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <>
                                Change Status
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-border">
                          <DropdownMenuItem
                            onClick={() => handleUpdateVMStatus(vm.id, "Running")}
                            disabled={vm.status === "Running"}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Start
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateVMStatus(vm.id, "Idling")}
                            disabled={vm.status === "Idling"}
                          >
                            <Square className="mr-2 h-4 w-4" />
                            Idle
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateVMStatus(vm.id, "Stopping")}
                            disabled={vm.status === "Terminated" || vm.status === "Stopping"}
                          >
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateVMStatus(vm.id, "Terminated")}
                            disabled={vm.status === "Terminated"}
                            className="text-destructive focus:text-destructive"
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
                        <DropdownMenuContent align="end" className="border-border">
                          <DropdownMenuItem onClick={() => openDrawer(vm, "details")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDrawer(vm, "logs")}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDrawer(vm, "ssh")}>
                            <Terminal className="mr-2 h-4 w-4" />
                            Connect SSH
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDrawer(vm, "clone")}>
                            <Copy className="mr-2 h-4 w-4" />
                            Clone VM
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )

  const renderCurrentView = () => {
    switch (currentView) {
      case "table":
        return renderTableView()
      case "map":
        return <WorldMap vms={vms} />
      default:
        return renderTableView()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        {renderCurrentView()}
      </div>

      {/* Drawers */}
      <VMDetailsDrawer
        vm={selectedVM}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onDelete={async (vmId) => {
          try {
            await deleteVM(vmId)
            setDetailsOpen(false)
            // Refresh the list
            await fetchVMs()
          } catch (error) {
            console.error("Failed to delete VM:", error)
          }
        }}
      />
      <VMLogsDrawer vm={selectedVM} open={logsOpen} onOpenChange={setLogsOpen} />
      <VMSSHDrawer vm={selectedVM} open={sshOpen} onOpenChange={setSSHOpen} />
      <VMCloneDrawer
        vm={selectedVM}
        open={cloneOpen}
        onOpenChange={setCloneOpen}
        onClone={async (vmData) => {
          try {
            await createVM(vmData)
            setCloneOpen(false)
            // Refresh the list
            await fetchVMs()
          } catch (error) {
            console.error("Failed to clone VM:", error)
          }
        }}
      />
    </div>
  )
}
