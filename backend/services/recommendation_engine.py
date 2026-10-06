import uuid
from typing import List
from schemas.business import BusinessInput, KeyRatio, ShapFactor, Recommendation

def generate_recommendations(
    data: BusinessInput,
    failure_probability_percent: float,
    ratios: List[KeyRatio],
    shap_factors: List[ShapFactor],
    runway_months: float
) -> List[Recommendation]:
    recs: List[Recommendation] = []
    
    ratio_dict = {r.key: r.value for r in ratios}
    ltv_to_cac = ratio_dict.get("ltv_to_cac", 3.0)
    debt_to_equity = ratio_dict.get("debt_to_equity", 1.0)
    rule_of_40 = ratio_dict.get("rule_of_40", 20.0)
    
    # 1. HIGH PRIORITY: Critical Cash Runway Alert (< 6 Months)
    if runway_months < 6.0:
        recs.append(Recommendation(
            id=str(uuid.uuid4()),
            priority="HIGH",
            category="Runway & Burn Compression",
            title="Execute Emergency Burn Compression to Extend Runway Beyond 10 Months",
            description=f"Current liquid runway is only {runway_months:.1f} months (${data.cash_in_bank:,.0f} treasury vs ${data.monthly_burn_rate:,.0f}/mo net burn). Immediate cash conservation is required to avoid insolvency before next funding.",
            actionable_steps=[
                "Target an immediate 25-35% reduction in net monthly burn rate.",
                "Freeze all non-essential hiring and consolidate duplicate SaaS/cloud infrastructure costs.",
                "Incentivize enterprise customers with a 15-20% discount for upfront annual cash prepayment.",
                "Prepare an insider bridge financing round (SAFE / Convertible Note) with existing angel/seed investors."
            ],
            expected_impact="Extends operational runway from 4 to 12+ months and lowers default risk by 45%."
        ))

    # 2. HIGH PRIORITY: Inefficient Unit Economics (LTV:CAC < 2.0x)
    if ltv_to_cac < 2.0:
        recs.append(Recommendation(
            id=str(uuid.uuid4()),
            priority="HIGH",
            category="Unit Economics & CAC",
            title="Optimize Customer Acquisition Efficiency & Stop Loss-Making Acquisition",
            description=f"Unit economics are unhealthy (LTV:CAC is {ltv_to_cac:.2f}x vs > 3.0x industry benchmark). You are spending too much capital to acquire each customer.",
            actionable_steps=[
                "Pause low-converting paid marketing channels (Google Ads, Meta) with CAC payback > 18 months.",
                "Focus sales efforts on high-margin ICP (Ideal Customer Profile) segments with proven retention.",
                "Re-align sales compensation bonuses to gross margin contribution and multi-year renewals.",
                "Leverage organic product-led growth (PLG) loops and client referral incentives."
            ],
            expected_impact="Restores LTV:CAC ratio above 3.5x and reduces monthly burn."
        ))

    # 3. HIGH PRIORITY: High Debt / Heavy SAFE Note Overhang
    if debt_to_equity > 1.8 or data.total_debt > data.cash_in_bank * 1.5:
        recs.append(Recommendation(
            id=str(uuid.uuid4()),
            priority="HIGH",
            category="Capital Structure & Debt",
            title="Restructure Short-Term Venture Debt & Liquidity Obligations",
            description=f"Total debt obligations (${data.total_debt:,.0f}) significantly exceed liquid reserves, creating acute default risk.",
            actionable_steps=[
                "Negotiate interest-only payment holidays or covenant waivers with venture debt providers.",
                "Convert near-term short-term promissory notes into equity SAFE instruments.",
                "Avoid utilizing short-term credit facilities to fund recurring payroll commitments."
            ],
            expected_impact="Alleviates immediate debt servicing pressure and protects treasury balance."
        ))

    # 4. MEDIUM PRIORITY: Pricing & Cash Flow Pull-Forward
    if data.net_profit < 0 and runway_months < 14.0:
        recs.append(Recommendation(
            id=str(uuid.uuid4()),
            priority="MEDIUM",
            category="Pricing & Monetization",
            title="Implement Upfront Annual Contract Prepayments & Price Optimization",
            description="Accelerate cash collections to build treasury buffer organically without equity dilution.",
            actionable_steps=[
                "Transition monthly recurring subscribers to annual prepaid billing plans.",
                "Test 10-15% price increases on premium feature tiers for new customer cohorts.",
                "Introduce usage-based expansion tiers to capture expansion ARR from existing accounts."
            ],
            expected_impact="Pulls forward 3-6 months of organic cash flow directly into bank treasury."
        ))

    # 5. MEDIUM PRIORITY: Growth Velocity / Net Revenue Retention
    if (data.mom_growth_pct or 0) < 5.0:
        recs.append(Recommendation(
            id=str(uuid.uuid4()),
            priority="MEDIUM",
            category="Growth & Retention",
            title="Accelerate MoM Growth Velocity & Reduce Customer Churn",
            description=f"MoM growth ({data.mom_growth_pct:.1f}%) is below venture-scale pace, hindering future Series A/B fundability.",
            actionable_steps=[
                "Establish a dedicated Customer Success onboarding sprint to improve 30-day user activation.",
                "Analyze exit interviews of churned accounts to patch core product-market fit friction points.",
                "Double down on customer expansion playbooks to drive Net Revenue Retention (NRR) above 115%."
            ],
            expected_impact="Accelerates top-line momentum and strengthens Series A fundability scorecard."
        ))

    # 6. STRATEGIC / LOW PRIORITY: Startup AI Governance
    recs.append(Recommendation(
        id=str(uuid.uuid4()),
        priority="LOW",
        category="Governance & Board Reporting",
        title="Establish Monthly AI Runway & Burn Rate Governance with StartGuard",
        description="Maintain disciplined investor reporting and continuous early-warning monitoring.",
        actionable_steps=[
            "Conduct monthly StartGuard AI audits ahead of board updates and investor newsletters.",
            "Maintain minimum 14 months of runway before committing to aggressive headcount expansion.",
            "Track SHAP risk attribution trends across quarterly cohort reviews."
        ],
        expected_impact="Ensures institutional financial discipline and maximizes venture valuation multiples."
    ))

    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    recs.sort(key=lambda x: priority_order.get(x.priority, 3))
    return recs
