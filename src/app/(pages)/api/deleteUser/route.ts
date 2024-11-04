import { supabase } from '@/lib/supabase/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ユーザーを削除
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User successfully deleted' });
}