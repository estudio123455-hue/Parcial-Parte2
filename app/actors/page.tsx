'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Actor, request } from '@/lib/api';

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]); const [query, setQuery] = useState(''); const [error, setError] = useState('');
  async function load() { try { setActors(await request<Actor[]>('/actors')); } catch (e) { setError(e instanceof Error ? e.message : 'No se pudieron cargar los actores.'); } }
  useEffect(() => { void load(); }, []);
  const visible = useMemo(() => actors.filter(a => `${a.name} ${a.nationality}`.toLowerCase().includes(query.toLowerCase())), [actors, query]);
  async function remove(actor: Actor) { if (!window.confirm(`¿Eliminar a ${actor.name}?`)) return; try { await request(`/actors/${actor.id}`, { method: 'DELETE' }); await load(); } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo eliminar.'); } }
  return <><div className="page-head"><div><span className="eyebrow">REPARTO · PERSONAS</span><h1>Actores</h1><p>El talento detrás de cada historia.</p></div><Link className="button" href="/actors/new">＋ Agregar actor</Link></div>
    {error && <div className="error">{error}</div>}<div className="toolbar"><input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre o nacionalidad…"/><span className="count">{visible.length} actores</span></div>
    <div className="table-wrap"><table className="table"><thead><tr><th>Actor</th><th>Nacionalidad</th><th>Fecha de nacimiento</th><th>Acciones</th></tr></thead><tbody>{visible.map(a => <tr key={a.id}><td><div className="actor-cell"><img className="avatar" src={a.photo} alt=""/><span>{a.name}</span></div></td><td>{a.nationality}</td><td>{a.birthDate?.slice(0, 10)}</td><td><div className="row-actions"><Link className="button button-light button-sm" href={`/actors/${a.id}/edit`}>Editar</Link><button className="button button-danger button-sm" onClick={() => void remove(a)}>Eliminar</button></div></td></tr>)}</tbody></table>{!visible.length && <div className="empty">No hay actores para mostrar.</div>}</div>
  </>;
}
