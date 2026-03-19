import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from "next-auth/react";

export default function Header() {
    const router = useRouter();
    const { data: session, status } = useSession();
    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="container">
                <div className="flex justify-between items-center h-20">
                    <Link href="/">
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                KomekArch
                            </div>
                        </div>
                    </Link>
                    <nav className="hidden md:flex gap-8">
                        <Link href="/" className={`font-semibold transition ${router.pathname === '/' ? 'text-blue-600' : 'hover:text-blue-600'}`}> Главная </Link>
                        <Link href="/courses" className={`font-semibold transition ${router.pathname === '/courses' ? 'text-blue-600' : 'hover:text-blue-600'}`}> Курсы </Link>
                        <Link href="/about" className={`font-semibold transition ${router.pathname === '/about' ? 'text-blue-600' : 'hover:text-blue-600'}`}> О нас </Link>
                    </nav>
                    {status === "authenticated" ? (
                        <div className="hidden md:flex items-center gap-3">
                            <div className="text-sm font-bold text-slate-700">
                                {session.user?.name || session.user?.email}
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push('/login')}
                            className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Вход
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
