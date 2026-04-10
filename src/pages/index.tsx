import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

type Pricing = 'all' | 'free' | 'monetized';

type Api = {
  id: string;
  name: string;
  description: string;
  pricing: Pricing;
  href?: string;           // undefined = no valid link yet
  icon: React.ReactNode;
  isBeta?: boolean;
  industries: string[];
  capabilities: string[];
};

const DocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ViewerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L17 7v6l-7 4L3 13V7l7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 3v10M3 7l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const WebhookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2a5 5 0 00-4.9 6H3a2 2 0 000 4h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 8l2.5 4H10a2 2 0 000 4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 8a5 5 0 00-1-5.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const MetricsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14l4-5 4 3 4-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const APIS: Api[] = [
  {
    id: 'design-docs',
    name: 'Design Automation API',
    description: 'Automate design workflows and access geometry data. Run scripts in the cloud to process CAD files, extract data, and generate outputs.',
    pricing: 'monetized',
    href: 'docs/design-docs/developer-guide/overview',
    icon: <DocIcon />,
    industries: ['AEC'],
    capabilities: ['Document Management'],
  },
  {
    id: 'viewer',
    name: 'Viewer API',
    description: 'Embed and interact with 3D models directly in your apps. Supports CAD, BIM, and point cloud formats.',
    pricing: 'monetized',
    // href intentionally omitted — docs not yet available
    icon: <ViewerIcon />,
    industries: ['AEC'],
    capabilities: ['3D Visualization'],
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Receive real-time callbacks when important events occur in your account. Build reactive, event-driven integrations.',
    pricing: 'free',
    // href intentionally omitted — docs not yet available
    icon: <WebhookIcon />,
    industries: ['AEC'],
    capabilities: ['Document Management'],
  },
  {
    id: 'metrics',
    name: 'Metrics & Analytics',
    description: 'Access usage metrics and telemetry to understand how your integrations perform and where to optimize.',
    pricing: 'free',
    isBeta: true,
    // href intentionally omitted — docs not yet available
    icon: <MetricsIcon />,
    industries: ['AEC'],
    capabilities: ['Document Management'],
  },
  {
    id: 'mt-api',
    name: 'Machine Translation API',
    description: 'Translate content programmatically across languages using Autodesk\'s machine translation service.',
    pricing: 'free',
    href: 'docs/mt-api/developer-guide/overview',
    icon: <DocIcon />,
    industries: ['AEC'],
    capabilities: ['Document Management'],
  },
];

const INDUSTRIES = [...new Set(APIS.flatMap((a) => a.industries))].sort();
const CAPABILITY_ORDER = ['Document Management', '3D Visualization'];
const CAPABILITIES = [
  ...CAPABILITY_ORDER.filter((c) => APIS.some((a) => a.capabilities.includes(c))),
  ...[...new Set(APIS.flatMap((a) => a.capabilities))].filter((c) => !CAPABILITY_ORDER.includes(c)).sort(),
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [pricing, setPricing] = useState<Pricing>('all');
  const [industries, setIndustries] = useState<Set<string>>(new Set());
  const [capabilities, setCapabilities] = useState<Set<string>>(new Set());

  const toggleSet = (set: Set<string>, value: string): Set<string> => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const hasFilters =
    pricing !== 'all' || industries.size > 0 || capabilities.size > 0 || search.trim() !== '';

  const clearFilters = () => {
    setSearch('');
    setPricing('all');
    setIndustries(new Set());
    setCapabilities(new Set());
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return APIS.filter((api) => {
      if (pricing !== 'all' && api.pricing !== pricing) return false;
      if (industries.size > 0 && !api.industries.some((i) => industries.has(i))) return false;
      if (capabilities.size > 0 && !api.capabilities.some((c) => capabilities.has(c))) return false;
      if (q && !api.name.toLowerCase().includes(q) && !api.description.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [search, pricing, industries, capabilities]);

  return (
    <Layout title="APIs" description="Autodesk Platform Services – API catalog">
      <div className="aps-catalog">
        {/* ── Sidebar ───────────────────────────── */}
        <aside className="aps-sidebar">
          {/* Search */}
          <div className="aps-search-wrap">
            <svg className="aps-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className="aps-search"
              type="search"
              placeholder="Search APIs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search APIs"
            />
          </div>

          {/* Clear */}
          {hasFilters && (
            <button type="button" className="aps-clear-btn" onClick={clearFilters}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Clear filters
            </button>
          )}

          {/* Pricing */}
          <div className="aps-filter-section">
            <p className="aps-filter-label">Pricing</p>
            <div className="aps-pills">
              {(['all', 'free', 'monetized'] as Pricing[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={pricing === p ? 'aps-pill aps-pill--active' : 'aps-pill'}
                  onClick={() => setPricing(p)}
                >
                  {p === 'all' ? 'All' : p === 'free' ? 'Free' : (
                    <span className="aps-pill-dollar-wrap">
                      Monetized <span className="aps-dollar" title="Usage costs may apply">$</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <hr className="aps-divider" />

          {/* Industry */}
          <div className="aps-filter-section">
            <p className="aps-filter-label">Industry</p>
            <div className="aps-pills">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  className={industries.has(ind) ? 'aps-pill aps-pill--active' : 'aps-pill'}
                  onClick={() => setIndustries(toggleSet(industries, ind))}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <hr className="aps-divider" />

          {/* Capability */}
          <div className="aps-filter-section">
            <p className="aps-filter-label">Capability</p>
            <div className="aps-pills">
              {CAPABILITIES.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  className={capabilities.has(cap) ? 'aps-pill aps-pill--active' : 'aps-pill'}
                  onClick={() => setCapabilities(toggleSet(capabilities, cap))}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main content ──────────────────────── */}
        <main className="aps-main">
          <header className="aps-page-header">
            <h1 className="aps-page-title">APIs</h1>
            <p className="aps-page-desc">
              Access API documentation, SDKs, and developer tools to build powerful
              integrations with Autodesk products.
            </p>
          </header>

          {filtered.length === 0 ? (
            <div className="aps-empty">
              <p>No APIs match your filters.</p>
              <button type="button" className="aps-clear-btn" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="aps-result-count">
                Showing {filtered.length} {filtered.length === 1 ? 'API' : 'APIs'}
                {hasFilters && <button type="button" className="aps-result-clear" onClick={clearFilters}>Clear filters</button>}
              </p>
              <div className="aps-grid">
                {filtered.map((api) => {
                  const cardContent = (
                    <>
                      <div className="aps-card-top">
                        <span className="aps-card-icon" aria-hidden="true">{api.icon}</span>
                        <div className="aps-card-badges">
                          {api.isBeta && <span className="aps-badge aps-badge--beta">Beta</span>}
                          {!api.href && <span className="aps-badge aps-badge--soon">Coming soon</span>}
                          {api.pricing === 'monetized' && (
                            <span className="aps-badge aps-badge--dollar" title="Usage costs may apply">$</span>
                          )}
                        </div>
                      </div>
                      <h2 className="aps-card-title">{api.name}</h2>
                      <p className="aps-card-desc">{api.description}</p>
                      <div className="aps-card-footer">
                        <div className="aps-card-tags">
                          {api.capabilities.map((c) => (
                            <span key={c} className="aps-card-tag">{c}</span>
                          ))}
                        </div>
                        {api.href && (
                          <span className="aps-card-cta">
                            Explore
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </>
                  );
                  return api.href ? (
                    <Link key={api.id} to={api.href} className="aps-card">
                      {cardContent}
                    </Link>
                  ) : (
                    <div key={api.id} className="aps-card aps-card--disabled">
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}
