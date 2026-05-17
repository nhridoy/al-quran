import { useEffect, useState } from "react";
import { BiBookOpen } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Header/Header";

interface HadithBook {
  name: string;
  id: string;
  available: number;
}

export default function HadithCollections() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.hadith.gading.dev/books")
      .then((r) => r.json())
      .then((d) => {
        setBooks(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Header head="Hadith Collections" showBack />
      <div className="mx-4 space-y-4 pb-8 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Hadith Collections
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Browse major hadith collections
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-surface-alt dark:bg-dark-surface-alt"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {books.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => navigate(`/hadith/${book.id}`)}
                className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface p-5 text-left transition-all hover:border-secondary/30 hover:shadow-md dark:border-dark-border dark:bg-dark-surface-card dark:hover:border-secondary/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                  <BiBookOpen className="text-lg text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {book.name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {book.available.toLocaleString()} hadith
                  </p>
                </div>
                <span className="text-xs text-secondary">&rarr;</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
