"use client";

import React from "react";

export default function Home() {
  return (
    <div className="card-body" style={{ backgroundColor: "#EEEEEE" }}>
      
      <div
        className="Sign-in form"
        style={{
          position: "absolute",
          right: "50%",
          transform: "translate(50%, -50%)", // Fixed transform property
          top: "50%",
          width: "627px",
          height: "551px",
          backgroundColor: "#E8E8E8",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div
          className="Sign-in Title back frame"
          style={{
            position: "absolute",
            left: "32px",
            top: "32px",
            paddingTop: "40px",
            paddingBottom: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }} 
        >
          <h1
            className="text-3xl font-bold"
            style={{
              margin: "auto 0"
            }}
          >
            Sign In
          </h1>
        </div>

        <div
          className="Username/Email back frame"
          style={{
            position: "absolute",
            left: "32px",
            top: "140px",
            paddingTop: "0px",
            paddingBottom: "0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "left"
          }} 
        >
          <h4
            className="text-3xl font-bold"
            style={{
              margin: "auto 0",
              fontSize: "1.125rem", // 18px
              lineHeight: "1.75rem" // 28px
            }}
          >
            Username / Email
          </h4>
          
          <input
            type="text"
            placeholder="Username or email"
            style={{
              width: "563px",
              height: "52px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              border: "1px solid #C4C4C4",
              marginTop: "10px",
              marginBottom: "10px",
              paddingLeft: "10px"
              
            }}
          />
        </div>

        <div
          className="Password back frame"
          style={{
            position: "absolute",
            left: "32px",
            top: "240px",
            paddingTop: "0px",
            paddingBottom: "0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "left"
          }} 
        >
          <h1
            className="text-3xl font-bold"
            style={{
              margin: "auto 0",
              fontSize: "1.125rem", // 18px
              lineHeight: "1.75rem" // 28px
            }}
          >
            Password
          </h1>
          
          <input
            type="text"
            placeholder="Password"
            style={{
              width: "563px",
              height: "52px",
              backgroundColor: "#F8F8F8",
              borderRadius: "5px",
              border: "1px solid #C4C4C4",
              marginTop: "10px",
              marginBottom: "10px",
              paddingLeft: "10px"
              
            }}
          />

          <a
            href="/forgot-password"
            style={{
              color: "#2F80ED",
              textDecoration: "none",
              marginTop: "10px",
              marginBottom: "10px"
            }}
          >
            Forgot password?
          </a>
        </div>
        
        <div
          className="Login button back frame"
          style={{
            position: "absolute",
            left: "32px",
            top: "376px",
            paddingTop: "24px",
            paddingBottom: "0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "left"
          }} 
        >
          <button
            style={{
              width: "563px",
              height: "48px",
              backgroundColor: "#7ECDD2",
              borderRadius: "5px",
              border: "0px",
              color: "#084D49",
              marginTop: "10px",
              marginBottom: "10px",
              fontWeight: "bold"
            }}
          >
            Login
          </button>
        </div>
        
        <div
          className="Sign-up button back frame"
          style={{
            position: "absolute",
            left: "32px",
            top: "456px",
            paddingTop: "15px",
            paddingBottom: "0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "left"
          }} 
        >
          <button
            style={{
              width: "563px",
              height: "48px",
              backgroundColor: "#EEEEEE",
              borderRadius: "5px",
              border: "0px",
              color: "#333C4D",
              marginTop: "10px",
              marginBottom: "10px",
              fontWeight: "bold"
            }}
          >
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
}