import { HillChartApp } from "@/components/hill-chart-app"
import { AnimatedTitle } from "@/components/animated-title"
import { getProjects } from "@/lib/actions"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  // Pre-fetch projects to ensure they're loaded
  await getProjects()

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <AnimatedTitle />
        <p className="text-muted-foreground mb-8 text-lg italic">Pod górę ciężko, ale na górze pięknie.</p>
        <HillChartApp initialProjectId={params.id} />
      </div>
    </main>
  )
}
