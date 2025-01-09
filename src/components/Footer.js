import React from "react";

const Footer = () => {
    const styles = {
        footer: {
            backgroundColor: "#6c757d",
            padding: "40px 20px",
            color: "#ffffff",
            fontFamily: "'Noto Sans KR', sans-serif",
        },
        footerContent: {
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            maxWidth: "1280px",
            margin: "0 auto",
            gap: "20px",
        },
        footerSection: {
            flex: 1,
            minWidth: "200px",
        },
        footerSectionTitle: {
            fontSize: "18px",
            fontWeight: 500,
            marginBottom: "10px",
        },
        footerSectionText: {
            fontSize: "14px",
            lineHeight: 1.5,
        },
        footerBottom: {
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
        },
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.footerContent}>
                <div style={styles.footerSection}>
                    <h3 style={styles.footerSectionTitle}>About</h3>
                </div>
                <div style={styles.footerSection}>
                    <h3 style={styles.footerSectionTitle}>Service</h3>
                    <p style={styles.footerSectionText}>
                        프로젝트 등록<br />
                        프로젝트 찾기<br />
                        파트너 등록
                    </p>
                </div>
                <div style={styles.footerSection}>
                    <h3 style={styles.footerSectionTitle}>Support</h3>
                    <p style={styles.footerSectionText}>
                        서비스 이용약관<br />
                        개인정보처리방침<br />
                        FAQ
                    </p>
                </div>
            </div>
            <div style={styles.footerBottom}>
                <p>1:1 문의 | 카카오톡 연결 | 오픈 챗 코드2580</p>
                <p>Copyright ⓒ 2024 Co.worker. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
