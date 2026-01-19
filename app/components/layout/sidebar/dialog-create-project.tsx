"use client"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type DialogCreateProjectProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function DialogCreateProject({
  isOpen,
  setIsOpen,
}: DialogCreateProjectProps) {
  const [projectName, setProjectName] = useState("")
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const createProject = useMutation(api.projects.create)

  const handleCreate = async (name: string) => {
    setIsPending(true)
    try {
      const projectId = await createProject({ name })
      router.push(`/p/${projectId}`)
      setProjectName("")
      setIsOpen(false)
    } finally {
      setIsPending(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (projectName.trim()) {
      handleCreate(projectName.trim())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!projectName.trim() || isPending}
            >
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
