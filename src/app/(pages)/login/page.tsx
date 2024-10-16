'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { signinWithGoogleOAuth, signinWithPassword } from '@/lib/supabase/supabaseFunctions'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        if (!email || !password) {
            setError('メールアドレスとパスワードを入力してください。')
            return
        }else{
            const { error } = await signinWithPassword(email, password)
            if(!error){
                router.push('/main');
            }
        }
    }

    const handleGoogleLogin = async () => {
        await signinWithGoogleOAuth()
    };

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-md bg-neutral-100 shadow-xl">
            <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary mr-2" />
                <CardTitle className="text-2xl font-bold">ToGo List</CardTitle>
            </div>
            <CardDescription>アカウントにログインしてください</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">パスワード</Label>
                        <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button type="submit" className="w-full bg-black text-white">
                        ログイン
                    </Button>
                </div>
            </form>
            <div className="mt-4 relative">
                <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        または
                    </span>
                </div>
            </div>
            <Button
                type="button"
                variant="outline"
                className="w-full mt-4 bg-white text-gray-700 hover:bg-gray-300"
                onClick={() => handleGoogleLogin()}
            >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Googleでログイン
            </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                パスワードをお忘れですか？
            </Link>
            <div className="text-sm text-muted-foreground">
                アカウントをお持ちでない場合は
                <Link href="/signup" className="text-primary underline ml-1">
                新規登録
                </Link>
                してください。
            </div>
            </CardFooter>
        </Card>
        </div>
    )
}