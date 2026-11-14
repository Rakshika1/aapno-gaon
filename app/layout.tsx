import '@mantine/core/styles.css';
import './styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'mySociety',
  description: 'A local issue reporting and tracking website.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head><ColorSchemeScript forceColorScheme="light" /></head>
      <body><MantineProvider forceColorScheme="light">{children}</MantineProvider></body>
    </html>
  );
}
