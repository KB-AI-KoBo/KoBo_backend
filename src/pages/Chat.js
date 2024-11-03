import React, { useState, useRef, useEffect } from 'react';
import '../styles/chat.css';
import '../styles/styleguide.css';

// Base64 URL decoding
const base64UrlDecode = (base64Url) => {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return atob(base64);
};

// JWT 토큰 디코딩
const decodeJwtResponse = (token) => {
    let base64Payload = token.split('.')[1];
    let payload = base64UrlDecode(base64Payload);
    console.log('디코딩된 페이로드:', payload);
    return JSON.parse(payload);
};

// 토큰에서 이메일 추출
const extractEmailFromToken = (token) => {
    try {
        const decodedToken = decodeJwtResponse(token);
        return decodedToken.email || decodedToken.sub;
    } catch (error) {
        console.error('JWT 토큰 디코딩 중 오류 발생:', error);
        return null;
    }
};

export const Chat = () => {
    const [messageText, setMessageText] = useState('');
    const [attachedFile, setAttachedFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const messagesContainerRef = useRef(null);

    // 메시지 입력창 크기 자동 조절
    const handleInputChange = (event) => {
        setMessageText(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    // 파일 선택 처리
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAttachedFile(file);
            setMessageText((prev) => prev + `[파일: ${file.name}] `);
        }
    };

    // 메시지 영역 마지막으로 스크롤
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    // 토큰 만료 확인 및 새로고침
    const checkAndRefreshToken = async () => {
        const authToken = localStorage.getItem('jwtToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (authToken) {
            try {
                const decodedToken = decodeJwtResponse(authToken);
                const expirationTime = decodedToken.exp * 1000;
                const currentTime = Date.now();

                if (currentTime >= expirationTime && refreshToken) {
                    const response = await fetch('http://localhost:5080/auth/refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            refreshToken: refreshToken,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('jwtToken', data.jwtToken);
                        localStorage.setItem('refreshToken', data.refreshToken);
                        return data.jwtToken;
                    } else {
                        console.error('리프레시 토큰 요청 실패');
                        localStorage.removeItem('jwtToken');
                        localStorage.removeItem('refreshToken');
                    }
                }
            } catch (e) {
                console.error('토큰 디코딩 중 오류 발생:', e);
            }
        }
        return authToken;
    };

    // 파일 업로드 함수
    const uploadFile = async (file, authToken) => {
        if (!authToken) {
            console.error('토큰이 없습니다.');
            return null;
        }

        const email = extractEmailFromToken(authToken);
        if (!email) {
            console.error('이메일을 추출할 수 없습니다.');
            return null;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', email);

        try {
            const response = await fetch('http://localhost:5050/api/documents/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.documentId) {
                    return { documentId: data.documentId, filePath: data.filePath };
                } else {
                    console.error('Response data does not contain documentId');
                    return null;
                }
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to upload file: ${response.status} ${response.statusText}. ${errorText}`);
            }
        } catch (error) {
            console.error('파일 업로드 중 오류 발생:', error);
            return null;
        }
    };

    // 질문 제출 함수
    const submitQuestion = async (questionContent, authToken, documentId = null) => {
        if (!authToken) {
            console.error('토큰이 없습니다.');
            return null;
        }

        const email = extractEmailFromToken(authToken);
        if (!email) {
            console.error('이메일을 추출할 수 없습니다.');
            return null;
        }

        try {
            const requestBody = new URLSearchParams({
                email: email,
                content: questionContent,
                documentId: documentId || '',
            }).toString();

            const response = await fetch('http://localhost:5050/api/questions/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: requestBody,
            });

            if (response.ok) {
                const data = await response.json();
                return data.questionId;
            } else {
                const errorText = await response.text();
                console.error(`질문 제출 실패: ${response.status} ${response.statusText}. ${errorText}`);
            }
        } catch (error) {
            console.error('질문 제출 중 오류 발생:', error);
        }
        return null;
    };

    // 분석 요청 함수
    const submitAnalysisRequest = async (questionId, documentId = null) => {
        try {
            const formData = new FormData();
            formData.append('query', questionId);
            if (documentId) {
                formData.append('documentId', documentId);
            }

            const response = await fetch('http://localhost:5050/chat', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('분석 요청 실패:', response.statusText);
            }
        } catch (error) {
            console.error('분석 요청 중 오류 발생:', error);
        }
        return null;
    };

    // 메시지 전송 처리
    const handleSendMessage = async () => {
        if (messageText.trim() || attachedFile) {
            // 사용자 메시지 업데이트
            const userMessage = { type: 'user', content: messageText, file: attachedFile };
            setMessages((prev) => [...prev, userMessage]);
            setMessageText('');
            setAttachedFile(null);
            scrollToBottom();

            // "분석중..." 봇 메시지 표시
            const botMessage = { type: 'bot', content: '분석중...' };
            setMessages((prev) => [...prev, botMessage]);
            scrollToBottom();

            let analysisResponse = null;
            let questionId = null;
            let uploadResult = null;

            // 유효한 토큰 확인 및 재발급
            const validToken = await checkAndRefreshToken();

            try {
                if (attachedFile) {
                    uploadResult = await uploadFile(attachedFile, validToken);
                    if (uploadResult && uploadResult.documentId) {
                        questionId = await submitQuestion(messageText, validToken, uploadResult.documentId);
                    } else {
                        throw new Error('파일 업로드 실패');
                    }
                } else {
                    questionId = await submitQuestion(messageText, validToken);
                }

                if (questionId) {
                    analysisResponse = await submitAnalysisRequest(questionId, uploadResult?.documentId);
                }

                // "분석중..." 메시지 제거 및 봇 응답 추가
                setMessages((prev) => prev.slice(0, -1));
                if (analysisResponse) {
                    const botResponseMessage = { type: 'bot', content: analysisResponse.result };
                    setMessages((prev) => [...prev, botResponseMessage]);
                    scrollToBottom();
                }
            } catch (error) {
                console.error('메시지 전송 중 오류 발생:', error);
                setMessages((prev) => [...prev, { type: 'bot', content: '오류가 발생했습니다. 다시 시도해 주세요.' }]);
                scrollToBottom();
            }
        }
    };

    // Enter 키로 메시지 전송
    useEffect(() => {
        const handleEnterPress = (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
            }
        };

        document.addEventListener('keypress', handleEnterPress);
        return () => {
            document.removeEventListener('keypress', handleEnterPress);
        };
    }, [messageText, attachedFile]);

    return (
        <div className="container">
            <div className="messages-container" ref={messagesContainerRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.type}-message`}>
                        {message.content}
                        {message.file && (
                            <>
                                <br />
                                <a href={URL.createObjectURL(message.file)}
                                    download={message.file.name}
                                    className="file-link">
                                    {message.file.name}
                                </a>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <div className="input-container">
                    <label htmlFor="file-input" className="file-icon">
                        <i className="fi fi-rs-folder"></i>
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <input
                        type="text"
                        className="text-input"
                        placeholder="질문입력"
                        value={messageText}
                        onChange={handleInputChange}
                    />
                </div>
                <button className="send-button">
                    <i className="fi fi-rs-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default Chat;
