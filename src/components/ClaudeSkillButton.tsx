import React, {useEffect, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export type ClaudeSkillFrontmatter = {
  name: string;
  description?: string;
  path?: string;
};

type Props = {
  skill: ClaudeSkillFrontmatter;
};

const ClaudeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5 8.4 10.1 4 8.5l4.4-1.6L10 2.5z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
  </svg>
);

export default function ClaudeSkillButton({skill}: Props) {
  const {siteConfig} = useDocusaurusContext();
  const localProjectPath =
    (siteConfig.customFields?.localProjectPath as string | undefined) ?? '';

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const slashCommand = `/${skill.name}`;
  const absoluteSkillPath =
    localProjectPath && skill.path
      ? `${localProjectPath.replace(/\/$/, '')}/${skill.path}`
      : '';
  const vscodeFileUrl = absoluteSkillPath
    ? `vscode://file/${absoluteSkillPath.replace(/^\//, '')}`
    : '';

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slashCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable; ignore */
    }
  };

  return (
    <div className="claude-skill-wrap" ref={popoverRef}>
      <button
        type="button"
        className="claude-skill-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <ClaudeIcon />
        <span>Run as Claude Skill</span>
        <span className="claude-skill-btn-tag">{slashCommand}</span>
      </button>

      {open && (
        <div className="claude-skill-popover" role="dialog">
          <div className="claude-skill-popover-header">
            <span className="claude-skill-popover-title">
              Run this topic as a Claude skill
            </span>
            <button
              type="button"
              className="claude-skill-popover-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {skill.description && (
            <p className="claude-skill-popover-desc">{skill.description}</p>
          )}

          <ol className="claude-skill-steps">
            <li>
              Open this repo in VS Code with the Claude Code extension running.
            </li>
            <li>
              Paste this slash command into the Claude Code panel:
              <div className="claude-skill-cmd">
                <code>{slashCommand}</code>
                <button
                  type="button"
                  className="claude-skill-copy"
                  onClick={handleCopy}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </li>
          </ol>

          <div className="claude-skill-links">
            {vscodeFileUrl ? (
              <a className="claude-skill-link" href={vscodeFileUrl}>
                Open skill file in VS Code →
              </a>
            ) : (
              <span className="claude-skill-link claude-skill-link--muted">
                Skill source: <code>{skill.path}</code>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
