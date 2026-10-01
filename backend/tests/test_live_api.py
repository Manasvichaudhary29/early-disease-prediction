import urllib.request
import urllib.parse
import json

def post(url, data=None, json_data=None, headers=None):
    if headers is None:
        headers = {}
    if json_data is not None:
        body = json.dumps(json_data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    elif data is not None:
        body = urllib.parse.urlencode(data).encode("utf-8")
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    else:
        body = None
    req = urllib.request.Request(url, data=body, headers=headers)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

auth = post("http://127.0.0.1:8000/api/auth/login", data={"username": "demo@pulsepredict.ai", "password": "demo1234"})
token = auth["access_token"]
headers = {"Authorization": f"Bearer {token}"}

presets_heart = {
    "Healthy": {"age": 38, "sex": 0, "cp": 2, "trestbps": 115.0, "chol": 185.0, "fbs": 0, "restecg": 0, "thalach": 172.0, "exang": 0, "oldpeak": 0.2, "slope": 0, "ca": 0, "thal": 1},
    "Default (56yo, 130BP, 236Chol)": {"age": 56, "sex": 1, "cp": 1, "trestbps": 130.0, "chol": 236.0, "fbs": 0, "restecg": 1, "thalach": 160.0, "exang": 0, "oldpeak": 1.0, "slope": 1, "ca": 0, "thal": 2},
    "Moderate": {"age": 54, "sex": 1, "cp": 1, "trestbps": 134.0, "chol": 238.0, "fbs": 0, "restecg": 1, "thalach": 152.0, "exang": 0, "oldpeak": 1.0, "slope": 1, "ca": 0, "thal": 2},
    "High Risk": {"age": 63, "sex": 1, "cp": 0, "trestbps": 165.0, "chol": 295.0, "fbs": 1, "restecg": 2, "thalach": 122.0, "exang": 1, "oldpeak": 2.8, "slope": 2, "ca": 2, "thal": 3}
}

print("=== HEART API TEST ===")
for name, d in presets_heart.items():
    res = post("http://127.0.0.1:8000/api/predict/heart", json_data=d, headers=headers)
    print(f"{name:32s} -> {res['risk_percentage']}% [{res['risk_category']}]")

print("\n=== DIABETES API TEST ===")
diab = {
    "Healthy": {"Pregnancies": 1, "Glucose": 92.0, "BloodPressure": 70.0, "SkinThickness": 18.0, "Insulin": 65.0, "BMI": 22.4, "DiabetesPedigreeFunction": 0.21, "Age": 26},
    "Borderline": {"Pregnancies": 3, "Glucose": 130.0, "BloodPressure": 80.0, "SkinThickness": 26.0, "Insulin": 120.0, "BMI": 29.8, "DiabetesPedigreeFunction": 0.45, "Age": 42},
    "High": {"Pregnancies": 6, "Glucose": 178.0, "BloodPressure": 90.0, "SkinThickness": 35.0, "Insulin": 210.0, "BMI": 38.5, "DiabetesPedigreeFunction": 1.15, "Age": 52}
}
for name, d in diab.items():
    res = post("http://127.0.0.1:8000/api/predict/diabetes", json_data=d, headers=headers)
    print(f"{name:32s} -> {res['risk_percentage']}% [{res['risk_category']}]")

print("\n=== KIDNEY API TEST ===")
kid = {
    "Healthy": {"age": 32, "bp": 70.0, "sg": 1.025, "al": 0, "su": 0, "rbc": "normal", "pc": "normal", "pcc": "notpresent", "ba": "notpresent", "bgr": 95.0, "bu": 24.0, "sc": 0.8, "sod": 142.0, "pot": 4.1, "hemo": 16.0, "pcv": 48.0, "wc": 6400.0, "rc": 5.4, "htn": "no", "dm": "no", "cad": "no", "appet": "good", "pe": "no", "ane": "no"},
    "Mild": {"age": 55, "bp": 80.0, "sg": 1.015, "al": 1, "su": 0, "rbc": "normal", "pc": "normal", "pcc": "notpresent", "ba": "notpresent", "bgr": 125.0, "bu": 44.0, "sc": 1.4, "sod": 137.0, "pot": 4.4, "hemo": 13.5, "pcv": 39.0, "wc": 8200.0, "rc": 4.6, "htn": "yes", "dm": "no", "cad": "no", "appet": "good", "pe": "no", "ane": "no"},
    "Severe": {"age": 64, "bp": 90.0, "sg": 1.010, "al": 3, "su": 2, "rbc": "abnormal", "pc": "abnormal", "pcc": "present", "ba": "notpresent", "bgr": 210.0, "bu": 92.0, "sc": 3.6, "sod": 130.0, "pot": 5.2, "hemo": 9.2, "pcv": 28.0, "wc": 11400.0, "rc": 3.2, "htn": "yes", "dm": "yes", "cad": "yes", "appet": "poor", "pe": "yes", "ane": "yes"}
}
for name, d in kid.items():
    res = post("http://127.0.0.1:8000/api/predict/kidney", json_data=d, headers=headers)
    print(f"{name:32s} -> {res['risk_percentage']}% [{res['risk_category']}]")
