// Main app shell — orchestrates all screens, modals, and tweaks

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "role": "client",
  "theme": "green",
  "density": "cozy",
  "escrowState": "in_progress",
  "escrowVisibility": "hero"
}/*EDITMODE-END*/;

const App = () => {
  const I = window.Icons;
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const { role, theme, density, escrowState, escrowVisibility } = tweaks;

  const [screen, setScreen] = useState({ name: 'wallet', params: {} });
  const [stack, setStack] = useState([]);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const user = role === 'client' ? window.AppData.MOCK_USER_CLIENT : window.AppData.MOCK_USER_CREATOR;
  const job = window.AppData.ACTIVE_JOB;

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'green' ? '' : theme);
  }, [theme]);

  const navigate = (name, params = {}) => {
    setStack(s => [...s, screen]);
    setScreen({ name, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const back = () => {
    setStack(s => {
      if (s.length === 0) { setScreen({ name: 'wallet' }); return s; }
      const prev = s[s.length - 1];
      setScreen(prev);
      return s.slice(0, -1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (title, sub) => {
    const t = { id: Date.now(), title, sub };
    setToast(t);
    setTimeout(() => setToast(curr => curr?.id === t.id ? null : curr), 3500);
  };

  // Top nav
  const navItems = [
    { id: 'wallet', label: 'Wallet', icon: 'Wallet' },
    { id: 'marketplace', label: 'Marketplace', icon: 'Briefcase' },
    { id: 'escrows', label: 'Escrows', icon: 'Shield' },
    { id: 'activity', label: 'Activity', icon: 'Clock' },
  ];

  return (
    <div className={`app density-${density} esc-${escrowVisibility}`}>
      {/* Top nav */}
      <header className="topnav">
        <button className="topnav__logo" onClick={() => { setStack([]); setScreen({ name: 'wallet' }); }}>
          <img src="assets/social-seed-logo.png" alt="Social Seed" />
          <span>Social Seed</span>
        </button>
        <nav className="topnav__nav">
          {navItems.map(n => {
            const Ic = I[n.icon];
            const active = screen.name === n.id || (n.id === 'wallet' && ['contract'].includes(screen.name));
            return (
              <button key={n.id}
                className={`topnav__link ${active ? 'topnav__link--active' : ''}`}
                onClick={() => { setStack([]); setScreen({ name: n.id }); }}>
                <Ic size={16} />{n.label}
              </button>
            );
          })}
        </nav>
        <div className="topnav__right">
          <button className="topnav__icon-btn"><I.Search size={18} /></button>
          <button className="topnav__icon-btn"><I.Bell size={18} /><span className="dot"></span></button>
          <div className="topnav__avatar" title={user.name}>{user.initials}</div>
        </div>
      </header>

      {/* Screens */}
      {screen.name === 'wallet' && (
        <window.Wallet
          user={user}
          role={role}
          escrowState={escrowState}
          onNav={(n) => setScreen({ name: n })}
          onOpenTxn={(t) => setModal({ kind: 'txn', txn: t })}
          onSend={() => setModal({ kind: 'send' })}
          onAddFunds={() => setModal({ kind: 'add' })}
          onWithdraw={() => setModal({ kind: 'withdraw' })}
          onOpenEscrow={(e) => navigate('contract', { escrowId: e.id })}
        />
      )}

      {screen.name === 'marketplace' && (
        <window.Marketplace
          density={density}
          onOpenGig={() => navigate('job')}
        />
      )}

      {screen.name === 'job' && (
        <window.JobDetail
          job={job}
          role={role}
          onApply={() => setModal({ kind: 'apply' })}
          onReviewApplicants={() => navigate('applicants')}
          onOpenAgreement={() => navigate('agreement')}
        />
      )}

      {screen.name === 'applicants' && (
        <window.ApplicantsScreen
          job={job}
          onSelect={() => navigate('agreement')}
          onBack={back}
        />
      )}

      {screen.name === 'agreement' && (
        <window.AgreementScreen
          job={job}
          role={role}
          onContinue={() => navigate('fund')}
          onBack={back}
        />
      )}

      {screen.name === 'fund' && (
        <window.FundEscrowScreen
          job={job}
          user={user}
          onConfirm={() => {
            setTweak('escrowState', 'in_progress');
            setStack([]);
            setScreen({ name: 'contract' });
            showToast('Escrow funded', `$${job.total} USDC locked in smart contract`);
          }}
          onBack={back}
        />
      )}

      {screen.name === 'contract' && (
        <window.ContractScreen
          job={job}
          role={role}
          escrowState={escrowState}
          onMarkComplete={() => {
            setTweak('escrowState', 'review');
            showToast('Work submitted for review', 'Client has been notified');
          }}
          onApprove={() => {
            setTweak('escrowState', 'completed');
            showToast(`$${job.total} released to ${job.creator.name}`, 'Funds settled to creator wallet');
          }}
          onDispute={() => {
            setTweak('escrowState', 'disputed');
            showToast('Dispute opened', 'A mediator has been assigned');
          }}
          onBack={back}
        />
      )}

      {screen.name === 'escrows' && (
        <EscrowList
          onOpen={() => navigate('contract')}
        />
      )}

      {screen.name === 'activity' && <ActivityList onOpenTxn={(t) => setModal({ kind: 'txn', txn: t })} />}

      {screen.name === 'request' && <SimpleStub title="Request money" desc="Generate a payment link or send a request to another wallet." />}

      {/* Modals */}
      {modal?.kind === 'send' && <window.SendMoneyModal user={user} onClose={() => setModal(null)} onSent={(amt, to) => showToast(`Sent $${amt} to ${to}`, 'Settled on Base · USDC')} />}
      {modal?.kind === 'add' && <window.AddFundsModal onClose={() => setModal(null)} onAdded={(amt) => showToast(`$${amt} added`, 'Available shortly')} />}
      {modal?.kind === 'withdraw' && <window.WithdrawModal user={user} onClose={() => setModal(null)} onWithdrawn={(amt) => showToast(`$${amt} withdrawing`, 'ANZ ••••5512 · 1–2 business days')} />}
      {modal?.kind === 'txn' && <window.TxnDetailModal txn={modal.txn} onClose={() => setModal(null)} />}
      {modal?.kind === 'apply' && <window.ApplyModal job={job} onClose={() => setModal(null)} onApplied={() => showToast('Application submitted', 'Client will review and respond')} />}

      {toast && <window.Toast toast={toast} />}

      {/* Footer */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__tagline">
            <img src="assets/social-seed-logo.png" alt="" style={{ width: 22, height: 22 }} />
            <span>Social Seed Payments | Powered by <span className="capy-badge">CapyPay</span></span>
          </div>
          <div className="footer__powered">
            <span>Wallet by <b>DFNS</b></span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Stablecoin by <b>Solstice</b></span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Built on <b>Base</b></span>
          </div>
        </div>
      </footer>

      {/* Tweaks panel */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Role" />
        <window.TweakRadio
          label="View as"
          value={role}
          onChange={(v) => setTweak('role', v)}
          options={['client', 'creator']}
        />
        <window.TweakSection label="Theme" />
        <window.TweakRadio
          label="Palette"
          value={theme}
          onChange={(v) => setTweak('theme', v)}
          options={['green', 'blue', 'dark']}
        />
        <window.TweakSection label="Marketplace" />
        <window.TweakRadio
          label="Density"
          value={density}
          onChange={(v) => setTweak('density', v)}
          options={['cozy', 'compact']}
        />
        <window.TweakSection label="Escrow demo" />
        <window.TweakSelect
          label="Escrow state"
          value={escrowState}
          onChange={(v) => setTweak('escrowState', v)}
          options={[
            { value: 'funded', label: 'Funded' },
            { value: 'in_progress', label: 'In progress' },
            { value: 'review', label: 'Pending review' },
            { value: 'completed', label: 'Completed' },
            { value: 'disputed', label: 'Disputed' },
          ]}
        />
        <window.TweakButton label="Jump to active contract →" onClick={() => { setStack([]); setScreen({ name: 'contract' }); }} />
        <window.TweakSection label="Escrow visibility" />
        <window.TweakRadio
          label="Style"
          value={escrowVisibility}
          onChange={(v) => setTweak('escrowVisibility', v)}
          options={['hero', 'badge', 'subtle']}
        />
      </window.TweaksPanel>
    </div>
  );
};

// ─── Sub-screens (light) ───
const EscrowList = ({ onOpen }) => {
  const I = window.Icons;
  const { ACTIVE_ESCROWS } = window.AppData;
  return (
    <div className="page">
      <h1 className="page-title">Active escrows</h1>
      <p className="page-subtitle">All your in-flight smart-contract escrows in one place.</p>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="tlist__row tlist__row--head">
          <span>Job</span>
          <span>Counterparty</span>
          <span>Contract</span>
          <span>Status</span>
          <span style={{ textAlign: 'right' }}>Amount</span>
        </div>
        {ACTIVE_ESCROWS.map(e => {
          const states = {
            funded: { cls: 'pill--blue', label: 'Funded' },
            in_progress: { cls: 'pill--green pill--pulse', label: 'In progress' },
            review: { cls: 'pill--warn', label: 'Review' },
          };
          const s = states[e.status];
          return (
            <div key={e.id} className="tlist__row" onClick={() => onOpen(e)}>
              <div>
                <div style={{ fontWeight: 600 }}>{e.title}</div>
                <div className="text-xs text-muted">{e.percent}% · {e.daysLeft}d left</div>
              </div>
              <div className="h-stack">
                <span style={{ width: 24, height: 24, borderRadius: 999, background: 'linear-gradient(135deg,var(--green-300),var(--ink-500))', color: 'white', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>{e.counterpartyInitials}</span>
                {e.counterparty}
              </div>
              <span className="text-mono text-sm" style={{ color: 'var(--text-muted)' }}>{e.contract}</span>
              <span className={`pill ${s.cls}`}><span className="dot"></span>{s.label}</span>
              <span style={{ textAlign: 'right', fontWeight: 600, fontVariant: 'tabular-nums' }}>${e.amount.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ActivityList = ({ onOpenTxn }) => {
  const I = window.Icons;
  const { TRANSACTIONS } = window.AppData;
  return (
    <div className="page">
      <h1 className="page-title">Activity</h1>
      <p className="page-subtitle">Every wallet event, on-chain and off.</p>
      <div className="card card--pad">
        {TRANSACTIONS.map(t => (
          <div className="txn" key={t.id} onClick={() => onOpenTxn(t)}>
            <div className={`txn__icon ${t.kind === 'in' ? 'txn__icon--in' : t.kind === 'escrow' ? 'txn__icon--escrow' : 'txn__icon--out'}`}>
              {t.kind === 'in' ? <I.ArrowDown size={18} /> : t.kind === 'escrow' ? <I.Shield size={18} /> : <I.ArrowUp size={18} />}
            </div>
            <div className="txn__main">
              <div className="txn__title">{t.title}</div>
              <div className="txn__sub">{t.sub}{t.txHash !== '—' && <><span>·</span><span className="text-mono">{t.txHash}</span></>}</div>
            </div>
            <div className={`txn__amount ${t.kind === 'in' ? 'txn__amount--in' : ''}`}>
              {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleStub = ({ title, desc }) => (
  <div className="page">
    <h1 className="page-title">{title}</h1>
    <p className="page-subtitle">{desc}</p>
    <div className="card card--lg-pad" style={{ textAlign: 'center', padding: 64 }}>
      <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
        <window.Icons.Sparkles size={22} />
      </div>
      <p className="text-muted">Placeholder — wire up next iteration.</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
