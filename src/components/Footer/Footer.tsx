import React from 'react';
import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>EVS Rent</h3>
            <p>Dịch vụ cho thuê xe máy điện và ô tô điện hàng đầu Việt Nam. Cam kết mang đến trải nghiệm di chuyển xanh, tiết kiệm và thân thiện với môi trường.</p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink}>Facebook</a>
              <a href="#" className={styles.socialLink}>Instagram</a>
              <a href="#" className={styles.socialLink}>Twitter</a>
            </div>
          </div>
          
          <div className={styles.section}>
            <h4>Dịch vụ</h4>
            <ul>
              <li><a href="#">Thuê xe máy điện</a></li>
              <li><a href="#">Thuê ô tô điện</a></li>
              <li><a href="#">Bảo dưỡng xe</a></li>
              <li><a href="#">Hỗ trợ 24/7</a></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Hướng dẫn sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>Liên hệ</h4>
            <div className={styles.contact}>
              <p>📞 1900 1234</p>
              <p>✉️ info@evsrent.com</p>
              <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; 2024 EVS Rent. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
