import Logo from "@/components/logo"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col bg-mantality-red md:flex-row min-h-screen">
      {/* Left side - Red background with content */}
        <div className="w-full md:w-1/2 bg-mantality-red p-8 md:p-12 flex flex-col">
          <div className="mb-8">
            <Logo />
          </div>

          <div className="flex-grow flex flex-col justify-center max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Mantality Health Medical Questionnaire</h1>

            <p className="text-xl text-white/90 mb-12">
              Get personalized testosterone treatments online and boost your testosterone levels from home—fast and
              simple.
            </p>

            <div>
              <Link href="/questions/0" className="mantality-button inline-flex items-center">
                I am ready
                <span className="ml-2 text-sm opacity-70">press Enter ↵</span>
              </Link>
            </div>

            <div className="mt-6 flex items-center text-white/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Takes 1 minute 30 seconds
            </div>
          </div>
        </div>

      {/* Right side - Image */}
      <div className="hidden md:block w-1/2 bg-black">
        <div className="h-full w-full relative">
          <Image
            src="https://images.typeform.com/images/NiCRcCcwnfxr/image/default-firstframe.png"
            alt="Man in gym"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}

