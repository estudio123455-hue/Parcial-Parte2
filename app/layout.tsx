import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = { title: 'Cinéfilo · Archivo de cine', description: 'Catálogo de películas, actores y premios' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><header className="topbar"><Link href="/movies" className="brand"><span className="brand-icon">C</span><span>CINÉFILO<small>ARCHIVO DE CINE</small></span></Link><nav><Link href="/movies">Películas</Link><Link href="/actors">Actores</Link><Link className="nav-cta" href="/movies/new">＋ Nueva película</Link></nav></header><main>{children}</main><footer>CATÁLOGO DE CINE <span>·</span> PARCIAL 1</footer></body></html>;
}
