"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/types"
import { createProject } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProjectSelectorProps {
  projects: Project[]
  currentProjectId: string | undefined
  onProjectChange: (projectId: string) => void
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project) => void
}

export function ProjectSelector({
  projects,
  currentProjectId,
  onProjectChange,
  setProjects,
  setCurrentProject,
}: ProjectSelectorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [newProjectName, setNewProjectName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    try {
      const newProject = await createProject(newProjectName)
      setProjects([...projects, newProject])
      setCurrentProject(newProject)
      setNewProjectName("")
      setIsDialogOpen(false)

      // Navigate to the new project page
      router.push(`/project/${newProject.id}`, { scroll: false })

      toast({
        title: "Project created",
        description: `Project "${newProjectName}" has been created successfully.`,
      })
    } catch (error) {
      console.error("Failed to create project:", error)

      toast({
        title: "Creation failed",
        description: "An error occurred while creating the project.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        {projects.length > 0 ? (
          <Select value={currentProjectId} onValueChange={onProjectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-muted-foreground">No projects yet</div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateProject()
              }}
            />
            <Button onClick={handleCreateProject} className="w-full">
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
