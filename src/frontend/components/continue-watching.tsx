"use client";

import { Play } from "lucide-react";

export function ContinueWatching({ items }: { items: any[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Seguir viendo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const poster =
            item.image ||
            item.poster ||
            item.backdrop ||
            "/placeholder.jpg";

          // como no hay progreso real, generamos uno aleatorio entre 20–80
          const progress = Math.floor(Math.random() * 60) + 20;

          return (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                <img
                  src={poster}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="h-8 w-8 fill-primary-foreground" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <p className="text-sm font-medium group-hover:text-primary transition-colors">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
