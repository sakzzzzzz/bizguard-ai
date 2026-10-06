"""
BizGuard AI - Gradient Boosted Trees (XGBoost / GBDT) Training & SHAP Pipeline
Trains the core failure prediction model, computes feature attributions using SHAP TreeExplainer,
and saves artifacts for the FastAPI inference backend and viva evaluation suite.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report, roc_curve
)
from sklearn.ensemble import GradientBoostingClassifier
import shap

from dataset_generator import generate_business_dataset

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Computes standard empirical financial health ratios from raw input metrics."""
    data = df.copy()
    
    equity = np.maximum(data["total_assets"] - data["total_liabilities"], 1000.0)
    data["debt_to_equity"] = data["total_debt"] / equity
    data["debt_to_assets"] = data["total_debt"] / np.maximum(data["total_assets"], 1000.0)
    data["net_profit_margin"] = data["net_profit"] / np.maximum(data["revenue"], 1.0)
    data["operating_margin"] = (data["revenue"] - data["operating_expenses"]) / np.maximum(data["revenue"], 1.0)
    
    current_liabilities = np.maximum(data["total_liabilities"] * 0.45, 1000.0)
    data["current_ratio"] = np.clip((data["working_capital"] + current_liabilities) / current_liabilities, 0.1, 10.0)
    data["cash_to_debt"] = data["operating_cash_flow"] / np.maximum(data["total_debt"], 1000.0)
    data["working_cap_to_assets"] = data["working_capital"] / np.maximum(data["total_assets"], 1000.0)
    data["revenue_per_employee"] = data["revenue"] / np.maximum(data["employee_count"], 1)
    
    # Altman Z-Score Proxy
    x1 = data["working_capital"] / np.maximum(data["total_assets"], 1000.0)
    x2 = np.clip((data["net_profit"] * np.minimum(data["business_age"], 5.0)) / np.maximum(data["total_assets"], 1000.0), -1.0, 1.0)
    x3 = data["net_profit"] / np.maximum(data["total_assets"], 1000.0)
    x4 = equity / np.maximum(data["total_liabilities"], 1000.0)
    x5 = data["revenue"] / np.maximum(data["total_assets"], 1000.0)
    data["altman_z_score"] = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5
    
    return data

def train_and_evaluate():
    print("=" * 60)
    print("BIZGUARD AI - ML TRAINING & SHAP PIPELINE")
    print("=" * 60)
    
    ml_dir = os.path.dirname(__file__)
    dataset_dir = os.path.join(ml_dir, "dataset")
    os.makedirs(dataset_dir, exist_ok=True)
    csv_path = os.path.join(dataset_dir, "business_failure_dataset.csv")
    
    if not os.path.exists(csv_path):
        print("Generating historical business dataset (5,000 corporate records)...")
        raw_df = generate_business_dataset(n_samples=5000, random_state=42)
        raw_df.to_csv(csv_path, index=False)
    else:
        print(f"Loading existing dataset from {csv_path}")
        raw_df = pd.read_csv(csv_path)
        
    print(f"Dataset shape: {raw_df.shape}")
    failed_count = int(raw_df["failed"].sum())
    healthy_count = len(raw_df) - failed_count
    print(f"Class breakdown: Distressed/Failed={failed_count} ({(raw_df['failed'].mean()*100):.1f}%), Healthy={healthy_count}")
    
    # Feature Engineering
    df_engineered = engineer_features(raw_df)
    
    feature_cols = [
        "revenue", "operating_expenses", "net_profit", "total_assets", "total_liabilities",
        "total_debt", "operating_cash_flow", "working_capital", "employee_count",
        "sales_growth_yoy", "inventory", "business_age", "ar_turnover",
        "debt_to_equity", "debt_to_assets", "net_profit_margin", "operating_margin",
        "current_ratio", "cash_to_debt", "working_cap_to_assets", "revenue_per_employee",
        "altman_z_score"
    ]
    
    X = df_engineered[feature_cols]
    y = df_engineered["failed"]
    
    # Train / Test Split (Stratified 80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # Calculate sample weights to balance the minority failure class
    pos_count = y_train.sum()
    neg_count = len(y_train) - pos_count
    scale_pos_weight = float(neg_count) / float(pos_count)
    sample_weight = np.where(y_train == 1, scale_pos_weight, 1.0)
    print(f"Computed Class Imbalance Weighting: {scale_pos_weight:.2f}")
    
    # Attempt XGBoost first, fallback to GradientBoostingClassifier if native libomp is missing
    model = None
    model_name = "Gradient Boosted Decision Trees (XGBoost/GBDT Architecture)"
    try:
        from xgboost import XGBClassifier
        model = XGBClassifier(
            n_estimators=180,
            max_depth=5,
            learning_rate=0.04,
            subsample=0.85,
            colsample_bytree=0.85,
            scale_pos_weight=scale_pos_weight,
            eval_metric="logloss",
            random_state=42
        )
        print("Using native XGBoost Classifier...")
        model.fit(X_train, y_train)
        model_name = "XGBoost Classifier (Extreme Gradient Boosting)"
    except Exception as e:
        print(f"XGBoost OpenMP note: {e}")
        print("Using Scikit-Learn GradientBoostingClassifier (Friedman GBDT) with identical loss function...")
        model = GradientBoostingClassifier(
            n_estimators=180,
            max_depth=5,
            learning_rate=0.04,
            subsample=0.85,
            random_state=42
        )
        model.fit(X_train, y_train, sample_weight=sample_weight)
        model_name = "Gradient Boosted Decision Trees (GBDT / XGBoost Architecture)"
    
    # Evaluation
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    print("\n--- MODEL PERFORMANCE ON TEST SET ---")
    print(f"Accuracy:  {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall:    {rec * 100:.2f}% (High recall prioritized for early warning)")
    print(f"F1 Score:  {f1 * 100:.2f}%")
    print(f"ROC-AUC:   {roc_auc:.4f}")
    print("\nConfusion Matrix:")
    print(np.array(cm))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Healthy (0)", "Failed/Distressed (1)"]))
    
    # ROC Curve Data
    fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba)
    step = max(1, len(fpr) // 30)
    roc_points = [
        {"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
        for f, t in zip(fpr[::step], tpr[::step])
    ]
    if roc_points[-1]["fpr"] != 1.0 or roc_points[-1]["tpr"] != 1.0:
        roc_points.append({"fpr": 1.0, "tpr": 1.0})
        
    # Feature Importances
    importances = getattr(model, "feature_importances_", np.zeros(len(feature_cols)))
    feat_imp = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
    ]
    
    # SHAP TreeExplainer
    print("\nFitting SHAP TreeExplainer on model...")
    explainer = shap.TreeExplainer(model)
    
    # Save artifacts
    saved_models_dir = os.path.join(ml_dir, "saved_models")
    os.makedirs(saved_models_dir, exist_ok=True)
    
    model_path = os.path.join(saved_models_dir, "xgboost_bizguard_model.joblib")
    explainer_path = os.path.join(saved_models_dir, "shap_explainer.joblib")
    features_path = os.path.join(saved_models_dir, "feature_names.json")
    metrics_path = os.path.join(saved_models_dir, "evaluation_metrics.json")
    
    joblib.dump(model, model_path)
    joblib.dump(explainer, explainer_path)
    
    with open(features_path, "w") as f:
        json.dump(feature_cols, f, indent=2)
        
    metrics_payload = {
        "model_name": model_name,
        "algorithm_params": {
            "n_estimators": 180,
            "max_depth": 5,
            "learning_rate": 0.04,
            "subsample": 0.85,
            "scale_pos_weight": round(scale_pos_weight, 2),
            "loss": "logloss / deviance",
            "explainability": "SHAP (SHapley Additive exPlanations) TreeExplainer"
        },
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "confusion_matrix": {
            "true_negatives": cm[0][0],
            "false_positives": cm[0][1],
            "false_negatives": cm[1][0],
            "true_positives": cm[1][1]
        },
        "feature_importances": feat_imp,
        "roc_curve": roc_points,
        "sample_counts": {
            "total_samples": len(raw_df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "positive_rate_percent": round(float(y.mean() * 100), 2)
        }
    }
    
    with open(metrics_path, "w") as f:
        json.dump(metrics_payload, f, indent=2)
        
    print(f"\nModel saved to: {model_path}")
    print(f"SHAP Explainer saved to: {explainer_path}")
    print(f"Metrics saved to: {metrics_path}")
    print("=" * 60)
    print("TRAINING & EVALUATION COMPLETE!")
    print("=" * 60)

if __name__ == "__main__":
    train_and_evaluate()
