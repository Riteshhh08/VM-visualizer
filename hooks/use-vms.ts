"use client"

import { useState, useEffect, useCallback } from "react"

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

// Fallback data in case database is not available
const fallbackVMs: VM[] = [
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

export function useVMs() {
  const [vms, setVMs] = useState<VM[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchVMs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setUsingFallback(false)

      console.log("Fetching VMs from API...")
      const response = await fetch("/api/vms", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error:", errorData)
        throw new Error(errorData.details || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Successfully fetched VMs:", data)
      setVMs(data)
    } catch (err) {
      console.error("Failed to fetch from API, using fallback data:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      setVMs(fallbackVMs)
      setUsingFallback(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateVMStatus = useCallback(
    async (id: string, status: VMStatus) => {
      try {
        const vm = vms.find((v) => v.id === id)
        if (!vm) return

        // Optimistic update
        setVMs((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))

        if (usingFallback) {
          // If using fallback data, just update locally
          console.log("Using fallback mode, updating locally only")
          return
        }

        const response = await fetch(`/api/vms/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            cpu: vm.cpu,
            memory: vm.memory,
            storage: vm.storage,
          }),
        })

        if (!response.ok) {
          // Revert optimistic update on error
          setVMs((prev) => prev.map((v) => (v.id === id ? vm : v)))
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.details || "Failed to update VM status")
        }

        const updatedVM = await response.json()
        setVMs((prev) => prev.map((v) => (v.id === id ? updatedVM : v)))
      } catch (err) {
        console.error("Error updating VM:", err)
        setError(err instanceof Error ? err.message : "Failed to update VM")
      }
    },
    [vms, usingFallback],
  )

  const createVM = useCallback(
    async (vmData: Omit<VM, "id" | "createdAt" | "updatedAt">) => {
      try {
        if (usingFallback) {
          // If using fallback data, just add locally
          const newVM = {
            ...vmData,
            id: `vm-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          setVMs((prev) => [newVM, ...prev])
          return newVM
        }

        const response = await fetch("/api/vms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vmData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.details || "Failed to create VM")
        }

        const newVM = await response.json()
        setVMs((prev) => [newVM, ...prev])
        return newVM
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create VM")
        throw err
      }
    },
    [usingFallback],
  )

  const deleteVM = useCallback(
    async (id: string) => {
      try {
        if (usingFallback) {
          // If using fallback data, just remove locally
          setVMs((prev) => prev.filter((v) => v.id !== id))
          return
        }

        const response = await fetch(`/api/vms/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.details || "Failed to delete VM")
        }

        setVMs((prev) => prev.filter((v) => v.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete VM")
        throw err
      }
    },
    [usingFallback],
  )

  useEffect(() => {
    fetchVMs()
  }, [fetchVMs])

  return {
    vms,
    loading,
    error,
    usingFallback,
    fetchVMs,
    updateVMStatus,
    createVM,
    deleteVM,
  }
}
