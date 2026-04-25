import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TarjetaMetricaProps {
  titulo: string
  valor: number
  icono: LucideIcon
  colorIcono: string
  descripcion?: string
  trend?: { value: number; type: 'up' | 'down' | 'neutral' }
}

export function TarjetaMetrica({ titulo, valor, icono: Icono, colorIcono, descripcion, trend }: TarjetaMetricaProps) {
  // Map our predefined colors to more robust styles
  const colorMap: Record<string, { bg: string, text: string, shadow: string, glow: string }> = {
    'text-primary': { bg: 'bg-[#0EA5E9]/10', text: 'text-[#0EA5E9]', shadow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', glow: 'shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]' },
    'text-green-500': { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', glow: 'shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' },
    'text-yellow-500': { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', glow: 'shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]' },
    'text-blue-500': { bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]', shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', glow: 'shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]' },
  }
  
  const colorStyle = colorMap[colorIcono] || colorMap['text-primary']

  return (
    <Card className={`neo-card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${colorStyle.glow}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
        <div className={`p-2.5 rounded-xl ${colorStyle.bg} ${colorStyle.shadow} transition-all duration-300 group-hover:scale-110`}>
          <Icono className={`w-5 h-5 ${colorStyle.text}`} />
        </div>
        <CardTitle className="text-sm font-semibold text-foreground/90">
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className={`text-[2.5rem] leading-none tracking-tight font-bold ${colorStyle.text} mb-2`}>
          {valor}
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground font-medium">
            {descripcion}
          </p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trend.type === 'up' ? 'text-[#10B981] bg-[#10B981]/10' : 
              trend.type === 'down' ? 'text-[#EF4444] bg-[#EF4444]/10' : 
              'text-[#F59E0B] bg-[#F59E0B]/10'
            }`}>
              {trend.type === 'up' ? <TrendingUp className="w-3 h-3" /> : 
               trend.type === 'down' ? <TrendingDown className="w-3 h-3" /> : 
               <Minus className="w-3 h-3" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
