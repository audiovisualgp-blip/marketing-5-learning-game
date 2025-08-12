'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, BookOpen, Target, CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react'

interface Question {
  id: number
  module: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'fácil' | 'medio' | 'difícil'
}

interface GameState {
  currentModule: number | null
  currentQuestion: number
  score: number
  totalQuestions: number
  answeredQuestions: number[]
  showResults: boolean
  moduleProgress: Record<number, number>
}

const questions: Question[] = [
  // Módulo 1: Web 2.0 a Web 3 y Metaverso
  {
    id: 1,
    module: 1,
    question: "¿Cuál es la característica principal de la Web 1.0?",
    options: [
      "Interactiva y social",
      "Estática y de solo lectura",
      "Descentralizada con blockchain",
      "Inteligente y emocional"
    ],
    correctAnswer: 1,
    explanation: "La Web 1.0 era estática y de solo lectura, similar a una biblioteca digital donde las empresas creaban páginas web como folletos online sin interacción.",
    difficulty: "fácil"
  },
  {
    id: 2,
    module: 1,
    question: "¿Qué tecnología es fundamental para la Web3?",
    options: [
      "Redes sociales",
      "Realidad virtual",
      "Blockchain",
      "Inteligencia artificial"
    ],
    correctAnswer: 2,
    explanation: "El blockchain es la tecnología fundamental que permite la descentralización en la Web3, creando un sistema seguro y transparente sin autoridades centrales.",
    difficulty: "fácil"
  },
  {
    id: 3,
    module: 1,
    question: "¿Qué NO es el metaverso?",
    options: [
      "Un espacio virtual colectivo y compartido",
      "Un solo videojuego específico",
      "Una red de mundos 3D persistentes",
      "Un entorno con economía propia"
    ],
    correctAnswer: 1,
    explanation: "El metaverso no es un solo videojuego. Plataformas como Roblox o Fortnite son protometaversos, pero ninguna es 'el' metaverso por sí sola.",
    difficulty: "medio"
  },
  {
    id: 4,
    module: 1,
    question: "¿Qué permite la Realidad Aumentada (AR) en marketing?",
    options: [
      "Sumergir al usuario en un mundo completamente digital",
      "Superponer información digital sobre el mundo real",
      "Crear tokens no fungibles",
      "Descentralizar los datos del usuario"
    ],
    correctAnswer: 1,
    explanation: "La Realidad Aumentada complementa la realidad superponiendo información digital sobre el mundo físico a través de la cámara de un dispositivo.",
    difficulty: "medio"
  },
  {
    id: 5,
    module: 1,
    question: "¿Cómo transforman los NFTs los programas de fidelización?",
    options: [
      "Haciendo que los puntos caduquen más rápido",
      "Convirtiendo las recompensas en activos digitales con propiedad real",
      "Eliminando la necesidad de programas de lealtad",
      "Centralizando el control de las marcas sobre los clientes"
    ],
    correctAnswer: 1,
    explanation: "Los NFTs transforman la fidelización al convertir las recompensas en activos digitales que los clientes poseen realmente, pudiendo conservarlos, regalarlos o venderlos.",
    difficulty: "difícil"
  },

  // Módulo 2: Publicidad en la era de la IA
  {
    id: 6,
    module: 2,
    question: "¿Qué es el marketing de permiso?",
    options: [
      "Interrumpir al consumidor con mensajes masivos",
      "Solicitar permiso para comunicarse con los usuarios",
      "Utilizar cookies de terceros sin consentimiento",
      "Crear anuncios intrusivos en redes sociales"
    ],
    correctAnswer: 1,
    explanation: "El marketing de permiso, acuñado por Seth Godin, se basa en solicitar permiso para comunicarse con los usuarios en lugar de interrumpirlos.",
    difficulty: "fácil"
  },
  {
    id: 7,
    module: 2,
    question: "¿Qué es la publicidad programática?",
    options: [
      "Publicidad en programas de televisión",
      "Compra automatizada de espacios publicitarios online en tiempo real",
      "Publicidad tradicional en periódicos",
      "Marketing de influencers"
    ],
    correctAnswer: 1,
    explanation: "La publicidad programática es la compra automatizada de espacios publicitarios online en tiempo real mediante pujas instantáneas (RTB).",
    difficulty: "fácil"
  },
  {
    id: 8,
    module: 2,
    question: "¿Qué permite la IA Generativa en la creatividad publicitaria?",
    options: [
      "Solo analizar datos existentes",
      "Crear contenido completamente nuevo y original",
      "Eliminar la necesidad de creativos humanos",
      "Reducir la calidad del contenido publicitario"
    ],
    correctAnswer: 1,
    explanation: "La IA Generativa puede crear contenido completamente nuevo y original como textos, imágenes y vídeos a partir de instrucciones en lenguaje natural.",
    difficulty: "medio"
  },
  {
    id: 9,
    module: 2,
    question: "¿Qué característica define la publicidad nativa?",
    options: [
      "Ser muy intrusiva y llamativa",
      "Adaptarse al formato y estilo del medio donde aparece",
      "Utilizar solo formatos de banner",
      "Estar limitada a la televisión"
    ],
    correctAnswer: 1,
    explanation: "La publicidad nativa se adapta al formato, estilo y tono del medio donde aparece, integrándose de forma natural y menos intrusiva.",
    difficulty: "medio"
  },
  {
    id: 10,
    module: 2,
    question: "¿Cómo impacta el fin de las cookies de terceros en el marketing digital?",
    options: [
      "No tiene ningún impacto",
      "Obliga a centrarse en datos de origen y consentimiento explícito",
      "Facilita el seguimiento sin permiso",
      "Aumenta la efectividad de la publicidad intrusiva"
    ],
    correctAnswer: 1,
    explanation: "El fin de las cookies de terceros obliga a las marcas a centrarse en datos de origen (first-party data) y obtener consentimiento explícito de los usuarios.",
    difficulty: "difícil"
  },

  // Módulo 3: Email Marketing y Automatización
  {
    id: 11,
    module: 3,
    question: "¿Qué hace la IA en el email marketing moderno?",
    options: [
      "Solo envía correos masivos",
      "Permite hiperpersonalización avanzada usando datos en tiempo real",
      "Elimina la necesidad de contenido relevante",
      "Reduce la tasa de apertura"
    ],
    correctAnswer: 1,
    explanation: "La IA permite la hiperpersonalización avanzada en email marketing, utilizando datos y comportamiento en tiempo real para crear contenidos dinámicos y relevantes.",
    difficulty: "fácil"
  },
  {
    id: 12,
    module: 3,
    question: "¿Qué es el Marketing Automation?",
    options: [
      "Enviar emails manualmente",
      "Creación de flujos de trabajo inteligentes y omnicanal",
      "Solo utilizar redes sociales",
      "Eliminación de toda automatización"
    ],
    correctAnswer: 1,
    explanation: "El Marketing Automation implica la creación de flujos de trabajo inteligentes que operan en múltiples canales (email, SMS, notificaciones push) de forma automatizada.",
    difficulty: "fácil"
  },
  {
    id: 13,
    module: 3,
    question: "¿Qué permite el análisis predictivo en email marketing?",
    options: [
      "Solo ver datos históricos",
      "Anticipar las necesidades del cliente y optimizar campañas",
      "Eliminar la necesidad de segmentación",
      "Reducir la personalización"
    ],
    correctAnswer: 1,
    explanation: "El análisis predictivo permite anticipar las necesidades del cliente y optimizar las campañas basándose en patrones de comportamiento y datos históricos.",
    difficulty: "medio"
  },
  {
    id: 14,
    module: 3,
    question: "¿Cómo cambia el 'lead nurturing' en la era de la IA?",
    options: [
      "Se vuelve menos personalizado",
      "Se centra en construir relaciones humanas y relevantes",
      "Elimina la necesidad de seguimiento",
      "Solo utiliza comunicación masiva"
    ],
    correctAnswer: 1,
    explanation: "El lead nurturing evoluciona para centrarse en la construcción de relaciones relevantes y humanas, utilizando la IA para personalizar cada interacción.",
    difficulty: "medio"
  },
  {
    id: 15,
    module: 3,
    question: "¿Qué marco jurídico es crucial para el email marketing en Europa?",
    options: [
      "No hay regulación específica",
      "GDPR (Reglamento General de Protección de Datos)",
      "Solo leyes estadounidenses",
      "Regulaciones voluntarias"
    ],
    correctAnswer: 1,
    explanation: "El GDPR es el marco jurídico crucial que regula la gestión ética de los datos y el consentimiento en el email marketing en Europa.",
    difficulty: "difícil"
  },

  // Módulo 4: SEO y SEM en la era de la IA
  {
    id: 16,
    module: 4,
    question: "¿Qué caracteriza al nuevo SEO en la era de la IA?",
    options: [
      "Solo palabras clave exactas",
      "Búsqueda por voz, visual e impacto de algoritmos de IA",
      "Ignorar la intención del usuario",
      "Centrarse solo en enlaces"
    ],
    correctAnswer: 1,
    explanation: "El nuevo SEO se caracteriza por la búsqueda por voz, búsqueda visual y el impacto de algoritmos de IA como RankBrain, que entienden mejor la intención del usuario.",
    difficulty: "fácil"
  },
  {
    id: 17,
    module: 4,
    question: "¿Qué es el SEO semántico?",
    options: [
      "Usar solo sinónimos",
      "Responder a la intención del usuario con contenido contextual",
      "Ignorar el contexto",
      "Centrarse solo en densidad de palabras clave"
    ],
    correctAnswer: 1,
    explanation: "El SEO semántico se enfoca en responder a la intención del usuario mediante contenido contextual y relevante, más allá de simples palabras clave.",
    difficulty: "fácil"
  },
  {
    id: 18,
    module: 4,
    question: "¿Cómo optimiza la IA las campañas SEM?",
    options: [
      "Solo crea anuncios simples",
      "Optimiza pujas, segmentación predictiva y anuncios dinámicos",
      "Elimina la necesidad de análisis",
      "Reduce la personalización"
    ],
    correctAnswer: 1,
    explanation: "La IA optimiza las campañas SEM mediante la optimización de pujas en tiempo real, segmentación predictiva y creación de anuncios dinámicos y personalizados.",
    difficulty: "medio"
  },
  {
    id: 19,
    module: 4,
    question: "¿Qué es el SEO en redes sociales?",
    options: [
      "No existe tal concepto",
      "Optimizar perfiles para ser encontrados en búsquedas",
      "Solo publicar contenido sin estrategia",
      "Ignorar las palabras clave"
    ],
    correctAnswer: 1,
    explanation: "El SEO en redes sociales consiste en optimizar los perfiles y contenido para mejorar su visibilidad y ser encontrados en búsquedas dentro y fuera de las plataformas.",
    difficulty: "medio"
  },
  {
    id: 20,
    module: 4,
    question: "¿Qué ventajas ofrecen las herramientas de IA para SEO?",
    options: [
      "Solo análisis básico",
      "Análisis avanzado de intención, contenido y rendimiento",
      "Eliminan la necesidad de estrategia",
      "Solo funcionan para sitios pequeños"
    ],
    correctAnswer: 1,
    explanation: "Las herramientas de IA para SEO ofrecen análisis avanzado de intención de búsqueda, optimización de contenido y análisis predictivo de rendimiento.",
    difficulty: "difícil"
  },

  // Módulo 5: Social Media Marketing
  {
    id: 21,
    module: 5,
    question: "¿Cuáles son las tendencias clave en redes sociales para 2025?",
    options: [
      "Solo texto largo y estático",
      "Vídeos cortos, autenticidad y construcción de comunidades",
      "Ignorar la interacción",
      "Contenido solo profesional y formal"
    ],
    correctAnswer: 1,
    explanation: "Las tendencias clave para 2025 se centran en vídeos cortos, autenticidad del contenido y la construcción de comunidades activas y comprometidas.",
    difficulty: "fácil"
  },
  {
    id: 22,
    module: 5,
    question: "¿Qué es la Creator Economy?",
    options: [
      "Solo celebridades tradicionales",
      "Colaboración con influencers, micro-influencers y embajadores",
      "Eliminación de todo contenido creado",
      "Solo marcas sin personas"
    ],
    correctAnswer: 1,
    explanation: "La Creator Economy implica colaborar con creadores de contenido, influencers y micro-influencers para llegar a audiencias de forma auténtica.",
    difficulty: "fácil"
  },
  {
    id: 23,
    module: 5,
    question: "¿Qué es el Social Commerce?",
    options: [
      "Solo publicidad en redes",
      "Integración de compras directamente en plataformas sociales",
      "Compras solo en tiendas físicas",
      "Eliminación de transacciones online"
    ],
    correctAnswer: 1,
    explanation: "El Social Commerce integra la experiencia de compra directamente en las plataformas sociales, permitiendo comprar sin abandonar la aplicación.",
    difficulty: "medio"
  },
  {
    id: 24,
    module: 5,
    question: "¿Qué es el UGC (User Generated Content)?",
    options: [
      "Contenido creado solo por marcas",
      "Contenido generado por usuarios que fomenta confianza",
      "Contenido pagado",
      "Solo contenido profesional"
    ],
    correctAnswer: 1,
    explanation: "El UGC es contenido generado por usuarios que ayuda a fomentar la confianza y autenticidad de la marca mediante testimonios reales.",
    difficulty: "medio"
  },
  {
    id: 25,
    module: 5,
    question: "¿Qué es el Social CRM?",
    options: [
      "Solo recopilar seguidores",
      "Atención conversacional y gestión de relaciones en redes sociales",
      "Ignorar mensajes de clientes",
      "Solo publicar contenido"
    ],
    correctAnswer: 1,
    explanation: "El Social CRM combina la gestión de relaciones con clientes con la atención conversacional en redes sociales para construir relaciones duraderas.",
    difficulty: "difícil"
  },

  // Módulo 6: Marketing Viral y Storytelling
  {
    id: 26,
    module: 6,
    question: "¿Qué caracteriza la nueva viralidad?",
    options: [
      "Solo memes sin sentido",
      "Conexión emocional más allá del entretenimiento superficial",
      "Contenido solo para expertos",
      "Ignorar la audiencia"
    ],
    correctAnswer: 1,
    explanation: "La nueva viralidad se basa en crear conexiones emocionales profundas con la audiencia, más allá de simples memes o entretenimiento pasajero.",
    difficulty: "fácil"
  },
  {
    id: 27,
    module: 6,
    question: "¿Qué es el Storytelling Transmedia?",
    options: [
      "Contar una historia solo en un medio",
      "Narrar historias a través de múltiples plataformas de forma coherente",
      "Solo usar texto",
      "Ignorar la audiencia"
    ],
    correctAnswer: 1,
    explanation: "El Storytelling Transmedia consiste en contar historias de manera coherente a través de múltiples plataformas, creando una experiencia narrativa más rica.",
    difficulty: "fácil"
  },
  {
    id: 28,
    module: 6,
    question: "¿Cómo ayuda la IA en la identificación de contenido viral?",
    options: [
      "No tiene ninguna utilidad",
      "Analiza tendencias y predice potencial viral mediante datos",
      "Solo crea contenido aleatorio",
      "Elimina la creatividad"
    ],
    correctAnswer: 1,
    explanation: "La IA ayuda a identificar tendencias y predecir el potencial viral del contenido mediante el análisis de grandes volúmenes de datos y patrones de comportamiento.",
    difficulty: "medio"
  },
  {
    id: 29,
    module: 6,
    question: "¿Qué hace que el contenido sea más compartible?",
    options: [
      "Solo ser muy largo",
      "Formatos y narrativas que generan conexión emocional",
      "Contenido solo técnico",
      "Ignorar la audiencia"
    ],
    correctAnswer: 1,
    explanation: "El contenido compartible utiliza formatos y narrativas que generan conexión emocional, ofrecen valor o provocan reacciones que motivan el compartir.",
    difficulty: "medio"
  },
  {
    id: 30,
    module: 6,
    question: "¿Qué elementos analizan los casos de estudio de campañas virales?",
    options: [
      "Solo el número de likes",
      "Estrategia, ejecución, contexto y factores de éxito",
      "Solo el presupuesto",
      "Solo el canal utilizado"
    ],
    correctAnswer: 1,
    explanation: "Los casos de estudio analizan la estrategia completa, ejecución, contexto del mercado y los factores clave que contribuyeron al éxito de la campaña viral.",
    difficulty: "difícil"
  },

  // Módulo 7: Gestión de Reputación Online
  {
    id: 31,
    module: 7,
    question: "¿Por qué la reputación digital es un activo estratégico?",
    options: [
      "No tiene valor comercial",
      "Afecta la confianza, percepción y decisiones de compra",
      "Solo importa para grandes empresas",
      "Se construye rápidamente sin esfuerzo"
    ],
    correctAnswer: 1,
    explanation: "La reputación digital es un activo estratégico porque afecta directamente la confianza de los clientes, la percepción de marca y las decisiones de compra.",
    difficulty: "fácil"
  },
  {
    id: 32,
    module: 7,
    question: "¿Qué permiten las herramientas de IA en la monitorización de reputación?",
    options: [
      "Solo contar menciones",
      "Análisis de sentimiento y detección temprana de crisis",
      "Solo revisar manualmente",
      "Ignorar las redes sociales"
    ],
    correctAnswer: 1,
    explanation: "Las herramientas de IA permiten el análisis de sentimiento en tiempo real y la detección temprana de crisis antes de que escalen.",
    difficulty: "fácil"
  },
  {
    id: 33,
    module: 7,
    question: "¿Qué es una estrategia proactiva de reputación?",
    options: [
      "Solo reaccionar a crisis",
      "Construir activamente una imagen positiva antes de problemas",
      "Ignorar la opinión pública",
      "Solo usar publicidad"
    ],
    correctAnswer: 1,
    explanation: "Una estrategia proactiva se enfoca en construir activamente una reputación positiva mediante acciones consistentes antes de que surjan problemas.",
    difficulty: "medio"
  },
  {
    id: 34,
    module: 7,
    question: "¿Cómo afectan las reseñas falsas generadas por IA?",
    options: [
      "No tienen ningún impacto",
      "Pueden dañar la confianza y requieren estrategias de detección",
      "Siempre son positivas",
      "Son fáciles de identificar"
    ],
    correctAnswer: 1,
    explanation: "Las reseñas falsas generadas por IA pueden dañar significativamente la confianza y requieren estrategias avanzadas de detección y autenticación.",
    difficulty: "medio"
  },
  {
    id: 35,
    module: 7,
    question: "¿Por qué la transparencia es crucial en la reputación online?",
    options: [
      "No es importante",
      "Es fundamental para construir confianza a largo plazo",
      "Solo importa en crisis",
      "Se puede ignorar fácilmente"
    ],
    correctAnswer: 1,
    explanation: "La transparencia es fundamental para construir y mantener la confianza a largo plazo con los clientes y el público en general.",
    difficulty: "difícil"
  },

  // Módulo 8: Analítica Digital Predictiva
  {
    id: 36,
    module: 8,
    question: "¿Qué es una cultura 'data-driven'?",
    options: [
      "Ignorar los datos",
      "Basar decisiones en análisis de datos y evidencia",
      "Solo usar intuición",
      "Tomar decisiones aleatorias"
    ],
    correctAnswer: 1,
    explanation: "Una cultura 'data-driven' se basa en tomar decisiones estratégicas fundamentadas en el análisis de datos y evidencia concreta.",
    difficulty: "fácil"
  },
  {
    id: 37,
    module: 8,
    question: "¿Qué permite el análisis predictivo?",
    options: [
      "Solo ver el pasado",
      "Anticipar tendencias y comportamientos futuros",
      "Solo contar visitas",
      "Ignorar patrones"
    ],
    correctAnswer: 1,
    explanation: "El análisis predictivo utiliza IA y machine learning para anticipar tendencias futuras y comportamientos del consumidor basándose en datos históricos.",
    difficulty: "fácil"
  },
  {
    id: 38,
    module: 8,
    question: "¿Qué es la medición omnicanal?",
    options: [
      "Medir solo un canal",
      "Analizar el customer journey completo a través de múltiples canales",
      "Ignorar algunos canales",
      "Solo medir ventas"
    ],
    correctAnswer: 1,
    explanation: "La medición omnicanal analiza el viaje completo del cliente a través de todos los puntos de contacto y canales para entender mejor su comportamiento.",
    difficulty: "medio"
  },
  {
    id: 39,
    module: 8,
    question: "¿Qué es la analítica centrada en la privacidad?",
    options: [
      "Ignorar la privacidad",
      "Adaptar análisis a un mundo con menos datos de terceros",
      "Solo usar cookies",
      "Compartir datos sin consentimiento"
    ],
    correctAnswer: 1,
    explanation: "La analítica centrada en la privacidad se adapta al nuevo entorno con restricciones de datos, utilizando fuentes éticas y consentimiento explícito.",
    difficulty: "medio"
  },
  {
    id: 40,
    module: 8,
    question: "¿Qué habilidades necesita el nuevo analista digital?",
    options: [
      "Solo técnicas básicas",
      "Combinación de habilidades técnicas y visión estratégica",
      "Solo creatividad",
      "Solo conocimiento de marketing tradicional"
    ],
    correctAnswer: 1,
    explanation: "El nuevo analista digital necesita combinar habilidades técnicas (datos, herramientas) con visión estratégica para interpretar resultados y tomar decisiones.",
    difficulty: "difícil"
  }
]

const modules = [
  { id: 1, title: "Web 2.0 a Web 3 y Metaverso", icon: "🌐", color: "bg-blue-500" },
  { id: 2, title: "Publicidad en la Era de la IA", icon: "🤖", color: "bg-purple-500" },
  { id: 3, title: "Email Marketing y Automatización", icon: "📧", color: "bg-green-500" },
  { id: 4, title: "SEO y SEM en la Era de la IA", icon: "🔍", color: "bg-orange-500" },
  { id: 5, title: "Social Media Marketing", icon: "📱", color: "bg-pink-500" },
  { id: 6, title: "Marketing Viral y Storytelling", icon: "📖", color: "bg-red-500" },
  { id: 7, title: "Gestión de Reputación Online", icon: "⭐", color: "bg-yellow-500" },
  { id: 8, title: "Analítica Digital Predictiva", icon: "📊", color: "bg-indigo-500" }
]

export default function Marketing5LearningGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentModule: null,
    currentQuestion: 0,
    score: 0,
    totalQuestions: 0,
    answeredQuestions: [],
    showResults: false,
    moduleProgress: {}
  })

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const currentQuestions = gameState.currentModule 
    ? questions.filter(q => q.module === gameState.currentModule)
    : []

  const currentQuestion = currentQuestions[gameState.currentQuestion]

  const startGame = () => {
    setGameStarted(true)
  }

  const selectModule = (moduleId: number) => {
    setGameState(prev => ({
      ...prev,
      currentModule: moduleId,
      currentQuestion: 0,
      score: 0,
      totalQuestions: questions.filter(q => q.module === moduleId).length,
      answeredQuestions: [],
      showResults: false
    }))
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const newScore = isCorrect ? gameState.score + 1 : gameState.score

    setTimeout(() => {
      setGameState(prev => {
        const nextQuestion = prev.currentQuestion + 1
        const moduleQuestions = questions.filter(q => q.module === prev.currentModule!)
        const isModuleComplete = nextQuestion >= moduleQuestions.length

        return {
          ...prev,
          score: newScore,
          answeredQuestions: [...prev.answeredQuestions, currentQuestion.id],
          currentQuestion: isModuleComplete ? 0 : nextQuestion,
          showResults: isModuleComplete,
          moduleProgress: {
            ...prev.moduleProgress,
            [prev.currentModule!]: isModuleComplete ? 100 : Math.round((nextQuestion / moduleQuestions.length) * 100)
          }
        }
      })

      setSelectedAnswer(null)
      setShowExplanation(false)
    }, 3000)
  }

  const resetGame = () => {
    setGameState({
      currentModule: null,
      currentQuestion: 0,
      score: 0,
      totalQuestions: 0,
      answeredQuestions: [],
      showResults: false,
      moduleProgress: gameState.moduleProgress
    })
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const goToHome = () => {
    setGameStarted(false)
    setGameState({
      currentModule: null,
      currentQuestion: 0,
      score: 0,
      totalQuestions: 0,
      answeredQuestions: [],
      showResults: false,
      moduleProgress: gameState.moduleProgress
    })
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return "¡Excelente! Dominas el tema"
    if (percentage >= 60) return "Buen trabajo, sigue practicando"
    return "Sigue estudiando, puedes mejorar"
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <img
                src="/logo.svg"
                alt="Z.ai Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Marketing 5.0 Learning Game
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Aprende el temario del curso de Marketing en la Era Digital y la Inteligencia Artificial
            </p>
            <Button 
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Empezar a Aprender
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {modules.map((module) => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center text-2xl mb-2`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-sm">{module.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                ¿Cómo funciona el juego?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-1">Elige un Módulo</h3>
                  <p className="text-sm text-gray-600">Selecciona uno de los 8 módulos del curso</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-1">Responde Preguntas</h3>
                  <p className="text-sm text-gray-600">Responde 5 preguntas por módulo con diferentes niveles de dificultad</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-1">Aprende y Repite</h3>
                  <p className="text-sm text-gray-600">Recibe explicaciones detalladas y mejora tu conocimiento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!gameState.currentModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              onClick={goToHome}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Selecciona un Módulo</h1>
            <div className="w-20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => {
              const progress = gameState.moduleProgress[module.id] || 0
              const moduleQuestions = questions.filter(q => q.module === module.id)
              const completedQuestions = gameState.answeredQuestions.filter(id => 
                moduleQuestions.some(q => q.id === id)
              ).length

              return (
                <Card 
                  key={module.id} 
                  className={`hover:shadow-lg transition-all cursor-pointer transform hover:scale-105 ${
                    progress === 100 ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => selectModule(module.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${module.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-3`}>
                      {module.icon}
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>
                      {completedQuestions}/{moduleQuestions.length} preguntas completadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      {progress === 100 && (
                        <div className="flex items-center justify-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          ¡Completado!
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {Object.keys(gameState.moduleProgress).length > 0 && (
            <Card className="mt-8 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Tu Progreso General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.keys(gameState.moduleProgress).length}
                    </div>
                    <div className="text-sm text-gray-600">Módulos iniciados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(gameState.moduleProgress).filter(p => p === 100).length}
                    </div>
                    <div className="text-sm text-gray-600">Módulos completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {gameState.answeredQuestions.length}
                    </div>
                    <div className="text-sm text-gray-600">Preguntas respondidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(gameState.answeredQuestions.filter(id => 
                        questions.find(q => q.id === id)?.correctAnswer === 
                        gameState.answeredQuestions.indexOf(id) % 5
                      ).length / Math.max(gameState.answeredQuestions.length, 1) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Aciertos totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  if (gameState.showResults) {
    const percentage = Math.round((gameState.score / gameState.totalQuestions) * 100)
    const currentModule = modules.find(m => m.id === gameState.currentModule)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div className={`w-20 h-20 ${currentModule?.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-4`}>
                {currentModule?.icon}
              </div>
              <CardTitle className="text-2xl">¡Módulo Completado!</CardTitle>
              <CardDescription className="text-lg">
                {currentModule?.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
                  {percentage}%
                </div>
                <div className="text-lg text-gray-600">
                  {gameState.score} de {gameState.totalQuestions} respuestas correctas
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {getScoreMessage(percentage)}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Otro Módulo
                </Button>
                <Button 
                  onClick={() => selectModule(gameState.currentModule!)}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Repetir Módulo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={resetGame}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Cambiar Módulo
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-gray-600">
              Pregunta {gameState.currentQuestion + 1} de {currentQuestions.length}
            </div>
            <Progress 
              value={((gameState.currentQuestion + 1) / currentQuestions.length) * 100} 
              className="w-48 mt-1"
            />
          </div>

          <div className="text-lg font-semibold text-blue-600">
            {gameState.score} pts
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-sm">
                {currentQuestion.difficulty}
              </Badge>
              <div className={`w-8 h-8 ${modules.find(m => m.id === gameState.currentModule)?.color} rounded-full flex items-center justify-center text-lg`}>
                {modules.find(m => m.id === gameState.currentModule)?.icon}
              </div>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-4 ${
                  selectedAnswer === null ? "hover:bg-blue-50" : ""
                } ${
                  showExplanation && index === currentQuestion.correctAnswer 
                    ? "bg-green-100 border-green-500 text-green-800" 
                    : ""
                } ${
                  showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer
                    ? "bg-red-100 border-red-500 text-red-800"
                    : ""
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option}</span>
                  {showExplanation && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </Button>
            ))}

            {showExplanation && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Explicación:</h4>
                  <p className="text-blue-800">{currentQuestion.explanation}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}