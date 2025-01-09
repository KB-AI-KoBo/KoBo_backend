import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';
import '../styles/signup.css';
import '../styles/styleguide.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        companyName: '',
        industry: '',
        companySize: '',
        registrationNumber: '',
        companyEmail: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSignup = async () => {
        try {
            const response = await fetch('http://localhost:5050/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('회원가입이 완료되었습니다!');
                navigate('/login'); // 회원가입 성공 후 로그인 페이지로 이동
            } else {
                alert('회원가입 실패: ' + response.statusText);
            }
        } catch (error) {
            console.error('에러 발생:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="signup">
            <div className="signup-container">
                <div className="signup-header">
                    <div className="signup-heading-kobo">Co.worker</div>
                    <div className="signup-heading">회원가입</div>
                </div>

                <div className="signup-content">
                    <div className="signup-section">
                        <div className="signup-background">
                            <div className="signup-title">사용자 정보</div>
                            <div className="signup-input-group">
                                <label className="signup-label">아이디</label>
                                <input type="text" id="email" value={formData.email} onChange={handleChange} className="signup-input" placeholder="아이디" />
                            </div>
                            <div className="signup-input-group">
                                <label className="signup-label">비밀번호</label>
                                <input type="password" id="password" value={formData.password} onChange={handleChange} className="signup-input" placeholder="비밀번호" />
                            </div>
                            <div className="signup-input-group">
                                <label className="signup-label">이름</label>
                                <input type="text" id="username" value={formData.username} onChange={handleChange} className="signup-input" placeholder="이름" />
                            </div>
                            <div className="signup-input-group">
                                <label className="signup-label">이메일 주소</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} className="signup-input" placeholder="이메일 주소" />
                            </div>
                        </div>
                    </div>

                    <div className="signup-section">
                        <div className="signup-background">
                            <div className="signup-title">회사 정보</div>
                            <div className="signup-input-group">
                                <label className="signup-label">회사 이름</label>
                                <input type="text" id="companyName" value={formData.companyName} onChange={handleChange} className="signup-input" placeholder="회사 이름" />
                            </div>
                            <div className="signup-input-group">
                                <label className="signup-label">산업 분야</label>
                                <input type="text" id="industry" value={formData.industry} onChange={handleChange} className="signup-input" placeholder="산업 분야" />
                            </div>
                            <div className="signup-input-group">
                                <label className="signup-label">회사 구분</label>
                                <select id="companySize" value={formData.companySize} onChange={handleChange} className="signup-select">
                                    <option>회사 구분을 선택하세요</option>
                                    <option>대기업</option>
                                    <option>중견기업</option>
                                    <option>중소기업</option>
                                </select>
                            </div>
                            <div className="signup-input-group">
                                <label className="signup-label">사업자 번호</label>
                                <input type="text" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="signup-input" placeholder="사업자 번호" />
                            </div>
                            <div className="signup-input-group">
                                <label className="signup-label">회사 이메일</label>
                                <input type="email" id="companyEmail" value={formData.companyEmail} onChange={handleChange} className="signup-input" placeholder="회사 이메일" />
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={handleSignup} className="signup-button">회원가입</button>
            </div>
        </div>
    );
};

export default Signup;
