import React, {useEffect, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export type ClaudeSkillFrontmatter = {
  name: string;
  description?: string;
  path?: string;
};

type SkillBundle = {description: string; body: string};

type Props = {
  skill: ClaudeSkillFrontmatter;
};

/* ───────────── Icons ───────────── */

const SparkleIcon = ({size = 16}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3l1.7 5.3a3 3 0 002 2L21 12l-5.3 1.7a3 3 0 00-2 2L12 21l-1.7-5.3a3 3 0 00-2-2L3 12l5.3-1.7a3 3 0 002-2L12 3z"
      fill="currentColor"
    />
  </svg>
);

/* Anthropic-inspired 8-point starburst — Claude's brand mark */
const ClaudeMark = ({size = 18}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1.5l1.2 7.1 5.1-4-4 5.1 7.2 1.3-7.2 1.3 4 5.1-5.1-4L12 22.5l-1.2-7.1-5.1 4 4-5.1L2.5 13l7.2-1.3-4-5.1 5.1 4L12 1.5z" />
  </svg>
);

/* Cursor — stylized angular cursor with two-tone wedge */
const CursorMark = ({size = 18}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4.5 3.2L20.2 12 13 13.6 11 21 4.5 3.2z"
      fill="currentColor"
    />
    <path
      d="M11 21L13 13.6 20.2 12 11 21z"
      fill="currentColor"
      opacity="0.55"
    />
  </svg>
);

/* Claude Code — terminal frame with a sparkle (AI + code) */
const TerminalMark = ({size = 18}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="2.7"
      y="4.5"
      width="18.6"
      height="14"
      rx="2.4"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M6.8 9.5L9.5 12l-2.7 2.5M11.5 14.5h4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.7 3.2l.4 1.3 1.3.4-1.3.4-.4 1.3-.4-1.3-1.3-.4 1.3-.4.4-1.3z"
      fill="currentColor"
    />
  </svg>
);

const ArrowIcon = ({size = 14}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ExternalIcon = ({size = 11}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 4h6v6M10 14L20 4M19 13v6a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownloadIcon = ({size = 14}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ───────────── Helpers ───────────── */

function buildClaudePrompt(name: string, body: string): string {
  return `Please follow these instructions for the "${name}" skill, then ask me for the inputs you need.

---
${body}
---`;
}

function buildSkillFileContent(
  name: string,
  description: string,
  body: string,
): string {
  return `---
name: ${name}
description: ${description}
---

${body}
`;
}

function downloadSkillFile(filename: string, content: string) {
  const blob = new Blob([content], {type: 'text/markdown;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ───────────── Component ───────────── */

type Mode = 'closed' | 'menu' | 'cursor' | 'claudeCode';

export default function ClaudeSkillButton({skill}: Props) {
  const {siteConfig} = useDocusaurusContext();
  const skills =
    (siteConfig.customFields?.claudeSkills as Record<string, SkillBundle>) ?? {};
  const bundle = skills[skill.name];

  const [mode, setMode] = useState<Mode>('closed');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const description = skill.description || bundle?.description || '';
  const body = bundle?.body ?? '';
  const claudeUrl = bundle
    ? `https://claude.ai/new?q=${encodeURIComponent(buildClaudePrompt(skill.name, body))}`
    : '';

  const installCommand = `mkdir -p ~/.claude/skills/${skill.name} && mv ~/Downloads/${skill.name}-SKILL.md ~/.claude/skills/${skill.name}/SKILL.md`;

  useEffect(() => {
    if (mode === 'closed') return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setMode('closed');
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMode('closed');
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [mode]);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleDownload = () => {
    if (!bundle) return;
    downloadSkillFile(
      `${skill.name}-SKILL.md`,
      buildSkillFileContent(skill.name, description, body),
    );
  };

  return (
    <div className="claude-skill-fab-root" ref={rootRef}>
      {/* FAB stays mounted at all times so the once-per-page reveal
          animation does not replay every time the panel closes. When
          the panel is open we just hide it visually + disable interaction. */}
      <button
        type="button"
        className={`claude-skill-fab${mode !== 'closed' ? ' claude-skill-fab--hidden' : ''}`}
        onClick={() => setMode('menu')}
        aria-label="Run this using your AI agent"
        aria-hidden={mode !== 'closed'}
        tabIndex={mode !== 'closed' ? -1 : 0}
      >
        <span className="claude-skill-fab-icon" aria-hidden="true">
          <SparkleIcon size={14} />
        </span>
        <span className="claude-skill-fab-label-clip">
          <span className="claude-skill-fab-label">Experience Agentic Help</span>
        </span>
      </button>

      {mode !== 'closed' && (
        <div
          className="claude-skill-panel"
          role="dialog"
          aria-labelledby="claude-skill-title"
        >
          <header className="claude-skill-panel-header">
            <div className="claude-skill-panel-titles">
              <h2 id="claude-skill-title" className="claude-skill-panel-title">
                Run this using your AI agent
              </h2>
              {mode === 'menu' && description && (
                <p className="claude-skill-panel-sub">{description}</p>
              )}
            </div>
            <button
              type="button"
              className="claude-skill-panel-close"
              onClick={() => setMode('closed')}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </header>

          {mode === 'menu' && (
            <div className="claude-skill-options">
              {claudeUrl ? (
                <a
                  className="claude-skill-option"
                  href={claudeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="claude-skill-option-logo claude-skill-option-logo--claude">
                    <ClaudeMark />
                  </span>
                  <span className="claude-skill-option-body">
                    <span className="claude-skill-option-title">
                      Open in Claude
                      <span className="claude-skill-option-tag">recommended</span>
                    </span>
                    <span className="claude-skill-option-sub">
                      Run it in your browser. No setup, no install.
                    </span>
                  </span>
                  <span className="claude-skill-option-arrow" aria-hidden="true">
                    <ExternalIcon />
                  </span>
                </a>
              ) : (
                <div className="claude-skill-option claude-skill-option--disabled">
                  Skill body not available
                </div>
              )}

              <button
                type="button"
                className="claude-skill-option"
                onClick={() => setMode('cursor')}
                disabled={!bundle}
              >
                <span className="claude-skill-option-logo claude-skill-option-logo--cursor">
                  <CursorMark />
                </span>
                <span className="claude-skill-option-body">
                  <span className="claude-skill-option-title">Use in Cursor</span>
                  <span className="claude-skill-option-sub">
                    Drop the skill into a chat in your editor.
                  </span>
                </span>
                <span className="claude-skill-option-arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </button>

              <button
                type="button"
                className="claude-skill-option"
                onClick={() => setMode('claudeCode')}
                disabled={!bundle}
              >
                <span className="claude-skill-option-logo claude-skill-option-logo--cc">
                  <TerminalMark />
                </span>
                <span className="claude-skill-option-body">
                  <span className="claude-skill-option-title">
                    Install in Claude Code
                  </span>
                  <span className="claude-skill-option-sub">
                    Save it as a slash command for repeat use.
                  </span>
                </span>
                <span className="claude-skill-option-arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </button>
            </div>
          )}

          {mode === 'cursor' && (
            <Flow
              icon={<CursorMark size={15} />}
              title="Use in Cursor"
              onBack={() => setMode('menu')}
              steps={[
                {
                  label: 'Download the skill file',
                  content: (
                    <button
                      type="button"
                      className="claude-skill-download-btn"
                      onClick={handleDownload}
                    >
                      <DownloadIcon />
                      Download <code>{skill.name}-SKILL.md</code>
                    </button>
                  ),
                },
                {
                  label: 'Open Cursor and start a chat',
                  content: (
                    <p className="claude-skill-step-hint">
                      Press <kbd>⌘</kbd> <kbd>L</kbd> to open the chat panel.
                    </p>
                  ),
                },
                {
                  label: 'Drop the file in and ask Claude to follow it',
                  content: (
                    <p className="claude-skill-step-hint">
                      Drag <code>{skill.name}-SKILL.md</code> from Downloads into the
                      chat, then send: <em>“Follow these instructions.”</em>
                    </p>
                  ),
                },
              ]}
            />
          )}

          {mode === 'claudeCode' && (
            <Flow
              icon={<TerminalMark size={15} />}
              title="Install in Claude Code"
              onBack={() => setMode('menu')}
              steps={[
                {
                  label: 'Download the skill file',
                  content: (
                    <button
                      type="button"
                      className="claude-skill-download-btn"
                      onClick={handleDownload}
                    >
                      <DownloadIcon />
                      Download <code>{skill.name}-SKILL.md</code>
                    </button>
                  ),
                },
                {
                  label: 'Install it — paste this in your terminal',
                  content: (
                    <CodeRow
                      text={installCommand}
                      copyKey="install"
                      copiedKey={copiedKey}
                      onCopy={copy}
                    />
                  ),
                },
                {
                  label: 'Run it in Claude Code',
                  content: (
                    <CodeRow
                      text={`/${skill.name}`}
                      copyKey="slash"
                      copiedKey={copiedKey}
                      onCopy={copy}
                    />
                  ),
                },
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ───────────── Subcomponents ───────────── */

type FlowStep = {label: string; content: React.ReactNode};

function Flow({
  icon,
  title,
  steps,
  onBack,
}: {
  icon: React.ReactNode;
  title: string;
  steps: FlowStep[];
  onBack: () => void;
}) {
  return (
    <div className="claude-skill-flow">
      <button
        type="button"
        className="claude-skill-back"
        onClick={onBack}
        aria-label="Back"
      >
        <span aria-hidden="true">←</span> Back
      </button>
      <h3 className="claude-skill-flow-title">
        <span className="claude-skill-flow-icon">{icon}</span>
        {title}
      </h3>
      <ol className="claude-skill-steps">
        {steps.map((step, i) => (
          <li className="claude-skill-step" key={i}>
            <span className="claude-skill-step-num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="claude-skill-step-body">
              <p className="claude-skill-step-label">{step.label}</p>
              {step.content}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CodeRow({
  text,
  copyKey,
  copiedKey,
  onCopy,
}: {
  text: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <div className="claude-skill-cmd">
      <code>{text}</code>
      <button
        type="button"
        className="claude-skill-copy"
        onClick={() => onCopy(copyKey, text)}
      >
        {copiedKey === copyKey ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
