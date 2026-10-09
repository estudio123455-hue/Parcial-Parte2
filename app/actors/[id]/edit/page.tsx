import ActorForm from '@/components/ActorForm';
export default function EditActorPage({ params }: { params: { id: string } }) { return <ActorForm actorId={params.id}/>; }
