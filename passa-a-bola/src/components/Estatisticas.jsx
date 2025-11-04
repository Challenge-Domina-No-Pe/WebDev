
"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function Estatisticas({ player }) {
  const chartData = [
    { stat: "Ritmo", value: Number(player?.ritmo ?? 50) },
    { stat: "Chute", value: Number(player?.chute ?? 50) },
    { stat: "Passe", value: Number(player?.passe ?? 50) },
    { stat: "Drible", value: Number(player?.drible ?? 50) },
    { stat: "Defesa", value: Number(player?.defesa ?? 50) },
    { stat: "Físico", value: Number(player?.fisico ?? 50) },
  ]

  const chartConfig = {
    value: {
      label: player?.nome ? `Atributos • ${player.nome}` : "Atributos",
      color: "#a511f0",
    },
  }

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Estatísticas da Jogadora</CardTitle>
        <CardDescription>Radar dos 6 atributos</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid />
            <PolarAngleAxis dataKey="stat" />
            <PolarRadiusAxis angle={30} domain={[0, 99]} />
            <Radar dataKey="value" fill="var(--color-value)" fillOpacity={0.6} stroke="var(--color-value)" dot={{ r: 3 }} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          0 a 99 pontos por atributo
        </div>
      </CardFooter>
    </Card>
  )
}