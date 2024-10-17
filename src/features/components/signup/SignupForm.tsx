import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addUser, signUp } from '@/lib/supabase/supabaseFunctions'
import { createNewUser } from '@/lib/createNewUser'
import { Database } from '@/types/supabase'

type newUser = Database['public']['Tables']['users']['Insert'];
type ChildComponentProps = {
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignupForm = ({setIsDialogOpen}: ChildComponentProps) => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const validation = () => {
        if (!username || !email || !password || !confirmPassword) {
            setError('すべてのフィールドを入力してください。')
            return "error"
        }
        if (password !== confirmPassword) {
            setError('パスワードが一致しません。')
            return "error"
        }
        return ""
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        const chk = validation()
        if(chk) return

        setLoading(true)

        const { data, error } = await signUp(email, password)
        if (error) {
            console.error('Error signing up:', error.message);
            return;
        }

        const newUser: newUser = createNewUser(data.user!.id.toString(), username)
        const { error: insertError } = await addUser(newUser)

        if (!insertError) {
            setIsDialogOpen(true);
        }

        setLoading(false)
    };


    return (
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
                <Alert className='bg-red-600 font-bold border-none' variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full bg-black text-white">
                {loading ? "作成中..." : "アカウント作成"}
            </Button>
            </div>
        </form>
    )
}

export default SignupForm