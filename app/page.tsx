'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import Logo from "@/components/logo"

interface HomePage {
  _id: string
  logo:string
  heading: string
  subHeading: string
  buttonText: string
  completionTime: string
}

export default function Home() {

const [home, setHome] = useState<HomePage>();

  useEffect(()=>{
    const fetchHomePageContent = async () =>{
      const res = await fetch("/api/v1/landing-page-content?latest=true")
      const data = await res.json()
      setHome(data.data)
    }
    fetchHomePageContent();
  },[])

  return (
    <div className="flex flex-col bg-mantality-red md:flex-row min-h-screen">
      {/* Left side - Red background with content */}
        <div className="w-full md:w-1/2 bg-mantality-red p-8 md:p-12 flex flex-col">
          <div className="mb-8">
            <Logo />
            {/* <img
              src={home?.logo}
              alt="logo preview"
              className="h-20 w-20 rounded-full"
            /> */}
          </div>

          <div className="flex-grow flex flex-col justify-center max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{home?.heading}</h1>

            <p className="text-xl text-white/90 mb-12">
              {home?.subHeading}
            </p>

            <div>
              <Link href="/questions/0" className="mantality-button inline-flex items-center">
                {home?.buttonText}
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
              {home?.completionTime}
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

