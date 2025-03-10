"use client"

import { ChevronUp, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

interface NavigationArrowsProps {
  prevUrl?: string
  nextUrl?: string
}

export default function NavigationArrows({ prevUrl, nextUrl }: NavigationArrowsProps) {
  const router = useRouter()

  return (
    <div className="nav-arrows">
      {prevUrl && (
        <button onClick={() => router.push(prevUrl)} className="nav-arrow" aria-label="Previous question">
          <ChevronUp size={20} />
        </button>
      )}
      {nextUrl && (
        <button onClick={() => router.push(nextUrl)} className="nav-arrow" aria-label="Next question">
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  )
}

