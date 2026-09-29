import { Icon } from "@/components/icons";
import { creator, creatorContactLinks, type CreatorProfile } from "@/config/creator";
import { site } from "@/data/site";

export function CreatorCredit({ profile = creator }: { profile?: CreatorProfile }) {
  const contacts = creatorContactLinks(profile);
  const links = [
    { label: "Email", href: contacts.email, action: "email", external: false },
    { label: "WhatsApp", href: contacts.whatsapp, action: "whatsapp", external: true },
    { label: "LinkedIn", href: profile.linkedinUrl, action: "linkedin", external: true },
    { label: "GitHub", href: profile.githubUrl, action: "github", external: true },
  ];

  return (
    <section className="creator-note" aria-labelledby="creator-invitation" data-creator-project={site.name}>
      <div className="creator-credit">
        <p className="creator-label">Independent Concept Project</p>
        <p className="creator-byline">Designed &amp; developed by</p>
        <p className="creator-name">{profile.name}</p>
        <p className="creator-role">{profile.title}</p>
        <p className="creator-location">{profile.location}</p>
        <p className="creator-availability">{profile.availability}</p>
        <nav className="creator-links" aria-label="Contact the creator">
          {links.map(link => (
            <a key={link.action} href={link.href} tabIndex={0} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} data-creator-action={link.action} data-creator-placement="credit">
              {link.label}<Icon name="arrow-up-right" />
            </a>
          ))}
        </nav>
      </div>
      <div className="creator-inquiry">
        <p className="creator-prompt">Have a similar project in mind?</p>
        <h2 id="creator-invitation">Let’s build something<br /><em>together.</em></h2>
        <p className="creator-scope">A website, an application, or a digital product.</p>
        <details className="creator-contact">
          <summary className="button button-cream" data-creator-action="start-project">
            Start a Project<span className="icon-slot" aria-hidden="true"><Icon name="arrow-up-right" /></span>
          </summary>
          <div className="creator-contact-options">
            <p>Contact {profile.name} about your project</p>
            <a href={contacts.whatsapp} tabIndex={0} target="_blank" rel="noopener noreferrer" data-creator-action="whatsapp" data-creator-placement="project-options">
              <span><strong>WhatsApp</strong><span>{profile.whatsappDisplay}</span></span><Icon name="arrow-up-right" />
            </a>
            <a href={contacts.email} tabIndex={0} data-creator-action="email" data-creator-placement="project-options">
              <span><strong>Email</strong><span>{profile.email}</span></span><Icon name="arrow-up-right" />
            </a>
          </div>
        </details>
        {profile.portfolioUrl && (
          <a className="creator-portfolio" href={profile.portfolioUrl} tabIndex={0} target="_blank" rel="noopener noreferrer" data-creator-action="portfolio">
            View Portfolio<Icon name="arrow-up-right" />
          </a>
        )}
      </div>
    </section>
  );
}
