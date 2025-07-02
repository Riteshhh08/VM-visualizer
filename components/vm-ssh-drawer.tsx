"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Terminal, Copy, Download, Key } from "lucide-react"
import { useState } from "react"

interface VM {
  id: string
  name: string
  ipAddress: string
  status: string
}

interface VMSSHDrawerProps {
  vm: VM | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VMSSHDrawer({ vm, open, onOpenChange }: VMSSHDrawerProps) {
  const [username, setUsername] = useState("ubuntu")
  const [port, setPort] = useState("22")

  if (!vm) return null

  const sshCommand = `ssh ${username}@${vm.ipAddress} -p ${port}`
  const scpCommand = `scp -P ${port} file.txt ${username}@${vm.ipAddress}:~/`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] border-0 flex flex-col">
        <DrawerHeader className="text-left flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            SSH Connection - {vm.name}
          </DrawerTitle>
          <DrawerDescription>Connect to your virtual machine via SSH</DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 pb-6">
            {/* Connection Status */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Connection Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant="secondary"
                    className={
                      vm.status === "Running"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }
                  >
                    {vm.status === "Running" ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IP Address</span>
                  <code className="text-sm bg-background px-2 py-1 rounded">{vm.ipAddress}</code>
                </div>
              </div>
            </div>

            {/* Connection Settings */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Connection Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ubuntu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" value={port} onChange={(e) => setPort(e.target.value)} placeholder="22" />
                </div>
              </div>
            </div>

            {/* SSH Commands */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">SSH Commands</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>SSH Connection</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-background px-3 py-2 rounded">{sshCommand}</code>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(sshCommand)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SCP File Transfer</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-background px-3 py-2 rounded">{scpCommand}</code>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(scpCommand)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* SSH Key Management */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Key className="h-4 w-4" />
                SSH Key Management
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  disabled={vm.status !== "Running"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Private Key
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Key Pair
                </Button>
                <Separator />
                <div className="space-y-2">
                  <Label>Add Public Key</Label>
                  <Textarea placeholder="Paste your public key here..." className="min-h-[80px]" />
                  <Button size="sm" disabled={vm.status !== "Running"}>
                    Add Key
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full" disabled={vm.status !== "Running"}>
                  <Terminal className="h-4 w-4 mr-2" />
                  Open Web Terminal
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  disabled={vm.status !== "Running"}
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
