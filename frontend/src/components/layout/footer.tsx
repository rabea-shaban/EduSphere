"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Globe, Camera, MessageCircle, Video, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Logo } from "../common";

export function Footer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const t = useTranslations("Footer");

  return (
    <footer
      className={cn("bg-card border-t border-border/80 w-full py-16 px-4 mt-auto", className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-left rtl:text-right">
          {/* Column 1: Logo, Slogan & Socials */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="sm" showText={true} />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-semibold">
              {t("about")}
            </p>
            <div className="flex items-center gap-3 text-muted-foreground pt-2">
              <a href="https://facebook.com" aria-label="Facebook" className="hover:text-primary transition-colors">
                <MessageCircle className="h-4.5 w-4.5" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="hover:text-primary transition-colors">
                <Globe className="h-4.5 w-4.5" />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="hover:text-primary transition-colors">
                <Camera className="h-4.5 w-4.5" />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className="hover:text-primary transition-colors">
                <Video className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Stages */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider select-none">
              {t("stages")}
            </h4>
            <ul className="space-y-2 text-xs font-bold text-muted-foreground">
              <li><a href="#stages" className="hover:text-primary transition-colors">{t("primary")}</a></li>
              <li><a href="#stages" className="hover:text-primary transition-colors">{t("prep")}</a></li>
              <li><a href="#stages" className="hover:text-primary transition-colors">{t("sec1")}</a></li>
              <li><a href="#stages" className="hover:text-primary transition-colors">{t("sec2")}</a></li>
              <li><a href="#stages" className="hover:text-primary transition-colors">{t("sec3")}</a></li>
            </ul>
          </div>

          {/* Column 3: Subjects */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider select-none">
              {t("subjects")}
            </h4>
            <ul className="space-y-2 text-xs font-bold text-muted-foreground">
              <li><a href="#subjects" className="hover:text-primary transition-colors">{t("math")}</a></li>
              <li><a href="#subjects" className="hover:text-primary transition-colors">{t("science")}</a></li>
              <li><a href="#subjects" className="hover:text-primary transition-colors">{t("arabic")}</a></li>
              <li><a href="#subjects" className="hover:text-primary transition-colors">{t("english")}</a></li>
              <li><a href="#subjects" className="hover:text-primary transition-colors">{t("physics")}</a></li>
              <li><a href="#subjects" className="hover:text-primary transition-colors">{t("chemistry")}</a></li>
            </ul>
          </div>

          {/* Column 4: Important Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider select-none">
              {t("links")}
            </h4>
            <ul className="space-y-2 text-xs font-bold text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">{t("blog")}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">{t("privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">{t("terms")}</Link></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">{t("faq")}</a></li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider select-none">
              {t("contact")}
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:info@edusphere.com" className="hover:text-primary transition-colors">info@edusphere.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+201234567890" className="hover:text-primary transition-colors">+20 123 456 7890</a>
              </li>
              <li className="flex items-center gap-2 select-none">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Egypt</span>
              </li>
              <li className="flex items-center gap-2 select-none">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Sat - Thu, 10 AM - 10 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border/40 text-center text-xs font-semibold text-muted-foreground select-none">
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
