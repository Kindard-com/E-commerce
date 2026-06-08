"use client";

import { useEffect } from 'react';

export function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="backdrop show" onClick={onClose} style={{ zIndex: 800 }}></div>
      <div className="size-guide-modal">
        <div className="modal-header">
          <span className="modal-title">Size Guide</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p className="size-desc">Kindard Kids streetwear features a signature oversized, drop-shoulder fit. We recommend buying their true age for the intended baggy look, or sizing down if you prefer a standard fit.</p>
          <div className="table-responsive">
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Age</th>
                  <th>Height (cm)</th>
                  <th>Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>XS</td><td>2-3 Yrs</td><td>92-98</td><td>12-14</td></tr>
                <tr><td>S</td><td>4-5 Yrs</td><td>104-110</td><td>15-18</td></tr>
                <tr><td>M</td><td>6-7 Yrs</td><td>116-122</td><td>19-23</td></tr>
                <tr><td>L</td><td>8-9 Yrs</td><td>128-134</td><td>24-28</td></tr>
                <tr><td>XL</td><td>10-11 Yrs</td><td>140-146</td><td>29-35</td></tr>
                <tr><td>XXL</td><td>12-13 Yrs</td><td>152-158</td><td>36-45</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="size-tips">
            <strong>How to measure:</strong>
            <p><strong>Height:</strong> Measure without shoes from head to toe.</p>
            <p><strong>Weight:</strong> Use as a secondary guide if the child is between height ranges.</p>
          </div>
        </div>
      </div>
    </>
  );
}
