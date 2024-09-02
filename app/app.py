from flask import Flask, request, jsonify, render_template, send_from_directory
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import os
from langchain.chat_models import ChatOpenAI
import requests
from build_vector_db import pdf_to_vector_db, public_to_vector_db
from ExtractLink import ExtractLink
from workflow import run_workflow, extract_final_response
import tempfile
import base64
import time
from flask_cors import CORS
import jwt
from functools import wraps


# 환경 변수 로드
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OpenAI API key not found in environment variables")

BACKEND_URL = "http://localhost:5050"

# 벡터 데이터베이스 초기화
supporting_db = public_to_vector_db()

# Flask 애플리케이션 설정
app = Flask(__name__)
CORS(app)  # CORS 설정

# LLM 초기화
llm = ChatOpenAI(temperature=0.5, model='gpt-4o', openai_api_key=openai_api_key)

# AI 서비스 요청 처리 엔드포인트
@app.route('/', methods=['POST','GET'])
def process_request():

    # 외부 API로부터 JSON 데이터 가져오기
    submit_response = requests.get(f'{BACKEND_URL}/api/questions/submit')
    # 외부 API 응답에서 JSON 데이터 추출
    submit = submit_response.json()

    query = submit.get('content')
    documentId = submit.get('documentId')
    document_response = request.get(f'{BACKEND_URL}/api/documents/{documentId}')
    document = document_response.json()

    pdf_path = document.get('document')

    if not query or not pdf_path:
        return jsonify({"error": "Invalid request: 'query' and 'pdfPath' are required"}), 400

    try:
        # PDF를 벡터 데이터베이스로 변환
        pdf_db = pdf_to_vector_db(pdf_path)
        print("PDF converted to vector database")

        # 워크플로우 실행
        result = run_workflow(query, pdf_path, openai_api_key, pdf_db, supporting_db, llm)
        print("Workflow executed")

        # 최종 응답 추출
        answer = extract_final_response(result)
        print(f"Extracted answer: {answer}")

        # 데이터 추출
        extracted_data = ExtractLink(answer, llm)
        print(f"Extracted data: {extracted_data}")

        # 결과를 Java 백엔드로 반환
        analysis_result = {
		        "documentId": documentId,
		        "questionContent": query,
		        "result": result
		    }
        request.post(f'{BACKEND_URL}/analysis/result',json = analysis_result)
        request.post(f'{BACKEND_URL}/support-programs',json = extracted_data)

        return jsonify({"status": "success"}), 200
    
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

# 메인 실행 부분
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5050)
