"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Server, Settings } from "lucide-react"
import { useState } from "react"

interface VM {
  id: string
  name: string
  region: string
  status: string
  cpu: number
  memory: number
  storage: number
}

interface VMCloneDrawerProps {
  vm: VM | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onClone?: (vmData: any) => void
}

export function VMCloneDrawer({ vm, open, onOpenChange, onClone }: VMCloneDrawerProps) {
  const [cloneName, setCloneName] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [includeData, setIncludeData] = useState(true)
  const [autoStart, setAutoStart] = useState(false)

  if (!vm) return null

  const regions = [
    "US East (N. Virginia)",
    "US West (Oregon)",
    "EU West (Ireland)",
    "EU Central (Frankfurt)",
    "Asia Pacific (Tokyo)",
  ]

  const handleClone = async () => {
    if (!cloneName || !selectedRegion) return

    try {
      // Create new VM with cloned data
      const newVM = {
        name: cloneName,
        region: selectedRegion,
        status: autoStart ? "Starting" : "Terminated",
        cpu: Math.floor(Math.random() * 30) + 10, // Random initial values
        memory: Math.floor(Math.random() * 40) + 20,
        storage: Math.floor(Math.random() * 50) + 30,
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      }

      // Call the onClone prop to actually create the VM
      await onClone?.(newVM)

      // Reset form
      setCloneName("")
      setSelectedRegion("")
      setIncludeData(true)
      setAutoStart(false)
    } catch (error) {
      console.error("Failed to clone VM:", error)
      alert("Failed to clone VM. Please try again.")
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] border-0 flex flex-col">
        <DrawerHeader className="text-left flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Clone VM - {vm.name}
          </DrawerTitle>
          <DrawerDescription>Create a copy of this virtual machine with custom settings</DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 pb-6">
            {/* Source VM Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Server className="h-4 w-4" />
                Source VM
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{vm.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Region</span>
                  <span className="text-sm">{vm.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant="secondary"
                    className={
                      vm.status === "Running"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                    }
                  >
                    {vm.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Clone Configuration */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Clone Configuration
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clone-name">VM Name</Label>
                  <Input
                    id="clone-name"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    placeholder={`${vm.name}-clone`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clone-region">Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="border-border">
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea placeholder="Enter a description for the cloned VM..." className="min-h-[60px]" />
                </div>
              </div>
            </div>

            {/* Clone Options */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Clone Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Data</Label>
                    <p className="text-xs text-muted-foreground">Copy all files and data from the source VM</p>
                  </div>
                  <Switch checked={includeData} onCheckedChange={setIncludeData} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Start</Label>
                    <p className="text-xs text-muted-foreground">Automatically start the VM after cloning</p>
                  </div>
                  <Switch checked={autoStart} onCheckedChange={setAutoStart} />
                </div>
              </div>
            </div>

            {/* Resource Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Resource Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">CPU Usage</span>
                  <span className="text-sm">{vm.cpu}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Memory Usage</span>
                  <span className="text-sm">{vm.memory}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage Usage</span>
                  <span className="text-sm">{vm.storage}%</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span className="text-sm">Estimated Clone Time</span>
                  <span className="text-sm">~15 minutes</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleClone} disabled={!cloneName || !selectedRegion}>
                <Copy className="h-4 w-4 mr-2" />
                Clone VM
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
