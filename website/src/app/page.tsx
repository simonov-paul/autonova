'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useInView,
  AnimatePresence,
} from 'framer-motion'
import {
  Clock,
  Mail,
  BarChart3,
  Lightbulb,
  Users,
  MessageCircle,
  FileText,
  Database,
  Bell,
  Zap,
  ChevronDown,
  Plus,
  Check,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────────────────
   UTILITY COMPONENTS
───────────────────────────────────────────────────────── */

function FadeIn({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  once?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '0px 0px -50px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CardTilt({
  children,
  className,
  glowColor = 'rgba(79,70,229,0.08)',
  style,
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
  style?: React.CSSProperties
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const gX = useMotionValue(50)
  const gY = useMotionValue(50)
  const rotateX = useTransform(y, [-100, 100], [7, -7])
  const rotateY = useTransform(x, [-100, 100], [-7, 7])
  const glow = useMotionTemplate`radial-gradient(circle at ${gX}% ${gY}%, ${glowColor} 0%, transparent 60%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    x.set(((mx - rect.width / 2) / (rect.width / 2)) * 100)
    y.set(((my - rect.height / 2) / (rect.height / 2)) * 100)
    gX.set((mx / rect.width) * 100)
    gY.set((my / rect.height) * 100)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('relative', className)}
    >
      <motion.div
        style={{ background: glow }}
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
      />
      {children}
    </motion.div>
  )
}

function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: '-20%', left: '-10%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.28) 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0,
          animation: 'aurora-fade-in 1.5s ease forwards, aurora-drift-1 18s ease-in-out 1.5s infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: '10%', right: '-5%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0,
          animation: 'aurora-fade-in 1.5s 0.3s ease forwards, aurora-drift-2 22s ease-in-out 1.8s infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          bottom: '0%', left: '30%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0,
          animation: 'aurora-fade-in 1.5s 0.6s ease forwards, aurora-drift-3 26s ease-in-out 2.1s infinite alternate',
        }}
      />
    </div>
  )
}

function Meteors({ count = 16 }: { count?: number }) {
  const meteors = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    top: `${Math.random() * 40}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${3 + Math.random() * 3}s`,
    size: Math.random() * 120 + 80,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute"
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: 1,
            transform: 'rotate(215deg)',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)',
            animation: `meteor ${m.duration} ${m.delay} linear infinite`,
            boxShadow: '0 0 4px rgba(255,255,255,0.3)',
          }}
        />
      ))}
    </div>
  )
}

function Spotlight() {
  const [pos, setPos] = useState({ x: '50%', y: '40%' })
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom) return
      setPos({
        x: ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%',
        y: ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%',
      })
      setVisible(true)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        background: `radial-gradient(600px circle at ${pos.x} ${pos.y}, rgba(79,70,229,0.10) 0%, transparent 60%)`,
      }}
    />
  )
}

function BorderBeam({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden', className)}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: 1,
          background: 'conic-gradient(from var(--border-angle, 0deg), transparent 20%, #4F46E5 40%, #06B6D4 60%, transparent 80%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'spin-conic 3s linear infinite',
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      } : {}}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <div
            className="w-8 h-8 rounded-[9px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              boxShadow: '0 0 16px rgba(79,70,229,0.5)',
            }}
          >
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-[1.05rem] font-bold tracking-tight" style={{ color: 'var(--an-text)' }}>
            Autonova
          </span>
        </a>
        <a
          href="#cta"
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-[9px] text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'var(--an-accent)',
            boxShadow: '0 0 0 0 transparent',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(79,70,229,0.5)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent'
          }}
        >
          Получить аудит
        </a>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────── */

function FlowDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[520px] mx-auto"
    >
      <div
        className="rounded-[26px] p-8"
        style={{
          background: 'var(--an-bg-card)',
          border: '1px solid var(--an-border)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--an-shadow), 0 0 80px rgba(79,70,229,0.1)',
        }}
      >
        <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Input nodes */}
          <rect x="10" y="40"  width="120" height="44" rx="10" fill="#111118" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          <text x="70" y="58"  textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="600" fill="#F1F5F9">Форма / заявка</text>
          <text x="70" y="73"  textAnchor="middle" fontFamily="inherit" fontSize="9" fill="#475569">Входящий лид</text>

          <rect x="10" y="110" width="120" height="44" rx="10" fill="#111118" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          <text x="70" y="128" textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="600" fill="#F1F5F9">Email / чат</text>
          <text x="70" y="143" textAnchor="middle" fontFamily="inherit" fontSize="9" fill="#475569">Сообщения клиентов</text>

          <rect x="10" y="180" width="120" height="44" rx="10" fill="#111118" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          <text x="70" y="198" textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="600" fill="#F1F5F9">CRM / таблицы</text>
          <text x="70" y="213" textAnchor="middle" fontFamily="inherit" fontSize="9" fill="#475569">Ручные данные</text>

          <rect x="10" y="250" width="120" height="44" rx="10" fill="#111118" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          <text x="70" y="268" textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="600" fill="#F1F5F9">Отчёты</text>
          <text x="70" y="283" textAnchor="middle" fontFamily="inherit" fontSize="9" fill="#475569">Еженедельные сводки</text>

          {/* Connecting lines */}
          <path d="M130 62 Q175 62 175 148"  fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="6 4" style={{ animation: 'flow-anim 3s linear infinite' }}/>
          <path d="M130 132 Q165 132 175 148" fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="6 4" style={{ animation: 'flow-anim 3s linear infinite' }}/>
          <path d="M130 202 Q165 202 175 178" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 4" style={{ animation: 'flow-anim 3s -1s linear infinite' }}/>
          <path d="M130 272 Q175 272 175 198" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 4" style={{ animation: 'flow-anim 3s -1s linear infinite' }}/>

          {/* AI orchestrator */}
          <rect x="150" y="120" width="120" height="68" rx="12" fill="rgba(79,70,229,0.15)" stroke="rgba(79,70,229,0.5)" strokeWidth="1"/>
          <text x="210" y="148" textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="600" fill="#A5B4FC">ИИ-оркестратор</text>
          <text x="210" y="165" textAnchor="middle" fontFamily="inherit" fontSize="9" fill="#818CF8">Make · n8n · GPT-4o</text>

          {/* Output lines */}
          <path d="M270 148 Q295 148 295 80"  fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="6 4" style={{ animation: 'flow-anim 3s linear infinite' }}/>
          <path d="M270 164 Q295 164 295 160" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 4" style={{ animation: 'flow-anim 3s -1s linear infinite' }}/>
          <path d="M270 175 Q295 175 295 240" fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="6 4" style={{ animation: 'flow-anim 3s -2s linear infinite' }}/>

          {/* Output nodes */}
          <rect x="295" y="50"  width="115" height="54" rx="10" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1"/>
          <text x="352" y="72"  textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="600" fill="#6EE7B7">Мгновенный ответ</text>
          <text x="352" y="88"  textAnchor="middle" fontFamily="inherit" fontSize="9" fill="#34D399">за 2 мин вместо 8 ч</text>

          <rect x="295" y="130" width="115" height="54" rx="10" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1"/>
          <text x="352" y="152" textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="600" fill="#6EE7B7">Авто-отчёт</text>
          <text x="352" y="168" textAnchor="middle" fontFamily="inherit" fontSize="9" fill="#34D399">5 мин вместо 4 часов</text>

          <rect x="295" y="210" width="115" height="54" rx="10" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1"/>
          <text x="352" y="232" textAnchor="middle" fontFamily="inherit" fontSize="11" fontWeight="600" fill="#6EE7B7">CRM без рутины</text>
          <text x="352" y="248" textAnchor="middle" fontFamily="inherit" fontSize="9" fill="#34D399">0 ручного ввода</text>

          {/* Animated data particles */}
          <circle r="3.5" fill="#4F46E5" opacity="0.9">
            <animateMotion dur="3s" repeatCount="indefinite" begin="0s">
              <mpath href="#path1"/>
            </animateMotion>
          </circle>
          <circle r="3" fill="#10B981" opacity="0.9">
            <animateMotion dur="3s" repeatCount="indefinite" begin="-1s">
              <mpath href="#path2"/>
            </animateMotion>
          </circle>
          <circle r="3" fill="#4F46E5" opacity="0.9">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="-0.5s">
              <mpath href="#path3"/>
            </animateMotion>
          </circle>
          <defs>
            <path id="path1" d="M130 62 Q175 62 175 148 Q270 148 295 80 Q310 57 295 57"/>
            <path id="path2" d="M130 202 Q165 202 175 178 Q270 175 295 240 Q310 237 295 237"/>
            <path id="path3" d="M130 132 Q165 132 175 148 Q270 164 295 160 Q310 157 295 157"/>
          </defs>
        </svg>
      </div>
    </motion.div>
  )
}

function Hero() {
  const stats = [
    { num: '2–6', label: 'недель до результата' },
    { num: '80%', label: 'рутины исчезает' },
    { num: '0', label: 'штатных IT нужно' },
  ]
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center pt-20 overflow-hidden"
    >
      <Aurora />
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 100%)',
        }}
      />
      <Spotlight />
      <Meteors count={14} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7"
              style={{
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.25)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: '#06B6D4',
                  boxShadow: '0 0 6px #06B6D4',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span className="text-xs font-medium" style={{ color: 'rgba(6,182,212,0.9)' }}>
                ИИ-автоматизация для среднего бизнеса
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="mb-6" style={{ lineHeight: 1.1, letterSpacing: '-0.03em', fontSize: 'clamp(2.1rem, 5vw, 3.9rem)', fontWeight: 800 }}>
              {['Ваша команда тратит', 'часы на то, что', 'можно автоматизировать'].map((line, i) => (
                <motion.span
                  key={i}
                  className="block overflow-hidden"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {i === 1 ? (
                    <>
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        часы
                      </span>
                      {' на то, что'}
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 text-[1.05rem] leading-[1.75] max-w-[520px]"
              style={{ color: 'var(--an-text-2)' }}
            >
              Autonova внедряет ИИ-автоматизацию в бизнес-процессы за 2–6 недель.
              Конкретный результат или честный отказ до старта.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <a
                href="#cta"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[11px] text-[0.96rem] font-semibold text-white relative overflow-hidden transition-all duration-200 group"
                style={{ background: '#4F46E5' }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.cssText += '; box-shadow: 0 0 28px rgba(79,70,229,0.5), 0 0 60px rgba(79,70,229,0.2); transform: translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.boxShadow = ''
                  el.style.transform = ''
                }}
              >
                <span className="relative z-10">Получить бесплатный аудит</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                    animation: 'shimmer-sweep 0.8s ease',
                  }}
                />
              </a>
              <a
                href="#process"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[11px] text-[0.96rem] font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--an-text-2)',
                  border: '1px solid var(--an-border)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(79,70,229,0.4)'
                  el.style.color = 'var(--an-text)'
                  el.style.background = 'rgba(79,70,229,0.08)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--an-border)'
                  el.style.color = 'var(--an-text-2)'
                  el.style.background = 'rgba(255,255,255,0.04)'
                }}
              >
                Как это работает
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-9 flex-wrap"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span
                    className="text-2xl font-extrabold leading-none"
                    style={{
                      color: 'var(--an-green)',
                      letterSpacing: '-0.04em',
                      animation: 'glow-pulse 2s ease-in-out infinite',
                    }}
                  >
                    {s.num}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--an-text-3)' }}>{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: flow diagram */}
          <FlowDiagram />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   PAIN
───────────────────────────────────────────────────────── */

const painItems = [
  {
    icon: Clock,
    title: '3 часа в день — не на продажи',
    desc: 'Менеджер вручную вбивает данные в CRM. 60+ часов в месяц тратится на ввод вместо работы с клиентами.',
  },
  {
    icon: Mail,
    title: 'Лид остыл до утра',
    desc: 'Заявка пришла в 22:00. Менеджер увидел в 9:00. Клиент уже у конкурента — и это происходит каждую неделю.',
  },
  {
    icon: BarChart3,
    title: 'Полдня на один отчёт',
    desc: 'Еженедельный отчёт занимает полдня. Руководитель ждёт цифры — команда собирает их вручную из трёх систем.',
  },
  {
    icon: Lightbulb,
    title: 'ChatGPT без применения',
    desc: 'Попробовали — впечатлило. Как встроить в реальные процессы компании — непонятно. Так и лежит без дела.',
  },
]

function Pain() {
  return (
    <section id="pain" className="py-24 md:py-32" style={{ background: 'var(--an-bg-2)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14">
        <FadeIn className="text-center max-w-[620px] mx-auto mb-16">
          <span className="block mb-3.5 text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--an-accent-2)' }}>
            Знакомо?
          </span>
          <h2 className="font-bold mb-5" style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.9rem)', letterSpacing: '-0.03em', lineHeight: 1.12 }}>
            Узнали себя?
          </h2>
          <p style={{ color: 'var(--an-text-2)', fontSize: '1.05rem', lineHeight: 1.72 }}>
            Это не разовые сбои — это ежедневная норма для большинства команд.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {painItems.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <CardTilt
                className="h-full rounded-[var(--an-radius)] p-7 transition-all duration-300"
                style={{
                  background: 'var(--an-bg-card)',
                  border: '1px solid var(--an-border)',
                  backdropFilter: 'blur(20px)',
                } as React.CSSProperties}
              >
                <div
                  className="w-11 h-11 rounded-[11px] flex items-center justify-center mb-5"
                  style={{ background: 'var(--an-accent-dim)', border: '1px solid rgba(79,70,229,0.2)' }}
                >
                  <item.icon className="w-5 h-5" style={{ stroke: 'var(--an-accent)' }} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold mb-2.5 text-[0.95rem]" style={{ color: 'var(--an-text)' }}>
                  {item.title}
                </h3>
                <p className="text-[0.87rem]" style={{ color: 'var(--an-text-2)', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </CardTilt>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   PROCESS
───────────────────────────────────────────────────────── */

const processSteps = [
  {
    num: '01',
    title: 'Аудит',
    time: '1–2 дня',
    desc: 'Разбираем ваши процессы, находим узкие места, считаем потенциальную экономию. Даём честную оценку — если автоматизация не окупится, скажем это прямо.',
    deliverable: 'Карта процессов + ROI-оценка',
  },
  {
    num: '02',
    title: 'Пилот',
    time: '2–4 недели',
    desc: 'Автоматизируем один ключевой процесс. Вы видите живой результат до того, как принимаете решение о масштабировании.',
    deliverable: 'Работающая автоматизация + метрики',
  },
  {
    num: '03',
    title: 'Система',
    time: '6–8 недель',
    desc: 'Масштабируем на все процессы. Команда обучена и работает самостоятельно. Дашборд с метриками настроен.',
    deliverable: 'Полная система + обученная команда',
  },
]

function Process() {
  return (
    <section id="process" className="py-24 md:py-32" style={{ background: 'var(--an-bg)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14">
        <FadeIn className="text-center max-w-[620px] mx-auto mb-16">
          <span className="block mb-3.5 text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--an-accent-2)' }}>
            Методология
          </span>
          <h2 className="font-bold mb-5" style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.9rem)', letterSpacing: '-0.03em', lineHeight: 1.12 }}>
            Как мы работаем
          </h2>
          <p style={{ color: 'var(--an-text-2)', fontSize: '1.05rem', lineHeight: 1.72 }}>
            Три чётких этапа. Вы видите результат до того, как платите за полное внедрение.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
            {processSteps.map((step, i) => (
              <div
                key={step.num}
                className={cn(
                  'relative p-11 transition-all duration-300 overflow-hidden group',
                  i === 0 && 'rounded-t-[var(--an-radius)] md:rounded-l-[var(--an-radius)] md:rounded-t-none',
                  i === 2 && 'rounded-b-[var(--an-radius)] md:rounded-r-[var(--an-radius)] md:rounded-b-none',
                )}
                style={{
                  background: 'var(--an-bg-card)',
                  border: '1px solid var(--an-border)',
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(90deg, var(--an-accent), var(--an-accent-2))' }}
                />
                <div
                  className="text-[4rem] font-black leading-none mb-5"
                  style={{ color: 'rgba(79,70,229,0.12)', letterSpacing: '-0.06em' }}
                >
                  {step.num}
                </div>
                <div className="text-xl font-bold mb-1.5" style={{ color: 'var(--an-text)' }}>{step.title}</div>
                <div
                  className="text-xs font-semibold uppercase tracking-[0.08em] mb-4"
                  style={{ color: 'var(--an-green)' }}
                >
                  {step.time}
                </div>
                <p className="text-[0.9rem] leading-[1.72] mb-6" style={{ color: 'var(--an-text-2)' }}>
                  {step.desc}
                </p>
                <div
                  className="px-4 py-3 rounded-[9px] text-[0.82rem] font-medium"
                  style={{
                    background: 'var(--an-green-dim)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    color: 'var(--an-green)',
                  }}
                >
                  → {step.deliverable}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   AUTOMATE (BENTO)
───────────────────────────────────────────────────────── */

const automateItems = [
  {
    icon: Users,
    title: 'Обработка лидов',
    before: 'Лид ждёт ответа 8 часов',
    after: 'Обрабатывается за 2 минуты',
    span: 'lg:col-span-2',
  },
  {
    icon: BarChart3,
    title: 'Отчётность',
    before: 'Отчёт вручную — 4 часа',
    after: 'Автоматически за 5 минут',
    span: 'lg:col-span-3',
  },
  {
    icon: MessageCircle,
    title: 'Поддержка клиентов',
    before: 'Менеджер отвечает на всё',
    after: '80% запросов — ИИ',
    span: 'lg:col-span-1',
  },
  {
    icon: FileText,
    title: 'Документооборот',
    before: 'Договор готовится 2 дня',
    after: 'Готов за 15 минут',
    span: 'lg:col-span-3',
  },
  {
    icon: Database,
    title: 'CRM-операции',
    before: '3 часа ручного ввода',
    after: 'Ноль ручных операций',
    span: 'lg:col-span-2',
  },
  {
    icon: Bell,
    title: 'Уведомления и эскалации',
    before: 'Задачи теряются',
    after: 'Автоэскалации по SLA',
    span: 'lg:col-span-1',
  },
]

function Automate() {
  return (
    <section id="automate" className="py-24 md:py-32" style={{ background: 'var(--an-bg-2)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14">
        <FadeIn className="text-center max-w-[620px] mx-auto mb-16">
          <span className="block mb-3.5 text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--an-accent-2)' }}>
            Направления
          </span>
          <h2 className="font-bold mb-5" style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.9rem)', letterSpacing: '-0.03em', lineHeight: 1.12 }}>
            Что автоматизируем
          </h2>
          <p style={{ color: 'var(--an-text-2)', fontSize: '1.05rem', lineHeight: 1.72 }}>
            Конкретные процессы с измеримым результатом — не абстрактные «ИИ-решения».
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {automateItems.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08} className={item.span}>
              <CardTilt
                className="h-full rounded-[var(--an-radius)] p-7 transition-all duration-300"
                glowColor="rgba(16,185,129,0.07)"
                style={{
                  background: 'var(--an-bg-card)',
                  border: '1px solid var(--an-border)',
                  backdropFilter: 'blur(20px)',
                } as React.CSSProperties}
              >
                <div
                  className="w-11 h-11 rounded-[11px] flex items-center justify-center mb-5"
                  style={{ background: 'var(--an-green-dim)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <item.icon className="w-5 h-5" style={{ stroke: 'var(--an-green)' }} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold mb-5 text-[1rem]" style={{ color: 'var(--an-text)' }}>
                  {item.title}
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2.5 text-[0.84rem]" style={{ color: 'var(--an-text-3)' }}>
                    <span className="text-xs opacity-60 pt-0.5 flex-shrink-0">⊘</span>
                    <span>{item.before}</span>
                  </div>
                  <div className="h-px" style={{ background: 'var(--an-border)' }} />
                  <div className="flex items-start gap-2.5 text-[0.84rem] font-medium" style={{ color: 'var(--an-green)' }}>
                    <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{item.after}</span>
                  </div>
                </div>
              </CardTilt>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   PRICING
───────────────────────────────────────────────────────── */

const pricingPlans = [
  {
    name: 'Пилот',
    price: '29 000',
    unit: '₽',
    time: '2 недели',
    features: ['Один процесс под ключ', 'Настройка и интеграция', 'Базовая аналитика', '1 неделя поддержки'],
    cta: 'Начать',
    featured: false,
  },
  {
    name: 'Старт',
    price: '150 000',
    unit: '₽',
    time: '4–6 недель',
    features: ['3–5 процессов', 'Дашборд метрик', 'Обучение команды', '2 недели поддержки', 'Техническая документация'],
    cta: 'Выбрать',
    featured: true,
    badge: 'Рекомендуем',
  },
  {
    name: 'Система',
    price: '250 000',
    unit: '₽',
    time: '6–8 недель',
    features: ['Полный аудит процессов', 'Все приоритетные направления', 'Обучение команды', '4 недели поддержки', 'Расширенная аналитика'],
    cta: 'Обсудить',
    featured: false,
  },
  {
    name: 'Трансформация',
    price: 'от 400 000',
    unit: '₽',
    time: 'индивидуально',
    features: ['Масштабная автоматизация', 'Выделенный менеджер', 'Приоритетная поддержка', 'Кастомные интеграции', 'SLA-соглашение'],
    cta: 'Связаться',
    featured: false,
  },
  {
    name: 'Подписка',
    price: '25–60',
    unit: 'тыс ₽/мес',
    time: 'после внедрения',
    features: ['Поддержка и мониторинг', 'Развитие автоматизаций', 'Новые интеграции', 'Ежемесячный отчёт'],
    cta: 'Подробнее',
    featured: false,
  },
]

function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32" style={{ background: 'var(--an-bg)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14">
        <FadeIn className="text-center max-w-[620px] mx-auto mb-16">
          <span className="block mb-3.5 text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--an-accent-2)' }}>
            Тарифы
          </span>
          <h2 className="font-bold mb-5" style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.9rem)', letterSpacing: '-0.03em', lineHeight: 1.12 }}>
            Прозрачные цены
          </h2>
          <p style={{ color: 'var(--an-text-2)', fontSize: '1.05rem', lineHeight: 1.72 }}>
            Все инструменты и инфраструктура включены. Один счёт в рублях.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3.5">
            {pricingPlans.map((plan) => (
              <CardTilt
                key={plan.name}
                className={cn(
                  'flex flex-col gap-4 rounded-[var(--an-radius)] p-6 relative overflow-hidden transition-all duration-300',
                  plan.featured && 'ring-1 ring-[rgba(79,70,229,0.6)]',
                )}
                style={{
                  background: plan.featured ? 'rgba(79,70,229,0.07)' : 'var(--an-bg-card)',
                  border: plan.featured ? '1px solid rgba(79,70,229,0.5)' : '1px solid var(--an-border)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: plan.featured ? '0 0 50px rgba(79,70,229,0.22)' : 'none',
                } as React.CSSProperties}
              >
                {plan.featured && <BorderBeam />}
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      boxShadow: '0 2px 12px rgba(79,70,229,0.5)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.1em] mb-2" style={{ color: 'var(--an-text-3)' }}>
                    {plan.name}
                  </div>
                  <div className="text-[1.55rem] font-extrabold leading-none tracking-tight" style={{ color: 'var(--an-text)' }}>
                    {plan.price}{' '}
                    <span className="text-[0.84rem] font-medium" style={{ color: 'var(--an-text-3)' }}>{plan.unit}</span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--an-text-3)' }}>{plan.time}</div>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.84rem]" style={{ color: 'var(--an-text-2)' }}>
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0"
                        style={{ background: 'var(--an-accent)' }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className="block text-center py-2.5 rounded-[9px] text-[0.86rem] font-semibold transition-all duration-200"
                  style={plan.featured ? {
                    background: 'linear-gradient(135deg, #4F46E5, #6D28D9)',
                    color: 'white',
                    boxShadow: '0 2px 16px rgba(79,70,229,0.4)',
                    border: 'none',
                  } : {
                    border: '1px solid var(--an-border)',
                    color: 'var(--an-text-2)',
                  }}
                  onMouseEnter={e => {
                    if (!plan.featured) {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'rgba(79,70,229,0.4)'
                      el.style.color = 'var(--an-text)'
                      el.style.background = 'var(--an-accent-dim)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!plan.featured) {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'var(--an-border)'
                      el.style.color = 'var(--an-text-2)'
                      el.style.background = 'transparent'
                    }
                  }}
                >
                  {plan.cta}
                </a>
              </CardTilt>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="text-center mt-8">
          <p className="text-[0.87rem]" style={{ color: 'var(--an-text-3)' }}>
            <strong style={{ color: 'var(--an-text-2)', fontWeight: 500 }}>Инфраструктура включена.</strong>{' '}
            Один счёт в рублях. Без скрытых платежей за инструменты и серверы.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────── */

const stackChips = ['Make', 'n8n', 'OpenAI API', 'Anthropic API', 'Notion', 'Airtable']
const values = ['Результат, не процесс', 'Честность до старта', 'Скорость запуска', 'Простота управления']

function About() {
  return (
    <section id="about" className="py-24 md:py-32" style={{ background: 'var(--an-bg-2)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14">
        <FadeIn className="text-center max-w-[620px] mx-auto mb-16">
          <span className="block mb-3.5 text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--an-accent-2)' }}>
            Команда
          </span>
          <h2 className="font-bold" style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.9rem)', letterSpacing: '-0.03em', lineHeight: 1.12 }}>
            Кто за этим стоит
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <FadeIn>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div
                  className="w-16 h-16 rounded-[18px] flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
                  }}
                >
                  ПС
                </div>
                <div>
                  <div className="font-bold text-lg" style={{ color: 'var(--an-text)' }}>Павел Симонов</div>
                  <div className="text-[0.84rem]" style={{ color: 'var(--an-text-3)' }}>Основатель Autonova · Head of Product 12+ лет</div>
                </div>
              </div>
              <p
                className="text-[1rem] leading-[1.78] pl-5"
                style={{
                  color: 'var(--an-text-2)',
                  borderLeft: '2px solid var(--an-accent)',
                }}
              >
                «Я прошёл путь от операционного хаоса к системному бизнесу.
                Autonova — это то, что я сам хотел бы получить 5 лет назад:
                конкретную автоматизацию без лишних слов и с измеримым результатом.»
              </p>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.1em] mb-3.5" style={{ color: 'var(--an-text-3)' }}>
                  Рабочий стек
                </div>
                <div className="flex flex-wrap gap-2">
                  {stackChips.map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1.5 rounded-[7px] text-[0.79rem] font-medium transition-all duration-200 cursor-default"
                      style={{
                        background: 'var(--an-bg-card)',
                        border: '1px solid var(--an-border)',
                        color: 'var(--an-text-2)',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = 'rgba(79,70,229,0.4)'
                        el.style.color = 'var(--an-text)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = 'var(--an-border)'
                        el.style.color = 'var(--an-text-2)'
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {values.map((v) => (
                <div
                  key={v}
                  className="flex items-center gap-2.5 rounded-[var(--an-radius)] p-4 text-[0.87rem] font-medium transition-all duration-200"
                  style={{
                    background: 'var(--an-bg-card)',
                    border: '1px solid var(--an-border)',
                    color: 'var(--an-text-2)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: 'var(--an-green)', boxShadow: '0 0 6px var(--an-green)' }}
                  />
                  {v}
                </div>
              ))}
            </div>
            <div
              className="rounded-[var(--an-radius)] p-9 text-center"
              style={{
                background: 'var(--an-bg-card)',
                border: '1px dashed rgba(255,255,255,0.1)',
              }}
            >
              <p className="text-[0.9rem]" style={{ color: 'var(--an-text-3)' }}>
                <strong style={{ color: 'var(--an-text-2)' }}>Кейсы появятся в июне 2026</strong>
              </p>
              <p className="text-[0.84rem] mt-2" style={{ color: 'var(--an-text-3)' }}>
                Сейчас работаем с пилотными клиентами. Первые измеримые результаты — скоро.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────── */

const faqItems = [
  {
    q: 'Это сложно внедрять?',
    a: 'Нет. Мы берём на себя всё: настройку, интеграцию, тестирование. От вас нужно 2–3 часа на бриф в начале и финальную приёмку в конце. Всё остальное — наша ответственность.',
  },
  {
    q: 'А если автоматизация не взлетит?',
    a: 'Скажем до начала работы. Если на этапе аудита видим, что потенциал меньше стоимости внедрения — честно откажем от проекта. Это не продажа любой ценой.',
  },
  {
    q: 'Сотрудники не примут изменения?',
    a: 'Обучение входит в каждый пакет. Мы запускаем с теми, кто хочет работать по-новому, — и по опыту остальные присоединяются сами, когда видят результат.',
  },
  {
    q: 'Нужен штатный IT-специалист?',
    a: 'Нет. Мы работаем на no-code и low-code инструментах: Make, n8n, Airtable, Notion. Ваша команда сможет управлять ими без программирования после обучения.',
  },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 md:py-32" style={{ background: 'var(--an-bg)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14">
        <FadeIn className="text-center max-w-[620px] mx-auto mb-16">
          <span className="block mb-3.5 text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--an-accent-2)' }}>
            Частые вопросы
          </span>
          <h2 className="font-bold" style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.9rem)', letterSpacing: '-0.03em', lineHeight: 1.12 }}>
            Закрываем сомнения
          </h2>
        </FadeIn>

        <div className="max-w-[780px] mx-auto flex flex-col gap-2.5">
          {faqItems.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.08}>
              <div
                className="rounded-[var(--an-radius)] overflow-hidden transition-all duration-200 cursor-pointer"
                style={{
                  background: 'var(--an-bg-card)',
                  border: open === i ? '1px solid rgba(79,70,229,0.3)' : '1px solid var(--an-border)',
                  backdropFilter: 'blur(20px)',
                }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4 p-5 md:p-6 select-none">
                  <span className="font-semibold text-[0.97rem]" style={{ color: 'var(--an-text)' }}>
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0"
                  >
                    <Plus className="w-5 h-5" style={{ stroke: open === i ? 'var(--an-accent)' : 'var(--an-text-3)' }} />
                  </motion.div>
                </div>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-5 md:px-6 pb-5 text-[0.9rem] leading-[1.72]"
                        style={{ color: 'var(--an-text-2)' }}
                      >
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   CTA / FORM
───────────────────────────────────────────────────────── */

function Cta() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [errors, setErrors] = useState({ name: false, contact: false })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = { name: !name.trim(), contact: !contact.trim() }
    setErrors(errs)
    if (errs.name || errs.contact) return
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim() }),
      })
      if (res.ok) setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="cta" className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'var(--an-bg-2)' }}>
      {/* Ambient glow */}
      <div
        className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(79,70,229,0.16) 0%, transparent 65%)' }}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14 relative z-10">
        <FadeIn>
          <div
            className="max-w-[720px] mx-auto text-center rounded-[26px] relative"
            style={{
              background: 'var(--an-bg-card)',
              border: '1px solid var(--an-border)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 100px rgba(79,70,229,0.12)',
              padding: 'clamp(44px, 6vw, 76px) clamp(28px, 5vw, 68px)',
            }}
          >
            <span className="block mb-4 text-[0.7rem] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--an-accent-2)' }}>
              Бесплатный аудит
            </span>
            <h2
              className="font-bold mb-4"
              style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.12, color: 'var(--an-text)' }}
            >
              Один созвон — и вы узнаете, что можно автоматизировать уже сейчас
            </h2>
            <p className="mb-10 text-[1rem]" style={{ color: 'var(--an-text-2)', lineHeight: 1.72 }}>
              Разберём ваши процессы и дадим конкретный план. Не продажа — честный разбор.
            </p>

            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3.5 max-w-[460px] mx-auto"
                  noValidate
                >
                  {[
                    { value: name, setter: setName, placeholder: 'Ваше имя', field: 'name' as const, type: 'text' },
                    { value: contact, setter: setContact, placeholder: 'Телефон или Telegram (@username)', field: 'contact' as const, type: 'text' },
                  ].map(({ value, setter, placeholder, field, type }) => (
                    <input
                      key={field}
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={e => {
                        setter(e.target.value)
                        setErrors(prev => ({ ...prev, [field]: false }))
                      }}
                      className="w-full rounded-[12px] px-5 py-4 text-[0.95rem] outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: errors[field] ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--an-text)',
                        fontFamily: 'inherit',
                        boxShadow: errors[field] ? '0 0 0 3px rgba(239,68,68,0.15)' : 'none',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = 'var(--an-accent)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.15), inset 0 0 20px rgba(79,70,229,0.04)'
                        e.currentTarget.style.background = 'rgba(79,70,229,0.04)'
                      }}
                      onBlur={e => {
                        if (!errors[field]) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                          e.currentTarget.style.boxShadow = 'none'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        }
                      }}
                    />
                  ))}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-[11px] py-4 font-semibold text-white transition-all duration-200 relative overflow-hidden group"
                    style={{
                      background: loading ? 'rgba(79,70,229,0.5)' : '#4F46E5',
                      fontSize: '0.96rem',
                    }}
                    onMouseEnter={e => {
                      if (!loading) {
                        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(79,70,229,0.5)'
                        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.boxShadow = ''
                      ;(e.currentTarget as HTMLElement).style.transform = ''
                    }}
                  >
                    {loading ? 'Отправляем...' : 'Записаться на разбор'}
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
                        animation: 'shimmer-sweep 0.8s ease',
                      }}
                    />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-4 py-5 px-6 rounded-[14px] max-w-[460px] mx-auto"
                  style={{
                    background: 'var(--an-green-dim)',
                    border: '1px solid rgba(16,185,129,0.3)',
                  }}
                >
                  <Check className="w-8 h-8" style={{ stroke: 'var(--an-green)' }} />
                  <p className="font-medium" style={{ color: 'var(--an-green)' }}>
                    Заявка принята. Свяжемся в ближайшее время — обычно в течение часа.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-5 text-[0.79rem]" style={{ color: 'var(--an-text-3)' }}>
              Бесплатно. 30 минут. Конкретный план, не продажа.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer
      className="py-10"
      style={{
        background: 'var(--an-bg)',
        borderTop: '1px solid var(--an-border)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-14 flex flex-col md:flex-row items-center md:justify-between gap-5 text-center md:text-left">
        <div>
          <a href="#" className="inline-flex items-center gap-2.5 no-underline mb-2.5">
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 0 16px rgba(79,70,229,0.5)' }}
            >
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-[1.05rem] tracking-tight" style={{ color: 'var(--an-text)' }}>Autonova</span>
          </a>
          <div className="text-[0.82rem] leading-[1.8]" style={{ color: 'var(--an-text-3)' }}>
            ИИ-автоматизация с измеримым результатом<br />
            ИП Симонов П.А. &nbsp;·&nbsp; ИНН 344812618592
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <a
            href="https://t.me/autonova"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[0.85rem] no-underline transition-colors duration-200"
            style={{ color: 'var(--an-text-3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--an-text-2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--an-text-3)' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.18 13.09l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.968.469z"/>
            </svg>
            Telegram
          </a>
          <a
            href="mailto:simonov.paul@gmail.com"
            className="flex items-center gap-1.5 text-[0.85rem] no-underline transition-colors duration-200"
            style={{ color: 'var(--an-text-3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--an-text-2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--an-text-3)' }}
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */

export default function Page() {
  return (
    <main>
      <Nav />
      <Hero />
      <Pain />
      <Process />
      <Automate />
      <Pricing />
      <About />
      <Faq />
      <Cta />
      <Footer />
    </main>
  )
}
