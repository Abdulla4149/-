"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { LockKeyhole, Mail, LogIn, AlertTriangle } from "lucide-react";
import { useState } from "react";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    setIsLoading(true);
    
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Оставляем false, чтобы страница не перезагружалась
      });

      if (res?.error) {
        // Если ошибка есть, выводим понятный текст
        if (res.error === "CredentialsSignin") {
          setServerError("Неверный email или пароль");
        } else {
          setServerError("Произошла ошибка при входе. Попробуйте еще раз.");
        }
        setIsLoading(false);
        return;
      }

      if (res?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setServerError("Ошибка сети. Проверьте подключение.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-200/50 overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-500">
        <div className="bg-blue-600 p-8 text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <LockKeyhole className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Добро пожаловать</h1>
          <p className="text-blue-100 text-sm mt-2 font-medium">Войдите в свой аккаунт KomekArch</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Блок отображения ошибки */}
          {serverError && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700 animate-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm font-semibold">{serverError}</div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                {...register("email", { required: "Введите email" })}
                placeholder="example@mail.com"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none transition-all text-sm focus:ring-4 focus:bg-white ${
                  errors.email ? "border-red-400 focus:ring-red-100" : "border-slate-100 focus:ring-blue-100 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Пароль</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <LockKeyhole className="w-5 h-5" />
              </div>
              <input
                type="password"
                {...register("password", {
                  required: "Введите пароль",
                  minLength: { value: 6, message: "Минимум 6 символов" },
                })}
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none transition-all text-sm focus:ring-4 focus:bg-white ${
                  errors.password ? "border-red-400 focus:ring-red-100" : "border-slate-100 focus:ring-blue-100 focus:border-blue-400"
                }`}
              />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group ${
              isLoading ? "bg-slate-400 shadow-slate-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            <span>{isLoading ? "Входим..." : "Войти в систему"}</span>
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors">
              На главную
            </Link>
          </div>
        </form>

        <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Создать
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}