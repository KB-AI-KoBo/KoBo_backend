from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from langchain.chat_models import ChatOpenAI
import requests
from build_vector_db import pdf_to_vector_db, public_to_vector_db
from ExtractLink import ExtractLink
from workflow import run_workflow, extract_final_response
import time
from flask_cors import CORS
from ratelimit import limits, sleep_and_retry

# Flask 앱 초기화
app = Flask(__name__)
CORS(app)

# 환경 변수 로드
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OpenAI API key not found in environment variables")

BACKEND_URL = "http://localhost:5050"

# 벡터 데이터베이스 초기화
supporting_db = public_to_vector_db()

# LLM 초기화
llm = ChatOpenAI(temperature=0.5, model='gpt-4', openai_api_key=openai_api_key)


# @sleep_and_retry
# @limits(calls=5, period=60)
@app.route('http://localhost:8080')
def process_request():
    try:
        # 외부 API로부터 JSON 데이터 가져오기
        submit_response = requests.get(f'{BACKEND_URL}/api/questions/submit', timeout = 10)
        submit_response.raise_for_status()  # HTTP 에러 발생 시 예외 발생
        submit = submit_response.json()

        query = submit.get('content')
        if not query:
            return jsonify({"error": "Invalid request: 'query' is required"}), 400

        print("질문 받아오기 성공")
        documentId = submit.get('documentId')

        pdf_path = None
        pdf_db = None

        # 사용자 문서가 있을 때
        if documentId:
            document_response = requests.get(f'{BACKEND_URL}/api/documents/{documentId}', timeout = 10)
            document_response.raise_for_status()
            document = document_response.json()
            pdf_path = document.get('document')
            print("사용자 문서 받아오기 성공")

            # PDF를 벡터 데이터베이스로 변환
            pdf_db = pdf_to_vector_db(pdf_path)
            print("PDF converted to vector database")
        else:
            print("사용자 문서가 없는 질문입니다.")

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
        response = requests.post(f'{BACKEND_URL}/analysis/result', json=analysis_result)
        response.raise_for_status()

        response = requests.post(f'{BACKEND_URL}/support-programs', json=extracted_data)
        response.raise_for_status()

        return jsonify({"status": "success"}), 200

    except requests.RequestException as e:
        print(f"Error in API request: {e}")
        return jsonify({"error": "Error in API request", "details": str(e)}), 500
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


def main():
    with app.app_context():  # Flask 애플리케이션 컨텍스트 설정
        while True:
            try:
                process_request()
            except Exception as e:
                print(f"Error in main loop: {e}")
            time.sleep(10)  # 10초 간격으로 재시도


if __name__ == "__main__":
    main()
