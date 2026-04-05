from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import google.generativeai as genai

app = Flask(__name__)
CORS(app) # مهم جداً عشان الإكستنشن يقدر يكلم السيرفر

# --- إعداد المفاتيح (حط مفاتيحك هنا) ---
SIGHTENGINE_USER = 'YOUR_USER_ID'
SIGHTENGINE_SECRET = 'YOUR_API_SECRET'
HF_TOKEN = 'YOUR_HUGGING_FACE_TOKEN'
genai.configure(api_key="YOUR_GEMINI_KEY")

# --- 1. دالة فحص الأمان ---
def check_image_safety(image_url):
    params = {
        'models': 'nudity,wad,offensive',
        'api_user': SIGHTENGINE_USER,
        'api_secret': SIGHTENGINE_SECRET,
        'url': image_url
    }
    r = requests.get('https://api.sightengine.com/1.0/check.json', params=params)
    output = r.json()
    # لو الصورة آمنة بيرجع True
    return output.get('status') == 'success' and output.get('nudity', {}).get('safe', 0) > 0.5

# --- 2. دالة كشف التزييف من Hugging Face ---
def get_deepfake_score(image_url):
    API_URL = "https://api-inference.huggingface.co/models/umm-maybe/Deepfake-Detector"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(API_URL, headers=headers, json={"inputs": image_url})
    return response.json()

# --- 3. دالة كتابة التقرير بـ Gemini ---
def generate_final_report(safety_status, tech_score):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    بصفتك خبير في كشف التزييف العميق، حلل النتيجة دي واكتب تقرير قصير بالعربي:
    - حالة الأمان: {safety_status}
    - نتيجة الموديل التقني: {tech_score}
    ركز على تحذير المستخدم لو النسبة عالية.
    """
    response = model.generate_content(prompt)
    return response.text

# --- المسار الرئيسي اللي الإكستنشن هيكلمه ---
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    image_url = data.get('url')
    
    if not image_url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        # المحطة 1: الأمان
        if not check_image_safety(image_url):
            return jsonify({"report": "⚠️ تنبيه: هذه الصورة تحتوي على محتوى غير لائق وتم حجبها."}), 200
        
        # المحطة 2: كشف التزييف
        score = get_deepfake_score(image_url)
        
        # المحطة 3: صياغة التقرير بـ Gemini
        report = generate_final_report("Safe", score)
        
        return jsonify({"report": report})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)