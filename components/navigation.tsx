"use client"

import { Button } from "@/components/ui/button"
import { Map, TableIcon } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface NavigationProps {
  currentView: "table" | "map"
  onViewChange: (view: "table" | "map") => void
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">VM Visualizer</h1>
          <p className="text-muted-foreground">Monitor and manage your virtual machines across different regions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg p-1 bg-muted/50">
            <Button
              variant={currentView === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("table")}
              className="h-8 border-0"
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant={currentView === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("map")}
              className="h-8 border-0"
            >
              <Map className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
