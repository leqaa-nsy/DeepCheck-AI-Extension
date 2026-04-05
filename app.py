from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import google.generativeai as genai

app = Flask(__name__)
CORS(app) 

# --- محطة الأمان: إعداد المفاتيح (هنا المستخدم بيحط بياناته الخاصة) ---
# يجب على كل مستخدم الحصول على مفاتيحه الخاصة من المواقع الرسمية
SIGHTENGINE_USER = 'YOUR_SIGHTENGINE_USER_ID'
SIGHTENGINE_SECRET = 'YOUR_SIGHTENGINE_API_SECRET'
HF_TOKEN = 'YOUR_HUGGING_FACE_TOKEN'
genai.configure(api_key="YOUR_GEMINI_API_KEY")

def check_image_safety(image_url):
    params = {
        'models': 'nudity,wad,offensive',
        'api_user': SIGHTENGINE_USER,
        'api_secret': SIGHTENGINE_SECRET,
        'url': image_url
    }
    try:
        r = requests.get('https://api.sightengine.com/1.0/check.json', params=params)
        output = r.json()
        return output.get('status') == 'success' and output.get('nudity', {}).get('safe', 0) > 0.5
    except:
        return False

def get_deepfake_score(image_url):
    API_URL = "https://api-inference.huggingface.co/models/umm-maybe/Deepfake-Detector"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(API_URL, headers=headers, json={"inputs": image_url})
    return response.json()

def generate_final_report(safety_status, tech_score):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"حلل النتيجة دي كخبير كشف تزييف واكتب تقرير قصير بالعربي للمستخدم: الأمان {safety_status} والنتيجة التقنية {tech_score}"
    response = model.generate_content(prompt)
    return response.text

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    image_url = data.get('url')
    
    if not image_url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        # 1. فحص الأمان
        if not check_image_safety(image_url):
            return jsonify({"report": "⚠️ تنبيه: الصورة قد تحتوي على محتوى غير لائق."})
        
        # 2. كشف التزييف
        score = get_deepfake_score(image_url)
        
        # 3. تقرير Gemini
        report = generate_final_report("Safe", score)
        
        return jsonify({"report": report})
    except Exception as e:
        return jsonify({"error": "تأكد من وضع مفاتيح الـ API الصحيحة في ملف app.py"})

if __name__ == '__main__':
    # تشغيل السيرفر على بورت 5000
    app.run(port=5000, debug=True)