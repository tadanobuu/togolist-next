'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        // ここで実際の認証ロジックを実装します
        // この例では、簡単なバリデーションのみを行っています
        if (!email || !password) {
        setError('メールアドレスとパスワードを入力してください。')
        return
        }

        // ログイン処理（ここではコンソールログのみ）
        console.log('ログイン試行:', { email, password })
        
        // 実際のアプリケーションでは、ここでAPIリクエストを送信し、
        // 成功時にはユーザーをリダイレクトします
    }

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
                        <Link href={"/"}>
                            ログイン
                        </Link>
                    </Button>
                </div>
            </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                パスワードをお忘れですか？
            </Link>
            <div className="text-sm text-muted-foreground">
                アカウントをお持ちでない場合は
                <Link href="/signup" className="text-primary hover:underline ml-1">
                新規登録
                </Link>
                してください。
            </div>
            </CardFooter>
        </Card>
        </div>
    )
}