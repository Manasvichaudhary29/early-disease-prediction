import numpy as np
try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False
from typing import List, Dict, Any

CLINICAL_NAMES = {
    # Diabetes
    "Pregnancies": "Number of Pregnancies",
    "Glucose": "Plasma Glucose Concentration",
    "BloodPressure": "Diastolic Blood Pressure",
    "SkinThickness": "Triceps Skinfold Thickness",
    "Insulin": "2-Hour Serum Insulin",
    "BMI": "Body Mass Index (BMI)",
    "DiabetesPedigreeFunction": "Genetic Pedigree Score",
    "Age": "Patient Age",
    
    # Heart
    "age": "Patient Age",
    "sex": "Biological Sex",
    "cp": "Chest Pain Severity",
    "trestbps": "Resting Blood Pressure",
    "chol": "Serum Cholesterol",
    "fbs": "Fasting Blood Sugar",
    "restecg": "Resting ECG Results",
    "thalach": "Maximum Heart Rate Achieved",
    "exang": "Exercise Induced Angina",
    "oldpeak": "ST Depression (Exercise)",
    "slope": "Peak ST Segment Slope",
    "ca": "Major Fluoroscopy Vessels",
    "thal": "Thalassemia Indicator",
    
    # Kidney
    "bp": "Blood Pressure",
    "sg": "Urine Specific Gravity",
    "al": "Albumin Proteinuria",
    "su": "Urine Glucose / Sugar",
    "rbc": "Red Blood Cell Count",
    "pc": "Pus Cells",
    "pcc": "Pus Cell Clumps",
    "ba": "Bacteria Level",
    "bgr": "Blood Glucose Random",
    "bu": "Blood Urea Level",
    "sc": "Serum Creatinine Level",
    "sod": "Serum Sodium",
    "pot": "Serum Potassium",
    "hemo": "Hemoglobin Concentration",
    "pcv": "Packed Cell Volume (Hematocrit)",
    "wc": "White Blood Cell Count",
    "rc": "Red Blood Cell Count",
    "htn": "Hypertension History",
    "dm": "Diabetes Mellitus History",
    "cad": "Coronary Artery Disease",
    "appet": "Appetite Status",
    "pe": "Pedal Edema",
    "ane": "Anemia Diagnosis"
}

def explain_prediction(
    classifier,
    transformed_input: np.ndarray,
    feature_names: List[str],
    user_inputs: Dict[str, Any],
    background_sample: np.ndarray = None,
    top_n: int = 5
) -> List[Dict[str, Any]]:
    """
    Computes local SHAP attributions for an individual patient instance.
    Falls back gracefully to perturbation-based / coefficient feature contributions
    if tree structure is non-standard.
    """
    factors = []
    
    try:
        # Check if model has TreeExplainer support and shap is available
        if HAS_SHAP and (hasattr(classifier, "estimators_") or hasattr(classifier, "tree_")):
            explainer = shap.TreeExplainer(classifier)
            shap_values = explainer.shap_values(transformed_input)
            
            # Binary classification handling: get class 1 (disease present) attributions
            if isinstance(shap_values, list):
                vals = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
            elif isinstance(shap_values, np.ndarray) and len(shap_values.shape) == 3:
                vals = shap_values[0, :, 1]
            else:
                vals = shap_values[0]
        elif hasattr(classifier, "coef_"):
            # Linear model coefficients multiplied by normalized feature deviation
            vals = (classifier.coef_[0] * transformed_input[0])
        else:
            # Fallback perturbation based on standardized input deviation
            vals = transformed_input[0] if transformed_input.ndim == 2 else transformed_input
            
    except Exception:
        # Fallback to feature importances, coefficients, or input deviation
        if hasattr(classifier, "feature_importances_"):
            vals = classifier.feature_importances_ * transformed_input[0]
        elif hasattr(classifier, "coef_"):
            vals = classifier.coef_[0] * transformed_input[0]
        else:
            vals = transformed_input[0] if transformed_input.ndim == 2 else transformed_input

    if np.all(np.abs(vals) < 1e-6):
        vals = transformed_input[0] if transformed_input.ndim == 2 else transformed_input

    # Map values to feature names
    limit = min(len(feature_names), len(vals))
    scored = []
    for i in range(limit):
        f_name = feature_names[i]
        impact = float(vals[i])
        base_feat = f_name.split("_")[0] if "_" in f_name else f_name
        if f_name in CLINICAL_NAMES:
            clean_name = CLINICAL_NAMES[f_name]
        elif base_feat in CLINICAL_NAMES:
            category_val = f_name[len(base_feat)+1:].replace(".0", "").title()
            clean_name = f"{CLINICAL_NAMES[base_feat]} ({category_val})"
        else:
            clean_name = f_name.replace("_", " ").title()

        raw_val = user_inputs.get(f_name, user_inputs.get(base_feat, "N/A"))
        
        direction = "increases_risk" if impact > 0 else "decreases_risk"
        scored.append({
            "feature": f_name,
            "display_name": clean_name,
            "impact": round(impact, 4),
            "direction": direction,
            "user_value": raw_val
        })

    # Sort by absolute impact magnitude
    scored.sort(key=lambda x: abs(x["impact"]), reverse=True)
    return scored[:top_n]
