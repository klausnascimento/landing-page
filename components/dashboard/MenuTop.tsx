import Link from "next/link";

interface MeuBotaoProps {
  texto: string;
  numero?: number;
  href: string;
}

function MeuBotao(props: MeuBotaoProps) {
  return (
    <Link href={props.href}>
      <button className="bg-blue-500 h-10 px-3 rounded-xs font-medium text-white antialiased">
        {props.texto}
      </button>
    </Link>
  );
}
export function MenuTop() {
  return (
    <div className="flex gap-2">
      <MeuBotao texto="Sobre Mim" numero={1} href="/sobre" />
      <MeuBotao texto="Experiência" numero={2} href="/experiencia" />
      <MeuBotao texto="Habilidades" numero={3} href="/habilidades" />
      <MeuBotao texto="Educação" numero={4} href="/educacao" />
      <MeuBotao texto="Contato" numero={5} href="/" />
    </div>
  );
}
