import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple, List
from .shap_explainer import explain_prediction

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models")

class ModelRegistry:
    _instance = None
    
    def __init__(self):
        self.pipelines = {}
        self.features = {}
        self.backgrounds = {}
        self.load_all_models()
        
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelRegistry()
        return cls._instance

    def load_all_models(self):
        diseases = ["diabetes", "heart", "kidney"]
        for d in diseases:
            pipe_path = os.path.join(SAVED_MODELS_DIR, f"{d}_pipeline.joblib")
            feat_path = os.path.join(SAVED_MODELS_DIR, f"{d}_features.joblib")
            bg_path = os.path.join(SAVED_MODELS_DIR, f"{d}_shap_background.joblib")
            
            if os.path.exists(pipe_path):
                self.pipelines[d] = joblib.load(pipe_path)
            if os.path.exists(feat_path):
                self.features[d] = joblib.load(feat_path)
            if os.path.exists(bg_path):
                self.backgrounds[d] = joblib.load(bg_path)

    def predict_disease(self, disease: str, input_dict: Dict[str, Any]) -> Tuple[float, str, List[Dict[str, Any]], str]:
        """
        Executes prediction and SHAP explanation.
        Returns: (risk_probability, risk_category, top_factors, model_version)
        """
        if disease not in self.pipelines:
            # Re-attempt loading in case models were trained after boot
            self.load_all_models()
            if disease not in self.pipelines:
                raise ValueError(f"Model pipeline for '{disease}' not found in {SAVED_MODELS_DIR}")

        pipe = self.pipelines[disease]
        feature_order = self.features.get(disease, list(input_dict.keys()))
        
        # Prepare single-row DataFrame
        df_input = pd.DataFrame([input_dict])
        # Ensure only expected features and correct ordering
        df_input = df_input[[c for c in feature_order if c in df_input.columns]]

        # Compute probability
        proba = float(pipe.predict_proba(df_input)[0, 1])
        
        # Categorize risk
        if proba < 0.35:
            category = "Low"
        elif proba < 0.65:
            category = "Moderate"
        else:
            category = "High"

        # Transform inputs for SHAP
        preprocessor = pipe.named_steps["preprocessor"]
        classifier = pipe.named_steps["classifier"]
        transformed = preprocessor.transform(df_input)

        # Get explanation
        engineered_feats_path = os.path.join(SAVED_MODELS_DIR, f"{disease}_engineered_features.joblib")
        if os.path.exists(engineered_feats_path):
            expl_features = joblib.load(engineered_feats_path)
        else:
            expl_features = feature_order

        bg = self.backgrounds.get(disease)
        factors = explain_prediction(
            classifier=classifier,
            transformed_input=transformed,
            feature_names=expl_features,
            user_inputs=input_dict,
            background_sample=bg,
            top_n=5
        )

        return proba, category, factors, "2.0.0"

model_registry = ModelRegistry.get_instance()
