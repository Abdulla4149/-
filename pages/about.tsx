import React from 'react';
import { User, Code, Layout, ClipboardList, ShieldCheck, Search } from 'lucide-react';

const TeamSection = () => {
  const team = [
    {
      name: "Балтабай Абдолла",
      role: "Lead Fullstack Developer",
      icon: <Code className="w-6 h-6 text-blue-600" />,
      description: "Архитектура сайта, разработка бэкенда, фронтенда и интеграция ИИ DeepSeek."
    },
    {
      name: "Мухаметжанова Жанар",
      role: "Manager",
      icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      description: "Управление задачами в Trello, отчетность."
    },
    {
      name: "Жақыбай Аружан",
      role: "UI Designer",
      icon: <Layout className="w-6 h-6 text-blue-600" />,
      description: "Создание визуального стиля и эстетики платформы."
    },
    {
      name: "Серик Дильназ",
      role: "Visual Content Creator",
      icon: <Search className="w-6 h-6 text-blue-600" />,
      description: "Подготовка визуальных материалов и графическое оформление макетов сайта для презентации проекта"
    },
    {
      name: "Оразғали Аяужан",
      role: "QA Engineer",
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      description: "Тестирование функционала и контроль качества продукта."
    },
    {
      name: "Аккузинов Айзат",
      role: "QA Analyst",
      icon: <User className="w-6 h-6 text-blue-600" />,
      description: "Анализ стабильности системы и проверка граничных сценариев."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Наша Команда
          </h2>
          <p className="text-blue-600 font-medium text-lg mb-2">
            Группа CS-201 | Торайғыров Университет
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-blue-600"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {member.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {member.name}
              </h3>
              <p className="text-blue-600 font-semibold text-sm mb-3 uppercase tracking-wider">
                {member.role}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
