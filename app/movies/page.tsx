'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Movie, Prize, request } from '@/lib/api';

export default function MoviesPage() {
  const [movies,setMovies]=useState<Movie[]>([]); const [query,setQuery]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(true);
  useEffect(()=>{let active=true; (async()=>{try{const data=await request<Movie[]>('/movies');const full=await Promise.all(data.map(async m=>{try{return {...m,prizes:await request<Prize[]>(`/movies/${m.id}/prizes`)};}catch{return m;}}));if(active)setMovies(full);}catch(e){if(active)setError(e instanceof Error?e.message:'No se pudieron cargar las películas.');}finally{if(active)setLoading(false);}})();return()=>{active=false;};},[]);
  const filtered=movies.filter(m=>m.title.toLowerCase().includes(query.toLowerCase()));
  return <><div className="page-head"><div><span className="eyebrow">EL ARCHIVO</span><h1>Películas</h1><p>Historias que merecen ser recordadas.</p></div><Link className="button" href="/movies/new">＋ Crear película</Link></div><div className="toolbar"><input className="search" placeholder="Buscar película…" value={query} onChange={e=>setQuery(e.target.value)}/><span className="count">{movies.length} títulos</span></div>{error&&<div className="error">{error}<br/>Comprueba que el backend esté activo en localhost:3000.</div>}{loading?<div className="loading">Cargando catálogo…</div>:<div className="movie-grid">{filtered.map(m=><Link href={`/movies/${m.id}`} className="movie-card" key={m.id}>{m.poster?<img className="poster" src={m.poster} alt={`Afiche de ${m.title}`}/>:<div className="poster-placeholder">{m.title.slice(0,1)}</div>}<div className="movie-info"><h3>{m.title}</h3><span className="movie-meta">{m.releaseDate?.slice(0,10)} · {m.duration} min</span><div className="movie-credit">Actor: {m.actors?.[0]?.name || 'Sin asignar'}<br/>Premio: {m.prizes?.[0]?.name || 'Sin premio'}</div></div></Link>)}</div>}{!loading&&!filtered.length&&<div className="empty">No se encontraron películas.</div>}</>;
}
