import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> KomekArch </h3>
                        <p className="text-gray-400"> Интерактивная платформа для изучения компьютерной архитектуры </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-4">Ссылки</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/" className="hover:text-white transition">Главная</Link></li>
                            <li><Link href="/courses" className="hover:text-white transition">Курсы</Link></li>
                            <li><Link href="/about" className="hover:text-white transition">О нас</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-4">Курсы</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/courses/basics" className="hover:text-white transition">Основы</Link></li>
                            <li><Link href="/courses/processors" className="hover:text-white transition">Процессоры</Link></li>
                            <li><Link href="/courses/io" className="hover:text-white transition">Ввод-вывод</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-4">Свяжитесь с нами</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: info@komekarch.com</li>
                            <li>Телефон: +7 (777) 123-45-67</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; {currentYear} KomekArch. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}