"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PasswordInput({ binLink }) {
    const [passwordContent, setPasswordContent] = useState("")
    const [error, setError] = useState(null)
    const router = useRouter()

    //submit password if user presses the Enter key
    const handleKeyDown = async (e) => {
        if(e.key === "Enter"){ handlePasswordSubmit(passwordContent) }
        return
    }

    //handle password submittion
    const handlePasswordSubmit = async (e) => {
        if(passwordContent.length < 8){
            setError("Please enter at least 8 characters for the password.")
            return
        }
        setError(null)

        try {
            const apiResult = await fetch(`http://localhost:3000/api/bins/${encodeURIComponent(binLink)}?binPassword=${passwordContent}`)
            // const apiResultData = await apiResult.json()
                        
            //api responded with an error
            if(!apiResult.ok){
                setError("Incorrect Password")
                return
            }
            
            //reload the page, but with correct password searchquery
            if(apiResult.status === 200){
                router.push(`/${encodeURIComponent(binLink)}?binPassword=${passwordContent}`)
            }
        }
        catch(error){
            console.error(error)
            setError('A network error occurred, please try again.')
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="flex mb-4 text-xl font-semibold gap-2">Password Required<Lock/></h1>
            <section className="flex flex-row gap-3">
                <Input
                    className="w-auto focus:bg-gray-200"
                    value={passwordContent}
                    type="password"
                    placeholder="Password"
                    onKeyDown={handleKeyDown}
                    maxLength={12}
                    onChange={(e) => setPasswordContent(e.target.value)}
                />
                <Button 
                    className="cursor-pointer hover:bg-gray-200"
                    variant="outline" 
                    onClick={() => handlePasswordSubmit(passwordContent)} 
                >
                    <ArrowRight/>
                </Button>
            </section>
            { error && <strong className="mt-1 text-sm text-red-600">{error}</strong> }
        </div>
    )
}