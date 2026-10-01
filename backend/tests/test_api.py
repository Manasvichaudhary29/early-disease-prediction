import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"
import pytest
from fastapi.testclient import TestClient
try:
    from backend.app.main import app
except ModuleNotFoundError:
    from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "supported_diseases" in data

def test_model_metrics():
    response = client.get("/api/models/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "diabetes" in data
    assert "heart" in data
    assert "kidney" in data
    assert "best_algorithm" in data["heart"]

def test_auth_and_prediction_flow():
    # 1. Register a test patient
    test_email = "patient.test@example.com"
    reg_payload = {
        "email": test_email,
        "full_name": "Test Patient",
        "password": "SecurePassword123!"
    }
    reg_resp = client.post("/api/auth/register", json=reg_payload)
    # 201 or 400 if user exists from previous test
    assert reg_resp.status_code in [201, 400]

    # 2. Login
    login_resp = client.post("/api/auth/login-json", json={
        "email": test_email,
        "password": "SecurePassword123!"
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Test Diabetes Prediction
    diab_payload = {
        "Pregnancies": 2,
        "Glucose": 145.0,
        "BloodPressure": 80.0,
        "SkinThickness": 25.0,
        "Insulin": 120.0,
        "BMI": 32.5,
        "DiabetesPedigreeFunction": 0.45,
        "Age": 42
    }
    pred_diab = client.post("/api/predict/diabetes", json=diab_payload, headers=headers)
    assert pred_diab.status_code == 200
    d_data = pred_diab.json()
    assert d_data["disease_type"] == "diabetes"
    assert 0.0 <= d_data["risk_probability"] <= 1.0
    assert d_data["risk_category"] in ["Low", "Moderate", "High"]
    assert len(d_data["top_factors"]) > 0

    # 4. Test Heart Disease Prediction
    heart_payload = {
        "age": 58,
        "sex": 1,
        "cp": 2,
        "trestbps": 140.0,
        "chol": 240.0,
        "fbs": 0,
        "restecg": 1,
        "thalach": 155.0,
        "exang": 0,
        "oldpeak": 1.2,
        "slope": 1,
        "ca": 1,
        "thal": 2
    }
    pred_heart = client.post("/api/predict/heart", json=heart_payload, headers=headers)
    assert pred_heart.status_code == 200
    h_data = pred_heart.json()
    assert h_data["disease_type"] == "heart"
    assert 0.0 <= h_data["risk_probability"] <= 1.0

    # 5. Test Kidney Disease Prediction
    kidney_payload = {
        "age": 48,
        "bp": 80.0,
        "sg": 1.020,
        "al": 1,
        "su": 0,
        "rbc": "normal",
        "pc": "normal",
        "pcc": "notpresent",
        "ba": "notpresent",
        "bgr": 121.0,
        "bu": 36.0,
        "sc": 1.2,
        "sod": 138.0,
        "pot": 4.4,
        "hemo": 15.4,
        "pcv": 44.0,
        "wc": 7800.0,
        "rc": 5.2,
        "htn": "yes",
        "dm": "no",
        "cad": "no",
        "appet": "good",
        "pe": "no",
        "ane": "no"
    }
    pred_kidney = client.post("/api/predict/kidney", json=kidney_payload, headers=headers)
    assert pred_kidney.status_code == 200
    k_data = pred_kidney.json()
    assert k_data["disease_type"] == "kidney"
    assert 0.0 <= k_data["risk_probability"] <= 1.0

    # 6. Test History Retrieval
    hist_resp = client.get("/api/predict/history", headers=headers)
    assert hist_resp.status_code == 200
    history = hist_resp.json()
    assert len(history) >= 3
