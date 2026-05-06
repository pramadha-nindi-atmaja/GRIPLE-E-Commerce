type Item = {
  title: string;
  content: string;
};

type Props = {
  items: Item[];
};

export function ProductAccordion({ items }: Props) {
  return (
    <div className="mt-10 divide-y divide-outline-variant border-t border-outline-variant">
      {items.map((item) => (
        <details key={item.title} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase">
              {item.title}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
              expand_more
            </span>
          </summary>
          <div className="mt-4 text-body-md font-body-md text-on-surface-variant">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}

