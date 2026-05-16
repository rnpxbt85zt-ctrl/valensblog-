export const translations = {
  en: {
    // Nav
    home: 'Home',
    articles: 'Articles',
    contact: 'Contact',
    // Hero
    heroTitle: "Valen's Journey",
    heroSubtitle: 'Student-athlete from Argentina. Swimming, travel, business & personal growth.',
    heroBtn: 'Read Articles',
    // About
    aboutTitle: 'About Me',
    aboutText: `Hi! I'm Valen, an international student-athlete from Argentina studying Business Administration and Marketing while competing in NCAA DII swimming in the U.S. This blog is my space to share my journey — the highs and lows of balancing sport, academics, and life far from home.`,
    // Articles
    articlesTitle: 'Articles',
    allCategories: 'All',
    readMore: 'Read more',
    minRead: 'min read',
    views: 'views',
    noPosts: 'No articles published yet.',
    // Contact
    contactTitle: 'Get in Touch',
    contactName: 'Name',
    contactEmail: 'Email',
    contactMessage: 'Message',
    contactSend: 'Send Message',
    contactSuccess: 'Message sent! I\'ll get back to you soon.',
    // Footer
    footerText: "© 2025 Valen's Journey. All rights reserved.",
    // Admin
    adminTitle: 'Admin Panel',
    adminPosts: 'Posts',
    adminNew: 'New Post',
    adminDashboard: 'Dashboard',
    adminLogout: 'Logout',
  },
  es: {
    home: 'Inicio',
    articles: 'Artículos',
    contact: 'Contacto',
    heroTitle: "El Viaje de Valen",
    heroSubtitle: 'Atleta universitaria de Argentina. Natación, viajes, negocios y crecimiento personal.',
    heroBtn: 'Leer Artículos',
    aboutTitle: 'Sobre Mí',
    aboutText: `¡Hola! Soy Valen, una atleta universitaria internacional de Argentina que estudia Administración de Empresas y Marketing mientras compito en natación NCAA DII en EE.UU. Este blog es mi espacio para compartir mi viaje — los altos y bajos de equilibrar el deporte, los estudios y la vida lejos de casa.`,
    articlesTitle: 'Artículos',
    allCategories: 'Todos',
    readMore: 'Leer más',
    minRead: 'min de lectura',
    views: 'vistas',
    noPosts: 'No hay artículos publicados aún.',
    contactTitle: 'Contactame',
    contactName: 'Nombre',
    contactEmail: 'Email',
    contactMessage: 'Mensaje',
    contactSend: 'Enviar Mensaje',
    contactSuccess: '¡Mensaje enviado! Te respondo pronto.',
    footerText: "© 2025 El Viaje de Valen. Todos los derechos reservados.",
    adminTitle: 'Panel Admin',
    adminPosts: 'Posts',
    adminNew: 'Nuevo Post',
    adminDashboard: 'Dashboard',
    adminLogout: 'Cerrar sesión',
  },
} as const;

export type Lang = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;
