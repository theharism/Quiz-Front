import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="inline-block">
      <div className="w-24 h-12 relative">
        <img src="/logo.png" alt='logo' />
      </div>
    </Link>
  )
}

