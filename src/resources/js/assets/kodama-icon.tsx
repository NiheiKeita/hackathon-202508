import React from 'react'

export const KodamaIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} spirit-glow flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green-400 to-green-600`}>
      <span className="text-2xl font-bold text-white">木</span>
    </div>
  )
}