import React from "react";
import image1 from "../assets/images/home-background.svg";
import "../styles/home.css";

function PublicHome() {
    return (
        <div className="home">
            <main className="main-content">
                <img className="image" alt="Home Background" src={image1} />
                <div className="view">
                    <div className="text-wrapper-8">Co.worker 기능 둘러보기</div>
                </div>
                <div className="card-frame">
                    <div className="card">
                        <div className="rectangle"></div>
                        <div className="text-wrapper">지원사업 전체보기</div>
                        <div className="description">해당 기능에 대한 간단한 설명입니다.</div>
                    </div>
                    <div className="card">
                        <div className="rectangle"></div>
                        <div className="text-wrapper">추천사업 보기</div>
                        <div className="description">해당 기능에 대한 간단한 설명입니다.</div>
                    </div>
                    <div className="card">
                        <div className="rectangle"></div>
                        <div className="text-wrapper">대시보드</div>
                        <div className="description">해당 기능에 대한 간단한 설명입니다.</div>
                    </div>
                    <div className="card">
                        <div className="rectangle"></div>
                        <div className="text-wrapper">재무분석</div>
                        <div className="description">해당 기능에 대한 간단한 설명입니다.</div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PublicHome;
