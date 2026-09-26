export interface ContactContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  topics: { title: string; desc: string }[];
  formHeading: string;
  formHeadingWithTopic: string; // use "{topic}" as placeholder
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitButton: string;
  successTitle: string;
  successBody: string;
  sidebar: {
    heading: string;
    emailLabel: string;
    emailValue: string;
    responseTimeLabel: string;
    responseTimeValue: string;
  };
}

export const contactPageContent: Record<string, ContactContent> = {
  en: {
    eyebrow: "Help Center",
    heading: "What can we help you with?",
    subheading: "Pick a topic or send us a message directly — we're here to help.",
    topics: [
      { title: "Account / Profile", desc: "Manage your CareerLaunch account" },
      { title: "Find Internships & Jobs", desc: "Find opportunities matching your preferences" },
      { title: "My Applications", desc: "Know about your current application status" },
      { title: "Facing an Issue", desc: "Report a complaint about an internship or job" },
      { title: "Technical Issues", desc: "Report a technical difficulty you're facing" },
      { title: "Need Further Assistance?", desc: "Can't find what you're looking for? Submit a request" },
    ],
    formHeading: "Send us a message",
    formHeadingWithTopic: 'Send us a message about "{topic}"',
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    messagePlaceholder: "How can we help?",
    submitButton: "Send Message",
    successTitle: "Message sent",
    successBody: "Thanks for reaching out! We'll get back to you soon.",
    sidebar: {
      heading: "Reach us directly",
      emailLabel: "Email",
      emailValue: "support@careerlaunch.com",
      responseTimeLabel: "Typical response time",
      responseTimeValue: "Within 24 hours",
    },
  },

  es: {
    eyebrow: "Centro de Ayuda",
    heading: "¿En qué podemos ayudarte?",
    subheading: "Elige un tema o envíanos un mensaje directamente — estamos aquí para ayudar.",
    topics: [
      { title: "Cuenta / Perfil", desc: "Gestiona tu cuenta de CareerLaunch" },
      { title: "Buscar Pasantías y Empleos", desc: "Encuentra oportunidades según tus preferencias" },
      { title: "Mis Solicitudes", desc: "Conoce el estado de tus solicitudes actuales" },
      { title: "Reportar un Problema", desc: "Presenta una queja sobre una pasantía o empleo" },
      { title: "Problemas Técnicos", desc: "Reporta una dificultad técnica que estés experimentando" },
      { title: "¿Necesitas más ayuda?", desc: "¿No encuentras lo que buscas? Envía una solicitud" },
    ],
    formHeading: "Envíanos un mensaje",
    formHeadingWithTopic: 'Envíanos un mensaje sobre "{topic}"',
    namePlaceholder: "Tu Nombre",
    emailPlaceholder: "Tu Correo Electrónico",
    messagePlaceholder: "¿Cómo podemos ayudarte?",
    submitButton: "Enviar Mensaje",
    successTitle: "Mensaje enviado",
    successBody: "¡Gracias por contactarnos! Te responderemos pronto.",
    sidebar: {
      heading: "Contáctanos directamente",
      emailLabel: "Correo electrónico",
      emailValue: "support@careerlaunch.com",
      responseTimeLabel: "Tiempo de respuesta habitual",
      responseTimeValue: "Dentro de 24 horas",
    },
  },

  hi: {
    eyebrow: "सहायता केंद्र",
    heading: "हम आपकी किस तरह मदद कर सकते हैं?",
    subheading: "एक विषय चुनें या सीधे हमें संदेश भेजें — हम मदद के लिए यहाँ हैं।",
    topics: [
      { title: "खाता / प्रोफ़ाइल", desc: "अपना CareerLaunch खाता प्रबंधित करें" },
      { title: "इंटर्नशिप और नौकरियाँ खोजें", desc: "अपनी पसंद के अनुसार अवसर खोजें" },
      { title: "मेरे आवेदन", desc: "अपने वर्तमान आवेदन की स्थिति जानें" },
      { title: "समस्या की रिपोर्ट करें", desc: "किसी इंटर्नशिप या नौकरी की शिकायत दर्ज करें" },
      { title: "तकनीकी समस्याएँ", desc: "आ रही तकनीकी कठिनाई की रिपोर्ट करें" },
      { title: "और सहायता चाहिए?", desc: "जो खोज रहे हैं वह नहीं मिला? अनुरोध सबमिट करें" },
    ],
    formHeading: "हमें संदेश भेजें",
    formHeadingWithTopic: '"{topic}" के बारे में हमें संदेश भेजें',
    namePlaceholder: "आपका नाम",
    emailPlaceholder: "आपका ईमेल",
    messagePlaceholder: "हम आपकी कैसे मदद कर सकते हैं?",
    submitButton: "संदेश भेजें",
    successTitle: "संदेश भेजा गया",
    successBody: "संपर्क करने के लिए धन्यवाद! हम जल्द ही जवाब देंगे।",
    sidebar: {
      heading: "सीधे संपर्क करें",
      emailLabel: "ईमेल",
      emailValue: "support@careerlaunch.com",
      responseTimeLabel: "सामान्य प्रतिक्रिया समय",
      responseTimeValue: "24 घंटे के भीतर",
    },
  },

  pt: {
    eyebrow: "Central de Ajuda",
    heading: "Como podemos te ajudar?",
    subheading: "Escolha um tópico ou envie uma mensagem diretamente — estamos aqui para ajudar.",
    topics: [
      { title: "Conta / Perfil", desc: "Gerencie sua conta CareerLaunch" },
      { title: "Encontrar Estágios e Empregos", desc: "Encontre oportunidades de acordo com suas preferências" },
      { title: "Minhas Candidaturas", desc: "Saiba o status da sua candidatura atual" },
      { title: "Relatar um Problema", desc: "Denuncie um estágio ou vaga de emprego" },
      { title: "Problemas Técnicos", desc: "Relate uma dificuldade técnica que você está enfrentando" },
      { title: "Precisa de mais ajuda?", desc: "Não encontrou o que procurava? Envie uma solicitação" },
    ],
    formHeading: "Envie-nos uma mensagem",
    formHeadingWithTopic: 'Envie-nos uma mensagem sobre "{topic}"',
    namePlaceholder: "Seu Nome",
    emailPlaceholder: "Seu Email",
    messagePlaceholder: "Como podemos ajudar?",
    submitButton: "Enviar Mensagem",
    successTitle: "Mensagem enviada",
    successBody: "Obrigado por entrar em contato! Responderemos em breve.",
    sidebar: {
      heading: "Fale conosco diretamente",
      emailLabel: "Email",
      emailValue: "support@careerlaunch.com",
      responseTimeLabel: "Tempo de resposta típico",
      responseTimeValue: "Em até 24 horas",
    },
  },

  zh: {
    eyebrow: "帮助中心",
    heading: "我们能为你提供什么帮助？",
    subheading: "选择一个主题，或直接给我们发消息——我们随时为你提供帮助。",
    topics: [
      { title: "账户 / 个人资料", desc: "管理你的 CareerLaunch 账户" },
      { title: "寻找实习与工作", desc: "查找符合你偏好的机会" },
      { title: "我的申请", desc: "了解你当前的申请状态" },
      { title: "报告问题", desc: "举报某个实习或工作岗位的问题" },
      { title: "技术问题", desc: "报告你遇到的技术故障" },
      { title: "需要更多帮助？", desc: "没找到你要的内容？提交请求" },
    ],
    formHeading: "给我们发消息",
    formHeadingWithTopic: '就"{topic}"给我们发消息',
    namePlaceholder: "你的姓名",
    emailPlaceholder: "你的邮箱",
    messagePlaceholder: "我们能帮你什么？",
    submitButton: "发送消息",
    successTitle: "消息已发送",
    successBody: "感谢你的联系！我们会尽快回复。",
    sidebar: {
      heading: "直接联系我们",
      emailLabel: "邮箱",
      emailValue: "support@careerlaunch.com",
      responseTimeLabel: "通常响应时间",
      responseTimeValue: "24 小时内",
    },
  },

  fr: {
    eyebrow: "Centre d'aide",
    heading: "Comment pouvons-nous vous aider ?",
    subheading: "Choisissez un sujet ou envoyez-nous un message directement — nous sommes là pour aider.",
    topics: [
      { title: "Compte / Profil", desc: "Gérez votre compte CareerLaunch" },
      { title: "Trouver Stages et Emplois", desc: "Trouvez des opportunités selon vos préférences" },
      { title: "Mes Candidatures", desc: "Suivez l'état de votre candidature actuelle" },
      { title: "Signaler un Problème", desc: "Signalez un problème avec un stage ou un emploi" },
      { title: "Problèmes Techniques", desc: "Signalez une difficulté technique rencontrée" },
      { title: "Besoin d'aide supplémentaire ?", desc: "Vous ne trouvez pas ce que vous cherchez ? Envoyez une demande" },
    ],
    formHeading: "Envoyez-nous un message",
    formHeadingWithTopic: 'Envoyez-nous un message à propos de "{topic}"',
    namePlaceholder: "Votre Nom",
    emailPlaceholder: "Votre Email",
    messagePlaceholder: "Comment pouvons-nous aider ?",
    submitButton: "Envoyer le Message",
    successTitle: "Message envoyé",
    successBody: "Merci de nous avoir contactés ! Nous vous répondrons bientôt.",
    sidebar: {
      heading: "Contactez-nous directement",
      emailLabel: "Email",
      emailValue: "support@careerlaunch.com",
      responseTimeLabel: "Délai de réponse habituel",
      responseTimeValue: "Sous 24 heures",
    },
  },
};