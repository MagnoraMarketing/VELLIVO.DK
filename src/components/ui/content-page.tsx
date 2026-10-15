import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DraftNotice } from "@/components/ui/missing";

export function ContentPage({
  title,
  intro,
  path,
  draft = false,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  path: string;
  draft?: boolean;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: title, href: path }]} />
      <article className="mt-6 max-w-3xl">
        <h1 className="text-4xl font-medium">{title}</h1>
        {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
        {updated && <p className="mt-2 text-xs text-muted">Senest opdateret: {updated}</p>}
        <div className="mt-8">
          {draft && <DraftNotice />}
          <div className="prose-vellivo">{children}</div>
        </div>
      </article>
    </div>
  );
}
