import os
import json
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'data_pengawasan'
JAWABAN_FOLDER = 'data_jawaban'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(JAWABAN_FOLDER, exist_ok=True)

@app.route('/api/pengawasan', methods=['POST'])
def terima_pengawasan():
    if 'file' not in request.files:
        return jsonify({'error': 'File tidak ditemukan'}), 400
    file = request.files['file']
    npm = request.form.get('npm', 'anonim')
    if file and file.filename != '':
        filename = secure_filename(file.filename)
        user_folder = os.path.join(UPLOAD_FOLDER, npm)
        os.makedirs(user_folder, exist_ok=True)
        file.save(os.path.join(user_folder, filename))
        return jsonify({'status': 'sukses'}), 200
    return jsonify({'error': 'Gagal menyimpan'}), 500

@app.route('/api/jawaban', methods=['POST'])
def terima_jawaban():
    # Menerima jawaban agar tidak disimpan di perangkat lokal peserta
    data = request.json
    npm = data.get('npm', 'anonim')
    with open(os.path.join(JAWABAN_FOLDER, f"jawaban_{npm}.json"), 'w') as f:
        json.dump(data, f)
    return jsonify({'status': 'jawaban tersimpan'}), 200

if __name__ == '__main__':
    # Host 0.0.0.0 memungkinkan akses jaringan hybrid (online/offline)
    app.run(host='0.0.0.0', port=5000)
