/** @jsxImportSource @emotion/react */
import React from 'react'
import Typography from '@mui/material/Typography';
import { css } from '@emotion/react'
export default function Footer() {
    const copyrightStyle = css`
    font-size: 12px;
    color: #666;
    margin-bottom: 3px;
    margin-top: 15px;
    margin-left: 15px;
    margin-right: 15px;
    text-align: center;

    a {
        color: #666;
        text-decoration: underline;
        &:hover {
        color: #b249f8;
        }
    }
    `;
    return (
        <>
            <p css={copyrightStyle}>
                © 2024 Scoring Classroom v0.4 All Rights Reserved. made with by{' '}
                <a href="http://github.com/OSP101" target="_blank" rel="noopener noreferrer">
                    <Typography variant="caption" gutterBottom>
                        OSP101
                    </Typography></a></p>
        </>
    )
}
