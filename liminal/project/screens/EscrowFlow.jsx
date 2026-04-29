// Escrow flow: Agreement → Fund → In-Progress → Complete → Release → Dispute

const AgreementScreen = ({ job, role, onContinue, onBack }) => {
  const I = window.Icons;
  const [agreed, setAgreed] = React.useState(false);
  const selected = job.applicants.find(a => a.selected) || job.applicants[0];

  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <button className="btn btn--ghost btn--sm mb-16" onClick={onBack}><I.ArrowLeft size={14} /> Back</button>
      <h1 className="page-title">Agreement & escrow terms</h1>
      <p className="page-subtitle">Review the contract. Both parties must sign before escrow is funded.</p>

      <div className="card card--lg-pad">
        <div className="between mb-24">
          <div>
            <div className="text-xs text-muted">Agreement #</div>
            <div className="text-mono" style={{ fontSize: 14, fontWeight: 600 }}>SS-{job.id.toUpperCase()}</div>
          </div>
          <span className="pill pill--warn"><span className="dot"></span>Awaiting signatures</span>
        </div>

        <div className="grid-2 mb-24">
          <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12 }}>
            <div className="text-xs text-muted mb-8">Client</div>
            <div className="h-stack">
              <div style={{ width: 36, height: 36, borderRadius: 999, background: 'linear-gradient(135deg,var(--green-300),var(--ink-500))', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 600 }}>{job.client.initials}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{job.client.name}</div>
                <div className="text-xs text-muted text-mono">0x7Aa3...e91F</div>
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12 }}>
            <div className="text-xs text-muted mb-8">Creator</div>
            <div className="h-stack">
              <div style={{ width: 36, height: 36, borderRadius: 999, background: 'linear-gradient(135deg,var(--green-300),var(--ink-500))', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 600 }}>{selected.initials}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{selected.name}</div>
                <div className="text-xs text-muted text-mono">0x3F2c...b84A</div>
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>Scope of work</h3>
        <ul style={{ margin: '0 0 24px', paddingLeft: 20, color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>
          <li>Deliver {job.scenes} fully animated cinematic scenes per the storyboard</li>
          <li>Camera work, character rigs, and final 1080p renders</li>
          <li>Roblox Studio file (.rbxl) + source assets</li>
          <li>Up to 2 rounds of revisions included</li>
        </ul>

        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>Payment terms</h3>
        <div className="receipt mb-24">
          <div className="receipt__row"><span className="label">Total</span><span className="val">${job.total}.00 USDC</span></div>
          <div className="receipt__row"><span className="label">Held by</span><span className="val val--success">Smart contract {job.contractAddress}</span></div>
          <div className="receipt__row"><span className="label">Network</span><span className="val">{job.network}</span></div>
          <div className="receipt__row"><span className="label">Delivery deadline</span><span className="val">{selected.deliveryDays} days from funding</span></div>
          <div className="receipt__row"><span className="label">Auto-release window</span><span className="val">14 days after marked complete</span></div>
          <div className="receipt__row"><span className="label">Dispute period</span><span className="val">7 days after delivery</span></div>
        </div>

        <label className="h-stack" style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            I agree to the terms above. I understand funds will be locked in the smart contract until work is approved or auto-released.
          </span>
        </label>

        <div className="h-stack mt-24" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn--secondary" onClick={onBack}>Save draft</button>
          <button className="btn btn--primary btn--lg" disabled={!agreed} style={{ opacity: agreed ? 1 : 0.5 }} onClick={onContinue}>
            Sign & continue to fund <I.ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Fund escrow ───
const FundEscrowScreen = ({ job, user, onConfirm, onBack }) => {
  const I = window.Icons;
  const [confirming, setConfirming] = React.useState(false);
  const fee = job.total * 0.005;
  const total = job.total + fee;

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => onConfirm(), 1800);
  };

  return (
    <div className="page" style={{ maxWidth: 560 }}>
      <button className="btn btn--ghost btn--sm mb-16" onClick={onBack}><I.ArrowLeft size={14} /> Back</button>
      <h1 className="page-title">Fund escrow</h1>
      <p className="page-subtitle">Funds are held in a smart contract and only released to the creator when work is approved.</p>

      <div className="card card--lg-pad">
        <div style={{ background: 'var(--surface-2)', padding: 24, borderRadius: 12, textAlign: 'center', marginBottom: 24 }}>
          <div className="text-xs text-muted">You will deposit</div>
          <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>
            ${job.total}.<span style={{ fontSize: 24, color: 'var(--text-muted)' }}>00</span>
          </div>
          <div className="h-stack" style={{ justifyContent: 'center', marginTop: 8 }}>
            <span className="pill pill--green text-mono">USDC · Base</span>
          </div>
        </div>

        <div className="col" style={{ gap: 12, fontSize: 14 }}>
          <div className="between"><span className="text-muted">From wallet</span><span className="text-mono">{user.walletAddress}</span></div>
          <div className="between"><span className="text-muted">To smart contract</span><span className="text-mono" style={{ color: 'var(--green-700)' }}>{job.contractAddress}</span></div>
          <div className="between"><span className="text-muted">Job amount</span><span style={{ fontVariant: 'tabular-nums' }}>${job.total.toFixed(2)}</span></div>
          <div className="between"><span className="text-muted">Network fee (gas)</span><span style={{ fontVariant: 'tabular-nums' }}>${fee.toFixed(2)}</span></div>
          <div className="divider"></div>
          <div className="between"><span style={{ fontWeight: 600 }}>Total</span><span style={{ fontWeight: 700, fontSize: 18, fontVariant: 'tabular-nums' }}>${total.toFixed(2)}</span></div>
        </div>

        <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 12, padding: 14, marginTop: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <I.Shield size={18} style={{ color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }} />
          <div className="text-sm" style={{ color: 'var(--green-700)' }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>Your money is safe</div>
            If the work isn't delivered or you reject it, funds return to you. Auto-release in 14 days after delivery.
          </div>
        </div>

        <button className="btn btn--primary btn--block btn--lg mt-24" onClick={handleConfirm} disabled={confirming}>
          {confirming ? <><span className="spinner"></span> Confirming on-chain…</> : <><I.Lock size={16} /> Confirm & fund escrow</>}
        </button>
        <p className="text-xs text-muted mt-8" style={{ textAlign: 'center' }}>
          Signed by your DFNS-secured wallet · No seed phrase needed
        </p>
      </div>
      <style>{`
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 999px; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ─── In-progress / contract status (the hero state of the demo) ───
const ContractScreen = ({ job, role, escrowState, onMarkComplete, onApprove, onDispute, onBack }) => {
  const I = window.Icons;
  const states = {
    funded: { step: 1, label: 'Escrow funded', pill: 'pill--blue', desc: 'Waiting for creator to begin work' },
    in_progress: { step: 2, label: 'In progress', pill: 'pill--green pill--pulse', desc: 'Creator is working on the deliverables' },
    review: { step: 3, label: 'Pending review', pill: 'pill--warn', desc: 'Work delivered — client must approve or request changes' },
    completed: { step: 4, label: 'Completed', pill: 'pill--green', desc: 'Funds released to creator' },
    disputed: { step: 3, label: 'Disputed', pill: 'pill--danger', desc: 'Both parties in mediation' },
  };
  const s = states[escrowState] || states.in_progress;

  const steps = [
    { label: 'Agreement', date: 'Apr 22' },
    { label: 'Funded', date: 'Apr 22' },
    { label: 'In progress', date: 'Apr 22' },
    { label: 'Delivered', date: '— pending —' },
    { label: 'Released', date: '— pending —' },
  ];

  return (
    <div className="page">
      <button className="btn btn--ghost btn--sm mb-16" onClick={onBack}><I.ArrowLeft size={14} /> Back to wallet</button>

      <div className="row">
        <div className="flex-1 col" style={{ gap: 24 }}>
          {/* Status hero */}
          <div className="card card--lg-pad" style={{ background: escrowState === 'disputed' ? 'var(--danger-bg)' : escrowState === 'completed' ? 'var(--green-50)' : 'var(--surface)', borderColor: escrowState === 'disputed' ? 'var(--danger)' : escrowState === 'completed' ? 'var(--green-200)' : 'var(--border)' }}>
            <div className="between mb-16">
              <span className={`pill ${s.pill}`}><span className="dot"></span>{s.label}</span>
              <span className="text-xs text-muted text-mono">Contract: {job.contractAddress}</span>
            </div>
            <h1 style={{ fontSize: 24, margin: '0 0 4px', letterSpacing: '-0.01em', fontWeight: 700 }}>{job.title}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px' }}>{s.desc}</p>

            <div className="escrow-timeline">
              {steps.map((step, i) => (
                <div key={i} className={`escrow-step ${i < s.step ? 'escrow-step--done' : i === s.step ? 'escrow-step--current' : ''}`}>
                  <div className={`escrow-step__bar ${i < s.step ? 'escrow-step__bar--done' : ''}`}></div>
                  <div className="escrow-step__dot">{i < s.step ? <I.Check size={14} /> : i + 1}</div>
                  <div className="escrow-step__label">{step.label}</div>
                  <div className="escrow-step__date">{step.date}</div>
                </div>
              ))}
            </div>

            {/* Action area depending on role + state */}
            <div className="divider mt-24"></div>
            {escrowState === 'in_progress' && role === 'creator' && (
              <div className="h-stack mt-16">
                <button className="btn btn--primary btn--lg" onClick={onMarkComplete}>
                  <I.Upload size={16} /> Submit work for review
                </button>
                <button className="btn btn--secondary"><I.Chat size={14} /> Message client</button>
              </div>
            )}
            {escrowState === 'in_progress' && role === 'client' && (
              <div className="h-stack mt-16">
                <button className="btn btn--secondary"><I.Chat size={14} /> Message creator</button>
                <button className="btn btn--ghost btn--sm" style={{ color: 'var(--danger)' }} onClick={onDispute}><I.Flag size={14} /> Open dispute</button>
              </div>
            )}
            {escrowState === 'review' && role === 'client' && (
              <div className="h-stack mt-16">
                <button className="btn btn--primary btn--lg" onClick={onApprove}>
                  <I.CheckCircle size={16} /> Approve & release ${job.total}
                </button>
                <button className="btn btn--secondary"><I.Refresh size={14} /> Request revisions</button>
                <button className="btn btn--ghost btn--sm" style={{ color: 'var(--danger)' }} onClick={onDispute}><I.Flag size={14} /> Dispute</button>
              </div>
            )}
            {escrowState === 'completed' && (
              <div className="h-stack mt-16">
                <I.CheckCircle size={20} style={{ color: 'var(--green-600)' }} />
                <span style={{ fontWeight: 600, color: 'var(--green-700)' }}>Funds released to creator on Apr 29 · 09:14 UTC</span>
              </div>
            )}
            {escrowState === 'disputed' && (
              <div className="mt-16">
                <div className="h-stack" style={{ marginBottom: 12 }}>
                  <I.AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
                  <strong>Dispute opened — Apr 27, 11:02 UTC</strong>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  A Social Seed mediator has been assigned. Both parties have 72 hours to submit evidence. Funds remain locked in escrow.
                </p>
                <div className="h-stack mt-16">
                  <button className="btn btn--primary"><I.Upload size={14} /> Submit evidence</button>
                  <button className="btn btn--secondary">View dispute thread</button>
                </div>
              </div>
            )}
          </div>

          {/* Milestones / deliverables */}
          {escrowState !== 'completed' && (
            <div className="card card--pad">
              <h3 className="card-title">Deliverables</h3>
              <div className="col" style={{ gap: 8 }}>
                {[
                  { name: 'Storyboard approval', status: 'done' },
                  { name: 'Scenes 1–3 (rough)', status: escrowState === 'funded' ? 'todo' : 'done' },
                  { name: 'Scenes 4–7 (rough)', status: escrowState === 'review' || escrowState === 'disputed' ? 'done' : escrowState === 'funded' ? 'todo' : 'progress' },
                  { name: 'Final renders + .rbxl', status: escrowState === 'review' || escrowState === 'disputed' ? 'done' : 'todo' },
                ].map((m, i) => (
                  <div key={i} className="between" style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 10 }}>
                    <div className="h-stack">
                      <span style={{ width: 22, height: 22, borderRadius: 999, background: m.status === 'done' ? 'var(--green-500)' : m.status === 'progress' ? 'var(--info)' : 'var(--border-strong)', color: 'white', display: 'grid', placeItems: 'center' }}>
                        {m.status === 'done' && <I.Check size={12} />}
                        {m.status === 'progress' && <span style={{ width: 6, height: 6, background: 'white', borderRadius: 999 }}></span>}
                      </span>
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{m.name}</span>
                    </div>
                    <span className="text-xs text-muted">{m.status === 'done' ? 'Delivered' : m.status === 'progress' ? 'In progress' : 'Not started'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ width: 360 }} className="col">
          {/* On-chain receipt */}
          <div className="card card--pad">
            <h3 className="card-title">On-chain receipt</h3>
            <div className="receipt">
              <div className="receipt__row"><span className="label">Amount</span><span className="val val--success">${job.total}.00 USDC</span></div>
              <div className="receipt__row"><span className="label">Contract</span><span className="val text-mono">{job.contractAddress}</span></div>
              <div className="receipt__row"><span className="label">Tx hash</span><span className="val text-mono">{job.txHash}</span></div>
              <div className="receipt__row"><span className="label">Network</span><span className="val">{job.network}</span></div>
              <div className="receipt__row"><span className="label">Funded at</span><span className="val">{job.fundedAt}</span></div>
              <div className="receipt__row"><span className="label">Block</span><span className="val text-mono">14,289,331</span></div>
            </div>
            <button className="btn btn--secondary btn--block btn--sm mt-16">
              <I.ExternalLink size={14} /> View on BaseScan
            </button>
          </div>

          {/* Counterparty card */}
          <div className="card card--pad">
            <h3 className="card-title">{role === 'client' ? 'Working with' : 'Hired by'}</h3>
            <div className="h-stack">
              <div style={{ width: 48, height: 48, borderRadius: 999, background: 'linear-gradient(135deg,var(--green-300),var(--ink-500))', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 16 }}>
                {role === 'client' ? job.creator.initials : job.client.initials}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{role === 'client' ? job.creator.name : job.client.name}</div>
                <div className="text-xs text-muted">{role === 'client' ? job.creator.level : job.client.studio}</div>
              </div>
            </div>
            <div className="h-stack mt-16">
              <button className="btn btn--secondary btn--sm btn--block"><I.Chat size={14} /> Message</button>
              <button className="btn btn--secondary btn--sm btn--block"><I.Document size={14} /> Profile</button>
            </div>
          </div>

          {/* Time left */}
          {(escrowState === 'in_progress' || escrowState === 'funded') && (
            <div className="card card--pad" style={{ background: 'var(--surface-2)' }}>
              <div className="h-stack mb-8"><I.Clock size={16} /> <strong>Time remaining</strong></div>
              <div style={{ fontSize: 28, fontWeight: 700, fontVariant: 'tabular-nums', letterSpacing: '-0.01em' }}>5 days · 12h</div>
              <div className="text-xs text-muted">until delivery deadline · Apr 29, 14:32 UTC</div>
              <div style={{ marginTop: 12, height: 6, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: 'var(--green-500)' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.AgreementScreen = AgreementScreen;
window.FundEscrowScreen = FundEscrowScreen;
window.ContractScreen = ContractScreen;
