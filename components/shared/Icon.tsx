import {
  Landmark,
  Wallet,
  Banknote,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Rocket,
  Scale,
  Home,
  Car,
  GraduationCap,
  Coins,
  Handshake,
  Monitor,
  Plane,
  Settings,
  Mail,
  Clock,
  BadgeCheck,
  CircleDot,
  AlertTriangle,
  Lightbulb,
  Lock,
  Info,
  Download,
  ShoppingBag,
  Building2,
  PartyPopper,
  Sparkles,
  BarChart3,
  Calculator,
  Compass,
  FileText,
  Mic,
  Store,
  UtensilsCrossed,
  Briefcase,
  Factory,
  Receipt,
  Globe,
  ScrollText,
  Building,
  Gem,
  Stethoscope,
  Baby,
  Sprout,
  Bot,
  RefreshCw,
  MapPin,
  CheckCircle2,
  LifeBuoy,
  Inbox,
  X,
  MessageCircle,
  Check,
  type LucideIcon,
} from "lucide-react";

/**
 * Central icon registry. Replaces the emojis that were previously sprinkled
 * across data files and JSX so the whole site uses one consistent set of
 * lucide line-icons. Add new keys here rather than reintroducing emojis.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  // Finance / product modules
  bank: Landmark,
  fd: Landmark,
  loan: Wallet,
  money: Banknote,
  personal: CircleDollarSign,
  sip: TrendingUp,
  insurance: ShieldCheck,
  gold: Coins,
  silver: Gem,
  building: Building,
  health: Stethoscope,
  cash: Banknote,
  child: Baby,
  crop: Sprout,

  // Trend / direction
  up: TrendingUp,
  down: TrendingDown,
  chart: BarChart3,
  calculator: Calculator,
  compass: Compass,
  document: FileText,

  // Loan / scheme categories
  home: Home,
  car: Car,
  education: GraduationCap,
  travel: Plane,
  desktop: Monitor,
  settings: Settings,
  rocket: Rocket,
  balance: Scale,
  safety: LifeBuoy,
  handshake: Handshake,
  store: Store,
  food: UtensilsCrossed,
  business: Briefcase,
  factory: Factory,
  receipt: Receipt,
  global: Globe,
  certificate: ScrollText,

  // Contact / utility
  email: Mail,
  clock: Clock,
  voice: Mic,
  location: MapPin,
  success: CheckCircle2,
  leads: Inbox,
  download: Download,
  shopping: ShoppingBag,
  city: Building2,

  // Status / signals
  check: BadgeCheck,
  tick: Check,
  partial: CircleDot,
  ai: Bot,
  updated: RefreshCw,
  warning: AlertTriangle,
  tip: Lightbulb,
  lock: Lock,
  secure: Lock,
  info: Info,
  celebrate: PartyPopper,
  sparkle: Sparkles,
  close: X,
  chat: MessageCircle,
};

export type IconName = keyof typeof ICON_MAP;

type IconProps = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

/**
 * Renders a lucide line-icon by registry key. Falls back to a neutral
 * sparkle if an unknown key is passed, so a typo never crashes the page.
 */
export function Icon({ name, className = "h-6 w-6", strokeWidth = 1.75 }: IconProps) {
  const Cmp = ICON_MAP[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export default Icon;
