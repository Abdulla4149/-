import React from 'react';
import { useForm } from 'react-hook-form';
import { LockKeyhole, Mail, LogIn } from 'lucide-react'; // Иконки для красоты

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log("Login data:", data);
        // Здесь будет ваша логика авторизации
    };

    return (
        // Внешний контейнер с мягким градиентом на весь экран
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4">
            
            {/* Карточка формы */}
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-200/50 overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-500">
                
                {/* Верхняя декоративная часть */}
                <div className="bg-blue-600 p-8 text-center">
                    <div className="inline-flex p-3 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                        <LockKeyhole className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Добро пожаловать</h1>
                    <p className="text-blue-100 text-sm mt-2 font-medium">Войдите в свой аккаунт KomekArch</p>
                </div>

                {/* Тело формы */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    
                    {/* Поле Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input 
                                type="email" 
                                {...register('email', { required: "Введите email" })}
                                placeholder="example@mail.com"
                                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none transition-all text-sm focus:ring-4 focus:bg-white ${
                                    errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-100 focus:ring-blue-100 focus:border-blue-400'
                                }`}
                            />
                        </div>
                        {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                    </div>

                    {/* Поле Пароль */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Пароль</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                <LockKeyhole className="w-5 h-5" />
                            </div>
                            <input 
                                type="password" 
                                {...register('password', { required: "Введите пароль", minLength: { value: 6, message: "Минимум 6 символов" } })}
                                placeholder="••••••••"
                                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-2xl outline-none transition-all text-sm focus:ring-4 focus:bg-white ${
                                    errors.password ? 'border-red-400 focus:ring-red-100' : 'border-slate-100 focus:ring-blue-100 focus:border-blue-400'
                                }`}
                            />
                        </div>
                        {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>}
                    </div>

                    {/* Кнопка входа */}
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>Войти в систему</span>
                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Дополнительные ссылки */}
                    <div className="pt-4 text-center">
                        <a href="#" className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors">
                            Забыли пароль?
                        </a>
                    </div>
                </form>

                {/* Футер карточки */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                        Нет аккаунта? <a href="#" className="text-blue-600 font-bold hover:underline">Создать</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
