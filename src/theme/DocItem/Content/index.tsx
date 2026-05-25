import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import ClaudeSkillButton, {
  type ClaudeSkillFrontmatter,
} from '@site/src/components/ClaudeSkillButton';

function useSyntheticTitle() {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) return null;
  return metadata.title;
}

function normalizeSkill(raw: unknown): ClaudeSkillFrontmatter | null {
  if (!raw) return null;
  if (typeof raw === 'string') {
    return raw.trim() ? {name: raw.trim()} : null;
  }
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (typeof obj.name === 'string' && obj.name.trim()) {
      return {
        name: obj.name.trim(),
        description:
          typeof obj.description === 'string' ? obj.description : undefined,
        path: typeof obj.path === 'string' ? obj.path : undefined,
      };
    }
  }
  return null;
}

export default function DocItemContent({children}: {children: React.ReactNode}) {
  const syntheticTitle = useSyntheticTitle();
  const {frontMatter} = useDoc();
  const skill = normalizeSkill((frontMatter as Record<string, unknown>).claudeSkill);

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}
      {skill && <ClaudeSkillButton skill={skill} />}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
