import {
  AiFillTwitterCircle,
  AiOutlineGithub,
  AiOutlineMail,
} from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { IoLogoFacebook, IoLogoWhatsapp } from "react-icons/io5";
import { Header } from "../../Header/Header";

const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header head="About" />
      <div className="mx-4 space-y-4 md:mx-6">
        <div className="mb-2">
          <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            About Us
          </h2>
          <p className="text-sm text-text-muted dark:text-dark-text-muted">
            Learn more about the team behind Al Quran
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
          <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
              <BsInfoCircle className="text-lg text-primary dark:text-secondary-light" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                Contact Us
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

        <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
          <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
              <span className="text-lg font-bold text-primary dark:text-secondary-light">
                01
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                Binary Software Solution
              </h3>
              <p className="text-xs text-text-muted dark:text-dark-text-muted">
                We are a team of software developers and designers
              </p>
            </div>
          </div>
          <div className="space-y-2 p-4">
            <address className="space-y-1 text-sm text-text-secondary not-italic dark:text-dark-text-secondary">
              <p>Dhaka, Bangladesh</p>
              <p>+8801768098882</p>
              <p>nahidujjamanhridoy@gmail.com</p>
            </address>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface-card">
          <div className="flex items-center gap-3 border-b border-border p-4 dark:border-dark-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
              <span className="text-lg font-bold text-primary dark:text-secondary-light">
                02
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                What We Do
              </h3>
            </div>
          </div>
          <div className="space-y-2 p-4">
            {[
              "We are a team of software developers and designers.",
              "We develop web and mobile applications.",
              "We have years of experience in developing web and mobile applications.",
              "We use latest technologies to develop web and mobile applications.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 text-sm text-text-secondary dark:text-dark-text-secondary"
              >
                <GoDotFill className="mt-0.5 shrink-0 text-xs text-primary dark:text-secondary-light" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-linear-to-br from-primary/5 to-secondary/5 p-4 text-center text-sm font-medium text-text-muted dark:from-primary/10 dark:to-secondary/10 dark:text-dark-text-muted">
          www.binarytech.com
        </div>
      </div>
    </div>
  );
};

export default About;
