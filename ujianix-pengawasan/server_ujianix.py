import os
import json
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import re

app = Flask(__name__)
# Batasi ukuran unggahan maksimal 5 MB
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 
UPLOAD_FOLDER = 'data_pengawasan'
JAWABAN_FOLDER = 'data_jawaban'
# Validasi ekstensi file untuk keamanan
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(JAWABAN_FOLDER, exist_ok=True)

# Konfigurasi Log Server
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def valid_npm(npm):
    return bool(re.match(r'^[0-9]+$', npm))

@app.route('/api/pengawasan', methods=['POST'])
def terima_pengawasan():
    if 'file' not in request.files:
        logging.error("Request tanpa file ditolak.")
        return jsonify({'error': 'File tidak ditemukan'}), 400
    
    file = request.files['file']
    npm = request.form.get('npm', '')
    sesi = request.form.get('sesi', 'Sesi_Default')
    
    if not valid_npm(npm):
        logging.error(f"NPM tidak valid ditolak: {npm}")
        return jsonify({'error': 'NPM tidak valid'}), 400
        
    if file.filename == '' or not allowed_file(file.filename):
        logging.error(f"File ditolak dari NPM {npm}: Ekstensi tidak diizinkan.")
        return jsonify({'error': 'File tidak diizinkan'}), 400
        
    filename = secure_filename(file.filename)
    user_folder = os.path.join(UPLOAD_FOLDER, sesi, npm)
    os.makedirs(user_folder, exist_ok=True)
    
    save_path = os.path.join(user_folder, filename)
    file.save(save_path)
    logging.info(f"Berhasil: Gambar pengawasan disimpan di {save_path}")
    return jsonify({'status': 'sukses'}), 200

@app.route('/api/jawaban', methods=['POST'])
def terima_jawaban():
    if not request.is_json:
        return jsonify({'error': 'Format bukan JSON'}), 400
        
    data = request.json
    npm = data.get('npm', '')
    sesi = data.get('sesi', 'Sesi_Default')
    
    if not valid_npm(npm):
        return jsonify({'error': 'NPM tidak valid'}), 400
        
    data['waktu_terima'] = datetime.now().isoformat()
    
    sesi_folder = os.path.join(JAWABAN_FOLDER, sesi)
    os.makedirs(sesi_folder, exist_ok=True)
    
    file_path = os.path.join(sesi_folder, f"jawaban_{npm}.json")
    
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)
        
    logging.info(f"Berhasil: Jawaban JSON disimpan untuk NPM {npm} (Sesi {sesi})")
    return jsonify({'status': 'jawaban tersimpan'}), 200

if __name__ == '__main__':
    logging.info("Menjalankan Server Ujianix (Mode Prototipe)")
    app.run(host='0.0.0.0', port=5000)
