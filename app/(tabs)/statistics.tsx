import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 48;

const PURPLE = "#7c3aed";
const PURPLE_LIGHT = "#ede9fe";

const CATEGORIES = [
  {
    label: "Food & Dining",
    icon: "🍔",
    color: "#f97316",
    amount: 3200,
    budget: 4000,
  },
  {
    label: "Transport",
    icon: "🚗",
    color: "#3b82f6",
    amount: 1500,
    budget: 2000,
  },
  {
    label: "Shopping",
    icon: "🛍️",
    color: "#ec4899",
    amount: 2800,
    budget: 3000,
  },
  { label: "Bills", icon: "⚡", color: "#eab308", amount: 1800, budget: 1800 },
  {
    label: "Entertainment",
    icon: "🎬",
    color: "#8b5cf6",
    amount: 900,
    budget: 1500,
  },
  { label: "Health", icon: "💊", color: "#22c55e", amount: 600, budget: 1000 },
];

const MONTHLY = [
  { month: "Jan", amount: 8200 },
  { month: "Feb", amount: 6500 },
  { month: "Mar", amount: 9100 },
  { month: "Apr", amount: 7400 },
  { month: "May", amount: 10800 },
  { month: "Jun", amount: 8900 },
];

const PERIODS = ["Week", "Month", "Year"];

const TOTAL = CATEGORIES.reduce((s, c) => s + c.amount, 0);

// ── Donut Chart (SVG-free, pure View) ──────────────────────────────────────
function DonutChart() {
  const SIZE = 160;
  const STROKE = 22;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;

  let offset = 0;
  const slices = CATEGORIES.map((cat) => {
    const pct = cat.amount / TOTAL;
    const dash = pct * CIRC;
    const slice = { ...cat, dash, gap: CIRC - dash, offset, pct };
    offset += dash;
    return slice;
  });

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Simulated donut using layered arcs via conic-gradient workaround */}
      {/* We'll use stacked colored rings approximation with View */}
      <View
        style={{
          width: SIZE,
          height: SIZE,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background ring */}
        <View
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            borderWidth: STROKE,
            borderColor: "#f3f4f6",
            position: "absolute",
          }}
        />
        {/* Colored segments approximated by rotating border-color Views */}
        {slices.map((slice, i) => {
          const deg = (slice.offset / CIRC) * 360;
          const span = slice.pct * 360;
          return (
            <View
              key={i}
              style={{
                position: "absolute",
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                borderWidth: STROKE,
                borderColor: "transparent",
                borderTopColor: span > 0 ? slice.color : "transparent",
                transform: [{ rotate: `${deg}deg` }],
                opacity: span > 5 ? 1 : 0,
              }}
            />
          );
        })}
        {/* Center */}
        <View
          style={{
            width: SIZE - STROKE * 2 - 8,
            height: SIZE - STROKE * 2 - 8,
            borderRadius: (SIZE - STROKE * 2 - 8) / 2,
            backgroundColor: "#fff",
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600" }}>
            TOTAL
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#1f2937" }}>
            ₱{(TOTAL / 1000).toFixed(1)}k
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── Bar Chart ───────────────────────────────────────────────────────────────
function BarChart({ period }: { period: string }) {
  const max = Math.max(...MONTHLY.map((m) => m.amount));
  const BAR_H = 120;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: BAR_H + 28,
      }}
    >
      {MONTHLY.map((m, i) => {
        const h = (m.amount / max) * BAR_H;
        const isLast = i === MONTHLY.length - 1;
        return (
          <View key={i} style={{ alignItems: "center", flex: 1 }}>
            {isLast && (
              <View
                style={{
                  backgroundColor: PURPLE_LIGHT,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: 6,
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 9, color: PURPLE, fontWeight: "700" }}>
                  ₱{(m.amount / 1000).toFixed(1)}k
                </Text>
              </View>
            )}
            <View
              style={{
                width: 20,
                height: h,
                borderRadius: 6,
                backgroundColor: isLast ? PURPLE : "#e5e7eb",
              }}
            />
            <Text
              style={{
                fontSize: 10,
                color: "#9ca3af",
                marginTop: 6,
                fontWeight: "500",
              }}
            >
              {m.month}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function StatisticsTab() {
  const [period, setPeriod] = useState("Month");

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>Overview</Text>
          <Text style={s.headerTitle}>Statistics</Text>
        </View>
        <View style={s.badge}>
          <Text style={s.badgeText}>May 2025</Text>
        </View>
      </View>

      {/* PERIOD TABS */}
      <View style={s.periodRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[s.periodBtn, period === p && s.periodBtnActive]}
          >
            <Text style={[s.periodText, period === p && s.periodTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SUMMARY CARDS */}
      <View style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: PURPLE }]}>
          <Text style={s.summaryLabel}>Spent</Text>
          <Text style={s.summaryValue}>₱{TOTAL.toLocaleString()}</Text>
          <Text style={s.summaryChange}>↑ 12% vs last month</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: "#10b981" }]}>
          <Text style={s.summaryLabel}>Saved</Text>
          <Text style={s.summaryValue}>₱2,400</Text>
          <Text style={s.summaryChange}>↑ 5% vs last month</Text>
        </View>
      </View>

      {/* SPENDING TREND */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Spending Trend</Text>
        <Text style={s.cardSub}>Last 6 months</Text>
        <View style={{ marginTop: 16 }}>
          <BarChart period={period} />
        </View>
      </View>

      {/* DONUT + LEGEND */}
      <View style={s.card}>
        <Text style={s.cardTitle}>By Category</Text>
        <Text style={s.cardSub}>Where your money goes</Text>
        <View style={s.donutRow}>
          <DonutChart />
          <View style={s.legend}>
            {CATEGORIES.map((cat, i) => (
              <View key={i} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: cat.color }]} />
                <Text style={s.legendLabel}>{cat.label}</Text>
                <Text style={s.legendPct}>
                  {Math.round((cat.amount / TOTAL) * 100)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* BUDGET VS ACTUAL */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Budget vs Actual</Text>
        <Text style={s.cardSub}>Track your limits</Text>
        <View style={{ marginTop: 16 }}>
          {CATEGORIES.map((cat, i) => {
            const pct = Math.min(cat.amount / cat.budget, 1);
            const over = cat.amount > cat.budget;
            return (
              <View key={i} style={{ marginBottom: 14 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
                    <Text style={s.budgetLabel}>{cat.label}</Text>
                  </View>
                  <Text style={[s.budgetAmt, over && { color: "#ef4444" }]}>
                    ₱{cat.amount.toLocaleString()} / ₱
                    {cat.budget.toLocaleString()}
                  </Text>
                </View>
                <View style={s.barBg}>
                  <View
                    style={[
                      s.barFill,
                      {
                        width: `${pct * 100}%`,
                        backgroundColor: over ? "#ef4444" : cat.color,
                      },
                    ]}
                  />
                </View>
                {over && (
                  <Text style={s.overText}>
                    Over budget by ₱{(cat.amount - cat.budget).toLocaleString()}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* TOP SPENDING */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Top Categories</Text>
        <Text style={s.cardSub}>Highest spending this month</Text>
        <View style={{ marginTop: 12 }}>
          {[...CATEGORIES]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3)
            .map((cat, i) => (
              <View key={i} style={s.topItem}>
                <View
                  style={[
                    s.topRank,
                    { backgroundColor: i === 0 ? "#fef3c7" : "#f3f4f6" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "800",
                      color: i === 0 ? "#d97706" : "#6b7280",
                    }}
                  >
                    #{i + 1}
                  </Text>
                </View>
                <View
                  style={[s.topIcon, { backgroundColor: cat.color + "20" }]}
                >
                  <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.topLabel}>{cat.label}</Text>
                  <Text style={s.topSub}>
                    {Math.round((cat.amount / TOTAL) * 100)}% of total
                  </Text>
                </View>
                <Text style={[s.topAmt, { color: cat.color }]}>
                  ₱{cat.amount.toLocaleString()}
                </Text>
              </View>
            ))}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f3ff" },

  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerSub: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    marginTop: 2,
  },
  badge: {
    backgroundColor: PURPLE_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, color: PURPLE, fontWeight: "700" },

  periodRow: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    padding: 3,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  periodBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  periodText: { fontSize: 13, color: "#9ca3af", fontWeight: "600" },
  periodTextActive: { color: PURPLE, fontWeight: "700" },

  summaryRow: {
    flexDirection: "row",
    marginHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
  },
  summaryChange: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1f2937" },
  cardSub: { fontSize: 12, color: "#9ca3af", marginTop: 2 },

  donutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 16,
  },
  legend: { flex: 1 },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { flex: 1, fontSize: 12, color: "#374151", fontWeight: "500" },
  legendPct: { fontSize: 12, color: "#6b7280", fontWeight: "700" },

  barBg: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: 8, borderRadius: 4 },
  budgetLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
    marginLeft: 6,
  },
  budgetAmt: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  overText: { fontSize: 11, color: "#ef4444", marginTop: 3, fontWeight: "500" },

  topItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  topRank: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  topIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  topLabel: { fontSize: 14, fontWeight: "700", color: "#1f2937" },
  topSub: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
  topAmt: { fontSize: 15, fontWeight: "800" },
});
