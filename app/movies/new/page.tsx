'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { request } from '@/lib/api';

type Form = Record<string,string>;
const initial: Form = {
  title:'',poster:'',duration:'',country:'',releaseDate:'',popularity:'0',genre:'Drama',
  actorName:'',actorPhoto:'',actorNationality:'',actorBirthDate:'',actorBiography:'',
  directorName:'',directorPhoto:'',directorNationality:'',directorBirthDate:'',directorBiography:'',
  trailerName:'',trailerUrl:'',trailerDuration:'',trailerChannel:'',
  prizeName:'',prizeCategory:'',prizeYear:'',prizeStatus:'won',
};
export default function NewMoviePage() {
  const [f,setF]=useState(initial);const [error,setError]=useState('');const [done,setDone]=useState('');const [busy,setBusy]=useState(false);
  const set=(key:string,value:string)=>setF(old=>({...old,[key]:value}));
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError('');setDone('');try{
    // The backend requires genre, director and trailer relations when creating a movie.
    const genre=await request<{id:string}>('/genres',{method:'POST',body:JSON.stringify({type:f.genre})});
    const director=await request<{id:string}>('/directors',{method:'POST',body:JSON.stringify({name:f.directorName,photo:f.directorPhoto,nationality:f.directorNationality,birthDate:f.directorBirthDate,biography:f.directorBiography})});
    const trailer=await request<{id:string}>('/youtube-trailers',{method:'POST',body:JSON.stringify({name:f.trailerName,url:f.trailerUrl,duration:Number(f.trailerDuration),channel:f.trailerChannel})});
    const movie=await request<{id:string}>('/movies',{method:'POST',body:JSON.stringify({title:f.title,poster:f.poster,duration:Number(f.duration),country:f.country,releaseDate:f.releaseDate,popularity:Number(f.popularity),genre:{id:genre.id},director:{id:director.id},youtubeTrailer:{id:trailer.id}})});
    const actor=await request<{id:string}>('/actors',{method:'POST',body:JSON.stringify({name:f.actorName,photo:f.actorPhoto,nationality:f.actorNationality,birthDate:f.actorBirthDate,biography:f.actorBiography})});
    await request(`/actors/${actor.id}/movies/${movie.id}`,{method:'POST'});
    const prize=await request<{id:string}>('/prizes',{method:'POST',body:JSON.stringify({name:f.prizeName,category:f.prizeCategory,year:Number(f.prizeYear),status:f.prizeStatus})});
    await request(`/movies/${movie.id}/prizes/${prize.id}`,{method:'POST'});
    setDone('Película, actor y premio creados y asociados. Abriendo el detalle…');window.setTimeout(()=>window.location.assign(`/movies/${movie.id}`),1000);
  }catch(err){setError(`${err instanceof Error?err.message:'No se pudo completar la operación'} Algunas entidades pueden haberse creado antes del error; verifica el catálogo antes de volver a intentarlo.`);setBusy(false);}}
  return <div className="panel"><Link className="back" href="/movies">← Volver al catálogo</Link><div className="panel-header"><span className="eyebrow">NUEVO REGISTRO</span><h1>Crear película</h1><p className="subtle">La película, el actor, el director, el género, el tráiler y el premio se crean por separado y luego se vinculan.</p></div>
    <form onSubmit={submit}><div className="form-grid"><div className="section-label">01 · Película</div><Field label="Título" value={f.title} set={v=>set('title',v)} required/><Field label="País" value={f.country} set={v=>set('country',v)} required/><Field label="URL del afiche" type="url" value={f.poster} set={v=>set('poster',v)} required/><Field label="Género" value={f.genre} set={v=>set('genre',v)} required/><Field label="Fecha de lanzamiento" type="date" value={f.releaseDate} set={v=>set('releaseDate',v)} required/><Field label="Duración (minutos)" type="number" value={f.duration} set={v=>set('duration',v)} required/><Field label="Popularidad" type="number" value={f.popularity} set={v=>set('popularity',v)} required/>
      <div className="section-label">02 · Actor principal</div><Field label="Nombre" value={f.actorName} set={v=>set('actorName',v)} required/><Field label="Nacionalidad" value={f.actorNationality} set={v=>set('actorNationality',v)} required/><Field label="URL de fotografía" type="url" value={f.actorPhoto} set={v=>set('actorPhoto',v)} required/><Field label="Fecha de nacimiento" type="date" value={f.actorBirthDate} set={v=>set('actorBirthDate',v)} required/><Area label="Biografía del actor" value={f.actorBiography} set={v=>set('actorBiography',v)}/>
      <div className="section-label">03 · Director requerido por el backend</div><Field label="Nombre" value={f.directorName} set={v=>set('directorName',v)} required/><Field label="Nacionalidad" value={f.directorNationality} set={v=>set('directorNationality',v)} required/><Field label="URL de fotografía" type="url" value={f.directorPhoto} set={v=>set('directorPhoto',v)} required/><Field label="Fecha de nacimiento" type="date" value={f.directorBirthDate} set={v=>set('directorBirthDate',v)} required/><Area label="Biografía del director" value={f.directorBiography} set={v=>set('directorBiography',v)}/>
      <div className="section-label">04 · Tráiler requerido por el backend</div><Field label="Nombre" value={f.trailerName} set={v=>set('trailerName',v)} required/><Field label="Canal" value={f.trailerChannel} set={v=>set('trailerChannel',v)} required/><Field label="URL del tráiler" type="url" value={f.trailerUrl} set={v=>set('trailerUrl',v)} required/><Field label="Duración (segundos)" type="number" value={f.trailerDuration} set={v=>set('trailerDuration',v)} required/>
      <div className="section-label">05 · Premio</div><Field label="Nombre del premio" value={f.prizeName} set={v=>set('prizeName',v)} required/><Field label="Categoría" value={f.prizeCategory} set={v=>set('prizeCategory',v)} required/><Field label="Año" type="number" value={f.prizeYear} set={v=>set('prizeYear',v)} required/><div className="field"><label>Estado</label><select value={f.prizeStatus} onChange={e=>set('prizeStatus',e.target.value)}><option value="won">Ganado</option><option value="nominated">Nominado</option></select></div>
    </div>{error&&<div className="error">{error}</div>}{done&&<div className="success">{done}</div>}<div className="form-actions"><Link className="button button-light" href="/movies">Cancelar</Link><button className="button" disabled={busy}>{busy?'Creando registros…':'Crear película y asociar'}</button></div></form></div>;
}
function Field({label,value,set,type='text',required=false}:{label:string;value:string;set:(v:string)=>void;type?:string;required?:boolean}){return <div className="field"><label>{label}</label><input type={type} value={value} onChange={e=>set(e.target.value)} required={required}/></div>}
function Area({label,value,set}:{label:string;value:string;set:(v:string)=>void}){return <div className="field full"><label>{label}</label><textarea value={value} onChange={e=>set(e.target.value)} required/></div>}
