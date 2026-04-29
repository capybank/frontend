// Modals: Send, Add funds, Withdraw, Transaction detail, Apply, Toast

const SendMoneyModal = ({ user, onClose, onSent }) => {
  const I = window.Icons;
  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [step, setStep] = React.useState('compose');

  const handleSend = () => {
    setStep('confirming');
    setTimeout(() => { setStep('done'); setTimeout(() => { onSent(amount, recipient); onClose(); }, 1200); }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Send USDC</h3>
          <button className="topnav__icon-btn" onClick={onClose}><I.X size={18} /></button>
        </div>
        <div className="modal__body">
          {step === 'compose' && (
            <>
              <div className="field">
                <label className="field__label">To</label>
                <input className="field__input" placeholder="@username, email or 0x address" value={recipient} onChange={e => setRecipient(e.target.value)} />
                <span className="field__hint">Send instantly to anyone with a Social Seed wallet</span>
              </div>
              <div className="field">
                <label className="field__label">Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 22, fontWeight: 600, color: 'var(--text-muted)' }}>$</span>
                  <input className="field__input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 30, fontSize: 22, fontWeight: 600, height: 56 }} />
                </div>
                <span className="field__hint">Available: ${user.balance.toFixed(2)} USDC</span>
              </div>
              <div className="field">
                <label className="field__label">Note (optional)</label>
                <input className="field__input" placeholder="What's this for?" />
              </div>
            </>
          )}
          {step === 'confirming' && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--green-50)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', position: 'relative' }}>
                <div className="ring-spin" style={{ position: 'absolute', inset: -4, borderRadius: 999, border: '3px solid transparent', borderTopColor: 'var(--green-500)', animation: 'spin 0.9s linear infinite' }}></div>
                <I.Send size={22} style={{ color: 'var(--green-600)' }} />
              </div>
              <div style={{ fontWeight: 600 }}>Sending ${amount}…</div>
              <div className="text-sm text-muted mt-8">Signing with DFNS · broadcasting to Base</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--green-500)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'white' }}>
                <I.Check size={28} />
              </div>
              <div style={{ fontWeight: 600 }}>Sent ${amount} to {recipient || 'recipient'}</div>
              <div className="text-xs text-muted text-mono mt-8">tx: 0x91b4…f4</div>
            </div>
          )}
        </div>
        {step === 'compose' && (
          <div className="modal__footer">
            <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn--primary" disabled={!amount || !recipient} style={{ opacity: (!amount || !recipient) ? 0.5 : 1 }} onClick={handleSend}>
              Send ${amount || '0'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AddFundsModal = ({ onClose, onAdded }) => {
  const I = window.Icons;
  const [method, setMethod] = React.useState('card');
  const [amount, setAmount] = React.useState('500');

  const methods = [
    { id: 'card', icon: 'Card', label: 'Debit / credit card', sub: 'Instant · 2.9% + $0.30' },
    { id: 'bank', icon: 'Bank', label: 'Bank transfer (ACH)', sub: '1–2 business days · Free' },
    { id: 'crypto', icon: 'Coin', label: 'From crypto wallet', sub: 'USDC, USDT, ETH · Network fee only' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Add funds</h3>
          <button className="topnav__icon-btn" onClick={onClose}><I.X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="field">
            <label className="field__label">Amount (USDC)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 28, fontWeight: 600, color: 'var(--text-muted)' }}>$</span>
              <input className="field__input" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 36, fontSize: 28, fontWeight: 700, height: 72 }} />
            </div>
            <div className="h-stack mt-8">
              {[100, 250, 500, 1000].map(v => (
                <button key={v} className="btn btn--secondary btn--sm" onClick={() => setAmount(String(v))}>${v}</button>
              ))}
            </div>
          </div>

          <div className="field__label" style={{ marginTop: 16, marginBottom: 8 }}>Pay with</div>
          <div className="col" style={{ gap: 8 }}>
            {methods.map(m => {
              const Ic = I[m.icon];
              const active = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                    border: `2px solid ${active ? 'var(--green-500)' : 'var(--border)'}`,
                    background: active ? 'var(--green-50)' : 'var(--surface)',
                    borderRadius: 12, textAlign: 'left',
                  }}>
                  <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--ink-700)' }}><Ic size={18} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                    <div className="text-xs text-muted">{m.sub}</div>
                  </div>
                  <span style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${active ? 'var(--green-500)' : 'var(--border-strong)'}`, background: active ? 'var(--green-500)' : 'transparent', display: 'grid', placeItems: 'center' }}>
                    {active && <I.Check size={11} style={{ color: 'white' }} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => { onAdded(parseFloat(amount)); onClose(); }}>
            Add ${amount}
          </button>
        </div>
      </div>
    </div>
  );
};

const WithdrawModal = ({ user, onClose, onWithdrawn }) => {
  const I = window.Icons;
  const [amount, setAmount] = React.useState('');
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Withdraw to bank</h3>
          <button className="topnav__icon-btn" onClick={onClose}><I.X size={18} /></button>
        </div>
        <div className="modal__body">
          <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <I.Bank size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>ANZ Savings ••••5512</div>
              <div className="text-xs text-muted">Default · 1–2 business days</div>
            </div>
            <button className="btn btn--ghost btn--sm">Change</button>
          </div>
          <div className="field">
            <label className="field__label">Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 22, fontWeight: 600, color: 'var(--text-muted)' }}>$</span>
              <input className="field__input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 30, fontSize: 22, fontWeight: 600, height: 56 }} />
            </div>
            <span className="field__hint">Available: ${user.balance.toFixed(2)} USDC · Off-ramped via Solstice</span>
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" disabled={!amount} onClick={() => { onWithdrawn(parseFloat(amount)); onClose(); }}>Withdraw</button>
        </div>
      </div>
    </div>
  );
};

const TxnDetailModal = ({ txn, onClose }) => {
  const I = window.Icons;
  if (!txn) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--sm" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Transaction details</h3>
          <button className="topnav__icon-btn" onClick={onClose}><I.X size={18} /></button>
        </div>
        <div className="modal__body">
          <div style={{ textAlign: 'center', padding: '12px 0 24px' }}>
            <div className={`txn__icon ${txn.kind === 'in' ? 'txn__icon--in' : txn.kind === 'escrow' ? 'txn__icon--escrow' : 'txn__icon--out'}`} style={{ width: 56, height: 56, margin: '0 auto 12px' }}>
              {txn.kind === 'in' ? <I.ArrowDown size={22} /> : txn.kind === 'escrow' ? <I.Shield size={22} /> : <I.ArrowUp size={22} />}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: txn.kind === 'in' ? 'var(--green-600)' : 'var(--text)' }}>
              {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
            </div>
            <div style={{ fontWeight: 500, fontSize: 14, marginTop: 4 }}>{txn.title}</div>
          </div>
          <div className="receipt">
            <div className="receipt__row"><span className="label">Type</span><span className="val">{txn.kind === 'escrow' ? 'Escrow funding' : txn.kind === 'in' ? 'Received' : 'Sent'}</span></div>
            <div className="receipt__row"><span className="label">Status</span><span className="val val--success">Confirmed</span></div>
            <div className="receipt__row"><span className="label">Network</span><span className="val">Base · USDC</span></div>
            <div className="receipt__row"><span className="label">Tx hash</span><span className="val">{txn.txHash}</span></div>
            <div className="receipt__row"><span className="label">Block</span><span className="val">14,289,{Math.floor(Math.random() * 999)}</span></div>
            <div className="receipt__row"><span className="label">Gas</span><span className="val">$0.04</span></div>
          </div>
          <button className="btn btn--secondary btn--block mt-16">
            <I.ExternalLink size={14} /> View on BaseScan
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplyModal = ({ job, onClose, onApplied }) => {
  const I = window.Icons;
  const [price, setPrice] = React.useState('500');
  const [days, setDays] = React.useState('7');
  const [message, setMessage] = React.useState('');
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Apply for "{job.title}"</h3>
          <button className="topnav__icon-btn" onClick={onClose}><I.X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="grid-2">
            <div className="field">
              <label className="field__label">Your bid (USDC)</label>
              <input className="field__input" value={price} onChange={e => setPrice(e.target.value)} />
              <span className="field__hint">Client posted: ${job.total}</span>
            </div>
            <div className="field">
              <label className="field__label">Delivery (days)</label>
              <input className="field__input" value={days} onChange={e => setDays(e.target.value)} />
              <span className="field__hint">Max: {job.duration} days</span>
            </div>
          </div>
          <div className="field">
            <label className="field__label">Why you?</label>
            <textarea className="field__textarea" rows={5} placeholder="Talk about relevant experience, link your portfolio, mention if you can deliver a free sample…" value={message} onChange={e => setMessage(e.target.value)}></textarea>
          </div>
          <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 12, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <I.Shield size={18} style={{ color: 'var(--green-600)', marginTop: 2 }} />
            <div className="text-sm" style={{ color: 'var(--green-700)' }}>
              You'll get paid only after the client funds escrow and approves the work — no chasing invoices.
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => { onApplied(); onClose(); }}>Submit application</button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ toast }) => {
  const I = window.Icons;
  if (!toast) return null;
  return (
    <div className="toast" key={toast.id}>
      <div className="toast__icon"><I.CheckCircle size={20} /></div>
      <div>
        <div className="toast__title">{toast.title}</div>
        {toast.sub && <div className="toast__sub">{toast.sub}</div>}
      </div>
    </div>
  );
};

window.SendMoneyModal = SendMoneyModal;
window.AddFundsModal = AddFundsModal;
window.WithdrawModal = WithdrawModal;
window.TxnDetailModal = TxnDetailModal;
window.ApplyModal = ApplyModal;
window.Toast = Toast;
