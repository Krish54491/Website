// grid of thumbnail cards that link somewhere(used for games and tools)
import GlowCard from "./GlowCard";
import ThemedImage, { type ImageSource } from "./ThemedImage";

export type GridItem = {
  id: string;
  name: string;
  description: string;
  path: string;
  lightThumbnail?: ImageSource;
  darkThumbnail?: ImageSource;
  mobile?: boolean; // false hides the card on small screens
};

export function ItemCard({
  item,
  fallbackImage,
}: {
  item: GridItem;
  fallbackImage?: string;
}) {
  return (
    <GlowCard
      to={item.path}
      className={item.mobile === false ? "hidden md:flex" : ""}
    >
      <ThemedImage
        light={item.lightThumbnail}
        dark={item.darkThumbnail}
        fallback={fallbackImage}
        alt={item.name}
        className="aspect-video w-full border-b-2 border-primary"
      />
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-5">
        <h2 className="text-base font-bold text-primary sm:text-xl">
          {item.name}
        </h2>
        <p className="hidden text-sm text-muted-foreground sm:block">
          {item.description}
        </p>
      </div>
    </GlowCard>
  );
}

export default function ItemGrid({
  items,
  emptyMessage = "Nothing here yet",
  fallbackImage,
}: {
  items: GridItem[];
  emptyMessage?: string;
  fallbackImage?: string;
}) {
  if (items.length === 0) {
    return <p className="text-center text-muted-foreground">{emptyMessage}</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} fallbackImage={fallbackImage} />
      ))}
    </div>
  );
}
