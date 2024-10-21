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
import { useRouter } from "next/navigation";

const ResetPassword = () => {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const router = useRouter();

    const validation = () => {
        if (!password || !confirmPassword) {
            setError('すべてのフィールドを入力してください。')
            return "error"
        }
        if (password !== confirmPassword) {
            setError('パスワードが一致しません。')
            return "error"
        }
        return ""
    }

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const validationError = validation();
        if(validationError) return

        const { error } = await supabase.auth.updateUser({
            password,
        });
    
        if (error) {
            setError('パスワードリセットに失敗しました。再度お試しください。');
        } else {
            setSuccess('パスワードが正常にリセットされました。');
            setTimeout(() => {
                router.push('/login');
            },5000)
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
                <CardDescription>新しいパスワードを設定してください</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="password">新しいパスワード</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="confirm-password">パスワードの確認</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    パスワードを変更
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

export default ResetPassword