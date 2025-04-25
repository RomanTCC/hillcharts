"use server"

import { revalidatePath } from "next/cache"
import type { Project } from "./types"

// Add the four new projects
const initialProjects: Project[] = [
  {
    id: "project-tools-tab",
    name: "Tools Tab",
    dots: [],
    comment: "",
  },
  {
    id: "project-surfy-writer-assistant",
    name: "Surfy Writer/Assistant Mode",
    dots: [],
    comment: "",
  },
  {
    id: "project-pocs-cleanup",
    name: "POCs (Outline Templates, Custom Voices in Surfy, and Repurposing in CE) Cleanup",
    dots: [],
    comment: "",
  },
  {
    id: "project-view-only-shared-ces",
    name: "View-only Shared CEs",
    dots: [],
    comment: "",
  },
]

// In a real application, this would be a database
// For this example, we'll use a simple in-memory store
let projects: Project[] = [...initialProjects]

export async function getProjects(): Promise<Project[]> {
  return [...projects]
}

export async function getProject(id: string): Promise<Project> {
  const project = projects.find((p) => p.id === id)
  if (!project) {
    throw new Error(`Project with ID ${id} not found`)
  }
  return { ...project }
}

export async function createProject(name: string): Promise<Project> {
  const newProject: Project = {
    id: `project-${Date.now()}`,
    name,
    dots: [],
    comment: "",
  }

  projects.push(newProject)
  revalidatePath("/")
  return newProject
}

export async function saveProject(project: Project): Promise<Project> {
  const index = projects.findIndex((p) => p.id === project.id)

  if (index === -1) {
    projects.push(project)
  } else {
    projects[index] = project
  }

  revalidatePath("/")
  return project
}

export async function deleteProject(id: string): Promise<void> {
  projects = projects.filter((p) => p.id !== id)
  revalidatePath("/")
}
