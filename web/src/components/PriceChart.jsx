import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'

const rub = (n) => n.toLocaleString('ru-RU') + ' ₽'

// График истории цен.
export default function PriceChart({ history, target }) {
  const prices = history.map((h) => h.price)
  const lo = Math.min(...prices, target ?? Infinity)
  const hi = Math.max(...prices, target ?? -Infinity)
  const pad = (hi - lo) * 0.08 || 1

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={history} margin={{ top: 10, right: 12, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="var(--bd)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={40} stroke="var(--bd)" />
        <YAxis domain={[Math.floor(lo - pad), Math.ceil(hi + pad)]} tick={{ fontSize: 12 }} tickFormatter={(v) => v.toLocaleString('ru-RU')} width={64} stroke="var(--bd)" />
        <Tooltip formatter={(v) => [rub(v), 'Цена']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--bd)', borderRadius: 6 }} />
        {target && (
          <ReferenceLine y={target} stroke="var(--warn)" strokeDasharray="5 4"
            label={{ value: 'Желаемая цена', fill: 'var(--warn)', fontSize: 12, position: 'insideTopRight' }} />
        )}
        <Line type="monotone" dataKey="price" stroke="var(--ac)" strokeWidth={2.2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
