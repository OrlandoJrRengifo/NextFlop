'use client'

import { CheckCircle, X, Heart, Clock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActionPopupProps {
  isOpen: boolean
  onClose: () => void
  message: string
  type?: 'success' | 'error' | 'info'
  icon?: 'heart' | 'clock' | 'check' | 'trash'
}

export function ActionPopup({ isOpen, onClose, message, type = 'success', icon = 'check' }: ActionPopupProps) {
  if (!isOpen) return null

  const icons = {
    heart: <Heart className="h-6 w-6 fill-current" />,
    clock: <Clock className="h-6 w-6" />,
    check: <CheckCircle className="h-6 w-6" />,
    trash: <Trash2 className="h-6 w-6" />,
  }

  const colors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/50 text-red-400',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-400',
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 pointer-events-none">
      <div className={`bg-gradient-to-br ${colors[type]} backdrop-blur-lg border rounded-xl p-4 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3 min-w-[280px]`}>
        <div className={`${type === 'success' ? 'text-green-400' : type === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
          {icons[icon]}
        </div>
        <p className="flex-1 font-medium">{message}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
