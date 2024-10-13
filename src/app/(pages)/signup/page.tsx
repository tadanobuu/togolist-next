'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase/supabaseClient'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'

type newUser = Database['public']['Tables']['users']['Insert'];

export default function SignupPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router = useRouter()

    // ランダムなフレンドIDを生成する関数（例: 8桁のランダムID）
    const generateFriendId = () => {
        return Math.random().toString(36).substring(2, 10);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        // 基本的なバリデーション
        if (!username || !email || !password || !confirmPassword) {
        setError('すべてのフィールドを入力してください。')
        return
        }

        if (password !== confirmPassword) {
        setError('パスワードが一致しません。')
        return
        }

        // サインアップ処理
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error('Error signing up:', error.message);
            return;
        }

        const friendId = generateFriendId();

        // users テーブルにユーザー名とフレンドIDを挿入
        const newUser: newUser= {
            id: data.user!.id.toString(),
            username,
            friend_id: friendId
        }
        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert([newUser]);

        if (insertError) {
            console.error('Error inserting user data:', insertError);
        } else {
            setIsDialogOpen(true)
            console.log('User profile created:', insertData);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        // ログインページにリダイレクト
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-md bg-neutral-100">
            <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary mr-2" />
                <CardTitle className="text-2xl font-bold">ToGo List</CardTitle>
            </div>
            <CardDescription>新規アカウントを作成</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">ユーザー名</Label>
                    <Input
                    id="username"
                    placeholder="ユーザー名を入力"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    />
                </div>
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
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">パスワード（確認）</Label>
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
                <Button type="submit" className="w-full bg-black text-white">
                    アカウント作成
                </Button>
                </div>
            </form>
            </CardContent>
            <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
                すでにアカウントをお持ちの場合は
                <Link href="/login" className="text-primary underline ml-1">
                ログイン
                </Link>
                してください。
            </p>
            </CardFooter>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>登録完了</DialogTitle>
                <DialogDescription>
                ToGo Listへの登録が完了しました。
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={handleDialogClose} className="w-full">
                OK
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </div>
    )
}