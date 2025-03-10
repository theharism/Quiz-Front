import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="inline-block">
      <div className="w-24 h-12 relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" className="w-full h-full">
          <g fill="#FFFFFF">
            <path d="M10,10 L20,10 L25,25 L30,10 L40,10 L40,40 L30,40 L30,25 L27,35 L23,35 L20,25 L20,40 L10,40 Z" />
            <path d="M45,10 L55,10 L55,40 L45,40 Z" />
            <path d="M60,10 L70,10 L70,30 L80,30 L80,40 L60,40 Z" />
            <circle cx="50" cy="20" r="5" />
          </g>
        </svg>
      </div>
    </Link>
  )
}

