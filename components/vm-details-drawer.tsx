"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Globe, Server, Cpu, HardDrive, MemoryStick, Clock } from "lucide-react"

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

interface VMDetailsDrawerProps {
  vm: VM | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (vmId: string) => void
}

export function VMDetailsDrawer({ vm, open, onOpenChange, onDelete }: VMDetailsDrawerProps) {
  if (!vm) return null

  const getStatusColor = (status: VMStatus) => {
    switch (status) {
      case "Running":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
      case "Idling":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "Terminated":
        return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
      case "Starting":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
      case "Stopping":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getResourceColor = (usage: number) => {
    if (usage >= 80) return "hsl(var(--destructive))"
    if (usage >= 60) return "hsl(var(--chart-3))"
    return "hsl(var(--chart-1))"
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] border-0 flex flex-col">
        <DrawerHeader className="text-left flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {vm.name}
          </DrawerTitle>
          <DrawerDescription>Virtual machine details and configuration</DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 pb-6">
            {/* Status and Basic Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Status & Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="secondary" className={getStatusColor(vm.status)}>
                    {vm.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Region</span>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{vm.region}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IP Address</span>
                  <code className="text-sm bg-background px-2 py-1 rounded">{vm.ipAddress}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">VM ID</span>
                  <code className="text-sm bg-background px-2 py-1 rounded">{vm.id}</code>
                </div>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Resource Usage
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">CPU</span>
                    </div>
                    <span className="text-sm font-medium">{vm.cpu}%</span>
                  </div>
                  <Progress
                    value={vm.cpu}
                    className="h-2"
                    style={{ "--progress-background": getResourceColor(vm.cpu) } as React.CSSProperties}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Memory</span>
                    </div>
                    <span className="text-sm font-medium">{vm.memory}%</span>
                  </div>
                  <Progress
                    value={vm.memory}
                    className="h-2"
                    style={{ "--progress-background": getResourceColor(vm.memory) } as React.CSSProperties}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Storage</span>
                    </div>
                    <span className="text-sm font-medium">{vm.storage}%</span>
                  </div>
                  <Progress
                    value={vm.storage}
                    className="h-2"
                    style={{ "--progress-background": getResourceColor(vm.storage) } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>

            {/* Timestamps */}
            {(vm.createdAt || vm.updatedAt) && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timestamps
                </h3>
                <div className="space-y-3">
                  {vm.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="text-sm">{new Date(vm.createdAt).toLocaleString()}</span>
                    </div>
                  )}
                  {vm.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Updated</span>
                      <span className="text-sm">{new Date(vm.updatedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  disabled={vm.status !== "Running"}
                >
                  Connect via SSH
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Download Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Create Snapshot
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${vm.name}? This action cannot be undone.`)) {
                      onDelete?.(vm.id)
                    }
                  }}
                >
                  Delete VM
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
