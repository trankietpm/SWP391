'use client'
import React from 'react';
import { Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from './Welcome.module.scss';

function Welcome() {

  return (
    <section className={styles.welcome}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <h2 className={styles.title}>
              Chào mừng đến với EVS Rent
            </h2>
            <p className={styles.description}>
              Khám phá thành phố một cách thân thiện với môi trường cùng dịch vụ cho thuê xe điện hàng đầu. 
              Chúng tôi cung cấp xe máy điện và ô tô điện chất lượng cao, an toàn và tiết kiệm chi phí 
              cho mọi nhu cầu di chuyển của bạn.
            </p>
            <Link href="/about">
              <Button 
                type="primary" 
                size="large"
                icon={<InfoCircleOutlined />}
                className={styles.scheduleButton}
              >
                Xem thêm
              </Button>
            </Link>
          </div>
          
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img 
                src="/images/welcome-image.jpg" 
                alt="EVS Rent - Xe điện thân thiện môi trường"
                className={styles.welcomeImage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
