import {
  AiFillTwitterCircle,
  AiOutlineGithub,
  AiOutlineMail,
} from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { IoLogoFacebook, IoLogoWhatsapp } from "react-icons/io5";
import { PageShell } from "@/components/common/PageShell/PageShell";
import { useLocale } from "@/i18n";

const About: React.FC = () => {
  const { t } = useLocale();
  return (
    <PageShell
      head={t("about.pageTitle")}
      title={t("about.title")}
      description={t("about.description")}
    >
      <div className="card-surface">
        <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
            <BsInfoCircle className="text-lg text-primary dark:text-secondary-light" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              {t("about.contactUs")}
            </h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-4 text-2xl">
            <a
              href="https://github.com/nhridoy"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-2 text-text-secondary transition-all hover:bg-surface-alt hover:text-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt dark:hover:text-secondary-light"
            >
              <AiOutlineGithub />
            </a>
            <a
              href="https://www.facebook.com/nahidujjaman.hridoy"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-2 text-text-secondary transition-all hover:bg-surface-alt hover:text-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt dark:hover:text-secondary-light"
            >
              <IoLogoFacebook />
            </a>
            <a
              href="https://twitter.com/hridoyboss12"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-2 text-text-secondary transition-all hover:bg-surface-alt hover:text-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt dark:hover:text-secondary-light"
            >
              <AiFillTwitterCircle />
            </a>
            <a
              href="mailto:nahidujjamanhridoy@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-2 text-text-secondary transition-all hover:bg-surface-alt hover:text-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt dark:hover:text-secondary-light"
            >
              <AiOutlineMail />
            </a>
            <a
              href="https://wa.me/8801768098882"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-2 text-text-secondary transition-all hover:bg-surface-alt hover:text-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface-alt dark:hover:text-secondary-light"
            >
              <IoLogoWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="card-surface">
        <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
            <span className="text-lg font-bold text-primary dark:text-secondary-light">
              01
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              {t("about.binarySoftwareSolution")}
            </h3>
            <p className="text-xs text-text-muted dark:text-dark-text-muted">
              {t("about.teamDesc")}
            </p>
          </div>
        </div>
        <div className="space-y-2 p-4">
          <address className="space-y-1 text-sm text-text-secondary not-italic dark:text-dark-text-secondary">
            <p>{t("about.addressDhaka")}</p>
            <p>{t("about.phone")}</p>
            <p>{t("about.email")}</p>
          </address>
        </div>
      </div>

      <div className="card-surface">
        <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
            <span className="text-lg font-bold text-primary dark:text-secondary-light">
              02
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
              {t("about.whatWeDo")}
            </h3>
          </div>
        </div>
        <div className="space-y-2 p-4">
          {[
            "about.bullet1",
            "about.bullet2",
            "about.bullet3",
            "about.bullet4",
          ].map((key) => (
            <div
              key={key}
              className="flex items-start gap-2 text-sm text-text-secondary dark:text-dark-text-secondary"
            >
              <GoDotFill className="mt-0.5 shrink-0 text-xs text-primary dark:text-secondary-light" />
              <span>{t(key)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-linear-to-br from-primary/5 to-secondary/5 p-4 text-center text-sm font-medium text-text-muted dark:from-primary/10 dark:to-secondary/10 dark:text-dark-text-muted">
        {t("about.website")}
      </div>
    </PageShell>
  );
};

export default About;
