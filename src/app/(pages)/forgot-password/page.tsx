'use client';

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link"
import { supabase } from "@/lib/supabase/supabaseClient";

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => { 
        event.preventDefault()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://togolist-next.vercel.app/reset-password',
        });

        if (error) {
            setError('パスワードリセットに失敗しました。再度お試しください。');
        } else {
            setSuccess('パスワードリセットリンクを送信しました。');
        }
    }

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center p-4">
            <Card className="w-full max-w-md bg-neutral-100 shadow-xl">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary mr-2" />
                    <CardTitle className="text-2xl font-bold">ToGo List</CardTitle>
                </div>
                <CardDescription>パスワードをリセットします</CardDescription>
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
                    {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    )}
                    {success && (
                    <Alert variant="default" className="border-green-500 text-green-700">
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                    )}
                    <Button type="submit" className="w-full bg-black text-white">
                    リセット用メール送信
                    </Button>
                </div>
                </form>
            </CardContent>
            <CardFooter>
                <Link href="/login" className="flex items-center text-sm text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                ログインページに戻る
                </Link>
            </CardFooter>
            </Card>
        </div>
    )
}

export default ForgotPassword;