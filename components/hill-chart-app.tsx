"use client"

import { useState, useEffect } from "react"
import { HillChart } from "@/components/hill-chart"
import { PhysicsHillChart } from "@/components/physics-hill-chart"
import { ProjectSelector } from "@/components/project-selector"
import { ActionBar } from "@/components/action-bar"
import { DotList } from "@/components/dot-list"
import { AnimatedAvatar } from "@/components/animated-avatar"
import { SaveAnimation } from "@/components/save-animation"
import { FixUXPopup } from "@/components/fix-ux-popup"
import { saveProject, getProjects, getProject } from "@/lib/actions"
import type { Project, Dot } from "@/lib/types"
import { generateRandomColor } from "@/lib/utils"
import { useRouter } from "next/navigation"
import html2canvas from "html2canvas"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export function HillChartApp({ initialProjectId }: { initialProjectId?: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSaveAnimation, setShowSaveAnimation] = useState(false)
  const [showFixUXPopup, setShowFixUXPopup] = useState(false)
  const [showFixButton, setShowFixButton] = useState(false)
  const [savedImageUrl, setSavedImageUrl] = useState("")
  const [usePhysics, setUsePhysics] = useState(false)
  const [newDotId, setNewDotId] = useState<string | null>(null)

  // Set up timer for the Fix UI button when physics mode is activated
  useEffect(() => {
    if (usePhysics && !showFixButton && !showFixUXPopup) {
      const timer = setTimeout(() => {
        setShowFixButton(true)
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [usePhysics, showFixButton, showFixUXPopup])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectList = await getProjects()
        setProjects(projectList)

        if (projectList.length > 0) {
          let projectToLoad: Project | null = null

          if (initialProjectId) {
            try {
              projectToLoad = await getProject(initialProjectId)
            } catch (error) {
              console.error("Failed to load specified project:", error)
            }
          }

          if (!projectToLoad) {
            projectToLoad = await getProject(projectList[0].id)
          }

          setCurrentProject(projectToLoad)

          // Check if we should enable physics
          if (projectToLoad.dots.length >= 2) {
            setUsePhysics(true)
          }
        } else {
          // No projects available
          setCurrentProject(null)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load projects:", error)
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [initialProjectId])

  const handleProjectChange = async (projectId: string) => {
    try {
      const project = await getProject(projectId)
      setCurrentProject(project)

      // Check if we should enable physics
      setUsePhysics(project.dots.length >= 2)

      // Update URL without refreshing the page
      router.push(`/project/${projectId}`, { scroll: false })
    } catch (error) {
      console.error("Failed to load project:", error)
    }
  }

  const handleSave = async () => {
    if (!currentProject) return

    try {
      await saveProject(currentProject)
      // Refresh projects list
      const projectList = await getProjects()
      setProjects(projectList)

      // Capture the chart image for the save animation
      const chartElement = document.querySelector(".hill-chart-container")
      if (chartElement) {
        const canvas = await html2canvas(chartElement as HTMLElement, {
          backgroundColor: "hsl(222.2 25% 15%)",
          scale: 1.5,
        })

        const imageUrl = canvas.toDataURL("image/png")
        setSavedImageUrl(imageUrl)
      }

      toast({
        title: "Saved",
        description: `Project "${currentProject.name}" has been saved successfully.`,
      })

      return true
    } catch (error) {
      console.error("Failed to save project:", error)

      toast({
        title: "Save failed",
        description: "An error occurred while saving the project.",
        variant: "destructive",
      })

      return false
    }
  }

  const handleSaveComplete = () => {
    setShowSaveAnimation(true)
  }

  const handleAddDot = () => {
    if (!currentProject) return

    const newDot: Dot = {
      id: `dot-${Date.now()}`,
      name: `Task ${currentProject.dots.length + 1}`,
      x: 0.2, // Starting position on the left side of the hill
      y: 0,
      color: generateRandomColor(),
    }

    const updatedDots = [...currentProject.dots, newDot]

    setCurrentProject({
      ...currentProject,
      dots: updatedDots,
    })

    // Set the new dot ID to trigger editing
    setNewDotId(newDot.id)

    // Enable physics if we now have 2 or more dots
    if (updatedDots.length >= 2 && !usePhysics) {
      setUsePhysics(true)
      setShowFixButton(false) // Reset fix button state
    }
  }

  const handleUpdateDot = (updatedDot: Dot) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      dots: currentProject.dots.map((dot) => (dot.id === updatedDot.id ? updatedDot : dot)),
    })

    // Clear new dot ID if it was the one being edited
    if (newDotId === updatedDot.id) {
      setNewDotId(null)
    }
  }

  const handleDeleteDot = (dotId: string) => {
    if (!currentProject) return

    const updatedDots = currentProject.dots.filter((dot) => dot.id !== dotId)

    setCurrentProject({
      ...currentProject,
      dots: updatedDots,
    })

    // Clear new dot ID if it was the one being deleted
    if (newDotId === dotId) {
      setNewDotId(null)
    }

    // Disable physics if we now have less than 2 dots
    if (updatedDots.length < 2 && usePhysics) {
      setUsePhysics(false)
      setShowFixButton(false) // Reset fix button state
    }
  }

  const handleFixUX = () => {
    setShowFixUXPopup(true)
    setShowFixButton(false)
  }

  const handleFixUXClose = () => {
    setShowFixUXPopup(false)
    setUsePhysics(false)
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <AnimatedAvatar />

      <SaveAnimation
        isVisible={showSaveAnimation}
        onClose={() => setShowSaveAnimation(false)}
        imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Generated%20Image%20March%2016%2C%202025%20-%2012_31PM.png-b4de6WTyHV7O1hjRfxvGYuO9WkLgdW.jpeg"
      />

      <FixUXPopup isVisible={showFixUXPopup} onClose={handleFixUXClose} />

      {/* Full-page Fix UI button overlay */}
      <AnimatePresence>
        {showFixButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Button
                onClick={handleFixUX}
                className="bg-destructive hover:bg-destructive/90 text-white flex items-center gap-2 px-8 py-6 text-xl"
                size="lg"
              >
                <Wrench className="h-6 w-6" />
                Fix the UI
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectSelector
        projects={projects}
        currentProjectId={currentProject?.id}
        onProjectChange={handleProjectChange}
        setProjects={setProjects}
        setCurrentProject={setCurrentProject}
      />

      {currentProject ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{currentProject.name}</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="w-full">
              {usePhysics ? (
                <PhysicsHillChart dots={currentProject.dots} onUpdateDot={handleUpdateDot} onFixUX={handleFixUX} />
              ) : (
                <HillChart dots={currentProject.dots} onUpdateDot={handleUpdateDot} />
              )}
            </div>

            <div className="w-full">
              <DotList
                dots={currentProject.dots}
                onUpdateDot={handleUpdateDot}
                onDeleteDot={handleDeleteDot}
                onAddDot={handleAddDot}
                newDotId={newDotId}
              />
            </div>
          </div>

          <ActionBar project={currentProject} onSave={handleSave} onSaveComplete={handleSaveComplete} />
        </>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="mb-4">No projects yet. Create your first project to get started.</p>
        </div>
      )}
    </div>
  )
}
