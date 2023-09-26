import React from 'react';
import { useI18nContext } from '@/i18n/i18n-react';
import Link from 'next/link';
import Image from 'next/image';

type FooterProps = {}

export default function Footer({}: FooterProps) {
  const { LL } = useI18nContext();

  return (
    <footer className="bg-primary-300 text-white py-6">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sitemap */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{LL.home.footer.sitemap.TITEL()}</h3>
            <ul className="space-y-1">
              <li><Link href="/" className="hover:underline">{LL.home.footer.sitemap.HOME()}</Link></li>
              <li><Link href="/faq" className="hover:underline">{LL.home.footer.sitemap.FAQ()}</Link></li>
              <li><Link href="/docs" className="hover:underline">{LL.home.footer.sitemap.DOCS()}</Link></li>
              <li><Link href="https://www.dmun.de/impressum/">{LL.home.footer.sitemap.PRIVACY()}</Link></li>
            </ul>
          </div>

          {/* Impressum */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{LL.home.footer.imprint.TITEL()}</h3>
            <p>{LL.home.footer.imprint.ORGANISATION()}</p>
            <p>{LL.home.footer.imprint.ADDRESS()}</p>
            <p><Link href="mailto:vorstand@dmun.de">{LL.home.footer.imprint.EMAIL()}</Link></p>
            <p><Link href="https://www.dmun.de">{LL.home.footer.imprint.WEBSITE()}</Link></p>
            <Image
            src={"/dmunlogo/logo-weiss.png"}
            alt="Logo"
            width={128}
            height={128}
            className="my-2"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}