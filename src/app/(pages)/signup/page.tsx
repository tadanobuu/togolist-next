'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import SignupForm from '@/features/components/signup/SignupForm'

const Signup = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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
                <SignupForm setIsDialogOpen={setIsDialogOpen} />
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
        <DialogContent className="bg-white">
            <DialogHeader>
                <DialogTitle>登録完了</DialogTitle>
                <DialogDescription>
                ToGo Listへの登録が完了しました。
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button className="w-full">
                    <Link href={"/main"}>OK</Link>
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </div>
    )
}

export default Signup;