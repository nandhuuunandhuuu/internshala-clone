export interface AboutContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  stats: { value: string; label: string }[];
  mission: { title: string; body: string };
  differentiatorsHeading: string;
  differentiators: { title: string; body: string }[];
  forEmployers: { eyebrow: string; title: string; body: string };
  cta: { heading: string; subtext: string; button: string };
}

export const aboutPageContent: Record<string, AboutContent> = {
  en: {
    eyebrow: "About",
    heading: "Helping students launch real careers",
    subheading:
      "CareerLaunch connects students with meaningful internships and jobs, matching real skills to real roles instead of leaving opportunity to chance.",
    stats: [
      { value: "50K+", label: "Students matched" },
      { value: "3,200+", label: "Partner companies" },
      { value: "92%", label: "Would recommend us" },
    ],
    mission: {
      title: "Our Mission",
      body: "We believe opportunity shouldn't depend on who you know. CareerLaunch exists to close that gap with data-driven matching that's fair, transparent, and built around your actual skills.",
    },
    differentiatorsHeading: "What makes us different",
    differentiators: [
      { title: "Career Readiness Score", body: "See exactly where you stand and what to improve, backed by real signals, not guesswork." },
      { title: "Personalized Matches", body: "We surface roles that actually fit your skills and goals, not just keyword matches." },
      { title: "Interview Practice", body: "Sharpen your interview skills with guided practice before it counts." },
    ],
    forEmployers: {
      eyebrow: "For Employers",
      title: "Hire with confidence",
      body: "Post opportunities and find candidates who are genuinely a good fit, with transparent, explainable matching instead of a black box.",
    },
    cta: {
      heading: "Ready to get started?",
      subtext: "Join thousands of students already building their careers.",
      button: "Create your profile",
    },
  },

  es: {
    eyebrow: "Sobre nosotros",
    heading: "Ayudamos a estudiantes a lanzar carreras reales",
    subheading:
      "CareerLaunch conecta a estudiantes con pasantías y empleos significativos, haciendo coincidir habilidades reales con roles reales en lugar de dejar la oportunidad al azar.",
    stats: [
      { value: "50K+", label: "Estudiantes emparejados" },
      { value: "3,200+", label: "Empresas asociadas" },
      { value: "92%", label: "Nos recomendarían" },
    ],
    mission: {
      title: "Nuestra Misión",
      body: "Creemos que la oportunidad no debería depender de a quién conoces. CareerLaunch existe para cerrar esa brecha con un emparejamiento basado en datos, justo y transparente.",
    },
    differentiatorsHeading: "Qué nos hace diferentes",
    differentiators: [
      { title: "Puntaje de Preparación Profesional", body: "Descubre exactamente dónde te encuentras y qué mejorar, respaldado por señales reales." },
      { title: "Coincidencias Personalizadas", body: "Mostramos roles que realmente se ajustan a tus habilidades y metas." },
      { title: "Práctica de Entrevistas", body: "Perfecciona tus habilidades de entrevista con práctica guiada antes de que cuente de verdad." },
    ],
    forEmployers: {
      eyebrow: "Para Empleadores",
      title: "Contrata con confianza",
      body: "Publica oportunidades y encuentra candidatos genuinamente adecuados, con un emparejamiento transparente y explicable.",
    },
    cta: {
      heading: "¿Listo para empezar?",
      subtext: "Únete a miles de estudiantes que ya están construyendo sus carreras.",
      button: "Crea tu perfil",
    },
  },

  hi: {
    eyebrow: "हमारे बारे में",
    heading: "छात्रों को असली करियर शुरू करने में मदद करना",
    subheading:
      "CareerLaunch छात्रों को सार्थक इंटर्नशिप और नौकरियों से जोड़ता है, अवसर को संयोग पर छोड़ने के बजाय वास्तविक कौशल को वास्तविक भूमिकाओं से मिलाता है।",
    stats: [
      { value: "50K+", label: "मैच किए गए छात्र" },
      { value: "3,200+", label: "साझेदार कंपनियाँ" },
      { value: "92%", label: "हमें सुझाएंगे" },
    ],
    mission: {
      title: "हमारा मिशन",
      body: "हमारा मानना है कि अवसर इस बात पर निर्भर नहीं होना चाहिए कि आप किसे जानते हैं। CareerLaunch इस अंतर को डेटा-आधारित, निष्पक्ष और पारदर्शी मिलान से पाटने के लिए मौजूद है।",
    },
    differentiatorsHeading: "हमें अलग क्या बनाता है",
    differentiators: [
      { title: "करियर रेडीनेस स्कोर", body: "देखें कि आप वास्तव में कहाँ खड़े हैं और क्या सुधारना है, वास्तविक संकेतों पर आधारित।" },
      { title: "व्यक्तिगत मैच", body: "हम ऐसी भूमिकाएँ दिखाते हैं जो वास्तव में आपके कौशल और लक्ष्यों के अनुकूल हों।" },
      { title: "इंटरव्यू अभ्यास", body: "असली मौके से पहले निर्देशित अभ्यास से अपने इंटरव्यू कौशल को निखारें।" },
    ],
    forEmployers: {
      eyebrow: "नियोक्ताओं के लिए",
      title: "आत्मविश्वास के साथ नियुक्त करें",
      body: "पारदर्शी और स्पष्ट मिलान के साथ अवसर पोस्ट करें और सही उम्मीदवार खोजें।",
    },
    cta: {
      heading: "शुरू करने के लिए तैयार हैं?",
      subtext: "हजारों छात्रों से जुड़ें जो पहले से ही अपना करियर बना रहे हैं।",
      button: "अपनी प्रोफ़ाइल बनाएं",
    },
  },

  pt: {
    eyebrow: "Sobre nós",
    heading: "Ajudando estudantes a lançar carreiras reais",
    subheading:
      "A CareerLaunch conecta estudantes a estágios e empregos significativos, combinando habilidades reais com funções reais em vez de deixar a oportunidade ao acaso.",
    stats: [
      { value: "50K+", label: "Estudantes conectados" },
      { value: "3.200+", label: "Empresas parceiras" },
      { value: "92%", label: "Nos recomendariam" },
    ],
    mission: {
      title: "Nossa Missão",
      body: "Acreditamos que a oportunidade não deveria depender de quem você conhece. A CareerLaunch existe para fechar essa lacuna com correspondências justas, transparentes e baseadas em dados.",
    },
    differentiatorsHeading: "O que nos torna diferentes",
    differentiators: [
      { title: "Pontuação de Prontidão de Carreira", body: "Veja exatamente onde você está e o que melhorar, com base em sinais reais." },
      { title: "Correspondências Personalizadas", body: "Mostramos vagas que realmente combinam com suas habilidades e objetivos." },
      { title: "Prática de Entrevistas", body: "Aprimore suas habilidades de entrevista com prática guiada antes que conte de verdade." },
    ],
    forEmployers: {
      eyebrow: "Para Empregadores",
      title: "Contrate com confiança",
      body: "Publique vagas e encontre candidatos genuinamente compatíveis, com correspondência transparente e explicável.",
    },
    cta: {
      heading: "Pronto para começar?",
      subtext: "Junte-se a milhares de estudantes que já estão construindo suas carreiras.",
      button: "Crie seu perfil",
    },
  },

  zh: {
    eyebrow: "关于我们",
    heading: "帮助学生开启真实的职业生涯",
    subheading: "CareerLaunch 将学生与有意义的实习和工作联系起来，用真实技能匹配真实职位，而不是把机会交给运气。",
    stats: [
      { value: "50K+", label: "已匹配学生" },
      { value: "3,200+", label: "合作企业" },
      { value: "92%", label: "愿意推荐我们" },
    ],
    mission: {
      title: "我们的使命",
      body: "我们相信机会不应取决于你认识谁。CareerLaunch 致力于通过公平、透明、基于数据的匹配来缩小这一差距。",
    },
    differentiatorsHeading: "我们的不同之处",
    differentiators: [
      { title: "职业准备度评分", body: "基于真实数据了解自己的现状以及需要提升的地方，而非猜测。" },
      { title: "个性化匹配", body: "我们推荐真正符合你技能和目标的职位，而不仅仅是关键词匹配。" },
      { title: "面试练习", body: "在真正的机会到来之前，通过引导式练习提升面试技巧。" },
    ],
    forEmployers: {
      eyebrow: "招聘企业",
      title: "放心招聘",
      body: "发布职位，找到真正合适的候选人，匹配过程透明、可解释。",
    },
    cta: {
      heading: "准备好开始了吗？",
      subtext: "加入数千名已经在打造职业生涯的学生。",
      button: "创建你的档案",
    },
  },

  fr: {
    eyebrow: "À propos",
    heading: "Aider les étudiants à lancer de vraies carrières",
    subheading:
      "CareerLaunch met en relation les étudiants avec des stages et des emplois significatifs, en associant de vraies compétences à de vrais postes plutôt que de laisser l'opportunité au hasard.",
    stats: [
      { value: "50K+", label: "Étudiants mis en relation" },
      { value: "3 200+", label: "Entreprises partenaires" },
      { value: "92%", label: "Nous recommanderaient" },
    ],
    mission: {
      title: "Notre Mission",
      body: "Nous pensons que l'opportunité ne devrait pas dépendre de qui vous connaissez. CareerLaunch existe pour combler cet écart grâce à un appariement équitable, transparent et basé sur les données.",
    },
    differentiatorsHeading: "Ce qui nous différencie",
    differentiators: [
      { title: "Score de Préparation à la Carrière", body: "Découvrez exactement où vous en êtes et ce qu'il faut améliorer, grâce à de vrais signaux." },
      { title: "Correspondances Personnalisées", body: "Nous proposons des postes qui correspondent réellement à vos compétences et objectifs." },
      { title: "Entraînement aux Entretiens", body: "Affinez vos compétences d'entretien grâce à une pratique guidée avant que cela ne compte vraiment." },
    ],
    forEmployers: {
      eyebrow: "Pour les Employeurs",
      title: "Recrutez en toute confiance",
      body: "Publiez des offres et trouvez des candidats véritablement adaptés, grâce à un appariement transparent et explicable.",
    },
    cta: {
      heading: "Prêt à commencer ?",
      subtext: "Rejoignez des milliers d'étudiants qui construisent déjà leur carrière.",
      button: "Créez votre profil",
    },
  },
};