import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

type ApiKind = 'all' | 'free' | 'monetized';

type ApiTile = {
  id: string;
  name: string;
  description: string;
  category: ApiKind;
  href: string;
};

const apis: ApiTile[] = [
  {
    id: 'design-docs',
    name: 'Design Docs',
    description: 'Core documentation system for product and API guides.',
    category: 'monetized',
    href: 'docs/',
  },
  {
    id: 'viewer',
    name: 'Viewer API',
    description: 'Embed and interact with 3D models directly in your apps.',
    category: 'monetized',
    href: '#', // Placeholder for future docs.
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Receive callbacks when important events occur in your account.',
    category: 'free',
    href: '#',
  },
  {
    id: 'metrics',
    name: 'Metrics & Analytics',
    description: 'Access usage metrics to understand how your integrations perform.',
    category: 'free',
    href: '#',
  },
];

export default function Home(): JSX.Element {
  const [filter, setFilter] = useState<ApiKind>('all');

  const filteredApis = useMemo(
    () =>
      apis.filter((api) =>
        filter === 'all' ? true : api.category === filter,
      ),
    [filter],
  );

  return (
    <Layout title="APIs" description="Landing page for Autodesk APIs">
      <main className="landing-root">
        <aside className="landing-filter">
          <h1 className="landing-title">APIs</h1>
          <p className="landing-subtitle">
            Choose an API to explore documentation, guides, and references.
          </p>
          <div className="landing-filter-group">
            <span className="landing-filter-label">Filter</span>
            <button
              type="button"
              className={
                filter === 'all'
                  ? 'landing-filter-pill landing-filter-pill--active'
                  : 'landing-filter-pill'
              }
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={
                filter === 'free'
                  ? 'landing-filter-pill landing-filter-pill--active'
                  : 'landing-filter-pill'
              }
              onClick={() => setFilter('free')}
            >
              Free
            </button>
            <button
              type="button"
              className={
                filter === 'monetized'
                  ? 'landing-filter-pill landing-filter-pill--active'
                  : 'landing-filter-pill'
              }
              onClick={() => setFilter('monetized')}
            >
              Monetized
            </button>
          </div>
          <p className="landing-hint">
            APIs with a <span className="landing-price-badge">$</span> badge may have
            associated costs.
          </p>
        </aside>

        <section className="landing-tiles">
          {filteredApis.map((api) => (
            <Link
              key={api.id}
              to={api.href}
              className="api-tile"
            >
              <div className="api-tile-header">
                <h2 className="api-tile-title">{api.name}</h2>
                {api.category === 'monetized' && (
                  <span
                    className="api-tile-badge"
                    title="This API may have associated costs."
                  >
                    $
                  </span>
                )}
              </div>
              <p className="api-tile-description">{api.description}</p>
              <span className="api-tile-cta">View docs →</span>
            </Link>
          ))}
        </section>
      </main>
    </Layout>
  );
}


