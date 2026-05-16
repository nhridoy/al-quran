import { AiOutlineHeart } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { GoDotFill } from "react-icons/go";
import { Header } from "../../Header/Header";

const credits = [
  { name: "Al Quran Cloud", url: "https://alquran.cloud/" },
  { name: "Al Quran BD", url: "https://alquranbd.com/" },
  { name: "Sultan Labs", url: "https://sutanlab.id/" },
  { name: "Fawaz Ahmed", url: "https://github.com/fawazahmed0/quran-api" },
  { name: "Nahidujjaman Hridoy", url: "https://github.com/nhridoy/quran-api" },
];

const Credits: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header head="Credits" />
      <div className="mx-4 space-y-4 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            Credits
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Data sources and contributors
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
          <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
              <AiOutlineHeart className="text-lg text-primary dark:text-secondary-light" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                Data Sources
              </h3>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                Special thanks to these projects
              </p>
            </div>
          </div>
          <div className="divide-y divide-border dark:divide-dark-border">
            {credits.map((credit) => (
              <a
                key={credit.name}
                href={credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-surface-alt dark:hover:bg-dark-surface-alt"
              >
                <div className="flex items-center gap-3">
                  <GoDotFill className="text-xs text-primary dark:text-secondary-light" />
                  <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                    {credit.name}
                  </span>
                </div>
                <BiLinkExternal className="text-sm text-text-muted dark:text-dark-text-muted" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
