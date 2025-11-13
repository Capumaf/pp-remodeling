type Props = {
  title: string;
  summary: string;
  bullets?: string[];
};

export default function ServiceCard({ title, summary, bullets = [] }: Props) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <h3 className="text-lg font-bold mb-2 text-[#2E7D32]">{title}</h3>
      <p className="text-sm text-gray-700 mb-3">{summary}</p>
      {bullets.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </article>
  );
}
