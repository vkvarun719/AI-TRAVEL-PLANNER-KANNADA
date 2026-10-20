import { useState } from 'react'
import {
  IndianRupee, Plus, Trash2, Users, ArrowRight,
  CheckCircle, AlertCircle, X, Receipt, Sparkles
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function ExpenseTrackerModal({ isOpen, onClose, tripTitle = 'Karnataka Trip' }) {
  const { language } = useLanguage()
  const [members, setMembers] = useState(['You', 'Friend 1', 'Friend 2'])
  const [newMemberName, setNewMemberName] = useState('')

  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Homestay advance', amount: 4500, paidBy: 'You' },
    { id: 2, title: 'Dinner & Mysore Pak', amount: 1200, paidBy: 'Friend 1' },
    { id: 3, title: 'Fuel & highway toll', amount: 2400, paidBy: 'Friend 2' },
  ])

  const [form, setForm] = useState({
    title: '',
    amount: '',
    paidBy: 'You'
  })

  if (!isOpen) return null

  const handleAddMember = (e) => {
    e.preventDefault()
    if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
      setMembers(prev => [...prev, newMemberName.trim()])
      setNewMemberName('')
    }
  }

  const handleAddExpense = (e) => {
    e.preventDefault()
    const amt = parseFloat(form.amount)
    if (!form.title.trim() || isNaN(amt) || amt <= 0) return

    setExpenses(prev => [
      ...prev,
      {
        id: Date.now(),
        title: form.title.trim(),
        amount: amt,
        paidBy: form.paidBy
      }
    ])
    setForm({ title: '', amount: '', paidBy: members[0] || 'You' })
  }

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  // Calculate totals and individual balances
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const perPersonShare = members.length > 0 ? totalSpent / members.length : 0

  // Total paid by each member
  const paidMap = {}
  members.forEach(m => (paidMap[m] = 0))
  expenses.forEach(e => {
    paidMap[e.paidBy] = (paidMap[e.paidBy] || 0) + e.amount
  })

  // Balance = Paid - Share (positive means is owed money; negative means owes money)
  const balances = members.map(m => ({
    name: m,
    paid: paidMap[m] || 0,
    balance: Math.round(((paidMap[m] || 0) - perPersonShare) * 100) / 100
  }))

  // Settle Debts algorithm
  const debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b, balance: -b.balance }))
  const creditors = balances.filter(b => b.balance > 0.01).map(b => ({ ...b }))
  
  const settlements = []
  let dIdx = 0
  let cIdx = 0

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx]
    const creditor = creditors[cIdx]
    const amount = Math.min(debtor.balance, creditor.balance)

    if (amount > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount)
      })
    }

    debtor.balance -= amount
    creditor.balance -= amount

    if (debtor.balance <= 0.01) dIdx++
    if (creditor.balance <= 0.01) cIdx++
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#FAF6F0] rounded-3xl shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-stone-200/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-karnataka-green to-emerald-700 flex items-center justify-center text-white shadow-md">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-karnataka-dark flex items-center gap-2">
                <span>{language === 'kn' ? 'ವೆಚ್ಚ ಟ್ರ್ಯಾಕರ್ ಮತ್ತು ಬಿಲ್ ಹಂಚಿಕೆ' : 'Expense Tracker & Bill Splitter'}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  {members.length} Members
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Split food, stay & fuel bills seamlessly among travel companions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="card p-3.5 bg-white border border-stone-200/80 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                Total Expenses
              </span>
              <span className="text-lg sm:text-xl font-black text-stone-900">
                ₹{Math.round(totalSpent).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="card p-3.5 bg-white border border-stone-200/80 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                Each Person's Share
              </span>
              <span className="text-lg sm:text-xl font-black text-karnataka-green">
                ₹{Math.round(perPersonShare).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="card p-3.5 bg-white border border-stone-200/80 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                Settlements Due
              </span>
              <span className="text-lg sm:text-xl font-black text-amber-700">
                {settlements.length} Transfers
              </span>
            </div>
          </div>

          {/* Group Members Bar */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Users size={13} className="text-karnataka-red" />
                <span>Group Travelers:</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {members.map((m, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold border border-stone-200 flex items-center gap-1.5"
                >
                  <span>{m}</span>
                </span>
              ))}

              <form onSubmit={handleAddMember} className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add member"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="px-2.5 py-1 rounded-full border border-stone-300 text-xs focus:outline-none focus:border-karnataka-red w-28 bg-white"
                />
              </form>
            </div>
          </div>

          {/* Add New Expense Form */}
          <form onSubmit={handleAddExpense} className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              + Log New Group Expense
            </span>

            <div className="grid sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Expense description (e.g. Mysuru Dosa)"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="input-field py-2 text-xs"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <div className="relative">
                  <IndianRupee size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="input-field py-2 pl-7 text-xs font-bold"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={form.paidBy}
                  onChange={e => setForm(f => ({ ...f, paidBy: e.target.value }))}
                  className="input-field py-2 text-xs font-semibold"
                >
                  {members.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="btn-primary w-full py-2 text-xs font-bold flex items-center justify-center gap-1 rounded-xl"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          </form>

          {/* Expenses List */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
              Logged Expenses ({expenses.length})
            </span>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {expenses.map(e => (
                <div
                  key={e.id}
                  className="p-3 bg-white rounded-xl border border-stone-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-stone-900">{e.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
                      Paid by {e.paidBy}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-black text-stone-900">₹{e.amount.toLocaleString('en-IN')}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(e.id)}
                      className="text-stone-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settlement Solution (Who Pays Whom) */}
          {settlements.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle size={15} className="text-karnataka-green" />
                <span>Debt Settlement Plan (Optimal Minimum Transfers):</span>
              </div>

              <div className="space-y-1.5">
                {settlements.map((st, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white border border-emerald-100 flex items-center justify-between text-xs font-semibold text-stone-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-karnataka-red font-bold">{st.from}</span>
                      <span className="text-stone-400">pays</span>
                      <span className="text-karnataka-green font-bold">{st.to}</span>
                    </div>
                    <span className="font-black text-stone-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      ₹{st.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
