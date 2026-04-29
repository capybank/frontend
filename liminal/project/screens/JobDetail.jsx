// Job detail + escrow flow screens

const JobDetail = ({ job, role, onApply, onReviewApplicants, onOpenAgreement }) => {
  const I = window.Icons;
  return (
    <div className="page">
      <button className="btn btn--ghost btn--sm mb-16" onClick={() => window.history.back()}>
        <I.ArrowLeft size={14} /> Back to marketplace
      </button>
      <div className="row">
        <div className="flex-1 col" style={{ gap: 24 }}>
          <div className="card card--lg-pad">
            <div className="h-stack" style={{ marginBottom: 12 }}>
              <span className="pill pill--ink">{job.category}</span>
              <span className="pill pill--green"><I.Shield size={11} /> Escrow protected</span>
              <span className="pill"><I.Clock size={11} /> {job.duration}-day delivery</span>
            </div>
            <h1 style={{ fontSize: 28, margin: '0 0 12px', letterSpacing: '-0.02em', fontWeight: 700 }}>{job.title}</h1>
            <div className="h-stack text-sm text-muted mb-16">
              Posted by <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text)', fontWeight: 600 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, background: 'linear-gradient(135deg,var(--green-300),var(--ink-500))', color: 'white', fontSize: 10, fontWeight: 600, display: 'grid', placeItems: 'center' }}>{job.client.initials}</span>
                {job.client.name}
              </span>
              · {job.client.studio} · <I.Star size={12} style={{ color: '#f5a623', fill: '#f5a623' }} /> {job.client.rating} · {job.client.jobs} jobs posted
            </div>

            {/* Cover placeholder */}
            <div style={{ aspectRatio: '16/7', borderRadius: 12, background: 'linear-gradient(135deg, #5b6cff, #2b3990)', position: 'relative', overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg,transparent 0 14px,rgba(255,255,255,0.05) 14px 28px)' }}></div>
              <div style={{ position: 'absolute', left: 16, bottom: 16, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-mono)', fontSize: 12, background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 4 }}>storyboard_v2.pdf · 18 frames</div>
            </div>

            <h3 className="card-title">Project description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{job.description}</p>

            <div className="grid-3 mt-24">
              <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12 }}>
                <div className="text-xs text-muted">Scenes</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{job.scenes}</div>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12 }}>
                <div className="text-xs text-muted">Per scene</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>${job.pricePerScene}</div>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12 }}>
                <div className="text-xs text-muted">Delivery</div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{job.duration}d</div>
              </div>
            </div>
          </div>

          {/* How escrow works */}
          <div className="card card--pad">
            <div className="h-stack mb-16">
              <I.Shield size={20} />
              <h3 className="card-title" style={{ margin: 0 }}>How payment works on this job</h3>
            </div>
            <div className="escrow-timeline">
              {[
                { label: 'Agreement signed', sub: 'Both parties' },
                { label: 'Escrow funded', sub: '$500 USDC' },
                { label: 'Work in progress', sub: `${job.creator.deliveryDays} days` },
                { label: 'Work delivered', sub: 'Client review' },
                { label: 'Payout released', sub: 'To creator' },
              ].map((s, i) => (
                <div key={i} className="escrow-step">
                  <div className="escrow-step__bar"></div>
                  <div className="escrow-step__dot">{i + 1}</div>
                  <div className="escrow-step__label">{s.label}</div>
                  <div className="escrow-step__date">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="receipt mt-16">
              <div className="receipt__row"><span className="label">Smart contract</span><span className="val val--success">{job.contractAddress}</span></div>
              <div className="receipt__row"><span className="label">Network</span><span className="val">{job.network}</span></div>
              <div className="receipt__row"><span className="label">Auto-release</span><span className="val">14 days after marked complete</span></div>
            </div>
          </div>
        </div>

        <div style={{ width: 360 }} className="col">
          {/* Pricing card */}
          <div className="card card--lg-pad" style={{ position: 'sticky', top: 92 }}>
            <div className="text-xs text-muted">Total budget</div>
            <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              ${job.total}.<span style={{ fontSize: 20, color: 'var(--text-muted)' }}>00</span>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginLeft: 6 }}>USDC</span>
            </div>
            <div className="text-xs text-muted mt-8" style={{ marginBottom: 16 }}>{job.scenes} scenes × ${job.pricePerScene}/scene</div>

            <div className="divider"></div>
            <div className="col" style={{ gap: 8, fontSize: 13 }}>
              <div className="between"><span className="text-muted">Delivery</span><span style={{ fontWeight: 600 }}>{job.duration} days</span></div>
              <div className="between"><span className="text-muted">Revisions</span><span style={{ fontWeight: 600 }}>2 included</span></div>
              <div className="between"><span className="text-muted">Auto-release</span><span style={{ fontWeight: 600 }}>14 days</span></div>
              <div className="between"><span className="text-muted">Platform fee</span><span style={{ fontWeight: 600 }}>5% (creator side)</span></div>
            </div>
            <div className="divider"></div>

            {role === 'creator' ? (
              <>
                <button className="btn btn--primary btn--block btn--lg" onClick={onApply}>
                  <I.Send size={16} /> Apply for this job
                </button>
                <p className="text-xs text-muted mt-8" style={{ textAlign: 'center', margin: '8px 0 0' }}>
                  Funds are escrowed by the client before you start work
                </p>
              </>
            ) : (
              <>
                <button className="btn btn--primary btn--block btn--lg" onClick={onReviewApplicants}>
                  Review {job.applicants.length} applicants <I.ArrowRight size={16} />
                </button>
                <button className="btn btn--secondary btn--block mt-8" onClick={onOpenAgreement}>
                  <I.Document size={16} /> Skip to agreement
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Applicants list (client view) ───
const ApplicantsScreen = ({ job, onSelect, onBack }) => {
  const I = window.Icons;
  return (
    <div className="page">
      <button className="btn btn--ghost btn--sm mb-16" onClick={onBack}><I.ArrowLeft size={14} /> Back</button>
      <h1 className="page-title">Review applicants</h1>
      <p className="page-subtitle">{job.applicants.length} creators applied for "{job.title}"</p>

      <div className="col" style={{ gap: 16 }}>
        {job.applicants.map((a, i) => (
          <div className="card card--pad" key={i} style={a.selected ? { borderColor: 'var(--green-500)', boxShadow: '0 0 0 3px var(--green-50)' } : {}}>
            <div className="row">
              <div style={{ width: 56, height: 56, borderRadius: 999, background: 'linear-gradient(135deg,var(--green-300),var(--ink-500))', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 18, flexShrink: 0 }}>{a.initials}</div>
              <div className="flex-1">
                <div className="between">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{a.name}</div>
                    <div className="h-stack text-sm text-muted">
                      <I.Star size={12} style={{ color: '#f5a623', fill: '#f5a623' }} /> {a.rating} ({a.reviews} reviews) · <span className="pill pill--green" style={{ padding: '2px 8px' }}>{a.level}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>${a.price}</div>
                    <div className="text-xs text-muted">in {a.deliveryDays} days</div>
                  </div>
                </div>
                <p className="text-sm mt-8" style={{ color: 'var(--text-secondary)', margin: '12px 0 0' }}>{a.message}</p>
                <div className="h-stack mt-16">
                  <button className="btn btn--primary btn--sm" onClick={() => onSelect(a)}>
                    {a.selected ? 'Continue with this creator' : 'Select & start agreement'}
                  </button>
                  <button className="btn btn--ghost btn--sm"><I.Chat size={14} /> Message</button>
                  <button className="btn btn--ghost btn--sm"><I.Document size={14} /> View portfolio</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.JobDetail = JobDetail;
window.ApplicantsScreen = ApplicantsScreen;
