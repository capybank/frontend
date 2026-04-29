// Wallet dashboard — PayPal-style
// Centerpiece screen: balance hero, quick actions, escrow widget, recent activity

const Wallet = ({ user, role, onNav, onOpenTxn, onSend, onAddFunds, onWithdraw, onOpenEscrow, escrowState }) => {
  const I = window.Icons;
  const { TRANSACTIONS, ACTIVE_ESCROWS } = window.AppData;
  const [hideBalance, setHideBalance] = React.useState(false);

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [int, dec] = fmt(user.balance).split('.');

  const escrowStatusPill = {
    funded: { cls: 'pill--blue', label: 'Funded' },
    in_progress: { cls: 'pill--green pill--pulse', label: 'In progress' },
    review: { cls: 'pill--warn', label: 'Pending review' },
    completed: { cls: 'pill--green', label: 'Completed' },
    disputed: { cls: 'pill--danger', label: 'Disputed' },
  };

  return (
    <div className="page">
      <div className="row" style={{ alignItems: 'flex-start' }}>
        {/* LEFT: Balance + quick actions + activity */}
        <div className="flex-1 col" style={{ gap: 24 }}>
          {/* Balance hero */}
          <div className="balance-card">
            <div className="balance-card__label">
              <I.Wallet size={14} /> Available balance
              <button onClick={() => setHideBalance(v => !v)}
                style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                {hideBalance ? <I.EyeOff size={14} /> : <I.Eye size={14} />}
                {hideBalance ? 'Show' : 'Hide'}
              </button>
            </div>
            <div className="balance-card__amount">
              <span className="currency">$</span>
              {hideBalance ? <span>••••</span> : <><span>{int}</span><span className="cents">.{dec}</span></>}
              <span style={{ fontSize: 14, opacity: 0.6, marginLeft: 8, fontWeight: 500, fontFamily: 'var(--font-mono)' }}>USDC</span>
            </div>
            <div className="balance-card__sub">
              <span className="balance-card__chain">
                <span style={{ width: 6, height: 6, background: '#4dc079', borderRadius: 999 }}></span>
                Base · {user.walletAddress}
              </span>
              <span style={{ opacity: 0.7 }}>DFNS-secured wallet</span>
            </div>
            <div className="balance-card__actions">
              <button className="balance-card__action balance-card__action--primary" onClick={onAddFunds}>
                <I.Plus size={16} /> Add funds
              </button>
              <button className="balance-card__action" onClick={onSend}>
                <I.Send size={16} /> Send
              </button>
              <button className="balance-card__action" onClick={() => onNav('request')}>
                <I.Request size={16} /> Request
              </button>
              <button className="balance-card__action" onClick={onWithdraw}>
                <I.Bank size={16} /> Withdraw
              </button>
            </div>
          </div>

          {/* Quick chips */}
          <div className="quick-chips">
            <button className="quick-chip" onClick={onAddFunds}>
              <div className="quick-chip__icon"><I.Card /></div>
              <div className="quick-chip__label">Add via card</div>
            </button>
            <button className="quick-chip" onClick={onAddFunds}>
              <div className="quick-chip__icon"><I.Bank /></div>
              <div className="quick-chip__label">Bank transfer</div>
            </button>
            <button className="quick-chip" onClick={onAddFunds}>
              <div className="quick-chip__icon"><I.Coin /></div>
              <div className="quick-chip__label">Crypto on-ramp</div>
            </button>
            <button className="quick-chip" onClick={() => onNav('escrows')}>
              <div className="quick-chip__icon"><I.Shield /></div>
              <div className="quick-chip__label">Active escrows</div>
            </button>
          </div>

          {/* Recent activity */}
          <div className="card card--pad">
            <div className="between mb-16">
              <h3 className="card-title" style={{ margin: 0 }}>Recent activity</h3>
              <button className="btn btn--ghost btn--sm">View all <I.ChevronRight size={14} /></button>
            </div>
            <div>
              {TRANSACTIONS.slice(0, 6).map(t => (
                <div className="txn" key={t.id} onClick={() => onOpenTxn(t)}>
                  <div className={`txn__icon ${t.kind === 'in' ? 'txn__icon--in' : t.kind === 'escrow' ? 'txn__icon--escrow' : 'txn__icon--out'}`}>
                    {t.kind === 'in' ? <I.ArrowDown size={18} /> : t.kind === 'escrow' ? <I.Shield size={18} /> : <I.ArrowUp size={18} />}
                  </div>
                  <div className="txn__main">
                    <div className="txn__title">{t.title}</div>
                    <div className="txn__sub">
                      {t.sub}
                      {t.txHash !== '—' && <><span>·</span><span className="text-mono">{t.txHash}</span></>}
                    </div>
                  </div>
                  <div className={`txn__amount ${t.kind === 'in' ? 'txn__amount--in' : ''}`}>
                    {t.amount > 0 ? '+' : ''}${fmt(Math.abs(t.amount))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar with escrow + breakdown */}
        <div style={{ width: 360 }} className="col">
          {/* Active escrow snapshot */}
          <div className="card card--pad">
            <div className="between mb-16">
              <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <I.Shield size={18} /> Active escrows
              </h3>
              <span className="pill pill--green">{ACTIVE_ESCROWS.length}</span>
            </div>

            {ACTIVE_ESCROWS.map(e => {
              const status = escrowStatusPill[e.status];
              return (
                <button key={e.id} onClick={() => onOpenEscrow(e)} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: 14, marginBottom: 10, cursor: 'pointer',
                }}>
                  <div className="between" style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3, flex: 1, paddingRight: 8 }}>{e.title}</span>
                    <span className={`pill ${status.cls}`}><span className="dot"></span>{status.label}</span>
                  </div>
                  <div className="between" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    <span className="h-stack">
                      <span style={{ width: 18, height: 18, borderRadius: 999, background: 'linear-gradient(135deg,var(--green-300),var(--ink-500))', color: 'white', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 600 }}>{e.counterpartyInitials}</span>
                      {e.counterparty}
                    </span>
                    <span style={{ fontVariant: 'tabular-nums', color: 'var(--text)', fontWeight: 600 }}>${fmt(e.amount)}</span>
                  </div>
                  <div style={{ marginTop: 10, height: 4, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: e.percent + '%', height: '100%', background: 'var(--green-500)' }}></div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{e.percent}% complete</span>
                    <span>{e.daysLeft}d left</span>
                  </div>
                </button>
              );
            })}
            <button className="btn btn--secondary btn--block btn--sm mt-8" onClick={() => onNav('escrows')}>View all escrows</button>
          </div>

          {/* Funds breakdown */}
          <div className="card card--pad">
            <h3 className="card-title">Funds breakdown</h3>
            <div className="col" style={{ gap: 12 }}>
              <div className="between">
                <span className="h-stack text-sm text-muted"><span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--green-500)' }}></span>Available</span>
                <span style={{ fontWeight: 600, fontVariant: 'tabular-nums' }}>${fmt(user.balance)}</span>
              </div>
              <div className="between">
                <span className="h-stack text-sm text-muted"><span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--info)' }}></span>In escrow</span>
                <span style={{ fontWeight: 600, fontVariant: 'tabular-nums' }}>${fmt(user.inEscrow)}</span>
              </div>
              <div className="between">
                <span className="h-stack text-sm text-muted"><span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--warn)' }}></span>Pending</span>
                <span style={{ fontWeight: 600, fontVariant: 'tabular-nums' }}>${fmt(user.pending)}</span>
              </div>
              <div className="divider"></div>
              <div className="between">
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 18, fontVariant: 'tabular-nums' }}>${fmt(user.balance + user.inEscrow + user.pending)}</span>
              </div>
            </div>
          </div>

          {/* DFNS security */}
          <div className="card card--pad" style={{ background: 'var(--surface-2)' }}>
            <div className="h-stack" style={{ marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--ink-800)', display: 'grid', placeItems: 'center', color: 'white' }}><I.Lock size={16} /></div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Secured by DFNS</div>
                <div className="text-xs text-muted">MPC · TEE · key-share recovery</div>
              </div>
            </div>
            <p className="text-xs text-muted" style={{ margin: 0 }}>
              Your wallet uses institutional-grade key management. No seed phrase, no single point of failure.
              {role === 'creator' ? ' Your earnings settle to USDC instantly.' : ' Your deposits are held only by smart contract.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

window.Wallet = Wallet;
