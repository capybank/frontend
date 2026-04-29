// Marketplace browse — Fiverr-style with Roblox creator categories

const Marketplace = ({ onOpenGig, density }) => {
  const I = window.Icons;
  const { CATEGORIES, GIGS } = window.AppData;
  const [activeCat, setActiveCat] = React.useState('all');
  const [query, setQuery] = React.useState('');

  const filtered = GIGS.filter(g =>
    (activeCat === 'all' || g.category === activeCat) &&
    (!query || g.title.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="page">
      {/* Hero */}
      <div className="marketplace-hero">
        <div className="pill" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', marginBottom: 16 }}>
          <I.Roblox size={12} /> Built for Roblox creators
        </div>
        <h1>Hire trusted Roblox talent.<br/>Pay safely with smart-contract escrow.</h1>
        <p>Animators, scripters, builders and UI designers — funds held until the work is delivered.</p>
        <div className="search-bar">
          <I.Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input placeholder='Try "intro cinematic" or "DataStore script"…' value={query} onChange={e => setQuery(e.target.value)} />
          <button className="btn btn--primary">Search</button>
        </div>
      </div>

      {/* Categories */}
      <div className="category-row mt-24">
        {CATEGORIES.map(c => {
          const Ic = I[c.icon] || I.Sparkles;
          return (
            <button key={c.id}
              className={`category-chip ${activeCat === c.id ? 'category-chip--active' : ''}`}
              onClick={() => setActiveCat(c.id)}>
              <Ic size={14} />{c.label}
            </button>
          );
        })}
      </div>

      {/* Results header */}
      <div className="between mb-16 mt-24">
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>
          {filtered.length} services {activeCat !== 'all' ? `in ${CATEGORIES.find(c => c.id === activeCat)?.label}` : 'available'}
        </h2>
        <div className="h-stack">
          <button className="btn btn--ghost btn--sm"><I.Filter size={14} /> Filters</button>
          <select className="field__select" style={{ width: 180, padding: '7px 12px' }} defaultValue="recommended">
            <option value="recommended">Recommended</option>
            <option>Best selling</option>
            <option>Newest arrivals</option>
            <option>Price: low to high</option>
          </select>
        </div>
      </div>

      {/* Trust banner */}
      <div className="card card--pad mb-24" style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--green-50)', borderColor: 'var(--green-200)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--green-500)', color: 'white', display: 'grid', placeItems: 'center' }}><I.Shield size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>Every job is protected by smart-contract escrow</div>
          <div className="text-sm" style={{ color: 'var(--green-700)' }}>Funds are held in USDC and only released when work is approved. Powered by DFNS · Built on Base.</div>
        </div>
        <button className="btn btn--secondary btn--sm">How it works <I.ArrowRight size={14} /></button>
      </div>

      {/* Gig grid */}
      <div className="grid-4">
        {filtered.map(g => (
          <div className="gig-card" key={g.id} onClick={() => onOpenGig(g)}>
            <div className={`gig-card__cover ${g.cov}`}>
              <div className="gig-card__cover-stripes"></div>
              <div className="gig-card__protected"><I.Shield size={11} /> Escrow protected</div>
              <button className="gig-card__heart" onClick={(e) => e.stopPropagation()}><I.Heart size={14} /></button>
              <div className="gig-card__cover-label">{g.coverLabel}</div>
            </div>
            <div className="gig-card__body">
              <div className="gig-card__seller">
                <div className="gig-card__seller-avatar">{g.seller.initials}</div>
                <span className="gig-card__seller-name">{g.seller.name}</span>
                <span className="gig-card__seller-level">{g.seller.level}</span>
              </div>
              <div className="gig-card__title">{g.title}</div>
              <div className="gig-card__meta">
                <I.Star size={14} style={{ color: '#f5a623', fill: '#f5a623' }} />
                <span className="gig-card__rating">{g.rating}</span>
                <span className="gig-card__reviews">({g.reviews})</span>
              </div>
              <div className="gig-card__price">
                <span className="from">From</span>
                <span>${g.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.Marketplace = Marketplace;
