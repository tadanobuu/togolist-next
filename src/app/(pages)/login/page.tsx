import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import EmailLogin from "@/app/features/components/login/emailLogin"
import GoogleLogin from "@/app/features/components/login/GoogleLogin"

export default function LoginPage() {

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
                <EmailLogin />
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
                <GoogleLogin />
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