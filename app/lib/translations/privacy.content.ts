export interface PrivacySection {
  id: string;
  title: string;
  body: string;
}

export interface PrivacyContent {
  eyebrow: string;
  heading: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  tocLabel: string;
  sections: PrivacySection[];
  }

export const privacyPageContent: Record<string, PrivacyContent> = {
  en: {
    eyebrow: "Legal",
    heading: "Privacy Policy",
    lastUpdatedLabel: "Last updated",
    lastUpdatedDate: "September 2026",
    tocLabel: "On this page",
    sections: [
      {
        id: "information-we-collect",
        title: "Information We Collect",
        body: "We collect information you provide directly, such as your name, email, education, skills, and resume, to help match you with relevant internships and jobs.",
      },
      {
        id: "how-we-use-your-data",
        title: "How We Use Your Data",
        body: "Your data powers features like personalized recommendations, applications, and communication with recruiters you choose to apply to. We do not sell your personal information to third parties.",
      },
      {
        id: "data-sharing",
        title: "Data Sharing",
        body: "We only share your profile with employers when you submit an application. We never share your data with third parties for advertising purposes.",
      },
      {
        id: "cookies",
        title: "Cookies & Tracking",
        body: "We use basic cookies to keep you signed in and remember your preferences. We do not use third-party tracking cookies for advertising.",
      },
      {
        id: "your-control",
        title: "Your Control",
        body: "You can update or remove your profile information, including your resume, at any time from your Profile page.",
      },
      {
        id: "data-retention",
        title: "Data Retention",
        body: "We retain your information for as long as your account is active. If you delete your account, your personal data is removed within 30 days.",
      },
      {
        id: "changes-to-policy",
        title: "Changes to This Policy",
        body: "We may update this policy from time to time. We'll notify you of significant changes through the platform or by email.",
      },
    ],
   },

  es: {
    eyebrow: "Legal",
    heading: "Política de Privacidad",
    lastUpdatedLabel: "Última actualización",
    lastUpdatedDate: "Septiembre 2026",
    tocLabel: "En esta página",
    sections: [
      {
        id: "information-we-collect",
        title: "Información que Recopilamos",
        body: "Recopilamos la información que proporcionas directamente, como tu nombre, correo electrónico, educación, habilidades y currículum, para ayudarte a encontrar pasantías y empleos relevantes.",
      },
      {
        id: "how-we-use-your-data",
        title: "Cómo Usamos tus Datos",
        body: "Tus datos impulsan funciones como recomendaciones personalizadas, solicitudes y comunicación con los reclutadores a los que decidas postularte. No vendemos tu información personal a terceros.",
      },
      {
        id: "data-sharing",
        title: "Compartición de Datos",
        body: "Solo compartimos tu perfil con empleadores cuando envías una solicitud. Nunca compartimos tus datos con terceros con fines publicitarios.",
      },
      {
        id: "cookies",
        title: "Cookies y Seguimiento",
        body: "Usamos cookies básicas para mantener tu sesión iniciada y recordar tus preferencias. No usamos cookies de seguimiento de terceros con fines publicitarios.",
      },
      {
        id: "your-control",
        title: "Tu Control",
        body: "Puedes actualizar o eliminar la información de tu perfil, incluido tu currículum, en cualquier momento desde tu página de Perfil.",
      },
      {
        id: "data-retention",
        title: "Retención de Datos",
        body: "Conservamos tu información mientras tu cuenta esté activa. Si eliminas tu cuenta, tus datos personales se eliminan dentro de 30 días.",
      },
      {
        id: "changes-to-policy",
        title: "Cambios a esta Política",
        body: "Podemos actualizar esta política de vez en cuando. Te notificaremos sobre cambios importantes a través de la plataforma o por correo electrónico.",
      },
    ],
     },

  hi: {
    eyebrow: "कानूनी",
    heading: "गोपनीयता नीति",
    lastUpdatedLabel: "अंतिम बार अपडेट किया गया",
    lastUpdatedDate: "सितंबर 2026",
    tocLabel: "इस पृष्ठ पर",
    sections: [
      {
        id: "information-we-collect",
        title: "हम जो जानकारी एकत्र करते हैं",
        body: "हम आपके द्वारा सीधे दी गई जानकारी एकत्र करते हैं, जैसे आपका नाम, ईमेल, शिक्षा, कौशल और रिज़्यूमे, ताकि आपको प्रासंगिक इंटर्नशिप और नौकरियों से मिलाया जा सके।",
      },
      {
        id: "how-we-use-your-data",
        title: "हम आपके डेटा का उपयोग कैसे करते हैं",
        body: "आपका डेटा व्यक्तिगत सिफारिशों, आवेदनों और आपके द्वारा चुने गए भर्तीकर्ताओं के साथ संचार जैसी सुविधाओं को शक्ति देता है। हम आपकी व्यक्तिगत जानकारी तीसरे पक्ष को नहीं बेचते।",
      },
      {
        id: "data-sharing",
        title: "डेटा साझाकरण",
        body: "हम आपकी प्रोफ़ाइल केवल तभी नियोक्ताओं के साथ साझा करते हैं जब आप कोई आवेदन जमा करते हैं। हम विज्ञापन उद्देश्यों के लिए आपका डेटा कभी तीसरे पक्ष के साथ साझा नहीं करते।",
      },
      {
        id: "cookies",
        title: "कुकीज़ और ट्रैकिंग",
        body: "हम आपको साइन इन रखने और आपकी प्राथमिकताएँ याद रखने के लिए बुनियादी कुकीज़ का उपयोग करते हैं। हम विज्ञापन के लिए तीसरे पक्ष की ट्रैकिंग कुकीज़ का उपयोग नहीं करते।",
      },
      {
        id: "your-control",
        title: "आपका नियंत्रण",
        body: "आप अपनी प्रोफ़ाइल जानकारी, जिसमें आपका रिज़्यूमे भी शामिल है, किसी भी समय अपने प्रोफ़ाइल पृष्ठ से अपडेट या हटा सकते हैं।",
      },
      {
        id: "data-retention",
        title: "डेटा प्रतिधारण",
        body: "जब तक आपका खाता सक्रिय है, हम आपकी जानकारी रखते हैं। यदि आप अपना खाता हटाते हैं, तो आपका व्यक्तिगत डेटा 30 दिनों के भीतर हटा दिया जाता है।",
      },
      {
        id: "changes-to-policy",
        title: "इस नीति में परिवर्तन",
        body: "हम समय-समय पर इस नीति को अपडेट कर सकते हैं। हम प्लेटफ़ॉर्म या ईमेल के माध्यम से महत्वपूर्ण बदलावों के बारे में आपको सूचित करेंगे।",
      },
    ],
   },

  pt: {
    eyebrow: "Legal",
    heading: "Política de Privacidade",
    lastUpdatedLabel: "Última atualização",
    lastUpdatedDate: "Setembro de 2026",
    tocLabel: "Nesta página",
    sections: [
      {
        id: "information-we-collect",
        title: "Informações que Coletamos",
        body: "Coletamos as informações que você fornece diretamente, como nome, email, formação, habilidades e currículo, para ajudar a te conectar com estágios e empregos relevantes.",
      },
      {
        id: "how-we-use-your-data",
        title: "Como Usamos Seus Dados",
        body: "Seus dados alimentam recursos como recomendações personalizadas, candidaturas e comunicação com recrutadores aos quais você escolhe se candidatar. Não vendemos suas informações pessoais a terceiros.",
      },
      {
        id: "data-sharing",
        title: "Compartilhamento de Dados",
        body: "Só compartilhamos seu perfil com empregadores quando você envia uma candidatura. Nunca compartilhamos seus dados com terceiros para fins publicitários.",
      },
      {
        id: "cookies",
        title: "Cookies e Rastreamento",
        body: "Usamos cookies básicos para manter você conectado e lembrar suas preferências. Não usamos cookies de rastreamento de terceiros para fins publicitários.",
      },
      {
        id: "your-control",
        title: "Seu Controle",
        body: "Você pode atualizar ou remover as informações do seu perfil, incluindo seu currículo, a qualquer momento na sua página de Perfil.",
      },
      {
        id: "data-retention",
        title: "Retenção de Dados",
        body: "Mantemos suas informações enquanto sua conta estiver ativa. Se você excluir sua conta, seus dados pessoais serão removidos em até 30 dias.",
      },
      {
        id: "changes-to-policy",
        title: "Alterações a Esta Política",
        body: "Podemos atualizar esta política periodicamente. Notificaremos você sobre alterações significativas pela plataforma ou por email.",
      },
    ],
    },

  zh: {
    eyebrow: "法律信息",
    heading: "隐私政策",
    lastUpdatedLabel: "最后更新",
    lastUpdatedDate: "2026年9月",
    tocLabel: "本页内容",
    sections: [
      {
        id: "information-we-collect",
        title: "我们收集的信息",
        body: "我们收集你直接提供的信息，例如姓名、邮箱、教育背景、技能和简历，以帮助你匹配相关的实习和工作。",
      },
      {
        id: "how-we-use-your-data",
        title: "我们如何使用你的数据",
        body: "你的数据用于支持个性化推荐、申请以及与你选择申请的招聘方的沟通等功能。我们不会将你的个人信息出售给第三方。",
      },
      {
        id: "data-sharing",
        title: "数据共享",
        body: "只有在你提交申请时，我们才会将你的资料共享给雇主。我们绝不会出于广告目的将你的数据共享给第三方。",
      },
      {
        id: "cookies",
        title: "Cookie 与追踪",
        body: "我们使用基础 Cookie 来保持你的登录状态并记住你的偏好设置。我们不会使用第三方广告追踪 Cookie。",
      },
      {
        id: "your-control",
        title: "你的控制权",
        body: "你可以随时在个人资料页面更新或删除你的资料信息，包括简历。",
      },
      {
        id: "data-retention",
        title: "数据保留",
        body: "只要你的账户处于活跃状态，我们就会保留你的信息。如果你删除账户，你的个人数据将在 30 天内被移除。",
      },
      {
        id: "changes-to-policy",
        title: "政策变更",
        body: "我们可能会不时更新本政策。如有重大变更，我们会通过平台或邮件通知你。",
      },
    ],
  },

  fr: {
    eyebrow: "Mentions légales",
    heading: "Politique de Confidentialité",
    lastUpdatedLabel: "Dernière mise à jour",
    lastUpdatedDate: "Septembre 2026",
    tocLabel: "Sur cette page",
    sections: [
      {
        id: "information-we-collect",
        title: "Informations que Nous Collectons",
        body: "Nous collectons les informations que vous fournissez directement, telles que votre nom, email, formation, compétences et CV, afin de vous mettre en relation avec des stages et emplois pertinents.",
      },
      {
        id: "how-we-use-your-data",
        title: "Comment Nous Utilisons vos Données",
        body: "Vos données alimentent des fonctionnalités telles que les recommandations personnalisées, les candidatures et la communication avec les recruteurs auprès desquels vous choisissez de postuler. Nous ne vendons pas vos informations personnelles à des tiers.",
      },
      {
        id: "data-sharing",
        title: "Partage des Données",
        body: "Nous ne partageons votre profil avec les employeurs que lorsque vous soumettez une candidature. Nous ne partageons jamais vos données avec des tiers à des fins publicitaires.",
      },
      {
        id: "cookies",
        title: "Cookies et Suivi",
        body: "Nous utilisons des cookies de base pour vous garder connecté et mémoriser vos préférences. Nous n'utilisons pas de cookies de suivi tiers à des fins publicitaires.",
      },
      {
        id: "your-control",
        title: "Votre Contrôle",
        body: "Vous pouvez mettre à jour ou supprimer les informations de votre profil, y compris votre CV, à tout moment depuis votre page Profil.",
      },
      {
        id: "data-retention",
        title: "Conservation des Données",
        body: "Nous conservons vos informations tant que votre compte est actif. Si vous supprimez votre compte, vos données personnelles sont supprimées sous 30 jours.",
      },
      {
        id: "changes-to-policy",
        title: "Modifications de cette Politique",
        body: "Nous pouvons mettre à jour cette politique de temps à autre. Nous vous informerons des changements importants via la plateforme ou par email.",
      },
    ],
    },
};