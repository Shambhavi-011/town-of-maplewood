import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import townData from '../data/townData.json';
import {
  DEFAULT_WAYHALL_API_BASE,
  initResidentSession,
  streamConversationQuery,
  requestSmsCode,
  verifySmsCode,
  linkResidentSession,
  type StreamMetadataEvent,
} from '../services/wayhallApi';

type Language = 'en' | 'fr' | 'es';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  sourceTitle?: string;
  sourceUrl?: string;
  permitLink?: {
    title: string;
    url: string;
    fee: string;
  };
  citations?: Array<{
    title?: string;
    url?: string;
    document_id?: string;
    snippet?: string;
  }>;
}

interface QuickPrompt {
  label: string;
  query: string;
}

export default function WayhallChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Live WayHall Backend Integration State
  // Engine Mode: 'api' (Default: Live WayHall Remote API) | 'local' (Local mock rule engine)
  const [engineMode, setEngineMode] = useState<'api' | 'local'>(() => {
    return (localStorage.getItem('wayhall_engine_mode') as 'api' | 'local') || 'api';
  });

  const [apiBaseUrl, setApiBaseUrl] = useState<string>(() => {
    const saved = localStorage.getItem('wayhall_api_base');
    if (saved && !saved.includes('ngrok-free.dev') && !saved.includes('ngrok')) {
      return saved;
    }
    return DEFAULT_WAYHALL_API_BASE;
  });
  const [conversationId, setConversationId] = useState<number | null>(() => {
    const saved = localStorage.getItem('wayhall_conversation_id');
    return saved ? parseInt(saved, 10) : null;
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const [residentProfile, setResidentProfile] = useState<{
    name: string;
    phone?: string;
    isAnonymous: boolean;
  } | null>(() => {
    const saved = localStorage.getItem('wayhall_resident_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal / Drawer states
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp' | 'success'>('input');
  const [residentNameInput, setResidentNameInput] = useState('');
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [smsCodeInput, setSmsCodeInput] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsUrlInput, setSettingsUrlInput] = useState(apiBaseUrl);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDirectFormClick = (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
    e.preventDefault();
    setIsOpen(false);

    const [targetPath, targetHash] = targetUrl.split('#');
    const currentFull = location.pathname + location.search;

    if (currentFull !== targetPath) {
      navigate(targetUrl);
    }

    setTimeout(() => {
      let targetEl: HTMLElement | null = null;
      if (targetHash) {
        targetEl = document.getElementById(targetHash);
      }
      if (!targetEl) {
        targetEl =
          document.getElementById('service-request-form') ||
          document.getElementById('deck-permit-form') ||
          document.getElementById('pool-permit-form') ||
          document.getElementById('burn-permit-form') ||
          document.getElementById('service-request-portal-container') ||
          document.querySelector('form');
      }

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetEl.classList.add('ring-4', 'ring-blue-400', 'transition-all');
        setTimeout(() => {
          targetEl?.classList.remove('ring-4', 'ring-blue-400');
        }, 1500);

        const firstInput = targetEl.querySelector('input:not([type="hidden"]), select, textarea') as HTMLElement | null;
        if (firstInput) {
          firstInput.focus();
        }
      } else {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    }, 150);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Initial welcome message per language
  const welcomeText: Record<Language, string> = {
    en: `Hello! I am Wayhall, the ${townData.townInfo.name}'s official AI assistant. How can I help you today? Ask about waste collection, pothole reporting, deck & pool permits, property taxes, or by-laws in English, French, or Spanish.`,
    fr: `Bonjour ! Je suis Wayhall, l'assistant officiel d'intelligence artificielle de la ${townData.townInfo.name}. Comment puis-je vous aider ? Posez vos questions sur la collecte des ordures, les permis de terrasse et piscine, les taxes foncières ou les règlements municipaux.`,
    es: `¡Hola! Soy Wayhall, el asistente oficial de IA de la ${townData.townInfo.name}. ¿En qué puedo ayudarle hoy? Pregunte sobre recolección de residuos, baches, permisos de terrazas o piscinas, impuestos prediales o normativas municipales.`,
  };

  // Initialize or reset greeting on language change if only welcome is present
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: welcomeText[language],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [language]);

  // Quick action suggestions per language
  const quickPrompts: Record<Language, QuickPrompt[]> = {
    en: [
      { label: '🛠️ Submit 311 request', query: 'How do I submit a 311 municipal service request?' },
      { label: '🏛️ Mayor & Council', query: 'Who is the Mayor and what are the municipal wards?' },
      { label: '🔍 Track case status', query: 'How do I track the status of my 311 work order?' },
      { label: '🚛 Waste pickup time', query: 'What time must garbage and recycling bins be at the curb?' },
      { label: '📐 Deck permit rules', query: 'Do I need a building permit for a residential deck?' },
      { label: '🏊 Pool enclosure rules', query: 'What are the fence requirements for a swimming pool?' },
      { label: '💳 Property tax due dates', query: 'When are the 2026 property tax instalments due?' },
      { label: '🔥 Open-air burn permit', query: 'How do I apply for an open-air burn permit?' },
      { label: '❄️ Snow emergency parking', query: 'What are the rules for parking during snow emergencies?' },
    ],
    fr: [
      { label: '🛠️ Demande de service 311', query: 'Comment soumettre une demande de service municipal 311 ?' },
      { label: '🏛️ Maire et conseil', query: 'Qui est la mairesse et quels sont les districts municipaux ?' },
      { label: '🔍 Suivi de dossier', query: 'Comment vérifier le statut de ma demande de service ?' },
      { label: '📐 Permis de terrasse', query: 'Ai-je besoin d\'un permis pour construire une terrasse ?' },
      { label: '🏊 Clôture de piscine', query: 'Quelles sont les exigences de clôture pour une piscine ?' },
      { label: '🚛 Collecte des ordures', query: 'À quelle heure dois-je sortir mes bacs de recyclage ?' },
      { label: '💳 Taxes foncières', query: 'Quelles sont les dates d\'échéance des taxes 2026 ?' },
      { label: '🔥 Permis de brûlage', query: 'Comment obtenir un permis de brûlage en plein air ?' },
    ],
    es: [
      { label: '🛠️ Solicitud de servicio 311', query: '¿Cómo envío una solicitud de servicio ciudadano 311?' },
      { label: '🏛️ Alcaldesa y concejo', query: '¿Quién es la alcaldesa y cómo se dividen los distritos?' },
      { label: '🔍 Seguimiento de caso', query: '¿Cómo consulto el estado de mi orden de servicio 311?' },
      { label: '📐 Permiso para terraza', query: '¿Necesito un permiso para construir un deck o terraza?' },
      { label: '🏊 Valla para piscina', query: '¿Cuáles son los requisitos de cerca para una piscina?' },
      { label: '🚛 Horario de basura', query: '¿A qué hora debo sacar la basura a la acera?' },
      { label: '💳 Pago de impuestos', query: '¿Cuáles son las fechas de vencimiento de los impuestos prediales?' },
      { label: '🔥 Permiso de quema', query: '¿Cómo solicito un permiso de quema al aire libre?' },
    ],
  };

  // Comprehensive Knowledge Engine Grounding Answers
  const findAnswer = (query: string, lang: Language): {
    text: string;
    sourceTitle?: string;
    sourceUrl?: string;
    permitLink?: { title: string; url: string; fee: string };
  } => {
    const q = query.toLowerCase().trim();

    // 1. DECK PERMITS & APPLICATION
    if (
      q.includes('deck') ||
      q.includes('terrasse') ||
      q.includes('patio') ||
      q.includes('terrazas') ||
      q.includes('balcón') ||
      q.includes('balcon')
    ) {
      if (lang === 'fr') {
        return {
          text: "Pour une terrasse résidentielle à Maplewood :\n• EXEMPTÉ : Une terrasse indépendante (non attachée à la maison), avec une surface de marche de ≤60 cm (24 po) au-dessus du sol et une superficie totale inférieure à 10 m² (108 pi²).\n• PERMIS OBLIGATOIRE : Si la terrasse est fixée à la maison ou dépasse 60 cm de hauteur. Les marges de recul sont de 1,5 m à l'arrière et 1,2 m sur les côtés.\n• Frais de permis : 185,00 $ CAD (délai d'examen de 10 jours ouvrables).",
          sourceTitle: 'Règlement sur les permis de terrasse (Code du bâtiment de l\'Ontario)',
          sourceUrl: '/permits/decks',
          permitLink: {
            title: 'Formulaire de demande de permis de terrasse en ligne',
            url: '/permits/apply/deck',
            fee: '185,00 $ CAD',
          },
        };
      }
      if (lang === 'es') {
        return {
          text: "Para construir una terraza (deck) en Maplewood:\n• EXENTO : No se requiere permiso si es completamente independiente (no adosada a la casa), con una altura de ≤60 cm (24 pulgadas) sobre el suelo y un área menor a 10 m² (108 pies²).\n• PERMISO OBLIGATORIO : Si la terraza está adosada a la casa o supera los 60 cm de altura. Requiere retiros de 1.5 m al fondo y 1.2 m a los lados.\n• Tarifa oficial : $185.00 CAD (revisión en 10 días hábiles).",
          sourceTitle: 'Reglamento de Terrazas del Municipio de Maplewood',
          sourceUrl: '/permits/decks',
          permitLink: {
            title: 'Formulario de solicitud de permiso de terraza en línea',
            url: '/permits/apply/deck',
            fee: '$185.00 CAD',
          },
        };
      }
      return {
        text: "In the Town of Maplewood, deck permit rules are as follows:\n• PERMIT EXEMPT: A building permit is NOT required if the deck is completely freestanding (unattached), walking surface is ≤60 cm (24 in / 2.0 ft) above ground, and total area is under 10 m² (108 sq ft).\n• PERMIT MANDATORY: Required if attached to the primary dwelling (regardless of height), higher than 60 cm above grade, or acts as an exit route.\n• Zoning setbacks: Minimum 1.5 meters rear yard and 1.2 meters side yard.\n• Permit Fee: $185.00 flat fee (reviewed within 10 business days).",
        sourceTitle: 'Residential Deck Building Permits & Regulations',
        sourceUrl: '/permits/decks',
        permitLink: {
          title: 'Apply Online for Deck Construction Permit',
          url: '/permits/apply/deck',
          fee: '$185.00 CAD',
        },
      };
    }

    // 2. POOL PERMITS & ENCLOSURES (By-law 2022-18)
    if (
      q.includes('pool') ||
      q.includes('piscine') ||
      q.includes('piscina') ||
      q.includes('hot tub') ||
      q.includes('spa') ||
      q.includes('fence') ||
      q.includes('clôture') ||
      q.includes('cerca')
    ) {
      if (lang === 'fr') {
        return {
          text: "En vertu du règlement municipal 2022-18 de Maplewood :\n• Un permis d'enceinte de piscine est OBLIGATOIRE avant toute excavation ou remplissage d'eau pour tout bassin ou spa pouvant contenir plus de 60 cm (24 po) d'eau.\n• Clôture : Hauteur minimale continue de 1,5 mètre (5,0 pi / 60 po) mesurée du côté extérieur.\n• Barrière : Doit être munie d'un dispositif à fermeture et verrouillage automatiques avec verrou situé à au moins 1,35 mètre du sol, s'ouvrant vers l'extérieur.\n• Frais : 150,00 $ CAD.",
          sourceTitle: 'Règlement 2022-18 sur les clôtures de piscine',
          sourceUrl: '/permits/pools',
          permitLink: {
            title: 'Demande de permis d\'enceinte de piscine en ligne',
            url: '/permits/apply/pool',
            fee: '150,00 $ CAD',
          },
        };
      }
      if (lang === 'es') {
        return {
          text: "Bajo la Ordenanza Municipal 2022-18 de Maplewood:\n• Es OBLIGATORIO solicitar un permiso de cerramiento antes de excavar o llenar de agua cualquier piscina o jacuzzi con profundidad mayor a 60 cm (24 pulgadas).\n• Cerca de seguridad : Altura mínima continua de 1.5 metros (5.0 pies / 60 pulg.) sin elementos escalables.\n• Puerta : Debe contar con cierre automático y pestillo de auto-bloqueo situado al menos a 1.35 metros del suelo, abriendo hacia afuera.\n• Tarifa : $150.00 CAD.",
          sourceTitle: 'Ordenanza 2022-18 sobre Cerramientos de Piscinas',
          sourceUrl: '/permits/pools',
          permitLink: {
            title: 'Formulario de solicitud de permiso de piscina en línea',
            url: '/permits/apply/pool',
            fee: '$150.00 CAD',
          },
        };
      }
      return {
        text: "Under Maplewood By-law 2022-18:\n• A Pool Enclosure Permit is MANDATORY before any excavation or filling begins for any private pool or hot tub capable of holding water deeper than 60 cm (24 inches).\n• Fence Height: Minimum 1.5 meters (5.0 feet / 60 inches) continuous vertical height.\n• Gate Requirements: Self-closing spring and self-latching mechanism positioned at least 1.35 meters (53 inches) above grade, swinging outwards.\n• Fee: $150.00 flat fee (includes pre-excavation and final enclosure safety inspections).",
        sourceTitle: 'Swimming Pool Enclosure By-law 2022-18',
        sourceUrl: '/permits/pools',
        permitLink: {
          title: 'Apply Online for Pool Enclosure Permit',
          url: '/permits/apply/pool',
          fee: '$150.00 CAD',
        },
      };
    }

    // 3. OPEN-AIR BURN PERMITS (By-law 2021-09)
    if (
      q.includes('burn') ||
      q.includes('fire') ||
      q.includes('brûlage') ||
      q.includes('feu') ||
      q.includes('quema') ||
      q.includes('fuego') ||
      q.includes('brush')
    ) {
      if (lang === 'fr') {
        return {
          text: "Règlement sur le brûlage à l'air libre (Règlement 2021-09) :\n• Autorisé UNIQUEMENT sur les propriétés en zone rurale (A-1, A-2, RU) ou le long du chemin de comté 8 (County Road 8). Strictement interdit dans les lotissements résidentiels urbains.\n• Dimensions de la pile : Maximum 2,0 m x 2,0 m avec une hauteur maximale de 1,0 m.\n• Dégagement : Minimum 15 mètres de tout bâtiment ou ligne électrique.\n• Surveillance : Un adulte responsable (18 ans et plus) doit être présent avec une source d'eau.\n• Frais : 25,00 $ / saison (approbation immédiate en ligne).",
          sourceTitle: 'Règlement 2021-09 sur le brûlage en plein air',
          sourceUrl: '/permits/burn',
          permitLink: {
            title: 'Obtenir un permis de brûlage instantané en ligne',
            url: '/permits/apply/burn',
            fee: '25,00 $ CAD',
          },
        };
      }
      if (lang === 'es') {
        return {
          text: "Reglamento de quema al aire libre (Ordenanza 2021-09):\n• Permitido ÚNICAMENTE en propiedades rurales (zonas A-1, A-2, RU) o a lo largo de County Road 8. Prohibido en subdivisiones urbanas y comerciales.\n• Dimensiones de la pila : Máximo 2.0 m x 2.0 m con altura máxima de 1.0 m.\n• Distancia de seguridad : Mínimo 15 metros de estructuras, líneas eléctricas y linderos.\n• Supervisión : Un adulto de al menos 18 años debe supervisar con manguera de agua presurizada.\n• Tarifa : $25.00 / temporada (aprobación automática instantánea).",
          sourceTitle: 'Ordenanza 2021-09 sobre Quema al Aire Libre',
          sourceUrl: '/permits/burn',
          permitLink: {
            title: 'Solicitar permiso de quema instantáneo en línea',
            url: '/permits/apply/burn',
            fee: '$25.00 CAD',
          },
        };
      }
      return {
        text: "Open-Air Burn Regulations under By-law 2021-09:\n• ELIGIBILITY: Burning is permitted ONLY on Rural zoned properties (A-1, A-2, RU) or along County Road 8. Strictly prohibited in urban subdivisions.\n• Pile Limits: Maximum 2.0m x 2.0m with a maximum height of 1.0m.\n• Clearances: Minimum 15 meters from all structures and trees.\n• Supervision: Responsible adult (18+) present with charged water hose or pump tank.\n• Hours: Sunrise until 30 minutes before sunset (never during active fire bans).\n• Fee: $25.00 per season (instant online approval).",
        sourceTitle: 'Open-Air Burn Permits & Fire Regulations',
        sourceUrl: '/permits/burn',
        permitLink: {
          title: 'Apply Online for Instant Burn Permit',
          url: '/permits/apply/burn',
          fee: '$25.00 CAD',
        },
      };
    }

    // 4. WASTE, RECYCLING & MISSED PICKUP
    if (
      q.includes('waste') ||
      q.includes('garbage') ||
      q.includes('recycling') ||
      q.includes('curbside') ||
      q.includes('missed') ||
      q.includes('organics') ||
      q.includes('poubelle') ||
      q.includes('ordures') ||
      q.includes('déchets') ||
      q.includes('basura') ||
      q.includes('reciclaje') ||
      q.includes('residuos')
    ) {
      if (lang === 'fr') {
        return {
          text: "Règles de collecte des déchets et du recyclage à Maplewood :\n• Heure de dépôt : Les bacs doivent être placés au bord de la rue avant 7h00 le jour de la collecte (et pas avant 18h00 la veille).\n• Collecte manquée : Les signalements de collecte manquée ne doivent JAMAIS être soumis avant 17h00. Les camions municipaux circulent jusqu'à 17h00. Les signalements vérifiés sont résolus dans les 2 jours ouvrables.\n• Bacs verts : Collecte hebdomadaire.\n• Bacs bleus & ordures : En alternance bihebdomadaire (maximum 2 sacs; les sacs supplémentaires nécessitent une étiquette à 3,00 $).",
          sourceTitle: 'Collecte des déchets et recyclage',
          sourceUrl: '/services/waste',
        };
      }
      if (lang === 'es') {
        return {
          text: "Normas de recolección de residuos en Maplewood:\n• Horario de acera : Los contenedores deben colocarse antes de las 7:00 AM del día de recolección (no antes de las 6:00 PM del día anterior).\n• Recolección no realizada : NO reporte recolecciones perdidas antes de las 5:00 PM. Los camiones operan hasta las 5:00 PM. Los reportes válidos se resuelven en 2 días hábiles.\n• Contenedor verde (orgánicos) : Semanal.\n• Reciclaje y basura : Quincenal (máximo 2 bolsas estándar; las bolsas adicionales requieren etiqueta municipal de $3.00).",
          sourceTitle: 'Recolección de Residuos y Reciclaje',
          sourceUrl: '/services/waste',
        };
      }
      return {
        text: "Town of Maplewood Curbside Waste & Recycling Rules:\n• Placement Deadline: All bins and blue boxes must be at the curb by 7:00 AM on your collection day (and no earlier than 6:00 PM the evening prior).\n• Missed Collections: Do NOT report a missed collection before 5:00 PM on your scheduled day. Municipal trucks operate until 5:00 PM. Verified reports submitted after 5:00 PM are resolved within 2 business days.\n• Organics (Green Bin): Weekly year-round.\n• Recycling & Garbage: Bi-weekly alternating (2 standard bag limit; extra bags require a $3.00 Bag Tag).\n• Bulk Pickup: First Tuesday of each calendar month (max 2 items; mattresses plastic-wrapped).",
        sourceTitle: 'Curbside Waste, Recycling & Organics Collection',
        sourceUrl: '/services/waste',
      };
    }

    // 5. ROADS & POTHOLES
    if (
      q.includes('pothole') ||
      q.includes('road') ||
      q.includes('nid-de-poule') ||
      q.includes('chaussée') ||
      q.includes('route') ||
      q.includes('bache') ||
      q.includes('carretera') ||
      q.includes('vía')
    ) {
      if (lang === 'fr') {
        return {
          text: "Signalement des nids-de-poule et entretien des routes :\n• Informations requises : Adresse civique exacte ou intersection la plus proche, direction de la voie, et estimation de la taille.\n• Délais d'intervention (SLA) : Petit (<25 cm) : 5 jours ouvrables ; Moyen (25-60 cm) : 3 jours ; Grand (>60 cm ou voie principale) : Priorité élevée, inspecté en 24 heures.\n• Dédoublonnage : Les signalements dans un rayon de 50 m sous 30 jours sont automatiquement regroupés.\n• Urgences 24/7 (fils tombés ou bris majeurs) : 1-800-434-1235 ou 911.",
          sourceTitle: 'Entretien des routes et nids-de-poule',
          sourceUrl: '/services/roads',
          permitLink: {
            title: 'Signaler un nid-de-poule en ligne (Portail 311)',
            url: '/services/request?type=pothole',
            fee: 'Gratuit / Service public',
          },
        };
      }
      if (lang === 'es') {
        return {
          text: "Reporte de baches y mantenimiento de carreteras:\n• Datos requeridos : Dirección exacta o intersección más cercana, carril de circulación y tamaño aproximado.\n• Tiempos de atención (SLA) : Pequeño (<25 cm) : 5 días hábiles ; Mediano (25-60 cm) : 3 días ; Grande (>60 cm o en carril activo) : Prioridad alta, inspeccionado en 24 horas.\n• Prevención de duplicados : Reportes a menos de 50 metros en los últimos 30 días se unifican automáticamente.\n• Cables caídos y emergencias viales : 1-800-434-1235 o llame al 911.",
          sourceTitle: 'Mantenimiento de Carreteras e Infraestructura',
          sourceUrl: '/services/roads',
          permitLink: {
            title: 'Reportar bache o peligro vial en línea (Portal 311)',
            url: '/services/request?type=pothole',
            fee: 'Gratuito / Servicio público',
          },
        };
      }
      return {
        text: "Pothole & Road Hazard Reporting Guidelines:\n• Required Details: Exact street address or closest cross-street, active travel lane direction, and size estimation.\n• Size & Response SLA: Small (<25 cm): 5 business days; Medium (25-60 cm): 3 business days; Large (>60 cm or active travel lane): High Severity, inspected within 24 hours.\n• Duplicate Prevention: Reports within 50 meters submitted within the last 30 days are automatically consolidated into existing work orders.\n• Downed Power Lines / Urgent Road Emergencies: Call Hydro immediately at 1-800-434-1235 or 911.",
        sourceTitle: 'Roads, Potholes & Infrastructure Maintenance',
        sourceUrl: '/services/roads',
        permitLink: {
          title: 'Report Pothole / Road Hazard Online (311 Portal)',
          url: '/services/request?type=pothole',
          fee: 'Free Civic Service',
        },
      };
    }

    // 6. PROPERTY TAXES & DUE DATES
    if (
      q.includes('tax') ||
      q.includes('property tax') ||
      q.includes('taxe') ||
      q.includes('impuesto') ||
      q.includes('impuestos') ||
      q.includes('mill rate') ||
      q.includes('pre-authorized') ||
      q.includes('pap')
    ) {
      if (lang === 'fr') {
        return {
          text: "Taxes foncières 2026 de Maplewood :\n• Taux d'imposition résidentiel (Mill Rate) : 0,0094523 (Répartition : 48 % Ville de Maplewood, 34 % Région, 18 % Écoles).\n• Échéances statutaires 2026 : Facture provisoire : 27 février et 30 avril. Facture finale : 30 juin et 30 septembre.\n• Pénalité de retard : 1,25 % par mois sur solde impayé.\n• Modes de paiement : Services bancaires en ligne (Bénéficiaire : 'Town of Maplewood - Property Taxes', numéro de rôle à 19 chiffres), débit préautorisé (PAP en 10 mois ou 4 versements).",
          sourceTitle: 'Évaluations et échéances des taxes foncières',
          sourceUrl: '/taxes/info',
        };
      }
      if (lang === 'es') {
        return {
          text: "Impuestos Prediales 2026 de Maplewood:\n• Tasa residencial (Mill Rate) : 0.0094523 (Distribución: 48% Municipio, 34% Servicios Regionales, 18% Juntas Escolares).\n• Fechas de vencimiento 2026 : Factura provisional: 27 de febrero y 30 de abril. Factura final: 30 de junio y 30 de septiembre.\n• Recargo por mora : 1.25% mensual sobre saldo vencido.\n• Métodos de pago : Banca en línea (Beneficiario: 'Town of Maplewood - Property Taxes', Número de Rol de 19 dígitos), Débito preautorizado (PAP) o caja en el Ayuntamiento.",
          sourceTitle: 'Tasas de Impuestos Prediales y Métodos de Pago',
          sourceUrl: '/taxes/info',
        };
      }
      return {
        text: "Town of Maplewood 2026 Property Taxes:\n• Residential Mill Rate: 0.0094523 (Distribution: 48% Town, 34% Regional Services, 18% Education).\n• 2026 Instalment Due Dates: Interim Bills: February 27 & April 30. Final Bills: June 30 & September 30.\n• Late Penalty: 1.25% per month applied on the first day of default.\n• Payment Options: Online banking (Payee: 'Town of Maplewood - Property Taxes' using your 19-digit Roll Number), Pre-Authorized Debit (10-month equal withdrawal or 4-instalment plan), or 24/7 North Entrance drop box.",
        sourceTitle: 'Property Tax Assessments & Instalment Schedule',
        sourceUrl: '/taxes/info',
      };
    }

    // 7. SNOW EMERGENCY & WINTER PARKING (Chapter 257)
    if (
      q.includes('snow') ||
      q.includes('winter') ||
      q.includes('plow') ||
      q.includes('parking ban') ||
      q.includes('neige') ||
      q.includes('stationnement') ||
      q.includes('nieve') ||
      q.includes('estacionamiento') ||
      q.includes('chapter 257')
    ) {
      if (lang === 'fr') {
        return {
          text: "Règlements d'hiver et voies d'urgence de déneigement (Chapitre 257) :\n• Interdiction de stationnement de nuit : Il est interdit de stationner dans les rues municipales entre 2h00 et 6h00 du 1er décembre au 31 mars (amende de 60 $).\n• Voies d'urgence de déneigement : 22 artères prioritaires (Valley St, Wyoming Ave, Springfield Ave, Baker St, etc.) ont une interdiction stricte de stationnement dès que la chaussée est couverte de neige. Remorquage immédiat en vertu de l'article 257-31.\n• Dégagement des trottoirs : Les propriétaires doivent déneiger leurs trottoirs dans les 24 heures (Chapitre 239). Il est interdit de projeter la neige dans les rues déneigées.",
          sourceTitle: 'Déneigement et voies d\'urgence (Chapitre 257)',
          sourceUrl: '/services/snow',
        };
      }
      if (lang === 'es') {
        return {
          text: "Normativa de nieve y rutas de emergencia (Capítulo 257):\n• Prohibición nocturna : Prohibido estacionar en calles municipales de 2:00 AM a 6:00 AM (del 1 de diciembre al 31 de marzo; multa de $60).\n• Corredores de emergencia para nieve : En 22 calles designadas (Valley St, Wyoming Ave, Baker St, Springfield Ave, etc.) queda suspendido todo estacionamiento con nieve en la vía. Remolque inmediato bajo § 257-31.\n• Limpieza de aceras : Obligatorio limpiar nieve y hielo de aceras dentro de las 24 horas siguientes (Capítulo 239). Prohibido palear nieve hacia calles ya despejadas.",
          sourceTitle: 'Rutas de Emergencia de Nieve y Limpieza Vial',
          sourceUrl: '/services/snow',
        };
      }
      return {
        text: "Winter Maintenance & Chapter 257 Snow Emergency Regulations:\n• Overnight Parking Ban: On-street parking prohibited between 2:00 AM and 6:00 AM from December 1 to March 31 under By-law 2023-88 ($60 fine).\n• Snow Emergency Routes: Under Chapter 257 (§ 257-36.7 & § 257-2.5), 22 designated corridors (Valley St, Wyoming Ave, Ridgewood Rd, Springfield Ave, Boyden Ave, Parker Ave, Baker St, etc.) have emergency no-parking upon declaration of snow-covered roadways. Obstructing vehicles are subject to immediate towing and impoundment under § 257-31.\n• Sidewalk Clearing: Property owners must clear snow and ice within 24 hours of snowfall cessation (§ 239-1). Depositing snow back onto plowed roadways is strictly prohibited (§ 239-2).",
        sourceTitle: 'Winter Maintenance & Chapter 257 Snow Emergency Routes',
        sourceUrl: '/services/snow',
      };
    }

    // 8. PUBLIC WORKS FACILITY (359 Boyden Ave)
    if (
      q.includes('dpw') ||
      q.includes('public works') ||
      q.includes('boyden') ||
      q.includes('travaux publics') ||
      q.includes('obras públicas') ||
      q.includes('yard') ||
      q.includes('leaf') ||
      q.includes('feuille') ||
      q.includes('hojas')
    ) {
      if (lang === 'fr') {
        return {
          text: "Dépôt des Travaux Publics (DPW) - 359 Boyden Avenue :\n• Heures d'ouverture : Du lundi au vendredi de 8h00 à 15h00 ; le samedi de 8h00 à 12h00 (midi). Téléphone : (973) 762-1175.\n• Services : Dépôt de recyclage bi-flux, journées de collecte des encombrants le samedi, ramassage des feuilles d'automne en 4 rondes de quartier, navette Jitney vers la gare (95 $/an), et paillis/compost gratuit pour les résidents.",
          sourceTitle: 'Dépôt des Travaux Publics et Centre de Recyclage',
          sourceUrl: '/services/public-works',
        };
      }
      if (lang === 'es') {
        return {
          text: "Centro de Obras Públicas (DPW) - 359 Boyden Avenue:\n• Horarios : Lunes a viernes de 8:00 AM a 3:00 PM; Sábados de 8:00 AM a 12:00 PM (mediodía). Teléfono: (973) 762-1175.\n• Servicios disponibles : Reciclaje de doble flujo, jornadas sabatinas de desecho de muebles grandes, recolección de hojas en 4 rondas rotativas, servicio de autobús Jitney a la estación de tren ($95/año) y abono/compost gratuito.",
          sourceTitle: 'Centro de Obras Públicas y Reciclaje de Maplewood',
          sourceUrl: '/services/public-works',
        };
      }
      return {
        text: "Maplewood Department of Public Works (DPW) Facility (359 Boyden Ave):\n• Operating Hours: Monday to Friday: 8:00 AM – 3:00 PM; Saturday: 8:00 AM – 12:00 PM (Noon). Phone: (973) 762-1175.\n• Programs: Dual-stream curbside recycling sorting, biannual bulk drop-off days (furniture, mattresses with 2 forms of Maplewood ID), 4 seasonal curbside leaf vacuum rounds, Jitney train station commuter bus ($95/year), free mulch/compost, and electronics e-waste recycling.",
        sourceTitle: 'Department of Public Works Facility & Recycling Center',
        sourceUrl: '/services/public-works',
      };
    }

    // 9. PET LICENSING & ANIMALS
    if (
      q.includes('dog') ||
      q.includes('pet') ||
      q.includes('animal') ||
      q.includes('chien') ||
      q.includes('perro') ||
      q.includes('mascota') ||
      q.includes('leash') ||
      q.includes('laisse') ||
      q.includes('correa')
    ) {
      if (lang === 'fr') {
        return {
          text: "Services aux animaux et contrôle animalier :\n• Licence canine obligatoire : 30,00 $ / an pour un chien stérilisé ; 45,00 $ / an pour un chien non stérilisé.\n• Règlement sur la laisse (Règlement 2020-04) : Les chiens doivent être tenus en laisse d'au plus 2,0 mètres dans tous les espaces publics, sauf dans l'enclos du parc à chiens Maplewood Bark Park (42 River Valley Rd).\n• Animaux perdus : Refuge régional de soins pour animaux au (555) 123-4567 poste 240.",
          sourceTitle: 'Contrôle des animaux et licences pour chiens',
          sourceUrl: '/services/animals',
        };
      }
      if (lang === 'es') {
        return {
          text: "Servicios de Animales y Control de Mascotas:\n• Licencia de perro obligatoria : $30.00 / año para perros esterilizados; $45.00 / año para perros no esterilizados.\n• Ordenanza de correa (2020-04) : Longitud máxima de correa de 2.0 metros en todas las áreas públicas, aceras y parques (salvo dentro del parque para perros Maplewood Bark Park).\n• Mascotas perdidas : Centro regional de rescate animal al (555) 123-4567 ext. 240.",
          sourceTitle: 'Control Animal y Licencias Caninas',
          sourceUrl: '/services/animals',
        };
      }
      return {
        text: "Town of Maplewood Animal Control & Dog Licensing:\n• Annual Dog Tags: $30.00 / year (spayed/neutered); $45.00 / year (intact). Replacement tag: $10.00.\n• Leash By-law (By-law 2020-04): Dogs must be kept on a physical leash no longer than 2.0 meters (6.5 feet) in all public spaces, sidewalks, and parks, except inside the fenced Maplewood Bark Park (42 River Valley Rd).\n• Lost Pets & Rescue: Regional Animal Care Center dispatch at (555) 123-4567 ext. 240.",
        sourceTitle: 'Animal Services & Pet Licensing',
        sourceUrl: '/services/animals',
      };
    }

    // 10. 311 CITIZEN SERVICE REQUESTS
    if (
      q.includes('request') ||
      q.includes('report an issue') ||
      q.includes('311') ||
      q.includes('demande') ||
      q.includes('signaler') ||
      q.includes('solicitud') ||
      q.includes('reportar')
    ) {
      if (lang === 'fr') {
        return {
          text: "Portail des demandes de service citoyen 311 de Maplewood :\n• Vous pouvez signaler en ligne : nids-de-poule, collecte manquée (après 17h00), lampadaires éteints, branches d'arbres dangereuses et problèmes de parcs.\n• Chaque demande reçoit un numéro de dossier (ex. : CASE-2026-ROAD-XXXX) avec une entente de niveau de service (SLA) garantie.\n• Urgences 24/7 : Routes (555) 123-7623 | Eau (555) 123-9287.",
          sourceTitle: 'Portail de demandes de service 311',
          sourceUrl: '/services/request',
          permitLink: {
            title: 'Soumettre une demande de service 311 en ligne',
            url: '/services/request',
            fee: 'Gratuit / Service public',
          },
        };
      }
      if (lang === 'es') {
        return {
          text: "Portal de Solicitudes de Servicio Ciudadano 311 de Maplewood:\n• Puede reportar en línea : baches viales, recolección de basura omitida (después de las 5:00 PM), luminarias averiadas, árboles de la acera caídos y juegos infantiles dañados.\n• Cada solicitud genera un número de seguimiento (ej. : CASE-2026-ROAD-XXXX) con tiempo de respuesta garantizado.\n• Emergencias 24/7 : Carreteras (555) 123-7623 | Agua (555) 123-9287.",
          sourceTitle: 'Portal de Solicitudes Ciudadanas 311',
          sourceUrl: '/services/request',
          permitLink: {
            title: 'Enviar reporte o solicitud de servicio 311',
            url: '/services/request',
            fee: 'Gratuito / Servicio público',
          },
        };
      }
      return {
        text: "Maplewood 311 Citizen Service Request Portal:\n• Submit non-emergency work requests online: pothole repairs (24h SLA for travel lanes), missed curbside collection (after 5 PM), dark streetlight fixtures, and boulevard tree hazards.\n• Automated tracking: Every submission receives a tracking Case ID (e.g., CASE-2026-ROAD-XXXX) routed directly to municipal field crews.\n• 24/7 Hotlines: Roads (555) 123-7623 | Water Main Breaks (555) 123-9287 | Downed Wires 1-800-434-1235.",
        sourceTitle: '311 Citizen Service Request Portal',
        sourceUrl: '/services/request',
        permitLink: {
          title: 'Submit 311 Municipal Service Request',
          url: '/services/request',
          fee: 'Free Civic Service',
        },
      };
    }

    // 11. CASE STATUS TRACKING
    if (
      q.includes('track') ||
      q.includes('case-2026') ||
      q.includes('case id') ||
      q.includes('status') ||
      q.includes('suivi') ||
      q.includes('statut') ||
      q.includes('seguimiento') ||
      q.includes('estado')
    ) {
      if (lang === 'fr') {
        return {
          text: "Suivi des dossiers de service 311 et permis municipaux :\n• Vous pouvez vérifier le statut en direct de votre demande (Reçu -> Assigné -> En cours -> Complété) à l'aide de votre numéro de référence (ex. : CASE-2026-ROAD-4102 ou PERM-DECK-2026-XXXX).\n• Vous verrez les notes des équipes municipales et l'heure d'intervention prévue.",
          sourceTitle: 'Vérifier le statut d\'une demande',
          sourceUrl: '/services/track',
          permitLink: {
            title: 'Ouvrir l\'outil de suivi de dossier en direct',
            url: '/services/track',
            fee: 'Suivi instantané',
          },
        };
      }
      if (lang === 'es') {
        return {
          text: "Seguimiento de Casos 311 y Permisos Municipales:\n• Consulte el estado en vivo de su solicitud (Recibido -> Asignado -> En Progreso -> Completado) ingresando su número de referencia (ej. : CASE-2026-ROAD-4102 o PERM-DECK-2026-XXXX).\n• Podrá revisar notas de la cuadrilla municipal y tiempo estimado de resolución.",
          sourceTitle: 'Seguimiento de Solicitudes 311',
          sourceUrl: '/services/track',
          permitLink: {
            title: 'Consultar estado de caso en vivo',
            url: '/services/track',
            fee: 'Consulta instantánea',
          },
        };
      }
      return {
        text: "Track Your Municipal Case or Permit Status:\n• Enter your Tracking Number (e.g., CASE-2026-ROAD-4102 or PERM-DECK-2026-XXXX) into our 311 Tracker.\n• Live 4-stage workflow: Received -> Assigned -> In Progress -> Completed, including supervisor field notes and dispatch timestamps.",
        sourceTitle: 'Track 311 Service Request Status',
        sourceUrl: '/services/track',
        permitLink: {
          title: 'Track Work Order / Case Status Online',
          url: '/services/track',
          fee: 'Real-time Lookup',
        },
      };
    }

    // 12. TOWN INFORMATION, MAYOR & COUNCIL
    if (
      q.includes('mayor') ||
      q.includes('council') ||
      q.includes('councillor') ||
      q.includes('maire') ||
      q.includes('alcalde') ||
      q.includes('alcaldesa') ||
      q.includes('ward') ||
      q.includes('population') ||
      q.includes('budget') ||
      q.includes('about') ||
      q.includes('facilities') ||
      q.includes('eleanor vance')
    ) {
      if (lang === 'fr') {
        return {
          text: "Gouvernance et profil de la Ville de Maplewood :\n• Mairesse : Eleanor Vance (Bureau de la mairesse, poste 101).\n• Maire adjoint : Marcus Sterling.\n• Conseillers municipaux (4 districts) : Claire Fontaine (District 1 - Centre-ville), David K. Chen (District 2 - Nord), Fatima Al-Mansoor (District 3 - Vallée ouest), Robert MacIntyre (District 4 - Est).\n• Population : 42 850 résidents (16 420 ménages) &middot; Budget de fonctionnement : 58,4 M$ CAD.\n• Séances du conseil : 1er et 3e mardi du mois à 19h00.",
          sourceTitle: 'Mairesse, Conseil et Administration municipale',
          sourceUrl: '/about',
        };
      }
      if (lang === 'es') {
        return {
          text: "Gobierno y perfil cívico del Municipio de Maplewood:\n• Alcaldesa : Eleanor Vance (Despacho de Alcaldía, ext. 101).\n• Vicealcalde : Marcus Sterling.\n• Concejales (4 distritos) : Claire Fontaine (Distrito 1 - Centro Histórico), David K. Chen (Distrito 2 - Norte), Fatima Al-Mansoor (Distrito 3 - Valle Rural), Robert MacIntyre (Distrito 4 - Este).\n• Población : 42,850 habitantes &middot; Presupuesto operativo anual : $58.4 millones CAD.\n• Reuniones del concejo : 1.er y 3.er martes de cada mes a las 7:00 PM.",
          sourceTitle: 'Alcaldesa, Concejo y Administración de Maplewood',
          sourceUrl: '/about',
        };
      }
      return {
        text: "Town of Maplewood Governance & Civic Overview:\n• Mayor: Eleanor Vance (Head of Council, ext. 101).\n• Deputy Mayor: Marcus Sterling (Councillor-at-Large, ext. 102).\n• Ward Councillors: Ward 1 (Claire Fontaine - Downtown), Ward 2 (David K. Chen - North), Ward 3 (Fatima Al-Mansoor - Rural/West Valley), Ward 4 (Robert MacIntyre - East).\n• Civic Statistics: Population 42,850; 16,420 households; 64.2 km² land area; Annual operating budget of $58.4M CAD.\n• Council Meetings: 1st & 3rd Tuesday of each month at 7:00 PM in Council Chambers (Live-streamed).",
        sourceTitle: 'Town Information, Mayor & Council Directory',
        sourceUrl: '/about',
      };
    }

    // Default Fallback
    if (lang === 'fr') {
      return {
        text: "Je peux vous aider avec les services municipaux de Maplewood ! Vous pouvez me poser des questions sur les permis de construire (terrasses, piscines, brûlage), la collecte des ordures et du recyclage, le signalement des nids-de-poule, les taxes foncières ou les règlements de stationnement d'hiver. Que souhaitez-vous savoir ?",
        sourceTitle: 'Portail des services municipaux de Maplewood',
        sourceUrl: '/sitemap',
      };
    }
    if (lang === 'es') {
      return {
        text: "¡Puedo ayudarle con todos los servicios del Municipio de Maplewood! Puede consultarme sobre permisos de construcción (terrazas, piscinas, quema agrícola), horarios de basura y reciclaje, reporte de baches en calles, fechas de impuestos prediales o normativas de invierno. ¿En qué tema le gustaría profundizar?",
        sourceTitle: 'Directorio Municipal de Maplewood',
        sourceUrl: '/sitemap',
      };
    }
    return {
      text: "I am ready to help you with Town of Maplewood municipal inquiries! You can ask about building & pool permits, open-air burning, curbside waste & recycling schedules, pothole repair SLAs, property tax instalments, or snow emergency parking bans. How can I assist you further?",
      sourceTitle: 'Town of Maplewood Municipal Knowledge Portal',
      sourceUrl: '/sitemap',
    };
  };

  // Step A: Initialize Session with WayHall backend
  const connectSession = async (customUrl?: string) => {
    if (engineMode !== 'api') {
      return;
    }
    const targetUrl = customUrl || apiBaseUrl;
    setConnectionStatus('connecting');
    setConnectionError(null);
    try {
      console.log('[WayHall Widget] Initializing session with backend:', targetUrl);
      const data = await initResidentSession(targetUrl, conversationId);
      if (data?.conversation?.id) {
        setConversationId(data.conversation.id);
        localStorage.setItem('wayhall_conversation_id', String(data.conversation.id));
        setConnectionStatus('connected');
        setConnectionError(null);
        if (!data.is_anonymous) {
          const profile = {
            name: data.conversation.resident_name || 'Resident',
            isAnonymous: false,
          };
          setResidentProfile(profile);
          localStorage.setItem('wayhall_resident_profile', JSON.stringify(profile));
        }
      } else {
        throw new Error('Unexpected response structure received from session initialization.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[WayHall Widget] Backend connection failed:', msg);
      setConnectionStatus('error');
      setConnectionError(msg);
    }
  };

  useEffect(() => {
    if (isOpen && engineMode === 'api' && connectionStatus !== 'connected') {
      connectSession();
    }
  }, [isOpen, engineMode]);

  const detectPermitLinkFromText = (
    text: string
  ): { title: string; url: string; fee: string } | undefined => {
    const lower = text.toLowerCase();
    if (lower.includes('deck') || lower.includes('terrasse')) {
      return {
        title:
          language === 'fr'
            ? 'Formulaire de demande de permis de terrasse en ligne'
            : language === 'es'
            ? 'Formulario de solicitud de permiso de terraza en línea'
            : 'Apply Online for Deck Construction Permit',
        url: '/permits/apply/deck',
        fee: '$185.00 CAD',
      };
    }
    if (
      lower.includes('pool') ||
      lower.includes('piscine') ||
      lower.includes('piscina') ||
      lower.includes('clôture') ||
      lower.includes('fence')
    ) {
      return {
        title:
          language === 'fr'
            ? "Demande de permis d'enceinte de piscine en ligne"
            : language === 'es'
            ? 'Formulario de solicitud de permiso de piscina en línea'
            : 'Apply Online for Pool Enclosure Permit',
        url: '/permits/apply/pool',
        fee: '$150.00 CAD',
      };
    }
    if (
      lower.includes('burn') ||
      lower.includes('brûlage') ||
      lower.includes('quema') ||
      lower.includes('agricultural burn')
    ) {
      return {
        title:
          language === 'fr'
            ? 'Demande de permis de brûlage en plein air en ligne'
            : language === 'es'
            ? 'Formulario de solicitud de permiso de quema agrícola'
            : 'Apply Online for Open-Air Burn Permit',
        url: '/permits/apply/burn',
        fee: 'Free (Res) / $25 (Ag)',
      };
    }
    if (
      lower.includes('pothole') ||
      lower.includes('nid-de-poule') ||
      lower.includes('bache') ||
      lower.includes('311') ||
      lower.includes('missed waste') ||
      lower.includes('service request')
    ) {
      return {
        title:
          language === 'fr'
            ? 'Soumettre une demande de service 311 en ligne'
            : language === 'es'
            ? 'Enviar reporte o solicitud de servicio 311'
            : 'Submit 311 Municipal Service Request',
        url: '/services/request',
        fee:
          language === 'fr'
            ? 'Gratuit / Service public'
            : language === 'es'
            ? 'Gratuito / Servicio público'
            : 'Free Civic Service',
      };
    }
    if (
      lower.includes('track') ||
      lower.includes('suivi') ||
      lower.includes('seguimiento') ||
      lower.includes('case-2026')
    ) {
      return {
        title:
          language === 'fr'
            ? "Ouvrir l'outil de suivi de dossier en direct"
            : language === 'es'
            ? 'Consultar estado de caso en vivo'
            : 'Track Work Order / Case Status Online',
        url: '/services/track',
        fee: 'Real-time Lookup',
      };
    }
    return undefined;
  };

  const renderMessageWithLinks = (text: string) => {
    if (!text) return null;
    const parts: React.ReactNode[] = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const label = match[1];
      const url = match[2];

      parts.push(
        <a
          key={`md-link-${match.index}`}
          href={url}
          onClick={(e) => handleDirectFormClick(e, url)}
          className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded transition-colors underline cursor-pointer text-[11px] my-0.5"
          title={`Open form: ${label}`}
        >
          <span>📋 {label}</span>
        </a>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Step C: Send SMS OTP
  const handleRequestSmsCode = async () => {
    if (!phoneNumberInput.trim()) {
      setPhoneError('Please enter a phone number in E.164 format (e.g. +16095551234)');
      return;
    }
    setPhoneLoading(true);
    setPhoneError(null);
    try {
      await requestSmsCode(phoneNumberInput.trim(), apiBaseUrl);
      setPhoneStep('otp');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send SMS code.';
      setPhoneError(`${msg} (You can also link directly without SMS).`);
    } finally {
      setPhoneLoading(false);
    }
  };

  // Step C: Verify OTP & Link Session
  const handleVerifyAndLink = async () => {
    if (!smsCodeInput.trim()) {
      setPhoneError('Please enter the 6-digit code received via SMS.');
      return;
    }
    setPhoneLoading(true);
    setPhoneError(null);
    try {
      await verifySmsCode(phoneNumberInput.trim(), smsCodeInput.trim(), apiBaseUrl);
      const linked = await linkResidentSession(
        {
          conversationId: conversationId || 0,
          phoneNumber: phoneNumberInput.trim(),
          residentName: residentNameInput.trim() || 'Resident',
        },
        apiBaseUrl
      );
      setPhoneStep('success');
      const profile = {
        name: linked.conversation.resident_name || residentNameInput || 'Resident',
        phone: phoneNumberInput.trim(),
        isAnonymous: false,
      };
      setResidentProfile(profile);
      localStorage.setItem('wayhall_resident_profile', JSON.stringify(profile));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed.';
      setPhoneError(msg);
    } finally {
      setPhoneLoading(false);
    }
  };

  // Step C: Direct Link without SMS (Instant transition)
  const handleDirectLink = async () => {
    if (!phoneNumberInput.trim()) {
      setPhoneError('Please enter your phone number.');
      return;
    }
    setPhoneLoading(true);
    setPhoneError(null);
    try {
      const linked = await linkResidentSession(
        {
          conversationId: conversationId || 0,
          phoneNumber: phoneNumberInput.trim(),
          residentName: residentNameInput.trim() || 'Resident',
        },
        apiBaseUrl
      );
      setPhoneStep('success');
      const profile = {
        name: linked.conversation.resident_name || residentNameInput || 'Resident',
        phone: phoneNumberInput.trim(),
        isAnonymous: false,
      };
      setResidentProfile(profile);
      localStorage.setItem('wayhall_resident_profile', JSON.stringify(profile));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to link session.';
      setPhoneError(msg);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleSaveSettings = () => {
    const cleaned = settingsUrlInput.trim();
    setApiBaseUrl(cleaned);
    localStorage.setItem('wayhall_api_base', cleaned);
    localStorage.setItem('wayhall_engine_mode', engineMode);
    setShowSettings(false);
    if (engineMode === 'api') {
      connectSession(cleaned);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      console.log('[WayHall Widget] Testing connection with:', settingsUrlInput);
      const data = await initResidentSession(settingsUrlInput, null);
      if (data?.conversation?.id) {
        setTestResult({
          success: true,
          message: `Connected! Created session #${data.conversation.id} ("${data.conversation.resident_name}").`,
        });
        setConversationId(data.conversation.id);
        localStorage.setItem('wayhall_conversation_id', String(data.conversation.id));
        setConnectionStatus('connected');
        setConnectionError(null);
      } else {
        setTestResult({ success: false, message: 'Invalid response from server.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        success: false,
        message: `Connection failed: ${msg}`,
      });
      setConnectionStatus('error');
      setConnectionError(msg);
    } finally {
      setIsTesting(false);
    }
  };

  // Step B: Send Questions & Receive Streamed Responses
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // ── Engine Mode: Remote API Mode (DEFAULT) ──
    if (engineMode === 'api') {
      let activeConvId = conversationId;

      // 1. Ensure Session is Initialized (Step A)
      if (!activeConvId) {
        setConnectionStatus('connecting');
        try {
          console.log('[WayHall Widget] On-demand session init for query:', query);
          const initRes = await initResidentSession(apiBaseUrl, null);
          if (initRes?.conversation?.id) {
            activeConvId = initRes.conversation.id;
            setConversationId(activeConvId);
            localStorage.setItem('wayhall_conversation_id', String(activeConvId));
            setConnectionStatus('connected');
            setConnectionError(null);
          } else {
            throw new Error('Failed to obtain conversation ID from session initialization.');
          }
        } catch (initErr: unknown) {
          const errMsg = initErr instanceof Error ? initErr.message : String(initErr);
          console.error('[WayHall Widget] Failed to initialize session:', errMsg);
          setConnectionStatus('error');
          setConnectionError(errMsg);
          setIsTyping(false);

          const errBotMsg: Message = {
            id: `assistant-err-${Date.now()}`,
            sender: 'assistant',
            text: `⚠️ **Unable to connect to Wayhall Server**\n\nTarget Endpoint: \`${apiBaseUrl}\`\nError: *${errMsg}*\n\nPlease verify that your backend server is running and reachable. You can click ⚙️ in the header to change the endpoint or test connection.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, errBotMsg]);
          return;
        }
      }

      // 2. Stream AI response (Step B)
      const assistantMsgId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          sender: 'assistant',
          text: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
        },
      ]);

      try {
        await streamConversationQuery({
          apiBase: apiBaseUrl,
          conversationId: activeConvId,
          query,
          callbacks: {
            onMetadata: (meta: StreamMetadataEvent) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        citations: meta.citations || m.citations,
                        sourceTitle: meta.sourceTitle || m.sourceTitle,
                        sourceUrl: meta.sourceUrl || m.sourceUrl,
                        permitLink: meta.permitLink || m.permitLink,
                      }
                    : m
                )
              );
            },
            onDelta: (delta: string) => {
              setIsTyping(false);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        text: (m.text || '') + delta,
                      }
                    : m
                )
              );
            },
            onComplete: () => {
              setIsTyping(false);
              setConnectionStatus('connected');
              setConnectionError(null);
              setMessages((prev) =>
                prev.map((m) => {
                  if (m.id !== assistantMsgId) return m;
                  const detected = m.permitLink || detectPermitLinkFromText(m.text || query);
                  return {
                    ...m,
                    isStreaming: false,
                    permitLink: detected,
                  };
                })
              );
            },
            onError: (streamErr: Error) => {
              console.warn('[WayHall API] Streaming error:', streamErr);
              setIsTyping(false);
              setConnectionStatus('error');
              setConnectionError(streamErr.message);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        text: m.text?.trim()
                          ? `${m.text}\n\n*(Stream ended with warning: ${streamErr.message})*`
                          : `⚠️ Error streaming answer from WayHall API (${apiBaseUrl}):\n\n*${streamErr.message}*`,
                        isStreaming: false,
                      }
                    : m
                )
              );
            },
          },
        });
        return;
      } catch (streamErr: unknown) {
        const streamErrMsg = streamErr instanceof Error ? streamErr.message : String(streamErr);
        console.error('[WayHall Widget] Live stream failed:', streamErrMsg);
        setConnectionStatus('error');
        setConnectionError(streamErrMsg);
        setIsTyping(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  text: `⚠️ **Wayhall API Request Error**\n\nCould not stream response for conversation #${activeConvId}.\nError: *${streamErrMsg}*\n\nEnsure backend URL (\`${apiBaseUrl}\`) is reachable and allows browser cross-origin requests.`,
                  isStreaming: false,
                }
              : m
          )
        );
        return;
      }
    }

    // ── Engine Mode: Local Mock Engine ──
    setTimeout(() => {
      const answer = findAnswer(query, language);
      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: answer.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceTitle: answer.sourceTitle,
        sourceUrl: answer.sourceUrl,
        permitLink: answer.permitLink,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    const systemNotice: Message = {
      id: `sys-${Date.now()}`,
      sender: 'assistant',
      text: welcomeText[newLang],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, systemNotice]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: welcomeText[language],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* ── Main Chat Window Modal / Drawer ── */}
      {isOpen ? (
        <section
          className="bg-white rounded-2xl shadow-2xl border-2 border-blue-900 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          aria-label="Wayhall AI Municipal Chat Window"
          role="dialog"
          aria-modal="true"
        >
          {/* Header Bar */}
          <div className="bg-blue-950 text-white p-3 flex items-center justify-between border-b border-blue-900 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-base shadow-inner">
                🤖
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Wayhall AI Municipal</span>
                  {engineMode === 'api' ? (
                    connectionStatus === 'connected' ? (
                      <span
                        title={`Connected to Wayhall server: ${apiBaseUrl}`}
                        className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-semibold bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-500/50 shadow-xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ● Connected #{conversationId || 'Ready'}
                      </span>
                    ) : connectionStatus === 'connecting' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-semibold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                        ● Connecting...
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => connectSession()}
                        title={
                          connectionError
                            ? `Connection Error: ${connectionError} (Click to Retry)`
                            : 'Click to retry connecting to Wayhall API'
                        }
                        className="inline-flex items-center gap-1 text-[10px] text-rose-300 font-semibold bg-rose-950/90 px-2 py-0.5 rounded-full border border-rose-500/50 hover:bg-rose-900 transition-colors cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        ● Disconnected (Retry)
                      </button>
                    )
                  ) : (
                    <span
                      title="Operating in offline local rule engine mode"
                      className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-semibold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/50"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      ● Local Engine
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-blue-200">
                  {townData.townInfo.name} · Official Public WebChat
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Step C: Save to Phone Trigger */}
              <button
                type="button"
                onClick={() => {
                  setShowPhoneModal(true);
                  setShowSettings(false);
                }}
                title={
                  residentProfile && !residentProfile.isAnonymous
                    ? `Verified: ${residentProfile.name} (${residentProfile.phone})`
                    : 'Save this chat session to your phone (SMS / WhatsApp)'
                }
                className={`text-[10px] font-semibold px-2 py-1 rounded transition-all flex items-center gap-1 ${
                  residentProfile && !residentProfile.isAnonymous
                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-500 hover:bg-emerald-800'
                    : 'bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700'
                }`}
                aria-label="Save chat to phone"
              >
                <span>📱</span>
                <span className="hidden sm:inline">
                  {residentProfile && !residentProfile.isAnonymous ? 'Linked' : 'Save to Phone'}
                </span>
              </button>

              {/* Settings Toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowPhoneModal(false);
                }}
                title="Configure backend server URL"
                className={`text-xs p-1.5 rounded hover:bg-blue-900 transition-colors ${
                  showSettings ? 'bg-blue-900 text-white ring-1 ring-blue-400' : 'text-blue-300'
                }`}
                aria-label="Chatbot settings"
              >
                ⚙️
              </button>

              <button
                type="button"
                onClick={clearChat}
                title="Reset conversation"
                className="text-blue-300 hover:text-white text-xs p-1.5 rounded hover:bg-blue-900 transition-colors"
                aria-label="Clear chat history"
              >
                🔄
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white text-base font-bold p-1 leading-none rounded hover:bg-blue-900 transition-colors"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Omnichannel Verified Resident Banner (Step C Active State) */}
          {residentProfile && !residentProfile.isAnonymous && (
            <div className="bg-emerald-950 text-emerald-100 px-3 py-1 text-[10px] flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span>
                  Resident Linked: <strong>{residentProfile.name}</strong> ({residentProfile.phone})
                </span>
              </div>
              <span className="text-[9px] bg-emerald-800/80 text-emerald-100 px-1.5 py-0.2 rounded font-mono">
                Omnichannel Active
              </span>
            </div>
          )}

          {/* Settings Drawer Overlay */}
          {showSettings && (
            <div className="bg-slate-900 text-slate-100 p-3.5 border-b border-slate-700 text-xs animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between font-bold text-slate-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <span>⚙️</span>
                  <span>Chatbot Engine & Connection Settings</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>

              {/* Mode Selection */}
              <div className="mb-2.5">
                <label className="block text-[10px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Engine Mode:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEngineMode('api')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all text-left flex items-center justify-between ${
                      engineMode === 'api'
                        ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Remote / API Mode</span>
                    {engineMode === 'api' && <span>✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngineMode('local')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all text-left flex items-center justify-between ${
                      engineMode === 'local'
                        ? 'bg-amber-600 border-amber-400 text-white shadow-xs'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Local Mock Engine</span>
                    {engineMode === 'local' && <span>✓</span>}
                  </button>
                </div>
              </div>

              {/* API URL Config */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] font-mono text-slate-400">
                      WayHall Backend Endpoint:
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Conv ID: <strong className="text-amber-300">{conversationId || 'None'}</strong>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={settingsUrlInput}
                    onChange={(e) => setSettingsUrlInput(e.target.value)}
                    placeholder="http://3.99.89.39:8000/api"
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setSettingsUrlInput('http://3.99.89.39:8000/api')}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2 py-0.5 rounded border border-slate-700 font-semibold"
                  >
                    AWS Server (3.99.89.39:8000)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsUrlInput('http://localhost:8000/api')}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-300 px-2 py-0.5 rounded border border-slate-700"
                  >
                    Localhost:8000
                  </button>
                </div>

                {/* Test Feedback or Last Error */}
                {testResult ? (
                  <div
                    className={`text-[10px] p-2 rounded border ${
                      testResult.success
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-700 text-rose-200'
                    }`}
                  >
                    {testResult.success ? '✅ ' : '❌ '}
                    {testResult.message}
                  </div>
                ) : connectionError ? (
                  <div className="text-[10px] p-2 rounded border bg-rose-950/80 border-rose-700 text-rose-200">
                    ⚠️ {connectionError}
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    type="button"
                    disabled={isTesting}
                    onClick={handleTestConnection}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-[11px] font-semibold px-2.5 py-1.5 rounded border border-slate-600 transition-colors"
                  >
                    {isTesting ? 'Testing...' : '⚡ Test Connection'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded transition-colors shadow-xs"
                  >
                    Save & Connect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step C: Phone Verification & Omnichannel Linking Modal Overlay */}
          {showPhoneModal && (
            <div className="bg-gradient-to-b from-blue-950 to-slate-900 text-white p-3.5 border-b border-blue-800 text-xs shadow-lg animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between font-bold text-white mb-2">
                <span className="flex items-center gap-1.5">
                  <span>📱</span>
                  <span>Save Chat to Your Phone & WhatsApp</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPhoneModal(false)}
                  className="text-slate-300 hover:text-white text-xs font-bold p-0.5"
                >
                  ✕
                </button>
              </div>

              {phoneStep === 'input' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-blue-200 leading-snug">
                    Save this session to continue on SMS or WhatsApp without losing your answers and
                    inquiries:
                  </p>
                  <div>
                    <label className="block text-[10px] text-slate-300 mb-0.5">Your Name (Optional):</label>
                    <input
                      type="text"
                      value={residentNameInput}
                      onChange={(e) => setResidentNameInput(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-2.5 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-300 mb-0.5">
                      Phone Number (E.164, e.g. +16095551234):
                    </label>
                    <input
                      type="tel"
                      value={phoneNumberInput}
                      onChange={(e) => setPhoneNumberInput(e.target.value)}
                      placeholder="+16095551234"
                      className="w-full px-2.5 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono"
                    />
                  </div>
                  {phoneError && (
                    <div className="text-[10px] text-rose-300 bg-rose-950/60 p-1.5 rounded border border-rose-800">
                      ⚠️ {phoneError}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      type="button"
                      disabled={phoneLoading}
                      onClick={handleDirectLink}
                      className="text-[10px] text-slate-300 hover:text-white underline"
                      title="Link immediately without waiting for SMS code"
                    >
                      Link Without SMS Code
                    </button>
                    <button
                      type="button"
                      disabled={phoneLoading || !phoneNumberInput.trim()}
                      onClick={handleRequestSmsCode}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {phoneLoading ? 'Sending...' : 'Send SMS Code →'}
                    </button>
                  </div>
                </div>
              )}

              {phoneStep === 'otp' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-blue-200">
                    Enter the 6-digit verification code sent to{' '}
                    <strong className="text-white font-mono">{phoneNumberInput}</strong>:
                  </p>
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      value={smsCodeInput}
                      onChange={(e) => setSmsCodeInput(e.target.value)}
                      placeholder="123456"
                      className="w-full tracking-widest text-center text-lg font-mono font-bold px-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  {phoneError && (
                    <div className="text-[10px] text-rose-300 bg-rose-950/60 p-1.5 rounded border border-rose-800">
                      ⚠️ {phoneError}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setPhoneStep('input')}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                    >
                      ← Change Phone
                    </button>
                    <button
                      type="button"
                      disabled={phoneLoading || smsCodeInput.length < 4}
                      onClick={handleVerifyAndLink}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {phoneLoading ? 'Verifying...' : 'Verify & Link Session ✓'}
                    </button>
                  </div>
                </div>
              )}

              {phoneStep === 'success' && (
                <div className="space-y-2 text-center py-2">
                  <div className="text-2xl">🎉</div>
                  <div className="font-bold text-emerald-300 text-xs">
                    Conversation Successfully Linked!
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    Session <strong>#{conversationId}</strong> is now tied to your profile. If you
                    text or message Maplewood via SMS or WhatsApp, this entire conversation is ready
                    and synchronized!
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPhoneModal(false)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors mt-1"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Language Selector Bar (US-12 & US-13) */}
          <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">
              🌐 Language / Langue / Idioma:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('fr')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  language === 'fr'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Français
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('es')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  language === 'es'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Español
              </button>
            </div>
          </div>

          {/* Chat Messages Scroll Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'assistant' ? renderMessageWithLinks(msg.text) : msg.text}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-blue-600 animate-pulse align-middle" />
                  )}

                  {/* Grounded Document Citations (from WayHall Step B metadata) */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                        <span>📚</span>
                        <span>Official Grounded Citations</span>
                      </div>
                      <div className="space-y-1">
                        {msg.citations.map((cite, cIdx) => (
                          <div
                            key={cIdx}
                            className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-[10px]"
                          >
                            <div className="font-bold text-blue-900 flex items-center justify-between">
                              <span>{cite.title || 'Municipal Reference Document'}</span>
                              {cite.url && (
                                <a
                                  href={cite.url}
                                  onClick={(e) => handleDirectFormClick(e, cite.url!)}
                                  className="text-blue-600 hover:underline cursor-pointer"
                                >
                                  View Doc →
                                </a>
                              )}
                            </div>
                            {cite.snippet && (
                              <p className="text-slate-600 text-[10px] mt-0.5 line-clamp-2 italic">
                                "{cite.snippet}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Online Permit Application Link Card (If provided) */}
                  {msg.permitLink && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-blue-900">
                        {msg.permitLink.url.includes('/services/')
                          ? language === 'es'
                            ? '⚡ Formulario Directo de Solicitud 311'
                            : language === 'fr'
                            ? '⚡ Formulaire Direct de Demande 311'
                            : '⚡ Direct 311 Service Request Form'
                          : language === 'es'
                          ? '⚡ Formulario Oficial de Permiso en Línea'
                          : language === 'fr'
                          ? '⚡ Formulaire Officiel de Permis en Ligne'
                          : '⚡ Direct Online Permit Form'}
                      </div>
                      <a
                        href={msg.permitLink.url}
                        onClick={(e) => handleDirectFormClick(e, msg.permitLink!.url)}
                        className="block bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-950 font-bold p-2.5 rounded-xl transition-colors shadow-xs group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs group-hover:underline">
                            {msg.permitLink.title}
                          </span>
                          <span className="text-[10px] font-mono bg-blue-900 text-white px-1.5 py-0.5 rounded">
                            {msg.permitLink.fee}
                          </span>
                        </div>
                        <div className="text-[10px] text-blue-700 font-normal mt-0.5">
                          {language === 'es'
                            ? 'Haga clic para abrir y llenar el formulario directo →'
                            : language === 'fr'
                            ? 'Cliquez pour ouvrir et remplir le formulaire direct →'
                            : 'Click to open and jump directly to online form →'}
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Source Citation Grounding Link (US-08) */}
                  {msg.sourceUrl && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1">
                      <span>📖 Source:</span>
                      <a
                        href={msg.sourceUrl}
                        onClick={(e) => handleDirectFormClick(e, msg.sourceUrl!)}
                        className="text-blue-700 hover:underline font-semibold cursor-pointer"
                      >
                        {msg.sourceTitle || 'Town of Maplewood By-laws'} →
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.sender === 'user' ? 'You' : 'Wayhall AI'} · {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl w-fit shadow-xs">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] ml-1 text-slate-400 font-medium">Wayhall is replying...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips Bar */}
          <div className="p-2 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
            {quickPrompts[language].map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.query)}
                className="whitespace-nowrap bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Text Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Posez une question à Wayhall...'
                  : language === 'es'
                  ? 'Haga una pregunta a Wayhall...'
                  : 'Ask Wayhall a municipal question...'
              }
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs p-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center"
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </section>
      ) : (
        /* ── Closed State Floating Button / Badge ── */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-blue-950 text-white p-3 rounded-2xl shadow-2xl border-2 border-blue-700 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-left group"
          aria-label="Open Wayhall AI Municipal Assistant"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-xl shadow-inner transition-colors">
            🤖
          </div>
          <div className="pr-2">
            <div className="text-xs font-bold flex items-center gap-1.5 text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Wayhall AI Municipal Assistant
            </div>
            <div className="text-[11px] text-slate-300">
              Ask in English, French or Spanish
            </div>
          </div>
        </button>
      )}
    </div>
  );
}