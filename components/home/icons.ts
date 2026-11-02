import { BarChart3, Globe, Layers, Link2, Lock, MapPin, MessageSquare, Users, Zap, type LucideIcon } from "lucide-react";
import type { IconName } from "@/content/home";

// Content names icons as strings; this is the only place they become components.
export const icons: Record<IconName, LucideIcon> = { BarChart3, Users, Zap, MessageSquare, Link2, Layers, MapPin, Globe, Lock };
