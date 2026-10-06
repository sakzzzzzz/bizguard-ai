"""
BizGuard AI - Standalone Model Evaluation & Viva Diagnostics Script
Loads the saved XGBoost model and displays key metrics, feature rankings, and confusion matrix.
Useful during project demonstration and viva presentation.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np

def run_evaluation():
    ml_dir = os.path.dirname(__file__)
    metrics_path = os.path.join(ml_dir, "saved_models", "evaluation_metrics.json")
    
    if not os.path.exists(metrics_path):
        print("Evaluation metrics not found. Please run train_model.py first.")
        return
        
    with open(metrics_path, "r") as f:
        metrics = json.load(f)
        
    print("=" * 65)
    print("BIZGUARD AI: MACHINE LEARNING MODEL DIAGNOSTICS & EVALUATION")
    print("=" * 65)
    print(f"Model Architecture: {metrics['model_name']}")
    print(f"Hyperparameters:    {json.dumps(metrics['algorithm_params'], indent=2)}")
    print("-" * 65)
    print("CLASSIFICATION PERFORMANCE SUMMARY:")
    print(f"  • Test Accuracy:   {metrics['accuracy'] * 100:.2f}%")
    print(f"  • Precision:       {metrics['precision'] * 100:.2f}% (Minimizes false alarms)")
    print(f"  • Recall:          {metrics['recall'] * 100:.2f}% (Captures early distress)")
    print(f"  • F1-Score:        {metrics['f1_score'] * 100:.2f}%")
    print(f"  • ROC-AUC Score:   {metrics['roc_auc']:.4f}")
    print("-" * 65)
    
    cm = metrics["confusion_matrix"]
    print("CONFUSION MATRIX:")
    print(f"  [TN: {cm['true_negatives']:<4} | FP: {cm['false_positives']:<4}] -> Actual Healthy")
    print(f"  [FN: {cm['false_negatives']:<4} | TP: {cm['true_positives']:<4}] -> Actual Distressed / Failed")
    print("-" * 65)
    
    print("TOP 10 RISK PREDICTIVE FEATURES (XGBoost Weight & Gain):")
    for idx, item in enumerate(metrics["feature_importances"][:10], 1):
        print(f"  {idx:2d}. {item['feature']:<25} : {item['importance']:.4f}")
    print("=" * 65)

if __name__ == "__main__":
    run_evaluation()
