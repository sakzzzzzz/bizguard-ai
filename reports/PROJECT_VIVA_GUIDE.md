# BizGuard AI — Final-Year Project Viva & Defense Guide

## Project Title
**AI-Based Early Business Failure Prediction and Preventive Decision Support Using XGBoost and Explainable AI for Financial and Operational Data Analysis**

---

## 1. Executive Summary & Problem Statement
- **Problem**: Traditional financial distress scoring (like standalone Altman Z-Score) relies on rigid linear formulas and lacks operational metrics (e.g. employee headcount, YoY sales momentum, inventory turnover). Conversely, standard Machine Learning models act as "black boxes" — they predict failure probabilities without explaining *why* or providing *actionable turnarounds*.
- **BizGuard AI Solution**: A full-stack decision-support system that:
  1. Integrates both financial statements and operational indicators.
  2. Uses regularized **Gradient Boosted Decision Trees (XGBoost/GBDT)** with class-imbalance weighting to achieve **92.9% accuracy** and **82.6% distress recall**.
  3. Decomposes individual risk forecasts into exact local **SHAP (SHapley Additive exPlanations)** attribution values.
  4. Feeds positive risk drivers into an automated **Preventive Recommendation Engine** to produce prioritized strategic remedies.
  5. Provides an interactive **What-If Sensitivity Simulator** allowing executives to test debt restructuring and cost cuts in real time.

---

## 2. Machine Learning Architecture & Methodology

### A. Dataset Characteristics
- **Size**: 5,000 corporate records across diverse SME and mid-market sectors.
- **Class Balance**: 8.6% distress/failure rate, accurately reflecting real-world corporate insolvency distributions.
- **Input Variables (13 raw features)**: Gross Revenue, Operating Expenses, Net Profit/Loss, Total Assets, Total Liabilities, Total Debt, Operating Cash Flow, Working Capital, Employee Headcount, YoY Revenue Growth %, Inventory Valuation, Operating Age (Years), Accounts Receivable Turnover.
- **Engineered Financial Ratios (9 derived features)**:
  - Debt-to-Equity Ratio
  - Debt-to-Assets Ratio
  - Net Profit Margin
  - Operating Profit Margin
  - Estimated Current Ratio
  - Cash-to-Debt Coverage Ratio
  - Working Capital to Assets
  - Revenue per Employee (Productivity)
  - Altman Z-Score Proxy Index

### B. XGBoost / GBDT Ensemble Specs
- **Loss Function**: Binary Logistic / Deviance Log-Loss
- **Ensemble Depth**: 180 Estimators, Max Depth = 5
- **Regularization / Shrinkage**: Learning rate $\eta = 0.04$, Subsample = 0.85, Feature subsampling = 0.85
- **Imbalance Handling**: `scale_pos_weight = 10.56` to prioritize high sensitivity/recall for failing firms.

### C. Performance Metrics on Independent Test Set ($N=1,000$)
- **Accuracy**: $92.90\%$
- **Distress Recall**: $82.56\%$ (Essential for early warning: missing a failing firm is critical)
- **Precision**: $55.91\%$
- **ROC-AUC Score**: $0.9685$
- **Confusion Matrix**:
  - True Negatives (Healthy predicted as Healthy): 858
  - False Positives (Healthy flagged as Distressed): 56
  - False Negatives (Distressed missed): 15
  - True Positives (Distressed correctly identified): 71

---

## 3. Explainable AI (SHAP) Mathematical Formulation
SHAP calculates the exact marginal contribution $\phi_i$ of feature $i$ across all feature subsets $S \subseteq F \setminus \{i\}$:
$$\phi_i(x) = \sum_{S \subseteq F \setminus \{i\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} \left[ f_x(S \cup \{i\}) - f_x(S) \right]$$

### Key Properties Satisfied by TreeExplainer:
1. **Efficiency / Local Accuracy**: The sum of SHAP values plus the base expectation equals the model log-odds output.
2. **Missingness**: Features not contributing to the prediction receive zero impact.
3. **Consistency**: If a feature's marginal contribution increases or stays equal across all sub-trees, its SHAP attribution never decreases.

---

## 4. Top 10 Viva Examiner Questions & Model Answers

### Q1: Why is this project more than just an ML model?
> **Answer**: A standalone ML model only outputs a binary probability ($0.78$). BizGuard AI provides a complete decision-support lifecycle: inputs $\to$ feature engineering $\to$ XGBoost classification $\to$ SHAP XAI factor attribution $\to$ prioritized preventive recommendations $\to$ interactive what-if scenario simulator $\to$ executive PDF audit reporting.

### Q2: Why did you prioritize Recall over Precision?
> **Answer**: In business failure early warning systems, a False Negative (failing to alert a distressed business until bankruptcy) has catastrophic financial consequences. A False Positive (over-cautiously flagging a stable company for review) only triggers a prudent financial audit. Hence, we tuned class weights to achieve an 82.6% Recall.

### Q3: How are the recommendations generated?
> **Answer**: Rather than generic templates, the recommendation engine dynamically maps the top positive SHAP risk drivers and stressed financial ratios (e.g. Debt-to-Equity $> 2.2$, Operating Cash Flow $< 0$, Current Ratio $< 1.3$) into categorized **HIGH**, **MEDIUM**, and **STRATEGIC** mitigation steps with expected percentage impacts.

### Q4: How does the What-If Simulator work?
> **Answer**: It performs sensitivity analysis by taking the base business input vector, applying user adjustments (e.g. $-20\%$ debt reduction, $-10\%$ OPEX cut), recomputing all 22 engineered features, and feeding the modified vector through the trained model to show real-time risk reduction and health score gain.

---

## 5. Demonstration Flow for Viva Presentation
1. **Open Landing Page**: Highlight the problem of corporate distress and system pillars.
2. **Click 1-Click Demo Profile**: Select "Distressed Retailer (Critical Debt)".
3. **Inspect Dashboard**: Show the 78% Failure Risk, Health Score of 32/100, and Ratio Scorecard.
4. **Explainable AI (SHAP)**: Show the horizontal diverging waterfall chart and demonstrate why debt and negative cash flow drove the prediction.
5. **Decision Support & What-If Simulator**: Move the "Debt Reduction" slider to $-30\%$ and "OPEX Cut" to $-15\%$, showing the risk drop from $78\%$ down to $32\%$ (a 46% risk reduction!).
6. **Print Audit Report**: Click "Export Full Audit Report" to display the formal executive document.
7. **Viva Diagnostics Tab**: Showcase the Confusion Matrix, ROC-AUC score ($0.9685$), and hyperparameters.
