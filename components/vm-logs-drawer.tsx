"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VM {
  id: string
  name: string
  status: string
}

interface LogEntry {
  id: string
  timestamp: string
  level: "INFO" | "WARN" | "ERROR" | "DEBUG"
  message: string
  source: string
}

interface VMLogsDrawerProps {
  vm: VM | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VMLogsDrawer({ vm, open, onOpenChange }: VMLogsDrawerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [filterLevel, setFilterLevel] = useState<string>("all")

  const filteredLogs = logs.filter((log) => filterLevel === "all" || log.level === filterLevel)

  // Generate sample logs
  useEffect(() => {
    if (vm && open) {
      setLoading(true)
      // Simulate loading logs
      setTimeout(() => {
        const sampleLogs: LogEntry[] = [
          {
            id: "1",
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            level: "INFO",
            message: "VM started successfully",
            source: "system",
          },
          {
            id: "2",
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            level: "INFO",
            message: "Network interface eth0 configured",
            source: "network",
          },
          {
            id: "3",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            level: "WARN",
            message: "High CPU usage detected (85%)",
            source: "monitoring",
          },
          {
            id: "4",
            timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            level: "INFO",
            message: "SSH service started on port 22",
            source: "ssh",
          },
          {
            id: "5",
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            level: "ERROR",
            message: "Failed to connect to external service",
            source: "application",
          },
          {
            id: "6",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            level: "INFO",
            message: "Disk space check completed",
            source: "system",
          },
        ]
        setLogs(sampleLogs)
        setLoading(false)
      }, 1000)
    }
  }, [vm, open])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "WARN":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "INFO":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "DEBUG":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (!vm) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] border-0 flex flex-col">
        <DrawerHeader className="text-left flex-shrink-0">
          <DrawerTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Logs - {vm.name}
          </DrawerTitle>
          <DrawerDescription>View system and application logs for this virtual machine</DrawerDescription>
        </DrawerHeader>

        <div className="flex-shrink-0 px-4 mb-4">
          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="border-border">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="WARN">Warn</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="DEBUG">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const logText = logs
                  .map(
                    (log) =>
                      `[${new Date(log.timestamp).toLocaleString()}] ${log.level} (${log.source}): ${log.message}`,
                  )
                  .join("\n")

                const blob = new Blob([logText], { type: "text/plain" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `${vm?.name}-logs.txt`
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="pb-6">
            {/* Logs */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Recent Logs</h3>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading logs...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredLogs.map((log, index) => (
                    <div key={log.id}>
                      <div className="flex items-start gap-3 py-2">
                        <Badge variant="secondary" className={`text-xs ${getLevelColor(log.level)}`}>
                          {log.level}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                            <span>•</span>
                            <span>{log.source}</span>
                          </div>
                          <p className="text-sm break-words">{log.message}</p>
                        </div>
                      </div>
                      {index < filteredLogs.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
