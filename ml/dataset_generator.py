"""
BizGuard AI - Dataset Generator
Generates a realistic, empirical financial and operational business dataset for training
the XGBoost early distress and business failure prediction model.
Based on standard corporate finance distress indicators (Altman Z-Score, Ohlson O-Score,
working capital ratios, leverage, and operational dynamics).
"""

import numpy as np
import pandas as pd
import os

def generate_business_dataset(n_samples=4000, random_state=42):
    np.random.seed(random_state)
    
    # 1. Base business characteristics
    business_age = np.random.exponential(scale=7.5, size=n_samples) + 0.5
    business_age = np.clip(business_age, 0.5, 45.0)
    
    employee_count = np.random.lognormal(mean=3.2, sigma=1.1, size=n_samples)
    employee_count = np.clip(np.round(employee_count), 2, 2500).astype(int)
    
    # Revenue roughly scales with employees with variance
    revenue_per_emp = np.random.lognormal(mean=11.2, sigma=0.55, size=n_samples) # ~ $70k - $200k/emp
    revenue = employee_count * revenue_per_emp
    revenue = np.clip(revenue, 50000, 500000000)
    
    # Growth rate YoY (%)
    sales_growth = np.random.normal(loc=6.5, scale=18.0, size=n_samples)
    
    # Assets scale with revenue & industry intensity
    asset_turnover_base = np.random.uniform(0.6, 2.2, size=n_samples)
    total_assets = revenue / asset_turnover_base
    
    # Profit margin (%) - typically 3% to 18%, but distressed firms have negative margins
    margin_shock = np.random.normal(loc=0.08, scale=0.14, size=n_samples)
    net_profit = revenue * margin_shock
    
    # Operating expenses
    operating_expenses = revenue - net_profit + np.random.normal(0, revenue * 0.03, size=n_samples)
    operating_expenses = np.maximum(operating_expenses, revenue * 0.4)
    
    # Liabilities & Debt Structure
    leverage_factor = np.random.beta(a=2.5, b=2.0, size=n_samples) # distribution between 0.2 and 0.95
    total_liabilities = total_assets * leverage_factor
    
    # Debt is a fraction of liabilities (bank loans, notes)
    debt_share = np.random.uniform(0.35, 0.85, size=n_samples)
    total_debt = total_liabilities * debt_share
    
    # Working capital
    working_capital_ratio = np.random.normal(loc=0.18, scale=0.22, size=n_samples)
    working_capital = total_assets * working_capital_ratio
    
    # Cash flow from operations: correlates with net profit + depreciation adjustments
    cash_flow_adj = np.random.normal(loc=0.02 * revenue, scale=0.06 * revenue, size=n_samples)
    operating_cash_flow = net_profit * 0.85 + cash_flow_adj
    
    # Inventory
    inventory_turnover = np.random.uniform(3.0, 14.0, size=n_samples)
    inventory = (operating_expenses * 0.45) / inventory_turnover
    
    # Accounts Receivable Turnover
    ar_turnover = np.clip(np.random.normal(loc=7.5, scale=3.0, size=n_samples), 1.2, 24.0)

    # 2. Derive key financial ratios
    equity = np.maximum(total_assets - total_liabilities, total_assets * 0.02)
    debt_to_equity = total_debt / equity
    debt_to_assets = total_debt / total_assets
    profit_margin = net_profit / np.maximum(revenue, 1.0)
    current_ratio = np.clip((working_capital + total_liabilities * 0.45) / np.maximum(total_liabilities * 0.45, 1.0), 0.2, 8.0)
    cash_to_debt = operating_cash_flow / np.maximum(total_debt, 1000.0)
    
    # 3. Compute empirical distress risk score (Altman Z-Score + Operational fragility)
    # Z-Score components:
    # X1 = Working Capital / Total Assets
    # X2 = Retained Earnings / Total Assets (proxied by age & profit)
    # X3 = EBIT / Total Assets (proxied by Net Profit / Assets)
    # X4 = Market/Book Equity / Total Liabilities
    # X5 = Sales / Total Assets
    x1 = working_capital / total_assets
    x2 = np.clip((net_profit * np.minimum(business_age, 5.0)) / total_assets, -1.0, 1.0)
    x3 = net_profit / total_assets
    x4 = equity / np.maximum(total_liabilities, 1.0)
    x5 = revenue / total_assets
    
    z_score = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5
    
    # Logistic distress probability function incorporating operational indicators
    # Lower Z-Score, High Debt-to-Equity, Negative Cash Flow, Negative Sales Growth, High Expenses -> High failure odds
    log_odds = (
        - 1.35 * z_score
        + 0.42 * np.clip(debt_to_equity, 0, 10)
        - 1.80 * cash_to_debt
        - 0.035 * sales_growth
        + 0.65 * (operating_expenses / revenue)
        - 0.04 * np.minimum(business_age, 20.0)
        + np.random.logistic(loc=0.0, scale=0.6, size=n_samples) # realistic noise
        - 0.8 # baseline offset for ~15% failure rate
    )
    
    prob_failure = 1.0 / (1.0 + np.exp(-log_odds))
    failed = (prob_failure > 0.52).astype(int)
    
    df = pd.DataFrame({
        "revenue": np.round(revenue, 2),
        "operating_expenses": np.round(operating_expenses, 2),
        "net_profit": np.round(net_profit, 2),
        "total_assets": np.round(total_assets, 2),
        "total_liabilities": np.round(total_liabilities, 2),
        "total_debt": np.round(total_debt, 2),
        "operating_cash_flow": np.round(operating_cash_flow, 2),
        "working_capital": np.round(working_capital, 2),
        "employee_count": employee_count,
        "sales_growth_yoy": np.round(sales_growth, 2),
        "inventory": np.round(inventory, 2),
        "business_age": np.round(business_age, 1),
        "ar_turnover": np.round(ar_turnover, 2),
        "failed": failed
    })
    
    return df

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "dataset")
    os.makedirs(out_dir, exist_ok=True)
    df = generate_business_dataset(n_samples=5000, random_state=42)
    csv_path = os.path.join(out_dir, "business_failure_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Dataset generated successfully at {csv_path}")
    print(f"Shape: {df.shape}")
    print("Class distribution:")
    print(df["failed"].value_counts(normalize=True))
